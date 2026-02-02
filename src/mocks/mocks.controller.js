import { generateUsers } from "./mockingUsers.js";
import { generatePets } from "./mockingPets.js";
import { usersService, petsService } from "../services/index.js";

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
    if (
      !Number.isInteger(usersCount) ||
      usersCount <= 0 ||
      !Number.isInteger(petsCount) ||
      petsCount <= 0
    ) {
      return res.status(400).send({
        status: "error",
        error: "los valores deben ser numeros enteros positivos",
      });
    }

    const userGen = await generateUsers(usersCount);
    const petsGen = await generatePets(petsCount);

    let userSaved = [];
    let petSaved = [];

    for (const user of userGen) {
      userSaved.push(await usersService.create(user));
    }

    for (const pet of petsGen) {
      let random = Math.floor(Math.random() * userSaved.length);
      pet.owner = userSaved[random]._id;
      petSaved.push(await petsService.create(pet));
    }

    for (const pet of petSaved) {
      let user = await usersService.getUserById(pet.owner);
      let pets = user.pets;
      pets.push(pet._id);
      await usersService.update(user._id, { pets });
    }

    return res.status(200).send({
      status: "success",
      payload: `Users: ${userGen.length} y Pets: ${petsGen.length} creados correctamente`,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: "Error al crear usuarios y mascotas",
      cod: error.message,
    });
  }
};
