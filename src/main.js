import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/application/, /cartlist/];

new Vue({
  render: h => h(App)
}).$mount("#app");
