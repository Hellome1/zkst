<template>
  <div v-if="show" class="zkst_loop_container" ref="loop_cont" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="zkst_loop" ref="loop" :isloop="true" @mouseleave="handleMouseleave">
      <div v-if="loading" :isloop="true">加载中...</div>
      <div v-else :isloop="true" class="zkst_loop_step" v-for="(step, ind) in loopList" :key="ind">
        <div class="zkst_loop_stepLine">
          <span class="zkst_loop_order">{{ ind + 1 }}</span>
        </div>
        <div class="zkst_loop_title">{{ step.esStatusDesc || '-' }}</div>
        <div class="zkst_loop_name">{{ step.esOperatorName || '-' }}</div>
        <div class="zkst_loop_date">{{ step.esOperateDate || '-' }}</div>
        <div class="zkst_loop_time">{{ step.esOperateTime || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPacsLoop } from '@/server/api';
import { mapState } from 'vuex';
export default {
  name: 'loop',
  props: {
    info: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      useData: [],
      loopList: [],
      loading: true
    };
  },
  computed: {
    ...mapState(['loopInfoStore']),
    show() {
      return this.loopInfoStore && this.loopInfoStore.show;
    },
    left() {
      return this.loopInfoStore ? this.loopInfoStore.left : 0;
    },
    top() {
      return this.loopInfoStore ? this.loopInfoStore.top + 25 : 0;
    },
    postData() {
      return this.loopInfoStore && this.loopInfoStore.postData;
    },
    ensLogId() {
      return this.postData && this.postData.ensLogId;
    }
  },
  watch: {
    ensLogId(curr, bef) {
      this.loopList = [];
      this.loading = true;
      this.getLoop();
    },
    postData() {
      this.$nextTick(() => {
        this.dealWidth();
      });
    }
  },
  created() {
    if (this.info) this.getLoop();
    console.log('loopInfo:', this.loopInfoStore);
  },
  mounted() {
    this.$nextTick(() => {
      this.dealWidth();
    });
  },
  methods: {
    getLoop() {
      if (this.postData) {
        let postData = this.postData;
        getPacsLoop({
          rows: 1000,
          page: 1,
          ensStatusLogInfo: postData
        })
          .then(res => {
            if (postData != this.postData) return; // 防止多次请求时不能正确展示闭环内容
            this.loopList = res.data;
            this.loading = false;
            this.$nextTick(() => {
              this.dealWidth();
            });
          })
          .catch(e => {
            throw e;
          });
      }
    },
    dealWidth() {
      if (this.loading) return;
      let root = this.$refs.loop_cont;
      if (!root) return;
      let sub_root = this.$refs.loop;
      let currentWidth = root.offsetWidth;
      let ones = root.getElementsByClassName('zkst_loop_step');
      let width = 0;
      for (let i = 0; i < ones.length; i++) {
        let cellWidth = ones[i].offsetWidth + 1;
        width += cellWidth;
      }
      sub_root.style.width = width + 'px';
      if (currentWidth < width) {
        let left = root.offsetLeft;
        let diff = 0;
        if (width <= 600) {
          diff = width - currentWidth;
        } else if (width > 600 && 600 > currentWidth) {
          diff = 600 - currentWidth;
        }
        root.style.left = left - diff + 'px';
      }
    },
    handleMouseleave(e) {
      this.$store.commit('SWITCH_LOOP_SHOW', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.zkst_loop_container {
  position: absolute;
  z-index: 999;
  max-width: 600px;
  overflow: auto;
  background-color: #eee;
  .zkst_loop {
    font-size: 12px;
    vertical-align: top;
    .zkst_loop_step {
      text-align: center;
      padding: 0 3px;
      position: relative;
      display: inline-block;
      vertical-align: top;
      .zkst_loop_stepLine {
        .zkst_loop_order {
          display: inline-block;
          background-color: rgba(67, 207, 124, 1);
          width: 14px;
          height: 14px;
          line-height: 14px;
          color: white;
          border-radius: 50%;
        }
        &::after {
          content: '';
          display: block;
          background-color: rgba(67, 207, 124, 1);
          width: 100%;
          height: 6px;
          position: absolute;
          top: 4px;
          z-index: -1;
        }
      }
      .zkst_loop_title {
        color: rgba(67, 207, 124, 1);
      }
      .zkst_loop_name {
      }
      .zkst_loop_date {
      }
      .zkst_loop_time {
      }
    }
    .zkst_loop_step:first-of-type {
      .zkst_loop_stepLine {
        &::after {
          width: 50%;
          right: -3px;
        }
      }
    }
    .zkst_loop_step:last-of-type {
      .zkst_loop_stepLine {
        &::after {
          width: 54%;
        }
      }
    }
  }
}
</style>
