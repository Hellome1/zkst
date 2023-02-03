<template>
  <div class="module-crucialIndicator" v-loading="loading">
    <PicWithEcharts ref="charts" style="padding-top: 10px;" :lineData="lineData" :timeData="timeData" :intable="intable" :tableData="tableData">
      <template v-slot:title>{{ tip }}</template>
      <template v-slot:toolbar>
        <hos-date-picker
          v-model="valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </hos-date-picker>
        <hos-checkbox v-model="intable" style="margin-left: 30px">表格显示</hos-checkbox>
      </template>
    </PicWithEcharts>
  </div>
</template>

<script>
import { getMedical, getLisResult } from '@/server/api';
import PicWithEcharts from '@/components/picWithEcharts/inspectionGraph.vue';
export default {
  name: 'crucialIndicator',
  components: { PicWithEcharts },
  data() {
    return {
      loading: false,
      tip: '',
      lineData: [
        // {
        //   name: '人绒毛膜促性腺激素',
        //   data: [
        //     ['2022-03-24 09:27:49', 3.2],
        //     ['2021-08-19 07:41:36', 3],
        //     ['2020-04-14 09:29:47', 2.9],
        //     ['2020-03-14 10:00:21', 3.6]
        //   ]
        // }
      ],
      timeData: [
        // { type: 'bar', name: '金双歧(0.5g*36片)[农]', data: ['2020-03-30 08:17:55', '2020-03-31 18:13:08'] }
      ],
      tableData: [],
      valueDate: '',
      intable: false, // 表格显示
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
    setting: function () {
      return this.$store.state.globalSetting.setting;
    },
    ordPriList: function () {
      let list = this.setting.modules && this.setting.modules.medicalOrder && this.setting.modules.medicalOrder.items;
      let tmp = [];
      list &&
        list
          .filter(l => l.isLong)
          .forEach(l => {
            l.code.forEach(code => {
              tmp.push(code);
            });
          });
      if (tmp.length) list = tmp;
      return list;
    },
    encIds: function () {
      console.log('-----encIds------:', this.$store.state.encIds);
      return this.$store.state.encIds;
    },
    viewMode: function () {
      return this.$store.state.viewMode;
    },
    meds: function () {
      return this.setting.viewModeSetting && this.setting.viewModeSetting[this.viewMode] && this.setting.viewModeSetting[this.viewMode].meds;
    },
    lis: function () {
      return this.setting.viewModeSetting && this.setting.viewModeSetting[this.viewMode] && this.setting.viewModeSetting[this.viewMode].lis;
    }
  },
  watch: {
    encIds: function () {
      this.getData();
      this.initDate();
    },
    setting: function (n, o) {
      if (JSON.stringify(n.viewModeSetting) === JSON.stringify(o.viewModeSetting)) return;
      this.getData(true);
    },
    viewMode: function () {
      this.getData(false, true);
    },
    valueDate: function (v) {
      this.$refs.charts.changeOption({
        range: v
      });
      this.$refs.charts.setTableDateRange(v);
    },
    intable: function (n) {
      if (n) {
        let tableDataName = this.tableData.map(t => t.name);
        let addtions = this.lineData.filter(l => !tableDataName.includes(l.name));
        this.tableData = [...this.tableData, ...addtions];
        this.lineData = [];
      } else {
        this.lineData = this.rawLineData;
        this.tableData = this.rawTableData;
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData(settingChanged, viewModeChanged) {
      if (this.encIds.length === 0) return;
      if (!settingChanged && !viewModeChanged && (this.lineData.length || this.timeData.length || this.tableData.length)) return;
      this.getMedicalData();
      this.getLisData();
      console.log('meds&lis:', this.meds, this.lis);
      if (!this.meds || !this.lis || (this.meds.length === 0 && this.lis.length === 0)) this.tip = '还没有选中任何药品和指标，请在左上角的设置中选择。';
      else this.tip = '';
    },
    initDate() {
      // 初始化日期范围
      let len = this.$store.state.encStartDates.length;
      if (len === 0) {
        this.valueDate = null;
        return;
      }
      let startDateStr = this.$store.state.encStartDates[len - 1];
      let endDateStr = this.$store.state.encEndDates[0] || this.$store.state.encStartDates[0];
      let startDate = new Date(startDateStr.split('-')[0], startDateStr.split('-')[1] - 1, startDateStr.split('-')[2]);
      let endDate = new Date(endDateStr.split('-')[0], endDateStr.split('-')[1] - 1, endDateStr.split('-')[2]);
      this.valueDate = [startDate, endDate];
    },
    getMedicalData() {
      let meds = this.meds || [];
      if (meds.length === 0) {
        // 没有选中药品则不发送请求
        this.timeData = [];
        this.medsDone = true;
        return;
      }
      this.loading = true;
      this.medsDone = false;
      getMedical({
        row: 1000,
        page: 1,
        orderInfo: {
          ordPriList: this.ordPriList
          // orderName: this.meds && this.meds.map(m => m.label).join('||')
        }
      })
        .then(res => {
          this.medsDone = true;
          let { data } = res;
          let dt = data
            .filter(d => d.ordStatusDesc.indexOf('作废') === -1 && meds.map(m => m.value).includes(d.orderCode))
            .map(d => ({
              type: 'bar',
              name: d.orderName,
              data: [d.orderDate + ' ' + d.orderTime, d.ordStopDate + ' ' + d.ordStopTime]
            }));
          this.timeData = dt;
          if (this.lisDone) this.loading = false;
        })
        .catch(e => {
          this.clearData();
        });
    },
    getLisData() {
      let promiArr = [];
      this.lis &&
        this.lis.map(l => {
          this.loading = true;
          this.lisDone = false;
          promiArr.push(
            getLisResult({
              inspOrdInfo: {
                inspItemCode: l.value
              }
            })
          );
        });
      Promise.all(promiArr)
        .then(arr => {
          // console.log('---promi---', arr);
          this.lisDone = true;
          let lineData = [],
            tableData = [];
          arr.forEach((res, index) => {
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
          if (!this.intable) {
            this.lineData = lineData;
            this.tableData = tableData;
            this.rawLineData = lineData;
            this.rawTableData = tableData;
          } else {
            let tableDataName = tableData.map(t => t.name);
            let addtions = lineData.filter(l => !tableDataName.includes(l.name));
            this.tableData = [...tableData, ...addtions];
          }
          if (this.medsDone) this.loading = false;
        })
        .catch(e => {
          this.clearData();
        });
    },
    clearData() {
      if (!this.lisDone) {
        this.lisDone = true;
        this.lineData = [];
        this.tableData = [];
        if (this.medsDone) this.loading = false;
      }
      if (!this.medsDone) {
        this.medsDone = true;
        this.timeData = [];
        if (this.lisDone) this.loading = false;
      }
    }
  }
};
</script>

<style>
</style>