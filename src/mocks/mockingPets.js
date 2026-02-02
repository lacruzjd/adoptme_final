import { fa, faker } from "@faker-js/faker"

export async function generatePets(cant) {
    const pets = []

    for (let i = 0; i < cant; i++) {
        pets.push({
            name: faker.animal.petName(),
            specie: faker.helpers.arrayElement(["dog", "cat", "rabbit", "bird"]),
            birthDate: faker.date.birthdate(),
            adopted: faker.datatype.boolean(),
            owner: '',
            image: faker.image.urlPicsumPhotos({width: 400, height: 400})
        })
    }

    return pets
}