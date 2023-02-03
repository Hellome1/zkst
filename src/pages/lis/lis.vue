<template>
  <div class="module-content">
    <!-- 搜索框 -->
    <div class="filter-area">
      <hos-button v-if="setting.markAbno" type="primary" size="mini" @click="abnoTop = !abnoTop">{{ abnoTop ? '正常排序' : '异常置顶' }}</hos-button>
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
      <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left">
        <div class="dept-check pacs-check">
          <hos-checkbox-group v-model="checkDept" size="mini">
            <span v-for="(el, i) in dept" :key="i" class="dept-check-item pacs-check-item">
              <hos-checkbox-button :label="el.code">{{ el.desc }}</hos-checkbox-button>
            </span>
          </hos-checkbox-group>
        </div>
      </hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col v-if="filDatas === null">
            <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
          </hos-col>
          <hos-col
            v-else
            v-for="(obj, i) in filDatas"
            :key="obj.hdcEncId + i"
            :sm="3"
            :xs="3"
            :class="filDatas.length < 7 ? (i == filDatas.length - 1 ? 'elCol last' : '') : ''"
          >
            <div v-for="(item, d) in obj.items" :key="setting.rightKey ? item[setting.rightKey] + d : '_data' + d" @click="log(item)">
              <Label v-if="item" :param="item" :setting="setting" />
            </div>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import { getLis, getLisNorm } from '@/server/api';
