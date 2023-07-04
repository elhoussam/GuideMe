'use strict';

console.log(ligne);

class workout {
  #id = 'should use special API to generate that ID';

  #date = new Date();

  constructor(name, distance, duration, coords, type) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.type = type;
  }
}

class Running extends workout {
  #cadence;
  constructor(name, distance, duration, coords, cadence) {
    super(name, distance, duration, coords, 'running');
    this.#cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends workout {
  #cadence;
  constructor(name, distance, duration, coords, elevationGain) {
    super(name, distance, duration, coords, 'cycling');

    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/* the main class */
class App {
  #map;
  mapo;
  #mapEvent;
  testPoliline;
  #wilayas = [];
  #workouts;
  currentSelectedWilaya;
  currentSelectedLigneInWilaya;
  constructor() {
    this._getPosition();
    wilaya.renderWilayaInput();
    form.addEventListener('submit', this._newWorkout.bind(this));
    // inputType.addEventListener('change', this._toggleElevationField);
    inputWilaya.addEventListener('change', this._selectWilaya.bind(this));
    inputLineTransport.addEventListener(
      'change',
      this._renderSelectedLigneOfTransport.bind(this)
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
    }).setView([latitude, longitude], 17);
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
    // let i;
    // for (i in this.#map._layers) {
    //   if (this.#map._layers[i]._path != undefined) {
    //     try {
    //       this.#map.removeLayer(this.#map._layers[i]);
    //     } catch (e) {
    //       console.log('problem with ' + e + this.#map._layers[i]);
    //     }
    //   }
    // }

    this.#map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.#map.removeLayer(layer);
      } else if (layer instanceof L.Path) {
        this.#map.removeLayer(layer);
      }
    });
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
  _showForm(mapE) {
    console.log(this);
    this.#mapEvent = mapE;

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // unhide form
    form.classList.remove('hidden');

    // focus on first field
    inputDistance.focus();
    // check input
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(ev) {
    ev.preventDefault();

    // validate field form HELPING FUNCTION

    const fieldNotNumber = (...fileds) =>
      fileds.every(field => Number.isFinite(field));

    const NumberArePositive = (...fileds) => fileds.every(field => field > 0);

    // Get data from form
    const type = inputType.value;
    const distance = inputDistance.value;
    const duration = +inputDuration.value;

    let workout;

    const { lat, lng } = this.#mapEvent.latlng;
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // if (!fieldNotNumber(distance, duration, cadence)) {
      //   alert('Values not number');
      //   return;
      // } else if (!NumberArePositive(distance, duration, cadence)) {
      //   alert('NOT positive value');
      //   return;
      // }
      workout = new Running('running', distance, duration, [lat, lng], cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!fieldNotNumber(distance, duration, elevation)) {
        alert('Values not number');
        return;
      } else if (!NumberArePositive(distance, duration, elevation)) {
        alert('NOT positive value');
        return;
      }

      workout = new Cycling(
        'cycling',
        distance,
        duration,
        [lat, lng],
        elevation
      );
    }

    myworkout = workout;
    this.#workouts.push(workout);
    console.log(this.#workouts);
    //add marker
    this._renderWorkoutMarker(workout);
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
    this._renderLigneTransportOfSelectedWilaya();
  }
  _renderLigneTransportOfSelectedWilaya() {
    let currentWilayaCode = this.currentSelectedWilaya.Num;
    let LigneTransportUniqueValue = Array.from(
      new Set(
        ligne.map(function (line) {
          if (line.WilayaCode === currentWilayaCode) return line.LigneCode;
        })
      )
    );
    console.log(LigneTransportUniqueValue);

    inputLineTransport.innerHTML =
      '<option  value="0" Selected >خط نقل رقم</option> ';

    if (LigneTransportUniqueValue?.[0] !== undefined)
      LigneTransportUniqueValue.forEach(item =>
        inputLineTransport.insertAdjacentHTML(
          'beforeend',
          `<option  value="${item}" > خط رقم ${item}</option> `
        )
      );
  }
}

const mapify = new App();
