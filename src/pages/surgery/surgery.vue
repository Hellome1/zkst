<template>
  <div class="module-content" v-loading="loading">
    <hos-row>
      <hos-col :span="layout.leftW" :style="{ backgroundColor: layout.leftBgColor }" class="layout-left"></hos-col>
      <hos-col :span="layout.rightW" class="layout-right">
        <hos-row class="module-content-list">
          <hos-col v-if="!hasData">
            <hos-empty :description="'未查询到' + setting.title + '数据'"></hos-empty>
          </hos-col>
          <hos-col v-else v-for="(day, d) in layout.showDays" :key="d" :sm="3" :xs="3" class="">
            <template v-if="sugerApp[d] && sugerApp[d].length > 0">
              <div v-for="(data, j) in sugerApp[d]" :key="'data_' + j">
                <Label :param="data" :setting="setting" @click.native="handleClick(data, d)" />
              </div>
            </template>
            <template v-else>
              <div v-if="sugerApp[d] === ''">数据加载失败</div>
            </template>
          </hos-col>
        </hos-row>
        <div class="module-content-line"></div>
      </hos-col>
    </hos-row>
    <hos-dialog title="手术详细信息" :visible.sync="dialogVisible" width="50%">
      <hos-card v-for="(detail, i) in cur_details" :key="i" shadow="hover">
        <div slot="header" class="clearfix">
          <h3 class="detail_header">{{ detail.operationDesc }}</h3>
        </div>
        <div class="detail_item">
          <strong>手术类型</strong>
          <span>{{ cur_sugerapp.operationType }}</span>
        </div>
        <div class="detail_item">
          <strong>手术室</strong>
          <span>{{ cur_sugerapp.operationRoom }}</span>
        </div>
        <div class="detail_item">
          <strong>术前诊断</strong>
          <span>{{ cur_sugerapp.preOperDiagRemark }}</span>
        </div>
        <div class="detail_item">
          <strong>手术级别</strong>
          <span>{{ detail.operationLevel }}</span>
        </div>
        <div class="detail_item">
          <strong>手术状态</strong>
          <span>{{ detail.operationStatus }}</span>
        </div>
        <div class="detail_item">
          <strong>手术部位</strong>
          <span>{{ detail.operationPosition }}</span>
        </div>
        <div class="detail_item">
          <strong>手术开始日期</strong>
          <span>{{ detail.operStartDate }}</span>
        </div>
        <div class="detail_item">
          <strong>手术开始时间</strong>
          <span>{{ detail.operStartTime }}</span>
        </div>
        <div class="detail_item">
          <strong>手术结束日期</strong>
          <span>{{ detail.operEndDate }}</span>
        </div>
        <div class="detail_item">
          <strong>手术结束时间</strong>
          <span>{{ detail.operEndTime }}</span>
        </div>
        <div class="detail_item">
          <strong>手术医生</strong>
          <span>{{ detail.operDocName }}</span>
        </div>
      </hos-card>
    </hos-dialog>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import { getSurgery, getSurgeryDetails } from '@/server/api.js';
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
      dialogVisible: false,
      hasData: true,
      sugerApp: [],
      cur_sugerapp: {},
      cur_details: []
    };
  },
  created() {
    this.fetchData();
    this.$watch('loading', n => {
      !n && this.$emit('twoDone');
    });
  },

  mounted() {},
  watch: {
    encIds(n) {
      this.sugerApp = [];
      this.cur_details = [];
      this.fetchData();
    }
  },
  computed: {
    encIds() {
      return this.$store.state.encIds;
    }
  },
  methods: {
    fetchData() {
      // if (this.encIds.length === 0) return;
      // getSurgery({ hdcEncId: this.encIds.join('||') }).then(res => {
      //   this.sugerApp = this.classifyById(res.data);
      //   this.hasData = this.sugerApp.some(el => {
      //     return el.length > 0;
      //   });
      // });
      let encIds = this.encIds;
      let loadingFlags = [];
      this.hasFailLoad = false;
      this.encIds.forEach((encId, i) => {
        this.loading = true;
        loadingFlags.push(true);
        getSurgery({ hdcEncId: encId })
          .then(res => {
            /* 防止正在请求几条数据而先请求的数据后返回导致显示的数据不是最后一次请求，实际应该显示最后一次请求的数据，因为最后一次请求的数据与当前就诊轴保持一致 */
            if (encIds != this.encIds) {
              console.log('encIds---abno:', encIds, 'this.encIds', this.encIds);
              return;
            }
            /* ---------------------------------------------------------------------------------------------------------------- */
            loadingFlags[i] = false;
            if (!loadingFlags.includes(true)) this.loading = false;
            let { data = [] } = res;
            this.$set(this.sugerApp, i, data);
            !this.hasFailLoad &&
              (this.hasData = this.sugerApp.some(el => {
                return el.length > 0;
              }));
          })
          .catch(e => {
            loadingFlags[i] = false;
            this.hasFailLoad = true; // 有失败的加载this.hasData默认为true，因为不知道失败的那条是否有数据。
            this.hasData = true;
            his.$set(this.sugerApp, i, '');
            if (!loadingFlags.includes(true)) this.loading = false;
          });
      });
    },
    classifyById(ds) {
      let sA = [];
      this.encIds.forEach(id => {
        let matched = ds.filter(d => {
          return d.hdcEncId === id;
        });
        sA.push(matched);
      });
      return sA;
    },
    showDetail(appinfo, details) {
      this.dialogVisible = true;
    },
    handleClick(operapp, index) {
      this.cur_sugerapp = operapp;
      let { operAppId } = operapp;
      if (this.cur_details.length > 0) {
        this.showDetail();
      } else {
        getSurgeryDetails({ operAppInfo: { operAppId: operAppId } }).then(res => {
          let { data = [] } = res;
          this.cur_details = data;
          this.showDetail();
        });
      }
    }
  }
};
</script>
<style lang="scss">
.detail_header {
  margin: 0;
}
.detail_item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  &:hover {
    background-color: #f5f5f5;
    color: #555;
  }
}
</style>
