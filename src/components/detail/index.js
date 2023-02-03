import Vue from 'vue';
import store from '@/store';
import Detail from './index.vue';

let container = document.createElement('div');
container.id = 'con_for_detail';
document.body.appendChild(container);

new Vue({
  render: h => h(Detail),
  store
}).$mount('#con_for_detail');