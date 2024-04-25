// import weather from '../data/current-weather.js'
import { formatDate, formatTemp } from './utils/format-data.js'
import { weatherConditionsCodes } from './constants.js'
import { getLatLon } from './geolocation.js'
import { getCurrentWeather } from './services/weather.js'

//loader function
function showCurrentWeather ($app, $loading){
    $app.hidden = false
    $loading.hidden = true

}

//date function
function setCurrentDate($el){
    const date = new Date()
    const formattedDate = formatDate(date)
    $el.textContent = formattedDate
}

//city function
function setCurrentCity($el, city) {
    $el.textContent = city 
}

//temp function
function setCurrentTemp($el, temp) {
    $el.textContent = formatTemp(temp)
}

//backround function
function solarStatus(sunsetTime, sunriseTime) {
    const currentHours = new Date().getHours()
    const sunsetHours = sunsetTime.getHours()
    const sunriseHours = sunriseTime.getHours()

    if (currentHours > sunsetHours || currentHours < sunriseHours) {
        return 'night'
    }
    return 'morning'
}

function setBackground($el, conditionCode, solarStatus) {
    const weatherType = weatherConditionsCodes[conditionCode]
    const size = window.matchMedia ('(-webkit-min-device-pixel-ratio: 2)').matches ? '@2x' : ''
    $el.style.backgroundImage = `url(./images/${solarStatus}-${weatherType}${size}.jpg)`
}

function configCurrentWeather(weather){
    const $app = document.querySelector('#app')
    const $loading = document.querySelector('#loading')

    //loader
    showCurrentWeather($app,$loading )
    //date
    const $CurrentWeatherDate = document.querySelector('#current-weather-date')
    setCurrentDate($CurrentWeatherDate)

    //city
    const $currentWeatherCity = document.querySelector('#current-weather-city')
    const city = weather.name
    setCurrentCity($currentWeatherCity, city)

    //temp
    const $CurrentWeatherTemp = document.querySelector('#current-weather-temp')
    const temp = weather.main.temp
    setCurrentTemp($CurrentWeatherTemp, temp)

    //backround
    const sunriseTime = new Date (weather.sys.sunrise *1000)
    const sunsetTime = new Date (weather.sys.sunset *1000)
    
    const conditionCode = String(weather.weather[0].id).charAt(0)
    setBackground($app, conditionCode, solarStatus(sunriseTime, sunsetTime))

    
}

export default async function currentWeather() {
    //GEO//API-WEATHER//CONFI
    
    // console.log('esto pasa ANTES de getCurrentPosition')
    const { lat, lon, isError } = await getLatLon()
    if (isError) return console.log('Ah ocurrido un error ubicandote')
    // console.log(lat, lon)

    const { isError: currentWeatherError , data: weather } = await getCurrentWeather(lat, lon)
    if (currentWeatherError) return console.log("ho ha ocurrido un error traiendo los datos del clima")
    configCurrentWeather(weather)
}

