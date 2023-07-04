// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputWilaya = document.querySelector('.form__input--wilaya');
const inputLineTransport = document.querySelector(
  '.form__input--linetransport'
);
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/*Classes*/

class stationBus {
  constructor(Libelle, duration, coords, type) {
    this.Libelle = Libelle;
    this.duration = duration;
    this.coords = coords;
    this.type = type;
  }
}

class lineTransport {
  constructor(Num, Libelle, duration, allBusStation, type) {
    this.Num = Num;
    this.Libelle = Libelle;
    this.duration = duration;
    this.stations = allBusStation; // [] list of station bus
    this.type = type;
  }
}
class wilaya {
  constructor(Num, Libelle, allLinesTransport, type) {
    this.Num = Num;
    this.Libelle = Libelle;
    this.stations = allLinesTransport; // [] list of lines of Transportation
    this.type = type;
  }
  static renderWilayaInput() {
    wilayasAlgeries.forEach(item =>
      inputWilaya.insertAdjacentHTML(
        'beforeend',
        `<option value="${item.Code}"  >${item.Libelle}</option> `
      )
    );
  }
}