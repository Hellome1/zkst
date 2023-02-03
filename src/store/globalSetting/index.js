export default {
  state: {
    setting: null // 全局配置
  },
  mutations: {
    SET_SETTING(state, payload) {
      state.setting = payload;
    }
  }
};
