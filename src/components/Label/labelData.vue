<template>
  <div class="module-content">
    <Label v-if="handledParam" :param="handledParam" @getLisNorm="getLisN" />
  </div>
</template>

<script>
import Label from '@/components/Label/label.vue';
import { getLisNorm } from '@/server/api';
import { handleLisN } from '@/utils/cookie_c';
export default {
  name: 'labelData',
  components: {
    Label
  },
  props: {
    setting: {
      type: Object,
      required: true
    },
    // 传过来的原数据
    param: {
      type: Object,
      required: true
    },
    noTitle: {
      type: Boolean,
      default: false
    },
    entireClickable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      handledParam: null
    };
  },
  watch: {
    param: function () {
      this.handledParam = this.handleData(this.param, this.setting.labelConfig);
    },
    setting: function () {
      // console.log('run label change program', this.setting.labelConfig);
      this.handledParam = this.handleData(this.param, this.setting.labelConfig);
    }
  },

  mounted() {},

  created() {
    this.handledParam = this.handleData(this.param, this.setting.labelConfig);
    if (this.setting.labelConfig.handleLisN) this.$set(this, 'handleLisN', this.setting.labelConfig.handleLisN.bind(this));
  },

  computed: {},

  methods: {
    // 处理数据，返回经过筛选的数据
    handleData(data, opt = {}) {
      let labelParam = {};
      let config = opt.config;
      let popUpWindow = opt.popUpWindow;
      for (let key in opt) {
        if (key != 'config' || key != 'popUpWindow' || key != 'loopInfo') {
          if (data[opt[key]]) {
            labelParam[key] = data[opt[key]];
          } else {
            labelParam[key] = '';
          }
        }
      }
      if (opt.showDetail) labelParam.showDetail = true;
      if (this.entireClickable) labelParam.clickable = '1'; // '1' 为可点击
      if (this.noTitle) labelParam.title = '';
      if (config) {
        labelParam.config = config;
      }
      if (opt.ownAbnoItem && data[opt.ownAbnoItem.key]) {
        labelParam.ownAbnoItem = { color: opt.ownAbnoItem.color || '#fff' };
      }
      if (opt.loopInfo) {
        let loopInfo = JSON.parse(JSON.stringify(opt.loopInfo));
        loopInfo.ensLogId = data[loopInfo.ensLogId];
        labelParam.loopInfo = loopInfo;
      }
      if (opt.contextmenu) {
        labelParam.contextmenu = opt.contextmenu;
        let fetchData = opt.contextmenu.fetchData;
        if (fetchData) {
          for (let key in fetchData) {
            let value = fetchData[key],
              len = value.length,
              isInData = typeof value === 'string' && /^{.+}$/.test(value);
            if (isInData) labelParam[key] = data[value.substring(1, len - 1)] || null;
            else labelParam[key] = value;
          }
        }
      }
      // console.log({ ...data });
      if (popUpWindow) {
        let popCopy = getPopCopy(popUpWindow, data);
        // 携带gridAbnormal
        popCopy.gridAbnormal = this.setting.gridAbnormal;

        let hosIdk = this.setting.lisNormId || 'hosInspRptId';
        if (popUpWindow.style === 2) {
          if (this.param[hosIdk]) labelParam.popUpWindow = popCopy;
          else labelParam.popUpWindow_disabled = true;
        } else {
          labelParam.popUpWindow = popCopy;

          let popCopyArr = [],
            bundle = data.bundle || [];
          for (let i = 0; i < bundle.length; i++) {
            let popCopyo = getPopCopy(popUpWindow, bundle[i]);
            popCopyArr.push(popCopyo);
          }
          labelParam.popPacs = popCopyArr;
        }
      }
      return labelParam;

      function getPopCopy(popUpWindow, data) {
        let popCopy = {};
        for (let key in popUpWindow) {
          if (typeof popUpWindow[key] == 'number') {
            popCopy[key] = popUpWindow[key];
          } else if (typeof popUpWindow[key] == 'string') {
            popCopy[key] = key == 'width' ? popUpWindow[key] : data[popUpWindow[key]];
          } else if (Object.prototype.toString.call(popUpWindow[key]) === '[object Object]') {
            // console.log('[object Object]');
            let o = JSON.parse(JSON.stringify(popUpWindow[key]));
            if (o.data) {
              for (let k in o.data) {
                o.data[k] = data[k];
              }
            }
            popCopy[key] = o;
          } else {
            popCopy[key] = popUpWindow[key].map(item => {
              let trans = {};
              let title = item.split('|')[0];
              let val = item.split('|')[1];
              trans.title = title;
              trans.val = data[val];
              return trans;
            });
          }
        }
        return popCopy;
      }
    },
    // 请求并处理数据
    getLisN(vm) {
      if (this.param.lisDetails) {
        let lisDetails = this.param.lisDetails;
        console.log(lisDetails);
        this.$set(vm, 'lisNorm', this.param.lisDetails);
        return;
      }

      let hdcIdk = this.setting.lisNormId || 'hdcInspRptId';
      let hdcId = this.param[hdcIdk];
      getLisNorm({
        rows: 50,
        page: 1,
        action: this.setting.labelConfig.action || '',
        inspOrdInfo: {
          hdcInspRptId: hdcId
        }
      }).then(res => {
        let lis = this.handleLisN(res.data);
        this.$set(vm, 'lisNorm', lis);
      });
    },
    handleLisN
  }
};
</script>
<style lang="scss" scoped></style>
