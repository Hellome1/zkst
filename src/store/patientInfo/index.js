export default {
  state: {
    name: '',
    age: 0,
    gender: ''
  },
  mutations: {
    SET_PATIENTINFO(state, payload) {
      payload.name && (state.name = payload.name);
      payload.age && (state.age = payload.age);
      payload.gender && (state.gender = payload.gender);
    }
  }
};
