import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import type { CreateTaskBody } from '../types/task.types'
import { createTaskSchema } from '../schema/task.schema'

interface Props {
  onSubmit: (data: CreateTaskBody) => void
  boardId: string
  columnId: string
}
export const TaskForm = ({ onSubmit, boardId, columnId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskBody>({
    resolver: yupResolver(createTaskSchema),
    defaultValues: {
      boardId,
      columnId,
      createdAt: new Date().toISOString(),
    } as any,
  })

  const submitHandler = (data: any) => {
    onSubmit({
      ...data,
      boardId,
      columnId,
      createdAt: new Date().toISOString(),
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <h2 className="text-xl font-bold">Nueva Tarea</h2>
      <div>
        <label className="block text-sm mb-1">Título</label>
        <input
          type="text"
          {...register('title')}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <p className="text-red-500 text-sm">{errors.title?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          {...register('description')}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <p className="text-red-500 text-sm">{errors.description?.message}</p>
      </div>

      <PrimaryButton type="submit">Agregar Tarea</PrimaryButton>
    </form>
  )
}
