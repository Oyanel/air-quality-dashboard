<template>
  <div>
    <multiselect
        v-model="selectedDevices"
        track-by="id"
        :multiple="true"
        :close-on-select="false"
        :options="options"
        label="name"
        placeholder="Select devices"
        @close="emit"
    ></multiselect>
  </div>
</template>
<script>
  import Multiselect from 'vue-multiselect'


  export default {
    props: ['devices'],
    components: {Multiselect},
    data() {
      return {
        selectedDevices: null
      }
    },
    computed: {
      options() {
        if (_.isNil(this.devices) || this.devices.length === 0)
          return [];
        const devicesName = [];
        Object.entries(this.devices).forEach(([key, device]) => {
          devicesName.push({
            id: device.id,
            name: device.name + ' (Last update: %s)'.replace('%s', this.getLastUpdate(device)),
            device: device
          })
        });
        return devicesName;
      }
    },
    methods: {
      getLastUpdate(device) {
        if (_.isNil(device.telemetry))
          return false;

        let maxDate = 0;
        Object.entries(device.telemetry).map(telemetry => {
          const tempMax = telemetry[1][0].ts;
          maxDate = Math.max(maxDate, tempMax);
        });
        return this.getDate(maxDate);
      },
      getDate: function (date) {
        const newDate = new Date(date);
        const format = 'dd-MM-YYYY HH:mm';
        return format
          .replace('dd', newDate.getDate().toString().padStart(2, "0"))
          .replace('MM', (newDate.getMonth() + 1).toString().padStart(2, "0"))
          .replace('YYYY', newDate.getFullYear())
          .replace('HH', newDate.getHours())
          .replace('mm', newDate.getMinutes());
      },
      emit: function () {
        const devices = [];
        if (_.isNil(this.selectedDevices) || this.selectedDevices.length === 0) {
          this.$emit('devicesFiltered', null);
          return;
        }

        Object.entries(this.selectedDevices).forEach(([key, device]) => {
          devices.push(device.device);
        });

        this.$emit('devicesFiltered', devices);
      }
    }
  }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
