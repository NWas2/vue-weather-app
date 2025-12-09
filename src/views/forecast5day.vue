<template>
  <div :style="backgroundStyle" class="container">
    <h1>5-Day Forecast for {{ weather?.location?.name || city }}</h1>

    <div v-if="weather?.forecast?.forecastday">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Condition</th>
            <th>High (°C)</th>
            <th>Low (°C)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day,index) in weather.forecast.forecastday" :key="index">
            <td>{{ day.date }}</td>
            <td>{{ day.day.condition.text }}</td>
            <td>{{ day.day.maxtemp_c }}</td>
            <td>{{ day.day.mintemp_c }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else style="margin-top:20px;">
      <p>Loading forecast data...</p>
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
      weather: null
    };
  },
  computed: {
    backgroundStyle() {
      if (!this.weather) 
        return { 
          backgroundImage: `url(${defaultImg})`, 
          backgroundSize: 'cover', 
          minHeight: '100vh', 
          color: 'white', 
          padding: '20px' 
        };

      const condition = this.weather.current.condition.text.toLowerCase();
      const isDay = this.weather.current.is_day === 1;
      let bg = defaultImg;

      if (condition.includes('clear')) bg = isDay ? clearDay : clearNight;
      else if (condition.includes('rain') || condition.includes('drizzle')) bg = rain;
      else if (condition.includes('snow')) bg = snow;
      else if (condition.includes('cloud')) bg = cloudy;

      return { 
        backgroundImage: `url(${bg})`, 
        backgroundSize: 'cover', 
        minHeight: '100vh', 
        color: 'white', 
        padding: '20px' 
      };
    }
  },
  methods: {
    async fetchForecast(city) {
      if (!city) return;
      const key = '1cd531e95642447d88b213513250812';
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=5`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          alert(data.error.message);
          this.weather = null;
          return;
        }

        this.weather = data;
      } catch (err) {
        console.error(err);
        alert('Failed to load forecast data');
      }
    }
  },
  async created() {
    this.city = this.$route.query.city || 'New York';
    await this.fetchForecast(this.city);
  },
  watch: {
    '$route.query.city': {
      handler(newCity) {
        if (newCity) this.fetchForecast(newCity);
      },
      immediate: true
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: rgba(255,255,255,0.2);
  color: white;
}

th, td {
  border: 1px solid white;
  padding: 8px;
  text-align: center;
}
</style>
