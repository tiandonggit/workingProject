import store from "../store/index"

/**
 * 随机数,模拟数据增长**/
function mathRound(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// 加载初始化 面包屑
let breadcrumb = ['平台总览']
store.commit("homeData/saveBreadcrumb", breadcrumb)

/**
 * 模拟增长今日开单数和今日销售额
 * **/
window.timer = null
window.hospitalData = JSON.parse(JSON.stringify(store.state.homeData.hospitalData))

window.dataChangeTimer = function() {
  window.clearInterval(window.timer)
  window.timer = setInterval(() => {
    window.hospitalData.forEach(hospital => {
      let mathRandom = mathRound(1, 3)
      hospital.today[0].value = Number(hospital.today[0].value) + mathRandom + '' // 开单数
      hospital.today[0].jinrijiaoyichengguo = Number(hospital.today[0].jinrijiaoyichengguo) + mathRandom + '' // 今日交易成果
      hospital.today[0].leijijiaoyichengguo = Number(hospital.today[0].leijijiaoyichengguo) + mathRandom + '' // 累计交易成果
      hospital.today[1].value = Number(hospital.today[1].value) + mathRound(300, 500) + '' // 交易额
    })
    localStorage.setItem('hospitalData', JSON.stringify(hospitalData))
    store.commit("homeData/saveHospitalData", hospitalData)
  }, 1000 * 60 * 5)
}

window.dataChangeTimer()

