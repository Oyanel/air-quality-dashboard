<template>
  <div>
    <div class="datepicker-trigger">
      <input
          class="form-control"
          type="text"
          id="datepicker-trigger"
          placeholder="Realtime (Last record)"
          :value="formatDates(dateOne, dateTwo)"
      >
      <AirbnbStyleDatepicker
          :trigger-element-id="'datepicker-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :date-one="dateOne"
          :date-two="dateTwo"
          @date-one-selected="val => { dateOne = val }"
          @date-two-selected="val => { dateTwo = val }"
          :months-to-show="1"
          @apply="applyMethod"
          @cancelled="clearDates"
      />
    </div>
  </div>
</template>

<script>
  import format from 'date-fns/format'

  export default {
    data() {
      return {
        dateFormat: 'DD MMM',
        dateOne: '',
        dateTwo: ''
      }
    },
    methods: {
      formatDates(dateOne, dateTwo) {
        let formattedDates = '';
        if (dateOne) {
          formattedDates = format(dateOne, this.dateFormat)
        }

        if (dateOne && !dateTwo)
          dateTwo = dateOne;

        if (dateTwo && !dateOne) {
          dateOne = dateTwo;
          formattedDates = format(dateOne, this.dateFormat);
        }

        if (dateTwo) {
          formattedDates += ' - ' + format(dateTwo, this.dateFormat);
          this.dateTwo = dateTwo;
        }
        return formattedDates
      },
      applyMethod() {
        if (this.dateOne == '' || this.dateTwo == '')
          return;
        const date1 = new Date(this.dateOne);
        const date2 = new Date(this.dateTwo);
        date2.setDate(date2.getDate() + 1);
        this.$emit('dateFiltered', [date1.getTime(), date2.getTime() - 1]);
      },
      clearDates() {
        this.dateOne = '';
        this.dateTwo = '';
        this.$emit('dateFiltered', []);
      }
    }
  }
</script>
<style scoped>
  #datepicker-trigger {
    min-height: 40px;
    max-height: 40px;
  }
</style>