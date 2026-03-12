import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { urlImageDTO } from "../dto/urlImageDTO.js";

const getAllPets = async (req, res) => {
  let pets = await petsService.getAll();
  pets.map((pet) => {
    pet.image = urlImageDTO(pet.image, req);
    return PetDTO.getPetInputFrom(pet);
  });
  res.send({ status: "success", payload: pets });
};

const createPet = async (req, res) => {
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
  const result = await petsService.create(pet);

  res
    .status(201)
    .send({ status: "success", payload: PetDTO.getPetInputFrom(result) });
};

const getPet = async (req, res) => {
  const petId = req.params.pid;
  let pet = await petsService.getBy({ _id: petId });
  if (!pet) {
    return res.status(404).send({ status: "error", error: "Pet not found" });
  }
  pet.image = urlImageDTO(pet.image, req);
  pet = PetDTO.getPetInputFrom(pet);
  res.send({ status: "success", payload: pet });
};

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;
  const petId = req.params.pid;
  const result = await petsService.update(petId, petUpdateBody);
  res.send({ status: "success", message: "Pet updated" });
};

const deletePet = async (req, res) => {
  const petId = req.params.pid;
  const result = await petsService.delete(petId);
  res.send({ status: "success", message: "Pet deleted" });
};

const createPetWithImage = async (req, res) => {
  const file = req.file;
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const pet = PetDTO.getPetInputFrom({
    name,
    specie,
    birthDate,
    image: `${file.filename}`,
  });
  const result = await petsService.create(pet);
  res.send({ status: "success", payload: PetDTO.getPetInputFrom(result) });
};
export default {
  getAllPets,
  createPet,
  getPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
