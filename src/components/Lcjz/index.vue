<template>
  <div class="container-lcjz">
    <div class="button" @click="btnClick">历次就诊</div>
    <hos-dialog
      title="历次就诊列表"
      :visible.sync="dialogVisible"
      :width="opt.isRow ? rowWidth + 'px' : '70%'"
      :before-close="handleClose"
      class="elDialog"
      append-to-body
    >
      <LcjzTimeline
        ref="lcjzTimeline"
        :dt="dt"
        :customLcjz="customLcjz"
        :frequency="frequency"
        :encs="encs"
        :maxPage="maxPage"
        @reFetchData="reFetchData"
        @close="dialogVisible = false"
      />
    </hos-dialog>
  </div>
</template>

<script>
import LcjzTimeline from './lcjz.vue';
import { getVisit } from '@/server/api';
export default {
  inject: ['layout'],
  components: {
    LcjzTimeline
  },
  props: {
    dt: {
      // 存放父组件传过来的原始数据
      type: Array,
      default: function () {
        return [];
      }
    },
    customLcjz: null,
    maxPage: null,
    encs: {},
    frequency: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹出框是否可见
      rowWidth: 1000,
      // elTimeline的配置和数据
      opt: {
        isRow: true
      }
    };
  },
  created() {},
  watch: {
    dialogVisible: function (n) {
      if (n) {
        let broserWidth = window.innerWidth;
        if (broserWidth && broserWidth < 1020) {
          this.rowWidth = 780;
        } else {
          this.rowWidth = 1000;
        }
      }
    }
  },
  computed: {},
  methods: {
    // 显示dialog，滚动到关闭位置
    btnClick() {
      this.dialogVisible = true;

      this.$nextTick(() => {
        this.$refs.lcjzTimeline.changeScrollTop();
      });
    },
    // 关闭dialog的回调函数
    handleClose(done) {
      done();
    },
    reFetchData() {
      this.$emit('reFetchData');
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
@import 'index.scss';
</style>
