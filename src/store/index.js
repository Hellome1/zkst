import dayjs from 'dayjs';
import Vue from 'vue';
import Vuex from 'vuex';
import globalSetting from './globalSetting';
import patientInfo from './patientInfo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hosCode: '', //院区代码
    hosRegNo: '08968721', //his登记号
    hosEncId: '', //his就诊号
    hdcId: '', //平台患者主索引
    hdcRegNo: '', //平台登记号
    hdcEncId: '', //平台就诊号
    encIds: [], //时间轴就诊记录集-平台
    hosEncIds: [], //时间轴就诊记录集-his
    lcjz_encIds: [], // 历次就诊选中hdcEncId
    SYS: '', // 系统代码 -- login
    uname: '', // 用户名 -- login
    role: '', // 角色 -- login
    loopInfoStore: null, // 闭环信息
    detailInfo: null, // label详情
    encStartDates: [], // 就诊开始时间 - 用于用药时间轨迹
    encEndDates: [], // 就诊结束时间 - 用于重要指标
    visitsInfo: [], // 就诊信息
    viewMode: 'normal' // 视图模式 有普通，糖尿病，血液
  },
  mutations: {
    set_common(state, common) {
      state.hosCode = common.hosCode;
      state.hosRegNo = common.hosRegNo;
      state.hosEncId = common.hosEncId;
      state.hdcId = common.hdcId;
      state.hdcRegNo = common.hdcRegNo;
      state.hdcEncId = common.hdcEncId;
      state.SYS = common.SYS;
      state.uname = common.uname;
      state.role = common.role;
    },
    set_encIds(state, encIds) {
      state.encIds = encIds;
    },
    set_hosEncIds(state, hosEncIds) {
      state.hosEncIds = hosEncIds;
    },
    SET_HOSREGNO(state, payload) {
      state.hosRegNo = payload;
    },
    lcjz_set_encIds(state, lcjz_encIds) {
      state.lcjz_encIds = lcjz_encIds;
    },
    SET_LOOPINFOSTORE(state, payload) {
      state.loopInfoStore = payload;
    },
    SWITCH_LOOP_SHOW(state, payload) {
      state.loopInfoStore.show = payload;
    },
    SET_DETAILINFO(state, payload) {
      state.detailInfo = payload;
    },
    SWITCH_DETAIL_SHOW(state, payload) {
      state.detailInfo.show = payload;
    },
    set_encStartDates(state, payload) {
      state.encStartDates = payload;
    },
    set_encEndDates(state, payload) {
      state.encEndDates = payload;
    },
    SET_VISITSINFO(state, payload) {
      state.visitsInfo = payload;
    },
    SET_VIEWMODE(state, payload) {
      state.viewMode = payload;
    }
  },
  actions: {},
  modules: {
    globalSetting,
    patientInfo
  }
});
