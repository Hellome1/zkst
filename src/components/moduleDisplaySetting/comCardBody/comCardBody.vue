<template>
  <div class="com-card-body" ref="root">
    <!-- 标签设置 -->
    <div class="label-setting">
      <div class="show-demo">
        <span class="text-label">预览：</span>
        <div class="label-demo">
          <Label :param="param" />
        </div>
      </div>
      <hos-divider></hos-divider>
      <div class="set-opt row">
        <span class="text-label">背景色：</span>
        <hos-color-picker v-model="backgroundColor" class="color-picker"></hos-color-picker>
      </div>
      <div class="set-opt row">
        <span class="text-label">图标：</span>
        <icon-selector v-model="icon" :bgcolor="backgroundColor" />
      </div>
    </div>
    <!-- 标签设置结束 -->
  </div>
</template>

<script>
import Label from '@/components/Label/label.vue';
import iconSelector from '@/components/iconSelector/index.vue';
export default {
  name: 'comCardBody',
  components: { Label, iconSelector },
  props: {
    root: {
      type: Object,
      require: true,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      param: {},
      /* 标签设置 */
      backgroundColor: '#59b272',
      icon: 'fa fa-file-text',
      /* 标签设置 */
      notAddWatcher: true // 尚未添加监听器
    };
  },
  computed: {
    setting: function () {
      return this.$store.state.globalSetting.setting;
    },
    module: function () {
      return this.setting && this.setting.modules[this.root.value];
    },
    labelConfig: function () {
      return this.module && this.module.labelConfig;
    }
  },
  created() {
    console.log(JSON.parse(JSON.stringify(this.labelConfig)));
    this.setParam();
  },
  mounted() {},
  methods: {
    setParam() {
      let p = JSON.parse(JSON.stringify(this.labelConfig));
      p.name = p.title = '演示内容...';
      delete p['ownAbnoItem'];
      this.param = p;
      let backgroundColor = (p.config && p.config.pStyle && p.config.pStyle.backgroundColor) || '';
      this.icon = (p.config && p.config.eleConfig && p.config.eleConfig.isIcon && p.config.iconClass) || '';
      this.backgroundColor = backgroundColor || '#59b272';
      if (this.notAddWatcher) this.addWatcher();
    },
    addWatcher() {
      this.notAddWatcher = false;
      this.$watch('backgroundColor', n => {
        let p = JSON.parse(JSON.stringify(this.param));
        let pStyle = p.config && p.config.pStyle;
        if (pStyle) {
          pStyle.backgroundColor = n;
          pStyle.border = '1px solid ' + n;
          this.param = p;
          this.setConfig(['labelConfig', 'config'], this.param);
        }
      });
      this.$watch('icon', n => {
        let p = JSON.parse(JSON.stringify(this.param));
        let config = p.config;
        if (config) {
          let eleConfig = config.eleConfig || {};
          eleConfig.isIcon = true;
          config.eleConfig = eleConfig;
          config.iconClass = n;
          this.param = p;
          this.setConfig(['labelConfig', 'config'], this.param);
        }
      });
    },
    setConfig(keys, val) {
      let key = keys[0],
        subkey = keys[1],
        trikey = keys[2];
      let modules = this.setting && JSON.parse(JSON.stringify(this.setting.modules)),
        module = modules[this.root.value];
      if (trikey) module[key][subkey][trikey] = val[subkey][trikey];
      else if (subkey) module[key][subkey] = val[subkey];
      else module[key] = val;
      this.$emit('setTask', 'modules', modules);
    },
    reset() {
      let module = setting.modules[this.root.value],
        labelConfig = module.labelConfig,
        config = labelConfig && labelConfig.config;

      console.log(JSON.parse(JSON.stringify(config)));
      this.backgroundColor = (config && config.pStyle && config.pStyle.backgroundColor) || '#59b272';
      this.icon = (config && config.eleConfig && config.eleConfig.isIcon && config.iconClass) || '';
    }
  }
};
</script>

<style lang="scss" scoped>
.com-card-body {
  .label-setting {
    & > div {
      margin-bottom: 10px;
    }
    & > div:last-child {
      margin-bottom: 0;
    }
    .show-demo {
      display: flex;
      align-items: center;
      .text-label {
        margin-right: 30px;
        font-weight: bold;
        width: 20%;
      }
      .label-demo {
        display: inline-block;
        width: 300px;
      }
    }
    .set-opt {
      display: flex;
      align-items: center;
      .text-label {
        margin-right: 30px;
        font-weight: bold;
        width: 20%;
      }
      .color-picker {
      }
    }
    .set-opt.row {
      float: left;
      width: 50%;

      &::after {
        content: '';
        display: block;
        clear: '';
      }
    }
  }
}
</style>