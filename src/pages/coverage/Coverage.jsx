// components/Coverage.jsx
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';

// Component to change map view
function FlyToLocation({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo([coords.latitude, coords.longitude], 10);
  }
  return null;
}

const Coverage = () => {
    const districtData = useLoaderData()
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const mapRef = useRef();

  const handleSearch = () => {
    const found = districtData.find((d) =>
      d.district.toLowerCase().includes(search.toLowerCase())
    );
    if (found) {
      setSelectedDistrict(found);
    } else {
      alert('District not found');
    }
  };

  return (
    <div className="py-10 px-4 bg-white rounded-2xl">
      <h2 className="text-3xl font-bold mb-4">We are available in 64 districts</h2>

      <div className="max-w-xl mb-6 flex items-center -space-x-10">
        <input
          type="text"
          placeholder="Search by district name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input bg-base-300 focus:ring-0 focus:outline-none border-none focus:border-none rounded-full w-full"
        />
        <button onClick={handleSearch} className="btn rounded-full px-7 z-10 bg-[#CAEB66]">
          Search
        </button>
      </div>

      <div className="divider"></div>

      <h3 className='text-2xl font-bold  my-5'>We deliver almost all over Bangladesh</h3>


      <MapContainer
        center={[23.685, 90.3563]}
        zoom={9}
        className='rounded-2xl'
        scrollWheelZoom={true}
        style={{ height: '500px', width: '100%' }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {districtData.map((district, idx) => (
          <Marker
            key={idx}
            position={[district.latitude, district.longitude]}
          >
            <Popup>
              <strong>{district.district}</strong>
              <br />
              Covered: {district.covered_area.join(', ')}
            </Popup>
          </Marker>
        ))}

        {selectedDistrict && <FlyToLocation coords={selectedDistrict} />}
      </MapContainer>
    </div>
  );
};

export default Coverage;
