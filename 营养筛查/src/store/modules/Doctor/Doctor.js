//其它界面功能
export default {
  namespaced: true,
  state: {
    cab:"",
    nutritionreference: "",
    planNutritionList: [],
    modifyProductList:[],
    prescriptionsourcetype: 0,
    proportion: {}
  },
  mutations: {
    //vuex保存数据
    Doctor(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.Doctor;
    },
    cab(state, res) {
      state.cab = res;
    },
    nutritionreference(state, res) {
      state.nutritionreference = res;
    },
    planNutritionList(state, res) {
      state.planNutritionList = res;
    },
    cabNum(state, res) {
      state.cabNum = res;
    },
    /**
     * 营养师修改的处方单缓存数据,提交修改时候清空
     * **/
    modifyProductList(state,res) {
      state.modifyProductList = res
    },
    prescriptionsourcetype(state,res) {
      state.prescriptionsourcetype = res
    },
    proportion(state,res) {
      state.proportion = res
    }
  },
  actions: {},
  getters: {}
};
