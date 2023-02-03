<template>
  <div class="slider-gene-c">
    <div class="slider-bg" ref="slider" @mousemove="handleMouseMove" @click="handleClickThrough">
      <div class="scales">
        <div class="scale" v-for="op in opt" :key="op.value">
          <div class="scaleLine"></div>
          <div class="scaleLabel">{{ op.label }}</div>
        </div>
      </div>
      <div class="scaleThrough"></div>
      <div class="slider-bar" :style="barStyle" @mousedown.prevent="handleMouseDown"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderGene',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: null,
    opt: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      barStyle: {},
      barMouseDown: false,
      clickX: null
    };
  },
  watch: {
    value: function (n) {
      this.barStyle = {
        left: (this.sliderWidth * n) / (this.opt.length - 1) - 3 + 'px'
      };
    }
  },
  created() {},
  mounted() {
    this.adjustBarStyle();
  },
  methods: {
    handleMouseMove(e) {
      if (!this.barMouseDown) return;
      let left = e.pageX - this.clickX + this.barLeftWhenClick,
        min = -3,
        max = this.sliderWidth - 3;
      left = left < min ? min : left > max ? max : left;
      this.barStyle = {
        left: left + 'px'
      };
    },
    handleMouseDown(e) {
      this.barMouseDown = true;
      this.barLeftWhenClick = (this.sliderWidth * this.value) / 2 - 3;
      this.clickX = e.pageX;

      let mask = this.$refs.slider;
      while (mask.parentNode != document.body) {
        mask = mask.parentNode;
      }
      mask.removeEventListener('mouseup', this.handleMouseUp);
      mask.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp(e) {
      this.barMouseDown = false;
      let left = parseFloat(this.barStyle.left);
      this.confirmBarStyle(left);
    },
    handleClickThrough(e) {
      let left = e.pageX - this.pageLeft;
      this.confirmBarStyle(left);
    },
    // 确定滑动条的位置
    confirmBarStyle(left) {
      let min = this.sliderWidth / 4,
        max = (this.sliderWidth * 3) / 4,
        value;
      if (left < min) {
        value = 0;
      } else if (left > max) {
        value = 2;
      } else {
        value = 1;
      }
      this.$emit('change', value);
      this.barStyle = {
        left: (this.sliderWidth * value) / (this.opt.length - 1) - 3 + 'px'
      };
    },
    adjustBarStyle() {
      let sliderDom = this.$refs.slider,
        sliderWidth = getComputedStyle(sliderDom).width;
      sliderWidth = parseFloat(sliderWidth);
      this.sliderWidth = sliderWidth;
      console.log(sliderWidth);

      let left = 0,
        curr = sliderDom;
      while (curr) {
        if (typeof curr.offsetLeft === 'undefined') break;
        left += curr.offsetLeft;
        curr = curr.offsetParent;
      }
      this.pageLeft = left;

      this.barStyle = {
        left: (sliderWidth * this.value) / (this.opt.length - 1) - 3 + 'px'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.slider-gene-c {
  box-sizing: border-box;
  width: 100%;
  position: relative;
  padding-right: 30px;
  .slider-bg {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: relative;
    cursor: pointer;
    .scales {
      display: flex;
    justify-content: space-between;
    width: 100%;
    position: relative;
      .scale {
        position: relative;
        .scaleLine {
          width: 1px;
          height: 11px;
          background-color: #888;
          position: relative;
  
          &::before {
            content: '';
            display: block;
            position: absolute;
          }
          &::after {
            content: '';
            display: block;
            position: absolute;
          }
        }
        .scaleLabel {
          user-select: none;
          cursor: pointer;
        }
      }
    }
    .scale:nth-of-type(3) {
      .scaleLabel {
        position: absolute;
        white-space: nowrap;
      }
    }
    .scaleThrough {
      position: absolute;
      height: 1px;
      width: 100%;
      background-color: #888;
      left: 0px;
      top: 5px;
    }
    .slider-bar {
      width: 6px;
      height: 11px;
      background-color: #000;
      position: absolute;
    }
  }
}
</style>