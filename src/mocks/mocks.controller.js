import { generateUsers } from "./mockingUsers.js";
import { generatePets } from "./mockingPets.js";
import {
  usersService,
  petsService,
  adoptionsService,
} from "../services/index.js";

let userIds = [];
let petIds = [];

export const generatePets50 = async (req, res) => {
  const pets = await generatePets(50);
  if (!pets)
    return res
      .status(404)
      .send({ status: "error", error: "Mascotas no encontradas" });
  res.send({ status: "success", payload: pets });
};

export const generatePetsCant = async (req, res) => {
  const { cant } = Number(req.params);
  if (!cant)
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });

  const pets = await generatePets(cant);
  if (!pets)
    return res
      .status(404)
      .send({ status: "error", error: "Mascotas no encontradas" });
  res.send({ status: "success", payload: pets });
};

export const generateUsers50 = async (req, res) => {
  const users = await generateUsers(50);
  if (!users)
    return res
      .status(404)
      .send({ status: "error", error: "Usuarios no encontrados" });
  res.send({ status: "success", payload: users });
};

export const generateUsersCant = async (req, res) => {
  const { cant } = Number(req.params);
  if (!cant)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });

  const users = await generateUsers(cant);
  if (!users)
    return res
      .status(404)
      .send({ status: "error", error: "Usuarios no encontrados" });
  res.send({ status: "success", payload: users });
};

export const generateData = async (req, res) => {
  const usersCount = Number(req.params.users);
  const petsCount = Number(req.params.pets);

  try {
    // 1. Validaciones iniciales
    if (
      !Number.isInteger(usersCount) ||
      usersCount <= 0 ||
      !Number.isInteger(petsCount) ||
      petsCount <= 0
    ) {
      return res
        .status(400)
        .send({ status: "error", error: "Valores inválidos" });
    }

    // 2. Generación de Mocks (Data en memoria)
    const userGen = await generateUsers(usersCount);
    const petsGen = await generatePets(petsCount);

    // 3. Guardar Usuarios en paralelo (Optimizado)
    const userSaved = await Promise.all(
      userGen.map((user) => usersService.create(user)),
    );

    // 4. Lógica de Mascotas (90% adopción)
    const limit = Math.floor(petsGen.length * 0.7);
    const petPromises = petsGen.map((pet, index) => {
      const petData = { ...pet };
      if (index < limit && userSaved.length > 0) {
        const randomUser =
          userSaved[Math.floor(Math.random() * userSaved.length)];
        petData.owner = randomUser._id;
        petData.adopted = true;
      } else {
        petData.adopted = false;
        petData.owner = null;
      }
      return petsService.create(petData);
    });

    const petSaved = await Promise.all(petPromises);

    // 5. Crear Adopciones y actualizar Usuarios (Solo para las mascotas con dueño)
    const adoptionPromises = petSaved
      .filter((pet) => pet.adopted && pet.owner) // FILTRO CLAVE: Solo las adoptadas
      .map(async (pet) => {
        // Buscamos al dueño
        const user = await usersService.getUserById(pet.owner);
        if (user) {
          user.pets.push(pet._id);
          // Ejecutamos ambas actualizaciones
          return Promise.all([
            adoptionsService.create({ owner: user._id, pet: pet._id }),
            usersService.update(user._id, { pets: user.pets }),
          ]);
        }
      });

    await Promise.all(adoptionPromises);

    userIds = userSaved.map((user) => user._id);
    petIds = petSaved.map((pet) => pet._id);

    return res.status(200).send({
      status: "success",
      payload: `Generados: ${userSaved.length} usuarios y ${petSaved.length} mascotas (el 70% adoptadas).`,
    });
  } catch (error) {
    console.error("ERROR GENERAL:", error);
    return res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteDataMocks = async (req, res) => {
  if (userIds.length === 0 || petIds.length === 0) {
    return res.status(404).send({
      status: "error",
      error: "No hay datos para eliminar",
    });
  }

  try {
    userIds.forEach(async (id) => {
      await usersService.delete(id);
    });
    petIds.forEach(async (id) => {
      await petsService.delete(id);
    });

    userIds = [];
    petIds = [];

    return res.status(200).send({
      status: "success",
      payload: "Datos eliminados correctamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: "Error al eliminar datos",
      cod: error.message,
    });
  }
};
