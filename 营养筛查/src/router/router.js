import Vue from "vue";
import Router from "vue-router";
import wx from "weixin-js-sdk";

/****************************** 田东 **********************************/

// 新增营养成品
const productsListSearchAdd = () =>
  import(
    /* webpackChunkName: "productsListSearchAdd" */ "../pages/doctor/productsListSearchAdd.vue"
  );
// 产品详情
const productDetails = () =>
  import(
    /* webpackChunkName: "productDetails" */ "../pages/doctor/productDetails.vue"
  );
// 患者信息填写
const inputPerson = () =>
  import(
    /* webpackChunkName: "inputPerson" */ "../pages/doctor/inputPerson.vue"
  );
// 营养风险筛查1
const nutritionalRisk = () =>
  import(
    /* webpackChunkName: "nutritionalRisk" */ "../pages/doctor/nutritionalRisk.vue"
  );

// 营养风险筛查结果——正常
const riskScreening = () =>
  import(
    /* webpackChunkName: "riskScreening" */ "../pages/doctor/riskScreening.vue"
  );
// 营养风险筛查结果
const screeningResult = () =>
  import(
    /* webpackChunkName: "screeningResult" */ "../pages/doctor/screeningResult.vue"
  );
// 营养风险筛查总评分
const nutritionalRiskTotalScore = () =>
  import(
    /* webpackChunkName: "nutritionalRiskTotalScore" */ "../pages/doctor/nutritionalRiskTotalScore.vue"
  );
// 营养风险筛查2
const nutritionalRiskScreening = () =>
  import(
    /* webpackChunkName: "nutritionalRiskScreening" */ "../pages/doctor/nutritionalRiskScreening.vue"
  );
const nutritionalRiskScreeningDetails = () =>
  import(
    /* webpackChunkName: "nutritionalRiskScreeningDetails" */ "../pages/doctor/nutritionalRiskScreeningDetails.vue"
  );

const ProductSearch = () =>
  import(
    /* webpackChunkName: "ProductSearch" */ "../pages/doctor/ProductSearch.vue"
  );

const orderList = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/orderList.vue");

const orderDetail = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/orderDetail.vue");

const shipmentCode = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/shipmentCode.vue");
const confirmOrder = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/confirmOrder.vue");
const placeOrder = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/placeOrder.vue");
const orderReport = () =>
  import(/* webpackChunkName: "order" */ "../pages/patient/orderReport.vue");

const resultsx = () =>
  import(/* webpackChunkName: "resultsx" */ "../pages/patient/resultsx.vue");
const results = () =>
  import(/* webpackChunkName: "results" */ "../pages/doctor/results.vue");
const code = () =>
  import(/* webpackChunkName: "code" */ "../pages/doctor/code.vue");
const audit = () =>
  import(/* webpackChunkName: "audit" */ "../pages/doctor/audit.vue");
const diagnosis = () =>
  import(/* webpackChunkName: "diagnosis" */ "../pages/doctor/diagnosis.vue");
const his_report = () =>
  import(/* webpackChunkName: "his_report" */ "../pages/doctor/his_report.vue");
const cabinet = () =>
  import(/* webpackChunkName: "cabinet" */ "../pages/doctor/cabinet.vue");
const details = () =>
  import(/* webpackChunkName: "details" */ "../pages/doctor/details.vue");

//张松仁
//营养个体化方案(能量需求)
const energyRequirement = () =>
  import(
    /* webpackChunkName: "energyRequirement" */ "../pages/doctor/energyRequirement.vue"
  );
//营养个体化方案(筛查参考)
const screeningReference = () =>
  import(
    /* webpackChunkName: "screeningReference" */ "../pages/doctor/screeningReference.vue"
  );
//营养个体化方案(筛查参考)
const screeningReferenceGo = () =>
  import(
    /* webpackChunkName: "screeningReferenceGo" */ "../pages/doctor/screeningReferenceGo.vue"
  );
//营养个体化方案(筛查参考)
const selectionScheme = () =>
  import(
    /* webpackChunkName: "selectionScheme" */ "../pages/doctor/selectionScheme.vue"
  );
