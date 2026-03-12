import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import uploader from "../middleware/uploader.js";

const router = Router();

router.get("/", petsController.getAllPets);
router.get("/:pid", petsController.getPet);
router.post("/", petsController.createPet);
router.post(
  "/with-image",
  uploader.single("file"),
  petsController.createPetWithImage,
);
router.put("/:pid", petsController.updatePet);
router.delete("/:pid", petsController.deletePet);

export default router;
