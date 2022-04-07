import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  };

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(e) {
  e.preventDefault();

    const inputText = refs.searchBox.value.trim();
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    if (inputText) {
        fetchCountries(inputText)
            .then(renderCountryCard)
            .catch(error => {
                return Notiflix.Notify.failure('Oops, there is no country with that name');
              
            })
    }

    function renderCountryCard(data) {    
        if (data.length > 10) {
            return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');      
        } 

        countriesMarkup(data)
    } 

    function countriesMarkup(data) {
        const markupData = data
            .map(({ flags: { svg }, name: { official } }) => {
                return `
                <li><img src="${svg}" 
                alt="${official}" 
                width="60"
                height="40"/>   ${official}</li>
                `;
            })
            .join('');
        
            if (data.length === 1) {
            const languages = Object.values(data[0].languages).join(', ');

            const markupInfo = `<ul>
        <li>Capital: <p>${data[0].capital}</p></li>
        <li>Population: <p>${data[0].population}</p></li>
        <li>Languages: <p>${languages}</p></li>
        </ul>`;

        refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
        }
        return refs.countryList.insertAdjacentHTML('beforeend', markupData);
    }

}