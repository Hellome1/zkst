<template>
  <div class="module-content">
    <div class="filter-area">
      <!-- 药品类型 -->
      <hos-select class="meds-type-selector" v-model="selectedMedTypes" multiple collapse-tags style="margin-left: 20px" placeholder="药品类型">
        <hos-option v-for="item in medTypes" :key="item.value" :label="item.label" :value="item.value"> </hos-option>
      </hos-select>
      <!-- 药品名称 -->
      <input v-model="keyword" type="text" class="filter" placeholder="名称" @keyup.enter="handleFilterEnter" />
      <div class="show-effect-filter">
        <span v-for="(condition, i) in conditions" :key="condition" class="fil-item">
          <span>{{ condition }}</span>
          <i class="fa fa-times-circle" @click="conditions.splice(i, 1)"></i>
        </span>
      </div>
    </div>
    <template v-if="setting.vagueItems">
      <hos-row v-if="!hasMedical" v-loading="loading">
        <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left medical-left"></hos-col>
        <hos-col :span="layout.rightW" class="layout-right">
          <hos-row class="module-content-list">
            <hos-col>
              <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
            </hos-col>
          </hos-row>
        </hos-col>
      </hos-row>
      <hos-row v-else v-for="(item, i) in medical" :class="medical['o_' + i] && medical['o_' + i].datas.length > 0 ? '' : 'nullData'" :key="i">
        <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left medical-left">
          <h3>{{ item.desc }}</h3>
        </hos-col>
        <hos-col :span="layout.rightW" class="layout-right">
          <hos-row class="module-content-list">
            <hos-col v-for="(day, d) in layout.showDays" :key="d" :sm="3" :xs="3" class="">
              <div v-for="(data, j) in item.eles" :key="'data_' + j">
                <span v-if="data.hdcEncId == encIds[d]">
                  <Label :param="data" :setting="setting" />
                </span>
              </div>
            </hos-col>
          </hos-row>
          <div v-if="item.display == 'line'" class="module-content-line"></div>
        </hos-col>
      </hos-row>
    </template>
    <template v-else>
      <hos-row v-if="!hasMedical" v-loading="loading">
        <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left medical-left"></hos-col>
        <hos-col :span="layout.rightW" class="layout-right">
          <hos-row class="module-content-list">
            <hos-col>
              <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
            </hos-col>
          </hos-row>
        </hos-col>
      </hos-row>
      <hos-row v-else v-for="(item, i) in setting.items" :class="medical['o_' + i] && medical['o_' + i].datas.length > 0 ? '' : 'nullData'" :key="i">
        <hos-col
          v-if="medical['o_' + i] && medical['o_' + i].datas.length > 0"
          :span="layout.leftW"
          :style="{ backgroundColor: layout.leftBgColor }"
          class="layout-left medical-left"
        >
          <h3>{{ item.desc }}</h3>
        </hos-col>
        <hos-col v-if="medical['o_' + i] && medical['o_' + i].datas.length > 0" :span="layout.rightW" class="layout-right">
          <hos-row v-if="item.display == 'list'" class="module-content-list">
            <hos-col
              v-for="(day, d) in layout.showDays"
              :key="d"
              :sm="3"
              :xs="3"
              :class="item.isLong ? isLongClickable(medical['o_' + i], d) : ''"
              @click.native="item.isLong ? showLong(medical['o_' + i], d) : null"
            >
              <div v-for="(data, j) in medical['o_' + i].datas" :key="'data_' + j">
                <span v-if="data.hdcEncId == encIds[d]">
                  <Label :param="data" :setting="setting" :entireClickable="item.isLong && isLongClickable(medical['o_' + i], d) != '' ? true : false" />
                </span>
              </div>
            </hos-col>
          </hos-row>
          <div v-if="item.display == 'line'" class="module-content-line"></div>
        </hos-col>
      </hos-row>
    </template>

    <hos-dialog title="长期用药时间轨迹" :visible.sync="dialogVisible" ref="medicalLineDialog" width="80%">
      <p v-for="(med, ind) in selectedLongMeds" :key="med.key + ind" class="medicalLineP">
        <TDline :DT="med" :span="dateSpan" :width="canvasWidth" />
      </p>
      <Axis v-if="axis" :axisInfo="axis" :visible="dialogVisible" />
    </hos-dialog>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import TDline from '@/components/TDline/TDline.vue';
