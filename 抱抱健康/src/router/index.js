import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

/*
 * @name 医生端路由
 * @Author: suoxh
 */
//////////////////////////////复诊功能////////////////////////////

const initDiagnoseReminder = () =>
  import(
    /* webpackChunkName: "initDiagnoseReminder" */ "../pages/Doctor/returnVisit/initDiagnoseReminder.vue"
    );

const returnVisit = () =>
  import(
    /* webpackChunkName: "diagnoseReminder" */ "../pages/Doctor/returnVisit/returnVisit.vue"
    );
const returnVisitSearch = () =>
  import(
    /* webpackChunkName: "diagnoseReminder" */ "../pages/Doctor/returnVisit/returnVisitSearch.vue"
    );
const returnVisitDetails = () =>
  import(
    /* webpackChunkName: "diagnoseReminder" */ "../pages/Doctor/returnVisit/returnVisitDetails.vue"
    );

///////////////////////////////////////注册部分////////////////////////////////////////////////////
const docRegister = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/docRegister.vue"
    );
const infoID = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/infoID.vue"
    );
const selectOffice = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/selectOffice.vue"
    );
const secondOffice = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/secondOffice.vue"
    );
const confirmHospital = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/confirmHospital.vue"
    );
const searchCity = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/searchCity.vue"
    );
const searchCityAgain = () =>
  import(
    /* webpackChunkName: "docRegister" */ "../pages/Doctor/docRegister/searchCityAgain.vue"
    );
/////////////////////////////////////医生审核状态////////////////////////////////////////////
const auditorFail = () =>
  import(
    /* webpackChunkName: "docAuditor" */ "../pages/Doctor/docAuditor/auditorFail.vue"
    );
const auditorSuccess = () =>
  import(
    /* webpackChunkName: "docAuditor" */ "../pages/Doctor/docAuditor/auditorSuccess.vue"
    );
const testing = () =>
  import(
    /* webpackChunkName: "docAuditor" */ "../pages/Doctor/docAuditor/testing.vue"
    );
const focusAccount = () =>
  import(
    /* webpackChunkName: "docAuditor" */ "../pages/Doctor/docAuditor/focusAccount.vue"
    );
/////////////////////////////////////医生首页////////////////////////////////////////////
const docHome = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docHome.vue"
    );
const docArticlesSearch = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Doctor/articles/articlesSearch.vue"
    );
const docArticlesSearchWater = () =>
  import(
    /* webpackChunkName: "docArticlesSearchWater" */ "../pages/Doctor/articles/articlesSearchWater.vue"
    );
const docArticlesSearchAgain = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Doctor/articles/articlesSearchAgain.vue"
    );
const docArticlesSearchAgainWater = () =>
  import(
    /* webpackChunkName: "docArticlesSearchAgainWater" */ "../pages/Doctor/articles/articlesSearchAgainWater.vue"
    );
const docArticlesDetail = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Doctor/articles/articleDetail.vue"
    );
const docArticlesList = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Doctor/articles/articlesList.vue"
    );

const docCard = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docCard.vue"
    );
const docCardStatic = () =>
  import(
    /* webpackChunkName: "docCardStatic" */ "../pages/Doctor/docHome/docCardStatic.vue"
    );
const docDepartmentCard = () =>
  import(
    /* webpackChunkName: "docDepartmentCard" */ "../pages/Doctor/docHome/docDepartmentCard.vue"
    );
const docNoPermission = () =>
  import(
    /* webpackChunkName: "docNoPermission" */ "../pages/Doctor/docHome/docNoPermission.vue"
    );
const docDownloadCard = () =>
  import(
    /* webpackChunkName: "docDownloadCard" */ "../pages/Doctor/docHome/docDownloadCard.vue"
    );

const docCardStyleCheck = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docCardStyleCheck.vue"
    );

const docGroupList = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docGroupList.vue"
    );

const docGroupDetail = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docGroupDetail.vue"
    );

const docGroupCard = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docGroupCard.vue"
    );

const docGroupCardMessage = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docGroupCardMessage.vue"
    );

const modifyDocGroupMessage = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/modifyDocGroupMessage.vue"
    );

const createDocGroupFirst = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/createDocGroupFirst.vue"
    );

const modifyDoctorGroupName = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/modifyDoctorGroupName.vue"
    );

const editIntro = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/editIntro.vue"
    );

const docDetail = () =>
  import(
    /* webpackChunkName: "docHome" */ "../pages/Doctor/docHome/docDetail.vue"
    );

/////////////////////////////////////IM聊天////////////////////////////////////////////
// suoxh
const docIMaddFriend = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docIMaddFriend.vue"
    );
//医患团队医生信息（有用）
const docIMCardDetail = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docIMCardDetail.vue"
    );

