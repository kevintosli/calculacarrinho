import Vue from "vue";
import App from "@/App.vue";
import store from "@/store/store";
import "@/registerServiceWorker";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/application/, /content/, /cartlist/, /control-/];

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
