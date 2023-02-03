<template>
  <div class="cardBody">
    <div class="cardBody_crucialIndicator" v-if="ori.name === 'crucialIndicator'">
      <hos-tabs v-model="activeName">
        <hos-tab-pane label="普通" name="normal"> </hos-tab-pane>
        <hos-tab-pane label="糖尿病" name="su"></hos-tab-pane>
        <hos-tab-pane label="血液" name="blood"></hos-tab-pane>
      </hos-tabs>

      <!-- 选中的药品 -->
      <hos-divider><h3 style="margin: 0">已选药品</h3></hos-divider>
      <h3 v-if="tagsMeds.length === 0">还没有选中任何药品哦～</h3>
      <div class="selectedTagCont" v-else>
        <hos-tag v-for="(tag, ind) in tagsMeds" :key="tag.name" closable @close="deleteSelectedMeds(ind)" :type="tag.type">
          {{ tag.name }}
        </hos-tag>
      </div>
      <!-- 选中的指标 -->
      <hos-divider><h3 style="margin: 0">已选指标</h3></hos-divider>
      <h3 v-if="tagsLis.length === 0">还没有选中任何指标哦～</h3>
      <div class="selectedTagCont" v-else>
        <hos-tag v-for="(tag, ind) in tagsLis" :key="tag.name" closable @close="deleteSelectedLis(ind)" :type="tag.type">
          {{ tag.name }}
        </hos-tag>
      </div>
      <!-- 选择药品和指标 -->
      <hos-divider
        ><h3 style="margin: 0">
          选择更多<span style="font-size: 14px">（最多{{ root.ori.maxSelectedNum }}条）</span>
        </h3>
      </hos-divider>
      <label for="" style="padding-left: 5px">药品（长期）</label>
      <hos-select
        v-model="valueMeds"
        class="elSelect"
        popper-class="ulWidthNoLimit"
        multiple
        filterable
        collapse-tags
        :multiple-limit="root.ori.maxSelectedNum - valueLis.length"
        placeholder="选择或搜索"
      >
        <hos-option v-for="item in optionsMeds" :key="item.value" :label="item.label" :value="item.value"> </hos-option>
      </hos-select>
      <label for="" style="padding-left: 5px">检验项</label>
      <hos-select
        v-model="valueLis"
        class="elSelect"
        popper-class="ulWidthNoLimit"
        multiple
        filterable
        collapse-tags
        :multiple-limit="root.ori.maxSelectedNum - valueMeds.length"
        placeholder="选择或搜索"
      >
        <hos-option v-for="item in optionsLis" :key="item.value" :label="item.label" :value="item.value"> </hos-option>
      </hos-select>
    </div>
    <div v-else>
      {{ root.label + '设置开发中...' }}
    </div>
  </div>
</template>

