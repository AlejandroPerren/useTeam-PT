import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import type { Board } from '../types/board.types'
import DropdownModal from '../../../components/ui/DropDownModal'
import { InputField } from '../../../components/ui/InputFiled'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'

interface BoardCardProps {
  board: Board
}

const BoardCard = ({ board }: BoardCardProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<{ userName: string }>()

  const onSubmit = (data: { userName: string }) => {
    localStorage.setItem('selectedBoard', board._id)
    localStorage.setItem('userName', data.userName)

    setModalOpen(false)
    navigate('/kanban')
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg w-72 p-5 flex flex-col justify-between hover:scale-[1.03] transition-transform cursor-pointer">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-white">{board.name}</h2>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all"
        >
          Ver Tablero
        </button>
      </div>

      <DropdownModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-lg font-bold">Ingresar al Tablero</h2>
          <InputField
            label="Tu nombre"
            id="userName"
            placeholder="Ej: Alejandro"
            register={register('userName', { required: true })}
          />
          <PrimaryButton type="submit">Entrar</PrimaryButton>
        </form>
      </DropdownModal>
    </div>
  )
}

export default BoardCard
