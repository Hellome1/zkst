<template>
  <div
    class="labelClass"
    :class="MSG.clickable === '1' ? 'clickable' : ''"
    :style="{ paddingTop: MSG.labelClassPaddingTop }"
    @click.prevent="handleClick"
    ref="root"
  >
    <div class="iconArrowOuter" v-if="isArrow">
      <!-- <i ref="iLabel" :style="arrowStyle" :title="timeTitle" class="iconfont icon-uparrowbig"></i> -->
      <i :style="{ left: arrowStyle.left }" class="arrowUpCustom">
        <i :style="{ borderBottomColor: arrowStyle.color }" class="up"></i>
        <i :style="{ backgroundColor: arrowStyle.color }" class="down"></i>
      </i>
    </div>
    <p
      ref="pLabel"
      :style="MSG.config.pStyle"
      :title="!MSG.showDetail && MSG.title"
      @contextmenu="handleContextmenu"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
    >
      <i v-if="isIcon" :class="MSG.config.iconClass"></i>{{ MSG.name }}
    </p>
  </div>
</template>

<script>
import popUpWindow from '@/components/popUpWindow/popUpWindow.vue';
import request from '@/utils/request';
import Vue from 'vue';
export default {
  name: 'lable',
  components: {},
  props: {
    MSG: {
      type: Object,
      default: function () {
        return {
          title: 'title msg',
          name: 'information',
          date: '2021-1-20',
          time: '08:06:25',
          clickable: '0',
          labelClassPaddingTop: '3px',
          popUpWindow: false,
          loopInfo: null,
          showDetail: false,
          config: {
            eleConfig: {
              isArrow: false,
              isIcon: false
            },
            pStyle: {
              color: 'white',
              backgroundColor: '#59b272',
              border: '1px solid #59b272',
              borderTopLeftRadius: '',
              height: '24px',
              lineHeight: '24px',
              textAlign: 'left',
              borderRadius: '4px',
              opacity: '1',
              cursor: 'initial'
            },
            arrowStyle: {
              color: '#59b272',
              left: 0
            },
            iconClass: 'fa fa-file-text'
          }
        };
      }
    },
    param: null
  },
  data() {
    return {
      vm: null,
      vmshow: true
    };
  },
  watch: {
    param: function () {
      this.initCfg();
    }
  },

  mounted() {
    this.initCfg();
  },

  updated() {},

  created() {},

  computed: {
    globalLabel: function () {
      let setting = this.$store.state.globalSetting.setting;
      return setting && setting.layout && setting.layout.label && setting.layout.label;
    },
    timeTitle: function () {
      return this.MSG.date + ' ' + this.MSG.time;
    },
    isArrow: function () {
      return this.MSG.config.eleConfig.isArrow && this.MSG.time;
    },
    isIcon: function () {
      return this.MSG.config.eleConfig.isIcon;
    },
    arrowStyle: function () {
      return this.MSG.config.pStyle.border
        ? {
            color: this.MSG.config.pStyle.border.split(' ')[2],
            left: this.MSG.config.arrowStyle.left
          }
        : this.MSG.config.pStyle.backgroundColor
        ? {
            color: this.MSG.config.pStyle.backgroundColor,
            left: this.MSG.config.arrowStyle.left
          }
        : this.MSG.config.arrowStyle;
    },
    customStyle: function () {
      return this.MSG.config.pStyle.border
        ? {
            color: this.MSG.config.pStyle.border.split(' ')[2],
            left: this.MSG.config.arrowStyle.left
          }
        : this.MSG.config.pStyle.backgroundColor
        ? {
            color: this.MSG.config.pStyle.backgroundColor,
            left: this.MSG.config.arrowStyle.left
          }
        : this.MSG.config.arrowStyle;
    }
  },

  methods: {
    initCfg() {
      if (this.param) {
        this.setParam(this.param);
        if (this.MSG.clickable === '1') this.MSG.config.pStyle.cursor = 'pointer';
        this.setGlobal_pStyle();
      }
      if (this.param.ownAbnoItem) {
        this.MSG.config.pStyle.backgroundColor = this.param.ownAbnoItem.color;
        this.MSG.config.pStyle.border = '1px solid ' + this.param.ownAbnoItem.color;
      }
      if (this.MSG.popUpWindow) {
        this.MSG.config.pStyle.cursor = 'pointer';
      } else if (this.param.popUpWindow_disabled) {
        this.MSG.config.pStyle.cursor = 'not-allowed';
        this.MSG.config.pStyle.backgroundColor = '#888';
        this.MSG.config.pStyle.opacity = '0.5';
      }
      if (this.isArrow) {
        this.updateArrowPosition();
        this.listenWinSize();
      }
      if (this.param.contextmenu) {
        this.$refs.root.addEventListener('contextmenu', function (e) {
          e.preventDefault();
        });
      }
    },
    updateArrowPosition() {
      // 初始化箭头位置以匹配时间
      if (!this.$refs.iLabel) return;
      let { borderRadius } = this.MSG.config.pStyle;
      // let secW = this.$store.state.timeSection.lengthOfTimesection;
      let secW = this.$store.state.tlW / 7;
      let iW = this.$refs.iLabel.clientWidth;

      let dateTimes = this.MSG.date + ' ' + this.MSG.time;
      let dateTimeSt = this.MSG.date + ' ' + '00:00:00';
      let tm = dayjs(dateTimes).unix() - dayjs(dateTimeSt).unix();
      if (!tm) return;
      if (tm > 24 * 60 * 60) {
        this.MSG.time = '24:00:00';
        tm = 24 * 60 * 60;
      } else if (tm < 0) {
        this.MSG.time = '00:00:00';
        tm = 0;
      }
      let centerValue = parseInt((secW / (24 * 60 * 60)) * tm);

      let leftValue = centerValue - 12 / 2;
      borderRadius = borderRadius || window.getComputedStyle(this.$refs.pLabel, null).borderRadius;
      if (leftValue <= parseInt(borderRadius)) this.MSG.config.pStyle.borderTopLeftRadius = 0;
      if (leftValue >= secW - parseInt(borderRadius) - iW) this.MSG.config.pStyle.borderTopRightRadius = 0;
      this.MSG.config.arrowStyle.left = leftValue + 'px';
    },
    listenWinSize() {
      let _this = this;
      window.addEventListener('resize', _this.updateArrowPosition);
    },
    // 全局重置样式
    setGlobal_pStyle() {
      let style = this.globalLabel && this.globalLabel.pStyle,
        p = this.MSG.config.pStyle || {};
      for (let k in style) {
        p[k] = style[k];
      }
      this.MSG.labelClassPaddingTop = this.globalLabel && this.globalLabel.labelClassPaddingTop;
    },
    setParam(param) {
      for (let keyOuter in param) {
        let itemOuter = param[keyOuter];
        if (keyOuter == 'config') {
          for (let keyInner in itemOuter) {
            let itemInner = itemOuter[keyInner];
            if (typeof itemInner === 'string') {
              this.MSG.config[keyInner] = itemInner;
              continue;
            }
            for (let key in itemInner) {
              if (Object.prototype.hasOwnProperty.call(this.MSG.config[keyInner], key)) {
                this.MSG.config[keyInner][key] = itemInner[key];
              }
            }
          }
        } else {
          if (Object.prototype.hasOwnProperty.call(this.MSG, keyOuter)) {
            this.MSG[keyOuter] = param[keyOuter];
          }
          // else if (keyOuter == 'popUpWindow') {
          //   this.MSG[keyOuter] = param[keyOuter];
          // } else if (keyOuter === 'loopInfo' && param.loopInfo) {
          //   this.MSG.loopInfo = param.loopInfo;
          // }
        }
      }
    },
    patchLogic(e, cb) {
      var target = e.target;
      var rect = target.getBoundingClientRect();
      var top = rect.top - document.body.getBoundingClientRect().top;
      var left = parseInt(rect.left);
      let fetchData = cb.fetchData;
      let obj = {
        left,
        top,
        request
      };
      if (fetchData) {
        let postData = {};
        for (let f in fetchData) {
          postData[f] = this.param[f];
        }
        obj.postData = postData;
      }

      cb(obj);
    },
    handleContextmenu(e) {
      if (this.param.contextmenu) this.patchLogic(e, this.param.contextmenu);
    },
    handleMouseenter(e) {
      if (this.MSG.loopInfo) {
        var target = e.target;
        var rect = target.getBoundingClientRect();
        var top = rect.top - document.body.getBoundingClientRect().top;
        var left = parseInt(rect.left);

        let loopInfo_store = {
          show: true,
          left,
          top,
          postData: this.MSG.loopInfo
        };
        this.$store.commit('SET_LOOPINFOSTORE', loopInfo_store);
      }
      if (this.MSG.showDetail) {
        var target = e.target;
        var rect = target.getBoundingClientRect();
        var top = rect.top - document.body.getBoundingClientRect().top;
        var left = parseInt(rect.left);
        var excursionVertical = this.MSG.loopInfo ? -30 : 30;

        let detailInfo = {
          show: true,
          left,
          top,
          excursionVertical,
          detailContent: this.MSG.name
        };
        this.$store.commit('SET_DETAILINFO', detailInfo);
      }
    },
    handleMouseleave(e) {
      if (this.MSG.loopInfo) {
        let remove = true;
        if (e && e.toElement) {
          if (e.toElement.offsetParent && e.toElement.offsetParent.getAttribute('isloop')) remove = false;
          // if (e.toElement.parentNode === this.$refs.root) remove = false;
        }

        if (remove) {
          this.$store.commit('SWITCH_LOOP_SHOW', false);
        }
      }
      if (this.MSG.showDetail) {
        this.$store.commit('SWITCH_DETAIL_SHOW', false);
      }
    },
    handleClick(e) {
      if (this.MSG.popUpWindow) {
        // console.log({ ...this.MSG.popUpWindow });
        if (this.MSG.popUpWindow.style == 2) {
          // 请求数据
          this.$emit('getLisNorm', this.MSG.popUpWindow);
        }
        this.popUpWindow(this.MSG.popUpWindow, this.param.popPacs);
      }
    },
    popUpWindow(data, rawdts) {
      let _this = this;
      this.vm = new Vue({
        render: h =>
          h(popUpWindow, {
            style: {
              display: this.vmshow ? 'flex' : 'none'
            },
            on: {
              close: function () {
                document.body.removeChild(_this.vm.$el);
                document.body.style.overflow = 'visible';
                _this.vm.$destroy();
              }
            },
            props: {
              dt: data,
              rawdts: rawdts || []
            }
          })
      }).$mount();
      document.body.style.overflow = 'hidden';
      document.body.appendChild(this.vm.$el);
    }
  }
};
</script>
<style lang="scss" scoped>
.labelClass {
  font-size: 0;
  padding-top: 4px;
  text-align: left;
  overflow: hidden;
  cursor: default;
  .iconArrowOuter {
    position: relative;
    background-color: black;
    .iconfont {
      font-size: 12px;
      position: absolute;
      line-height: 100%;
      top: 1px;
    }
    .fa {
      font-size: 12px;
      position: absolute;
      line-height: 100%;
      top: 1px;
    }
    .arrowUpCustom {
      display: block;
      position: absolute;
      z-index: 20;
      left: 20px;
      width: 12px;
      height: 12px;
      .up {
        content: '';
        display: block;
        position: absolute;
        bottom: 3px;
        box-sizing: border-box;
        border: 8px solid green;
        border-left-width: 6px;
        border-right-width: 6px;
        border-left-color: rgba(0, 0, 0, 0);
        border-top-color: rgba(0, 0, 0, 0);
        border-right-color: rgba(0, 0, 0, 0);
        padding: 0;
        z-index: 30;
      }
      .down {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 3px;
        width: 6px;
        height: 4px;
        background: green;
      }
    }
  }
  p {
    position: relative;
    z-index: 1;
    .iconfont {
      font-size: 14px;
    }
    font-size: 13px;
    height: 24px;
    line-height: 24px;
    // margin-top: 12px;
    padding: 1px 3px;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.labelClass.clickable {
  cursor: pointer;
}
</style>
