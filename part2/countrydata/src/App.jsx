/* Ex2.18 to Ex2.20*/

import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchQuery = props => {
  return(
    <div>
      find countries <input value={props.query} onChange={props.handleQueryChange}/>
    </div>
  )
}

// Receive capital as props
const Weather = ({ capital }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const [weatherData, setWeatherData] = useState(null) 

  useEffect(() => {
    // Clear old weather when the capital changes
    setWeatherData(null)

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather` + 
        `?q=${capital}` +
        `&appid=${apiKey}` +
        `&units=metric`)
      .then(response => 
        setWeatherData(response.data)
      )
      .catch(error =>
        console.error('Error fetching weather data', error)
      )
  }, [capital, apiKey])

  if (!weatherData) {
    return <p>Loading weather...</p>
  }
  console.log(weatherData)

  const weatherIconCode = weatherData.weather[0].icon
  const weatherIconUrl = 
    `https://openweathermap.org/payload/api/media/file/${weatherIconCode}.png`
  // console.log('Weather data', weatherData)
  const tempInCelsius = weatherData.main.temp
  const windSpeed = weatherData.wind.speed
  return(
    <div>
      <div>Temperature {tempInCelsius} Celsius</div>
      <img src={weatherIconUrl} alt={weatherData.weather[0].description}/>
      <div>Wind {windSpeed} m/s</div>
    </div>
  )
}

const CountryDetail = props => {  
    return(
    <>
      <h1>{props.country.name.common}</h1>
      <p>
        Capital {props.country.capital} <br />
        Area {props.country.area}
      </p>
      <h2>Languages</h2>
      <ul>
        {props.countryLanguages} 
      </ul>
      <div>
        <img src={props.country.flags.png} alt={props.country.flags.alt}/>
      </div>
      <Weather capital={props.country.capital}/>
    </>
    )
}

const ShowInfo = props => {
  // Prevent showing anything when the page is first loaded
  if (props.query.trim() === '') {
    return null
  }

  const arrLength = props.filteredCountries.length
  // console.log(arrLength)
  if (arrLength > 10) {
    return(
      <div>
      Too many matches, specify another filter
      </div>
    )
  }
  else if (arrLength > 1) {
    const countriesName = props.filteredCountries.map(country => {
      return (
      <div key={country.cca3}>
        <span>
          {country.name.common}{' '}
        </span>
        <button onClick={() => props.handleShowClick(country.name.common)}>
          show
        </button>
      </div>
      )
    })
    // console.log(countriesName)
    return(
      <div>
        {countriesName}
      </div>
    )
  }
  else if (arrLength == 1) {
    // When there is one country left, the props.filteredCountries becomes a one-object array.
    const country = props.filteredCountries[0]

    // Get a plain list of language names from the country object
    const languageList = Object.values(country.languages)
    const countryLanguages = languageList.map(lang => {
      return(
        <li key={lang}>{lang}</li>
      )
    })

    // console.log('Country Languages', countryLanguages)
    return(
      <CountryDetail 
        country={country} 
        countryLanguages={countryLanguages}
      />
    )
  }
  else {
    return
  }
}

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  // Fetching data of all countries
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching country data: ', error)
      })
  }, [])

  // Filter the list based on query
  const filteredCountries = allCountries.filter(country => 
    country.name.common.toLowerCase().includes(query.toLowerCase()))

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  // Update the main query to just one country
  const handleShowClick = (countryName) => {
    setQuery(countryName)
  }

  return (
    <div>
      <h2>Country Data</h2>
      <SearchQuery query={query} handleQueryChange={handleQueryChange}/>
      <ShowInfo 
        filteredCountries={filteredCountries} 
        query={query}
        handleShowClick={handleShowClick}
      />
    </div>
  )
}

export default App