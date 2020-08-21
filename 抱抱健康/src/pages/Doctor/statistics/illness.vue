/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: illness * @function:
患者疾病分布 * @date: 2019/12/14 * @time: 14:36 * * */
<template>
  <div id="illness">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>
    <!--内容-->
    <div class="main">
      <div class="map" id="map" v-show="objData.length != 0"></div>
      <div class="box" v-show="objData.length == 0">
        <img src="../../../assets/images/unIllness.png" alt="" />
        <p>暂无疾病分布数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入饼图
import "echarts/lib/chart/pie";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
// 引入图例
import "echarts/lib/component/legend";
export default {
  name: "illness",
  components: {
    commonHeader
  },
  data() {
    return {
      customTitle: "数据统计",
      title: "患者疾病分布",
      num: [], //人数
      rillnessName: [],
      objData: []
    };
  },
  created() {},
  mounted() {
    console.log(1);
    this.getIllnessChart();
  },
  methods: {
    getIllnessChart() {
      //查询数据
      this.$http
        .request({
          method: "get",
          url: "/RReportIllnessController/getIllnessChart",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            //把数据放到data里
            // let res = {
            //   data: {
            //     data: [
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞1"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞2"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞3"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞4"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞5"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞6"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞7"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞8"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞9"
            //       },
            //       {
            //         "num": "2",
            //         "RIllnessName_": "心肌梗塞31"
            //       }
            //     ]
            //   }
            // };
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.value = res.data.data[i].num;
              obj.name = res.data.data[i].RIllnessName_;
              this.objData.push(obj);
              this.num.push(res.data.data[i].num + "人");
              this.rillnessName.push(res.data.data[i].RIllnessName_);
            }
            let num = res.data.data.length;
            let height = 0;
            if (num == 1) {
              height = 188 + 100 + 44;
            } else if (num > 1) {
              height = 188 + 100 + (num - 1) * 37 + 44;
            }
            console.log(this.objData);
            console.log(this.num);
            console.log(this.rillnessName);
            if (num > 0) {
              document.getElementById("map").style.height = height + "px";
              this.biao();
            }
          } else {
            //失败
            this.$toast("查询失败");
          }
          console.log(res.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    biao() {
      let _this = this;
      let myChart = echarts.init(document.getElementById("map"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          itemWidth: 20, // 设置宽度
          itemHeight: 20, // 设置高度
          itemGap: 17,
          orient: "category",
          borderRadius: 4,
          x: "60",
          y: "bottom",
          textStyle: {
            //图例文字的样式
            fontSize: 16
          },
          data: _this.rillnessName,
          formatter: function(name) {
            var index = 0;
            var clientlabels = _this.rillnessName;
            var clientcounts = _this.num;
            clientlabels.forEach(function(value, i) {
              if (value == name) {
                index = i;
              }
            });
            //计算图例显示,最多24个字符
            // let numAll = 24;
            //获取人数的长度
            // let valueAll = clientcounts[index].length;
            // //计算人数的字符长度,初始为0
            // let blen = 0;
            // for(let r=0; r<valueAll; r++) {
            //   if ((clientcounts[index].charCodeAt(r) & 0xff00) != 0) {
            //     blen ++;
            //   }
            //   blen ++;
            // }
            //name的长度
            let nameLength = name.length;
            let blenName = 0;
            for (let r = 0; r < nameLength; r++) {
              if ((name.charCodeAt(r) & 0xff00) != 0) {
                blenName++;
              }
              blenName++;
            }
            if (blenName > 18) {
              name = name.substring(0, 8) + "...";
            }
            console.log(name);
            return " " + name + " " + clientcounts[index];
            //剩余的字符长度
            // numAll = numAll - blen;
            //剩余的字符长度减去name的字符长度
            // let numRes = numAll - blenName
            // if(numRes == 0) {
            //   return " "+name + " " + clientcounts[index];
            // } else if (numRes < 0) {
            //   //小于0,计算可以显示几个字,去掉....占得位置
            //   numAll = numAll-2;
            //   name = name.substring(0,Math.floor(numAll/2))+"....";
            //   console.log(numAll+'num');
            //   console.log(numAll%2);
            //   if(numAll%2) name = name + "  ";
            //   return " "+name+ " " + clientcounts[index];
            // } else {
            //   //大于0
            //   for ( let t = numRes; t > 0 ; t--) {
            //     if (t%2 == 0) name = name+ " ";
            //     name = name+ " ";
            //   }
            //   let str = " "+name+ " " + clientcounts[index];
            //   console.log(str+'最后')
            //   return str
            // }
            // if (name.length > numAll) {
            //   //如果name的长度大于numAll的话则取numAll-1个字加上...;
            //   name = name.substring(0, numAll-1) + "... ";
            // } else {
            //   //如果name的长度小于numAll的话则name加上多的字符个空格
            //   for (let k = (numAll-name.length)*3; k > 0 ; k--) {
            //     name = name+" "
            //   }
            // }
          }
        },
        series: [
          {
            name: "疾病分布",
            type: "pie",
            radius: "54%",
            label: {
              normal: {
                position: "inner",
                show: false
              }
            },
            // label:{
            //   show:true,
            //   formatter:'{b} : {c} '
            // },
            center: ["50%", "144"],
            data: _this.objData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
#illness {
  width: 100%;
  height: 100%;
  background: @backgroundColor;
  .main {
    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }

    -webkit-overflow-scrolling: touch;
    .padding(0, 12, 0, 12);
    position: fixed;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    overflow-y: auto;
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;
    .padding(15, 0, 20, 0);

    .map {
      padding-bottom: 20px;
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
      .width(351);
    }

    .box {
      .lineHeight(22);
      text-align: center;

      img {
        .width(205);
        .padding(90, 0, 0, 0);
      }

      p {
        .padding(39, 0, 0, 0);
        .fontSize(18);
        font-weight: bold;
        color: @titleColor;
      }
    }
  }
}
</style>
