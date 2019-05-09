import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faTemperatureHigh, faSun, faTint, faSmog} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

// register globally
const datepickerOptions = {
  texts: {
    apply: 'Filter',
    cancel: 'Clear'
  }
};

library.add(faTemperatureHigh, faSun, faTint, faSmog);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('moon-loader', MoonLoader);
Vue.use(AirbnbStyleDatepicker, datepickerOptions);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
