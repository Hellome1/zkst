<template>
  <div class="container-lcjz">
    <div class="button" @click="btnClick">
      历次就诊
    </div>
    <el-dialog
      title="历次就诊列表"
      :visible.sync="dialogVisible"
      :width="opt.isRow ? '1000px' : '70%'"
      :before-close="handleClose"
      class="elDialog"
      append-to-body
    >
      <div class="topArea">
        <div class="showFilted">
          <span class="title">筛选结果:</span>
          <span class="filterContainer">
            <span class="filterCon" v-for="item in selected" :key="item">
              <span class="filter"> {{ item }} </span>
              <i class="close el-icon-close" @click="delSelected(item)"></i>
            </span>
          </span>
        </div>
        <div class="filterCondition">
          <el-date-picker v-model="startDate" type="date" placeholder="开始日期"> </el-date-picker>
          <el-date-picker v-model="endDate" type="date" placeholder="结束日期"> </el-date-picker>
          <el-select v-model="selectedDep" multiple filterable clearable collapse-tags placeholder="就诊科室">
            <el-option v-for="item in optionsDep" :key="item.value" :label="item.label" :value="item.label"> </el-option>
          </el-select>
          <el-select v-model="selectedDoc" multiple filterable clearable collapse-tags placeholder="就诊医生">
            <el-option v-for="item in optionsDoc" :key="item.value" :label="item.value" :value="item.value"> </el-option>
          </el-select>
          <el-select v-model="selectedType" multiple filterable clearable collapse-tags placeholder="就诊类型">
            <el-option v-for="item in optionsType" :key="item.value" :label="item.value" :value="item.value"> </el-option>
          </el-select>
          <div class="btn-container">
            <el-button type="success" class="cusIconBtn" @click="filter">
              <i class="fa fa-search"></i>
            </el-button>
            <el-button type="success" class="cusIconBtn" @click="clearAll">
              <i class="fa fa-undo"></i>
            </el-button>
          </div>
        </div>
      </div>
      <div class="showChecked">
        <el-button type="success" size="small" class="cusBtn" @click="checkSelected">
          查看选中就诊
        </el-button>
        <el-checkbox v-model="noCancel" class="noCancel">屏蔽取消就诊项</el-checkbox>
        <el-checkbox v-model="rowDirection" class="rowDirection">横向显示</el-checkbox>
      </div>

      <div v-if="opt.isRow" class="btn_container">
        <div class="left_btn" @click="handleLeftBtn">
          <i class="fa fa-chevron-left"></i>
        </div>
        <div class="right_btn" @click="handleRightBtn">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
      <div class="block" :class="opt.isRow ? 'row' : ''" @scroll="handleScroll" ref="blockContainer">
        <template v-if="opt.isRow">
          <Eltimeline :opt="opt" key="row" ref="EltimelineLcjz">
            <template v-slot="slotProps">
              <h4 class="title">{{ slotProps.data.title }}</h4>
              <!-- <div v-if="slotProps.data.detail" :class="slotProps.i == 0 ? 'detailConRow show' : 'detailConRow'">
                <p class="visitType" v-if="slotProps.data.detail.encTypeDesc" :style="{ color: slotProps.data.detail.color }">
                  就诊类型：{{ slotProps.data.detail.encTypeDesc }}
                </p>
                <template v-if="slotProps.data.detail.encStatusDesc.indexOf('就诊') > -1">
                  <p v-if="slotProps.data.detail.encStartDate">就诊日期：{{ slotProps.data.detail.encStartDate }}</p>
                </template>
                <template v-else>
                  <p v-if="slotProps.data.detail.encStatusDesc">就诊状态：{{ slotProps.data.detail.encStatusDesc }}</p>
                  <p v-if="slotProps.data.detail.encStartDate">入院日期：{{ slotProps.data.detail.encStartDate }}</p>
                  <p v-if="slotProps.data.detail.encEndDate">出院日期：{{ slotProps.data.detail.encEndDate }}</p>
                </template>
                <p v-if="slotProps.data.detail.encStartDate && slotProps.data.detail.encEndDate">
                  住院天数：{{ getDay(slotProps.data.detail.encEndDate, slotProps.data.detail.encStartDate) }}
                </p>
                <p v-if="slotProps.data.detail.encDeptName">科室： {{ slotProps.data.detail.encDeptName }}</p>
                <p v-if="slotProps.data.detail.title">主要诊断：{{ slotProps.data.detail.title }}</p>
              </div> -->
            </template>
          </Eltimeline>
        </template>
        <template v-else>
          <Eltimeline :opt="opt" key="column" ref="EltimelineLcjz">
            <template v-slot="slotProps">
              <div v-if="slotProps.data.detail" :class="slotProps.i == 0 ? 'detailCon show' : 'detailCon'">
                <p class="visitType" v-if="slotProps.data.detail.encTypeDesc" :style="{ color: slotProps.data.detail.color }">
                  就诊类型：{{ slotProps.data.detail.encTypeDesc }}
                </p>
                <template v-if="slotProps.data.detail.encStatusDesc.indexOf('就诊') > -1">
                  <p v-if="slotProps.data.detail.encStartDate">就诊日期：{{ slotProps.data.detail.encStartDate }}</p>
                </template>
                <template v-else>
                  <p v-if="slotProps.data.detail.encStatusDesc">就诊状态：{{ slotProps.data.detail.encStatusDesc }}</p>
                  <p v-if="slotProps.data.detail.encStartDate">入院日期：{{ slotProps.data.detail.encStartDate }}</p>
                  <p v-if="slotProps.data.detail.encEndDate">出院日期：{{ slotProps.data.detail.encEndDate }}</p>
                </template>
                <p v-if="slotProps.data.detail.encStartDate && slotProps.data.detail.encEndDate">
                  住院天数：{{ getDay(slotProps.data.detail.encEndDate, slotProps.data.detail.encStartDate) }}
                </p>
                <p v-if="slotProps.data.detail.encDeptName">科室： {{ slotProps.data.detail.encDeptName }}</p>
                <p v-if="slotProps.data.detail.title">主要诊断：{{ slotProps.data.detail.title }}</p>
              </div>
              <p class="desc">{{ slotProps.data.desc }}</p>
            </template>
          </Eltimeline>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Eltimeline from '@/components/elTimeline';
