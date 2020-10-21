import React, { useState, createContext } from 'react';
import HubbleSidebar from '../components/sidebar';
import HubbleMap from '../components/map/map';

export const DateContext = createContext([]);
export const BrandContext = createContext("");
export const CityContext = createContext("");

const Store = () => {
  const [ dateItems, dateItemsState ] = useState([new Date(), new Date()]);
  const [ brand, brandState ] = useState("Leaflet Maps");
  const [ city, cityState ] = useState();

  return (
    <DateContext.Provider value={[ dateItems, dateItemsState ]}>
      <BrandContext.Provider value={[ brand, brandState ]}>
        <CityContext.Provider value={[ city, cityState ]}>
          <div className="hubble-maps">
            <div className="app-main">
              <div className="main-sidebar">
                <HubbleSidebar />
              </div>
              <div className="app-body">
                <HubbleMap />
              </div>
            </div>
          </div>
        </CityContext.Provider>
      </BrandContext.Provider>
    </DateContext.Provider>
  );
}

export default Store;