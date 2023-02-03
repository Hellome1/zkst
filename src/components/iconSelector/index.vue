<template>
  <div class="icon-selector" ref="root">
    <div class="i-s-s-c" @click="showSelectMore = !showSelectMore">
      <div class="i-s-show" :style="{ backgroundColor: bgcolor }">
        <i v-if="value" :class="value"></i>
        <span v-else>x</span>
      </div>
    </div>
    <div class="i-s-select-more" :class="showSelectMore ? 'slide-out' : ''" :style="{ backgroundColor: bgcolor }">
      <div class="icons" ref="icons" :style="iconsStyle">
        <i v-for="ic in icons" :key="ic" :class="'fa ' + ic" @click="$emit('change', 'fa ' + ic)"></i>
      </div>
      <span class="mini-btn" @click="$emit('change', '')">清除</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconSelector',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: '',
    bgcolor: '',
    proot: {
      type: HTMLDivElement
    }
  },
  data() {
    return {
      showSelectMore: false,
      icons: ['fa-file-text', 'fa-clipboard', 'fa-link', 'fa-paperclip', 'fa-file-text-o', 'fa-pie-chart', 'fa-bar-chart', 'fa-eyedropper'],
      iconsStyle: {}
    };
  },
  created() {},
  mounted() {
    this.addCloseListener();
  },
  methods: {
    addCloseListener() {
      let unwatch = this.$watch('showSelectMore', () => {
        let listenCloseElement = null,
          current = this.$refs.root;
        while (current.parentNode && !(current.parentNode === document.body)) {
          current = current.parentNode;
        }
        listenCloseElement = current;
        listenCloseElement.addEventListener('click', e => {
          let tar = e.target,
            iconsE = this.$refs.icons,
            width = iconsE.offsetWidth;
          if (width >= 190) {
            this.iconsStyle = {
              height: '25px',
              marginTop: '2px'
            };
          }
          while (tar.parentNode) {
            if (tar === this.$refs.root) return;
            tar = tar.parentNode;
          }
          this.showSelectMore = false;
        });
        unwatch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-selector {
  .i-s-s-c {
    padding: 3px;
    border: 1px solid #eee;
    border-radius: 3px;
    cursor: pointer;

    .i-s-show {
      width: 30px;
      height: 30px;
      background-color: black;
      border: 1px solid #aaa;
      border-radius: 3px;
      color: white;
      text-align: center;
      line-height: 30px;
      user-select: none;

      .fa-close {
        font-weight: 100;
      }
    }
  }
  .i-s-select-more {
    position: absolute;
    padding: 0px 8px;
    background-color: black;
    color: white;
    border-radius: 3px;
    line-height: 30px;
    height: 0px;
    opacity: 0;
    transition: 0.1s;
    white-space: nowrap;

    .icons {
      display: inline-block;
      max-width: 190px;
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      overflow-x: auto;
      background-color: rgba(0, 0, 0, 0.1);
    }
    .fa {
      margin: 0 5px;
    }
    .mini-btn {
      padding: 1px 3px;
      background-color: white;
      font-size: 12px;
      border-radius: 2px;
      color: black;
      margin-left: 6px;
      vertical-align: top;
      cursor: pointer;
      &:hover {
        color: rgba(37, 148, 227, 0.865);
      }
    }
  }
  .i-s-select-more.slide-out {
    height: 30px;
    opacity: 1;
  }
}
</style>