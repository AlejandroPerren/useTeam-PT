import * as yup from "yup";

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .required("El título de la tarea es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(150, "Máximo 150 caracteres"),
  description: yup.string().max(500).optional(),
  boardId: yup
    .string()
    .required("El ID del tablero es obligatorio")
    .matches(/^[a-fA-F0-9]{24}$/, "Debe ser un ObjectId válido"),
  columnId: yup
    .string()
    .required("El ID de la columna es obligatorio")
    .matches(/^[a-fA-F0-9]{24}$/, "Debe ser un ObjectId válido"),
  order: yup.number().min(0).optional(),
  createdAt: yup.date().required("La fecha de creación es obligatoria"),
});

export const updateTaskSchema = yup.object({
  title: yup.string().min(3).max(150).optional(),
  description: yup.string().max(500).optional(),
  columnId: yup
    .string()
    .matches(/^[a-fA-F0-9]{24}$/, "Debe ser un ObjectId válido")
    .optional(),
  order: yup.number().min(0).optional(),
  editadoPor: yup.string().optional(),
});
