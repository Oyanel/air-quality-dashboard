<template>
  <div class="dashboard container-fluid">
    <div class="col-md-12 filters">
      <h3 class="title-top">Filters</h3>
      <div class="form-row">
        <datepicker class="col-md-6 filter" @dateFiltered="filterDateMethod"/>
        <devices-filter class="col-md-6 filter" v-bind:devices="devices"
                        @devicesFiltered="filterDeviceMethod"/>
      </div>
    </div>
    <div class="col-lg-12 gauges">
      <h3 class="title-top">Air Quality</h3>
      <div class="form-row">
        <gauge v-for="(timeserie, index) in timeseries" v-bind:key="index"
               v-bind:devices="selectedDevices" v-bind:timeserie="timeserie"
               v-bind:value="averageValues[timeserie]"
               v-bind:icon="icons[index]" v-bind:prefix="prefixes[index]"></gauge>
      </div>
    </div>
    <div class="row cards">
      <card v-for="(timeserie, index) in timeseries" v-bind:key="index"
            v-bind:devices="selectedDevices" v-bind:timeserie="timeserie"
            v-bind:value="averageValues[timeserie]"
            v-bind:icon="icons[index]"></card>
    </div>
    <div class="col-lg-12 heatmap">
      <h3 class="title-top">Heatmap</h3>
      <div class="form-row">
        <heatmap v-bind:devices="selectedDevices" v-bind:timeseries="timeseries"></heatmap>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from "./cards/statusCard";
  import Datepicker from "./filters/datepicker";
  import ThingsboardController from '../controller/thingsboardController';
  import config from '../config'
  import devicesFilter from './filters/devicesFilter'
  import Gauge from './charts/gauge'
  import Heatmap from './charts/heatmap'

  const LIMIT = 30;

  export default {
    name: 'Main',
    components: {Card, Datepicker, devicesFilter, Gauge, Heatmap},
    data() {
      return {
        devices: [],
        selectedDevices: [],
        timeseries: config.thingsboard.sensors.cricket.timeseries,
        icons: config.thingsboard.sensors.cricket.icons,
        prefixes: config.thingsboard.sensors.cricket.prefixes,
        dates: null,
        averageValues: []
      }
    },
    methods: {
      filterDateMethod(dateArray) {
        const keys = this.timeseries.join();
        this.dates = dateArray;
        ThingsboardController
          .getFullDevices(this.selectedDevices, config.thingsboard.sensors.cricket.type, keys, this.dates[0], this.dates[1], 100000)
          .then(devices => this.selectedDevices = devices);
      },
      filterDeviceMethod(devices) {
        const keys = this.timeseries.join();

        if (_.isNil(devices) || devices.length === 0) {
          devices = this.devices;
        }

        if (_.isNil(this.dates))
          ThingsboardController
            .getFullDevices(devices, config.thingsboard.sensors.cricket.type, keys)
            .then(devices => this.selectedDevices = devices);
        else
          ThingsboardController
            .getFullDevices(devices, config.thingsboard.sensors.cricket.type, keys, this.dates[0], this.dates[1], 100000)
            .then(devices => this.selectedDevices = devices);
      },
      getAlldevices() {
        return ThingsboardController.getAllFullDevices(config.thingsboard.sensors.cricket.type, LIMIT);
      },
      async refresh() {
        this.devices = await this.getAlldevices();
        this.filterDeviceMethod(this.selectedDevices);
      },
      getAverageValue(timeserie) {
        return ThingsboardController.getAverageValueFromDevices(this.selectedDevices, timeserie);
      }
    },
    async mounted() {
      const newDevices = await this.getAlldevices();
      this.devices = newDevices;
      this.selectedDevices = newDevices;

      // Refresh data every 5 minutes
      setInterval(() => {
        this.refresh();
      }, 300000);
    },
    watch: {
      selectedDevices() {
        this.timeseries.map(timeserie => this.averageValues[timeserie] = this.getAverageValue(timeserie));
      }
    }
  }
</script>
<style>
  .filters, .gauges, .heatmap {
    border: 1px solid rgba(0, 0, 0, 0.125);
  }

  .filters {
    padding: 15px;
    margin-bottom: 15px;
    background-color: white;
  }

  .filter {
    margin-bottom: 10px;
  }

  .title-top {
    text-align: left;
  }

  .dashboard {
    padding-top: 15px;
  }

  .gauges, .heatmap {
    background-color: white;
    padding: 15px;
    margin-bottom: 15px;
  }

  .cards {
    margin-bottom: 15px;
  }

  ::placeholder, .multiselect__placeholder {
    color: #ced4da !important;
    font-family: 'Helvetica', Arial, sans-serif !important;
    font-size: 1rem;
  }

  .multiselect__tags {
    padding-top: 5px;
    border: 1px solid #ced4da !important;
  }

  .multiselect__placeholder {
    margin-left: 5px;
    margin-top: -3px;
  }

  .multiselect__tag {
    padding-right: 10px;
  }

  .multiselect__tag-icon {
    display: none;
    visibility: hidden;
  }

  .v-spinner {
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>
