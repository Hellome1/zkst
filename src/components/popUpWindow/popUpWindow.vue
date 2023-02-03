<template>
  <div class="pop_mask" @click.self="handleClose">
    <slot>
      <div class="popCons" ref="popCons">
        <div class="popCons_header">
          <div class="topRightArea">
            <i class="fa fa-close" @click="handleClose"></i>
          </div>
        </div>
        <div class="popCons_body" ref="popCons_body">
          <template v-for="(dt, i) in dts">
            <div ref="popUpWindow" :key="i" class="popUpWindow" :class="'style' + dt.style || 0">
              <div class="pop_header">
                <h3 class="pop_title">{{ dt.title }}</h3>
                <div class="pop_icons" v-if="dt.style === 1">
                  <i class="fa fa-file-o" title="查看原始报告" v-if="dt.popTwo" @click="showOriRpt(dt.popTwo)"></i>
                  <i class="fa fa-file-image-o" title="查看影像" v-if="dt.popTwo && dt.popTwo.needPic" @click="showPic(dt.popTwo)"></i>
                </div>
                <div class="pop_subTitles">
                  <div class="subTitleCon" ref="subCol" v-for="(sub, i) in dt.subTitles" :key="'sub_' + i">
                    <span class="subTitle">{{ sub.title }}</span
                    >:
                    <span class="subVal">{{ sub.val }}</span>
                  </div>
                </div>
                <div class="pop_divideLine"></div>
              </div>
              <div v-if="dt.style == 1" class="pop_main">
                <div class="main_sec" v-for="(m, i) in dt.main" :key="'main_' + i">
                  <span class="main_title">{{ m.title }}</span
                  >:
                  <p class="main_val">&nbsp;&nbsp;&nbsp;&nbsp;{{ m.val }}</p>
                </div>
              </div>
              <div v-else-if="dt.style == 2" class="pop_main">
                <el-table
                  v-loading="loading"
                  :data="tableData"
                  :row-style="setRowStyle"
                  :cell-style="setCellStyle"
                  max-height="500"
                  border
                  style="width: 100%"
                  title="点击某行查看历史数据对比"
                  @row-click="showHistoryDiff"
                >
                  <el-table-column align="center" :show-overflow-tooltip="true" v-for="(k, i) in row" :key="i" :prop="i" :label="k"> </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </slot>

    <!-- 二层弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" ref="dialog" width="80%" :before-close="beforeClose" append-to-body>
      <template v-if="dt.style === 1">
        <el-empty v-if="!src" description="未查询到该报告"></el-empty>
        <iframe v-else-if="showType === 'iframe'" :src="src" frameborder="0" width="100%" height="800"></iframe>
        <img v-else-if="showType === 'pic'" :src="src" :alt="alt" style="width: 100%" />
      </template>
      <template v-else>
        <!-- <div id="doubleShadowChart" style="width: 100%; height: 700px" v-loading="chartLoading"></div> -->
        <PicWithEcharts v-if="dialogVisible" ref="chart" :lineData="lineDataPic" :tableData="tableDataPic" :intable="intable" v-loading="chartLoading">
          <template v-slot:toolbar>
            <el-select
              v-model="selectedLisItems"
              style="width: 300px"
              class="selectedLisItems"
              placeholder="选择更多对比项"
              :multiple-limit="selectedLisMax"
              collapse-tags
              multiple
            >
              <el-option v-for="opt in lisItems" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
            </el-select>
            <el-button type="primary" @click="showMoreDiff" style="margin-left: 10px">确定</el-button>
          </template>
        </PicWithEcharts>
      </template>
    </el-dialog>
    <!-- -------- -->
  </div>
</template>

