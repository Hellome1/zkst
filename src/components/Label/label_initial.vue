<template>
  <div class="labelClass">
    <div class="iconArrowOuter" v-if="isArrow">
      <span v-for="el in [4, 8, 12, 16, 20, 24]" :key="el">
        <i v-if="el == parseInt(MSG.time.hour)" :style="MSG.config.arrowStyle" class="iconfont icon-uparrowbig"></i>
      </span>
    </div>
    <p :style="MSG.config.pStyle" :title="MSG.message.title"><i v-if="isIcon" class="iconfont icon-1report"></i>{{ MSG.message.content }}</p>
  </div>
</template>

<script>
export default {
  name: 'lable',
  components: {},
  props: {
    MSG: {
      type: Object,
      default: function() {
        return {
          message: {
            title: 'title msg',
            content: 'information'
          },
          time: {
            date: '2021-1-20',
            hour: 12
          },
          config: {
            eleConfig: {
              isArrow: true,
              isIcon: true
            },
            pStyle: {
              color: 'white',
              backgroundColor: '#59b272'
            },
            arrowStyle: {
              color: '#59b272'
            }
          }
        };
      }
    }
  },
  data() {
    return {
      isArrow: this.MSG.config.eleConfig.isArrow,
      isIcon: this.MSG.config.eleConfig.isIcon
    };
  },
  watch: {},

  mounted() {},

  created() {},

  computed: {},

  methods: {}
};
</script>
<style lang="scss" scoped>
.labelClass {
  font-size: 0;
  padding-top: 4px;
  text-align: left;
  cursor: default;
  .iconArrowOuter {
    display: flex;
    span {
      flex: 1;
      font-size: 0;
      .iconfont {
        font-size: 12px;
        vertical-align: bottom;
        line-height: 10px;
      }
    }
  }
  p {
    .iconfont {
      font-size: 14px;
    }
    font-size: 13px;
    height: 24px;
    line-height: 24px;
    padding: 1px 3px;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
