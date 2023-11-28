import Vue from 'vue';
import VueCookie from 'vue-cookie';
import * as Vue2Leaflet from 'vue2-leaflet';
import * as BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueCookie);
Vue.use(Vue2Leaflet);
Vue.use(BootstrapVue);

export const eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});