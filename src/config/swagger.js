import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

// ensure correct directory resolution even when compiled or executed from different cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptMe API",
      version: "1.0.0",
      description: "API para la gestión de adopciones de mascotas",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: [path.join(__dirname, "../docs/*.yaml")],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
