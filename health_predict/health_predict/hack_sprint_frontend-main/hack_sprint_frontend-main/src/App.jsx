import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingChatButton from './components/FloatingChatButton'

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingChatButton />
    </>
  )
}

export default App