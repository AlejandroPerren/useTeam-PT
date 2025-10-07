import * as yup from 'yup'

export const createColumnSchema = yup.object({
  title: yup
    .string()
    .required('El título de la columna es obligatorio')
    .min(2, 'Debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  boardId: yup
    .string()
    .required('El ID del tablero es obligatorio')
    .matches(/^[a-fA-F0-9]{24}$/, 'Debe ser un ObjectId válido'),
  order: yup.number().min(0).optional(),
})

export const updateColumnSchema = yup.object({
  title: yup.string().min(2).max(100).optional(),
  order: yup.number().min(0).optional(),
})
