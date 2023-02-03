<template>
  <div class="module-content">
    <!-- 搜索框 -->
    <div class="filter-area">
      <input v-model="keyword" type="text" class="filter" placeholder="名称" @keyup.enter="handleFilterEnter" />
      <div class="show-effect-filter">
        <span v-for="(condition, i) in conditions" :key="condition" class="fil-item">
          <span>{{ condition }}</span>
          <i class="fa fa-times-circle" @click="conditions.splice(i, 1)"></i>
        </span>
      </div>
    </div>
    <!-- ----- -->
    <hos-row v-loading="loading">
      <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left"></hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col v-if="!hasData">
            <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
          </hos-col>
          <hos-col v-else v-for="(day, d) in layout.showDays" :key="d" :sm="3" :xs="3" class="">
            <template v-if="lisnorm[d] && lisnorm[d].length > 0">
              <div v-for="(data, j) in lisnorm[d]" :key="'data_' + j">
                <Label :param="data" :setting="setting" :entireClickable="true" @click.native="showChart(data, d)" />
              </div>
            </template>
          </hos-col>
        </hos-row>
        <div class="module-content-line"></div>
      </hos-col>
    </hos-row>

    <hos-dialog :visible.sync="dialogVisible" width="80%" title="检验指标" :before-close="beforeClose">
      <PicWithEcharts :lineData="lineData" :tableData="tableData" :intable="intable" v-loading="chartLoading">
        <template v-slot:toolbar>
          <hos-select
            v-model="selectedLisItems"
            placeholder="选择更多对比项"
            style="width: 300px"
            class="selectedLisItems"
            :multiple-limit="selectedLisMax"
            collapse-tags
            multiple
          >
            <hos-option v-for="opt in lisItems" :key="opt.value" :label="opt.label" :value="opt.value"></hos-option>
          </hos-select>
          <hos-button type="primary" @click="showSelectedLisDetails" style="margin-left: 10px">确定</hos-button>
        </template>
      </PicWithEcharts>
    </hos-dialog>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import PicWithEcharts from '@/components/picWithEcharts/inspectionGraph.vue';
import { getLisNorm, getLisResult } from '@/server/api.js';
import { mapState } from 'vuex';
export default {
  inject: ['layout'],
  components: {
    Label,
    PicWithEcharts
  },
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      lisnorm: [],
      hasData: true,
      rawLisNorm: [],
      keyword: '',
      conditions: [],
      dialogVisible: false,
      chartLoading: false,
      lineData: [],
      tableData: [],
      intable: false,
      selectedLisItems: [],
      lisItems: []
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  watch: {
    encIds() {
      this.lisnorm = [];
      this.fetchData();
    },
    conditions() {
      this.lisnorm = this.filter();
    }
  },
  computed: {
    ...mapState(['encIds', 'globalSetting']),
    selectedLisMax() {
      return this.setting.maxSelectedNum || 10;
    }
  },
  methods: {
    fetchData() {
      let loadingFlags = [];
      let encIds = this.encIds;
      this.rawLisNorm = [];
      this.encIds.forEach((encId, i) => {
        loadingFlags.push(true);
        this.loading = true;
        getLisNorm({ hdcEncId: encId })
          .then(res => {
            /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
            if (encIds != this.encIds) {
              console.log('encIds---abno:', encIds, 'this.encIds', this.encIds);
              return;
            }
            /* ---------------------------------------------------------------------------------------------------------------- */
            loadingDone.bind(this)(i);

            let { data } = res;
            this.$set(this.rawLisNorm, i, data);
            this.lisnorm = this.filter();
            this.hasData = this.lisnorm.some(el => {
              return el.length > 0;
            });
          })
          .catch(err => {
            loadingDone.bind(this)(i);
          });
      });

      function loadingDone(i) {
        loadingFlags[i] = false;
        if (!loadingFlags.includes(true)) this.loading = false;
      }
    },
    /* 展示指标 */
    showChart(single, d) {
      this.dialogVisible = true;
      console.log(single);
      this.selectedLisItems = [];
      // 默认点击的那条不再出现在选择更多指标选项中
      this.lisItems = this.rawLisNorm[d]
        .map(rld => ({
          value: rld.inspItemCode,
          label: rld.inspItemDesc
        }))
        .filter(rld => !(rld.value === single.inspItemCode));

      this.chartLoading = true;
      this.defaultInspItemCode = single.inspItemCode;
      this.getNormDetail([single.inspItemCode]);
    },
    showSelectedLisDetails() {
      if (this.selectedLisItems.length === 0) return;
      let codes = [this.defaultInspItemCode, ...this.selectedLisItems];
      this.getNormDetail(codes);
    },
    getNormDetail(codes) {
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
          // 清空原先的数组
          resArr.forEach(res => {
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
          if (lineData.length) this.lineData = lineData;
          this.tableData = tableData;
        })
        .catch(e => {
          this.chartLoading = false;
          this.lineData = [];
          this.tableData = [];
          throw e;
        });
    },
    beforeClose() {
      this.lineData = [];
      this.tableData = [];
      this.intable = false;

      this.dialogVisible = false;
    },
    /* ------ */
    /* 搜索框 */
    handleFilterEnter() {
      this.conditions.push(this.keyword);
      this.keyword = '';
    },
    filter() {
      let arr = JSON.parse(JSON.stringify(this.rawLisNorm)),
        conditions = this.conditions;
      arr = arr.map(a => {
        return a.filter(item => {
          let flag;
          if (conditions.length) {
            conditions.forEach(c => item.inspItemDesc.indexOf(c) > -1 && (flag = true));
          } else {
            flag = true;
          }
          return flag;
        });
      });
      return arr;
    }
  }
};
</script>
<style lang="scss">
</style>
