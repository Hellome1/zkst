<template>
  <div class="module-content">
    <!-- 搜索框 -->
    <!-- <div class="filter-area">
      <input v-model="keyword" type="text" class="filter" placeholder="名称" @keyup.enter="handleFilterEnter" />
      <div class="show-effect-filter">
        <span v-for="(condition, i) in conditions" :key="condition" class="fil-item">
          <span>{{ condition }}</span>
          <i class="fa fa-times-circle" @click="conditions.splice(i, 1)"></i>
        </span>
      </div>
    </div> -->
    <!-- ----- -->
    <hos-row v-loading="loading">
      <hos-col class="layout-left consul-left" :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }">
        <div class="dept-check consul-check">
          <hos-checkbox-group v-model="checkDept" size="mini">
            <span v-for="(el, i) in dept" :key="i" class="dept-check-item consul-check-item">
              <hos-checkbox-button :label="el.code">{{ el.desc }}</hos-checkbox-button>
            </span>
          </hos-checkbox-group>
        </div>
      </hos-col>
      <hos-col class="layout-right" :span="layout.rightW">
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
            <div v-for="(item, d) in obj.items" :key="setting.rightKey ? item[setting.rightKey] + d : '_data' + d">
              <Label v-if="item" :param="item" :setting="setting" :entireClickable="true" @click.native="showRecord(item)" />
            </div>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>

    <hos-dialog :visible.sync="dialogVisible" title="会诊记录" width="80%" custom-class="consul-dialog">
      <div class="consul-record-container" v-if="currentRecord">
        <div class="consul-record-row">
          <div class="consul-record-header">会诊类型及科室</div>
          <div class="consul-record-content">{{ currentRecord.ecCategory + ' ' + currentRecord.ecrLocDesc }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">会诊申请人及申请时间</div>
          <div class="consul-record-content">{{ currentRecord.ecrUserDesc + ' ' + currentRecord.ecrDate + ' ' + currentRecord.ecrTime }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">会诊日期及时间</div>
          <div class="consul-record-content">{{ currentRecord.ecnDate + ' ' + currentRecord.ecnTime }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">会诊理由和目的</div>
          <div class="consul-record-content">{{ currentRecord.ecPurpose || '无' }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">病情及诊疗经过</div>
          <div class="consul-record-content">{{ currentRecord.ectrePro || '无' }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">会诊意见</div>
          <div class="consul-record-content">{{ currentRecord.ecOpinion.join('；') || '无' }}</div>
        </div>
        <div class="consul-record-row">
          <div class="consul-record-header">会诊地点</div>
          <div class="consul-record-content">{{ currentRecord.ecnPlace || '无' }}</div>
        </div>
      </div>
    </hos-dialog>
  </div>
</template>

<script>
import { getConsul } from '@/server/api';
import Label from '@/components/Label/labelData.vue';
export default {
  name: 'pacs',
  components: {
    Label
  },
  inject: ['layout'],
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      checkDept: [],
      dept: [],
      datas: [], // 符合就诊的数据
      filDatas: [], // 显示的数据
      keyword: '',
      conditions: [],
      dialogVisible: false,
      currentRecord: null
    };
  },
  watch: {
    encIds: function (n) {
      this.datas = [];
      this.filDatas = null;
      this.dept = [];
      if (n.length === 0) {
        return;
      }
      this.fetchData();
    },
    checkDept: function () {
      this.filter();
    },
    conditions: function (n) {
      this.filter();
    }
  },

  mounted() {},

  created() {
    if (this.encIds.length) this.fetchData();
  },

  computed: {
    encIds: function () {
      return this.$store.state.encIds;
    },
    encStartDates: function () {
      return this.$store.state.encStartDates;
    }
  },

  methods: {
    fetchData() {
      this.loading = true;
      let loadingArr = [],
        resArr = [],
        encIds = this.encIds;
      encIds.forEach((encId, index) => {
        loadingArr.push(true);
        getConsul({
          hdcEncId: encId,
          rows: 1000,
          page: 1
        })
          .then(res => {
            /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
            if (encIds != this.encIds) {
              console.log('encIds---abno:', encIds, 'this.encIds', this.encIds);
              return;
            }
            /* ---------------------------------------------------------------------------------------------------------------- */
            loadingArr[index] = false;
            let { data = [] } = res;
            data.forEach(d => (d.encId = encId));
            resArr.push(...data);
            if (loadingArr.every(lA => lA === false)) usedata.call(this, resArr);
          })
          .catch(e => {
            loadingArr[index] = false;
            if (loadingArr.every(lA => lA === false)) usedata.call(this, resArr);
            throw e;
          });
      });

      function usedata(dataArr) {
        this.loading = false;

        this.datas = dataArr;

        let dpArr = [];
        let checkArr = [];
        dataArr.forEach(m => {
          m.ecrLocDesc = m.ecrLocDesc.split('-')[1];
          m.consulDesc = m.ecrUserDesc + ' ' + m.ecrDate + ' ' + m.ecrTime + ' ' + m.ecPurpose;
          if (m[this.setting.leftKey] === '') m[this.setting.leftKey] = '未分类';
        });
        dataArr.forEach(m => {
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
      }
    },
    // 处理数据，返回经过筛选的数据
    handleData(data) {
      if (this.datas.length === 0) return null;
      // 存放被处理的数据
      let arr = [];
      this.encIds.forEach((item, d) => {
        let itemObj = {
          hdcEncId: item,
          items: []
        };
        data.forEach(m => {
          if (item == m.encId) {
            itemObj.items.push(m);
          }
        });
        arr.push(itemObj);
      });
      // console.log(arr, 'arr');
      return arr;
    },
    log(msg) {
      console.log(msg, 'formLog');
    },
    // 过滤
    filter() {
      let filArr = [];
      for (let i = 0; i < this.checkDept.length; i++) {
        this.datas.forEach(item => {
          if (this.checkDept[i] == item[this.setting.leftKey]) filArr.push(item);
        });
      }
      filArr = this.conditionData(filArr);
      this.filDatas = this.handleData(filArr);
    },
    /* 搜索框 */
    /* 过滤框按下enter */
    handleFilterEnter() {
      this.conditions.push(this.keyword);
      this.keyword = '';
    },
    /* 过滤逻辑 */
    conditionData(arr) {
      let conditions = this.conditions;
      arr = arr.filter(a => {
        let flag = false;
        if (conditions.length) {
          conditions.forEach(c => a.examItemName.includes(c) && (flag = true));
        } else {
          flag = true;
        }
        return flag;
      });
      return arr;
    },
    /* ---- */
    /* 显示会诊记录 */
    showRecord(item) {
      this.dialogVisible = true;
      this.currentRecord = item;
    }
  }
};
</script>
<style lang="scss" >
.consul-dialog {
  .hos-dialog__body {
    padding: 15px 20px;
  }
}
.consul-record-container {
  .consul-record-row {
    text-align: initial;
    .consul-record-header {
      font-size: 16px;
      font-weight: bold;
      padding: 0 15px;
      border: 1px solid #ddd;
      background-color: #eee;
    }
    .consul-record-content {
      border: 1px solid #eee;
      padding: 5px 10px;
    }
  }
}
</style>
