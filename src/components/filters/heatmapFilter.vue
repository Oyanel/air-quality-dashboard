<template>
  <div>
    <multiselect
        v-model="selectedTimeserie"
        :options="options"
        placeholder="Select a value"
        @close="emit"
    ></multiselect>
  </div>
</template>
<script>
  import Multiselect from 'vue-multiselect'


  export default {
    props: ['timeseries'],
    components: {Multiselect},
    data() {
      return {
        selectedTimeserie: null
      }
    },
    computed: {
      options() {
        if (_.isNil(this.timeseries) || this.timeseries.length === 0)
          return [];
        const timeseries = [];
        this.timeseries.map(timeserie => timeseries.push(timeserie));
        return timeseries;
      }
    },
    methods: {
      emit: function () {
        this.$emit('heatmapFiltered', this.selectedTimeserie);
      }
    }
  }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
