import { createContext } from 'react'
import { useSocket } from '../hooks/useSocket'

const baseUrl = import.meta.env.VITE_REACT_APP_API_URL

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { socket, online } = useSocket(baseUrl)

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  )
}