import Axis from './axiss.vue';
import { getMedical } from '@/server/api.js';
import { mapState } from 'vuex';
import dayjs from 'dayjs';
export default {
  inject: ['layout'],
  components: { Label, TDline, Axis },
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      medical: {},
      hasMedical: true,
      dialogVisible: false,
      selectedLongMeds: [],
      dateSpan: 1,
      canvasWidth: 1000,
      axis: null,
      medTypes: [],
      selectedMedTypes: [],
      keyword: '',
      conditions: []
    };
  },
  created() {},
  mounted() {
    this.fetData();
  },
  watch: {
    encIds() {
      this.fetData();
    },
    conditions() {
      this.setData();
    },
    selectedMedTypes() {
      this.setData();
    }
  },
  computed: {
    ...mapState(['encIds', 'encStartDates'])
  },
  methods: {
    log(msg) {
      console.log(msg);
    },
    fetData() {
      if (this.encIds.length === 0) return;
      this.loading = true;
      let encIds = this.encIds;
      getMedical({ hdcEncId: this.encIds.join('||') })
        .then(res => {
          /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
          if (encIds != this.encIds) {
            console.log('encIds---abno:', encIds, 'this.encIds', this.encIds);
            return;
          }
          /* ---------------------------------------------------------------------------------------------------------------- */
          this.loading = false;
          let { data = [] } = res;
          this.rawData = data;
          this.hasMedical = data.length > 0;
          this.addFrequency();
          this.fetchMedTypes();
          this.setData();
        })
        .catch(e => {
          this.hasMedical = false;
          this.loading = false;
        });
    },
    // 给药品名增加频次
    addFrequency() {
      let data = this.rawData;
      data.forEach(d => {
        d.orderName = d.orderName + ' ' + d.medFreqDesc;
      });
    },
    // 获取药品类型
    fetchMedTypes() {
      // 根据药品code对数据唯一化
      let splitstr = '_spebyczy_';
      let codes_set = new Set(this.rawData.map(rd => rd.ordSubCatCode + splitstr + rd.ordSubCatDesc));
      let codes = Array.from(codes_set);
      // console.log(codes);
      this.medTypes = codes.map(c => ({
        value: c.split(splitstr)[0],
        label: c.split(splitstr)[1]
      }));
    },
    // 设置数据
    setData() {
      let data = this.dataFilter();
      let { items, vagueItems, includeMode_items } = this.setting;
      let group;
      if (vagueItems) {
        group = this.setGroupItems(data);
      } else {
        group = {};
        items.forEach((item, index) => {
          let k = 'o_' + index;
          group[k] = { codes: item.code, datas: [] };
        });
        data.forEach(ele => {
          let { ordPriCode: code, orderName } = ele;
          if (includeMode_items) this.groupHasCode(group, code, ele);
          else this.groupCode(group, code, ele);
        });
      }
      // console.log(this.copy(group));
      this.medical = group;
    },
    // 数据过滤器
    dataFilter() {
      let data = JSON.parse(JSON.stringify(this.rawData));
      /* 按名字和药品类型过滤 */
      data = data.filter(d => {
        let flag = false,
          conditions = this.conditions;
        if (conditions.length) {
          conditions.forEach(c => {
            if (d.orderName.includes(c)) flag = true;
          });
        } else {
          flag = true;
        }
        return flag;
      });
      data = data.filter(d => this.selectedMedTypes.length === 0 || this.selectedMedTypes.includes(d.ordSubCatCode));
      return data;
    },
    /*  */
    handleFilterEnter() {
      this.conditions.push(this.keyword);
      this.keyword = '';
    },
    // 根据数据对分类处理--模糊
    setGroupItems(d) {
      let group = {},
        num = 0;
      d.forEach(dd => {
        let has = false;
        for (let k in group) {
          if (group[k].desc === dd.ordPriDesc) {
            group[k].eles.push(dd);
            has = true;
          }
        }
        if (!has) {
          num++;
          group[num] = {
            desc: dd.ordPriDesc,
            eles: [dd]
          };
        }
      });
      return group;
    },
    // 判断group里的code是否包含于数据里的该字段
    groupHasCode(group, code, ele) {
      for (let c in group) {
        let o = group[c],
          codes = o.codes;
        codes.forEach(cod => {
          if (cod.indexOf('^') === 0) {
            // ^开头表示精确匹配
            let newcod = cod.substring(1);
            if (newcod === code) {
              o.datas.push(ele);
              return true;
            }
          } else {
            if (code.indexOf(cod) > -1) {
              o.datas.push(ele);
              return true;
            }
          }
        });
      }
      return false;
    },
    groupCode(group, code, ele) {
      for (let c in group) {
        let o = group[c],
          codes = o.codes;
        codes.forEach(cod => {
          if (cod === code) {
            o.datas.push(ele);
            return true;
          }
        });
      }
      return false;
    },
    // 判断方法 - 判断长期医嘱区是否可点击
    isLongClickable(longMeds, ind) {
      let cls = '';
      let meds = JSON.parse(JSON.stringify(longMeds.datas));
      let encId = this.encIds[ind];
      let targetMeds = meds.filter(med => {
        return med.hdcEncId === encId;
      });
      if (targetMeds.length) cls = 'longMeds_clickable';
      return cls;
    },
    /* 展示长期用药时间轨迹 */
    showLong(longMeds, ind) {
      let meds = JSON.parse(JSON.stringify(longMeds.datas));
      let encId = this.encIds[ind];
      let encStartDate = this.encStartDates[ind];
      // console.log(meds, encId);
      let targetMeds = meds.filter(med => {
        return med.hdcEncId === encId;
      });
      // console.log(targetMeds);
      if (targetMeds.length) {
        this.dialogVisible = true;
        let maxSpan = 1;
        this.selectedLongMeds = targetMeds.map(med => {
          let { orderName, medUsageCode, medFreqCode, orderDate, orderTime, ordStopDate, ordStopTime } = med;
          let order = dayjs(orderDate).diff(encStartDate, 'day') + 1;
          let span = dayjs(ordStopDate).diff(encStartDate, 'day') + 1;
          maxSpan = Math.max(maxSpan, span);
          return {
            title: medUsageCode + medFreqCode,
            name: orderName,
            startDate: orderDate,
            startTime: orderTime,
            stopDate: ordStopDate,
            stopTime: ordStopTime,
            order,
            key: orderName + orderTime + ordStopTime,
            config: {
              titleCfg: {
                isTitle: true,
                titleStyle: {
                  color: '#84aaca'
                }
              }
            }
          };
        });
        // maxSpan = 12;
        this.dateSpan = maxSpan;
        this.$nextTick(() => {
          let canvasBody = this.$refs.medicalLineDialog.$el.getElementsByClassName('hos-dialog__body')[0];
          canvasBody.style.position = 'relative';
          canvasBody.style.overflowX = 'scroll';
          let canvasWidth = parseInt(getComputedStyle(canvasBody).width);
          if (maxSpan < 12) {
            this.canvasWidth = canvasWidth;
          } else {
            this.canvasWidth = maxSpan * 100 - 40;
          }
          this.axis = {
            encStartDate,
            canvasBody,
            maxSpan
          };
        });
      }
    }
  }
};
</script>
<style lang="scss">
.filter-area {
  .meds-type-selector {
    margin-right: 10px;
    .hos-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .hos-input__icon {
      line-height: 30px;
    }
  }
}
.nullData {
  border: none;
}
.medicalLineP {
  position: relative;
  z-index: 9;
}
.longMeds_clickable {
  cursor: pointer;

  &:hover {
    // background-color: rgb(194, 249, 255);
    background-color: rgba(159, 102, 0, 0.3);
  }
}
</style>
