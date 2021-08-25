import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import workerLoader from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

mapboxgl.workerClass = workerLoader
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY

import { Box } from '@chakra-ui/react'

const ShippingMap = ({ initialArea, onChangeArea }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const draw = useRef(null)
  const [lng, setLng] = useState(34.7818)
  const [lat, setLat] = useState(32.0853)
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    })

    map.current.addControl(new mapboxgl.FullscreenControl())

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    })
    map.current.addControl(draw.current, 'top-left')
    initialArea && draw.current.add(initialArea)
  }, [initialArea, lat, lng, zoom])

  const onChange = useCallback(() => {
    const featureCollection = draw.current.getAll()
    const multiPolygon = {
      type: 'MultiPolygon',
      coordinates: featureCollection.features.map((feature) => feature.geometry.coordinates)
    }
    onChangeArea(multiPolygon)
  }, [onChangeArea])

  useEffect(() => {
    if (!map.current) return
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })


    map.current.on('draw.create', onChange)
    map.current.on('draw.delete', onChange)
    map.current.on('draw.update', onChange)
  }, [onChange])

  return (
    <Box h='100%' w='100%' ref={mapContainer} />
  )
}

export default ShippingMap