import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'


export default function App() {
  return (
    <div className="min-h-screen ">
      <Header />
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  )
}
