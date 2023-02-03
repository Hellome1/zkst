<template>
  <div class="generalSet">
    <div class="gridBasket">
      <!-- 布局设置 -->
      <div class="label fr1">布局设置：</div>
      <div class="content fr3" style="padding-right: 20px">
        <Slider v-if="showSlider" v-model="layout" :opt="sliderOpt" />
      </div>
      <!-- 布局设置 -->
    </div>
  </div>
</template>

<script>
import Slider from './slider.vue';
export default {
  name: 'GeneralSet',
  components: { Slider },
  props: {
    showSlider: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layout: 2,
      sliderOpt: [
        { label: '紧凑', value: 0, code: 'small' },
        { label: '适中', value: 1, code: 'medium' },
        { label: '宽松', value: 2, code: '' }
      ]
    };
  },
  computed: {
    setting: function () {
      return this.$store.state.globalSetting.setting;
    },
    span: function () {
      return this.setting && this.setting.layout && this.setting.layout.span;
    }
  },
  watch: {
    layout: function (n) {
      let settingLayout = JSON.parse(JSON.stringify(this.setting.layout));
      settingLayout.span = this.sliderOpt.filter(s => s.value === n)[0].code;
      this.$emit('setTask', 'layout', settingLayout);
    }
  },
  created() {
    this.getSetting();
  },
  methods: {
    getSetting() {
      if (this.span) this.layout = this.span === 'small' ? 0 : this.span === 'medium' ? 1 : 2;
    }
  }
};
</script>

<style lang="scss" scoped>
.generalSet {
  .gridBasket {
    display: flex;
    flex-wrap: wrap;

    .fr1 {
      width: 30%;
    }
    .fr3 {
      width: 60%;
    }
  }
}
</style>