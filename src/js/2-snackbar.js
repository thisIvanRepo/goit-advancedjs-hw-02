import iziToast from 'izitoast';
import { refsSnackbar } from './refs';

const { form, delay } = refsSnackbar;
let delayTime = null;

form.addEventListener('submit', event => {
  event.preventDefault();
  delayTime = parseInt(delay.value) > 0 ? parseInt(delay.value) : 0;

  const selectedState = document.querySelector('[name="state"]:checked').value;

  simulatePromise(selectedState, delayTime)
    .then(message => {
      iziToast.success({
        message,
        position: 'topRight',
      });
    })
    .catch(message => {
      iziToast.error({
        message,
        position: 'topRight',
      });
    });
});

function simulatePromise(state, daleyValue) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(message(state, daleyValue));
      } else {
        reject(message(state, daleyValue));
      }
    }, delayTime);
  });
}

function message(stateValue, delaySet) {
  return `${stateValue} promise in ${delaySet} ms`;
}
