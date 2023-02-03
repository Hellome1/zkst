import Loop from './index.vue';
import Vue from 'vue';
import store from '@/store';

let display_for_loop = document.createElement('div');
display_for_loop.id = 'zkst_loop';
document.body.appendChild(display_for_loop);

new Vue({
  render: h => h(Loop),
  store
}).$mount('#zkst_loop');
