import { config } from "dotenv";
config();

export default {
  port: process.env.PORT,
  mongoURI: process.env.MONGOURI_ATLAS,
};
