export let _Vue
export default {
  install(Vue) {
    if (this.installed && _Vue === Vue) return
    this.installed = true
    _Vue = Vue
    _Vue.prototype.NOTICE = true
    _Vue.mixin({
      created: function () {
        //  if (this.NOTICE)
      },
      mounted() {
      },
      methods: {
        test: function () {
          console.log("mixin test")
        },
      }
    })

    /**
     *@desc 生成唯一uuid 标识
     *@author houpai
     *@date 2019/07/15 13:08:20
     */
    _Vue.prototype.$uuid = () => {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    /**
     * author houpai
     * 判断数组对象中是否存在某个对象
     * @param arr 数组对象
     * @param origin(String)要匹配的某个字段
     * @param value 要匹配的字段值
     * @return {index: number, value}
     * */
    _Vue.prototype.$hasValueFromArray = (arr, origin, value) => {
      if (!Array.isArray) { //Polyfill
        Array.isArray = function (arg) {
          return Object.prototype.toString.call(arg) === '[object Array]'
        }
      }
      if (!Array.isArray(arr)) {
        throw new Error('arr 不是一个数组')
      } else {
        let flag = false //没有匹配
        let temp = {}
        let index = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][origin] === value) {
            flag = true
            temp = arr[i]
            index = i
            break
          }
        }
        if (!flag) {
          temp = null
        }
        return {index: index, value: temp}
      }
    }

    /**
     *@desc 数组对象去重
     *@param arr 数组对象
     *@param origin(String)要去重的某个字段
     *@author houpai
     *@date 2019/07/18 15:03:48
     */
    _Vue.prototype.$objectArrNorepeat = (arr, name) => {
      let hash = {}
      return arr.reduce(function (item, next) {
        hash[next[name]] ? '' : hash[next[name]] = true && item.push(next)
        return item
      }, []) 
    }

    /**
     *@desc 查询元素在数组中的位置(去重后的数组)
     *@author houpai
     *@date 2019/11/25 14:13:01
     */
    _Vue.prototype.$indexVf = (arr, item) => {
      let index
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
          index = i
          break
        }
      }
      return index
    }

    /**
     *@desc 获取7天日期  x轴
     *@author tiandong
     *@date 2019/12/05
     */
    _Vue.prototype.$getXAxisDay = () => {
      let aData = []
      let today = new Date()
      for (let i = 7; i > 0; i--) {
        let data = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        let m = data.getMonth() + 1
        m = m < 10 ? "0" + m : m
        let d = data.getDate()
        d = d < 10 ? "0" + d : d
        aData.push(m + "." + d)
      }
      return aData
    }

    /**
     *@desc 生成x轴月(不包含本月)
     *@author tiandong
     *@params num  不传默认12个月
     *@date 2019/12/06 11:59:45
     */
    _Vue.prototype.$getXAxisMonth = (num = 12, type = 'number') => {
      let dataArr = []
      let data = new Date()
      data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
      for (let i = 0; i < num + 1; i++) {
        data.setMonth(data.getMonth() - 1) //每次循环一次 月份值减1
        let m = data.getMonth() + 1
        if (type !== 'number') {
          m = m + '月'
        } else {
          m = m < 10 ? "0" + m : m
        }
        dataArr.unshift(m)
      }
      dataArr.pop()
      return dataArr
    }

    /**
     *@desc 科学计数法保留两位浮点数
     *@params value String类型的数字
     *@author houpai
     *@date 2019/12/15 11:49:58
     */
    _Vue.prototype.$scientificBase = (value) => {
      let valueCopy = value + ''
      let result = ''
      let num = parseInt(value) + ''
      let numFloat = valueCopy.split('.')[1] || ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      if (numFloat) {
        result = result + '.' + numFloat
      }
      return result
    }
  }
}
