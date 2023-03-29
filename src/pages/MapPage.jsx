import { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useMapBox } from '../hooks/useMapBox'

const pointInit = {
  lng: -96.9491,
  lat: 18.7816,
  zoom: 13
}

export const MapPage = () => {
  const { agregarMacador, actualizarPosicion, coords, setRef, nuevoMarcador$, moviemientoMarcador$ } = useMapBox(pointInit)
  const { socket } = useContext(SocketContext)

  // Escuchar marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMacador(marcadores[key], key)
      }
    })
  }, [socket, agregarMacador])

  // Enviar nuevo marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador)
    })
  }, [nuevoMarcador$, socket])

  // Actualizar marcador
  useEffect(() => {
    moviemientoMarcador$.subscribe(marcador => {
      socket.emit('marcador-actualizado', marcador)
    })
  }, [moviemientoMarcador$, socket])
  // Escuchar actualización del marcador ws
  useEffect(() => {
    socket.on('marcador-actualizado', marcador => {
      actualizarPosicion(marcador)
    })
  }, [socket])

  // Crear Nuevo Marcador
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      agregarMacador(marcador, marcador.id)
    })
  }, [socket, agregarMacador])

  return (
    <>
      <div className='info'>
        Lng: {coords.lng} | lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div
        ref={setRef}
        className='mapContainer'
      />
    </>
  )
}