//医生聊天今日任务
const docPatientTask = () =>
  import(
    /* webpackChunkName: "task" */ "../pages/Doctor/task/docPatientTask.vue"
    );

//医生患者一对一聊天
const docChatIMDetail = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docChatIMDetail.vue"
    );
//
//医生患者一对一聊天的患者信息
const docIMPatientInfo = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docIMPatientInfo.vue"
    );
//医生患者一对一聊天的患者具体名片信息
const docPatientInfo = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docPatientInfo.vue"
    );

//编辑备注
const docIMEditRemark = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docIMEditRemark.vue"
    );
//付费咨询回复
const submitAdvise = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/submitAdvise.vue"
    );
//调查问卷展示
const docGetQuestionnaire = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docGetQuestionnaire.vue"
    );

//医患团队会话设置
const docIMSettings = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docIMSettings.vue"
    );
//刘硕
//聊天首页
const docChatIMList = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docChatIMList.vue"
    );
//小组团队
const docChatGroup = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docChatGroup.vue"
    );
//搜索可添加成员
const docSearchGroupPerson = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docSearchGroupPerson.vue"
    );
//搜索列表
const docSearchPerson = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docSearchPerson.vue"
    );
//添加分组成员
const docAddGroupPerson = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docAddGroupPerson.vue"
    );
//维护小组成员
const docSelectGroup = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docSelectGroup.vue"
    );
//创建医疗小组
const docCreateGroup = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docCreateGroup.vue"
    );
//聊天列表添加成员
const docAddChatGroupPerson = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docAddChatGroupPerson.vue"
    );
//聊天列表添加成员 搜索页面
const docSearchChatGroupPerson = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docSearchChatGroupPerson.vue"
    );
const docChangeGroupName = () =>
  import(
    /* webpackChunkName: "docIM" */ "../pages/Doctor/docIM/docChangeGroupName.vue"
    );
const docListQRCode = () =>
  import(
    /* webpackChunkName: "docVendingSystem" */ "../pages/Doctor/docVendingSystem/docListQRCode.vue"
    );
const docProductList = () =>
  import(
    /* webpackChunkName: "docVendingSystem" */ "../pages/Doctor/docVendingSystem/docProductList.vue"
    );
const docCheckProductList = () =>
  import(
    /* webpackChunkName: "docCheckProductList" */ "../pages/Doctor/docVendingSystem/docCheckProductList.vue"
    );
const selectMachine = () =>
  import(
    /* webpackChunkName: "docVendingSystem" */ "../pages/Doctor/docVendingSystem/selectMachine.vue"
    );

const docSelectDrugs = () =>
  import(
    /* webpackChunkName: "docSelectDrugs" */ "../pages/Doctor/docPrescribe/docSelectDrugs.vue"
    );
const docDrugsList = () =>
  import(
    /* webpackChunkName: "docDrugsList" */ "../pages/Doctor/docPrescribe/docDrugsList.vue"
    );
const docCheckDrugsList = () =>
  import(
    /* webpackChunkName: "docCheckDrugsList" */ "../pages/Doctor/docPrescribe/docCheckDrugsList.vue"
    );
const productDetails = () =>
  import(
    /* webpackChunkName: "productDetails" */ "../pages/Doctor/docPrescribe/productDetails.vue"
    );
const selectMachineIM = () =>
  import(
    /* webpackChunkName: "selectMachineIM" */ "../pages/Doctor/docPrescribe/selectMachineIM.vue"
    );
const docPlanProductList = () =>
  import(
    /* webpackChunkName: "docPlanProductList" */ "../pages/Doctor/docPrescribe/docPlanProductList.vue"
    );
const selectIllness = () =>
  import(
    /* webpackChunkName: "selectIllness" */ "../pages/Doctor/docPrescribe/selectIllness.vue"
    );
const selectionScheme = () =>
  import(
    /* webpackChunkName: "selectionScheme" */ "../pages/Doctor/docPrescribe/selectionScheme.vue"
    );
const productsListSearchAdd = () =>
  import(
    /* webpackChunkName: "productsListSearchAdd" */ "../pages/Doctor/docPrescribe/productsListSearchAdd.vue"
    );


/**
 *@desc  患者端路由
 *@author houpai
 *@date 2019/07/04 13:53:20
 */

// questionnaireDetail 问卷详情
const questionnaireDetail = () =>
  import(
    /* webpackChunkName: "task" */ "../pages/Patient/task/questionnaireDetail.vue"
    );

// chatIMListSearch 患者聊天搜索
const chatIMListSearch = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/chatIMListSearch.vue"
    );

// updateRemark 修改医生备注
const updateRemark = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/updateRemark.vue"
    );

// doctorTeamSearch 医疗团队搜索
const doctorTeamSearch = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/doctorTeamSearch.vue"
    );