<script>
import { getMedical, getInsItemDesc } from '@/server/api';
export default {
  name: 'cardBody',
  props: {
    root: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      activeName: 'normal',
      optionsMeds: [],
      valueMeds: [],
      optionsLis: [],
      valueLis: [],
      notMounted: true
    };
  },
  watch: {
    valueLis: function (v) {
      if (this.notMounted) return;
      let viewModeSetting = this.getFromLocalSetting('viewModeSetting') || JSON.parse(JSON.stringify(setting.viewModeSetting));
      let o = viewModeSetting[this.activeName];
      o.lis = this.optionsLis.filter(op => v.includes(op.value));
      o.meds = this.optionsMeds.filter(op => this.valueMeds.includes(op.value));
      this.$emit('setTask', 'viewModeSetting', viewModeSetting);
    },
    valueMeds: function (v) {
      if (this.notMounted) return;
      let viewModeSetting = this.getFromLocalSetting('viewModeSetting') || JSON.parse(JSON.stringify(setting.viewModeSetting));
      let o = viewModeSetting[this.activeName];
      o.lis = this.optionsLis.filter(op => this.valueLis.includes(op.value));
      o.meds = this.optionsMeds.filter(op => v.includes(op.value));
      this.$emit('setTask', 'viewModeSetting', viewModeSetting);
    },
    activeName: function () {
      this.getSetting();
    }
  },
  computed: {
    ori: function () {
      return this.root.ori;
    },
    tagsMeds: function () {
      return this.optionsMeds.length === 0
        ? []
        : this.valueMeds.map(v => {
            return {
              name: this.optionsMeds.filter(op => op.value === v)[0].label,
              type: 'danger'
            };
          });
    },
    tagsLis: function () {
      return this.optionsLis.length === 0
        ? []
        : this.valueLis.map(v => {
            return {
              name: this.optionsLis.filter(op => op.value === v)[0].label,
              type: 'danger'
            };
          });
    },
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
    }
  },
  created() {
    if (this.ori.name === 'crucialIndicator') {
      this.getSetting();
      console.log(JSON.parse(JSON.stringify(this.root)));
      this.getData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.notMounted = false;
    });
  },
  methods: {
    getSetting() {
      if (this.ori.name === 'crucialIndicator') {
        // console.log('cardBody-setting', this.setting);
        this.valueLis = this.setting && this.setting.viewModeSetting[this.activeName].lis.map(l => l.value);
        if (this.valueLis && this.valueLis.filter(v => !this.optionsLis.map(o => o.value).includes(v)).length) {
          let arr = this.setting && JSON.parse(JSON.stringify(this.setting.viewModeSetting[this.activeName].lis));
          let unique = arr.filter(r => !this.optionsLis.map(o => o.value).includes(r.value));
          this.optionsLis = [...unique, ...this.optionsLis];
        }
        this.valueMeds = this.setting && this.setting.viewModeSetting[this.activeName].meds.map(m => m.value);
        if (this.valueMeds && this.valueMeds.filter(v => !this.optionsMeds.map(o => o.value).includes(v)).length) {
          let arr = this.setting && JSON.parse(JSON.stringify(this.setting.viewModeSetting[this.activeName].meds));
          let unique = arr.filter(r => !this.optionsMeds.map(o => o.value).includes(r.value));
          this.optionsMeds = [...unique, ...this.optionsMeds];
        }
      }
    },
    getData() {
      getMedical({
        row: 1000,
        page: 1,
        orderInfo: {
          ordPriList: this.ordPriList
        }
      }).then(res => {
        let { data } = res;
        let dt = data
          .filter(d => d.ordStatusDesc.indexOf('作废') === -1)
          .map(d => ({
            value: d.orderCode,
            label: d.orderName
          }));
        let unique = JSON.parse(JSON.stringify(this.setting.viewModeSetting[this.activeName].meds));
        dt.forEach(d => {
          let pushFlag = true;
          for (let i = 0; i < unique.length; i++) {
            if (d.value === unique[i].value) {
              pushFlag = false;
              return;
            }
          }
          if (pushFlag) unique.push(d);
        });
        this.optionsMeds = unique;
      });

      getInsItemDesc({ rows: 1000, page: 1 }).then(res => {
        let arr = JSON.parse(JSON.stringify(this.setting.viewModeSetting[this.activeName].lis)),
          netOption = res.data.map(d => ({ label: d.inspItemDesc, value: d.inspItemCode }));
        netOption.forEach(n => {
          let pushFlag = true;
          for (let i = 0; i < arr.length; i++) {
            if (n.value === arr[i].value) {
              pushFlag = false;
              return;
            }
          }
          if (pushFlag) arr.push(n);
        });
        this.optionsLis = arr;
      });
    },
    deleteSelectedMeds(ind) {
      this.valueMeds.splice(ind, 1);
    },
    deleteSelectedLis(ind) {
      this.valueLis.splice(ind, 1);
    },
    reset() {
      this.valueMeds = [];
      this.valueLis = [];
    }
  }
};
</script>

<style lang="scss">
.cardBody_crucialIndicator {
  .selectedTagCont {
    max-height: 200px;
    overflow: auto;
  }
  .elSelect {
    width: 100%;
    .hos-select__tags-text {
      display: inline-block; // inline-block 和 hidden 会让旁边字符下沉
      overflow: hidden;
      vertical-align: bottom; // vertical-align: bottom 可以解决这个问题
      max-width: 500px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>