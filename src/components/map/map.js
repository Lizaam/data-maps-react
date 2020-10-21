import React, { useState, useContext } from 'react';
import '../../css/leaflet/stylesheet/leaflet.css';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import CanvasMarkersLayer from '../../js/leaflet/CanvasMarkersLayer';
import ProgressAnimation from '../progress';
import { DateContext, CityContext } from '../../store/store';

export var mapZoom = 6;
export var mapCenter = [ -29, 22 ];
export const mapSettings = {
  map: `https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png`,
  attribution: `<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>`,
  id: `open.street`,
  position: `topright`,
}    

var initialRendering = false;
var dataWasFetched = false;

export default function HubbleMap() {
  const [ dateItems, dateItemsState ] = useState([]);
  const [ dateRange ] = useContext(DateContext); 
  const [ city ] = useContext(CityContext);
  const mapIcon = Leaflet.icon({
    iconUrl: require('../../images/marker-2.png'),
    iconSize: [16, 16],
    iconAnchor: [8, 10]
  }); 

  const processFetchedData = () => {
    fetch('https://geo-json-data.herokuapp.com/geo-json-data')
    .then(response => response.json()) 
    .then((data) => {
      const startDateObject = dateRange[0];
      const endDateObject = dateRange[1];

      // eslint-disable-next-line
      const filteredData = data.features.filter((item) => {
        const dateString = item.properties.Date;
        const dateStringToDate = new Date(dateString);
  
        if (dateStringToDate >= startDateObject && dateStringToDate <= endDateObject) {
          return item;
        } 
      });

      if (filteredData.length === 0) {
        filteredData.push(data.features[data.features.length - 1], data.features[data.features.length - 2]);
      } 

      dateItemsState(filteredData);
      dataWasFetched = true;
    })
  }

  const updateMapZoom = (target) => {
    mapZoom = target._zoom;

    if (target._animateToCenter === undefined) {
      mapCenter = [target._lastCenter.lat, target._lastCenter.lng];
    } else {
      mapCenter = [target._animateToCenter.lat, target._animateToCenter.lng];
    }
  }

  if (!initialRendering) {
    initialRendering = true;
  
    return (
      <Map onzoomend={(event) => updateMapZoom(event.target)} className="leaflet-hubble-map" center={mapCenter} zoom={mapZoom} zoomControl={false}>
        <ZoomControl position={mapSettings.position} />
        <TileLayer url={mapSettings.map} id={mapSettings.id} />
      </Map>
    )
  } else {
    if (city !== undefined) {
      switch (city) {
        case "cpt":
          mapZoom = 11;
          mapCenter = [-34, 18.5];
        break;
        case "jhb":
          mapZoom = 11;
          mapCenter = [-26.2, 28.0];
        break;
        default:
          return city;
      }
    }
  
    if (dataWasFetched) {
      dataWasFetched = false;
      dateItemsState([]);
    }
  
    if (dateItems.length === 0) {
      if (!dataWasFetched) {
        processFetchedData();
        
        return (
          <ProgressAnimation />
        )
      } else {
        dataWasFetched = false;
  
        return (
          <Map onzoomend={(event) => updateMapZoom(event.target)} className="leaflet-hubble-map" center={mapCenter} zoom={mapZoom} zoomControl={false}>
            <ZoomControl position={mapSettings.position} />
            <TileLayer url={mapSettings.map} id={mapSettings.id} />
          </Map>
        )
      }
    } else {
      return (
        <Map onzoomend={(event) => updateMapZoom(event.target)} className="leaflet-hubble-map" center={mapCenter} zoom={mapZoom} zoomControl={false}>
          <ZoomControl position={mapSettings.position} />
          <TileLayer url={mapSettings.map} id={mapSettings.id} />
          <CanvasMarkersLayer>
            {
              dateItems.map((value, key) => {
                return (
                  <Marker position={[value.geometry.coordinates[1], value.geometry.coordinates[0]]} icon={mapIcon} key={key}>
                    <Popup>
                      <div>{`Latitude: ${value.geometry.coordinates[1]} Longitude: ${value.geometry.coordinates[0]} Date: ${value.properties.Date}`}</div>
                    </Popup>
                  </Marker>
                )
              })
            }
          </CanvasMarkersLayer>
        </Map>
      )
    }
  }
}