import { handleLisN } from '@/utils/cookie_c';
import dayjs from 'dayjs';
export default {
  inject: ['layout'],
  components: {
    Label
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
      datas: [], // 原始数据
      dept: [], // 部门
      checkDept: [], // 选中的部门
      filDatas: [], // 经过“筛选”和“整理”的数据
      keyword: '',
      conditions: [],
      abnoTop: false
    };
  },
  watch: {
    encIds: function (n) {
      if (n.length === 0) {
        this.clearData();
        return;
      }
      this.fetchData();
    },
    checkDept: function () {
      // 过滤
      let filArr = [];
      for (let i = 0; i < this.checkDept.length; i++) {
        this.datas.forEach(item => {
          if (this.checkDept[i] == item[this.setting.leftKey]) filArr.push(item);
        });
      }
      this.filDatas = this.handleData(filArr, this.setting.labelConfig);
    },
    conditions: function () {
      // 过滤
      let filArr = [];
      for (let i = 0; i < this.checkDept.length; i++) {
        this.datas.forEach(item => {
          if (this.checkDept[i] == item[this.setting.leftKey]) filArr.push(item);
        });
      }
      this.filDatas = this.handleData(filArr, this.setting.labelConfig);
    },
    abnoTop: function () {
      let datas = JSON.parse(JSON.stringify(this.datas));
      this.sortData(datas);
      this.setDept(this.datas);
    }
  },

  mounted() {},

  created() {
    if (this.encIds.length) this.fetchData();
  },

  computed: {
    encIds: function () {
      return this.$store.state.encIds;
    }
  },

  methods: {
    log(msg) {
      console.log(JSON.parse(JSON.stringify(msg)));
    },
    fetchData() {
      this.loading = true;
      let encIds = this.encIds;
      getLis({
        action: this.setting.action,
        hdcEncId: encIds.join('||'),
        rows: 1000,
        page: 1
      }).then(res => {
        /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
        if (encIds != this.encIds) {
          console.log('encIds---abno:', encIds, 'this.encIds', this.encIds);
          return;
        }
        /* ---------------------------------------------------------------------------------------------------------------- */
        this.loading = false;
        if (res.data.length === 0) {
          this.filDatas = null;
          this.dept = [];
          return;
        }
        this.datas = res.data;
        this.mergeLisDetail();

        this.setDept(res.data);
      });
    },
    // 设置分类框
    setDept(data) {
      let dpArr = [];
      let checkArr = [];
      data.forEach(m => {
        if (m[this.setting.leftKey] === '') m[this.setting.leftKey] = '未分类';
      });
      data.forEach(m => {
        let deptFlag = true;
        for (let i = 0; i < dpArr.length; i++) {
          if (dpArr[i].desc == m[this.setting.leftKey]) deptFlag = false;
        }
        if (deptFlag) {
          dpArr.push({
            desc: m[this.setting.leftKey],
            code: m[this.setting.leftKey]
          });
          checkArr.push(m[this.setting.leftKey]);
        }
      });
      this.dept = dpArr;
      this.checkDept = checkArr;
    },
    // 处理数据，返回经过筛选的数据
    handleData(data, opt = {}) {
      // 存放被处理的数据
      let arr = [];

      if (this.conditions.length) {
        data = data.filter(d => {
          let flag;
          this.conditions.forEach(c => d.orderName.indexOf(c) > -1 && (flag = true));
          return flag;
        });
      }

      this.encIds.forEach(item => {
        let itemObj = {
          hdcEncId: item,
          items: []
        };
        data.forEach(m => {
          if (item == m.hdcEncId) {
            itemObj.items.push(m);
          }
        });
        arr.push(itemObj);
      });
      // console.log(arr, 'arr');
      return arr;
    },
    // 合并检验数据
    mergeLisDetail() {
      if (!this.setting.markAbno) return;
      let datas = JSON.parse(JSON.stringify(this.datas));

      let done = [];
      let hdcIdk = this.setting.lisNormId || 'hdcInspRptId';
      let normal = this.setting.gridAbnormal.replaces.filter(rep => !rep.split('|')[1]).map(rep => rep.split('|')[0]);
      console.log('normal:----', normal);
      console.log(datas);
      let hdcIds = datas.filter(d => d[hdcIdk]).map(d => d[hdcIdk]);
      console.log(hdcIds);
      datas
        .filter(d => d[hdcIdk])
        .forEach((data, i) => {
          let hdcId = data[hdcIdk];
          done.push(false);
        });
      // getLisNorm({
      //   rows: 50,
      //   page: 1,
      //   action: this.setting.labelConfig.action || '',
      //   inspOrdInfo: {
      //     hdcInspRptId: '00001_20210709G0070464||00001_20210709G1102115'
      //   }
      // });
      getLisNorm({
        rows: 50,
        page: 1,
        action: this.setting.labelConfig.action || '',
        inspOrdInfo: {
          hdcInspRptId: hdcIds.join('||')
        }
      })
        .then(res => {
          datas.forEach(data => {
            let method = this.setting.labelConfig.handleLisN.bind(this) || handleLisN.bind(this);
            let rd = res.data.filter(d => data[hdcIdk].split('||').includes(d[hdcIdk]));
            let lisDetails = method(rd),
              inspes = lisDetails.tableData;
            data.lisDetails = lisDetails;
            data.ownAbnoItem = inspes.filter(d => d[this.setting.gridAbnormal.key]).length > 0;
          });
          // let method = this.setting.labelConfig.handleLisN.bind(this) || handleLisN.bind(this),
          //   lisDetails = method(res.data),
          //   inspes = lisDetails.tableData;
          // data.lisDetails = lisDetails;
          // data.ownAbnoItem = inspes.filter(d => d[this.setting.gridAbnormal.key]).length > 0;

          // done[i] = true;
          // if (!done.includes(false)) {
          //   }
          this.sortData(datas);
          this.setDept(datas);
        })
        .catch(e => {
          // console.log('reject', e);
          // done[i] = true;
          // if (!done.includes(false)) {
          //   }
          this.datas = datas;
          this.setDept(datas);
        });
    },
    clearData() {
      this.datas = [];
      this.filDatas = null;
      this.dept = [];
    },
    /* 搜索框 */
    handleFilterEnter() {
      this.conditions.push(this.keyword);
      this.keyword = '';
    },
    /* 排序方法 */
    sortData(datas) {
      if (this.abnoTop) {
        this.datas = datas.sort((a, b) => {
          let anum = 0,
            bnum = 0;
          if (a.ownAbnoItem) anum = -1;
          if (b.ownAbnoItem) bnum = -1;
          return anum - bnum;
        });
      } else {
        this.datas = datas.sort((a, b) => {
          return dayjs(a.inspRptVerifyDate + ' ' + a.inspRptVerifyTime).diff(b.inspRptVerifyDate + ' ' + b.inspRptVerifyTime);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
