<template>
  <div class="module-content">
    <!-- 搜索框 -->
    <div class="filter-area">
      <!-- 检查类型 -->
      <hos-select class="pacs-type-selector" v-model="selectedPacsTypes" multiple collapse-tags style="margin-left: 20px" placeholder="检查类型">
        <hos-option v-for="item in pacsTypes" :key="item.value" :label="item.label" :value="item.value"> </hos-option>
      </hos-select>

      <!-- <input v-model="keyword" type="text" class="filter" placeholder="名称" @keyup.enter="handleFilterEnter" />
      <div class="show-effect-filter">
        <span v-for="(condition, i) in conditions" :key="condition" class="fil-item">
          <span>{{ condition }}</span>
          <i class="fa fa-times-circle" @click="conditions.splice(i, 1)"></i>
        </span>
      </div> -->
    </div>
    <!-- ----- -->
    <hos-row v-loading="loading">
      <hos-col class="layout-left pacs-left" :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }">
        <div class="dept-check pacs-check">
          <hos-checkbox-group v-model="checkDept" size="mini">
            <span v-for="(el, i) in dept" :key="i" class="dept-check-item pacs-check-item">
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
              <Label v-if="item" :param="item" :setting="setting" />
            </div>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
  </div>
</template>

<script>
import { getPacs } from '@/server/api';
// import Label from '@/components/Label/label.vue';
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
      selectedPacsTypes: [],
      pacsTypes: []
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
    },
    selectedPacsTypes: function () {
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
      if (this.allDatas) {
        usedata.call(this, this.allDatas);
      } else {
        this.loading = true;
        getPacs({
          // hdcEncId: this.encIds.join('||'),
          rows: 1000,
          page: 1
        }).then(res => {
          this.loading = false;
          this.allDatas = res;
          this.clsData(res.data);
          usedata.call(this, res);
        }).catch(err => {
          this.loading = false;
        });
      }

      function usedata(res) {
        res = JSON.parse(JSON.stringify(res));
        res.data = res.data.filter(d => this.encIds.includes(d.hdcEncId));

        this.datas = res.data;

        let dpArr = [];
        let checkArr = [];
        res.data.forEach(m => {
          if (m[this.setting.leftKey] === '') m[this.setting.leftKey] = '未分类';
        });
        res.data.forEach(m => {
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
    // 数据按名字分类插入到原始数据
    clsData(datas) {
      let cls = [];
      datas.forEach((d, i) => {
        let ind = this.encIds.indexOf(d.hdcEncId);
        d.visitStartDate = this.encStartDates[ind]; // 添加就诊开始日期
        d.unikey = d.visitStartDate + d.examItemName + i; // 有时间，名称，顺序组成唯一的key值

        let clsNames = cls.map(c => c.name),
          index = clsNames.indexOf(d.examItemName);
        if (index > -1) {
          cls[index].bundle.push(JSON.parse(JSON.stringify(d)));
          d.bundle = cls[index].bundle;
        } else {
          cls.push({
            name: d.examItemName,
            unikey: d.unikey,
            bundle: [JSON.parse(JSON.stringify(d))]
          });
          d.bundle = cls[cls.length - 1].bundle;
        }
      });
      console.log(this.allDatas);
    },
    // 处理数据，返回经过筛选的数据
    handleData(data) {
      if (this.datas.length === 0) return null;
      // 存放被处理的数据
      let arr = [],
        currentArr = [];
      this.encIds.forEach((item, d) => {
        let itemObj = {
          hdcEncId: item,
          items: []
        };
        data.forEach(m => {
          if (item == m.hdcEncId) {
            itemObj.items.push(m);
            let jsonStr = JSON.stringify({ ordSubCatDesc: m.ordSubCatDesc, ordSubCatCode: m.ordSubCatCode });
            if (!currentArr.includes(jsonStr)) currentArr.push(jsonStr);
          }
        });
        arr.push(itemObj);
      });
      this.pacsTypes = currentArr.map(a => ({
        label: JSON.parse(a).ordSubCatDesc.split('-')[1],
        value: JSON.parse(a).ordSubCatCode
      }));
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
      let selectedPacsTypes = this.selectedPacsTypes;
      arr = arr.filter(a => {
        let flag = false;
        if (selectedPacsTypes.length) {
          flag = selectedPacsTypes.includes(a.ordSubCatCode);
        } else {
          flag = true;
        }
        return flag;
      });
      return arr;
    }
    /* ---- */
  }
};
</script>
<style lang="scss">
.pacs-type-selector {
  margin-right: 10px;
  .hos-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .hos-input__icon {
    line-height: 30px;
  }
}
</style>
