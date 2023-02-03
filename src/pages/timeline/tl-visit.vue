<template>
  <div class="timeline" :class="span">
    <div class="encTypeFilter">
      <hos-checkbox-group v-model="encTypeCode">
        <span class="encTypeBox" v-for="type in allType" :key="type.code">
          <hos-checkbox :label="type.codes">{{ type.desc }} {{ type.visitCount ? type.visitCount + ' 次' : '' }}</hos-checkbox>
        </span>
      </hos-checkbox-group>
    </div>
    <hos-row v-loading="loading">
      <hos-col class="tl-left" :span="layout.leftW">
        <hos-row>
          <hos-col class="tl-top">
            <div class="lcjz-container">
              <Lcjz
                class="lcjzBtn"
                v-if="mShow"
                :dt="mData"
                :maxPage="maxPage"
                :encs="encs"
                :customLcjz="customLcjz"
                :frequency="frequency"
                @reFetchData="checkSelected"
              />
            </div>
            <div class="slect">
              <i class="prev-button fa fa-angle-left" :class="prevDisabled ? 'disabled' : ''" @click="handlePrev"></i>
              <hos-select @change="handleChange" class="select-page" size="mini" popper-class="select-week-dropdown" v-model="selectedPage" placeholder="请选择">
                <hos-option v-for="page in selectPages" :label="'第 ' + page + ' 页'" :value="page" :key="page">{{ '第 ' + page + ' 页' }}</hos-option>
              </hos-select>
              <i class="next-button fa fa-angle-right" :class="nextDisabled ? 'disabled' : ''" @click="handleNext"></i>
            </div>
          </hos-col>
          <hos-col class="tl-bottom dept">
            <p class="title">就诊科室</p>
          </hos-col>
          <hos-col class="tl-bottom content">
            <p class="title">诊断内容</p>
          </hos-col>
        </hos-row>
      </hos-col>
      <hos-col class="tl-right" :span="layout.rightW">
        <hos-row>
          <hos-col :sm="3" :xs="3" v-for="(visit, i) in visits" :key="i" class="tl-item" ref="sectionOfTime">
            <div class="tl-top day" :class="visit.encTypeCode">
              <p>
                {{ visit.encStartDate }} <span>({{ transformToWeek(visit.encStartDate) }})</span>
              </p>
              <span
                >{{ visit.encTypeDesc }} {{ morningOrNoon(visit.encStartTime) }}
                <i v-if="visit.encTypeCode === 'I'" class="fa fa-external-link" @click="toJCST(visit.hosEncId)"></i>
              </span>
            </div>
            <div class="tl-bottom dept">
              <p>{{ visit.encDeptName }}</p>
            </div>
            <div class="tl-bottom content" :class="visit.encTypeCode">
              <p v-for="(diagn, i) in visit.diagnose" :key="i" :class="diagn.highLight ? 'diagnoseName-highLight' : ''">{{ diagn.diagnoseName }}</p>
            </div>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
    <hos-row v-if="lockTlVisit" v-show="showLocked" class="locked_tlVisit" v-loading="loading">
      <hos-col class="tl-left" :span="layout.leftW">
        <hos-row>
          <hos-col class="tl-top">
            <div class="lcjz-container">
              <Lcjz
                class="lcjzBtn"
                v-if="mShow"
                :dt="mData"
                :maxPage="maxPage"
                :encs="encs"
                :customLcjz="customLcjz"
                :frequency="frequency"
                @reFetchData="checkSelected"
              />
            </div>
            <div class="slect">
              <i class="prev-button fa fa-angle-left" :class="prevDisabled ? 'disabled' : ''" @click="handlePrev"></i>
              <hos-select @change="handleChange" class="select-page" size="mini" popper-class="select-week-dropdown" v-model="selectedPage" placeholder="请选择">
                <hos-option v-for="page in selectPages" :label="'第 ' + page + ' 页'" :value="page" :key="page">{{ '第 ' + page + ' 页' }}</hos-option>
              </hos-select>
              <i class="next-button fa fa-angle-right" :class="nextDisabled ? 'disabled' : ''" @click="handleNext"></i>
            </div>
          </hos-col>
          <hos-col class="tl-bottom dept">
            <p class="title">就诊科室</p>
          </hos-col>
          <hos-col class="tl-bottom content">
            <p class="title">诊断内容</p>
          </hos-col>
        </hos-row>
      </hos-col>
      <hos-col class="tl-right" :span="layout.rightW">
        <hos-row>
          <hos-col :sm="3" :xs="3" v-for="(visit, i) in visits" :key="i" class="tl-item" ref="sectionOfTime">
            <div class="tl-top day" :class="visit.encTypeCode">
              <p>
                {{ visit.encStartDate }} <span>({{ transformToWeek(visit.encStartDate) }})</span>
              </p>
              <span
                >{{ visit.encTypeDesc }} {{ morningOrNoon(visit.encStartTime) }}
                <i v-if="visit.encTypeCode === 'I'" class="fa fa-external-link" @click="toJCST(visit.hosEncId)"></i
              ></span>
            </div>
            <div class="tl-bottom dept">
              <p>{{ visit.encDeptName }}</p>
            </div>
            <div class="tl-bottom content" :class="visit.encTypeCode">
              <p v-for="(diagn, i) in visit.diagnose" :key="i" :class="diagn.highLight ? 'diagnoseName-highLight' : ''">{{ diagn.diagnoseName }}</p>
            </div>
          </hos-col>
        </hos-row>
      </hos-col>
    </hos-row>
  </div>