// doctorMessage 医生信息
const doctorMessage = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/doctorMessage.vue"
    );

// chatIMSettings 会话成员列表
const chatIMSettings = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/chatIMSettings.vue"
    );

// chatIMDetail 患者IM聊天详情
const chatIMDetail = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/chatIMDetail.vue"
    );

// patientRegister 患者注册
const patientRegister = () =>
  import(
    /* webpackChunkName: "patientRegister" */ "../pages/Patient/patientRegister/patientRegister.vue"
    );

// patientRegister 患者注册成功提示页
const patientRegisterSuccess = () =>
  import(
    /* webpackChunkName: "patientRegister" */ "../pages/Patient/patientRegister/patientRegisterSuccess.vue"
    );

// agreenment 用户协议
const agreement = () =>
  import(
    /* webpackChunkName: "agreement" */ "../components/agreement/agreement.vue"
    );

// chooseDisease 患者选择疾病
const chooseDisease = () =>
  import(
    /* webpackChunkName: "chooseDisease" */ "../pages/Patient/chooseDisease/chooseDisease.vue"
    );

// chooseDiseaseAgain 患者选择疾病期数
const chooseDiseaseAgain = () =>
  import(
    /* webpackChunkName: "chooseDisease" */ "../pages/Patient/chooseDisease/chooseDiseaseAgain.vue"
    );

// patientHome 患者首页
const patientHome = () =>
  import(
    /* webpackChunkName: "patientHome" */ "../pages/Patient/patientHome/patientHome.vue"
    );

// articlesSearch 患者文章搜索页
const articlesSearch = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Patient/articles/articlesSearch.vue"
    );

const articlesSearchAgain = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Patient/articles/articlesSearchAgain.vue"
    );

// personalCenter 患者个人中心
const personalCenter = () =>
  import(
    /* webpackChunkName: "personalCenter" */ "../pages/Patient/personalCenter/personalCenter.vue"
    );

// chatIMList 患者个人中心
const chatIMList = () =>
  import(
    /* webpackChunkName: "PatientIM" */ "../pages/Patient/PatientIM/chatIMList.vue"
    );

// patientTask 患者任务
const patientTask = () =>
  import(
    /* webpackChunkName: "task" */ "../pages/Patient/task/patientTask.vue"
    );

// patientMessageComplete 患者完善信息
const patientMessageComplete = () =>
  import(
    /* webpackChunkName: "patientRegister" */ "../pages/Patient/patientRegister/patientMessageComplete"
    );

// articleDetail 文章详情
const articleDetail = () =>
  import(
    /* webpackChunkName: "articles" */ "../pages/Patient/articles/articleDetail"
    );

// diseaseMessage 疾病详情
const diseaseMessage = () =>
  import(/* webpackChunkName: "task" */ "../pages/Patient/task/diseaseMessage");

// productArticleList 产品推荐文章列表页
const productArticleList = () =>
  import(
    /* webpackChunkName: "task" */ "../pages/Patient/task/productArticleList"
    );

// questionnaire 疾病详情
const questionnaire = () =>
  import(/* webpackChunkName: "task" */ "../pages/Patient/task/questionnaire");

// payAdvisory 付费咨询
const payAdvisory = () =>
  import(
    /* webpackChunkName: "payAdvisory" */ "../pages/Patient/PatientIM/payAdvisory"
    );

// payAdvisoryDetails 付费咨询医生回复
const payAdvisoryDetails = () =>
  import(
    /* webpackChunkName: "payAdvisoryDetails" */ "../pages/Patient/PatientIM/payAdvisoryDetails"
    );

// payAdvisoryDetails 付费咨询医生回复
const orderDetail = () =>
  import(
    /* webpackChunkName: "vendingMachine" */ "../pages/Patient/vendingMachine/orderDetail"
    );

// payAdvisoryDetails 付费咨询医生回复
const ordersList = () =>
  import(
    /* webpackChunkName: "vendingMachine" */ "../pages/Patient/vendingMachine/ordersList"
    );

// payAdvisoryDetails 付费咨询医生回复
const submitOrder = () =>
  import(
    /* webpackChunkName: "vendingMachine" */ "../pages/Patient/vendingMachine/submitOrder"
    );

// payAdvisoryDetails 付费咨询医生回复
const drugsList = () =>
  import(
    /* webpackChunkName: "vendingMachine" */ "../pages/Patient/vendingMachine/drugsList"
    );

// withoutPermission 无权限操作
const withoutPermission = () =>
  import(
    /* webpackChunkName: "withoutPermission" */ "../pages/Patient/vendingMachine/withoutPermission"
    );

