<template>
  <div class="insp-container" v-loading="loading" v-if="!empty">
    <div class="insp-header">
      <div>
        <label for="abnormal">异常值置顶</label>
        <el-switch id="abnormal" v-model="abnormal"></el-switch>
      </div>
      <div class="insp-title">{{ this.insName() }}</div>
      <!-- 仅用于使标题居中 -->
      <div class="insp-placeholder"></div>
    </div>
    <main class="insp-main" v-if="infos.length">
      <div class="insp-all" v-loading="inspAllLoading">
        <div>
          <el-descriptions :labelStyle="{ color: 'grey' }">
            <el-descriptions-item label="患者">{{ this.$store.state.patientInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="科室">{{ this.infos[this.activeIndex].inspRptDeptDesc }}</el-descriptions-item>
            <el-descriptions-item label="标本">{{ this.infos[this.activeIndex].inspSpecmName }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 检验表格 -->
        <el-table
          ref="inspTable"
          :data="lisItemResultInfo"
          :stripe="true"
          :border="true"
          highlight-current-row
          @current-change="handleCurrentChange"
          :cell-class-name="isAbnormall"
          tooltip-effect="light"
          :header-cell-style="{
            'background-color': '#838383',
            color: '#fff'
          }"
          @row-click="showItemDesc"
        >
          <el-table-column
            v-for="(obj, index) in inspTableTemp"
            :key="index"
            :label="obj.label"
            :type="obj.type"
            :width="obj.width"
            :min-width="obj.minWidth"
            :align="obj.align"
            :header-align="obj.headerAlign"
            :show-overflow-tooltip="obj.showOverflowTip"
            :prop="obj.prop"
            :formatter="obj.formatter"
          ></el-table-column>
        </el-table>
        <div>
          <el-descriptions :labelStyle="{ color: 'grey' }">
            <el-descriptions-item v-for="(obj, index) in bottomDescTemp" :label="obj.label">
              {{ infos[activeIndex][obj.prop] }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div>
          <el-button :disabled="activeIndex === 0" @click="changeActiveIndex($event, -1)">上一项</el-button>
          <el-button :disabled="activeIndex === infos.length - 1" @click="changeActiveIndex($event, 1)">下一项</el-button>
        </div>
      </div>

      <!-- 单项检验的历史记录表格 -->
      <div class="insp-one" v-loading="inspOneLoading">
        <div class="insp-one-header">
          <div>
            历史值:
            <span style="color: #1d82e9; font-weight: bold">{{ insDescItem[0] ? insDescItem[0].inspItemDesc : '' }}</span>
          </div>

          <div>
            <el-link @click="showGraph($event)" :underline="false" v-if="insDescItem[0] ? /\d/.test(insDescItem[0].inspectionValue) : false">查看曲线</el-link>
          </div>
        </div>
        <el-table :data="insDescItem" :cell-class-name="isAbnormall" border>
          <el-table-column
            v-for="(obj, index) in inspHistoryTemp"
            :key="index"
            :type="obj.type"
            :label="obj.label"
            :width="obj.width"
            :align="obj.align"
            :header-align="obj.headerAlign"
            :prop="obj.prop"
            :formatter="obj.formatter"
          ></el-table-column>
        </el-table>
      </div>
      <!-- end -->

      <!-- 曲线图 -->
      <el-dialog class="insp-graph-container" :visible.sync="show" title="检验指标变化" width="90%" :before-close="resetGraphOption">
        <!-- 为了在el-dialog中切换检验项时重新mounte组件,必须添加v-if属性 -->
        <inspection-graph
          ref="graph"
          v-if="show"
          :inspName="insDescItem[0].inspItemDesc"
          :inspValue="getEchartsData()"
          :otherLineData="echartsLineDatas"
          :otherTimeData="echartsTimeDatas"
          :height="600"
        >
          <template v-slot:toolbar>
            <div class="insp-graph-toolbar">
              <div style="display: flex; gap: 30px">
                <div>
                  <el-button size="mini" @click="openInnerDialog('用药/治疗')">+用药/治疗</el-button>
                  <el-button size="mini" @click="openInnerDialog('检验项')">+检验项</el-button>
                  <el-checkbox v-model="showTemperature" label="体温" border size="mini"></el-checkbox>
                </div>
                <div>
                  <label
                    >时间段:
                    <el-date-picker
                      size="mini"
                      v-model="dateRange"
                      type="daterange"
                      range-separator="至"
                      :start-placeholder="startDate"
                      :end-placeholder="endDate"
                      :unlink-panels="true"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </label>
                  <el-button type="primary" @click="setDateRange" size="mini">查询</el-button>
                </div>
              </div>
              <div>
                <el-button size="mini" @click="saveImg">导出图片</el-button>
              </div>
            </div>
          </template>
        </inspection-graph>
        <!-- 内层dialog 用于选择图表中额外的内容 -->
        <el-dialog :visible.sync="innerDialog" width="40%" append-to-body :title="innerType">
          <div style="display: flex; justify-content: space-between">
            <div>
              <el-autocomplete v-model="chooseItem" placeholder="请输入名称" :fetch-suggestions="querySearch" @select="handleSelect" :debounce="300">
                <template slot-scope="{ item }">
                  <div>{{ item.name || item.orderName }}</div>
                </template>
              </el-autocomplete>
            </div>
            <div>
              <template v-if="multipleSelection.length">
                <el-button @click="deleteSelection()">清除所有</el-button>
                <el-button type="primary" @click="submitSelection">确认</el-button>
              </template>
            </div>
          </div>
          <div style="height: 28px; line-height: 28px; margin-bottom: 20px">
            已选择项目:
            <el-tag v-for="(obj, index) in multipleSelection" :key="index" effect="plain" closable size="medium" @close="deleteSelection(index)">
              {{ obj.inspItemDesc || obj.orderName }}
            </el-tag>
          </div>
          <el-table
            :data="innerDialogData"
            style="cursor: pointer"
            ref="extraTable"
            size="mini"
            max-height="500"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" width="100"></el-table-column>
            <el-table-column label="名称" header-align="center">
              <template slot-scope="scope">
                {{ scope.row.inspItemDesc || scope.row.orderName }}
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-dialog>
      <!-- end -->
    </main>
  </div>
  <div v-else>
    <el-empty :image-size="200"></el-empty>
  </div>
</template>

<script>
// import {
// 	getLis,
// 	getLisNorm,
// 	getInsDesc,
// 	getAllInsItem,
// 	getMedical,
// 	getInsItemDesc,
// } from '@/server/api.js';
import inspectionGraph from './inspectionGraphexp.vue';

export default {
  components: {
    inspectionGraph
  },
  data() {
    return {
      empty: false, // 是否为空数据

      abnormal: false, // 是否置顶异常指标
      insDescItem: [], // 单个检验指标的历史数据

      inspAllLoading: true,
      inspOneLoading: true,
      /** 表格配置项 */
      inspTableTemp: setting.modules.inspecitonInfo.table,
      bottomDescTemp: setting.modules.inspecitonInfo.bottomDescription,
      inspHistoryTemp: setting.modules.inspecitonInfo.historyTable,
      currentRow: null,
      /* 所有和图表有关的数据 */
      show: false, // 是否显示图表
      dispose: false,
      innerType: '',
      inspChart: null, // echart实例
      innerDialog: false,
      innerDialogData: [], // 检验图标内层表格数据
      innerMedicalInfo: [], //用药信息
      lisItemResultInfo: [],
      dateRange: '',
      showTemperature: false, // 显示体温
      showGraphNum: true, // 显示图表数值
      showRefValue: true, // 显示参考值
      option: {}, // echarts配置
      startDate: null,
      endDate: null,
      multipleSelection: [], // 图表中选择项
      chooseItem: '', //搜索指定的项目
      echartsLineDatas: [],
      echartsTimeDatas: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',

            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    infos() {
      return this.$store.state.infos;
    },
    activeIndex() {
      return this.$store.state.activeIndex;
    },
    // 用于同时监听多个值
    allGraphOption() {
      const { showTemperature, showGraphNum, showRefValue } = this;
      return { showTemperature, showGraphNum, showRefValue };
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  watch: {
    activeIndex: {
      handler() {
        this.getlisItemResultInfo();
        this.showItemDesc(this.lisItemResultInfo[0]);
        document.querySelector('.insp-all').scroll({
          top: 0
        });
      }
    },
    // 当异常值置顶设置变化, 重新获取listItem与inspItemCode的值
    abnormal: {
      handler() {
        this.getlisItemResultInfo();
        this.showItemDesc(this.lisItemResultInfo[0]);
      }
    },
    allGraphOption: {
      handler(val) {
        if (this.inspChart) {
          this.option.series.forEach(obj => {
            if (obj.type === 'line') {
              obj.label.show = val.showGraphNum;
            }
          });
          if (val.showRefValue) {
            this.option.series[0].markArea = {
              itemStyle: {
                color: 'rgba(213, 246, 211, 0.5)'
              },
              data: this.getMarkArea(this.insDescItem[0].inspResultRange)
            };
          } else {
            this.option.series[0].markArea = null;
          }
          this.inspChart.setOption(this.option);
        }
      }
    }
  },
  methods: {
    changeToFlag(val) {
      switch (val) {
        case 'z':
          return '';
        case 'h':
          return '⬆';
        case 'l':
          return '⬇';
        case 'ch':
          return '⬆⬆⬆';
        case 'cl':
          return '⬇⬇⬇';
      }
    },
    insName() {
      let name = this.infos.length ? this.infos[this.activeIndex].orderName : '';
      if (name.indexOf('(请缴费') > 0) {
        return name.slice(0, name.indexOf('(请缴费'));
      } else {
        return name;
      }
    },
    getlisItemResultInfo() {
      if (this.abnormal) {
        this.lisItemResultInfo = Array.from(this.infos[this.activeIndex].lisItemResultInfo).sort((a, b) => {
          return (a.inspAbnoFlag === 'z' || a.inspAbnoFlag === '') - (b.inspAbnoFlag === 'z' || a.inspAbnoFlag === '');
        });
      } else {
        this.lisItemResultInfo = this.infos[this.activeIndex].lisItemResultInfo;
      }
      this.inspAllLoading = false;
      this.$nextTick().then(() => {
        if (this.lisItemResultInfo.length) {
          this.$refs.inspTable.setCurrentRow(this.lisItemResultInfo[0]);
        }
      });
    },
    isAbnormall({ row, column, rowIndex, columnIndex }) {
      if (row.inspAbnoFlag !== 'z' && row.inspAbnoFlag !== '' && row.inspAbnoFlag !== '-' && column.type === 'mark') {
        return 'insp-is_abno';
      }
    },

    showItemDesc(row) {
      this.inspOneLoading = true;
      // this.inspItemCode = row.inspItemCode;
      getInsItemDesc({
        hdcPatientId: this.$store.state.hdcId,
        inspOrdInfo: {
          inspItemCode: row.inspItemCode
        }
      }).then(res => {
        this.insDescItem = res.data.sort((a, b) => {
          return Date.parse(b.inspectionDate + ' ' + b.inspectionTime) - Date.parse(a.inspectionDate + ' ' + a.inspectionTime);
        });
        // 必须写在获取数据后的nextTick中,否则第一次加载时会因为找不到.insp-one元素博爱错
        this.$nextTick().then(() => {
          document.querySelector('.insp-one').scroll({
            top: 0
          });
        });
        this.inspOneLoading = false;
      });
    },

    changeDateToString(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + '-' + month + '-' + day;
    },

    getMarkArea(str) {
      // 剔除所有不是汉字, 数字, 大于号, 小于号, 短横杠, 小数点的元素
      let a = str.replace(/[^\u4e00-\u9fa5\d->=<\.]/g, '');

      // 获得名称数组
      let nameArr = a.match(/[\u4e00-\u9fa5]+/g);

      // 获得数值范围数
      let arr = a.split(/[\u4e00-\u9fa5]+/);
      if (nameArr) {
        if (arr[0] === '') {
          arr.shift();
        } else {
          arr.pop();
        }
      }

      // 将数值范围数组,转为二维数组
      return arr.map(str => {
        let ret = [];
        if (/^</.test(str)) {
          ret[0] = { yAxis: 0 };
          ret[1] = { yAxis: +str.replace(/<=?/, '') };
        } else if (/^>/.test(str)) {
          ret[0] = { yAxis: +str.replace(/>=?/, '') };
          ret[1] = { yAxis: +Infinity };
        } else {
          let range = str.split('-');
          ret[0] = { yAxis: +range[0] };
          ret[1] = { yAxis: +range[1] };
        }
        return ret;
      });
    },

    showGraph() {
      this.startDate = this.insDescItem[this.insDescItem.length - 1].inspectionDate;
      this.endDate = this.insDescItem[0].inspectionDate;
      this.defaultDate = [this.startDate, this.endDate];
      this.show = !this.show;
    },
    getEchartsData() {
      return this.insDescItem.map(arr => [new Date(arr.inspectionDate + ' ' + arr.inspectionTime), parseFloat(arr.inspectionValue)]).reverse();
    },
    openInnerDialog(type) {
      this.innerType = type;
      this.multipleSelection = [];
      switch (type) {
        case '检验项':
          getAllInsItem({
            hdcPatientId: this.$store.state.hdcId,
            page: 1
          }).then(res => {
            // 过滤结果为不数值的检验项目和当前检验项
            this.innerDialogData = res.data
              .filter(obj => {
                return /\d/.test(obj.inspectionValue) && obj.inspItemDesc !== this.insDescItem[0].inspItemDesc;
              })
              .map(obj => {
                obj.name = obj.inspItemDesc;
                obj.date = obj.inspectionDate;
                return obj;
              });
            this.innerDialog = true;
          });
        case '用药/治疗':
          getMedical({
            hdcPatientId: this.$store.state.hdcId,
            orderInfo: { ordPriList: ['OMST', 'OM'] }
          }).then(res => {
            this.innerDialogData = res.data.map(obj => {
              return obj;
            });
            this.innerDialog = true;
          });
      }
    },

    querySearch(query, cb) {
      let result;
      if (this.innerType === '检验项') {
        result = this.innerDialogData.filter(obj => {
          return new RegExp(query).test(obj.name);
        });

        if (result.length === 0) {
          result = [{ name: '未查询到' }];
        }
        cb(result);
      } else {
        getMedical({
          hdcPatientId: this.$store.state.hdcId,
          orderInfo: { ordPriList: ['OMST', 'OM'], orderName: query }
        }).then(res => {
          res.data.length ? cb(res.data) : cb([{ orderName: '未查询到名称' }]);
          cb(res.data);
        });
      }
    },
    handleSelect(obj) {
      console.log(1);
      this.$refs.extraTable.toggleRowSelection(obj);
    },

    saveImg(e) {
      let a = this.$refs.graph.inspGraph
        .getDataURL({
          backgroundColor: '#fff'
        })
        .split(',');
      // 获得文件类型
      let type = a[0].slice(5, 14);
      // 将base64数据转为blob
      // 解码base64
      let content = window.atob(a[1]);
      let n = content.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = content.charCodeAt(n);
      }
      let blob = new Blob([u8arr], { type: type });

      // 创建一个下载链接,然后自动激活
      let link = document.createElement('a');
      link.download = this.$store.state.patientInfo.name + this.insDescItem[0].inspItemDesc + '.png';
      let reader = new FileReader();
      // 将 Blob 转换为 base64 并调用 onload
      reader.readAsDataURL(blob);
      reader.onload = function () {
        link.href = reader.result; // data url
        link.click();
      };
      // 让el-button在点击后自动失去焦点
      let target = e.target;
      if (e.target.nodeName === 'SPAN') {
        target = e.target.parentNode;
      }
      target.blur();
    },

    // 在关闭对话框时重置数据
    resetGraphOption(done) {
      this.dispose = true;
      this.dateRange = null;
      this.showGraphNum = true;
      this.showRefValue = true;
      done();
    },

    setDateRange() {
      this.$refs.graph.changeOption({
        range: this.dateRange
      });
    },

    changeActiveIndex(e, val) {
      this.$store.commit('changeActiveIndex', this.$store.state.activeIndex + val);
      // 让el-button在点击后自动失去焦点
      let target = e.target;
      if (e.target.nodeName === 'SPAN') {
        target = e.target.parentNode;
      }
      target.blur();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    deleteSelection(index) {
      if (index) {
        this.$refs.extraTable.toggleRowSelection(this.multipleSelection[index]);
      } else {
        this.$refs.extraTable.clearSelection();
      }
    },
    submitSelection() {
      // 首先关闭内层窗口
      this.innerDialog = false;
      // 然后根据multipleSelection获取数据,并且设置option
      let arr = [];
      if (this.innerType === '检验项') {
        this.multipleSelection.forEach((obj, index) => {
          arr[index] = getInsItemDesc({
            hdcPatientId: this.$store.state.hdcId,
            inspOrdInfo: {
              inspItemCode: obj.inspItemCode
            }
          });
        });
        // 处理返回后的数据传递给组件
        Promise.all(arr).then(resArr => {
          this.echartsLineDatas = [];
          resArr.forEach((res, index) => {
            // 清空原先的数组
            let obj = {};
            obj.name = res.data[0].inspItemDesc;
            obj.data = res.data
              .sort((a, b) => {
                return Date.parse(b.inspectionDate + ' ' + b.inspectionTime) - Date.parse(a.inspectionDate + ' ' + a.inspectionTime);
              })
              .map(arr => [arr.inspectionDate + ' ' + arr.inspectionTime, parseFloat(arr.inspectionValue)]);
            this.echartsLineDatas.push(obj);
          });
        });
      } else {
        this.echartsTimeDatas = [];
        this.multipleSelection.sort((a, b) => {
          return Date.parse(a.orderDate + ' ' + a.orderTime) - Date.parse(b.orderDate + ' ' + b.orderTime);
        });
        this.multipleSelection.forEach((obj, index) => {
          // 如果不存在结束时间,则添加到散列点
          if (obj.ordStopDate === '') {
            this.echartsTimeDatas.push({
              type: 'scatter',
              name: obj.orderName,
              data: obj.orderDate + ' ' + obj.orderTime
            });
          } else {
            this.echartsTimeDatas.push({
              type: 'bar',
              name: obj.orderName,
              data: [obj.orderDate + ' ' + obj.orderTime, obj.ordStopDate + ' ' + obj.ordStopTime]
            });
          }
        });
      }
    }
  },
  mounted() {
    this.$store.commit('setLoading', true);
    let arr = [
      getLis({
        hdcPatientId: this.$store.state.hdcId
      }),
      getInsDesc({
        hdcPatientId: this.$store.state.hdcId
      })
    ];

    Promise.all(arr)
      .then(resArr => {
        let data = resArr[0].data.map((obj, index) => {
          obj.lisItemResultInfo = resArr[1].data[index].lisItemResultInfo;
          // 检验项目中是否有异常值
          obj.inspAbno = obj.lisItemResultInfo.some(obj => obj.inspAbnoFlag !== 'z' && obj.inspAbnoFlag !== '');

          obj.inspSpecmName = resArr[1].data[index].inspSpecmName;
          obj.inspRptDeptDesc = resArr[1].data[index].inspRptDeptDesc;
          return obj;
        });
        this.$store.commit('setInfos', data);

        this.getlisItemResultInfo();
        this.showItemDesc(this.lisItemResultInfo[0]);

        this.$store.commit('setLoading', false);
      })
      .catch(e => {
        this.empty = true;
        console.log(e);
        this.$store.commit('setLoading', false);
      });
  }
};
</script>

<style>
.insp-container {
  height: 100%;
}
.insp-header {
  height: 40px;
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  padding: 10px;
  font-size: 20px;
  color: gray;
  line-height: 40px;
  justify-content: space-between;
}

.insp-header .el-switch__core {
  background-color: gray;
}

.insp-title {
  text-align: center;
  font-size: 20px;
  color: #000;
  font-weight: bold;
}

.insp-placeholder {
  width: 140px;
}

.insp-main {
  display: flex;
  height: 100%;
}
/* 修改表格选中行的样式 */
.insp-main .el-table__body tr.current-row > td.el-table__cell {
  background-color: #5c81ef !important;
  color: #fff;
}

.insp-all {
  width: 650px;
  height: calc(100% - 20px - 60px);
  flex-grow: 3;
  margin: 10px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.insp-is_abno {
  color: red;
}

.insp-one {
  width: 350px;
  margin: 10px;
  /* border: 1px solid gray; */
  height: calc(100% - 20px - 2px - 60px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.insp-one-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.insp-graph-toolbar {
  display: flex;
  justify-content: space-between;
}

.insp-graph-sub_title {
  display: flex;
  height: 20px;
  line-height: 20px;
  justify-content: center;
}
</style>
