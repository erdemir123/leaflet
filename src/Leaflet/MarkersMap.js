import React,{useState,useRef} from 'react'
import { BiCurrentLocation } from 'react-icons/bi';
import { MapContainer, TileLayer, Marker, Popup,FeatureGroup } from "react-leaflet";
import osm from "./osm-providers";
import cities from "./cities.json";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import useGeoLocation from '../components/useGeoLocation';
import {EditControl} from "react-leaflet-draw"



delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const MarkersMap = () => {
  
    const [center,setCenter]= useState({lat:13.084622, lng:80.249357})
  const ZOOM_LEVEL =9 
  const mapRef = useRef(null);
  const markerIcon = new L.Icon({
    iconUrl: require("./logo512.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });
  const location = useGeoLocation()
  const showMyLocation = () => {
    if (location.loaded && !location.error && mapRef.current) {
      // Harita ref'i mevcut ve harita yüklendiğinde işlem yapın
      mapRef.current.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error.message);
    }
  };
  const _created = (e) => console.log(e);
  return (
    <div><MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
      <FeatureGroup>
        <EditControl position='topright' onCreated={_created}
                  draw={
                    {
                      /* rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false, */
                    }
                  }/>
      </FeatureGroup>
    <TileLayer
              url= "https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1"
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {cities.map((city, idx) => (
              <Marker
                position={[city.lat, city.lng]}
                icon={markerIcon}
                key={idx}
              >
                <Popup>
                  <b>
                    {city.city}, {city.country}
                  </b>
                </Popup>
              </Marker>
            ))}
             {location.loaded && !location.error && (
                <Marker
                  icon={markerIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
              )}
    </MapContainer>
    
    <div className="row my-4">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-primary" onClick={showMyLocation}>
            Locate Me <BiCurrentLocation/>
          </button>
        </div>
      </div>
    
    </div>
  )
}

export default MarkersMap