// answerByAssistant
const answerByAssistant = () =>
  import(
    /* webpackChunkName: "assistant" */ "../pages/assistant/answerByAssistant"
    );

// assistantIM 小智助手聊天
const assistantIM = () =>
  import(/* webpackChunkName: "assistant" */ "../pages/assistant/assistantIM");

// stewardIM 患者客服IM
const stewardIM = () =>
  import(
    /* webpackChunkName: "stewardIM" */ "../pages/Patient/steward/stewardIM"
    );

// statistics 医生数据统计
const statistics = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/statistics"
    );

// introduce 图文介绍
const introduce = () =>
  import(
    /* webpackChunkName: "introduce" */ "../pages/Patient/steward/introduce"
    );

// market 产品销售统计
const market = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/market"
    );

// illness 产品销售统计
const illness = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/illness"
    );

// history 产品销售统计
const history = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/history"
    );

// consult 产品销售统计
const consult = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/consult"
    );

// statisOrder 产品销售统计
const statisOrder = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/statisOrder"
    );
//authorization 一键授权(未授权)
const authorization = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/authorization"
    );
//hasAuthorization 一键授权(已授权)
const hasAuthorization = () =>
  import(
    /* webpackChunkName: "statistics" */ "../pages/Doctor/statistics/hasAuthorization"
    );
// productList 产品推荐清单
const productList = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/productList"
    );

// payCancel 取消支付 提醒线下支付
const payCancel = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/payCancel"
    );

// submitOfflineOrder 下线订单提交
const submitOfflineOrder = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/submitOfflineOrder"
    );

// payTip 线下订单提交成功提示
const payTip = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/payTip"
    );

// productList 产品推荐清单
const productOrderDetail = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/productOrderDetail"
    );

// productList 产品推荐清单
const productOrderList = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/productOrderList"
    );

// submitProductOrder 确认产品订单
const submitProductOrder = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/productsOrder/submitProductOrder"
    );

// docDepartment 患者查看医生科室名片页
const docDepartment = () =>
  import(
    /* webpackChunkName: "productsOrder" */ "../pages/Patient/docDepartment/docDepartment"
    );

// 患者复诊
const returnVisitP = () =>
  import(
    /* webpackChunkName: "returnVisitP" */ "../pages/Patient/returnVisit/returnVisitP"
    );

// 患者复诊详情
const returnVisitPDetail = () =>
  import(
    /* webpackChunkName: "returnVisitP" */ "../pages/Patient/returnVisit/returnVisitPDetail"
    );

// 患者复诊搜索
const returnVisitPSearch = () =>
  import(
    /* webpackChunkName: "returnVisitP" */ "../pages/Patient/returnVisit/returnVisitPSearch"
    );

// 患者营养推荐
const chooseRecommendationType = () =>
  import(
    /* webpackChunkName: "nutritionRecommendation" */ "../pages/Patient/nutritionRecommendation/chooseRecommendationType"
    );

// 患者营养推荐 --- 主动购买自营产品
const patientSelectdrugs = () =>
  import(
    /* webpackChunkName: "nutritionRecommendation" */ "../pages/Patient/nutritionRecommendation/patientSelectdrugs"
    );

// 患者营养推荐 --- 主动购买自营产品(已选展示)
const patientDrugsList = () =>
  import(
    /* webpackChunkName: "nutritionRecommendation" */ "../pages/Patient/nutritionRecommendation/patientDrugsList"
    );
// 患者营养推荐 --- 主动购买自营产品(已选展示)
const patientProductList = () =>
  import(
    /* webpackChunkName: "nutritionRecommendation" */ "../pages/Patient/nutritionRecommendation/patientProductList"
    );

// 患者营养推荐-- 未绑定医生提示页 ---  v1.13版本新增
const unboundDoctor = () =>
  import(
    /* webpackChunkName: "nutritionRecommendation" */ "../pages/Patient/nutritionRecommendation/unboundDoctor"
    );

// 公众号消息模板跳转使用的文章页
const templateArticle = () =>
  import(
    /* webpackChunkName: "templateArticle" */ "../components/templateArticle/templateArticle"
    );


/**
 *@desc  积分商城路由
 *@author malin
 *@date 2020年1月2日09:32:16
 */
// integralIndex 积分商城首页
const integralIndex = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralIndex"
    );
// integralProductDetail 商品详情
const integralProductDetail = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralProductDetail"
    );
// integralConfirm 确认订单
const integralConfirm = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralConfirm"
    );
// integralOrderList 订单列表
const integralOrderList = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralOrderList"
    );
// integralOrderDetail 订单详情
const integralOrderDetail = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralOrderDetail"
    );
// integralOrderDetail 积分明细
const integralIntegralDetail = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralIntegralDetail"
    );
// integralIntegralExplain 积分说明
const integralIntegralExplain = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralIntegralExplain"
    );
