import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Subject } from 'rxjs'
import { v4 } from 'uuid'

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VzdGF2cjAiLCJhIjoiY2xmcHlia2FqMHZ4MjN1cGpheHluNGN4cyJ9.hllBWiXuhnDwpIJzCMuzJw'
export const useMapBox = (pointInit) => {
  // Referencia al div del mapa
  const mapDiv = useRef()
  const setRef = useCallback((node) => {
    mapDiv.current = node
  }, [])

  // Reference markers
  const marcadores = useRef({})

  // Observables Rxjs
  const moviemientoMarcador = useRef(new Subject())
  const nuevoMarcador = useRef(new Subject())

  // Maps and Coords
  const mapRef = useRef()
  const [coords, setCoords] = useState(pointInit)

  // function add marker
  const agregarMacador = useCallback((event, id) => {
    const { lng, lat } = event.lngLat || event
    const marker = new mapboxgl.Marker()

    marker.id = id ?? v4() // Si el marcador tiene id
    marker
      .setLngLat({ lng, lat })
      .addTo(mapRef.current)
      .setDraggable(true)

    // Asignar al objeto de marcadores
    marcadores.current[marker.id] = marker

    // Todo: Si el marcador tiene id no emitir
    if (!id) {
      nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
      })
    }

    // escuchar movimientos del marcador
    marker.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()
      // Todo: Emitir los cambios del marcador
      moviemientoMarcador.current.next({
        id,
        lng,
        lat
      })
    })
  }, [])

  // Funcion para actualizar movimiento marcador
  const actualizarPosicion = useCallback((marcador) => {
    const { id, lng, lat } = marcador
    marcadores.current[id].setLngLat({ lng, lat })
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [pointInit.lng, pointInit.lat], // starting position [lng, lat]
      zoom: pointInit.zoom // starting zoom
    })
    mapRef.current = map
  }, [pointInit])

  useEffect(() => {
    mapRef.current?.on('move', () => {
      const { lng, lat } = mapRef.current.getCenter()
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapRef.current.getZoom().toFixed(2)
      })
    })

    /* return map?.off('move') */
  }, [])

  // add Marker on click
  useEffect(() => {
    mapRef.current?.on('click', agregarMacador)
  }, [agregarMacador])

  return {
    agregarMacador,
    actualizarPosicion,
    coords,
    nuevoMarcador$: nuevoMarcador.current,
    moviemientoMarcador$: moviemientoMarcador.current,
    setRef
  }
}
