/**
*@desc 全国地图
*@author houpai
*@date 2019/12/05 08:53:38
*/
<template>
  <div class="mapChart_page">
    <div ref="chart"></div>
  </div>
</template>

<script>

  import {mapState} from "vuex"
  const echart = require('echarts/lib/echarts');// 引入基本模板
  import 'echarts/map/js/china' // 引入中国地图数据

  export default {
    name: "chinaMap",
    computed: {
      ...mapState(["homeData"])
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echartDrew()
      })
    },
    methods: {
      /**
       * echart init
       * **/
      echartDrew() {
        if (!this.chart) {
          let dom = this.$refs.chart
          let chart = this.chart = echart.init(dom)
          if (chart === 'undefined' || chart === null) {
            console.error(`echarts init err`)
            return false
          }
          this.$nextTick(() => {
            this.chart.setOption(this.generatorChartOption('china'))
            this.chart.on('click', (params) => {
              if (params.data.show) {
                let breadcrumbArray = JSON.parse(JSON.stringify(this.homeData.breadcrumb))
                breadcrumbArray.push(params.name)
                this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
                this.$router.push({
                  name: 'provinceMap',
                  query: {
                    provinceName: params.name
                  }
                })
              }
            })
          })
        } else {
          this.$nextTick(() => {
            this.chart.setOption(this.generatorChartOption('china'))
            this.chart.on('click', (params) => {
              if (params.data.show) {
                let breadcrumbArray = JSON.parse(JSON.stringify(this.homeData.breadcrumb))
                breadcrumbArray.push(params.name)
                this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
                this.$router.push({
                  name: 'provinceMap',
                  query: {
                    provinceName: params.name
                  }
                })
              }
            })
          })
        }
        window.addEventListener('resize', this.handleResizeEvent)
      },
      /**
       * 图表配置
       * **/
      generatorChartOption(mapType) {
        let that = this
        let option = {
          // geo: {
          // map: mapType,
          // aspectScale: 0.75, //长宽比
          // zoom:1.2,
          // roam: false,
          // itemStyle: {
          //   normal: {
          //     areaColor: "rgba(61,52,199)",
          //     shadowColor:"#001831",
          //     shadowOffsetX:0,
          //     shadowOffsetY:25
          //   },
          //   emphasis: {
          //     label:{
          //       show:false
          //     },
          //     areaColor: "rgba(61,52,199)",
          //     shadowColor:"#001831",
          //   }
          // }
          // },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.data.show) {
                return `
                 <p>
                  <span style="color:#fff;margin: 0 8px">今日销售额:</span>
                  <br/>
                  <span style="color:#fff;margin: 0 8px">${that.$scientificBase(params.data.value) || 0}</span>
                  <i style="color:#46F02C;margin: 0 8px 0 0" class="el-icon-top"></i>
                </p>`
              }
            }
          },
          series: [{
            geoIndex: 1,
            aspectScale: 0.75, //长宽比
            emphasis: {
              label: {
                show: false
              }
            },
            name: '中国',
            type: 'map',
            mapType: mapType,
            selectedMode: 'single',
            itemStyle: {
              normal: {//未选中状态
                borderWidth: 2,//边框大小
                borderColor: 'rgba(20,26,142)',
                // areaColor: '#226DE6',//背景颜色
                areaColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(61,52,199)' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(26,127,239)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                },
                label: {
                  show: true, //显示名称
                  textStyle: {
                    color: '#fff'
                  },
                  fontSize: 20
                },
              },
              emphasis: {// 也是选中样式
                // borderWidth: 2,
                // borderColor: '#fff',
                // areaColor: 'rgba(61,52,199)',
                // label: {
                //   show: true,
                //   textStyle: {
                //     color: '#fff'
                //   },
                //   fontSize: 20
                // }

                borderWidth: 2,//边框大小
                borderColor: 'rgba(20,26,142)',
                // areaColor: '#226DE6',//背景颜色
                areaColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(61,52,199)' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(26,127,239)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                },
                label: {
                  show: true, //显示名称
                  textStyle: {
                    color: '#fff'
                  },
                  fontSize: 20
                },
              }
            },
            roam: true,
            zoom: 1.1,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                name: '河北',
                value: this.getProvinceValue('河北'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '河南',
                value: this.getProvinceValue('河南'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '辽宁',
                value: this.getProvinceValue('辽宁'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '黑龙江',
                value: this.getProvinceValue('黑龙江'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '山东',
                value: this.getProvinceValue('山东'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '江苏',
                value: this.getProvinceValue('江苏'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '广西',
                value: this.getProvinceValue('广西'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '山西',
                value: this.getProvinceValue('山西'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '内蒙古',
                value: this.getProvinceValue('内蒙古'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '吉林',
                value: this.getProvinceValue('吉林'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              {
                name: '广东',
                value: this.getProvinceValue('广东'),
                show: true,
                itemStyle: {
                  emphasis: {// 也是选中样式
                    borderWidth: 2,
                    borderColor: '#fff',
                    areaColor: 'rgba(61,52,199)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      fontSize: 20
                    }
                  }
                }
              },
              // 以下为无业务省份,隐藏地区名
              {name: "南海诸岛", value: 0, itemStyle: {normal: {opacity: 0}}, label: {show: false}},
              {name: '北京', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '天津', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '上海', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '重庆', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '云南', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '湖南', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '安徽', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '新疆', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '浙江', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '江西', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '湖北', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '甘肃', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '陕西', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '福建', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '贵州', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '青海', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '西藏', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '四川', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '宁夏', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '海南', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '台湾', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '香港', value: Math.round(Math.random() * 3000), label: {show: false}},
              {name: '澳门', value: Math.round(Math.random() * 3000), label: {show: false}},
              // 各省地图
              {name: '重庆市', value: Math.round(Math.random() * 1000)},
              {name: '北京市', value: Math.round(Math.random() * 1000)},
              {name: '天津市', value: Math.round(Math.random() * 1000)},
              {name: '上海市', value: Math.round(Math.random() * 1000)},
              {name: '香港', value: Math.round(Math.random() * 1000)},
              {name: '澳门', value: Math.round(Math.random() * 1000)},
              {name: '巴音郭楞蒙古自治州', value: Math.round(Math.random() * 1000)},
              {name: '和田地区', value: Math.round(Math.random() * 1000)},
              {name: '哈密地区', value: Math.round(Math.random() * 1000)},
              {name: '阿克苏地区', value: Math.round(Math.random() * 1000)},
              {name: '阿勒泰地区', value: Math.round(Math.random() * 1000)},
              {name: '喀什地区', value: Math.round(Math.random() * 1000)},
              {name: '塔城地区', value: Math.round(Math.random() * 1000)},
              {name: '昌吉回族自治州', value: Math.round(Math.random() * 1000)},
              {name: '克孜勒苏柯尔克孜自治州', value: Math.round(Math.random() * 1000)},
              {name: '吐鲁番地区', value: Math.round(Math.random() * 1000)},
              {name: '伊犁哈萨克自治州', value: Math.round(Math.random() * 1000)},
              {name: '博尔塔拉蒙古自治州', value: Math.round(Math.random() * 1000)},
              {name: '乌鲁木齐市', value: Math.round(Math.random() * 1000)},
              {name: '克拉玛依市', value: Math.round(Math.random() * 1000)},
              {name: '阿拉尔市', value: Math.round(Math.random() * 1000)},
              {name: '图木舒克市', value: Math.round(Math.random() * 1000)},
              {name: '五家渠市', value: Math.round(Math.random() * 1000)},
              {name: '石河子市', value: Math.round(Math.random() * 1000)},
              {name: '那曲地区', value: Math.round(Math.random() * 1000)},
              {name: '阿里地区', value: Math.round(Math.random() * 1000)},
              {name: '日喀则地区', value: Math.round(Math.random() * 1000)},
              {name: '林芝地区', value: Math.round(Math.random() * 1000)},
              {name: '昌都地区', value: Math.round(Math.random() * 1000)},
              {name: '山南地区', value: Math.round(Math.random() * 1000)},
              {name: '拉萨市', value: Math.round(Math.random() * 1000)},
              {name: '呼伦贝尔市', value: Math.round(Math.random() * 1000)},
              {name: '阿拉善盟', value: Math.round(Math.random() * 1000)},
              {name: '锡林郭勒盟', value: Math.round(Math.random() * 1000)},
              {name: '鄂尔多斯市', value: Math.round(Math.random() * 1000)},
              {name: '赤峰市', value: Math.round(Math.random() * 1000)},
              {name: '巴彦淖尔市', value: Math.round(Math.random() * 1000)},
              {name: '通辽市', value: Math.round(Math.random() * 1000)},
              {name: '乌兰察布市', value: Math.round(Math.random() * 1000)},
              {name: '兴安盟', value: Math.round(Math.random() * 1000)},
              {name: '包头市', value: Math.round(Math.random() * 1000)},
              {name: '呼和浩特市', value: Math.round(Math.random() * 1000)},
              {name: '乌海市', value: Math.round(Math.random() * 1000)},
              {name: '海西蒙古族藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '玉树藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '果洛藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '海南藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '海北藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '黄南藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '海东地区', value: Math.round(Math.random() * 1000)},
              {name: '西宁市', value: Math.round(Math.random() * 1000)},
              {name: '甘孜藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '阿坝藏族羌族自治州', value: Math.round(Math.random() * 1000)},
              {name: '凉山彝族自治州', value: Math.round(Math.random() * 1000)},
              {name: '绵阳市', value: Math.round(Math.random() * 1000)},
              {name: '达州市', value: Math.round(Math.random() * 1000)},
              {name: '广元市', value: Math.round(Math.random() * 1000)},
              {name: '雅安市', value: Math.round(Math.random() * 1000)},
              {name: '宜宾市', value: Math.round(Math.random() * 1000)},
              {name: '乐山市', value: Math.round(Math.random() * 1000)},
              {name: '南充市', value: Math.round(Math.random() * 1000)},
              {name: '巴中市', value: Math.round(Math.random() * 1000)},
              {name: '泸州市', value: Math.round(Math.random() * 1000)},
              {name: '成都市', value: Math.round(Math.random() * 1000)},
              {name: '资阳市', value: Math.round(Math.random() * 1000)},
              {name: '攀枝花市', value: Math.round(Math.random() * 1000)},
              {name: '眉山市', value: Math.round(Math.random() * 1000)},
              {name: '广安市', value: Math.round(Math.random() * 1000)},
              {name: '德阳市', value: Math.round(Math.random() * 1000)},
              {name: '内江市', value: Math.round(Math.random() * 1000)},
              {name: '遂宁市', value: Math.round(Math.random() * 1000)},
              {name: '自贡市', value: Math.round(Math.random() * 1000)},
              {name: '黑河市', value: Math.round(Math.random() * 1000)},
              {name: '大兴安岭地区', value: Math.round(Math.random() * 1000)},
              {name: '哈尔滨市', value: Math.round(Math.random() * 1000)},
              {name: '齐齐哈尔市', value: Math.round(Math.random() * 1000)},
              {name: '牡丹江市', value: Math.round(Math.random() * 1000)},
              {name: '绥化市', value: Math.round(Math.random() * 1000)},
              {name: '伊春市', value: Math.round(Math.random() * 1000)},
              {name: '佳木斯市', value: Math.round(Math.random() * 1000)},
              {name: '鸡西市', value: Math.round(Math.random() * 1000)},
              {name: '双鸭山市', value: Math.round(Math.random() * 1000)},
              {name: '大庆市', value: Math.round(Math.random() * 1000)},
              {name: '鹤岗市', value: Math.round(Math.random() * 1000)},
              {name: '七台河市', value: Math.round(Math.random() * 1000)},
              {name: '酒泉市', value: Math.round(Math.random() * 1000)},
              {name: '张掖市', value: Math.round(Math.random() * 1000)},
              {name: '甘南藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '武威市', value: Math.round(Math.random() * 1000)},
              {name: '陇南市', value: Math.round(Math.random() * 1000)},
              {name: '庆阳市', value: Math.round(Math.random() * 1000)},
              {name: '白银市', value: Math.round(Math.random() * 1000)},
              {name: '定西市', value: Math.round(Math.random() * 1000)},
              {name: '天水市', value: Math.round(Math.random() * 1000)},
              {name: '兰州市', value: Math.round(Math.random() * 1000)},
              {name: '平凉市', value: Math.round(Math.random() * 1000)},
              {name: '临夏回族自治州', value: Math.round(Math.random() * 1000)},
              {name: '金昌市', value: Math.round(Math.random() * 1000)},
              {name: '嘉峪关市', value: Math.round(Math.random() * 1000)},
              {name: '普洱市', value: Math.round(Math.random() * 1000)},
              {name: '红河哈尼族彝族自治州', value: Math.round(Math.random() * 1000)},
              {name: '文山壮族苗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '曲靖市', value: Math.round(Math.random() * 1000)},
              {name: '楚雄彝族自治州', value: Math.round(Math.random() * 1000)},
              {name: '大理白族自治州', value: Math.round(Math.random() * 1000)},
              {name: '临沧市', value: Math.round(Math.random() * 1000)},
              {name: '迪庆藏族自治州', value: Math.round(Math.random() * 1000)},
              {name: '昭通市', value: Math.round(Math.random() * 1000)},
              {name: '昆明市', value: Math.round(Math.random() * 1000)},
              {name: '丽江市', value: Math.round(Math.random() * 1000)},
              {name: '西双版纳傣族自治州', value: Math.round(Math.random() * 1000)},
              {name: '保山市', value: Math.round(Math.random() * 1000)},
              {name: '玉溪市', value: Math.round(Math.random() * 1000)},
              {name: '怒江傈僳族自治州', value: Math.round(Math.random() * 1000)},
              {name: '德宏傣族景颇族自治州', value: Math.round(Math.random() * 1000)},
              {name: '百色市', value: Math.round(Math.random() * 1000)},
              {name: '河池市', value: Math.round(Math.random() * 1000)},
              {name: '桂林市', value: Math.round(Math.random() * 1000)},
              {name: '南宁市', value: Math.round(Math.random() * 1000)},
              {name: '柳州市', value: Math.round(Math.random() * 1000)},
              {name: '崇左市', value: Math.round(Math.random() * 1000)},
              {name: '来宾市', value: Math.round(Math.random() * 1000)},
              {name: '玉林市', value: Math.round(Math.random() * 1000)},
              {name: '梧州市', value: Math.round(Math.random() * 1000)},
              {name: '贺州市', value: Math.round(Math.random() * 1000)},
              {name: '钦州市', value: Math.round(Math.random() * 1000)},
              {name: '贵港市', value: Math.round(Math.random() * 1000)},
              {name: '防城港市', value: Math.round(Math.random() * 1000)},
              {name: '北海市', value: Math.round(Math.random() * 1000)},
              {name: '怀化市', value: Math.round(Math.random() * 1000)},
              {name: '永州市', value: Math.round(Math.random() * 1000)},
              {name: '邵阳市', value: Math.round(Math.random() * 1000)},
              {name: '郴州市', value: Math.round(Math.random() * 1000)},
              {name: '常德市', value: Math.round(Math.random() * 1000)},
              {name: '湘西土家族苗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '衡阳市', value: Math.round(Math.random() * 1000)},
              {name: '岳阳市', value: Math.round(Math.random() * 1000)},
              {name: '益阳市', value: Math.round(Math.random() * 1000)},
              {name: '长沙市', value: Math.round(Math.random() * 1000)},
              {name: '株洲市', value: Math.round(Math.random() * 1000)},
              {name: '张家界市', value: Math.round(Math.random() * 1000)},
              {name: '娄底市', value: Math.round(Math.random() * 1000)},
              {name: '湘潭市', value: Math.round(Math.random() * 1000)},
              {name: '榆林市', value: Math.round(Math.random() * 1000)},
              {name: '延安市', value: Math.round(Math.random() * 1000)},
              {name: '汉中市', value: Math.round(Math.random() * 1000)},
              {name: '安康市', value: Math.round(Math.random() * 1000)},
              {name: '商洛市', value: Math.round(Math.random() * 1000)},
              {name: '宝鸡市', value: Math.round(Math.random() * 1000)},
              {name: '渭南市', value: Math.round(Math.random() * 1000)},
              {name: '咸阳市', value: Math.round(Math.random() * 1000)},
              {name: '西安市', value: Math.round(Math.random() * 1000)},
              {name: '铜川市', value: Math.round(Math.random() * 1000)},
              {name: '清远市', value: Math.round(Math.random() * 1000)},
              {name: '韶关市', value: Math.round(Math.random() * 1000)},
              {name: '湛江市', value: Math.round(Math.random() * 1000)},
              {name: '梅州市', value: Math.round(Math.random() * 1000)},
              {name: '河源市', value: Math.round(Math.random() * 1000)},
              {name: '肇庆市', value: Math.round(Math.random() * 1000)},
              {name: '惠州市', value: Math.round(Math.random() * 1000)},
              {name: '茂名市', value: Math.round(Math.random() * 1000)},
              {name: '江门市', value: Math.round(Math.random() * 1000)},
              {name: '阳江市', value: Math.round(Math.random() * 1000)},
              {name: '云浮市', value: Math.round(Math.random() * 1000)},
              {name: '广州市', value: Math.round(Math.random() * 1000)},
              {name: '汕尾市', value: Math.round(Math.random() * 1000)},
              {name: '揭阳市', value: Math.round(Math.random() * 1000)},
              {name: '珠海市', value: Math.round(Math.random() * 1000)},
              {name: '佛山市', value: Math.round(Math.random() * 1000)},
              {name: '潮州市', value: Math.round(Math.random() * 1000)},
              {name: '汕头市', value: Math.round(Math.random() * 1000)},
              {name: '深圳市', value: Math.round(Math.random() * 1000)},
              {name: '东莞市', value: Math.round(Math.random() * 1000)},
              {name: '中山市', value: Math.round(Math.random() * 1000)},
              {name: '延边朝鲜族自治州', value: Math.round(Math.random() * 1000)},
              {name: '吉林市', value: Math.round(Math.random() * 1000)},
              {name: '白城市', value: Math.round(Math.random() * 1000)},
              {name: '松原市', value: Math.round(Math.random() * 1000)},
              {name: '长春市', value: Math.round(Math.random() * 1000)},
              {name: '白山市', value: Math.round(Math.random() * 1000)},
              {name: '通化市', value: Math.round(Math.random() * 1000)},
              {name: '四平市', value: Math.round(Math.random() * 1000)},
              {name: '辽源市', value: Math.round(Math.random() * 1000)},
              {name: '承德市', value: Math.round(Math.random() * 1000)},
              {name: '张家口市', value: Math.round(Math.random() * 1000)},
              {name: '保定市', value: Math.round(Math.random() * 1000)},
              {name: '唐山市', value: Math.round(Math.random() * 1000)},
              {name: '沧州市', value: Math.round(Math.random() * 1000)},
              {name: '石家庄市', value: Math.round(Math.random() * 1000)},
              {name: '邢台市', value: Math.round(Math.random() * 1000)},
              {name: '邯郸市', value: Math.round(Math.random() * 1000)},
              {name: '秦皇岛市', value: Math.round(Math.random() * 1000)},
              {name: '衡水市', value: Math.round(Math.random() * 1000)},
              {name: '廊坊市', value: Math.round(Math.random() * 1000)},
              {name: '恩施土家族苗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '十堰市', value: Math.round(Math.random() * 1000)},
              {name: '宜昌市', value: Math.round(Math.random() * 1000)},
              {name: '襄樊市', value: Math.round(Math.random() * 1000)},
              {name: '黄冈市', value: Math.round(Math.random() * 1000)},
              {name: '荆州市', value: Math.round(Math.random() * 1000)},
              {name: '荆门市', value: Math.round(Math.random() * 1000)},
              {name: '咸宁市', value: Math.round(Math.random() * 1000)},
              {name: '随州市', value: Math.round(Math.random() * 1000)},
              {name: '孝感市', value: Math.round(Math.random() * 1000)},
              {name: '武汉市', value: Math.round(Math.random() * 1000)},
              {name: '黄石市', value: Math.round(Math.random() * 1000)},
              {name: '神农架林区', value: Math.round(Math.random() * 1000)},
              {name: '天门市', value: Math.round(Math.random() * 1000)},
              {name: '仙桃市', value: Math.round(Math.random() * 1000)},
              {name: '潜江市', value: Math.round(Math.random() * 1000)},
              {name: '鄂州市', value: Math.round(Math.random() * 1000)},
              {name: '遵义市', value: Math.round(Math.random() * 1000)},
              {name: '黔东南苗族侗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '毕节地区', value: Math.round(Math.random() * 1000)},
              {name: '黔南布依族苗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '铜仁地区', value: Math.round(Math.random() * 1000)},
              {name: '黔西南布依族苗族自治州', value: Math.round(Math.random() * 1000)},
              {name: '六盘水市', value: Math.round(Math.random() * 1000)},
              {name: '安顺市', value: Math.round(Math.random() * 1000)},
              {name: '贵阳市', value: Math.round(Math.random() * 1000)},
              {name: '烟台市', value: Math.round(Math.random() * 1000)},
              {name: '临沂市', value: Math.round(Math.random() * 1000)},
              {name: '潍坊市', value: Math.round(Math.random() * 1000)},
              {name: '青岛市', value: Math.round(Math.random() * 1000)},
              {name: '菏泽市', value: Math.round(Math.random() * 1000)},
              {name: '济宁市', value: Math.round(Math.random() * 1000)},
              {name: '德州市', value: Math.round(Math.random() * 1000)},
              {name: '滨州市', value: Math.round(Math.random() * 1000)},
              {name: '聊城市', value: Math.round(Math.random() * 1000)},
              {name: '东营市', value: Math.round(Math.random() * 1000)},
              {name: '济南市', value: Math.round(Math.random() * 1000)},
              {name: '泰安市', value: Math.round(Math.random() * 1000)},
              {name: '威海市', value: Math.round(Math.random() * 1000)},
              {name: '日照市', value: Math.round(Math.random() * 1000)},
              {name: '淄博市', value: Math.round(Math.random() * 1000)},
              {name: '枣庄市', value: Math.round(Math.random() * 1000)},
              {name: '莱芜市', value: Math.round(Math.random() * 1000)},
              {name: '赣州市', value: Math.round(Math.random() * 1000)},
              {name: '吉安市', value: Math.round(Math.random() * 1000)},
              {name: '上饶市', value: Math.round(Math.random() * 1000)},
              {name: '九江市', value: Math.round(Math.random() * 1000)},
              {name: '抚州市', value: Math.round(Math.random() * 1000)},
              {name: '宜春市', value: Math.round(Math.random() * 1000)},
              {name: '南昌市', value: Math.round(Math.random() * 1000)},
              {name: '景德镇市', value: Math.round(Math.random() * 1000)},
              {name: '萍乡市', value: Math.round(Math.random() * 1000)},
              {name: '鹰潭市', value: Math.round(Math.random() * 1000)},
              {name: '新余市', value: Math.round(Math.random() * 1000)},
              {name: '南阳市', value: Math.round(Math.random() * 1000)},
              {name: '信阳市', value: Math.round(Math.random() * 1000)},
              {name: '洛阳市', value: Math.round(Math.random() * 1000)},
              {name: '驻马店市', value: Math.round(Math.random() * 1000)},
              {name: '周口市', value: Math.round(Math.random() * 1000)},
              {name: '商丘市', value: Math.round(Math.random() * 1000)},
              {name: '三门峡市', value: Math.round(Math.random() * 1000)},
              {name: '新乡市', value: Math.round(Math.random() * 1000)},
              {name: '平顶山市', value: Math.round(Math.random() * 1000)},
              {name: '郑州市', value: Math.round(Math.random() * 1000)},
              {name: '安阳市', value: Math.round(Math.random() * 1000)},
              {name: '开封市', value: Math.round(Math.random() * 1000)},
              {name: '焦作市', value: Math.round(Math.random() * 1000)},
              {name: '许昌市', value: Math.round(Math.random() * 1000)},
              {name: '濮阳市', value: Math.round(Math.random() * 1000)},
              {name: '漯河市', value: Math.round(Math.random() * 1000)},
              {name: '鹤壁市', value: Math.round(Math.random() * 1000)},
              {name: '大连市', value: Math.round(Math.random() * 1000)},
              {name: '朝阳市', value: Math.round(Math.random() * 1000)},
              {name: '丹东市', value: Math.round(Math.random() * 1000)},
              {name: '铁岭市', value: Math.round(Math.random() * 1000)},
              {name: '沈阳市', value: Math.round(Math.random() * 1000)},
              {name: '抚顺市', value: Math.round(Math.random() * 1000)},
              {name: '葫芦岛市', value: Math.round(Math.random() * 1000)},
              {name: '阜新市', value: Math.round(Math.random() * 1000)},
              {name: '锦州市', value: Math.round(Math.random() * 1000)},
              {name: '鞍山市', value: Math.round(Math.random() * 1000)},
              {name: '本溪市', value: Math.round(Math.random() * 1000)},
              {name: '营口市', value: Math.round(Math.random() * 1000)},
              {name: '辽阳市', value: Math.round(Math.random() * 1000)},
              {name: '盘锦市', value: Math.round(Math.random() * 1000)},
              {name: '忻州市', value: Math.round(Math.random() * 1000)},
              {name: '吕梁市', value: Math.round(Math.random() * 1000)},
              {name: '临汾市', value: Math.round(Math.random() * 1000)},
              {name: '晋中市', value: Math.round(Math.random() * 1000)},
              {name: '运城市', value: Math.round(Math.random() * 1000)},
              {name: '大同市', value: Math.round(Math.random() * 1000)},
              {name: '长治市', value: Math.round(Math.random() * 1000)},
              {name: '朔州市', value: Math.round(Math.random() * 1000)},
              {name: '晋城市', value: Math.round(Math.random() * 1000)},
              {name: '太原市', value: Math.round(Math.random() * 1000)},
              {name: '阳泉市', value: Math.round(Math.random() * 1000)},
              {name: '六安市', value: Math.round(Math.random() * 1000)},
              {name: '安庆市', value: Math.round(Math.random() * 1000)},
              {name: '滁州市', value: Math.round(Math.random() * 1000)},
              {name: '宣城市', value: Math.round(Math.random() * 1000)},
              {name: '阜阳市', value: Math.round(Math.random() * 1000)},
              {name: '宿州市', value: Math.round(Math.random() * 1000)},
              {name: '黄山市', value: Math.round(Math.random() * 1000)},
              {name: '巢湖市', value: Math.round(Math.random() * 1000)},
              {name: '亳州市', value: Math.round(Math.random() * 1000)},
              {name: '池州市', value: Math.round(Math.random() * 1000)},
              {name: '合肥市', value: Math.round(Math.random() * 1000)},
              {name: '蚌埠市', value: Math.round(Math.random() * 1000)},
              {name: '芜湖市', value: Math.round(Math.random() * 1000)},
              {name: '淮北市', value: Math.round(Math.random() * 1000)},
              {name: '淮南市', value: Math.round(Math.random() * 1000)},
              {name: '马鞍山市', value: Math.round(Math.random() * 1000)},
              {name: '铜陵市', value: Math.round(Math.random() * 1000)},
              {name: '南平市', value: Math.round(Math.random() * 1000)},
              {name: '三明市', value: Math.round(Math.random() * 1000)},
              {name: '龙岩市', value: Math.round(Math.random() * 1000)},
              {name: '宁德市', value: Math.round(Math.random() * 1000)},
              {name: '福州市', value: Math.round(Math.random() * 1000)},
              {name: '漳州市', value: Math.round(Math.random() * 1000)},
              {name: '泉州市', value: Math.round(Math.random() * 1000)},
              {name: '莆田市', value: Math.round(Math.random() * 1000)},
              {name: '厦门市', value: Math.round(Math.random() * 1000)},
              {name: '丽水市', value: Math.round(Math.random() * 1000)},
              {name: '杭州市', value: Math.round(Math.random() * 1000)},
              {name: '温州市', value: Math.round(Math.random() * 1000)},
              {name: '宁波市', value: Math.round(Math.random() * 1000)},
              {name: '舟山市', value: Math.round(Math.random() * 1000)},
              {name: '台州市', value: Math.round(Math.random() * 1000)},
              {name: '金华市', value: Math.round(Math.random() * 1000)},
              {name: '衢州市', value: Math.round(Math.random() * 1000)},
              {name: '绍兴市', value: Math.round(Math.random() * 1000)},
              {name: '嘉兴市', value: Math.round(Math.random() * 1000)},
              {name: '湖州市', value: Math.round(Math.random() * 1000)},
              {name: '盐城市', value: Math.round(Math.random() * 1000)},
              {name: '徐州市', value: Math.round(Math.random() * 1000)},
              {name: '南通市', value: Math.round(Math.random() * 1000)},
              {name: '淮安市', value: Math.round(Math.random() * 1000)},
              {name: '苏州市', value: Math.round(Math.random() * 1000)},
              {name: '宿迁市', value: Math.round(Math.random() * 1000)},
              {name: '连云港市', value: Math.round(Math.random() * 1000)},
              {name: '扬州市', value: Math.round(Math.random() * 1000)},
              {name: '南京市', value: Math.round(Math.random() * 1000)},
              {name: '泰州市', value: Math.round(Math.random() * 1000)},
              {name: '无锡市', value: Math.round(Math.random() * 1000)},
              {name: '常州市', value: Math.round(Math.random() * 1000)},
              {name: '镇江市', value: Math.round(Math.random() * 1000)},
              {name: '吴忠市', value: Math.round(Math.random() * 1000)},
              {name: '中卫市', value: Math.round(Math.random() * 1000)},
              {name: '固原市', value: Math.round(Math.random() * 1000)},
              {name: '银川市', value: Math.round(Math.random() * 1000)},
              {name: '石嘴山市', value: Math.round(Math.random() * 1000)},
              {name: '儋州市', value: Math.round(Math.random() * 1000)},
              {name: '文昌市', value: Math.round(Math.random() * 1000)},
              {name: '乐东黎族自治县', value: Math.round(Math.random() * 1000)},
              {name: '三亚市', value: Math.round(Math.random() * 1000)},
              {name: '琼中黎族苗族自治县', value: Math.round(Math.random() * 1000)},
              {name: '东方市', value: Math.round(Math.random() * 1000)},
              {name: '海口市', value: Math.round(Math.random() * 1000)},
              {name: '万宁市', value: Math.round(Math.random() * 1000)},
              {name: '澄迈县', value: Math.round(Math.random() * 1000)},
              {name: '白沙黎族自治县', value: Math.round(Math.random() * 1000)},
              {name: '琼海市', value: Math.round(Math.random() * 1000)},
              {name: '昌江黎族自治县', value: Math.round(Math.random() * 1000)},
              {name: '临高县', value: Math.round(Math.random() * 1000)},
              {name: '陵水黎族自治县', value: Math.round(Math.random() * 1000)},
              {name: '屯昌县', value: Math.round(Math.random() * 1000)},
              {name: '定安县', value: Math.round(Math.random() * 1000)},
              {name: '保亭黎族苗族自治县', value: Math.round(Math.random() * 1000)},
              {name: '五指山市', value: Math.round(Math.random() * 1000)}
            ]
          }]
        }
        return option
      },
      /**
       * 如果有图表实例，则对实例进行自适应调整
       * */
      handleResizeEvent() {
        let self = this
        if (this.chart) {
          setTimeout(function () {
            self.chart.resize()
          }, 100)
        }
      },
      /**
       * 获取省销售额,显示在地图toolip上
       * **/
      getProvinceValue(provinceName) {
        let provinceValue = 0;
        this.homeData.hospitalData.forEach(hospital => {
          if(hospital.provinceName === provinceName) {
            provinceValue += Number(hospital.today[1].value)
          }
        })
        return provinceValue.toFixed(2)
      }
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.clear()
        this.chart = null
      }
      window.removeEventListener('resize', this.handleResizeEvent)
    }
  }
</script>

<style scoped lang="less">
  .mapChart_page {
    width: 100%;
    height: 100%;
    cursor: pointer;

    div {
      width: 100%;
      height: 100%;
    }
  }
</style>
