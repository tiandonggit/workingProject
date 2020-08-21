
// 页面:获取网络信息
// 开发者:王海洋
import equipmentES from './equipmentES'
let getCurrentNetworkType = () => {
    let NetworkType = ['UNKNOW', 'NONE', 'ETHERNET', 'WIFI', '2G', '3G', '4G']
    if (equipmentES.plus) {
        console.log(NetworkType)
        console.log(window.plus.networkinfo.getCurrentType())
        return NetworkType[window.plus.networkinfo.getCurrentType()]
    }
    return null
}

export default {getCurrentNetworkType}