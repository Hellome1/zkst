<template>
  <div v-show="show" class="detail" ref="root" :style="rootStyle">
    <span class="detail-content" ref="content" :style="detailContentStyle">{{ detailContent }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Detail',
  data() {
    return {
      rootStyle: {},
      detailContentStyle: {}
    };
  },
  watch: {
    show: function () {
      this.rootStyle = { left: this.x + 'px', top: this.y + this.excursionVertical + 'px' };
      this.$nextTick(() => {
        let root = this.$refs.root;
        // console.log(this.x, root.offsetWidth, document.documentElement.clientWidth);
        if (this.x + root.offsetWidth > document.documentElement.clientWidth) {
          this.rootStyle = {
            right: 0,
            top: this.y + this.excursionVertical + 'px'
          };
        }
        if (root.offsetWidth > document.documentElement.clientWidth) {
          this.detailContentStyle = {
            whiteSpace: 'normal'
          };
        } else {
          this.detailContentStyle = {
            whiteSpace: 'nowrap'
          };
        }
      });
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(['detailInfo']),
    x() {
      return this.detailInfo && this.detailInfo.left;
    },
    y() {
      return this.detailInfo && this.detailInfo.top;
    },
    show() {
      return this.detailInfo && this.detailInfo.show;
    },
    excursionVertical() {
      return this.detailInfo && this.detailInfo.excursionVertical;
    },
    detailContent() {
      return this.detailInfo && this.detailInfo.detailContent;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
  position: absolute;
  z-index: 9;
  background-color: white;
  border: 1px solid #333;
  padding: 0px 5px;

  .detail-content {
    white-space: nowrap;
  }
}
</style>