<template>
  <div v-if="!isRow" class="hos-timeline-container">
    <hos-timeline v-if="opt" :reverse="opt.reverse">
      <hos-timeline-item
        v-for="(activity, index) in opt.activities"
        :key="activity.key || index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
        :placement="opt.placement"
        @mouseenter.native.once="activity.hover ? addHover($event, activity.hover) : null"
      >
        <template v-if="activity.isCard">
          <hos-card
            :class="elCardClass(activity)"
            ref="elCard"
            @mouseenter.native="activity.isCard.mouseenter ? activity.isCard.mouseenter($event) : null"
            @mouseleave.native="activity.isCard.mouseleave ? activity.isCard.mouseleave($event) : null"
          >
            <input v-if="!activity.noSelect" type="checkbox" class="elCard-input" @change="handleChange(activity)" />
            <slot :data="activity.isCard" :i="index">
              <h3>目前没有内容...</h3>
              <p>此处为插槽默认内容</p>
            </slot>
          </hos-card>
        </template>
        <template v-else>
          {{ activity.content }}
        </template>
      </hos-timeline-item>
      <div style="height: 50px" v-if="loading" v-loading="loading"></div>
    </hos-timeline>
  </div>
  <div v-else class="hos-timeline-container row">
    <hos-timeline v-if="opt" :reverse="opt.reverse" ref="timeline">
      <hos-timeline-item
        v-for="(activity, index) in opt.activities"
        :key="activity.key ? activity.key : index"
        ref="timelineItem"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
        placement="bottom"
        @mouseenter.native.once="activity.hover ? addHover($event, activity.hover) : null"
      >
        <template v-if="activity.isCard">
          <hos-card
            :class="elCardClass(activity)"
            ref="elCard"
            @mouseenter.native="activity.isCard.mouseenter ? activity.isCard.mouseenter($event) : null"
            @mouseleave.native="activity.isCard.mouseleave ? activity.isCard.mouseleave($event) : null"
          >
            <input v-if="!activity.noSelect" type="checkbox" class="elCard-row-input" @change="handleChange(activity)" />
            <slot :data="activity.isCard" :i="index">
              <p>此处为插槽默认内容</p>
            </slot>
          </hos-card>
        </template>
        <template v-else>
          {{ activity.content }}
        </template>
      </hos-timeline-item>
      <!-- <div class="detail" v-for="(activity, index) in opt.activities" :key="activity.key ? '_sl' + activity.key : '_sl' + index">
        <slot name="detail" :data="activity.isCard" :i="index">
          <h3>目前没有内容...</h3>
        </slot>
      </div> -->
    </hos-timeline>
  </div>
</template>

<script>
export default {
  props: {
    opt: {
      type: Object,
      default: function () {
        // 前往 http://localhost:8080/components/elTimeline 查看模版效果
        return {
          reverse: false, // 是否反序
          placement: 'bottom', // 时间戳位置
          isRow: true, // 是否横向显示
          activities: [
            {
              isCard: {
                title: 'title2llllllllllllllllllllllllllllllllllllllll',
                desc: 'desc2'
              },
              content: '支持自定义颜色',
              size: 'large',
              timestamp: '2018-04-03 20:46'
            },
            {
              isCard: {
                // 是否内容部分为卡片，插入内容需要用到的参数
                title: 'title1',
                desc: 'desc1',
                // 传入卡片事件监听
                mouseenter: function (e) {
                  console.log('enter1');
                },
                mouseleave: function (e) {
                  console.log('leave1');
                }
              },
              content: '支持使用图标', // isCard为true，此字段的值会被忽略
              timestamp: '2018-04-12 20:46 支持移入移出事件 （仅卡片）', // 时间戳显示内容
              size: 'large', // 时间节点大小
              type: 'primary' // 时间节点类型
            },
            {
              isCard: {
                title: 'title2',
                desc: 'desc2'
              },
              content: '支持自定义颜色',
              timestamp: '2018-04-03 20:46 支持点击事件 （仅卡片）',
              color: '#0bbd87', // 时间节点颜色
              clickType: 3,
              // 时间轴点击事件
              click: function (e) {
                console.log(e);
                console.log('click');
              }
            },
            {
              isCard: {
                title: 'title2',
                desc: 'desc2'
              },
              content: '支持自定义颜色',
              timestamp: '2018-04-03 20:46 支持点击禁用样式 （仅卡片）',
              noSelect: true // 是否设置点击禁用样式
            },
            {
              content: '支持移入背景颜色变化',
              timestamp: '2018-04-12 20:46',
              size: 'large',
              hover: 'rgba(150, 200, 200, 0.1)' // 移入背景颜色
            },
            {
              content: '支持使用图标',
              timestamp: '2018-04-12 20:46',
              size: 'large',
              type: 'primary',
              icon: 'hos-icon-more' // 是否使用图标以及图标的样式
            },
            {
              content: '支持自定义颜色',
              timestamp: '2018-04-03 20:46',
              color: '#0bbd87' // 时间节点的样式
            },
            {
              content: '支持自定义尺寸',
              timestamp: '2018-04-03 20:46',
              size: 'large'
            },
            {
              content: '默认样式的节点',
              timestamp: '2018-04-03 20:46'
            }
          ]
        };
      }
    },
    selected: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: false
  },
  watch: {},
  data() {
    return {
      isRow: this.opt.isRow,
      s: 1
    };
  },
  mounted() {
    this.isRow && this.setUlWidth();
  },
  updated() {
    this.isRow && this.setUlWidth();
  },
  methods: {
    // 调整宽度，当时间轴横向显示时调整宽度
    setUlWidth() {
      // console.log(this.$refs.timeline);
      let width = 0;
      this.$refs.timelineItem.forEach(item => {
        // console.log(item);
        // console.log(item.$el.offsetWidth);
        width += item.$el.offsetWidth;
      });
      this.$refs.timeline.$el.style.width = width + 'px';
    },
    // 添加移入事件方法
    addHover(e, color) {
      e.target.hocr = color;
      e.target.style.backgroundColor = color;
      e.target.onmouseenter = function () {
        this.style.backgroundColor = this.hocr;
      };
      e.target.onmouseleave = function () {
        this.style.backgroundColor = '';
      };
    },
    // 添加点击事件方法
    addClick(e, type, cb) {
      // console.log(e);
      let dom = null;
      let target = 'hos-card__body';
      if (e.target.className != target) {
        // console.log(e.target);
        e.path.forEach(item => {
          if (item.className == target) {
            dom = item;
          }
        });
      } else {
        dom = e.target;
      }
      if (!dom) {
        console.log(type);
        console.log(e.path);
      }
      if (type) dom.type = type;
      dom.className = dom.className + ' elTimelineSelected' + type;
      cb && cb(e);
      dom.onclick = function () {
        let cln = dom.className;
        let index = cln.indexOf('elTimelineSelected');
        dom.className = index > -1 ? 'hos-card__body' : cln + ' elTimelineSelected' + this.type;
        cb && cb(e);
      };
    },
    // 判断某段时间轴内容是否有被选中并返回classname的方法
    elCardClass(activity) {
      let className = activity.noSelect ? 'elTimelineNoSelect' : activity.clickType ? 'elTimelineSelectable' : '';
      className += ' elCard';
      if (activity.clickType && activity.id && this.selected.includes(activity.id)) {
        className += ' elTimelineSelected' + activity.clickType;
      }
      return className;
    },
    /* 操作方法：当选中某段可选内容时 */
    handleChange(ac) {
      console.log(ac.id);
      if (ac.id && !ac.noSelect) {
        this.$emit('seleOrRemo', ac.id);
      }
    }
  }
};
</script>

