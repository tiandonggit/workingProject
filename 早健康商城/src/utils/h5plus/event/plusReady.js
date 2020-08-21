
  // 页面:h5plus初始化
  // 开发者:王海洋

export function plusReady (callack) {
    if (window.plus) {
        callack()
    } else {
        document.addEventListener('plusready', callack, false)
    }
}

export default {plusReady}