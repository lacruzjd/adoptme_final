import { describe, it } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import { adoptionsService } from "../../services/index.js";

describe("Adoptions Routes", () => {
  const userData = {
    firstName: "TestAdopter",
    lastName: "User",
    email: "testuserAdopter@example.com",
    password: "testpassword",
  };

  const petData = {
    name: "Test Pet Adoption",
    specie: "Dog",
    birthDate: new Date("2020-01-01"),
  };

  let uid;
  let pid;
  let aid;

  before(async () => {
    // Crear un usuario de prueba
    const userResponse = await request(app)
      .post("/api/sessions/register")
      .send(userData);

    uid = userResponse.body.payload;

    // Crear una mascota de prueba
    const petResponse = await request(app).post("/api/pets").send(petData);

    pid = petResponse.body.payload.id;
  });

  it('Deberia crear una adopcion con POST "/api/adoptions"', async () => {
    const response = await request(app).post(`/api/adoptions/${uid}/${pid}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.is.a("string");
    aid = response.body.payload;
  });

  it('Deberia obtener un array de adopciones con GET "/api/adoptions"', async () => {
    const response = await request(app).get("/api/adoptions");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.is.an("array");
  });

  it('Deberia obtener una adopcion con GET "/api/adoptions/:aid"', async () => {
    const response = await request(app).get(`/api/adoptions/${aid}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.is.an("object");
  });

  it('No deberia realizar la adopcion si el usuario no existe con POST "/api/adoptions/:uid/:pid"', async () => {
    let uid = "69adc8843b36197a53e0c5c5";
    const response = await request(app)
      .post(`/api/adoptions/${uid}/${pid}`)
      .send();
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "User not found");
  });

  it('No deberia realizar la adopcion si la mascota no existe con POST "/api/adoptions/:uid/:pid"', async () => {
    let pid = "69adc8843b36197a53e0c5c3";
    const response = await request(app)
      .post(`/api/adoptions/${uid}/${pid}`)
      .send();
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "Pet not found");
  });

  it('No deberia realizar la adopcion si la mascota ya esta adoptada con POST "/api/adoptions/:uid/:pid"', async () => {
    const response = await request(app)
      .post(`/api/adoptions/${uid}/${pid}`)
      .send();
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "Pet is already adopted");
  });

  after(async () => {
    // Eliminar el usuario de prueba
    await request(app).delete(`/api/users/${uid}`);

    // Eliminar la mascota de prueba
    await request(app).delete(`/api/pets/${pid}`);

    // Eliminar la adopcion de prueba
    await adoptionsService.delete(aid);
  });
});
