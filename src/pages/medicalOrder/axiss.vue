<template>
  <div class="axis_for_medicalOrder">
    <canvas id="for_longMed_canvas" :style="canvasStyle" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: 'axis_med',
  props: {
    axisInfo: {
      type: Object,
      default: function () {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: 300,
      height: 150,
      rootStyle: null,
      canvasStyle: null,
      times: []
    };
  },
  watch: {
    visible: function (v) {
      if (v) {
        this.resize();
      }
    },
    axisInfo: function () {
      this.setTimes();
    }
  },
  created() {
    this.setTimes();
  },
  mounted() {
    // this.draw();
    this.resize();
  },
  computed: {
    canvasBody: function () {
      return this.axisInfo.canvasBody;
    },
    settedMaxSpan: function () {
      return 12;
    },
    settedWidth: function () {
      return 100;
    }
  },
  methods: {
    draw(pd, stop) {
      let ele = document.getElementById('for_longMed_canvas');
      let ctx = ele.getContext('2d');

      let devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1;
      let ratio = devicePixelRatio / backingStoreRatio;
      if (ratio != 1 && !stop) {
        this.width *= ratio;
        this.height *= ratio;
        this.canvasStyle = {
          width: this.width / ratio + 'px'
        };
        return this.$nextTick(() => {
          this.draw(pd, true);
        });
      }
      ctx.scale(ratio, ratio); // 设置缩放比

      let height = this.height / ratio,
        width = this.width / ratio,
        longScale = 15;
      let paddingX = pd.paddingX - 0.5,
        paddingY = pd.paddingY - 0.5;
      let times = this.times,
        len = times.length;

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#000';
      ctx.font = '12px sans-serif';
      let currentX = paddingX;
      let stepW = (width - 2 * pd.paddingX) / len;
      for (let i = 0; i <= len; i++) {
        let txt = times[i] || '';
        txt = txt.split('-')[1] + '-' + txt.split('-')[2];
        if (i === 0) txt += '(入院)';
        if (i === len - 1) txt += '(出院)';
        // if (i === 0) {
        //   ctx.moveTo(currentX, paddingY);
        //   txt += '(就诊开始时间)';
        // } else {
        ctx.moveTo(currentX, height - paddingY - longScale);
        // }
        ctx.lineTo(currentX, height - paddingY);
        // if (i < len && len > 10) txt = txt.split('-')[2] === '01' ? txt.split('-')[1] + '/' + txt.split('-')[2] : txt.split('-')[2];
        if (i < len) ctx.fillText(txt, currentX, height - paddingY + 13);
        currentX += stepW;
      }
      ctx.strokeStyle = '#000';
      ctx.moveTo(paddingX, height - paddingY);
      ctx.lineTo(width - paddingX, height - paddingY);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#aaa';
      ctx.setLineDash([4, 4]);
      currentX = paddingX;
      stepW = (width - 2 * pd.paddingX) / len;
      for (let i = 0; i <= len; i++) {
        let txt = times[i];
        // if (i === 0) {
        // } else {
        ctx.moveTo(currentX, paddingY);
        // }
        ctx.lineTo(currentX, height - paddingY - longScale);
        currentX += stepW;
      }
      ctx.stroke();
    },
    resize() {
      setTimeout(() => {
        let tar = this.canvasBody;
        let height = parseInt(getComputedStyle(tar).height);
        let width = parseInt(getComputedStyle(tar).width);
        let paddingTop = getComputedStyle(tar).paddingTop;
        let paddingLeft = getComputedStyle(tar).paddingLeft;
        let paddingY = parseInt(paddingTop);
        let paddingX = parseInt(paddingLeft);
        if (this.axisInfo.maxSpan < this.settedMaxSpan) {
          this.width = width + 2 * paddingX;
        } else {
          let num = this.axisInfo.maxSpan,
            singleWidth = this.settedWidth;
          this.width = num * singleWidth;
        }
        this.height = height + 2 * paddingY;
        this.rootStyle = {
          padding: paddingTop + ' ' + paddingLeft
        };
        this.$nextTick(() => {
          this.draw({
            paddingX,
            paddingY
          });
        });
      }, 1);
    },
    setTimes() {
      let arr = [];
      console.log(JSON.parse(JSON.stringify(this.axisInfo)));
      for (let i = 0; i < this.axisInfo.maxSpan; i++) {
        let time = dayjs(this.axisInfo.encStartDate).add(i, 'day').format('YYYY-MM-DD');
        arr.push(time);
      }
      this.times = arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.axis_for_medicalOrder {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0;
  z-index: 1;
}
</style>
