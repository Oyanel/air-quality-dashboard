<template>
  <div class="card-wrapper col-md-3">
    <div class="card">
      <moon-loader :loading="loading" :color="'#17A2B8'" :size="'80px'"></moon-loader>
      <div v-show="!loading" v-bind:style="color" class="card-img-left col-md-4">
        <font-awesome-icon class="card-icon" :icon="['fas',icon]"/>
      </div>
      <div v-show="!loading" class="card-body status col-md-8">
        <span class="card-title">{{timeserie}}</span>
        <p class="card-text">{{status}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../config'

  export default {
    props: ['devices', 'timeserie', 'icon', 'value'],
    data() {
      return {
        color: {"background-color": "transparent"},
        status: 'N/A',
        loading: true
      };
    },
    computed: {
      /**
       * returns the status color of one of the timeseries given in props
       *
       * @returns {array|boolean} [limit, color]
       */
      statusColor() {
        const value = this.value;

        const limits = config.thingsboard.sensors.cricket.status[this.timeserie].limits;

        const color = Object.entries(limits).reverse().find((key) => {

          if (isNaN(parseInt(key)))
            return false;

          return value >= parseInt(key);
        });

        return !_.isNil(color) ? color : [];
      }
    },
    watch: {
      statusColor() {
        const limits = config.thingsboard.sensors.cricket.status[this.timeserie].limits;

        if (!this.statusColor) {
          this.status = 'N/A';
          this.color = {
            "background-color": "transparent"
          };
          this.loading = false;
          return;
        }
        this.color = {
          "background-color": this.statusColor.length > 0 ?
            this.statusColor[1].color : limits.default.color
        };

        this.status = this.statusColor.length > 0 ?
          this.statusColor[1].label : limits.default.label;
        this.loading = false;
      }
    }
  }
</script>
<style scoped>
  .card-wrapper {
    display: flex;
  }

  .card-title {
    font-weight: bold;
    text-transform: uppercase;
  }

  .card {
    min-height: 100px;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: row !important;
    align-items: center;
    padding: 0 !important;
    border-radius: 0;
  }

  .card-img-left {
    border-radius: 0;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .card-icon {
    font-size: 2rem;
  }
</style>