<script>
import { getLisResult } from '@/server/api';
import PicWithEcharts from '@/components/picWithEcharts/inspectionGraph.vue';
export default {
  props: {
    rawdts: {
      type: Array,
      default: function () {
        return [];
      }
    },
    dt: {
      type: Object,
      default: function () {
        return {
          title: '正在努力加载中...',
          subCol: 2,
          width: '80%',
          style: 1,
          popTwo: true,
          subTitles: [
            {
              title: 'doc',
              val: 'fangfangfangfangfangfangfangfangfangfang'
            },
            {
              title: 'sex',
              val: 'nan'
            },
            {
              title: 'saying',
              val: 'hello'
            }
          ],
          main: [
            {
              title: 'words',
              val: "It's not about what you said,it' about what you did.It's not about what you said,it' about what you did."
            },
            {
              title: 'likes',
              val: 'puppy and foods.'
            }
          ]
        };
      }
    },
    setting: {
      type: Object
    }
  },

  components: { PicWithEcharts },

  data() {
    return {
      vm: null,
      tableData: [],
      row: {},
      loading: true,
      dts: [],
      dialogVisible: false,
      dialogTitle: '',
      showType: 'iframe',
      src: '',
      alt: '',
      chartLoading: true,
      lineDataPic: [],
      tableDataPic: [],
      intable: false,
      selectedLisItems: [],
      lisItems: []
    };
  },

  mounted() {
    this.$refs.subCol.forEach(item => {
      item.style.width = parseFloat(100 / this.dt.subCol) + '%';
    });
    this.$refs.popCons.style.width = this.dt.width;
  },

  created() {
    this.dt.style = this.dt.style ? this.dt.style : 1;
    this.dts = this.rawdts.length === 0 ? [this.dt] : this.rawdts;
    console.log(this.dts);
    this.hasLisNorm();
  },

  watch: {
    lisNorm: function (newVal) {
      this.hasLisNorm();
    },
    title: function (newVal) {
      console.log(newVal);
    },
    dialogVisible: function (n) {
      if (n) {
        this.$nextTick(() => {
          let dialog = this.$refs.dialog.$el.childNodes[0];
          dialog.style.marginTop = '8vh';
        });
      }
    }
  },

  computed: {
    lisNorm: function () {
      return this.dt.lisNorm;
    },
    title: function () {
      return this.dt.title;
    },
    gridAbnormal: function () {
      return this.dt.gridAbnormal;
    },
    abNormalBgc: function () {
      return this.gridAbnormal ? this.gridAbnormal.rowBgColor : '#fff1f0';
    },
    selectedLisMax() {
      return this.dt.maxSelectedNum || 10;
    }
  },

  methods: {
    log(msg) {
      console.log(msg);
    },
    handleClose() {
      this.$emit('close');
    },
    isAbnormal(r) {
      let flags = this.gridAbnormal.flags;
      for (let i = 0; i < flags.length; i++) {
        if (r == flags[i].value) {
          return i + 1;
        }
      }
      return false;
    },
    setRowStyle(rowO) {
      // console.log(rowO);
      let style = '';
      let bgrd = {
        backgroundColor: this.abNormalBgc
      };
      style = this.isAbnormal(rowO.row[this.gridAbnormal.key]) ? bgrd : {};
      style.cursor = 'pointer';
      return style;
    },
    setCellStyle(O) {
      if (O.columnIndex == this.abnIndex) {
        if (this.isAbnormal(O.row[this.gridAbnormal.key])) {
          return this.gridAbnormal.flags[this.isAbnormal(O.row[this.gridAbnormal.key]) - 1].cellStyle;
        }
      }
      if (O.columnIndex === 1) {
        return {
          color: 'rgb(29, 140, 207)'
        };
      }
      return '';
    },
    // 有lisNorm数据
    hasLisNorm() {
      // console.log(newVal);
      if (!this.lisNorm) return;
      if (this.lisNorm.tableData) this.tableData = this.lisNorm.tableData;
      if (this.lisNorm.row) {
        this.row = this.lisNorm.row;
        this.loading = false;
      }
      // 异常字段位置
      if (this.lisNorm.abnIndex) this.abnIndex = this.lisNorm.abnIndex;
    },
    /* 二层弹出逻辑 */
    showOriRpt(popTwo) {
      // console.log(popTwo);
      this.showType = 'iframe';
      this.src = '';
      this.dialogTitle = '原始报告';
      let oriRpt = popTwo.oriRpt,
        data = popTwo.data;
      oriRpt.forEach(or => {
        let key = or.conditionKey.replace(/{|}/g, ''),
          val = data[key],
          conditions = or.conditions;
        if (conditions.filter(c => val.indexOf(c) > -1).length) {
          for (let k in data) {
            let _k = '{' + k + '}',
              _val = data[k];
            or.iframeUrl = or.iframeUrl.replace(_k, _val);
          }
          this.src = or.iframeUrl;
        }
      });
      console.log(this.src);
      this.dialogVisible = true;
    },
    showPic(popTwo) {
      // console.log(popTwo);
      this.showType = 'pic';
      this.src = '';
      this.alt = '';
      let oriRpt = popTwo.oriRpt,
        data = popTwo.data;
      oriRpt.forEach(or => {
        let key = or.conditionKey.replace(/{|}/g, ''),
          val = data[key],
          conditions = or.conditions;
        console.log(key, val);
        if (conditions.filter(c => val.indexOf(c) > -1).length) {
          for (let k in data) {
            let _k = '{' + k + '}',
              _val = data[k];
            or.src = or.src.replace(_k, _val);
          }
          // console.log(or.src);
          if (conditions[0] === '心电') this.showType = 'iframe';
          this.src = decodeURI(or.src);
        }
      });
      console.log(this.src);
      this.dialogVisible = true;
    },
    showHistoryDiff(r) {
      this.dialogVisible = true;
      this.$nextTick(() => {});
      console.log('showHistoryDiff', r);
      // 默认点击的检验项不会出现在选择更多项中
      this.lisItems = this.tableData
        .map(td => ({
          label: td.inspItemDesc,
          value: td.inspItemCode
        }))
        .filter(td => !(td.value === r.inspItemCode));

      this.dialogTitle = '历史数据对比';
      this.defaultInspItemCode = r.inspItemCode;
      this.getNormDetails([r.inspItemCode]);
    },
    showMoreDiff() {
      let codes = [this.defaultInspItemCode, ...this.selectedLisItems];
      this.getNormDetails(codes);
    },
    getNormDetails(codes) {
      this.chartLoading = true;
      let promiArr = [];
      codes.forEach(code => {
        promiArr.push(
          getLisResult({
            inspOrdInfo: {
              inspItemCode: code
            }
          })
        );
      });
      Promise.all(promiArr)
        .then(resArr => {
          this.chartLoading = false;

          let lineData = [],
            tableData = [];
          resArr.forEach(res => {
            // 清空原先的数组
            let obj = {},
              f_obj = {},
              sortedData = null,
              nanArr = [];
            if (res.data.length === 0) return;

            obj.name = f_obj.name = res.data[0].inspItemDesc;
            sortedData = res.data.sort((a, b) => {
              return (
                Date.parse(b.inspectionDate.replace(/-/g, '/') + ' ' + b.inspectionTime.replace(/-/g, '/')) -
                Date.parse(a.inspectionDate.replace(/-/g, '/') + ' ' + a.inspectionTime.replace(/-/g, '/'))
              );
            });

            f_obj.data = sortedData.map(arr => [arr.inspectionDate + ' ' + arr.inspectionTime, arr.inspectionValue]);
            obj.data = sortedData
              .filter(d => !isNaN(parseFloat(d.inspectionValue)))
              .map(arr => [arr.inspectionDate + ' ' + arr.inspectionTime, parseFloat(arr.inspectionValue)]);
            nanArr = res.data.filter(d => isNaN(parseFloat(d.inspectionValue)));
            if (nanArr.length > 0) {
              tableData.push(f_obj);
            }

            if (obj.data.length) lineData.push(obj);
          });
          if (lineData.length === 0 && tableData.length) {
            this.intable = true;
          } else {
            this.intable = false;
          }
          console.log('lt:', lineData, tableData);
          if (lineData.length) this.lineDataPic = lineData;
          this.tableDataPic = tableData;
        })
        .catch(e => {
          this.chartLoading = false;
          throw e;
        });
    },
    beforeClose() {
      this.lineDataPic = [];
      this.tableDataPic = [];
      this.intable = false;

      this.dialogVisible = false;
    }
    /* ---------- */
  }
};
</script>

