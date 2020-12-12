import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  InfoWindow,
  Rectangle,
} from 'react-google-maps';
import { removeVietnameseTones } from '../../../../helpers/removeVietnameseTones';

import { Input } from 'antd';
import { HeatMapOutlined } from '@ant-design/icons';
const axios = require('axios');
const { Search } = Input;

const Map = ({
  onChangeLocation,
  onChangeMonitoredZone,
  monitoredZoneInit,
}) => {
  const [monitoredZonesDataInit, setMonitoredZonesDataInit] = useState(null);
  const [monitoredZonesData, setMonitoredZonesData] = useState(null);
  const [currentMonitoredZone, setCurrentMonitoredZone] = useState(null);
  const [selectedMonitoredZone, setSelectedMonitoredZone] = useState(null);
  const [positionClick, setPositionClick] = useState(null);
  const [searchText, searchTextValue] = useState('');
  const [initLocation, setInitLocation] = useState({
    lat: 21.017374,
    lng: 105.859521,
  });

  useEffect(() => {
    getMonitoredZone();
  }, []);

  const getMonitoredZone = async () => {
    await axios({
      method: 'GET',
      url: `https://monitoredzoneserver.herokuapp.com/monitoredzone`,
    })
      .then((res) => {
        if (res.data) {
          console.log('data', res.data.content);
          setMonitoredZonesData(res.data.content.zone);
          setMonitoredZonesDataInit(res.data.content.zone);
          console.log(res.data.content.zone);

          //Khởi tạo render ban đầu
          if (res.data.content.zone) {
            setInitLocation({
              lat: parseFloat(res.data.content.zone[0].startPoint.latitude),
              lng: parseFloat(res.data.content.zone[0].startPoint.longitude),
            });
          }

          console.log('monitoredZoneInit', monitoredZoneInit);

          // khởi tạo park nếu đã có sẵn
          if (monitoredZoneInit) {
            let zone = res.data.content.zone.find(
              (element) => element._id == monitoredZoneInit,
            );
            if (zone) {
              setPositionClick({
                lat: (zone.startPoint.latitude + zone.endPoint.latitude) / 2,
                lng: (zone.startPoint.longitude + zone.endPoint.longitude) / 2,
              });
              setCurrentMonitoredZone(zone);
            }
            setSelectedMonitoredZone(monitoredZoneInit);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchOnChange = (e) => {
    searchTextValue(e.target.value);
  };

  const submitSearch = (value) => {
    let data = monitoredZonesDataInit.filter((element) => {
      let textElement = removeVietnameseTones(element.name);
      let textValue = removeVietnameseTones(value);
      if (textElement.includes(textValue)) {
        return element;
      }
    });
    setMonitoredZonesData(data);
  };

  const handleClickMonitoredZones = (zone, e) => {
    setPositionClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });

    setCurrentMonitoredZone(zone);
  };

  const handleCloseMonitoredZones = () => {
    setCurrentMonitoredZone(null);
  };

  const handleMonitoredZoneChange = (monitoredZone, e) => {
    e.preventDefault();
    if (monitoredZone) {
      onChangeMonitoredZone(monitoredZone._id);
      searchTextValue(monitoredZone.code + ' - ' + monitoredZone.name);
      setSelectedMonitoredZone(monitoredZone._id);
    } else {
      onChangeMonitoredZone(undefined);
      searchTextValue('');
      setSelectedMonitoredZone(undefined);
    }
  };

  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={initLocation} // Hiển thị ra vùng trung tâm ban đầu
    >
      <Search
        placeholder="Nhập vào miền giám sát"
        onChange={searchOnChange}
        onSearch={submitSearch}
        enterButton
        style={{ position: 'absolute', top: '10px', left: '10px', width: 250 }}
        value={searchText}
      />
      {/* {monitoredZonesData &&
        monitoredZonesData.map((zone) => (
          <Rectangle
            defaultBounds={
              new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(
                  zone.startPoint.latitude,
                  zone.startPoint.longitude,
                ),
                new window.google.maps.LatLng(
                  zone.endPoint.latitude,
                  zone.endPoint.longitude,
                ),
              )
            }
          />
        ))} */}
      {console.log('monitoredZonesData', initLocation)}

      {monitoredZonesData &&
        monitoredZonesData.map((zone) => (
          <Rectangle
            key={zone._id}
            defaultBounds={
              new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(
                  zone.startPoint.latitude,
                  zone.startPoint.longitude,
                ),
                new window.google.maps.LatLng(
                  zone.endPoint.latitude,
                  zone.endPoint.longitude,
                ),
              )
            }
            onClick={(e) => handleClickMonitoredZones(zone, e)}
            options={
              selectedMonitoredZone === zone._id
                ? {
                    strokeColor: '#d34052',
                    fillColor: '#d34052',
                    strokeOpacity: '0.5',
                    strokeWeight: '2',
                  }
                : {
                    strokeColor: '#d34052',
                    fillColor: '#70b8fb',
                    strokeOpacity: '0.5',
                    strokeWeight: '2',
                  }
            }
          />
        ))}

      {currentMonitoredZone && (
        <InfoWindow
          position={{
            lat: positionClick.lat,
            lng: positionClick.lng,
          }}
          onCloseClick={() => {
            handleCloseMonitoredZones();
          }}
        >
          <div>
            <h3>{currentMonitoredZone.name}</h3>
            <div>Mã miền g/s: {currentMonitoredZone.code}</div>
            <div>
              Độ cao an toàn: &ensp;
              <span style={{ color: 'red' }}>
                {currentMonitoredZone.minHeight}
              </span>
              -
              <span style={{ color: 'red' }}>
                {currentMonitoredZone.maxHeight}
              </span>
              (m)
            </div>
            <div
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {currentMonitoredZone._id === selectedMonitoredZone ? (
                <button onClick={(e) => handleMonitoredZoneChange('', e)}>
                  <HeatMapOutlined /> &ensp;
                  <a>Bỏ chọn miền g/s này</a>
                </button>
              ) : (
                <button
                  onClick={(e) =>
                    handleMonitoredZoneChange(currentMonitoredZone, e)
                  }
                >
                  <HeatMapOutlined /> &ensp;
                  <a>Chọn miền g/s này</a>
                </button>
              )}
              {/* <button
                onClick={(e) =>
                  handleMonitoredZoneChange(currentMonitoredZone, e)
                }
              >
                <HeatMapOutlined /> &ensp;
                <a>Chọn miền g/s này</a>
              </button> */}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const WrappedMap = withScriptjs(withGoogleMap(Map));
export default WrappedMap;
