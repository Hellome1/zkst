<template>
  <div class="TDline_C" ref="root" :style="initStyleObj.leftVal">
    <p class="msg_outer" ref="msg_outer" :class="msgOtRight ? 'inRight' : ''">
      <span class="content">{{ DT.name }}</span>
      <span class="title" v-if="isTitle" :style="titleStyle">{{ DT.title }}</span>
      <span class="time">{{ time }}</span>
    </p>
    <div class="iconOuter" :style="initStyleObj.width">
      <i class="startPoint"></i>
      <div class="center"></div>
      <i class="endPoint"></i>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['layout'],
  components: {},
  props: {
    DT: {
      type: Object,
      default: function () {
        return {
          title: 'MSG title',
          name: 'hello',
          startDate: '2021-1-22',
          startTime: '08:12:07',
          stopDate: '2021-1-23',
          stopTime: '12:22:07',
          order: 0,
          config: {
            titleCfg: {
              isTitle: true,
              titleStyle: {
                color: '#84aaca'
              }
            }
          }
        };
      }
    },
    span: {
      type: Number,
      default: 7
    },
    width: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      isTitle: this.DT.config.titleCfg.isTitle,
      titleStyle: this.DT.config.titleCfg.titleStyle,
      start: this.DT.startDate + ' ' + this.DT.startTime,
      end: this.DT.stopDate + ' ' + this.DT.stopTime,
      msgOtRight: false
    };
  },
  watch: {},

  mounted() {},

  created() {},

  computed: {
    time: function () {
      return '(' + this.start + '至' + this.end + ')';
    },
    order: function () {
      return this.DT.order;
    },
    settedSpan: function () {
      return 12;
    },
    settedWidth: function () {
      return 100;
    },
    initStyleObj: function () {
      let order = this.order;
      let timeDuration = this.getTimeDuration();
      let width = (timeDuration / (this.span * 24 * 60 * 60)) * this.width;
      let left = this.getLeftVal(order);
      this.$nextTick(() => {
        let msgOt_height = this.$refs.msg_outer.offsetHeight;
        if (msgOt_height > 60) {
          this.msgOtRight = true;
          this.$refs.root.style.paddingTop = 30 + 'px';
        }
      });
      return {
        leftVal: {
          paddingLeft: Math.round(left) + 'px',
          width: this.width - Math.round(left) + 'px'
        },
        width: {
          width: Math.round(width) + 'px'
        }
      };
    }
  },

  methods: {
    getTimeDuration: function () {
      let dateTimee = this.DT.stopDate + ' ' + this.DT.stopTime;
      let dateTimes = this.DT.startDate + ' ' + this.DT.startTime;
      let d_diff = dayjs(dateTimee).unix() - dayjs(dateTimes).unix();
      return d_diff;
    },
    getLeftVal: function (order) {
      // let w = this.$store.state.timeSection.lengthOfTimesection;
      let w = this.width / this.span;
      let dateTimes = this.DT.startDate + ' ' + this.DT.startTime;
      let dateTimeSt = this.DT.startDate + ' ' + '00:00:00';
      let transSec = dayjs(dateTimes).unix() - dayjs(dateTimeSt).unix();
      let preLeft = (transSec / (24 * 60 * 60)) * w;
      let left = preLeft + (order - 1) * w;
      return left;
    }
  }
};
</script>

<style lang="scss" scoped>
.TDline_C {
  position: relative;
  padding-bottom: 8px;
  p {
    font-size: 16px;
    text-align: left;
    padding-left: 5px;
    .content,
    .time {
      font-size: 14px;
    }
  }
  .msg_outer.inRight {
    position: absolute;
    top: 0;
    right: 0;
  }
  .iconOuter {
    height: 5px;
    bottom: 2px;
    background-color: #c9e3fa;
    position: relative;
    .startPoint,
    .endPoint {
      display: block;
      position: absolute;
      width: 4px;
      height: 9px;
      background-color: #669abf;
      top: -2px;
    }
    .startPoint {
      left: 0;
    }
    .endPoint {
      right: 0;
    }
  }
}
</style>
