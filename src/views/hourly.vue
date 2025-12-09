<template>
  <div :style="backgroundStyle" class="container">
    <h1>Hourly Forecast for {{ weather?.location?.name || city }}</h1>

    <div v-if="chartData">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div v-else style="margin-top: 20px">
      <p>Loading hourly data...</p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import clearDay from '../assets/clear-day.jpg'
import clearNight from '../assets/clear-night.jpg'
import rain from '../assets/rain.jpg'
import cloudy from '../assets/cloudy.jpg'
import snow from '../assets/snow.jpg'
import defaultImg from '../assets/default.jpg'

export default {
  data() {
    return {
      city: '',
      weather: null,
      chartData: null,
      chartOptions: null,
      chartInstance: null,
    }
  },
  computed: {
    backgroundStyle() {
      if (!this.weather)
        return {
          backgroundImage: `url(${defaultImg})`,
          backgroundSize: 'cover',
          minHeight: '100vh',
          color: 'white',
          padding: '20px',
        }

      const condition = this.weather.current.condition.text.toLowerCase()
      const isDay = this.weather.current.is_day === 1
      let bg = defaultImg

      if (condition.includes('clear')) bg = isDay ? clearDay : clearNight
      else if (condition.includes('rain') || condition.includes('drizzle')) bg = rain
      else if (condition.includes('snow')) bg = snow
      else if (condition.includes('cloud')) bg = cloudy

      return {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
      }
    },
  },
  methods: {
    async fetchWeatherAndHourly(city) {
      if (!city) return // skip if no city

      const key = '1cd531e95642447d88b213513250812'
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=1`

      try {
        const res = await fetch(url)
        const data = await res.json()

        if (data.error) {
          alert(data.error.message)
          this.weather = null
          this.chartData = null
          return
        }

        this.weather = data

        const hourly = data.forecast.forecastday[0].hour
        const labels = hourly.map((h) => h.time.split(' ')[1])
        const tempData = hourly.map((h) => h.temp_c)
        const rainData = hourly.map((h) => h.chance_of_rain)

        this.chartData = {
          labels,
          datasets: [
            {
              label: 'Temp °C',
              data: tempData,
              borderColor: 'red',
              backgroundColor: 'rgba(255,0,0,0.8)',
              borderWidth: 2,
            },
            {
              label: 'Rain %',
              data: rainData,
              borderColor: 'blue',
              backgroundColor: 'rgba(0,0,255,0.8)',
              borderWidth: 2,
            },
          ],
        }

        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: { labels: { color: 'white', font: { size: 14 } } },
          },
          scales: {
            x: {
              ticks: { color: 'white', font: { size: 12 } },
              grid: { color: 'rgba(255,255,255,0.3)' },
            },
            y: {
              ticks: { color: 'white', font: { size: 12 } },
              grid: { color: 'rgba(255,255,255,0.3)' },
            },
          },
        }

        this.renderChart()
      } catch (err) {
        console.error(err)
        if (city) alert('Failed to load hourly data')
      }
    },
    renderChart() {
      if (!this.chartData) return

      if (this.chartInstance) this.chartInstance.destroy()

      const ctx = this.$refs.chartCanvas.getContext('2d')
      this.chartInstance = new Chart(ctx, {
        type: 'bar', // change to 'line' if you prefer line chart
        data: this.chartData,
        options: this.chartOptions,
      })
    },
  },
  async created() {
    this.city = this.$route.query.city || 'New York'
    await this.fetchWeatherAndHourly(this.city)
  },
  watch: {
    '$route.query.city': {
      handler(newCity) {
        if (newCity) this.fetchWeatherAndHourly(newCity)
      },
      immediate: true,
    },
  },
}
</script>

<style>
.container {
  font-family: Arial, sans-serif;
  color: white;
  padding: 20px;
}
</style>