import { getVisit } from '@/server/api';
export default {
  inject: ['layout'],
  components: {
    Eltimeline
  },
  props: {
    dt: {
      // 存放父组件传过来的原始数据
      type: Array,
      default: function() {
        return [];
      }
    },
    customLcjz: null,
    maxPage: null
  },
  data() {
    return {
      loading: false, // 是否加载数据中，为true则不会触发加载数据
      page: 2, // 当前应该加载的数据页数
      dialogVisible: false, // 弹出框是否可见
      selectedEnc: [], // 存放选中的就诊hdcEncId
      // elTimeline的配置和数据
      opt: {
        reverse: false,
        placement: 'top',
        isRow: true,
        activities: [
          {
            isCard: {
              title: 'title1',
              desc: 'desc1'
            },
            content: '支持使用图标',
            timestamp: '2018-04-12 20:46',
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          },
          {
            isCard: {
              title: 'title2',
              desc: 'desc2'
            },
            content: '支持自定义颜色',
            timestamp: '2018-04-03 20:46',
            color: '#0bbd87'
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
      },
      selectedDep: [], // 选中的就诊科室
      optionsDep: [], // 就诊科室可选项
      selectedDoc: [], // 选中的就诊医生
      optionsDoc: [], // 就诊医生可选项
      selectedType: [], // 选中的就诊类型
      optionsType: [], // 就诊类型可选项
      startDate: '', // 选中的开始时间
      endDate: '', // 选中的结束时间
      noCancel: false, // 是否不看取消就诊
      firstLoad: true, // 组件是否第一次请求数据
      currentScroll: 0, // 当前时间轴滚动高度
      rowDirection: false, // 是否横向显示
      scrollLeft: 0, // 横向显示时滚动条滚动位置
      intervalScroll: 0.1 // 横向滚动计时器返回值
    };
  },
  created() {
    // console.log(this.dt, 'dt');
    // this.dt 为传过来的原始数据
    if (this.customLcjz) {
      // 更改是否反序，时间戳位置
      let { reverse, placement } = this.customLcjz;
      if (reverse) this.opt.reverse = reverse;
      if (placement) this.opt.placement = placement;
    }
    if (this.opt.isRow) this.rowDirection = true;
    this.$set(this.opt, 'activities', this.handleDataOpt(this.dt));
  },
  watch: {
    // 监听dt，更新状态
    activities: function() {
      this.loading = false;
    },
    noCancel: function() {
      this.filter();
    },
    rowDirection: function() {
      this.$set(this.opt, 'isRow', this.rowDirection);
    }
  },
  computed: {
    activities: function() {
      return this.opt.activities;
    },
    selected: function() {
      if (!this.startDate) return [...this.selectedDep, ...this.selectedDoc, ...this.selectedType];
      // console.log(dayjs(new Date(this.startDate)).format('YYYY-MM-DD'), this.startDate);
      let date = this.startDate ? [this.startD + '~' + this.endD] : [];
      return [...date, ...this.selectedDep, ...this.selectedDoc, ...this.selectedType];
    },
    startD: function() {
      return this.startDate ? dayjs(new Date(this.startDate)).format('YYYY-MM-DD') : '';
    },
    endD: function() {
      return this.endDate ? dayjs(new Date(this.endDate)).format('YYYY-MM-DD') : '';
    }
  },
  methods: {
    // 显示dialog，滚动到关闭位置
    btnClick() {
      this.dialogVisible = true;

      this.$nextTick(() => {
        this.$refs.EltimelineLcjz.$el.parentNode.scrollTop = this.currentScroll;
      });
    },
    // 关闭dialog的回调函数
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    // 滚动到底部加载更多数据，直到数据加载完成并更新dt后才能再次触发
    handleScroll(e) {
      this.currentScroll = e.target.scrollTop;
      if (this.opt.isRow) {
        this.scrollLeft = e.target.scrollLeft;
        let ul = this.$refs.EltimelineLcjz.$el.getElementsByTagName('ul')[0];
        if (e.target.scrollLeft + e.target.offsetWidth + 5 > ul.offsetWidth) {
          console.log(1);
          !this.loading && this.loadMoreData(this.page);
          this.loading = true;
        }
        return;
      }
      // console.log(this.$refs.ref1.$el.offsetHeight);
      if (e.target.scrollTop + e.target.offsetHeight + 10 > this.$refs.EltimelineLcjz.$el.offsetHeight) {
        !this.loading && this.loadMoreData(this.page);
        this.loading = true;
      }
    },
    getDay(e, s) {
      return dayjs(e).diff(dayjs(s), 'day');
    },
    delSelected(item) {
      if (item.indexOf('~') > -1) {
        this.startDate = '';
        this.endDate = '';
        return;
      }
      this.selectedDep.forEach((itm, index) => {
        if (itm == item) {
          this.selectedDep.splice(index, 1);
        }
      });
      this.selectedDoc.forEach((itm, index) => {
        if (itm == item) {
          this.selectedDoc.splice(index, 1);
        }
      });
      this.selectedType.forEach((itm, index) => {
        if (itm == item) {
          this.selectedType.splice(index, 1);
        }
      });
    },
    // 过滤选项
    filter() {
      // 存放过滤后的数据
      let filted = [];
      // 目标操作数据
      let targetData = this.dt.slice();
      console.log(targetData);

      // 按时间过滤
      if (this.startDate) {
        targetData.forEach(item => {
          let st = dayjs(item.encStartDate).diff(this.startD) > 0 ? true : false;
          let ed = this.endD ? (dayjs(item.encStartDate).diff(this.endD) < 0 ? true : false) : true;
          if (st && ed) {
            filted.push(item);
          }
        });
        targetData = filted;
        filted = [];
      }

      // 按科室过滤
      if (this.selectedDep.length) {
        targetData.forEach(item => {
          for (let i = 0; i < this.selectedDep.length; i++) {
            if (item.encDeptName.split('-')[1] == this.selectedDep[i]) {
              filted.push(item);
            }
          }
        });
        targetData = filted;
        filted = [];
      }

      // 按医生过滤
      if (this.selectedDoc.length) {
        console.log(this.selectedDoc);
        targetData.forEach(item => {
          for (let i = 0; i < this.selectedDoc.length; i++) {
            // console.log(item.encDoc);
            if (item.encDocName == this.selectedDoc[i]) {
              filted.push(item);
            }
          }
        });
        targetData = filted;
        filted = [];
      }

      // 按类型过滤
      if (this.selectedType.length) {
        targetData.forEach(item => {
          for (let i = 0; i < this.selectedType.length; i++) {
            if (item.encTypeDesc == this.selectedType[i]) {
              filted.push(item);
            }
          }
        });
        targetData = filted;
        filted = [];
      }

      // 过滤取消就诊
      if (this.noCancel) {
        targetData.forEach(item => {
          if (item.encStatusCode != 'C') {
            filted.push(item);
          }
        });
        targetData = filted;
        filted = [];
      }

      this.opt.activities = this.handleDataOpt(targetData);
    },
    clearAll() {
      this.startDate = '';
      this.endDate = '';
      ['selectedDep', 'selectedDoc', 'selectedType'].forEach(item => {
        this[item] = [];
      });
    },
    // 查看选中就诊，渲染到专科视图
    checkSelected() {
      this.$store.commit('lcjz_set_encIds', this.selectedEnc);
      // getVisit({ rows: 7, hdcEncId: this.$store.state.lcjz_encIds.join('||') }).then(res => {});
      this.$emit('reFetchData');
      this.dialogVisible = false;
    },
    // 处理数据 lcjz
    handleDataOpt(data) {
      // let optObj = {
      //   reverse: false,
      //   placement: 'top'
      // };
      // 存储处理好的数据
      let { timestamp, size, isCard, hover } = this.customLcjz.activity;
      let _this = this;
      let activities = [];
      data.forEach((item, index) => {
        // 筛选科室和医生
        ['optionsDep', 'optionsDoc', 'optionsType'].forEach(options => {
          let key = options.indexOf('Dep') > -1 ? 'encDeptName' : options.indexOf('Doc') > -1 ? 'encDocName' : 'encTypeDesc';
          let isPush = true;
          this[options].forEach(option => {
            if (option.value == item[key]) isPush = false;
          });
          if (isPush) {
            this[options].push({
              value: item[key],
              label: item[key].indexOf('-') > -1 ? item[key].split('-')[1] : item[key]
            });
          }
        });

        // push需要的参数
        let param = {
          timestamp: timestamp ? (timestamp.indexOf('_') > -1 ? item[timestamp.substr(1)] : timestamp) : item.encStartDate,
          key: item.encStartDate + index,
          size,
          hover,
          isCard: {
            desc: isCard && isCard.desc ? (isCard.desc.indexOf('_') > -1 ? item[isCard.desc.substr(1)] : isCard.desc) : item.encStatusDesc,
            mouseenter: this.opt.isRow
              ? function(e) {
                  // console.log(e);
                  if (!_this.opt.isRow) return;
                  let target = _this.createEl(this.detail);

                  let { left, top } = offsetToBody(e.target);
                  // console.log(_this.scrollLeft);
                  target.style.left = left - 30 - _this.scrollLeft + 'px';
                  target.style.top = top + 50 + 'px';
                  // target.style.left = e.clientX - 50 + 'px';
                  // target.style.top = e.clientY + 20 + 'px';
                  // let detailCon = e.target.getElementsByClassName('detailConRow')[0];
                  // if (!detailCon) return;
                  // detailCon.style.display = 'block';
                  function offsetToBody(element) {
                    let left = 0,
                      top = 0;
                    while (element && element.tagName !== 'body') {
                      left += element.offsetLeft;
                      top += element.offsetTop;
                      element = element.offsetParent;
                    }
                    return { left, top };
                  }
                }
              : null,
            mouseleave: this.opt.isRow
              ? function(e) {
                  if (!_this.opt.isRow) return;
                  let target = document.getElementsByClassName('special_czy_showTag')[0];
                  target.style.display = 'none';
                  // let detailCon = e.target.getElementsByClassName('detailConRow')[0];
                  // if (!detailCon) return;
                  // detailCon.style.display = 'none';
                }
              : null,
            // 具体展示需要的参数
            detail: {
              encTypeDesc: item.encTypeDesc,
              encStatusDesc: item.encStatusDesc,
              encStartDate: item.encStartDate,
              encEndDate: item.encEndDate,
              encDeptName: item.encDeptName
            }
          }
        };
        // 需要处理的title
        let title = '';

        let encStatusCode = item.encStatusCode;
        let diagnoseInfo = item.diagnoseInfo;
        if (encStatusCode != 'C' && diagnoseInfo) {
          // 如果不是取消就诊且就诊信息存在
          for (let i = 0; i < diagnoseInfo.length; i++) {
            title += diagnoseInfo[i].diagnoseName;
            if (i != diagnoseInfo.length - 1) title += ';';
          }
        } else if (encStatusCode != 'C') {
          // 如果不是取消就诊但就诊信息不存在
          title = '诊断未录入';
        } else {
          title = '已取消';
          param.noSelect = true;
        }

        // 配置颜色
        switch (encStatusCode) {
          case 'A':
            param.color = item.encTypeCode == 'E' ? '#db6a42' : '#eec15e';
            break;
          case 'C':
            param.color = '';
            break;
          case 'D':
            param.color = '#5a7fee';
            break;
          default:
            break;
        }

        // 配置具体显示的颜色
        switch (item.encTypeCode) {
          case 'O':
            param.isCard.detail.color = '#eec15e';
            if (param.noSelect) break;
            param.clickType = 2;
            break;
          case 'I':
            param.isCard.detail.color = '#5a7fee';
            param.clickType = 1;
            break;
          case 'E':
            param.isCard.detail.color = '#db6a42';
            param.clickType = 3;
            break;
          default:
            param.isCard.detail.color = '#eec15e';
            break;
        }

        // 配置事件
        if (!param.noSelect) {
          param.click = function() {
            let isPush = true;
            let start;
            _this.selectedEnc.forEach((enc, index) => {
              if (enc == item.hdcEncId) {
                isPush = false;
                start = index;
              }
            });
            if (isPush) {
              _this.selectedEnc.push(item.hdcEncId);
            } else {
              _this.selectedEnc.splice(start, 1);
            }
            console.log(_this.selectedEnc, 'selectedEnc');
          };
        }

        param.isCard.title = title;
        param.isCard.detail.title = title;
        activities.push(param);
      });
      return activities;
    },
    // page = 2 需要加载两次，一次rows = 7，一次rows = 14，因为直接从page1row7 到 page2row14 会跳过第8到14条数据
    loadMoreData(page) {
      console.log('l1', page, this.maxPage);
      if (page > this.maxPage) return;
      getVisit({ rows: page == 2 && this.firstLoad ? 7 : 14, page: page }).then(res => {
        this.page++;
        if (page == 2 && this.firstLoad) {
          this.firstLoad = false;
          this.page = 2;
        }
        this.dt.push(...res.data);
        if (this.selected.length) {
          this.filter();
        } else {
          this.opt.activities.push(...this.handleDataOpt(res.data));
        }
        // this.opt.push(...this.handleDataOpt(res.data));
      });
    },
    createEl(detail) {
      let target = document.getElementsByClassName('special_czy_showTag')[0];
      if (target) {
        target.style.display = 'block';
      } else {
        target = document.createElement('div');
        target.className = 'special_czy_showTag';
        target.style.position = 'absolute';

        document.body.appendChild(target);
      }

      let eleArr = [];
      let detailConRow = el('div.detailConRow');
      let visitType = el('p.visitType', `就诊类型：${detail.encTypeDesc}`);
      visitType.style.color = detail.color;
      eleArr = [visitType];
      if (detail.encStatusDesc.indexOf('就诊') > -1) {
        detail.encStartDate && eleArr.push(el('p', `就诊日期：${detail.encStartDate}`));
      } else {
        detail.encStatusDesc && eleArr.push(el('p', `就诊状态：${detail.encStatusDesc}`));
        detail.encStartDate && eleArr.push(el('p', `入院日期：${detail.encStartDate}`));
        detail.encEndDate && eleArr.push(el('p', `出院日期：${detail.encEndDate}`));
      }
      if (detail.encStartDate && detail.encEndDate) eleArr.push(el('p', `住院天数：${this.getDay(detail.encEndDate, detail.encStartDate)}`));

      detail.encDeptName && eleArr.push(el('p', `科室：${detail.encDeptName}`));
      detail.title && eleArr.push(el('p', `主要诊断：${detail.title}`));

      eleArr.forEach(item => {
        detailConRow.appendChild(item);
      });

      target.innerHTML = '';
      target.appendChild(detailConRow);

      return target;

      function el(str, html) {
        let tag = str.split('.')[0];
        let cla = str.split('.')[1];
        let ele = document.createElement(tag);
        if (cla) ele.className = cla;
        if (html) ele.innerHTML = html;
        return ele;
      }
    },
    handleLeftBtn() {
      // console.log(this.$refs.blockContainer.scrollLeft);
      let left = this.$refs.blockContainer.scrollLeft - 925;
      left = left < 0 ? 0 : left;
      this.scrollLeft = left;
      // this.$refs.blockContainer.scrollLeft = left;
      if (!this.intervalScroll) return;
      this.scroolTo(this.$refs.blockContainer, left);
    },
    handleRightBtn() {
      let left = this.$refs.blockContainer.scrollLeft + 925;
      let ul = this.$refs.EltimelineLcjz.$el.getElementsByTagName('ul')[0];
      let max = ul.offsetWidth - 925;
      left = left > max ? max : left;
      if (left == max) {
        this.loadMoreData(this.page);
      }
      this.scrollLeft = left;
      // this.$refs.blockContainer.scrollLeft = left;
      if (!this.intervalScroll) return;
      this.scroolTo(this.$refs.blockContainer, left);
    },
    scroolTo(target, end) {
      let step;
      let sum = this.$refs.blockContainer.scrollLeft;
      clearInterval(this.intervalScroll);
      let interval1 = setInterval(() => {
        this.intervalScroll = null;
        if (end > this.$refs.blockContainer.scrollLeft) {
          step = (end - sum) / 7;
          step = Math.round(step);
          step = step < 2 ? 2 : step;
          sum += step;
          if (sum >= end) {
            clearInterval(interval1);
            this.intervalScroll = interval1;
          }
          this.$refs.blockContainer.scrollLeft += step;
        } else {
          step = (end - sum) / 7;
          step = Math.round(step);
          step = step > -2 ? -2 : step;
          sum += step;
          if (sum <= end) {
            clearInterval(interval1);
            this.intervalScroll = interval1;
          }
          this.$refs.blockContainer.scrollLeft += step;
        }
      }, 25);
    }
  }
};
</script>

<style lang="scss">
@import 'index.scss';
</style>
