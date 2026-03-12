import __dirname from "../utils/index.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `src/public/uploads/img`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`.replace(/\s/g, "_"));
  },
});

const uploader = multer({ storage });

export default uploader;
