<template>
  <div class="module-content">
    <!-- 搜索框 -->
    <div class="filter-area">
      <hos-date-picker
        v-model="dateRange"
        type="daterange"
        unlink-panels
        size="mini"
        popper-class="small-drop-dates"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </hos-date-picker>
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
        <div class="dept-check emr-check">
          <hos-checkbox-group v-model="checkTypes" size="mini">
            <span v-for="(el, i) in emrTypes" :key="el.type + i" class="dept-check-item pacs-check-item">
              <hos-checkbox-button :label="el.type" @change="handleCheck" :checked="true">{{ el.desc }}</hos-checkbox-button>
            </span>
          </hos-checkbox-group>
        </div>
      </hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col v-if="!hasDocs">
            <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
          </hos-col>
          <hos-col v-else v-for="(day, d) in layout.showDays" :key="d" :sm="3" :xs="3" class="">
            <template v-if="emrDocs[d] && emrDocs[d].length > 0">
              <div v-for="(data, j) in emrDocs[d]" :key="'data_' + j">
                <Label v-if="data.display" :param="data" :setting="setting" @click.native="handleClick(data)" />
              </div>
            </template>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
    <hos-dialog v-if="dialogVisible" class="elDialog1" title="病案首页" :visible.sync="dialogVisible" width="90%">
      <iframe :src="targetSrc" width="100%" height="100%" frameborder="0"></iframe>
    </hos-dialog>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import { getEmr } from '@/server/api.js';
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
      checkTypes: [],
      emrTypes: [],
      emrDocs: [],
      hasDocs: true,
      dialogVisible: false,
      targetSrc: '',
      rawEmrDocs: [],
      keyword: '',
      conditions: [],
      dateRange: ''
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  watch: {
    hosEncIds() {
      this.fetchData();
    },
    rawEmrDocs() {
      this.customFilter();
    },
    conditions() {
      this.customFilter();
    },
    dateRange() {
      this.customFilter();
    }
  },
  computed: {
    hosEncIds() {
      return this.$store.state.hosEncIds;
    }
  },
  methods: {
    fetchData() {
      this.checkTypes = []; // 重置
      this.emrTypes = [];
      let hosEncIds = this.hosEncIds;
      if (hosEncIds.length === 0) return;
      let hosRegNo = this.$store.state.hosRegNo;
      let url = setting.ms_url + 'document/count';
      let params = hosEncIds.map(hosEncId => {
        return {
          hoscode:"3,10,25,32",
          patientid: hosRegNo,
          visitnumber: hosEncId,
          documentformat: 'html'
        };
      });
      this.loading = true;
      getEmr(url, {
        page: 1,
        rows: 1000,
        params: params
      })
        .then(res => {
          /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
          if (hosEncIds != this.hosEncIds) {
            console.log('hosencids---abno:', hosEncIds, 'this.hosencids', this.hosEncIds);
            return;
          }
          /* ---------------------------------------------------------------------------------------------------------------- */
          this.loading = false;
          console.log('emr', res);
          let { documenttypes = [] } = res;
          this.noNullData(documenttypes); // 不要空数据
          let emrDocs = [];
          let emrTypes = documenttypes.map(type => {
            let { doctypedesc, documents = [], documenttype } = type;
            let location = [];
            documents.forEach((doc, i) => {
              let { documentid, templateid, templatedesc, visitnumber, documentdate } = doc;
              let index = hosEncIds.indexOf(visitnumber);
              if (!Array.isArray(emrDocs[index])) emrDocs[index] = [];
              emrDocs[index].push({
                docId: documentid,
                temId: templateid,
                desc: templatedesc,
                date: documentdate && dayjs(documentdate).format('YYYY-MM-DD'),
                type: documenttype,
                hosNum: visitnumber,
                display: true
              });
              location.push([index, emrDocs[index].length - 1]);
            });
            return {
              desc: doctypedesc,
              type: documenttype,
              location
            };
          });
          this.emrTypes = emrTypes;
          this.emrDocs = emrDocs;
          this.rawEmrDocs = JSON.parse(JSON.stringify(emrDocs));
          this.hasDocs = this.emrDocs.some(el => {
            return el.length > 0;
          });
          // console.log('this.emrDocs:', this.emrDocs);
          // console.log('this.emrTypes:', this.emrTypes);
        })
        .catch(err => {
          this.emrTypes = [];
          this.emrDocs = [];
          this.hasDocs = false;
        });
    },
    noNullData(doctys) {
      try {
        if (!(doctys instanceof Array)) return;
        for (let i = 0; i < doctys.length; i++) {
          if (doctys[i] instanceof Object) {
            let num = 0;
            for (let k in doctys[i]) {
              num++;
            }
            if (num === 0) {
              doctys.splice(i, 1);
              i--;
            }
          } else {
            return;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    handleCheck(value, e) {
      let name = e.target.value;
      this.emrTypes.forEach(item => {
        let { type, location } = item;
        if (name === type) {
          location.forEach(s => {
            this.emrDocs[s[0]][s[1]].display = value;
          });
        }
      });
    },
    handleClick(data) {
      console.log(data);

      // this.targetSrc = `http://192.178.61.153:9026/emr_switch/emrSwitch/HosDocumentSearch?htmltempid=${data.temId}&instanceid=${data.docId}`;
      this.targetSrc = setting.ms_url + `document?htmltempid=${data.temId}&displayMode=html&instanceid=${data.docId}`;
      this.dialogVisible = true;
    },
    handleFilterEnter() {
      this.conditions.push(this.keyword);
      this.keyword = '';
    },
    // 过滤方法
    customFilter() {
      let conditions = this.conditions,
        dateRange = this.dateRange,
        raw = this.rawEmrDocs;
      this.emrDocs = raw.map(
        r =>
          r &&
          r.filter(ir => {
            let conflag = !conditions.length || conditions.filter(c => ir.desc.includes(c)).length,
              dateflag = false;
            if (!dateRange) {
              dateflag = true;
            } else {
              let sd = dateRange[0],
                ed = dateRange[1],
                ird = ir.date;
              dateflag = !ird || (dayjs(ird).diff(sd, 'day') >= 0 && dayjs(ird).diff(ed, 'day') <= 0);
            }
            return conflag && dateflag;
          })
      );
      console.log(raw, dateRange);
    }
  }
};
</script>
<style lang="scss">
.elDialog1 {
  margin-top: calc(56px - 15vh);
  overflow: hidden;
  .hos-dialog {
    height: 85%;
    .hos-dialog__body {
      box-sizing: border-box;
      height: calc(100% - 55px);
    }
  }
}
</style>