<style lang="scss">
.elTimelineSelected1 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/hosIcon.png) no-repeat right bottom;
}
.elTimelineSelected2 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/outIcon.png) no-repeat right bottom;
}
.elTimelineSelected3 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/emIcon.png) no-repeat right bottom;
}
.row .elTimelineSelected1 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/hosIcon.png) no-repeat right bottom/24px;
}
.row .elTimelineSelected2 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/outIcon.png) no-repeat right bottom/24px;
}
.row .elTimelineSelected3 {
  background: rgba(24, 144, 255, 0.15) url(../../assets/img/emIcon.png) no-repeat right bottom/24px;
}
.elTimelineNoSelect {
  color: #c0c4cc;
  opacity: 0.6;
  cursor: not-allowed;
}
.elTimelineSelectable {
  cursor: pointer;
}
.elCard {
  position: relative;
  transition: none;
}
.elCard-input {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.elCard-row-input {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.hos-timeline-container.row {
  // overflow-x: auto;
  // height: 300px;
  .hos-timeline {
    padding-bottom: 20px;
    .hos-timeline-item {
      float: left;
      padding-bottom: 0;
      .hos-timeline-item__tail {
        left: 0;
        bottom: 32px;
        width: 100%;
        border-left: none;
        height: 0;
        border-bottom: 2px solid #e4e7ed;
      }
      .hos-timeline-item__node {
        left: calc((100% - 12px - 40px) / 2 + 40px);
        bottom: 27px;
      }
      .hos-timeline-item__node.hos-timeline-item__node--large {
        left: calc((100% - 14px - 40px) / 2 + 40px);
        bottom: 26px;
      }
      .hos-timeline-item__wrapper {
        padding: 0 0 0 35px;
        text-align: center;
        .hos-timeline-item__content {
          margin: auto;
          margin-top: 20px;
          height: 38px;
          width: 150px;
          .hos-card {
            .hos-card__body {
              box-sizing: border-box;
              width: 100%;
              padding: 8px 5px;
              h1,
              h2,
              h3,
              h4,
              h5,
              h6,
              p {
                margin: 0;
              }
              .title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          &::after {
            content: '';
            display: block;
            width: 0;
            position: absolute;
            left: calc((100% - 16px - 40px) / 2 + 40px);
            border-top: 8px solid #c2c2c2;
            border-left: 8px solid rgba(0, 0, 0, 0);
            border-right: 8px solid rgba(0, 0, 0, 0);
            border-bottom: 8px solid rgba(0, 0, 0, 0);
          }
        }
        .hos-timeline-item__timestamp.is-bottom {
          margin-top: 36px;
        }
      }
      &:first-child {
        .hos-timeline-item__tail {
          left: calc((100% - 40px) / 2 + 40px);
          width: calc((100% - 40px) / 2);
        }
      }
      &:last-child {
        .hos-timeline-item__tail {
          display: block;
          width: calc((100% - 40px) / 2 + 40px);
        }
      }
    }
    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }
  .detail {
    position: absolute;
  }
}
</style>