// integralAddressSelect 选择地址
const integralAddressSelect = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralAddressSelect"
    );
// integralAddressUpdate 新增(编辑)地址
const integralAddressUpdate = () =>
  import(
    /* webpackChunkName: "integralShop" */ "../pages/IntegralShop/integralAddressUpdate"
    );


/**
 *@desc  立即抢购路由
 *@author 张松仁
 *@date 2020年2月20日14:00:00
 */
// activityEnd 活动注册页面
const panicRegister = () =>
  import(
    /* webpackChunkName: "PanicBuying" */ "../pages/PanicBuying/panicRegister"
    );
// activityEnd 活动结束页
const activityEnd = () =>
  import(
    /* webpackChunkName: "PanicBuying" */ "../pages/PanicBuying/activityEnd"
    );
// panicBuyingResult 抢购结果页
const panicBuyingResult = () =>
  import(
    /* webpackChunkName: "PanicBuying" */ "../pages/PanicBuying/panicBuyingResult"
    );
// snappedUpImmediately 立即抢购页
const snappedUpImmediately = () =>
  import(
    /* webpackChunkName: "PanicBuying" */ "../pages/PanicBuying/snappedUpImmediately"
    );
// introduceList 疾康知介首页
const introduceList = () =>
  import(
    /* webpackChunkName: "introduce" */ "../pages/IntroductionKnowledge/introduceList"
    );
// introduceList 疾康知介搜索页
const introduceSearch = () =>
  import(
    /* webpackChunkName: "introduce" */ "../pages/IntroductionKnowledge/introduceSearch"
    );
// introduceList 疾康知介详情页
const introduceDetail = () =>
  import(
    /* webpackChunkName: "introduce" */ "../pages/IntroductionKnowledge/introduceDetail"
    );

// payProgress 新增支付中(支付完成)页,用于自营订单、智配柜支付后的展示
const payProgress = () =>
  import(
    /* webpackChunkName: "payProgress" */ "../components/payProgress/payProgress"
    );
