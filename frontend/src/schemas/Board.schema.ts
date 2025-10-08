import * as yup from "yup";

export const createBoardSchema = yup.object({
  name: yup
    .string()
    .required("El nombre del tablero es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  createdBy: yup
    .string()
    .required("El nombre de Usuario es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
});

export const updateBoardSchema = yup.object({
  name: yup
    .string()
    .min(3, "Debe tener al menos 3 caracteres")
    .max(100)
    .optional(),
});
