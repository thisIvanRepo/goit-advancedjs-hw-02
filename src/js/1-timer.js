import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import { refs } from './refs.js';

const { input, days, hours, minutes, seconds, btnStart } = refs;

let userSelectedDate = null;
let interval = null;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectDate = selectedDates[0];

    if (selectDate < new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      btnStart.setAttribute('disabled', 'true');
    } else {
      userSelectedDate = selectDate;
      btnStart.removeAttribute('disabled');
    }
  },
});

btnStart.addEventListener('click', () => {
  start();
});

function start() {
  interval = setInterval(() => {
    const diff = userSelectedDate - Date.now();
    btnStart.setAttribute('disabled', '');
    input.setAttribute('disabled', '');

    if (diff < 0) {
      input.removeAttribute('disabled');
      btnStart.removeAttribute('disabled');

      stop();
      return;
    }

    const timeComponent = convertMs(diff);

    days.textContent = pad(timeComponent.days);
    hours.textContent = pad(timeComponent.hours);
    minutes.textContent = pad(timeComponent.minutes);
    seconds.textContent = pad(timeComponent.seconds);
  }, 1000);
}

function stop() {
  clearInterval(interval);

  days.textContent = '00';
  hours.textContent = '00';
  minutes.textContent = '00';
  seconds.textContent = '00';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
