import { useMapBox } from '../hooks/useMapBox'

const pointInit = {
  lng: -96.9491,
  lat: 18.7816,
  zoom: 13
}

export const MapPage = () => {
  const { coords, setRef } = useMapBox(pointInit)
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
