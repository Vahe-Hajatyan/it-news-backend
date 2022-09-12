import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  loginValidator,
  postCreateValidator,
  registerValidator,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controller/userController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
  getPopular,
  getTagsPost,
  setComment,
} from "./controller/postController.js";
import { handleError } from "./utils/handleError.js";
import cors from "cors";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error " + err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use("/upload", express.static("uploads"));

app.post("/auth/login", loginValidator, handleError, login);
app.post("/auth/register", registerValidator, handleError, register);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: `/upload/${req.file.originalname}` });
});

app.get("/popular", getPopular);

app.get("/tags", getLastTags);
app.get("/tags/:name", getTagsPost);
app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, postCreateValidator, handleError, update);
app.post("/posts", checkAuth, postCreateValidator, handleError, create);
app.post("/comment/:id", setComment);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});
