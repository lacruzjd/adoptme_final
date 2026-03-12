import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../app.js";

describe("Pets routes", () => {
  const petData = {
    name: "Test Pet",
    specie: "Dog",
    birthDate: new Date("2020-01-01"),
  };

  let createdPetIds;

  it('Deberia crear una mascota con POST "/api/pets"', async () => {
    const response = await request(app).post("/api/pets").send(petData);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.includes({
      name: petData.name,
      specie: petData.specie,
      birthDate: petData.birthDate.toISOString(),
    });
    expect(response.body.payload).to.have.property("id");
    createdPetIds = response.body.payload.id;
  });

  it('Deberia obtener un array de mascotas con GET "/api/pets"', async () => {
    const response = await request(app).get("/api/pets");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.is.an("array");
  });

  it('Deberia obtener una mascota por ID con GET "/api/pets/:pid"', async () => {
    const response = await request(app).get(`/api/pets/${createdPetIds}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body.payload).to.include({
      name: petData.name,
      specie: petData.specie,
      birthDate: petData.birthDate.toISOString(),
    });
  });

  it('Deberia actualizar una mascota con PUT "/api/pets/:pid"', async () => {
    const updateData = { name: "Nombre Actualizado" };
    const updateResponse = await request(app)
      .put(`/api/pets/${createdPetIds}`)
      .send(updateData);

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body).to.have.property("status", "success");
    expect(updateResponse.body).to.have.property("message", "Pet updated");
  });

  it('Deberia eliminar una mascota con DELETE "/api/pets/:pid"', async () => {
    const deleteResponse = await request(app).delete(
      `/api/pets/${createdPetIds}`,
    );
    expect(deleteResponse.status).to.equal(200);
    expect(deleteResponse.body).to.have.property("status", "success");
    expect(deleteResponse.body).to.have.property("message", "Pet deleted");
  });
});