Vue.use(Router);
const router = new Router({
  //base: process.env.BASE_URL,
  routes: [
    {
      path: "/initDiagnoseReminder",
      name: "initDiagnoseReminder",
      component: initDiagnoseReminder
    },
    {
      path: "/returnVisit",
      name: "returnVisit",
      component: returnVisit
    },
    {
      path: "/returnVisitSearch",
      name: "returnVisitSearch",
      component: returnVisitSearch
    },
    {
      path: "/returnVisitDetails",
      name: "returnVisitDetails",
      component: returnVisitDetails
    },
    {
      path: "/docDrugsList",
      name: "docDrugsList",
      component: docDrugsList
    },
    {
      path: "/docCheckDrugsList",
      name: "docCheckDrugsList",
      component: docCheckDrugsList
    },
    {
      path: "/docSelectDrugs",
      name: "docSelectDrugs",
      component: docSelectDrugs
    },
    {
      path: "/productDetails",
      name: "productDetails",
      component: productDetails
    },
    {
      path: "/selectMachineIM",
      name: "selectMachineIM",
      component: selectMachineIM
    },
    {
      path: "/docPlanProductList",
      name: "docPlanProductList",
      component: docPlanProductList
    },
    {
      path: "/selectIllness",
      name: "selectIllness",
      component: selectIllness
    },
    {
      path: "/selectionScheme",
      name: "selectionScheme",
      component: selectionScheme
    },
    {
      path: "/productsListSearchAdd",
      name: "productsListSearchAdd",
      component: productsListSearchAdd
    },
    {
      path: "/docListQRCode",
      name: "docListQRCode",
      component: docListQRCode
    },
    //产品列表
    {
      path: "/docProductList",
      name: "docProductList",
      component: docProductList
    },
    {
      path: "/docCheckProductList",
      name: "docCheckProductList",
      component: docCheckProductList
    },
    //产品收藏
    {
      path: "/selectMachine",
      name: "selectMachine",
      component: selectMachine
    },
    //关注公众号
    {
      path: "/focusAccount",
      name: "focusAccount",
      component: focusAccount
    },
    //医生端IM首页
    {
      path: "/docChatIMList",
      name: "docChatIMList",
      component: docChatIMList
    },
    //医生端IM团队小组
    {
      path: "/docChatGroup",
      name: "docChatGroup",
      component: docChatGroup
    },
    //搜索列表
    {
      path: "/docSearchPerson",
      name: "docSearchPerson",
      component: docSearchPerson
    },
    //修改小组名称
    {
      path: "/docChangeGroupName",
      name: "docChangeGroupName",
      component: docChangeGroupName
    },
    //创建医疗小组
    {
      path: "/docCreateGroup",
      name: "docCreateGroup",
      component: docCreateGroup
    },
    //添加医疗小组成员
    {
      path: "/docAddGroupPerson",
      name: "docAddGroupPerson",
      component: docAddGroupPerson
    },
    //
    //添加医疗小组成员
    {
      path: "/docSelectGroup",
      name: "docSelectGroup",
      component: docSelectGroup
    },
    //搜索可添加好友到小组，团队
    {
      path: "/docSearchGroupPerson",
      name: "docSearchGroupPerson",
      component: docSearchGroupPerson
    },
    //聊天列表添加成员
    {
      path: "/docAddChatGroupPerson",
      name: "docAddChatGroupPerson",
      component: docAddChatGroupPerson
    },
    //聊天列表添加成员的搜索
    {
      path: "/docSearchChatGroupPerson",
      name: "docSearchChatGroupPerson",
      component: docSearchChatGroupPerson
    },
    {
      path: "/docRegister",
      name: "docRegister",
      component: docRegister
    },
    {
      path: "/infoID",
      name: "infoID",
      component: infoID
    },
    {
      path: "/selectOffice",
      name: "selectOffice",
      component: selectOffice
    },
    {
      path: "/secondOffice",
      name: "secondOffice",
      component: secondOffice
    },
    {
      path: "/confirmHospital",
      name: "confirmHospital",
      component: confirmHospital
    },
    {
      path: "/searchCity",
      name: "searchCity",
      component: searchCity
    },
    {
      path: "/searchCityAgain",
      name: "searchCityAgain",
      component: searchCityAgain
    },
    {
      path: "/auditorFail",
      name: "auditorFail",
      component: auditorFail
    },
    {
      path: "/auditorSuccess",
      name: "auditorSuccess",
      component: auditorSuccess
    },
    {
      path: "/testing",
      name: "testing",
      component: testing
    },
    {
      path: "/docHome",
      name: "docHome",
      component: docHome
    },
    {
      path: "/docCard",
      name: "docCard",
      component: docCard
    },
    {
      path: "/docCardStatic",
      name: "docCardStatic",
      component: docCardStatic
    },
    {
      path: "/docDepartmentCard",
      name: "docDepartmentCard",
      component: docDepartmentCard
    },
    {
      path: "/docNoPermission",
      name: "docNoPermission",
      component: docNoPermission
    },
    {
      path: "/docDownloadCard",
      name: "docDownloadCard",
      component: docDownloadCard
    },
    {
      path: "/docCardStyleCheck",
      name: "docCardStyleCheck",
      component: docCardStyleCheck
    },
    {
      path: "/docGroupList",
      name: "docGroupList",
      component: docGroupList
    },
    {
      path: "/docGroupDetail",
      name: "docGroupDetail",
      component: docGroupDetail
    },
    {
      path: "/docGroupCard",
      name: "docGroupCard",
      component: docGroupCard
    },
    {
      path: "/docGroupCardMessage",
      name: "docGroupCardMessage",
      component: docGroupCardMessage
    },
    {
      path: "/modifyDocGroupMessage",
      name: "modifyDocGroupMessage",
      component: modifyDocGroupMessage
    },
    {
      path: "/createDocGroupFirst",
      name: "createDocGroupFirst",
      component: createDocGroupFirst
    },
    {
      path: "/modifyDoctorGroupName",
      name: "modifyDoctorGroupName",
      component: modifyDoctorGroupName
    },
    {
      path: "/editIntro",
      name: "editIntro",
      component: editIntro
    },
    {
      path: "/docDetail",
      name: "docDetail",
      component: docDetail
    },
    {
      path: "/docArticlesSearch",
      name: "docArticlesSearch",
      component: docArticlesSearch
    },
    {
      path: "/docArticlesSearchWater",
      name: "docArticlesSearchWater",
      component: docArticlesSearchWater
    },
    {
      path: "/docArticlesSearchAgain",
      name: "docArticlesSearchAgain",
      component: docArticlesSearchAgain
    },
    {
      path: "/docArticlesSearchAgainWater",
      name: "docArticlesSearchAgainWater",
      component: docArticlesSearchAgainWater
    },
    {
      path: "/docArticlesDetail",
      name: "docArticlesDetail",
      component: docArticlesDetail
    },
    {
      path: "/docArticlesList",
      name: "docArticlesList",
      component: docArticlesList
    },
    {
      path: "/docIMaddFriend",
      name: "docIMaddFriend",
      component: docIMaddFriend
    },
    {
      path: "/docIMCardDetail",
      name: "docIMCardDetail",
      component: docIMCardDetail
    },
    {
      path: "/docChatIMDetail",
      name: "docChatIMDetail",
      component: docChatIMDetail
    },
    {
      path: "/docIMPatientInfo",
      name: "docIMPatientInfo",
      component: docIMPatientInfo
    },
    {
      path: "/docPatientInfo",
      name: "docPatientInfo",
      component: docPatientInfo
    },
    {
      path: "/docIMEditRemark",
      name: "docIMEditRemark",
      component: docIMEditRemark
    },
    {
      path: "/docIMSettings",
      name: "docIMSettings",
      component: docIMSettings
    },
    {
      path: "/submitAdvise",
      name: "submitAdvise",
      component: submitAdvise
    },
    {
      path: "/docGetQuestionnaire",
      name: "docGetQuestionnaire",
      component: docGetQuestionnaire
    },
    {
      path: "/docPatientTask",
      name: "docPatientTask",
      component: docPatientTask
    },
    {
      path: "/",
      name: "",
      component: null
    },
    {
      path: "/questionnaireDetail",
      name: "questionnaireDetail",
      component: questionnaireDetail
    },
    {
      path: "/chatIMListSearch",
      name: "chatIMListSearch",
      component: chatIMListSearch
    },
    {
      path: "/doctorTeamSearch",
      name: "doctorTeamSearch",
      component: doctorTeamSearch
    },
    {
      path: "/updateRemark",
      name: "updateRemark",
      component: updateRemark
    },
    {
      path: "/doctorMessage",
      name: "doctorMessage",
      component: doctorMessage
    },
    {
      path: "/chatIMSettings",
      name: "chatIMSettings",
      component: chatIMSettings
    },
    {
      path: "/chatIMDetail",
      name: "chatIMDetail",
      component: chatIMDetail
    },

    {
      path: "/patientRegister",
      name: "patientRegister",
      component: patientRegister
    },
    {
      path: "/patientRegisterSuccess",
      name: "patientRegisterSuccess",
      component: patientRegisterSuccess
    },
    {
      path: "/agreement",
      name: "agreement",
      component: agreement
    },
    {
      path: "/chooseDisease",
      name: "chooseDisease",
      component: chooseDisease
    },
    {
      path: "/chooseDiseaseAgain",
      name: "chooseDiseaseAgain",
      component: chooseDiseaseAgain
    },

    {
      path: "/patientHome",
      name: "patientHome",
      component: patientHome
    },
    {
      path: "/articlesSearch",
      name: "articlesSearch",
      component: articlesSearch
    },
    {
      path: "/articlesSearchAgain",
      name: "articlesSearchAgain",
      component: articlesSearchAgain
    },
    {
      path: "/personalCenter",
      name: "personalCenter",
      component: personalCenter
    },
    {
      path: "/chatIMList",
      name: "chatIMList",
      component: chatIMList
    },
    {
      path: "/patientTask",
      name: "patientTask",
      component: patientTask
    },
    {
      path: "/patientMessageComplete",
      name: "patientMessageComplete",
      component: patientMessageComplete
    },
    {
      path: "/articleDetail",
      name: "articleDetail",
      component: articleDetail
    },
    {
      path: "/diseaseMessage",
      name: "diseaseMessage",
      component: diseaseMessage
    },
    {
      path: "/productArticleList",
      name: "productArticleList",
      component: productArticleList
    },
    {
      path: "/questionnaire",
      name: "questionnaire",
      component: questionnaire
    },
    {
      path: "/payAdvisory",
      name: "payAdvisory",
      component: payAdvisory
    },
    {
      path: "/payAdvisoryDetails",
      name: "payAdvisoryDetails",
      component: payAdvisoryDetails
    },
    {
      path: "/drugsList",
      name: "drugsList",
      component: drugsList
    },
    {
      path: "/orderDetail",
      name: "orderDetail",
      component: orderDetail
    },
    {
      path: "/ordersList",
      name: "ordersList",
      component: ordersList
    },
    {
      path: "/submitOrder",
      name: "submitOrder",
      component: submitOrder
    },
    {
      path: "/withoutPermission",
      name: "withoutPermission",
      component: withoutPermission
    },
    {
      path: "/answerByAssistant",
      name: "answerByAssistant",
      component: answerByAssistant
    },
    {
      path: "/assistantIM",
      name: "assistantIM",
      component: assistantIM
    },
    {
      path: "/stewardIM",
      name: "stewardIM",
      component: stewardIM
    },
    {
      path: "/statistics",
      name: "statistics",
      component: statistics
    },
    {
      path: "/introduce",
      name: "introduce",
      component: introduce
    },
    {
      path: "/market",
      name: "market",
      component: market
    },
    {
      path: "/illness",
      name: "illness",
      component: illness
    },
    {
      path: "/history",
      name: "history",
      component: history
    },
    {
      path: "/consult",
      name: "consult",
      component: consult
    },
    {
      path: "/statisOrder",
      name: "statisOrder",
      component: statisOrder
    },
    {
      path: "/integralIndex",
      name: "integralIndex",
      component: integralIndex
    },
    {
      path: "/integralProductDetail",
      name: "integralProductDetail",
      component: integralProductDetail
    },
    {
      path: "/integralConfirm",
      name: "integralConfirm",
      component: integralConfirm
    },
    {
      path: "/integralOrderList",
      name: "integralOrderList",
      component: integralOrderList
    },
    {
      path: "/integralOrderDetail",
      name: "integralOrderDetail",
      component: integralOrderDetail
    },
    {
      path: "/integralIntegralDetail",
      name: "integralIntegralDetail",
      component: integralIntegralDetail
    },
    {
      path: "/integralIntegralExplain",
      name: "integralIntegralExplain",
      component: integralIntegralExplain
    },
    {
      path: "/integralAddressSelect",
      name: "integralAddressSelect",
      component: integralAddressSelect
    },
    {
      path: "/integralAddressUpdate",
      name: "integralAddressUpdate",
      component: integralAddressUpdate
    },
    {
      path: "/payCancel",
      name: "payCancel",
      component: payCancel
    }, {
      path: "/submitOfflineOrder",
      name: "submitOfflineOrder",
      component: submitOfflineOrder
    }, {
      path: "/payTip",
      name: "payTip",
      component: payTip
    },

    {
      path: "/productOrderDetail",
      name: "productOrderDetail",
      component: productOrderDetail
    },
    {
      path: "/productOrderList",
      name: "productOrderList",
      component: productOrderList
    },
    {
      path: "/submitProductOrder",
      name: "submitProductOrder",
      component: submitProductOrder
    }, {
      path: "/productList",
      name: "productList",
      component: productList
    },
    //活动注册页面
    {
      path: "/panicRegister",
      name: "panicRegister",
      component: panicRegister
    },
    //活动结束页
    {
      path: "/activityEnd",
      name: "activityEnd",
      component: activityEnd
    },
    //抢购结果页
    {
      path: "/panicBuyingResult",
      name: "panicBuyingResult",
      component: panicBuyingResult
    },
    // 患者端查看医生科室名片 v1.11版本新增
    {
      path: "/docDepartment",
      name: "docDepartment",
      component: docDepartment
    },
    // 患者复诊 v1.13版本新增
    {
      path: "/returnVisitP",
      name: "returnVisitP",
      component: returnVisitP
    },
    {
      path: "/returnVisitPDetail",
      name: "returnVisitPDetail",
      component: returnVisitPDetail
    },
    {
      path: "/returnVisitPSearch",
      name: "returnVisitPSearch",
      component: returnVisitPSearch
    },
    // 患者营养推荐 v1.13版本新增
    {
      path: "/chooseRecommendationType",
      name: "chooseRecommendationType",
      component: chooseRecommendationType
    },
    // 患者营养推荐--主动选择自营产品购买 v1.13版本新增
    {
      path: "/patientSelectdrugs",
      name: "patientSelectdrugs",
      component: patientSelectdrugs
    },
    // 患者营养推荐--主动选择自营产品购买 --- 已选产品列表 v1.13版本新增
    {
      path: "/patientDrugsList",
      name: "patientDrugsList",
      component: patientDrugsList
    },
    // 患者营养推荐--智能柜购买 ---  v1.13版本新增
    {
      path: "/patientProductList",
      name: "patientProductList",
      component: patientProductList
    },
    // 患者营养推荐-- 未绑定医生提示页 ---  v1.13版本新增
    {
      path: "/unboundDoctor",
      name: "unboundDoctor",
      component: unboundDoctor
    },
    // 公众号模板文章 ---  v1.13版本新增
    {
      path: "/templateArticle",
      name: "templateArticle",
      component: templateArticle
    },
    // 疾康知介首页 v1.13新增
    {
      path: "/introduceList",
      name: "introduceList",
      component: introduceList
    },
    // 疾康知介搜索页 v1.13新增
    {
      path: "/introduceSearch",
      name: "introduceSearch",
      component: introduceSearch
    },
    // 疾康知介详情页 v1.13新增
    {
      path: "/introduceDetail",
      name: "introduceDetail",
      component: introduceDetail
    },
    // v1.13医生数据授权(未授权)
    {
      path: "/authorization",
      name: "authorization",
      component: authorization
    },
    // v1.13医生数据授权(已授权)
    {
      path: "/hasAuthorization",
      name: "hasAuthorization",
      component: hasAuthorization
    },
    // 2020/08/18 新增支付中(支付完成)页
    {
      path: "/payProgress",
      name: "payProgress",
      component: payProgress
    },
  ]
});

// 前置的路由处理，可用于系统初始化
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
