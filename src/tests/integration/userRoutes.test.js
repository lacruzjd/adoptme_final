import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../app.js";

describe("User Routes", () => {
  const newUser = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    password: "testpassword",
  };

  let userIdRegistered;

  it('Deberia registrar un usuario con POST "/api/sessions/register"', async () => {
    const response = await request(app)
      .post("/api/sessions/register")
      .send(newUser);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "success");
    userIdRegistered = response.body.payload;
  });

  it('No deberia registrar un usuario con el mismo email con POST "/api/sessions/register"', async () => {
    const response = await request(app)
      .post("/api/sessions/register")
      .send(newUser);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "User already exists");
  });

  it('Deberia obtener un array de usuarios sin la contraseña ni email con GET "/api/users"', async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload").that.is.an("array");
    expect(response.body.payload[0]).to.not.have.property("password");
    expect(response.body.payload[0]).to.have.property("name");
    expect(response.body.payload[0]).to.have.property("role");
    expect(response.body.payload[0]).to.not.have.property("email");
  });

  it('Deberia obtener un usuario por ID con GET "/api/users/:uid"', async () => {
    const response = await request(app).get(`/api/users/${userIdRegistered}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body.payload).to.have.property("name", "Test User");
  });

  it('Deberia actualizar un usuario con PUT "/api/users/:uid"', async () => {
    const updateData = { first_name: "Updated Name" };
    const updateResponse = await request(app)
      .put(`/api/users/${userIdRegistered}`)
      .send(updateData);

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body).to.have.property("status", "success");
    expect(updateResponse.body).to.have.property("message", "User updated");
  });

  let loginResponse;

  it('Un usuario registrado deberia iniciar sesión con POST "/api/sessions/login"', async () => {
    loginResponse = await request(app)
      .post("/api/sessions/login")
      .send({ email: newUser.email, password: newUser.password });

    expect(loginResponse.status).to.equal(200);
    expect(loginResponse.body).to.have.property("status", "success");
    expect(loginResponse.body).to.have.property("message", "Logged in");
    expect(loginResponse.headers["set-cookie"]).to.exist;
  });

  it('Un usuario registrado deberia obtener su información con GET "/api/sessions/current"', async () => {
    const currentResponse = await request(app)
      .get("/api/sessions/current")
      .set("Cookie", loginResponse.headers["set-cookie"]);

    expect(currentResponse.status).to.equal(200);
    expect(currentResponse.body).to.have.property("status", "success");
    expect(currentResponse.body).to.have.property("payload");
    expect(currentResponse.body.payload).to.have.property(
      "email",
      newUser.email,
    );
  });

  it('Un usuario no autenticado no deberia obtener su información con GET "/api/sessions/current"', async () => {
    const currentResponse = await request(app).get("/api/sessions/current");

    expect(currentResponse.status).to.equal(401);
    expect(currentResponse.body).to.have.property("status", "error");
    expect(currentResponse.body).to.have.property("error", "Unauthorized");
  });

  it('Deberia cerrar sesión con POST "/api/sessions/logout"', async () => {
    const logoutResponse = await request(app)
      .post("/api/sessions/logout")
      .set("Cookie", loginResponse.headers["set-cookie"]);

    expect(logoutResponse.status).to.equal(200);
    expect(logoutResponse.body).to.have.property("status", "success");
    expect(logoutResponse.body).to.have.property("message", "Logged out");
  });

  it('No deberia iniciar sesión con un usuario no registrado con POST "/api/sessions/login"', async () => {
    const loginResponse = await request(app)
      .post("/api/sessions/login")
      .send({ email: "nonexistent@example.com", password: "wrongpassword" });

    expect(loginResponse.status).to.equal(404);
    expect(loginResponse.body).to.have.property("status", "error");
    expect(loginResponse.body).to.have.property("error", "User doesn't exist");
  });

  it('No deberia iniciar sesión con una contraseña incorrecta con POST "/api/sessions/login"', async () => {
    const loginResponse = await request(app)
      .post("/api/sessions/login")
      .send({ email: newUser.email, password: "wrongpassword" });

    expect(loginResponse.status).to.equal(400);
    expect(loginResponse.body).to.have.property("status", "error");
    expect(loginResponse.body).to.have.property("error", "Incorrect password");
  });

  it('Deberia eliminar un usuario con DELETE "/api/users/:uid"', async () => {
    const deleteResponse = await request(app).delete(
      `/api/users/${userIdRegistered}`,
    );
    expect(deleteResponse.status).to.equal(200);
    expect(deleteResponse.body).to.have.property("status", "success");
    expect(deleteResponse.body).to.have.property("message", "User deleted");
  });
});
