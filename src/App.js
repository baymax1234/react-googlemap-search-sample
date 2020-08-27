import React from "react";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} = require("react-google-maps");
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

const GOOGLE_MAP_API_KEY = "123456"
const MapWithASearchBox = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={11}
    defaultCenter={{
      lat: 41.9,
      lng: -87.624
    }}
    defaultOptions={
      {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      }
    }
    onClick={props.onMapClicked}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search your location"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          margin: `12px 12px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`
        }}
      />
    </SearchBox>
    {props.center && (
      <Marker
        position={props.center}
        draggable={true}
        onDragEnd={props.onMarkerPositionChanged}
      />
    )}
  </GoogleMap>
));

class GoogleMapPage extends React.Component {
  static self;

  constructor(props) {
    super(props);

    GoogleMapPage.self = this;
    this.mapRef = React.createRef();
    this.searchRef = React.createRef();

    this.state = {
      center: null,
      address: null,
    };
  }

  onMapMounted = (ref) => {
    this.mapRef = ref;
  }

  onSearchBoxMounted = (ref) => {
    this.searchRef = ref;
  }

  onMarkerPositionChanged = (e) => {
    var geocoder = new window.google.maps.Geocoder();
    var myLatlng = new window.google.maps.LatLng(
      e.latLng.lat(),
      e.latLng.lng()
    );
    GoogleMapPage.self.setState({
      center: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    })
    console.log(
      "Location: ",
      e.latLng.lat(),
      e.latLng.lng()
    );

    geocoder.geocode({ latLng: myLatlng }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          console.log("Address: ", place.formatted_address);
          GoogleMapPage.self.setState({address: place.formatted_address});
        }
      }
    });
  }

  onMapClicked = (e) => {
    var geocoder = new window.google.maps.Geocoder();
    var myLatlng = new window.google.maps.LatLng(
      e.latLng.lat(),
      e.latLng.lng()
    );
    GoogleMapPage.self.setState({
      center: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    })
    console.log(
      "Location: ",
      e.latLng.lat(),
      e.latLng.lng()
    );

    geocoder.geocode({ latLng: myLatlng }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          console.log("Address: ", place.formatted_address);
          GoogleMapPage.self.setState({address: place.formatted_address});
        }
      }
    });
  }

  onPlacesChanged = () => {
    const places = this.searchRef.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    if (places.length > 0) {
      const place = places[0];
      console.log(
        "Location: ",
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      console.log("Address: ", place.formatted_address);
      GoogleMapPage.self.setState({
        center: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        address: place.formatted_address
      })
      GoogleMapPage.self.mapRef.panTo({
        lat:place.geometry.location.lat(), lng: place.geometry.location.lng()
      })
    }
  }

  render() {
    const {center, address} = this.state;
    return (
      <MapWithASearchBox
      center={center}
      onMapMounted = {this.onMapMounted}
      onMapClicked = {this.onMapClicked}
      onSearchBoxMounted = {this.onSearchBoxMounted}
      onPlacesChanged= {this.onPlacesChanged}
      onMarkerPositionChanged = {this.onMarkerPositionChanged}
      />
    );
  }
}

export default GoogleMapPage
