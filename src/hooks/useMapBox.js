import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
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

  // Maps and Coords
  const mapRef = useRef()
  const [coords, setCoords] = useState(pointInit)

  // function add marker
  const agregarMacador = useCallback((event) => {
    const { lng, lat } = event.lngLat
    const marker = new mapboxgl.Marker()

    marker.id = v4() // Si el marcador tiene id
    marker
      .setLngLat({ lng, lat })
      .addTo(mapRef.current)
      .setDraggable(true)

    marcadores.current[marker.id] = marker
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
    coords,
    setRef
  }
}
