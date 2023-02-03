import Vue from 'vue';
import VueRouter from 'vue-router';
import index from '@/pages/index/index.vue';
import { getInitConfig, setConfig } from '@/utils/getConfig';
import { getFromLocalSetting, setLocalSetting } from '@/utils/cookie_c';
import getParams from '@/utils/getParam';

Vue.use(VueRouter);

const routes = [
  {
    path: '/index.html',
    // redirect: '/index.html',
    name: 'index',
    component: index
  },
  {
    path: '/test',
    name: 'showTest',
    component: () => import('@/components/Lcjz/test.vue')
  },
  {
    path: '/components/elTimeline',
    name: 'elTimelineDefault',
    component: () => import('@/components/elTimeline')
  }
  // {
  //   path: '/time',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

getParams();

router.beforeEach((to, from, next) => {
  next();
  return;
  if (getInitConfig()) {
    next();
  } else {
    setConfig().then(config => {
      for (let k in config) {
        setting[k] = config[k];
        if (getFromLocalSetting(k)) setLocalSetting(k, config[k]);
      }
      next();
    }).catch(err => {
      next();
      throw err;
    });
  }
})

export default router;
