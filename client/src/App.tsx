import { io } from "socket.io-client";
import './App.css'

function App() {
  const socket = io(import.meta.env.VITE_SERVER_URL);

  console.log("Socket depuis le client:", socket);

  return (
    <>
      <h1 className='title'>SMN</h1>
    </>
  )
}

export default App
