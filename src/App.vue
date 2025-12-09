<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/hourly">Hourly</router-link> |
      <router-link to="/5day">5-Day Forecast</router-link>
    </nav>
    <router-view />   <!-- <-- This renders Home.vue, Hourly.vue, or Forecast5Day.vue -->
  </div>

  <div :class="backgroundClass" class="app-container">
    <h1 class="title">Weather App</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input v-model="city" placeholder="Enter city" class="input-field"/>
      <button @click="getWeather" class="btn">Search</button>
    </div>

    <!-- Current Weather -->
    <div v-if="weather" class="weather-card">
      <h2>{{ weather.location.name }}, {{ weather.location.country }}</h2>
      <p>Condition: {{ weather.current.condition.text }}</p>
      <p>Temperature: {{ weather.current.temp_c }}°C</p>
      <p>High: {{ weather.forecast.forecastday[0].day.maxtemp_c }}°C</p>
      <p>Low: {{ weather.forecast.forecastday[0].day.mintemp_c }}°C</p>
    </div>

    <!-- Saved Locations -->
    <div v-if="locations.length" class="saved-locations">
      <h3>Saved Locations:</h3>
      <ul>
        <li v-for="(loc, index) in locations" :key="index">
          <span @click="getWeather(loc)" class="location-item">{{ loc }}</span>
          <button @click="removeLocation(index)" class="delete-btn">Delete</button>
        </li>
      </ul>
      <button @click="saveLocation" class="btn save-btn">Save Current Location</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: '',
      weather: null,
      locations: JSON.parse(localStorage.getItem('locations')) || [],
    };
  },
  computed: {
    backgroundClass() {
      if (!this.weather) return 'bg-default';
      const condition = this.weather.current.condition.text.toLowerCase();
      if (condition.includes('rain')) return 'bg-rain';
      if (condition.includes('cloud')) return 'bg-cloud';
      return 'bg-sunny';
    }
  },
  methods: {
    async getWeather(cityName) {
      const query = cityName || this.city;
      const key = '1cd531e95642447d88b213513250812';
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${query}&days=5&aqi=no&alerts=no`;
      const response = await fetch(url);
      const data = await response.json();
      this.weather = data;
      this.city = '';
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
/* App container */
.app-container {
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  transition: background 0.5s ease;
}

/* Titles */
.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Search bar */
.search-bar {
  margin-bottom: 20px;
}

.input-field {
  padding: 8px;
  font-size: 1rem;
}

.btn {
  padding: 8px 12px;
  margin-left: 10px;
  font-size: 1rem;
  cursor: pointer;
}

/* Weather Card */
.weather-card {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* Saved Locations */
.saved-locations ul {
  list-style: none;
  padding-left: 0;
}

.location-item {
  cursor: pointer;
  color: blue;
  margin-right: 10px;
}

.delete-btn {
  cursor: pointer;
  color: red;
  background: none;
  border: none;
}

.save-btn {
  margin-top: 10px;
}

/* Background classes */
.bg-default { background-color: #d3d3d3; }
.bg-sunny { background-color: #f9d71c; }
.bg-cloud { background-color: #b0c4de; }
.bg-rain { background-color: #6ca0dc; }
</style>
