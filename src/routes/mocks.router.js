import { Router } from "express";
import {
  generateData,
  generatePets50,
  generateUsers50,
  generatePetsCant,
  generateUsersCant,
} from "../mocks/mocks.controller.js";
const router = Router();

router.get("/mockingpets", generatePets50);
router.get("/mockingpets/:cant", generatePetsCant);
router.get("/mockingusers", generateUsers50);
router.get("/mockingusers/:cant", generateUsersCant);
router.get("/generatedata/users/:users/pets/:pets", generateData);

export default router;
