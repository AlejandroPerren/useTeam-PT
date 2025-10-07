import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import type { CreateBoardBody } from '../types/board.types'
import { createBoardSchema } from '../schema/board.schema'
import { createBoard } from '../network/Boards'
import { InputField } from '../../../components/ui/InputFiled'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'

const BoardForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardBody>({
    resolver: yupResolver(createBoardSchema),
  })

  const onSubmit = async (data: CreateBoardBody) => {
    try {
      const board = await createBoard(data)

      if (board.ok && board.data) {
        localStorage.setItem('selectedBoard', board.data._id)
        localStorage.setItem('userName', board.data.createdBy)
      }

      console.log('Board creado y guardado en localStorage!')
      reset()
      setTimeout(() => {
        navigate('/kanban')
      }, 500)
    } catch (error) {
      console.log('Ocurrió un error al crear el Board')
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <h1 className="m-2 text-center text-4xl font-extrabold p-5">
          Crea tu Tablero!!
        </h1>

        <InputField
          label="Nombre del usuario"
          id="createdBy"
          placeholder="Ingrese su Nombre"
          register={register('createdBy')}
          error={errors.createdBy}
        />

        <InputField
          label="Nombre del Tablero"
          id="name"
          placeholder="Ingrese un Nombre para el tablero"
          register={register('name')}
          error={errors.name}
        />

        <PrimaryButton type="submit">Cargar Formulario</PrimaryButton>
      </form>
    </div>
  )
}

export default BoardForm
