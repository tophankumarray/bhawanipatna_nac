// @ts-nocheck
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map bounds and centering
const MapController = ({ vehicles, selectedVehicle, autoCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (autoCenter && vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.location.lat, v.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, autoCenter, map]);

  useEffect(() => {
    if (selectedVehicle && selectedVehicle.location) {
      map.flyTo([selectedVehicle.location.lat, selectedVehicle.location.lng], 15, {
        duration: 1.5
      });
      
      setTimeout(() => {
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const markerLatLng = layer.getLatLng();
            if (markerLatLng.lat === selectedVehicle.location.lat && 
                markerLatLng.lng === selectedVehicle.location.lng) {
              layer.openPopup();
            }
          }
        });
      }, 1600);
    }
  }, [selectedVehicle, map]);

  return null;
};

const MapView = ({ vehicles = [], selectedVehicle = null }) => {
  const [mapType, setMapType] = useState('satellite');
  const [autoCenter, setAutoCenter] = useState(true);
  const [showTrails, setShowTrails] = useState(false);
  const vehicleTrails = useRef({});
  // Store vehicle trails for path visualization
  useEffect(() => {
    vehicles.forEach(vehicle => {
      if (vehicle.location) {
        if (!vehicleTrails.current[vehicle.id]) {
          vehicleTrails.current[vehicle.id] = [];
        }
        
        const trail = vehicleTrails.current[vehicle.id];
        const lastPoint = trail[trail.length - 1];
        
        if (!lastPoint || 
            lastPoint[0] !== vehicle.location.lat || 
            lastPoint[1] !== vehicle.location.lng) {
          trail.push([vehicle.location.lat, vehicle.location.lng]);
          if (trail.length > 20) {
            trail.shift();
          }
        }
      }
    });
  }, [vehicles]);

  // ✅ ONLY 3 RELIABLE MAP TYPES - Terrain REMOVED
  const mapTiles = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: '🛰️ Satellite'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: '🗺️ Street'
    },
    hybrid: {
      url: 'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      attribution: 'Google',
      name: '🟫 Hybrid'
    }
  };

  // Create custom vehicle icons with animated effect for running vehicles
  const createVehicleIcon = (vehicle) => {
    const colors = {
      running: '#10b981',
      standing: '#3b82f6',
      stopped: '#f59e0b',
      dataNotRetrieving: '#6b7280'
    };
    
    const color = colors[vehicle.status] || colors.stopped;
    const isRunning = vehicle.status === 'running';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="position: relative; width: 40px; height: 40px;">
        ${isRunning ? `<div style="position: absolute; width: 40px; height: 40px; background: ${color}; border-radius: 50%; opacity: 0.3; animation: pulse 2s infinite;"></div>` : ''}
        <div style="position: absolute; width: 36px; height: 36px; background: ${color}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.4); top: 2px; left: 2px;">🚛</div>
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: ${color}; color: white; padding: 2px 6px; border-radius: 8px; font-size: 9px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${vehicle.speed !== null ? vehicle.speed + ' km/h' : 'N/A'}</div>
      </div>
      <style>@keyframes pulse { 0% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.5); opacity: 0; } 100% { transform: scale(1); opacity: 0.3; } }</style>`,
      iconSize: [40, 48],
      iconAnchor: [20, 24],
      popupAnchor: [0, -24]
    });
  };

  const filteredVehicles = vehicles.filter(v => v.location);

  // Get trail color based on vehicle status
  const getTrailColor = (status) => {
    const colors = {
      running: '#10b981',
      standing: '#3b82f6',
      stopped: '#f59e0b',
      dataNotRetrieving: '#6b7280'
    };
    return colors[status] || colors.stopped;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🗺️ Live Vehicle Tracking Map</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time location updates • 100% Free</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-700">Live</span>
          </div>

          {/* Map type buttons - Terrain REMOVED */}
          {Object.entries(mapTiles).map(([key, tile]) => (
            <button
              key={key}
              onClick={() => setMapType(key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                mapType === key
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tile.name}
            </button>
          ))}

          {/* Auto-center toggle */}
          <button
            onClick={() => setAutoCenter(!autoCenter)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              autoCenter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Auto-center map on vehicles"
          >
            🎯 {autoCenter ? 'Auto' : 'Manual'}
          </button>

          {/* Show trails toggle */}
          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              showTrails
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Show vehicle movement trails"
          >
            📍 Trails
          </button>
        </div>
      </div>
      
      {/* Map Container */}
      <MapContainer 
        center={[20.9517, 85.0985]} 
        zoom={12} 
        style={{ width: '100%', height: '500px', borderRadius: '12px', zIndex: 0 }}
      >
        {/* Dynamic Tile Layer - Terrain REMOVED */}
        <TileLayer
          url={mapTiles[mapType].url}
          attribution={mapTiles[mapType].attribution}
          maxZoom={19}
        />

        {/* Map Controller for auto-centering */}
        <MapController 
          vehicles={filteredVehicles} 
          selectedVehicle={selectedVehicle}
          autoCenter={autoCenter}
        />

        {/* Vehicle Trails */}
        {showTrails && filteredVehicles.map((vehicle) => {
          const trail = vehicleTrails.current[vehicle.id];
          if (trail && trail.length > 1) {
            return (
              <Polyline
                key={`trail-${vehicle.id}`}
                positions={trail}
                color={getTrailColor(vehicle.status)}
                weight={3}
                opacity={0.6}
                dashArray="5, 10"
              />
            );
          }
          return null;
        })}
        
        {/* Vehicle Markers */}
        {filteredVehicles.map((vehicle) => (
  <Marker
    key={vehicle.id}
    position={[vehicle.location.lat, vehicle.location.lng]}
    icon={createVehicleIcon(vehicle)}
  >
    <Popup autoPan closeButton>
      <div className="p-2 min-w-[220px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">
            {vehicle.registrationNumber}
          </h3>

          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              vehicle.status === 'running'
                ? 'bg-emerald-500 text-white'
                : vehicle.status === 'standing'
                ? 'bg-blue-500 text-white'
                : vehicle.status === 'stopped'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {vehicle.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">📍 Ward:</span>{' '}
            {vehicle.assignedWard}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">⚡ Speed:</span>{' '}
            {vehicle.speed != null ? `${vehicle.speed} km/h` : 'N/A'}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">📶 Signal:</span>{' '}
            {vehicle.signalStrength ?? 'N/A'}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">🔑 Ignition:</span>{' '}
            {vehicle.ignitionOn ? 'ON' : 'OFF'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">🗺️ Location:</span>{' '}
            {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-2 border-t pt-2">
          <p className="text-xs text-gray-500">
            Last update:{' '}
            {new Date(vehicle.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </Popup>
  </Marker>
))}

      </MapContainer>
      
      {/* Map Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Running</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Standing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Stopped</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Offline</span>
        </div>
        {showTrails && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-emerald-500 opacity-60" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-700 font-semibold">Movement Trail</span>
          </div>
        )}
      </div>

      {/* Info Banner - Updated */}
      <div className="mt-4 bg-linear-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 text-center">
          ✨ <span className="font-semibold">100% Free Maps</span> • Esri Satellite, OpenStreetMap, Google Hybrid • No API Keys Required
        </p>
      </div>
    </div>
  );
};

export default MapView;
