import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export async function generateUsers(cant) {
  const users = [];
  for (let i = 0; i < cant; i++) {
    const hashPassword = await bcrypt.hash("coder123", 10);

    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashPassword,
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    });
  }

  return users;
}
