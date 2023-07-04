'use strict';

/* the main class */
class App {
  #map;
  mapo;
  #wilayas = [];
  #workouts;
  currentSelectedWilaya;
  currentSelectedLigneInWilaya;
  constructor() {
    this._getPosition();
    wilaya.renderWilayaInput();
    inputWilaya.addEventListener('change', this._selectWilaya.bind(this));
    inputLineTransport.addEventListener(
      'change',
      this._renderSelectedLigneOfTransport.bind(this)
    );

    containerStations.addEventListener(
      'click',
      this._focusOnBusStation.bind(this)
    );
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this));
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    this.#map = L.map('map', {
      maxZoom: 18,
      minZoom: 6,
      zoomControl: false,
    }).setView([latitude, longitude], 13);
    this.mapo = this.#map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.#map);

    // Showing the form to edit he current position
    // this.#map.on('click', this._showForm.bind(this));
  }
  _renderStationsMarkers(wilayaCode, lineCode) {
    ligne.forEach(station => {
      station.Libelle.toLowerCase() !== 'none' &&
        station.WilayaCode === wilayaCode &&
        station.LigneCode === lineCode &&
        this._renderStationMarker(station);
    });
  }
  _renderStationMarker(station) {
    let myIcon = new L.Icon({
      iconUrl:
        station.type !== 'station'
          ? 'img/markers/marker-icon-green.png'
          : 'img/markers/marker-icon-grey.png',
      shadowUrl: 'img/markers/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    let marker = L.marker(station.coords, { icon: myIcon }) //, { icon: myIcon }
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          // maxWidth: 250,
          // minWidth: 100,
          autoClose: true,
          closeOnClick: true,
          className: `${station.type}-popup`,
          closeButton: false,
          autoClose: true,
        })
      )
      .setPopupContent(`${station.Libelle}`);
    // .openPopup();
    marker.on('mouseover', function (ev) {
      marker.openPopup();
    });

    // render bus station on the left side bar
    this._renderBusStationSideBar(station);
  }
  _renderStationsPath(wilayaCode, lineCode) {
    let lineCoords = [];
    ligne.forEach(
      station =>
        station.WilayaCode === wilayaCode &&
        station.LigneCode === lineCode &&
        lineCoords.push(station.coords)
    );

    const polyline = L.polyline(lineCoords, { color: 'green' }).addTo(
      this.#map
    );
    // zoom the map to the polyline

    let offsetValue = 0.007;
    let clonedPolyline = L.polyline(polyline.getLatLngs());
    const shiftedLatLngs = clonedPolyline.getLatLngs().map(latLng => {
      return L.latLng(latLng.lat, latLng.lng + offsetValue);
    });
    clonedPolyline.setLatLngs(shiftedLatLngs);

    this.#map.flyToBounds(clonedPolyline.getBounds(), { duration: 1 });
  }
  _clearMap() {
    this.#map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.#map.removeLayer(layer);
      } else if (layer instanceof L.Path) {
        this.#map.removeLayer(layer);
      }
    });
    containerStations.innerHTML = '';
  }
  _renderSelectedLigneOfTransport() {
    console.log(inputLineTransport.value);
    if (+inputLineTransport.value === 0) return;
    //clear the map first
    this._clearMap();
    // draw markers
    this._renderStationsMarkers(+inputWilaya.value, +inputLineTransport.value);
    // draw line between markers
    this._renderStationsPath(+inputWilaya.value, +inputLineTransport.value);
  }
  _selectWilaya(ev) {
    this._clearMap();

    this.currentSelectedWilaya = new wilaya(
      +inputWilaya.value,
      inputWilaya.options[inputWilaya.selectedIndex].dataset.libelle,
      ligne.filter(line => line.WilayaCode === +inputWilaya.value),
      'unkown'
    );
    console.log(this.currentSelectedWilaya);
    wilaya.renderLigneTransportOfSelectedWilaya(this.currentSelectedWilaya.Num);
  }
  _renderBusStationSideBar(busStation) {
    // literal
    let htmlElement = `<div class="station" data-uniqueid='${
      busStation.UniqueID
    }'>
    <img src="img/station.png" alt="" />
    <span> ${busStation.Libelle} </span>
    <img class="pathinto ${
      busStation.type === 'end' ? 'hidden' : ''
    }" src="img/BetweenStation.png" alt="" />
  </div>`;
    containerStations.insertAdjacentHTML('beforeend', htmlElement);
  }
  _focusOnBusStation(ev) {
    // get the coloses parent has unique id
    let closestParent = ev.target.closest('.station');

    // get the unique ID
    let uniqueID = closestParent.dataset.uniqueid;

    // FIND THE ID in the DB
    let selectedBusStation = ligne.find(x => x.UniqueID === uniqueID);

    // focus on this point

    this.#map.flyTo(selectedBusStation.coords, 17, {
      duration: 2,
    });

    // popup the name of the bus station

    this.#map.eachLayer(layer => {
      if (
        layer instanceof L.Marker &&
        layer.getLatLng().lat === selectedBusStation.coords[0] &&
        layer.getLatLng().lng === selectedBusStation.coords[1]
      ) {
        layer.openPopup();
      }
    });
  }
}

const mapify = new App();
