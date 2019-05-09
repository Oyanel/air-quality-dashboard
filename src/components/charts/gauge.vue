<template>
  <div class="charts col-md-3">
    <moon-loader :loading="loading" :color="'#17A2B8'" :size="'150px'"></moon-loader>
    <div v-show="!loading">
      <font-awesome-icon class="gauge-icon" :icon="['fas',icon]"/>
      <highcharts ref="highcharts" :options="chartOptions"></highcharts>
    </div>
  </div>
</template>
<script>

  import Highcharts from 'highcharts'
  import {Chart} from 'highcharts-vue'
  import exportingInit from "highcharts/modules/exporting";
  import highchartsMoreInit from "highcharts/highcharts-more";
  import solidGaugeInit from "highcharts/modules/solid-gauge";
  import config from '../../config';

  exportingInit(Highcharts);
  highchartsMoreInit(Highcharts);
  solidGaugeInit(Highcharts);

  export default {
    components: {
      highcharts: Chart
    },
    props: ['devices', 'timeserie', 'stops', 'icon', 'prefix', 'value'],
    data() {
      return {
        loading: true,
        chartOptions: this.getOptions()
      }
    },
    methods: {
      getOptions() {
        return {
          chart: {
            type: "solidgauge",
            backgroundColor: '#fff',
            height: 200
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          title: {
            text: ''
          },
          tooltip: {
            enabled: false
          },
          pane: {
            size: '75%',
            center: ['50%', '50%'],
            startAngle: -135,
            endAngle: 135,
            background: {
              backgroundColor: '#EEE',
              innerRadius: '75%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },
          yAxis: {
            stops: this.getStops(),
            min: config.thingsboard.sensors.cricket.status[this.timeserie].min,
            max: config.thingsboard.sensors.cricket.status[this.timeserie].max,
            labels: {
              enabled: false
            },
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0
          },
          plotOptions: {
            solidgauge: {
              innerRadius: "75%",
              borderWidth: "100px"
            }
          },
          series: [{
            name: this.timeserie,
            data: [this.value],
            dataLabels: {
              format:
                '<div style="text-align:center"><span style="font-size:0.8rem;color:black">{y}&nbsp;'
                + this.prefix + '</span><div>' +
                "</div><div/>",
              borderColor: null,
              align: "center",
              useHTML: true
            }
          }]
        };
      },
      getStops() {
        const stops = [];
        const min = config.thingsboard.sensors.cricket.status[this.timeserie].min;
        const max = config.thingsboard.sensors.cricket.status[this.timeserie].max;
        const limits = config.thingsboard.sensors.cricket.status[this.timeserie].limits;

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
      value() {
        if (!this.value) {
          this.$refs.highcharts.chart.series[0].dataLabels = {
            format:
              '<div style="text-align:center"><span style="font-size:2rem;color: black">N/A</span><div>' +
              "</div><div/>",
            borderColor: null,
            align: "center",
            useHTML: true
          };
          this.$refs.highcharts.chart.series[0].setData([], true);
          this.loading = false;
          return;
        }
        this.$refs.highcharts.chart.series[0].setData([this.value], true);
        this.loading = false;
      }
    }
  }
</script>
<style scoped>
  .gauge-icon {
    position: absolute;
    z-index: 1;
    top: 40%;
    transform: translate(-50%, -50%);
    left: 50%;
    font-size: 2rem;
  }
</style>