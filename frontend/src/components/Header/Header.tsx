import { Link } from 'react-router-dom'
import { useState } from 'react'
import DropdownModal from '../ui/DropDownModal'
import { SecondaryButton } from '../ui/SecundaryButton'
import BoardForm from '../../modules/Board/components/BoardForm'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-semibold">Mi Kanban</h1>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-cyan-400 transition">
            Inicio
          </Link>
          <Link to="/kanban" className="hover:text-cyan-400 transition">
            Tablero
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-md transition"
          >
            Crear Tablero
          </button>
        </nav>
      </header>

      <DropdownModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BoardForm />
        <div className="flex justify-end mt-4">
          <SecondaryButton onClick={() => setIsOpen(false)}>
            Cancelar
          </SecondaryButton>
        </div>
      </DropdownModal>
    </>
  )
}
