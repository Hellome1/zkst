<template>
  <div class="module-content">
    <hos-row v-if="!hasMedical">
      <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left medical-left"></hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col>
            <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
    <hos-row v-else v-loading="loading">
      <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left medical-left"> </hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col ref="col" v-for="(m, d) in medical" :key="d" :sm="3" :xs="3" class="">
            <template v-if="encTypeCodes[d] === 'I'">
              <div class="scrollContainer">
                <div v-for="(data, j) in m.dts" :key="data.hdcEncId + j">
                  <span>
                    <Group :groupData="data" :setting="setting" :house="true" />
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="fold" v-if="m.limits > 3" @click="fold(m)">
                <span>收起</span>
              </div>
              <div class="scrollContainer">
                <div v-for="(data, j) in m.dts" :key="data.hdcEncId + j">
                  <span v-if="j < m.limits">
                    <Group :groupData="data" :setting="setting" />
                  </span>
                </div>
              </div>
              <div class="showMore" v-if="m.dts.length > m.limits" @click="showMore(m, d)">
                <span>显示更多</span>
              </div>
            </template>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
  </div>
</template>

<script>
import Group from './prescGroup.vue';
import { getPrescriptionInfo as getMedical } from '@/server/api.js';
import { mapState } from 'vuex';
export default {
  inject: ['layout'],
  components: { Group },
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      medical: [],
      hasMedical: true,
      loading: true,
      encTypeCodes: []
    };
  },
  created() {
    this.fetData();
  },
  mounted() {},
  watch: {
    encIds(n) {
      if (n.length === 0) {
        this.medical = [];
        this.hasMedical = false;
      } else {
        this.fetData();
      }
    }
  },
  computed: {
    ...mapState(['encIds', 'visitsInfo']),
    longs: function() {
      let arr = [];
      this.setting.items.forEach(item => {
        if (item.display === 'line') arr.push(item.code);
      });
      return arr;
    }
  },
  methods: {
    log(msg) {
      console.log(JSON.parse(JSON.stringify(msg)));
    },
    fetData() {
      if (this.encIds.length === 0) return;
      this.loading = true;
      let param = {
        hdcEncId: this.encIds.join('||'),
        orderInfo: {
          ordStatusList: this.setting.ordStatusList
        }
      };
      getMedical(param).then(res => {
        this.loading = false;
        let { data = [] } = res;
        this.hasMedical = true;
        data.length === 0 && (this.hasMedical = false);
        this.medical = this.handleData(data);
        this.encTypeCodes = this.visitsInfo.map(v => v.encTypeCode);
      }).catch(err => {
        this.loading = false;
        throw err;
      });
    },
    handleData(d) {
      let nd = this.encIds.map(id => {
        return {
          id,
          dts: [],
          limits: 3
        };
      });
      d.forEach((data, index) => {
        let medics = data.medPrescList,
          pushF = false;
        // 如果状态是停止则必须是长期才显示
        for (let i = 0; i < medics.length; i++) {
          if (medics[i].ordStatusCode === 'D' && !this.judgeLong(medics[i].ordPriCode)) {
            console.log({ ...data }, 'D_not_long');
            medics.splice(i, 1);
            i--;
          } else {
            pushF = true;
          }
        }
        for (let i = 0; i < nd.length; i++) {
          if (data.hdcEncId === nd[i].id && pushF) {
            nd[i].dts.push(data);
            nd[i].dts.push(data);
            nd[i].dts.push(data);
          }
        }
      });
      // console.log(nd, 'nd');
      return nd;
    },
    judgeLong(code) {
      let ls = this.longs,
        isLong = false;
      if (this.setting.includeMode_items) {
        // 包含
        ls.forEach(l => {
          for (let i = 0; i < l.length; i++) {
            if (l[i].indexOf('^') === 0) {
              let c = l[i].substring(1);
              if (c === code) isLong = true;
            } else if (code.indexOf(l[i]) > -1) isLong = true;
          }
        });
        return isLong;
      } else {
        // 精确
        ls.forEach(l => {
          for (let i = 0; i < l.length; i++) {
            if (l[i] === code) isLong = true;
          }
        });
        return isLong;
      }
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
    fold(m) {
      m.limits = 3;
    },
    showMore(m) {
      m.limits += 100;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.nullData {
  border: none;
}
.topLine {
  border-top: 1px solid #ddd;
}
.showMore,
.fold {
  background-color: rgb(0, 110, 255);
  color: white;
  cursor: pointer;
}
.scrollContainer {
  overflow-y: auto;
  max-height: 270px;
}
</style>
