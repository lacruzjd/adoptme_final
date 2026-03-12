import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import connectMongoose from "./config/mongoose.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import config from "./config/config.js";
import swaggerDocs from "./config/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { marked } from "marked";
import { engine } from "express-handlebars";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/public/views");

const PORT = config.port;
await connectMongoose();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./src/public"));
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  const readme = fs.readFileSync("./src/public/docs/README.md", "utf-8");

  const readmeContent = marked(readme);
  res.render("home", { readmeContent });
});

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/api/mocks", (req, res) => {
  res.render("mocks");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

export default app;
