import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

import { Checkbox, Radio } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(Checkbox);
Vue.use(Radio);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
