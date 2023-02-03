<template>
  <div>
    <hos-container>
      <hos-header class="header clear">
        <Header :setting="headerSetting"></Header>
        <ModuleDisplaySetting class="modDS" />
      </hos-header>
      <hos-main class="main">
        <Step v-if="needStep"></Step>
        <TlVisit></TlVisit>
        <hos-collapse v-model="activeModules">
          <Module></Module>
        </hos-collapse>
      </hos-main>
    </hos-container>
  </div>
</template>

<script>
// import { getVisit } from '@/server/api';
import { Loading } from 'element-ui';
import TlVisit from '@page/timeline/tl-visit.vue';
import Header from '@/components/header/header.vue';
import Step from '@page/step/step.vue';
import Module from './module.vue';
import ModuleDisplaySetting from '@/components/moduleDisplaySetting';
console.log('setting:', setting);
console.log('Module:', Module);

export default {
  components: {
    TlVisit,
    Header,
    Step,
    Module,
    ModuleDisplaySetting
  },
  provide: {
    layout: setting.layout
  },
  props: {},
  data() {
    return {
      activeModules: setting.displayModules,
      headerSetting: setting.header,
      needStep: setting.needStep
    };
  },
  watch: {},

  mounted() {},
  beforeCreate() {},
  created() {
    this.loading = Loading.service({
      lock: true,
      text: '正在加载',
      spinner: 'hos-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    });
  },
  mounted() {
    this.loading.close();
  },
  computed: {},

  methods: {}
};
</script>
<style lang="scss" scoped>
.modDS {
  position: absolute;
  top: 60px;
  left: 30px;
}
</style>