</template>

<script>
import { getVisit, getDept } from '@/server/api';
import { Loading, Message } from 'element-ui';
import Lcjz from '@/components/Lcjz/index.vue';
export default {
  inject: ['layout'],
  components: {
    Lcjz
  },
  props: {},
  data() {
    return {
      loading: false,
      selectedPage: 1,
      selectPages: 0,
      prevDisabled: true,
      nextDisabled: false,
      visits: [],
      mShow: false, // lcjz
      mData: [], // lcjz，
      maxPage: 1,
      weekChinese: ['日', '一', '二', '三', '四', '五', '六'],
      encTypeCode: null,
      allType: setting.allType,
      bloodDeptCode: [],
      showLocked: false,
      encs: {
        viewModeEncs: [],
        docSelectEncs: []
      },
      // 自定义lcjz时间轴样式，可选参数见components>elTimeline,目前只支持下面的和hover。
      customLcjz: {
        reverse: false,
        isRow: false, // 是否横向显示,默认false
        placement: 'top', // 不以'_'开始代表该值静态显示
        activity: {
          isCard: {
            //   title: 'title1', // 不支持
            desc: '_encStatusDesc'
          },
          timestamp: '_encStartDate', // 使用'_'开始代表该值为动态，显示的值为数据里面的该key值
          size: 'large'
        }
      }
    };
  },
  watch: {
    selectedPage(n) {
      this.fetData();
    },
    encTypeCode: function (n, o) {
      this.cookie_c('encTypeCodes', n, 30);
      if (o === null) return; // 第一次则返回不获取就诊数据
      this.rawRes = null;
      this.fetData();
    },
    viewMode: function () {
      this.fetData();
    }
  },

  mounted() {},

  created() {
    this.getSetting_enc();
    this.fetData();
    this.scrollListener();
  },

  computed: {
    //首屏展示就诊次数
    frequency() {
      return this.layout.showDays;
    },
    viewMode() {
      return this.$store.state.viewMode;
    },
    setting() {
      return this.$store.state.globalSetting.setting;
    },
    lockTlVisit() {
      return this.setting.lockTlVisit;
    },
    span() {
      return this.setting.layout && this.setting.layout.span;
    }
  },

  methods: {
    getSetting_enc() {
      let hdcId = this.$store.state.hdcId;
      sessionStorage.setItem('hdcPatientId', hdcId);
      sessionStorage.setItem('hosPatientId', hdcId.split('_')[1]);
      // sessionStorage.setItem('Role', '研发人员');
      // sessionStorage.setItem('UserName', 'Liu');
      // sessionStorage.setItem('UserCode', '1040');
      // sessionStorage.setItem('RoleId', '2');
      // sessionStorage.setItem('PassWord', '123456');
      // sessionStorage.setItem('PatVisitNumber', '00001_55446214');
      // sessionStorage.setItem('HospitalCode', '00001');
      // sessionStorage.setItem('PATHosPatientID', '08968721');
      // sessionStorage.setItem('PATPatientID', '00001_08968721');
      let etc = this.cookie_c('encTypeCodes'),
        code = [],
        et = [];
      if (!etc) {
        this.allType.forEach(a => {
          code.push(a.codes);
        });
        this.encTypeCode = code;
        return;
      }
      // etc.forEach(e => {
      //   e.forEach(el => {
      //     et.push(el);
      //   });
      // });
      et = this.arrFlatened(etc);
      this.allType.forEach(a => {
        a.codes.forEach(al => {
          et.forEach(etl => {
            if (al === etl) code.push(a.codes);
          });
        });
      });
      this.encTypeCode = code;
    },
    handleChange(page) {
      this.selectedPage = page;
    },
    log(msg) {
      console.log(msg, 'msg');
    },
    transformToWeek(date) {
      let week = dayjs(date).day();
      return this.weekChinese[week];
    },
    morningOrNoon(time) {
      if (time.split(':')[0]) {
        return time.split(':')[0] > 12 ? '(下)' : '(上)';
      }
      return '';
    },
    checkSelected() {
      this.selectedPage = 1;
      this.rawRes = null;
      this.fetData();
    },
    scrollListener() {
      let _this = this;
      document.addEventListener('scroll', function (e) {
        // console.log(document.documentElement.scrollTop);
        if (document.documentElement.scrollTop > 310) {
          _this.showLocked = true;
        } else {
          _this.showLocked = false;
        }
      });
    },

    // 请求诊断数据
    fetData() {
      if (this.loading) return;
      this.loading = true;
      // 如果视图模式为血液且没有血液科室就请求
      if (this.viewMode === 'blood' && this.bloodDeptCode.length === 0) return this.getBloodDept();

      let param = this.getParam();

      if (this.rawRes) {
        // 存有原始数据则直接用
        this.loading = false;
        datalogic.call(this, JSON.parse(JSON.stringify(this.rawRes)));
      } else {
        // 没有原始数据请求数据
        getVisit(param)
          .then(res => {
            this.loading = false;
            this.rawRes = JSON.parse(JSON.stringify(res)); // 存原始数据
            // if (this.mData.length === 0) {
            // -- lcjz
            // this.mData = res.data.filter((d, i) => i < this.frequency);
            this.mData = res.data;
            // this.maxPage = pages / 2;
            this.maxPage = res.recordsTotal / 14;
            this.mShow = true;
            // }

            datalogic.call(this, res);
          })
          .catch(e => (this.loading = false));
      }

      function datalogic(res) {
        res = this.dataFilter(res); // 视图模式只返回对应规则的数据

        let { data, recordsTotal, pages } = res;
        if (data === null) return;

        this.selectPages = Math.ceil(recordsTotal / this.frequency);
        if (this.selectPages === 1) this.nextDisabled = true;
        this.checkTurnPageButton();

        let encIds = [];
        let hosEncIds = [];
        let encStartDates = [];
        let encEndDates = [];
        let visits = data.map(item => {
          let { encStartDate, encDeptName, diagnoseInfo = [], encTypeDesc, encTypeCode, hdcEncId, hosEncId, encStartTime, encEndDate } = item;
          if (!diagnoseInfo) diagnoseInfo = [];
          encDeptName = encDeptName.indexOf('-') > -1 ? encDeptName.split('-')[1] : encDeptName;
          encIds.push(hdcEncId);
          hosEncIds.push(hosEncId);
          encStartDates.push(encStartDate);
          encEndDates.push(encEndDate);
          let diagnose = diagnoseInfo.map(ele => {
            let { diagnoseName, highLight } = ele;
            return {
              diagnoseName,
              highLight
            };
          });
          diagnose = this.arrUnique(diagnose); // 诊断去重
          return { encStartDate, diagnose, encDeptName, encTypeDesc, encTypeCode, encStartTime, hosEncId };
        });
        let visitsInfo = data.map(item => {
          return {
            encStartDate: item.encStartDate,
            encDeptName: item.encDeptName,
            diagnoseName: item.diagnoseInfo && item.diagnoseInfo.map(ele => ele.diagnoseName).join(''),
            hdcEncId: item.hdcEncId,
            encTypeCode: item.encTypeCode
          }
        });
        /* 不让加载过快 */
        this.encIds = encIds;
        this.hosEncIds = hosEncIds;
        if (this.diffEncs(encIds) && !this.committing) {
          this.committing = true;
          setTimeout(() => {
            this.$store.commit('set_encIds', this.encIds);
            this.$store.commit('set_hosEncIds', this.hosEncIds);
            this.$store.commit('SET_VISITSINFO', visitsInfo);
            this.committing = false;
          }, 500);
        } // 只有就诊号与之前不同才会触发改变
        /* --------- */
        this.$store.commit('set_encStartDates', encStartDates);
        this.$store.commit('set_encEndDates', encEndDates);
        this.currentViewMode = this.viewMode; // 记录当前模块
        console.log(encIds);
        this.visits = visits;
      }
    },
    diffEncs(encs) {
      let anothor = this.$store.state.encIds;
      if (anothor.length === 0) return true;
      let indentical = true;
      if (encs.length === anothor.length) {
        for (let i = 0; i < encs.length; i++) {
          if (!(encs[i] === anothor[i])) indentical = false;
        }
      } else {
        indentical = false;
      }
      if (indentical) return false;
      else return true;
    },
    // 获取血液科室代码
    getBloodDept() {
      getDept().then(res => {
        this.loading = false;
        let { data } = res;
        let targetData = data.filter(d => d.encDeptName.indexOf('血液') > -1).map(d => d.encDeptCode);
        // 如果目标数据的长度不为零则赋值给血液科室并重新请求诊断数据
        if (targetData.length) {
          this.bloodDeptCode = targetData;
          this.fetData();
        }
      });
    },
    // 数据过滤
    dataFilter(res) {
      let datas = res.data;
      let pageMax = this.frequency * this.selectedPage,
        pageMin = this.frequency * (this.selectedPage - 1);

      if (this.viewMode === 'normal') {
        statisticVisits.call(this, datas);
        res.data = datas.filter((d, i) => i < pageMax && i >= pageMin);
        return res;
      } else if (this.viewMode === 'su') {
        // let classicFromDoc = this.getClassicFromDoc('su_setting');
        // let allDatas = datas.filter(data => {
        //   return (data.diagnoseInfo && data.diagnoseInfo.filter(di => di.diagnoseName.indexOf('糖尿病') > -1).length) || classicFromDoc.includes(data.hdcEncId);
        // });
        // let filtedDatas = datas.filter(data => {
        //     return data.diagnoseInfo && data.diagnoseInfo.filter(di => di.diagnoseName.indexOf('糖尿病') > -1).length;
        //   }),
        //   selectedFromDocs = datas.filter(data => classicFromDoc.includes(data.hdcEncId)),
        //   len = allDatas.length;
        // let encs = {
        //   viewModeEncs: [],
        //   docSelectEncs: []
        // };
        // if (filtedDatas.length) {
        //   let viewModeEncs = filtedDatas.map(d => d.hdcEncId);
        //   encs.viewModeEncs = viewModeEncs;
        // }
        // if (selectedFromDocs.length) {
        //   let docSelectEncs = selectedFromDocs.map(d => d.hdcEncId);
        //   encs.docSelectEncs = docSelectEncs;
        // }
        // this.encs = encs;
        // if (len) {
        //   res.data = allDatas.filter((d, i) => i < pageMax && i >= pageMin);
        //   res.recordsTotal = len;
        // } else {
        //   Message({
        //     message: '该患者没有包含糖尿病的就诊!',
        //     type: 'error'
        //   });
        //   res.data = null;
        //   this.$store.commit('SET_VIEWMODE', this.currentViewMode || 'normal');
        // }
        // return res;
        return viewModeLogic.bind(this)(res, 'su');
      } else if (this.viewMode === 'blood') {
        // let classicFromDoc = this.getClassicFromDoc('blood_setting');
        // let allDatas = datas.filter(data => {
        //   return this.bloodDeptCode.includes(data.encDeptCode) || classicFromDoc.includes(data.hdcEncId);
        // });
        // let filtedDatas = datas.filter(data => {
        //     return this.bloodDeptCode.includes(data.encDeptCode);
        //   }),
        //   selectedFromDocs = datas.filter(data => classicFromDoc.includes(data.hdcEncId)),
        //   len = allDatas.length;
        // let encs = {
        //   viewModeEncs: [],
        //   docSelectEncs: []
        // };
        // if (filtedDatas.length) {
        //   let viewModeEncs = filtedDatas.map(d => d.hdcEncId);
        //   encs.viewModeEncs = viewModeEncs;
        // }
        // if (selectedFromDocs.length) {
        //   let docSelectEncs = selectedFromDocs.map(d => d.hdcEncId);
        //   encs.docSelectEncs = docSelectEncs;
        // }
        // this.encs = encs;
        // if (len) {
        //   res.data = allDatas.filter((d, i) => i < pageMax && i >= pageMin);
        //   res.recordsTotal = len;
        // } else {
        //   Message({
        //     message: '该患者没有在血液相关科室的就诊!',
        //     type: 'error'
        //   });
        //   res.data = null;
        //   this.$store.commit('SET_VIEWMODE', this.currentViewMode || 'normal');
        // }
        // return res;
        return viewModeLogic.bind(this)(res, 'blood');
      }
      return res;

      function viewModeLogic(res, mode) {
        // 先决条件
        let datas = res.data;
        let pageMax = this.frequency * this.selectedPage,
          pageMin = this.frequency * (this.selectedPage - 1);

        let settingName = mode + '_setting';
        let msg = mode === 'su' ? '该患者没有包含糖尿病的就诊!' : mode === 'blood' ? '该患者没有在血液相关科室的就诊!' : '';

        let classicFromDoc = this.getClassicFromDoc(settingName);
        let allDatas = datas.filter(data => {
          if (mode === 'su') {
            if (data.diagnoseInfo) {
              // 对诊断排序
              data.diagnoseInfo.sort(function (a, b) {
                let anum = 0,
                  bnum = 0;
                if (a.diagnoseName.indexOf('糖尿病') > -1) {
                  a.highLight = true;
                  anum = -1;
                }
                if (b.diagnoseName.indexOf('糖尿病') > -1) {
                  b.highLight = true;
                  bnum = -1;
                }
                return anum - bnum;
              });
            }
            return (
              (data.diagnoseInfo && data.diagnoseInfo.filter(di => di.diagnoseName.indexOf('糖尿病') > -1).length) || classicFromDoc.includes(data.hdcEncId)
            );
          } else if (mode === 'blood') {
            return this.bloodDeptCode.includes(data.encDeptCode) || classicFromDoc.includes(data.hdcEncId);
          } else {
            return false;
          }
        });
        let filtedDatas = datas.filter(data => {
            if (mode === 'su') {
              return data.diagnoseInfo && data.diagnoseInfo.filter(di => di.diagnoseName.indexOf('糖尿病') > -1).length;
            } else if (mode === 'blood') {
              return this.bloodDeptCode.includes(data.encDeptCode);
            } else {
              return false;
            }
          }),
          selectedFromDocs = datas.filter(data => classicFromDoc.includes(data.hdcEncId)),
          len = allDatas.length;
        let encs = {
          viewModeEncs: [],
          docSelectEncs: []
        };
        if (filtedDatas.length) {
          let viewModeEncs = filtedDatas.map(d => d.hdcEncId);
          encs.viewModeEncs = viewModeEncs;
        }
        if (selectedFromDocs.length) {
          let docSelectEncs = selectedFromDocs.map(d => d.hdcEncId);
          encs.docSelectEncs = docSelectEncs;
        }
        this.encs = encs;
        if (filtedDatas.length) {
          statisticVisits.call(this, allDatas);
          res.data = allDatas.filter((d, i) => i < pageMax && i >= pageMin);
          res.recordsTotal = len;
        } else {
          Message({
            message: msg,
            type: 'warning'
          });
          res.data = null;
          this.$store.commit('SET_VIEWMODE', this.currentViewMode || 'normal');
        }
        return res;
      }
      function statisticVisits(datas) {
        let allType = this.allType;
        allType.forEach(type => {
          type.visitCount = datas.filter(d => {
            let flag = type.codes.includes(d.encTypeCode);
            return flag;
          }).length;
        });
        console.log(allType);
        // this.allType = allType;
      }
    },
    // 获取就诊请求参数
    getParam() {
      let encounterInfo = getEncounterInfo.bind(this)();
      let param = { page: this.selectedPage, encounterInfo };
      if (this.viewMode === 'normal') {
        // param.rows = this.frequency;
        param.rows = 9999;
        param.hdcEncId = this.$store.state.lcjz_encIds.join('||');
      } else if (this.viewMode === 'su') {
        param.rows = 9999;
        param.page = 1;
      } else if (this.viewMode === 'blood') {
        param.rows = 9999;
        param.page = 1;
      }
      return param;

      function getEncounterInfo() {
        let encounterInfo = {},
          encTypeCode = [],
          codes = this.encTypeCode;
        // codes.forEach(code => {
        //   code.forEach(c => {
        //     encTypeCode.push(c);
        //   });
        // });
        encTypeCode = this.arrFlatened(codes);
        encounterInfo.encTypeCode = encTypeCode;
        return encounterInfo;
      }
    },
    // 获取医生选择的该病人的要作为参考的就诊
    getClassicFromDoc(settingName) {
      let resu = [];
      let _setting = this.getFromLocalSetting(settingName);
      let selectedClassic = _setting ? _setting.selectedClassic : null;
      if (_setting && selectedClassic) {
        let arr = _setting.selectedClassic.filter(ite => ite.hdcId === this.$store.state.hdcId);
        if (arr.length) resu = arr[0].docSelectEncs;
      }
      return resu;
    },

    toJCST(hosEncId) {
      sessionStorage.setItem('HosVisitNumber', hosEncId);
      console.log(setting.jcsturl);
      // window.open(setting.jcsturl);
    },
    handlePrev() {
      let page = this.selectedPage,
        min = 1;
      page = page > min ? page - 1 : 1;
      this.selectedPage = page;
    },
    handleNext() {
      let page = this.selectedPage,
        max = this.selectPages;
      page = page < max ? page + 1 : max;
      this.selectedPage = page;
    },
    // 确认翻页按钮状态
    checkTurnPageButton() {
      if (this.selectedPage === 1) this.prevDisabled = true;
      else this.prevDisabled = false;
      if (this.selectedPage === this.selectPages) this.nextDisabled = true;
      else this.nextDisabled = false;
    },
    /* 工具方法 */
    // 数组扁平化 eg [[],[]]
    arrFlatened(deptArr) {
      let flatArr = []; // 扁平的数组
      deptArr.forEach(item => {
        if (item instanceof Array) {
          let againFlatArr = this.arrFlatened(item); // 再次经过扁平化的数组
          againFlatArr.forEach(aga => {
            flatArr.push(aga);
          });
        } else {
          flatArr.push(item);
        }
      });
      return flatArr;
    },
    arrUnique(rawArr) {
      return rawArr;
    }
    /* -- 工具方法 -- */
  }
};
</script>
<style lang="scss">
@import './tl-visit.scss';
</style>