//营养个体化方案(所需营养筛选)
const needNutrition = () =>
  import(
    /* webpackChunkName: "needNutrition" */ "../pages/doctor/needNutrition.vue"
  );
//选择医生
const selectDoctor = () =>
  import(
    /* webpackChunkName: "selectDoctor" */ "../pages/doctor/selectDoctor.vue"
  );
//医生待处理报告页
const screeningReportDoc = () =>
  import(
    /* webpackChunkName: "screeningReportDoc" */ "../pages/doctor/screeningReportDoc.vue"
  );
//医生报告页
const pendingReport = () =>
  import(/* webpackChunkName: "report" */ "../pages/doctor/pendingReport.vue");
//医生直接拟定方案页
const selectIllness = () =>
  import(/* webpackChunkName: "report" */ "../pages/doctor/selectIllness.vue");
//报告领取
const getReport = () =>
  import(/* webpackChunkName: "getReport" */ "../pages/patient/getReport.vue");
//选择领取报告的类型
const selectReportType = () =>
import(/* webpackChunkName: "getReport" */ "../pages/patient/selectReportType.vue");
//end
// 未绑定智配柜
const unBound = () =>
  import(
    /* webpackChunkName: "nutritionalRisk" */ "../pages/doctor/unBound.vue"
  );
//患者筛查报告页
const screeningReport = () =>
  import(
    /* webpackChunkName: "screeningReport" */ "../pages/patient/screeningReport.vue"
  );
/**************************************************************** 魏雪源 **************************************************************/
//微量元素检测评定
const TraceelementsEvaluation = () =>
  import(
    /* webpackChunkName: "TraceelementsEvaluation" */ "../pages/doctor/TraceelementsEvaluation.vue"
  );
//血液生化检测评定
const BloodBiochemistry = () =>
  import(
    /* webpackChunkName: "BloodBiochemistry" */ "../pages/doctor/BloodBiochemistry.vue"
  );
//尿液生化检测评定
const UrineBiochemistry = () =>
  import(
    /* webpackChunkName: "UrineBiochemistry" */ "../pages/doctor/UrineBiochemistry.vue"
  );
//营养诊断结果
const NutritionalDiagnosis = () =>
  import(
    /* webpackChunkName: "NutritionalDiagnosis" */ "../pages/doctor/NutritionalDiagnosis.vue"
  );
//营养诊断项目
const NutritionPrograms = () =>
  import(
    /* webpackChunkName: "NutritionPrograms" */ "../pages/doctor/NutritionPrograms.vue"
  );
//SGA营养评定等级
const SGAresult = () =>
  import(/* webpackChunkName: "SGAresult" */ "../pages/doctor/SGAresult.vue");
//SGA综合评估结果
const SGAEvaluateResults = () =>
  import(
    /* webpackChunkName: "SGAEvaluateResults" */ "../pages/doctor/SGAEvaluateResults.vue"
  );
//SGA综合评估
const SGAComprehensiveEvaluation = () =>
  import(
    /* webpackChunkName: "SGAComprehensiveEvaluation" */ "../pages/doctor/SGAComprehensiveEvaluation.vue"
  );
//微量元素检测结果
const TraceResults = () =>
  import(
    /* webpackChunkName: "TraceResults" */ "../pages/doctor/TraceResults.vue"
  );
//血液生化检测结果
const BloodResults = () =>
  import(
    /* webpackChunkName: "BloodResults" */ "../pages/doctor/BloodResults.vue"
  );
//尿液生化检测评定结果
const UrineResult = () =>
  import(
    /* webpackChunkName: "UrineResult" */ "../pages/doctor/UrineResult.vue"
  );

// 营养师部分
const examineList = () =>
  import(
    /* webpackChunkName: "dietitian" */ "../pages/dietitian/examineList.vue"
  );

const examineDetail = () =>
  import(
    /* webpackChunkName: "dietitian" */ "../pages/dietitian/examineDetail.vue"
  );

