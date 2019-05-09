<template>
  <div class="col-lg-12">
    <moon-loader :loading="loading" :color="'#17A2B8'" :size="'350px'"></moon-loader>
    <div v-show="!loading">
      <heatmap-filter class="heatmapFilter" v-bind:timeseries="timeseries"
                      @heatmapFiltered="heatmapFiltered"/>
      <highcharts ref="highcharts" :options="chartOptions"/>
    </div>
  </div>
</template>
<script>

  import Highcharts from 'highcharts'
  import {Chart} from 'highcharts-vue'
  import exportingInit from "highcharts/modules/exporting";
  import highchartsMoreInit from "highcharts/highcharts-more";
  import heatmapInit from "highcharts/modules/heatmap";
  import HeatmapFilter from "../filters/heatmapFilter"
  import config from '../../config';

  const ENUM_DAYS = Object.freeze({
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  });


  exportingInit(Highcharts);
  highchartsMoreInit(Highcharts);
  heatmapInit(Highcharts);

  export default {
    components: {
      HeatmapFilter,
      highcharts: Chart
    },
    props: ['devices', 'timeseries'],
    data() {
      return {
        timeserie: config.thingsboard.sensors.cricket.timeseries[0],
        chartOptions: this.getOptions(),
        values: this.getData(),
        loading: true
      }
    },
    methods: {
      getOptions() {
        return {
          chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          title: {
            text: 'Temperature per hour of the day '
          },
          xAxis: {
            categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          yAxis: {
            categories: this.getYAxis(),
            title: null
          },
          colorAxis: {
            min: config.thingsboard.sensors.cricket.status.temperature.min,
            max: config.thingsboard.sensors.cricket.status.temperature.max,
            stops: this.getStops(config.thingsboard.sensors.cricket.timeseries[0])
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
          },
          tooltip: {
            enabled: false
          },
          series: [{
            name: 'Temperature per hour of the day ',
            borderWidth: 0,
            data: this.values,
            dataLabels: {
              enabled: true,
              color: '#ffffff'
            }
          }]
        };
      },
      getYAxis() {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          hours.push(i.toString() + 'h00');
        }
        return hours;
      },
      getData() {
        if (this.devices.length === 0)
          return [];
        const series = [];
        const dates = [];

        // Init array.
        Object.values(ENUM_DAYS).map(day => {
          dates[day] = [];
          for (let i = 0; i < 24; i++) {
            dates[day][i] = [];
          }
        });

        // Sort by day and hour.
        this.devices.map(device => {
          if (_.isNil(device.telemetry[this.timeserie]))
            return false;
          device.telemetry[this.timeserie]
            .map(item => {
              let date = new Date(item.ts);
              dates[date.getDay()][date.getHours()].push(parseFloat(item.value));
            });
        });

        // Create avg for each hour of each day.
        dates.map(
          (hours, index) => hours.map((hour, index2) => {
              if (hour.length > 0) {
                dates[index][index2] = hour.reduce((previous, current) => current += previous) / hour.length;
                series.push([index, index2, parseFloat(dates[index][index2].toFixed(1))]);
              }
            }
          )
        );
        return series;
      },
      heatmapFiltered(timeserie) {
        this.timeserie = timeserie;
        this.$refs.highcharts.chart.setTitle({text: _.capitalize(this.timeserie) + ' per hour of the day'}, false);
        this.setData();
        const colorAxis = this.$refs.highcharts.chart.colorAxis[0];
        colorAxis.setExtremes(config.thingsboard.sensors.cricket.status[this.timeserie].min,
          config.thingsboard.sensors.cricket.status[this.timeserie].max, false);
        colorAxis.update({
          stops: this.getStops(this.timeserie),
        });
      },
      setData() {
        this.loading = true;
        this.values = this.getData();
        this.$refs.highcharts.chart.series[0].setData(this.values, true);
        this.loading = false;
      },
      getStops(timeserie) {
        const stops = [];
        const min = config.thingsboard.sensors.cricket.status[timeserie].min;
        const max = config.thingsboard.sensors.cricket.status[timeserie].max;
        const limits = config.thingsboard.sensors.cricket.status[timeserie].limits;

        Object.entries(limits).forEach(([key, limit]) => {
          if (key.localeCompare('default') === 0) {
            stops.push([0, limit.color]);
            return true;
          }
          stops.push([((parseInt(key) - min) / (max - min)), limit.color]);
        });
        stops.sort((a, b) => a[0] - b[0]);
        return stops;
      }
    },
    watch: {
      devices() {
        this.setData();
        this.loading = false;
      }
    }
  }
</script>