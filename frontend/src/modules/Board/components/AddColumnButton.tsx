interface Props {
  onCreate: () => void
}

export const AddColumnButton = ({ onCreate }: Props) => (
  <button
    onClick={onCreate}
    className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-gray-800 border-2 border-gray-950 ring-rose-500 hover:ring-2 self-start mt-4"
  >
    + Add Column
  </button>
)
