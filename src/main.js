import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/font/font-awesome-4.7.0/css/font-awesome.min.css';

import cookie_c, { getFromLocalSetting, setLocalSetting, checkWhenViewMode } from '@/utils/cookie_c';
import '@/components/loop';
import '@/components/detail';

import App from './App.vue';
import router from './router';
import store from './store';

/* --引入hosui-- */
import Hos from 'hosui';
// 极简版样式引入
import 'hosui/lib/theme-simple/index.css'
Vue.use(Hos);
/* -^引入hosui^- */

import '@/assets/css/index.scss';

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(ElementUI);
Vue.prototype.cookie_c = cookie_c;
Vue.prototype.getFromLocalSetting = getFromLocalSetting;
Vue.prototype.setLocalSetting = setLocalSetting;
Vue.prototype.checkWhenViewMode = checkWhenViewMode;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
