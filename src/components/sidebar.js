import React, { useState, useContext } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Days } from '../data/allDays';
import '../css/date-picker/react-daterange-picker.css';
import { DateContext, BrandContext, CityContext } from '../store/store';
import { SortedDays } from '../data/sortedDays';

const checkboxItems = [];
export var initialDateSelection = false;

export default function HubbleSidebar() {
  const [ dateItems, dateItemsState ] = useContext(DateContext);
  const [ brand ] = useContext(BrandContext);
  const [ isSidebarOpen, sidebarState ] = useState(true);
  const [ city, cityState ] = useContext(CityContext);

  const toggleSidebarState = () => {
    isSidebarOpen ? sidebarState(false) : sidebarState(true);
  }

  const onDateChange = (date) => {
    if (date !== null) {
      dateItemsState([date[0], date[1]]);
    } 
  }

  const setLocationButtonState = (event) => {
    cityState(event.currentTarget.dataset.value);
  }

  const onCheckboxChange = (event) => {
    const checkboxValue = event.currentTarget.dataset.value;

    if (event.currentTarget.checked) {
      if (checkboxItems.includes(checkboxValue)) {
        return checkboxValue;
      } else {
        checkboxItems.push(event.currentTarget.dataset.value);
      }
    } else {
      var itemIndex = checkboxItems.indexOf(checkboxValue);

      if (itemIndex > -1) {
        checkboxItems.splice(itemIndex, 1);
      }
    }
  }

  const searchDays = () => {
    fetch('https://geo-json-data.herokuapp.com/geo-json-data')
    .then(response => response.json()) 
    .then((data) => {
      const sortedArrayOfDays = checkboxItems.sort((a, b) => {
        return SortedDays[a] - SortedDays[b]
      })

      var filteredData = [];

      // eslint-disable-next-line 
      sortedArrayOfDays.map((sortedItem) => {
        // eslint-disable-next-line 
        data.features.map((featuredItem) => {
          const dateString = featuredItem.properties.Date;
          const dateStringToDate = new Date(dateString);
          const dateToString = dateStringToDate.toString();

          if (dateToString.includes(sortedItem)) {
            filteredData.push(featuredItem);
          }
        })
      })

      var filteredDataLength = filteredData.length;

      if (filteredDataLength > 0) {
        const date = [
          new Date(filteredData[filteredData.length - 1].properties.Date),
          new Date(filteredData[0].properties.Date)
        ];
  
        dateItemsState(date);
      }
    })
  }

  return (
    <div>
      <div className="position-fixed menu-open">
        <i className="fa fa-bars position-fixed sidebar-toggle-open" aria-hidden="true" onClick={toggleSidebarState} id={!isSidebarOpen ? "app-open-toggle-show" : ""}></i>
      </div>

      <div className="app-sidebar" id={!isSidebarOpen ? "app-sidebar-close" : ""}>
        <ul id="sidebar-list">
          <li className="sidebar-list-item px-2">
            <h2 className="header-logo">hubble</h2> 
            <i className="fa fa-window-close sidebar-toggle-close" aria-hidden="true" onClick={toggleSidebarState}></i>
          </li>
          <li className="sidebar-list-item mt-5 mb-5">
            <h6 className="font-weight-bold px-2 mb-3">Built on:</h6> 

            <ul id="sidebar-campaign-list-items">
              <li className="campaign-list-item active-campaign-list-item">{ brand }</li>
            </ul>
          </li>
          <li className="sidebar-list-item pl-2 mb-5">
            <h6 className="font-weight-bold mb-3">Date - Time Range</h6> 
            <DateRangePicker onChange={onDateChange} value={dateItems} />
          </li>
          <li className="sidebar-list-item px-2 mb-5">
              <h6 className="font-weight-bold mb-3">
                View By City
              </h6>
              <div className="row ml-1 mr-0">
                <div className="col-md-6 col-sm-6 col-xs-12 p-0">
                  <button className={city === "cpt" ? "btn btn-primary btn-text-custom" : "btn btn-secondary btn-text-custom"} type="button" data-value="cpt" onClick={event => setLocationButtonState(event)}>Cape Town</button>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12 p-0">
                  <button className={city === "jhb" ? "btn btn-primary btn-text-custom" : "btn btn-secondary btn-text-custom"} type="button" data-value="jhb" onClick={event => setLocationButtonState(event)}>Johannesburg</button>
                </div>
              </div>
            </li>
            <li className="sidebar-list-item px-2">
              <h6 className="font-weight-bold mb-3">Days Of The Week</h6> 
              <div className="row ml-1 mr-0">
                <div className="col-md-6 col-sm-6 col-xs-12 py-2 px-0">
                  {
                    Days.weekdays.map((value) => {
                      return (
                        <div className="custom-checkbox checkbox-container mb-2" key={value.name}>
                          <input 
                            type="checkbox" id={"weekday-" + value.name} 
                            className="checkbox-input weekday custom-control-input" 
                            data-value={value.value} 
                            onChange={event => onCheckboxChange(event)}
                          />
                          <label htmlFor={"weekday-" + value.name} className="custom-control-label checkbox-label">{value.day}</label>
                        </div>
                      )
                  })}
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12 py-2 px-0">
                  {
                    Days.weekends.map((value) => {
                      return (
                        <div className="custom-checkbox checkbox-container mb-2" key={value.name}>
                          <input 
                            type="checkbox" id={"weekday-" + value.name} 
                            className="checkbox-input weekday custom-control-input" 
                            data-value={value.value} 
                            onChange={event => onCheckboxChange(event)}
                          />
                          <label htmlFor={"weekday-" + value.name} className="custom-control-label checkbox-label">{value.day}</label>
                        </div>
                      )
                  })}
                  
                  <div className="d-flex days-search-container">
                    <button type="button" className="btn btn-primary align-self-end btn-text-custom" onClick={() => searchDays()}>Search Days</button>
                  </div>
                </div>
              </div>
            </li>
        </ul>
      </div>
    </div>
  )
}