<style lang="scss" scoped>
.pop_mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2002;
  .popCons {
    background-color: white;
    width: 80%;
    height: 90%;
    max-height: 90%;
    padding: 10px 0;
    position: relative;
    // overflow: auto;

    .popCons_header {
      .topRightArea {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 1;
        i {
          margin-left: 8px;
        }
        i.fa {
          cursor: pointer;
        }
      }
    }
  }
  .popCons_body {
    max-height: 100%;
    overflow: auto;

    .popUpWindow {
      background-color: white;
      width: 100%;
      border-radius: 5px;
      box-sizing: border-box;
      padding-bottom: 10px;
      .pop_header {
        h3.pop_title {
          text-align: center;
        }
        .pop_subTitles {
          display: flex;
          flex-wrap: wrap;
          margin: 10px 20px;
          .subTitleCon {
            box-sizing: border-box;
            width: 50%;
            padding: 8px 5px;
            word-break: break-all;
          }
        }
        .pop_divideLine {
          width: 100%;
          height: 1px;
          background-color: #aaa;
        }
      }
      .pop_main {
        margin: 20px 20px;
        .main_sec {
          margin: 8px 0;
          .main_title {
            font-size: 16px;
            font-weight: bold;
          }
          .main_val {
            padding: 2px 5px;
            font-size: 14px;
          }
        }
      }
    }
    .popUpWindow.style1 {
      display: flex;
      width: 100%;
      border-bottom: 1px solid #aaa;
      padding-bottom: 0;
      position: relative;
      .topRightArea {
        i {
        }
        i.fa {
        }
      }
      .pop_header {
        width: 25%;
        font-size: 14px;
        padding-right: 20px;
        position: relative;
        h3.pop_title {
          margin: 10px 0;
        }
        .pop_icons {
          position: absolute;
          right: 0px;
          top: 15px;
          font-size: 20px;
          display: flex;
          flex-direction: column;

          .fa {
            margin-bottom: 5px;
            cursor: pointer;
            color: #307cc8;
            &:hover {
              color: #409eff;
            }
          }
        }
        .pop_subTitles {
          .subTitleCon {
            width: 100%;
            padding: 1px 5px;
          }
        }
        .pop_divideLine {
          display: none;
        }
      }
      .pop_main {
        width: 75%;
        margin: 10px 20px;
        display: flex;
        position: relative;
        .main_sec {
          margin: 0;
          width: 33%;
          .main_title {
          }
          .main_val {
          }
        }
        .main_sec:nth-of-type(1) {
          width: 66%;
        }
      }
    }
  }
}
</style>
