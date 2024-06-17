import React from "react";
import GoogleMapReact from "google-map-react";

const Pin = () => {
  return (
    <div
      style={{
        color: "white",
        fontSize: 50,
        position: "relative",
        top: -50,
        left: -25,
      }}
    >
      <div>📍</div>
    </div>
  );
};
const Map = (props) => {
  return (
    <div style={{ height: "20rem", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyC4mEb02DszcVnKttfu5YfBijoNxBmH4Zk" }}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
        defaultZoom={15}
      >
        <Pin lat={props.lat} lng={props.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
