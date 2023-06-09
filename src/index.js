import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryContainer = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
  event.preventDefault();
  let textInput = event.target.value.trim();

  resetMarkup();
  if (textInput === '') {
    return;
  }

  fetchCountries(textInput).then(renderList).catch(onFetchError);
}

function renderList(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (country.length >= 2 && country.length <= 10) {
    const createdMarkups = country
      .map(({ flags, name }) => {
        return `<li><img src = "${flags.svg}" alt = "${name.official}" width ="60", height = "40">
        <h1><b>${name.official}</b></h1></li>`;
      })
      .join('');

    countryList.innerHTML = createdMarkups;
  } else if (country.length === 1) {
    const createdMarkupInfo = country.map(
      ({ name, flags, population, capital, languages }) => {
        return `<img src = "${flags.svg}" alt = "${
          name.official
        }" width ="60", height = "40">
        <h1><b> ${name.official}</b></h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>`;
      }
    );
    countryContainer.innerHTML = createdMarkupInfo;
  }
}

function onFetchError(error) {
  setTimeout(() => (inputEl.value = ''), 1200);

  Notiflix.Notify.failure('Oops, there is no country with that name');
  if (error.message === '404') {
    console.warn(error);
  }
}

function resetMarkup() {
  countryContainer.innerHTML = '';
  countryList.innerHTML = '';
}
