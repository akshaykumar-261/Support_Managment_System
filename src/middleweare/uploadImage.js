import multer from "multer";
import path from "path";
import fs from "fs";
// auto create folder
const uploadPath = "uploads/profile";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
// Stoarge
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqName + path.extname(file.originalname));
  },
});
// image validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const uplaod = multer({ storage, fileFilter });
export default uplaod;