const modifyProducts = () =>
  import(
    /* webpackChunkName: "dietitian" */ "../pages/dietitian/modifyProducts.vue"
  );

const productsListSearch = () =>
  import(
    /* webpackChunkName: "dietitian" */ "../pages/dietitian/productsListSearch.vue"
  );

const selectPhone = () =>
  import(
    /* webpackChunkName: "screeningReport" */ "../pages/doctor/selectPhone.vue" //选择患者是智能机还是非智能机
  );


//v1.9.10新增线下付款订单
// payCancel 取消支付 提醒线下支付
const payCancel= () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/patient/payCancel"
    );

// submitOfflineOrder 下线订单提交
const submitOfflineOrder = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/patient/submitOfflineOrder"
    );

// payTip 线下订单提交成功提示
const payTip = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/patient/payTip"
    );


Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/inputPerson",
      name: "inputPerson",
      component: inputPerson
    },
    {
      path: "/selectPhone",
      name: "selectPhone",
      component: selectPhone
    },
    {
      path: "/selectPhone",
      name: "selectPhone",
      component: selectPhone
    },
    {
      path: "/",
      name: "selectDoctor",
      component: selectDoctor
    },
    {
      path: "/nutritionalRisk",
      name: "nutritionalRisk",
      component: nutritionalRisk
    },
    {
      path: "/riskScreening",
      name: "riskScreening",
      component: riskScreening
    },
    {
      path: "/screeningResult",
      name: "screeningResult",
      component: screeningResult
    },
    {
      path: "/nutritionalRiskTotalScore",
      name: "nutritionalRiskTotalScore",
      component: nutritionalRiskTotalScore
    },
    {
      path: "/nutritionalRiskScreening",
      name: "nutritionalRiskScreening",
      component: nutritionalRiskScreening
    },
    {
      path: "/nutritionalRiskScreeningDetails",
      name: "nutritionalRiskScreeningDetails",
      component: nutritionalRiskScreeningDetails
    },
    {
      path: "/productDetails",
      name: "productDetails",
      component: productDetails
    },
    {
      path: "/productsListSearchAdd",
      name: "productsListSearchAdd",
      component: productsListSearchAdd
    },
    {
      path: "/",
      redirect: "/helloWorld"
    },

    // ----------------------order-----------------------------------------
    {
      path: "/orderList",
      name: "orderList",
      component: orderList
    },

    {
      path: "/orderDetail",
      name: "orderDetail",
      component: orderDetail
    },

    {
      path: "/shipmentCode",
      name: "shipmentCode",
      component: shipmentCode
    },

    {
      path: "/orderReport",
      name: "orderReport",
      component: orderReport
    },

    {
      path: "/confirmOrder",
      name: "confirmOrder",
      component: confirmOrder
    },

    {
      path: "/placeOrder",
      name: "placeOrder",
      component: placeOrder
    },

    //===============xp===========

    {
      path: "/results",
      name: "results",
      component: results
    },
    {
      path: "/resultsx",
      name: "resultsx",
      component: resultsx
    },
    {
      path: "/code",
      name: "code",
      component: code
    },
    {
      path: "/audit",
      name: "audit",
      component: audit
    },
    {
      path: "/diagnosis",
      name: "diagnosis",
      component: diagnosis
    },
    {
      path: "/his_report",
      name: "his_report",
      component: his_report
    },
    {
      path: "/cabinet",
      name: "cabinet",
      component: cabinet
    },
    //营养诊断结果
    {
      path: "/details",
      name: "details",
      component: details
    },
    //=============over================
    /*******************************************************wxy********************************************************/
    {
      path: "/ProductSearch",
      name: "ProductSearch",
      component: ProductSearch
    },
    //微量元素检测评定
    {
      path: "/TraceelementsEvaluation",
      name: "TraceelementsEvaluation",
      component: TraceelementsEvaluation
    },
    //血液生化检测评定
    {
      path: "/BloodBiochemistry",
      name: "BloodBiochemistry",
      component: BloodBiochemistry
    },
    //尿液生化检测评定
    {
      path: "/UrineBiochemistry",
      name: "UrineBiochemistry",
      component: UrineBiochemistry
    },
    //营养诊断结果
    {
      path: "/NutritionalDiagnosis",
      name: "NutritionalDiagnosis",
      component: NutritionalDiagnosis
    },
    //营养诊断项目
    {
      path: "/NutritionPrograms",
      name: "NutritionPrograms",
      component: NutritionPrograms
    },
    //SGA营养评定等级
    {
      path: "/SGAresult",
      name: "SGAresult",
      component: SGAresult
    },
    //SGA综合评估结果
    {
      path: "/SGAEvaluateResults",
      name: "SGAEvaluateResults",
      component: SGAEvaluateResults
    },
    //SGA综合评估
    {
      path: "/SGAComprehensiveEvaluation",
      name: "SGAComprehensiveEvaluation",
      component: SGAComprehensiveEvaluation
    },
    //微量元素检测结果
    {
      path: "/TraceResults",
      name: "TraceResults",
      component: TraceResults
    },
    //血液生化检测结果
    {
      path: "/BloodResults",
      name: "BloodResults",
      component: BloodResults
    },
    //尿液生化检测评定结果
    {
      path: "/UrineResult",
      name: "UrineResult",
      component: UrineResult
    },
    /******************************************************************************************************************/
    //张松仁
    {
      path: "/energyRequirement",
      name: "energyRequirement",
      component: energyRequirement
    },
    {
      path: "/screeningReference",
      name: "screeningReference",
      component: screeningReference
    },
    {
      path: "/screeningReferenceGo",
      name: "screeningReferenceGo",
      component: screeningReferenceGo
    },
    {
      path: "/selectionScheme",
      name: "selectionScheme",
      component: selectionScheme
    },
    {
      path: "/needNutrition",
      name: "needNutrition",
      component: needNutrition
    },
    {
      path: "/unBound",
      name: "unBound",
      component: unBound
    },
    {
      path: "/screeningReport",
      name: "screeningReport",
      component: screeningReport
    },
    {
      path: "/pendingReport",
      name: "pendingReport",
      component: pendingReport
    },
    {
      path: "/screeningReportDoc",
      name: "screeningReportDoc",
      component: screeningReportDoc
    },
    {
      path: "/selectPhone",
      name: "selectPhone",
      component: selectPhone
    },
    // 营养师部分路由
    {
      path: "/examineList",
      name: "examineList",
      component: examineList
    },
    {
      path: "/examineDetail",
      name: "examineDetail",
      component: examineDetail
    },
    {
      path: "/modifyProducts",
      name: "modifyProducts",
      component: modifyProducts
    },
    {
      path: "/productsListSearch",
      name: "productsListSearch",
      component: productsListSearch
    },
    {
      path: "/selectIllness",
      name: "selectIllness",
      component: selectIllness
    },
    {
      path: "/getReport",
      name: "getReport",
      component: getReport
    },
    {
      path: "/selectReportType",
      name: "selectReportType",
      component: selectReportType
    },
    {
      path: "/payCancel",
      name: "payCancel",
      component: payCancel
    },    {
      path: "/submitOfflineOrder",
      name: "submitOfflineOrder",
      component: submitOfflineOrder
    },    {
      path: "/payTip",
      name: "payTip",
      component: payTip
    },
    //end
  ]
});
router.beforeEach((to, from, next) =>{

  console.log(from.name);
  console.log(to.name);
  // console.log(next);
  // if (from.name == null) {
  //   //第一次进入项目
  // }
  if (
    from.name =="diagnosis" &&
    to.name != "results" &&
    (window.sessionStorage.getItem("auditStatus") == "1" ||  window.sessionStorage.getItem("auditStatus") == "3" ||  (window.sessionStorage.getItem("auditStatus") == "5" && to.name !== "ProductSearch")) &&
    to.name !== "pendingReport" &&
    to.name !== "code" &&
    to.name !== "screeningReferenceGo"
  ) {
    wx.closeWindow();
  } else {
    next();
  }
})
export default router;
