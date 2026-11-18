import { useEffect, useMemo } from 'react'
import { AdvancedMarker, APIProvider, Map as GoogleMap, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toNumber } from '../../utils/format'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

function toPoints(route) {
  if (!Array.isArray(route)) return []
  return route
    .filter((point) => Array.isArray(point) && point.length === 2)
    .map(([lat, lng]) => ({ lat: Number(lat), lng: Number(lng) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
}

function RouteLine({ points }) {
  const map = useMap()
  const mapsLibrary = useMapsLibrary('maps')

  useEffect(() => {
    if (!map || !mapsLibrary || points.length < 2) return undefined

    const line = new mapsLibrary.Polyline({
      path: points,
      strokeColor: '#D6AD60',
      strokeOpacity: 0.95,
      strokeWeight: 4,
      map,
    })

    const bounds = new window.google.maps.LatLngBounds()
    points.forEach((point) => bounds.extend(point))
    map.fitBounds(bounds, 48)

    return () => line.setMap(null)
  }, [map, mapsLibrary, points])

  return null
}

function RouteSketch({ points }) {
  const path = useMemo(() => {
    const lats = points.map((point) => point.lat)
    const lngs = points.map((point) => point.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const span = Math.max(maxLat - minLat, maxLng - minLng) || 1

    return points.map((point) => ({
      x: 10 + ((point.lng - minLng) / span) * 80,
      y: 90 - ((point.lat - minLat) / span) * 80,
    }))
  }, [points])

  const start = path[0]
  const end = path[path.length - 1]

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <polyline
        points={path.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#D6AD60"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {path.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r="1.2" fill="#F8F6F0" />
      ))}
      <circle cx={start.x} cy={start.y} r="2.5" fill="#28745A" stroke="#F8F6F0" strokeWidth="0.8" />
      <circle cx={end.x} cy={end.y} r="2.5" fill="#D6AD60" stroke="#F8F6F0" strokeWidth="0.8" />
    </svg>
  )
}

function MapFallback({ lat, lng, points, label }) {
  const { t } = useTranslation()
  const googleLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-forest text-cream">
      <div className="flex-1 p-4">
        {points.length > 1 ? (
          <RouteSketch points={points} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-12 w-12 text-gold" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-cream/10 bg-forest/95 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-cream/75">
          {label} · {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
        <a href={googleLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-gold hover:underline">
          {t('map.openInGoogle')}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <p className="bg-charcoal/40 px-4 py-2 text-xs text-cream/70">{t('map.noKey')}</p>
    </div>
  )
}

function LocationMap({ latitude, longitude, route, label = '', className = 'h-80' }) {
  const { t } = useTranslation()
  const lat = toNumber(latitude)
  const lng = toNumber(longitude)
  const points = useMemo(() => toPoints(route), [route])

  if (lat === null || lng === null) return null

  return (
    <div className={className}>
      {API_KEY ? (
        <div className="h-full overflow-hidden rounded-lg ring-1 ring-charcoal/10">
          <APIProvider apiKey={API_KEY}>
            <GoogleMap
              mapId={MAP_ID}
              defaultCenter={{ lat, lng }}
              defaultZoom={points.length > 1 ? 9 : 13}
              gestureHandling="cooperative"
              style={{ width: '100%', height: '100%' }}
            >
              {points.length > 1 ? (
                <>
                  <RouteLine points={points} />
                  <AdvancedMarker position={points[0]} title={t('map.start')} />
                  <AdvancedMarker position={points[points.length - 1]} title={t('map.end')} />
                </>
              ) : (
                <AdvancedMarker position={{ lat, lng }} title={label} />
              )}
            </GoogleMap>
          </APIProvider>
        </div>
      ) : (
        <MapFallback lat={lat} lng={lng} points={points} label={label} />
      )}
      {points.length > 1 && <p className="mt-2 text-xs text-charcoal/60">{t('map.routeNote')}</p>}
    </div>
  )
}

export default LocationMap
