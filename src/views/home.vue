<template>
  <div :style="backgroundStyle" class="container">
    <h1>Weather App</h1>

    <!-- Search bar -->
    <input v-model="city" placeholder="Enter city" />
    <button @click="getWeather">Search</button>

    <!-- Display current weather -->
    <div v-if="weather?.location && weather?.current" style="margin-top:20px;">
      <h2>{{ weather.location.name }}, {{ weather.location.country }}</h2>
      <p>{{ weather.current.condition.text }} - {{ weather.current.temp_c }}°C</p>
      <router-link :to="{ path:'/hourly', query:{city:weather.location.name} }">View Hourly Chart</router-link> |
      <router-link :to="{ path:'/5day', query:{city:weather.location.name} }">View 5-Day Forecast</router-link>
    </div>

    <!-- Saved locations -->
    <div v-if="locations.length" style="margin-top:20px;">
      <h3>Saved Locations:</h3>
      <ul>
        <li v-for="(loc,index) in locations" :key="index">
          <span @click="getWeather(loc)" style="cursor:pointer;color:blue">{{ loc }}</span>
          <button @click="removeLocation(index)">Delete</button>
        </li>
      </ul>
      <button @click="saveLocation">Save Current Location</button>
    </div>
  </div>
</template>

<script>
import clearDay from '../assets/clear-day.jpg';
import clearNight from '../assets/clear-night.jpg';
import rain from '../assets/rain.jpg';
import cloudy from '../assets/cloudy.jpg';
import snow from '../assets/snow.jpg';
import defaultImg from '../assets/default.jpg';

export default {
  data() {
    return {
      city: '',
      weather: null,
      locations: JSON.parse(localStorage.getItem('locations')) || []
    };
  },
  computed: {
    backgroundStyle() {
      if (!this.weather) return { backgroundImage: `url(${defaultImg})`, backgroundSize:'cover', minHeight:'100vh', color:'white', padding:'20px' };

      const condition = this.weather.current.condition.text.toLowerCase();
      const isDay = this.weather.current.is_day === 1;
      let bg = defaultImg;

      if (condition.includes('clear')) bg = isDay ? clearDay : clearNight;
      else if (condition.includes('rain') || condition.includes('drizzle')) bg = rain;
      else if (condition.includes('snow')) bg = snow;
      else if (condition.includes('cloud')) bg = cloudy;

      return { backgroundImage: `url(${bg})`, backgroundSize: 'cover', minHeight: '100vh', color:'white', padding:'20px' };
    }
  },
  methods: {
    async getWeather(inputCity) {
      const cityToSearch = inputCity || this.city;
      if (!cityToSearch) return;

      const key = '1cd531e95642447d88b213513250812';
      const possibleFormats = [
        cityToSearch,
        `${cityToSearch},UK`,
        `${cityToSearch},US`,
        `${cityToSearch},CA`
      ];

      let success = false;
      for (const format of possibleFormats) {
        try {
          const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${format}&days=5`;
          const res = await fetch(url);
          const data = await res.json();

          if (!data.error) {
            this.weather = data;
            success = true;
            break;
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (!success) {
        alert('No matching location found. Please try a different city.');
        this.weather = null;
      }
    },
    saveLocation() {
      if (this.weather && !this.locations.includes(this.weather.location.name)) {
        this.locations.push(this.weather.location.name);
        localStorage.setItem('locations', JSON.stringify(this.locations));
      }
    },
    removeLocation(index) {
      this.locations.splice(index, 1);
      localStorage.setItem('locations', JSON.stringify(this.locations));
    }
  }
};
</script>

<style>
.container {
  font-family: Arial, sans-serif;
  color: white;
  padding: 20px;
}

input {
  padding: 5px;
  margin-right: 5px;
}

button {
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
}
</style>
