// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const form2 = document.querySelector('.form2');
const logo = document.querySelector('.logo');
const sidebar = document.querySelector('.sidebar');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputWilaya = document.querySelector('.form__input--wilaya');
const inputWilaya2 = document.querySelector('.form__input--wilaya2');
const inputBusLineName = document.querySelector('.input--busLineName');
const inputBusStationName = document.querySelector('.input--busStationName');
const inputLineTransport = document.querySelector(
  '.form__input--linetransport'
);
const containerStations = document.querySelector('.stations');
const containerStations2 = document.querySelector('.stations-added');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');

/*Classes*/

class stationBus {
  constructor(Libelle, duration, coords, type) {
    this.Libelle = Libelle;
    this.duration = duration;
    this.coords = coords;
    this.type = type;
    this.UniqueID = coords;
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
    //.wilaya-bolder

    wilayasAlgeries.forEach(item => {
      let wilayaHasTransport = ligne.some(
        station => station.WilayaCode === item.Code
      );
      // console.log(item.Libelle + wilayaHasTransport);
      inputWilaya.insertAdjacentHTML(
        'beforeend',
        `<option value="${item.Code}" ${
          wilayaHasTransport ? 'class="wilaya-bolder"' : 'disabled'
        }  >${item.Libelle}</option> `
      );
      inputWilaya2.insertAdjacentHTML(
        'beforeend',
        `<option value="${item.Code}"   >${item.Libelle}</option> `
      );
    });
  }
  static renderLigneTransportOfSelectedWilaya(currWilaya) {
    let currentWilayaCode = currWilaya; //this.currentSelectedWilaya.Num;
    let LigneTransportUniqueValue = Array.from(
      new Set(
        ligne.map(function (line) {
          if (line.WilayaCode === currentWilayaCode) return line.LigneCode;
        })
      )
    );
    // console.log(LigneTransportUniqueValue);

    inputLineTransport.innerHTML =
      '<option  value="0" Selected >خط نقل رقم</option> ';

    if (LigneTransportUniqueValue?.[0] !== undefined)
      LigneTransportUniqueValue.forEach(item => {
        //.wilaya-bolder

        inputLineTransport.insertAdjacentHTML(
          'beforeend',
          `<option  value="${item}" > خط رقم ${item}</option> `
        );
      });
  }
}
