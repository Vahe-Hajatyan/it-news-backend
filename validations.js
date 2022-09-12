import { body } from "express-validator";

export const loginValidator = [
  body("email", "Не верный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];
export const registerValidator = [
  body("email", "Не верный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должен быть минимум 3 символов").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isString(),
];
export const postCreateValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }),
  body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
  body("comment", "Введите текст комментарии").optional().isArray(),
  body("tags", "укажите тэг").optional().isString(),
  body("imageUrl", "Неверный ссылка на изображение").optional().isString(),
];
