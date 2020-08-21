<template>
  <div class="home_page">
    <v-header></v-header>
    <bread-crumb></bread-crumb>
    <v-panel></v-panel>
    <div class="content_box">
      <div class="leftPanel_box">
        <chart-panel :panel-type="'left'" :dialogShow="isShow"></chart-panel>
      </div>
      <div class="rightPanel_box">
        <chart-panel :panel-type="'right'" :dialogShow="isShow"></chart-panel>
      </div>
    </div>
    <!--    为了适配echart 画布大小 窗口定位路由出口 市级区域组件单独写样式控制-->
    <div class="routerView_box_fixed">
      <router-view></router-view>
    </div>
    <Dialog :position="position" :isShow="isShow">
      <div class="slot">
        <!-- 每日医生活跃 -->
        <div class="container clearfix" v-if="type === 'rihuoyue'">
          <div class="block_1_2 yi-sheng-huo-yue clearfix">
            <div class="top">
              <p class="title subtitle">每日医生活跃</p>
              <p class="right">次日预测值<span>{{dialogData.nextDay}}</span></p>
            </div>
            <div class="cell clearfix">
              <BarChart
                  title="每日医生活跃人数"
                  subTitle="单位：人"
                  :type="dialogData.chart1.type"
                  :xAxisType="dialogData.chart1.xAxisType"
                  :data1="dialogData.chart1.data1"
                  :barColorList="dialogData.chart1.barColorList"
              ></BarChart>
            </div>
            <div class="cell clearfix">
              <LineChart
                  title="每日医生活跃人数增长率"
                  subTitle="单位：%"
                  :data1="dialogData.chart2.data1"
                  :lineColorList="dialogData.chart2.barColorList"
              ></LineChart>
            </div>
            <div class="cell clearfix">
              <BarChart
                  title="每日医生活跃占比"
                  subTitle="单位：%"
                  :type="dialogData.chart3.type"
                  :xAxisType="dialogData.chart3.xAxisType"
                  :data1="dialogData.chart3.data1"
                  :barColorList="dialogData.chart3.barColorList"
              ></BarChart>
            </div>
          </div>
          <div class="block_1_2 yi-sheng-huo-yue clearfix">
            <div class="top">
              <p class="title subtitle">每月医生活跃</p>
              <p class="right">次月预测值<span>{{dialogData.nextMonth}}</span></p>
            </div>
            <div class="cell clearfix">
              <BarChart
                  title="每月医生活跃人数"
                  subTitle="单位：人"
                  :type="dialogData.chart4.type"
                  :xAxisType="dialogData.chart4.xAxisType"
                  :data1="dialogData.chart4.data1"
                  :barColorList="dialogData.chart4.barColorList"
              ></BarChart>
            </div>
            <div class="cell clearfix">
              <LineChart
                  title="每月医生活跃人数增长率"
                  subTitle="单位：%"
                  :data1="dialogData.chart5.data1"
                  :xAxisType="dialogData.chart5.xAxisType"
                  :lineColorList="dialogData.chart5.barColorList"
              ></LineChart>
            </div>
            <div class="cell clearfix">
              <BarChart
                  title="每月医生活跃占比"
                  subTitle="单位：%"
                  :type="dialogData.chart6.type"
                  :xAxisType="dialogData.chart6.xAxisType"
                  :data1="dialogData.chart6.data1"
                  :barColorList="dialogData.chart6.barColorList"
              ></BarChart>
            </div>
          </div>
        </div>
        <!-- 患教文章 -->
        <div class="container clearfix" v-if="type === 'huanjiaowenzhang'">
          <div class="block_3_1">
            <DoublePieChart
                :title="dialogData.block1.title"
                :subtitle1="dialogData.block1.subtitle1"
                :subtitle2="dialogData.block1.subtitle2"
                :data1="dialogData.block1.data1"
                :data2="dialogData.block1.data2"
            ></DoublePieChart>
          </div>
          <div class="block_3_1">
            <DoublePieChart
                :title="dialogData.block2.title"
                :subtitle1="dialogData.block2.subtitle1"
                :subtitle2="dialogData.block2.subtitle2"
                :data1="dialogData.block2.data1"
                :data2="dialogData.block2.data2"
            ></DoublePieChart>
          </div>
          <div class="block_3_1">
            <DoublePieChart
                :title="dialogData.block3.title"
                :subtitle1="dialogData.block3.subtitle1"
                :subtitle2="dialogData.block3.subtitle2"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
            ></DoublePieChart>
          </div>
        </div>
        <!-- 合作科室数 -->
        <div class="container clearfix" v-if="type === 'hezuokeshi'">
          <div class="block_2_2">
            <PieChart
                title="各合作科室类别分布"
                :data="dialogData.block1.data"
                :type="dialogData.block1.type"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="平均各科室销售额"
                :subTitle="dialogData.block2.subtitle"
                :type="2"
                :legendType="1"
                :xAxisType="1"
                :data1="dialogData.block2.data1"
                :data2="dialogData.block2.data2"
                :barColorList="dialogData.block2.barColorList"
            ></BarChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="平均科室开单数量"
                :subTitle="dialogData.block3.subtitle"
                :type="2"
                :legendType="1"
                :xAxisType="1"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
                :barColorList="dialogData.block3.barColorList"
            ></BarChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="平均各科室客单均价"
                :subTitle="dialogData.block4.subtitle"
                :type="2"
                :legendType="1"
                :xAxisType="1"
                :data1="dialogData.block4.data1"
                :data2="dialogData.block4.data2"
                :barColorList="dialogData.block4.barColorList"
            ></BarChart>
          </div>
        </div>
        <!-- 合作患者数 -->
        <div class="container clearfix" v-if="type === 'hezuohuanzhe'">
          <div class="block_2_2">
            <PieChart
                title="患者各科室分布"
                :data="dialogData.block1.data"
                :type="dialogData.block1.type"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <PieChart
                title="患者各类别医院分布"
                :data="dialogData.block2.data"
                :type="dialogData.block2.type"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="患者各科室购买率"
                :subTitle="dialogData.block3.subtitle"
                :type="2"
                :legendType="1"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
                :barColorList="dialogData.block3.barColorList"
            ></BarChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="患者各类别医院购买率"
                :subTitle="dialogData.block4.subtitle"
                :type="2"
                :legendType="1"
                :data1="dialogData.block4.data1"
                :data2="dialogData.block4.data2"
                :barColorList="dialogData.block4.barColorList"
            ></BarChart>
          </div>
        </div>
        <!-- 合作医生数 -->
        <div class="container clearfix" v-if="type === 'hezuoyisheng'">
          <div class="block_2_2">
            <PieChart
                title="合作医生级别分布"
                :data="dialogData.block1.data"
                :type="dialogData.block1.type"
                :addressType="2"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <LineChart
                title="平均各医生接诊患者数量"
                :subTitle="dialogData.block2.subTitle"
                :type="2"
                :data1="dialogData.block2.data1"
                :data2="dialogData.block2.data2"
                :lineColorList="dialogData.block2.lineColorList"
            ></LineChart>
          </div>
          <div class="block_2_2">
            <LineChart
                title="平均医生开单数量"
                :subTitle="dialogData.block3.subTitle"
                :type="2"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
                :lineColorList="dialogData.block3.lineColorList"
            ></LineChart>
          </div>
          <div class="block_2_2">
            <LineChart
                title="医生平均开单时长"
                :subTitle="dialogData.block4.subTitle"
                :type="2"
                :data1="dialogData.block4.data1"
                :data2="dialogData.block4.data2"
                :lineColorList="dialogData.block4.lineColorList"
            ></LineChart>
          </div>
        </div>
        <!-- 今日购买率 -->
        <div class="container1 container clearfix" v-if="type === 'goumailv'">
          <div class="block_2_2 gou-mai-lv">
            <p class="title subtitle">购买率</p>
            <div class="gml-box clearfix">
              <div class="img-box fl">
                <p class="gml-img-text">{{dialogData.block1.count}}</p>
              </div>
              <div class="gml-text fr">
                <div class="top">
                  <div class="left fl"></div>
                  <div class="right fr">
                    <p>{{dialogData.block1.num1}}</p>
                    <span>购买率</span>
                  </div>
                </div>
                <div class="bottom">
                  <div class="left fl"></div>
                  <div class="right fr">
                    <p>{{dialogData.block1.num2}}</p>
                    <span>期望购买率</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <BarChart
                title="商品缺货情况"
                :subTitle="dialogData.block2.subTitle"
                :type="2"
                :legendType="2"
                :data1="dialogData.block2.data1"
                :data2="dialogData.block2.data2"
                :barColorList="dialogData.block2.barColorList"
            ></BarChart>
          </div>
          <div class="block_1_1 clearfix">
            <BarChart
                title="患者购买情况"
                :subTitle="dialogData.block3.subTitle"
                :type="2"
                :legendType="2"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
                :barColorList="dialogData.block3.barColorList"
            ></BarChart>
          </div>
          <p class="title title1">购买率详情</p>
        </div>
        <!-- 今日开单数量 -->
        <div class="container1 container clearfix" v-if="type === 'kaidanshu'">
          <div class="block_2_2">
            <p class="subtitle title">开单数量</p>
            <div class="kds-block clearfix">
              <div class="left fl">
                <div class="top">
                  <img src="../assets/images/kaidanshu1.png" alt=""/>
                  <span class="name">医院数</span>
                  <span class="num">{{dialogData.block1.num1}}</span>
                </div>
                <p>今日开单医院数量</p>
              </div>
              <div class="right fr">
                <div class="top">
                  <img src="../assets/images/kaidanshu1.png" alt=""/>
                  <span class="name">医生数</span>
                  <span class="num">{{dialogData.block1.num2}}</span>
                </div>
                <p>今日开单医生数量</p>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <BarChart
                title="医生平均开单时长"
                subTitle="单位：分"
                :type="dialogData.block2.type"
                :legendType="dialogData.block2.legendType"
                :xAxisType="dialogData.block2.xAxisType"
                :data1="dialogData.block2.data1"
                :data2="dialogData.block2.data2"
                :barColorList="dialogData.block2.barColorList"
            ></BarChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="昨日平均各医院产品覆盖率"
                subTitle="单位：%"
                :type="dialogData.block3.type"
                :legendType="dialogData.block3.legendType"
                :xAxisType="dialogData.block3.xAxisType"
                :data1="dialogData.block3.data1"
                :data2="dialogData.block3.data2"
                :barColorList="dialogData.block3.barColorList"
            ></BarChart>
          </div>
          <div class="block_2_2">
            <BarChart
                title="日接诊患者总数量"
                subTitle="单位：人"
                :type="dialogData.block4.type"
                :legendType="dialogData.block4.legendType"
                :xAxisType="dialogData.block4.xAxisType"
                :data1="dialogData.block4.data1"
                :data2="dialogData.block4.data2"
                :barColorList="dialogData.block4.barColorList"
            ></BarChart>
          </div>
          <p class="title title1">开单数量</p>
        </div>
        <!-- 产品累计数量 -->
        <div class="container clearfix" v-if="type === 'chanpin'">
          <div class="block_2_2 chan-pin-shu">
            <p class="title subtitle">不同类别产品数量</p>
            <div class="cps-box clearfix">
              <div class="cell fl" v-for="(item, index) in dialogData.block1" :key="index">
                <CircleProgress :type="index+1" :data="item.value"></CircleProgress>
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <PieChart
                title="不同类别产品销量"
                :data="dialogData.block2.data1"
                :type="dialogData.block2.type"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <PieChart
                title="不同营养成分产品销量"
                :data="dialogData.block3.data1"
                :type="dialogData.block3.type"
            ></PieChart>
          </div>
          <div class="block_2_2 chan-pin-shu">
            <p class="title subtitle">不同地区产品销量</p>
            <div class="cps-box cps-box-scroll clearfix">
              <div class="cell fl" v-for="(item, index) in dialogData.block4" :key="index">
                <CircleProgressTwo :type="index+1" :data="item.value"></CircleProgressTwo>
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 医智成果累计交易数量 交易成果 -->
        <div class="container clearfix" v-if="type === 'jiaoyichengguo'">
          <div class="block_2_2">
            <div class="block-box">
              <p class="title">医智成果当日交易数量</p>
              <div class="bottom-box">
                <div class="text textColor1" :text="jinrijiaoyichengguo">{{jinrijiaoyichengguo}}</div>
                <div class="img">
                  <img src="../assets/images/zhishichanquan1.png" alt=""/>
                </div>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <div class="block-box">
              <p class="title">医智成果累计交易数量</p>
              <div class="bottom-box">
                <div class="text textColor2" :text="leijijiaoyichengguo">{{leijijiaoyichengguo}}</div>
                <div class="img">
                  <img src="../assets/images/zhishichanquan2.png" alt=""/>
                </div>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <div class="block-box">
              <p class="title">医智成果累计变现率</p>
              <div class="bottom-box">
                <div class="text textColor3">{{dialogData.num3}}</div>
                <div class="img">
                  <img src="../assets/images/zhishichanquan3.png" alt=""/>
                </div>
              </div>
            </div>
          </div>
          <div class="block_2_2">
            <div class="block-box">
              <p class="title">医智成果累计变现金额</p>
              <div class="bottom-box">
                <div class="text textColor4">¥{{dialogData.num4}}</div>
                <div class="img">
                  <img src="../assets/images/zhishichanquan4.png" alt=""/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 今日平均客单均价情况 -->
        <div class="container1 container clearfix" v-if="type === 'pingjunkedanjian'">
          <div class="block_2_1">
            <p class="title">客单均价情况</p>
            <div class="block-box">
              <BarChart
                  title="理论客单均价"
                  :subTitle="dialogData.block1.subTitle"
                  :type="2"
                  :legendType="2"
                  :xAxisType="1"
                  :data1="dialogData.block1.data1"
                  :data2="dialogData.block1.data2"
                  :barColorList="dialogData.block1.barColorList"
              ></BarChart>
            </div>
            <div class="block-box">
              <BarChart
                  title="流失客单总价"
                  :subTitle="dialogData.block2.subTitle"
                  :type="2"
                  :legendType="2"
                  :xAxisType="1"
                  :data1="dialogData.block2.data1"
                  :data2="dialogData.block2.data2"
                  :barColorList="dialogData.block2.barColorList"
              ></BarChart>
            </div>
          </div>
          <div class="block_2_1">
            <p class="title">复购情况</p>
            <div class="block-box">
              <LineChart
                  title="复购率"
                  :subTitle="dialogData.block3.subTitle"
                  :type="2"
                  :legendType="2"
                  :data1="dialogData.block3.data1"
                  :data2="dialogData.block3.data2"
                  :lineColorList="dialogData.block3.lineColorList"
              ></LineChart>
            </div>
            <div class="block-box">
              <LineChart
                  title="复购金额"
                  :subTitle="dialogData.block4.subTitle"
                  :type="2"
                  :legendType="2"
                  :data1="dialogData.block4.data1"
                  :data2="dialogData.block4.data2"
                  :lineColorList="dialogData.block4.lineColorList"
              ></LineChart>
            </div>
          </div>
          <p class="title title1">平均客单均价情况</p>
        </div>
        <!-- 合作医院数 -->
        <div class="container clearfix" v-if="type === 'hezuoyiyuan'">
          <div class="block_2_2">
            <PieChart
                title="合作医院等级分布"
                :data="dialogData.block1.data"
                :type="dialogData.block1.type"
            ></PieChart>
          </div>
          <div class="block_2_2">
            <PieChart
                title="合作医院类别分布"
                :data="dialogData.block2.data"
                :type="dialogData.block2.type"
                :addressType="3"
            ></PieChart>
          </div>
          <div class="block_2_2 he-zuo-yi-yuan-shu">
            <div class="cell-box fl">
              <CircleProgress :type="12" :data="dialogData.block3[0].value"></CircleProgress>
              <span>{{dialogData.block3[0].name}}
                <img :src="require('../assets/images/' + dialogData.block3[0].imgUrl )" alt="">
              </span>
              <p>{{dialogData.block3[0].count}}</p>
            </div>
            <div class="cell-box fr">
              <CircleProgress :type="13" :data="dialogData.block3[1].value"></CircleProgress>
              <span>{{dialogData.block3[1].name}}
                <img :src="require('../assets/images/' + dialogData.block3[1].imgUrl )" alt="">
              </span>
              <p>{{dialogData.block3[1].count}}</p>
            </div>
          </div>
          <div class="block_2_2 he-zuo-yi-yuan-shu">
            <div class="cell-box fl">
              <CircleProgress :type="14" :data="dialogData.block4[0].value"></CircleProgress>
              <span>{{dialogData.block4[0].name}}
                <img :src="require('../assets/images/' + dialogData.block4[0].imgUrl )" alt="">
              </span>
              <p>{{dialogData.block4[0].count}}</p>
            </div>
            <div class="cell-box fr">
              <CircleProgress :type="15" :data="dialogData.block4[1].value"></CircleProgress>
              <span>{{dialogData.block4[1].name}}
                <img :src="require('../assets/images/' + dialogData.block4[1].imgUrl )" alt="">
              </span>
              <p>{{dialogData.block4[1].count}}</p>
            </div>
          </div>
        </div>
        <!-- 康复任务累计数量 -->
        <div class="container clearfix" v-if="type === 'kangfurenwu'">
          <div class="block_2_2 block_2_2_left">
            <p class="title subtitle">各类别康复任务数量</p>
            <div class="cell-box fl">
              <BarChart
                  title=""
                  :subTitle="dialogData.chart1.subTitle"
                  :type="dialogData.chart1.type"
                  :legendType="dialogData.chart1.legendType"
                  :xAxisType="dialogData.chart1.xAxisType"
                  :data1="dialogData.chart1.data1"
                  :barColorList="dialogData.chart1.barColorList"
              ></BarChart>
            </div>
            <div class="cell-box fl">
              <BarChart
                  title=""
                  :subTitle="dialogData.chart2.subTitle"
                  :type="dialogData.chart2.type"
                  :legendType="dialogData.chart2.legendType"
                  :xAxisType="dialogData.chart2.xAxisType"
                  :data1="dialogData.chart2.data1"
                  :barColorList="dialogData.chart2.barColorList"
              ></BarChart>
            </div>
          </div>
          <div class="block_2_2 block_2_2_right">
            <p class="title subtitle">各类别康复任务完成率</p>
            <div class="img-box">
              <div class="top">
                <div class="left fl"></div>
                <div class="right fr">
                  <p>{{dialogData.chart3.num1}}</p>
                  <span>日常任务</span>
                </div>
              </div>
              <div class="bottom">
                <div class="left fl"></div>
                <div class="right fr">
                  <p>{{dialogData.chart3.num2}}</p>
                  <span>调查问卷</span>
                </div>
              </div>
            </div>
          </div>
          <div class="block_2_2 block_2_2_left">
            <p class="title subtitle">各类别康复任务复制量</p>
            <div class="cell-box fl">
              <BarChart
                  title=""
                  :subTitle="dialogData.chart4.subTitle"
                  :type="dialogData.chart4.type"
                  :legendType="dialogData.chart4.legendType"
                  :xAxisType="dialogData.chart4.xAxisType"
                  :data1="dialogData.chart4.data1"
                  :barColorList="dialogData.chart4.barColorList"
              ></BarChart>
            </div>
            <div class="cell-box fl">
              <BarChart
                  title=""
                  :subTitle="dialogData.chart5.subTitle"
                  :type="dialogData.chart5.type"
                  :legendType="dialogData.chart5.legendType"
                  :xAxisType="dialogData.chart5.xAxisType"
                  :data1="dialogData.chart5.data1"
                  :barColorList="dialogData.chart5.barColorList"
              ></BarChart>
            </div>
          </div>
          <div class="block_2_2 block_2_2_right">
            <p class="title subtitle">各类别康复任务反馈率</p>
            <div class="img-box img-box-bottom">
              <div class="top">
                <div class="left fl"></div>
                <div class="right fr">
                  <p>{{dialogData.chart6.num1}}</p>
                  <span>日常任务</span>
                </div>
              </div>
              <div class="bottom">
                <div class="left fl"></div>
                <div class="right fr">
                  <p>{{dialogData.chart6.num2}}</p>
                  <span>调查问卷</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 医院详情 -->
        <div class="container1 container yi-yuan-xiang-qing" v-if="type === 'yiyuanxiangqing'">
          <div class="top-box clearfix">
            <div class="block-left shadow fl">
              <p class="subtitle">医院信息</p>
              <div class="img-box img-box1">
                <img class="img" src="../assets/images/hospital.png" alt=""/>
              </div>
              <div class="hospital-info">
                <p class="name">{{ hospitalData.name }}</p>
                <p class="type-info">
                  {{ hospitalData.type }}<span>{{ hospitalData.level }}</span>
                </p>
              </div>
            </div>
            <div class="block-left shadow fl">
              <p class="subtitle">合作科室</p>
              <div class="img-box img-box2">
                <img src="../assets/images/hospital1.png" alt=""/>
                <p>{{hospitalData.department.length}}</p>
              </div>
              <div class="department-detail">
                <div
                    class="cell"
                    v-for="(department, index) in hospitalData.department"
                    :key="index"
                >
                  {{ department }}
                </div>
              </div>
            </div>
            <div class="block-left shadow fl">
              <p class="subtitle">医生数</p>
              <div class="img-box img-box3 clearfix">
                <div class="left fl">
                  <div>
                    <img src="../assets/images/hospital2.png" alt=""/>
                    <p class="left-color">{{ hospitalData.doctor.huoyue }}</p>
                  </div>
                  <span class="text">活跃医生数</span>
                </div>
                <div class="right fr">
                  <div>
                    <img src="../assets/images/hospital3.png" alt=""/>
                    <p class="right-color">{{ hospitalData.doctor.hezuo }}</p>
                  </div>
                  <span class="text">合作医生数</span>
                </div>
              </div>
            </div>
            <div class="block-right fr">
              <div class="top shadow">
                <p class="name">患者购买率</p>
                <p class="value">{{ hospitalData.goumailv }}</p>
              </div>
              <div class="bottom shadow">
                <p class="name">产品覆盖率</p>
                <p class="value">{{ hospitalData.fugailv }}</p>
              </div>
            </div>
          </div>
          <div class="middle-box shadow">
            <p class="subtitle">今日数据统计</p>
            <div class="cell-box clearfix">
              <div
                  class="cell fl"
                  v-for="(today, index) in hospitalDataToday"
                  :key="index"
              >
                <img class="bg-img" :src="require('../assets/images/' + today.img)" alt=""/>
                <p class="name">
                  {{ today.name }}
                  <img :src="require('../assets/images/' + today.isUpImg)" alt=""/>
                </p>
                <p class="value">{{ index === 1 ? '¥' + (parseInt(today.value) / 10000).toFixed(2) + '万': today.value}}</p>
              </div>
            </div>
          </div>
          <div class="bottom-box shadow">
            <p class="subtitle">累积数据统计</p>
            <div class="cell-box clearfix">
              <div
                  class="cell fl"
                  v-for="(total, index) in hospitalData.total"
                  :key="index"
              >
                <img class="bg-img" :src="require('../assets/images/' + total.img)" alt=""/>
                <p class="name">
                  {{ total.name }}
                </p>
                <p class="value">{{ total.value }}</p>
              </div>
            </div>
          </div>
          <p class="title title1">医院详情</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>

  import {Bus} from '../utils/bus.js'
  import {mapState} from "vuex"

  import vHeader from '../components/layout/header/header'
  import breadCrumb from '../components/layout/breadcrumb/breadcrumb'
  import vPanel from '../components/layout/panel/panel'
  import chartPanel from '../components/layout/panel/chartPanel'

  import Dialog from "@/components/Dialog.vue"
  import DoublePieChart from "@/components/chart/doublePie_chart"
  import BarChart from "@/components/chart/bar_chart.vue"
  import LineChart from "@/components/chart/line_chart.vue"
  import PieChart from "@/components/chart/pie_chart.vue"
  import radarChart from "@/components/chart/radar_chart.vue"
  import CircleProgress from "@/components/chart/circle_progress.vue"
 import CircleProgressTwo from "@/components/chart/circle_progress_two.vue"
  export default {
    name: "home",
    components: {
      vHeader,
      breadCrumb,
      vPanel,
      chartPanel,
      DoublePieChart,
      BarChart,
      LineChart,
      PieChart,
      radarChart,
      CircleProgress,
      CircleProgressTwo,
      Dialog
    },

    data() {
      return {
        isShow: false,
        type: 1,
        position: "middle",
        // 省
        provinces: null,
        provincesText: null,
        // 市
        citys: null,
        citysText: null,
        // 医院详情json
        hospitalData: null,
        hospitalId: null,
        // 弹窗需要json数据
        dialogData: null
      }
    },
    computed: {
      ...mapState(["mapData"]),
      ...mapState(["homeData"]),
      /**
       * 根据全国,省,市来统计今日交易成果**/
      jinrijiaoyichengguo() {
        let jinrijiaoyichengguo = 0
        let path = this.$route.path.replace(/\//g, '')
        let chartData = this.homeData.hospitalData
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            chartData = chartData.filter(item => {
              return item.cityName === cityName
            })
            chartData.forEach((hospital => {
              jinrijiaoyichengguo += Number(hospital.today[0].jinrijiaoyichengguo)
            }))
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName || ''
            chartData = chartData.filter(item => {
              return item.provinceName === provinceName
            })
            chartData.forEach((hospital => {
              jinrijiaoyichengguo += Number(hospital.today[0].jinrijiaoyichengguo)
            }))
            break
          default:
            chartData.forEach((hospital => {
              jinrijiaoyichengguo += Number(hospital.today[0].jinrijiaoyichengguo)
            }))
        }
        return jinrijiaoyichengguo
      },
      leijijiaoyichengguo() {
        let leijijiaoyichengguo = 0
        let path = this.$route.path.replace(/\//g, '')
        let chartData = this.homeData.hospitalData
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            chartData = chartData.filter(item => {
              return item.cityName === cityName
            })
            chartData.forEach((hospital => {
              leijijiaoyichengguo += Number(hospital.today[0].leijijiaoyichengguo)
            }))
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName || ''
            chartData = chartData.filter(item => {
              return item.provinceName === provinceName
            })
            chartData.forEach((hospital => {
              leijijiaoyichengguo += Number(hospital.today[0].leijijiaoyichengguo)
            }))
            break
          default:
            chartData.forEach((hospital => {
              leijijiaoyichengguo += Number(hospital.today[0].leijijiaoyichengguo)
            }))
        }
        return leijijiaoyichengguo
      },
      hospitalDataToday() {
        let chartData = this.homeData.hospitalData.filter(item => {
          return item.id === this.hospitalId
        })
        return chartData[0].today
      },
    },
    methods: {
      // type类型1-12代表12个弹窗  position指弹窗位置（"left","middle","right"）
      dialog(type, position) {
        this.type = type
        this.isShow = true
        this.position = position
      },
      beforeClose() {
        this.isShow = false
        this.type = 0
      },
      updateChartOptions(obj) {
        Object.keys(obj).forEach((key) => {
          this[key] = obj[key]
        })

        let url = "china" // 文件夹名称 默认全国
        let name = "china" // 文件名称 默认全国
        if (this.$route.query.provinceName) { // 省级
          this.provinces = this.$store.state.mapData.provinces
          this.provincesText = this.$store.state.mapData.provincesText
          url = "province"
          let provinceCh = this.$route.query.provinceName
          name = this.provinces[this.provincesText.indexOf(provinceCh)]
        }

        if (this.$route.query.cityName) { // 市级
          this.citys = this.$store.state.mapData.citys
          this.citysText = this.$store.state.mapData.citysText
          url = "city"
          let citysCh = this.$route.query.cityName
          name = this.citys[this.citysText.indexOf(citysCh)]
        }
        console.log(this.$route.query, url + "/" + name)
        this.dialogData = {}

        if (this.type === "rihuoyue") { // 日活跃医生数量
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").rihuoyue.dialogData
        } else if (this.type === "kaidanshu") { // 今日开单数量
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").kaidanshu.dialogData
        } else if (this.type === "huanjiaowenzhang") { // 患教文章累计数量
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").huanjiaowenzhang.dialogData
        } else if (this.type === "jiaoyichengguo") { // 交易成果
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").jiaoyichengguo.dialogData
        } else if (this.type === "kangfurenwu") { // 康复任务累计数量
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").kangfurenwu.dialogData
        } else if (this.type === "chanpin") { // 产品累计数量
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").chanpin.dialogData
        } else if (this.type === "hezuoyiyuan") { // 合作医院数
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").hezuoyiyuan.dialogData
        } else if (this.type === "hezuokeshi") { // 合作科室数
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").hezuokeshi.dialogData
        } else if (this.type === "hezuoyisheng") { // 合作医生数
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").hezuoyisheng.dialogData
        } else if (this.type === "hezuohuanzhe") { // 合作患者数
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").hezuohuanzhe.dialogData
        } else if (this.type === "goumailv") { // 今日购买率
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").goumailv.dialogData
        } else if (this.type === "pingjunkedanjian") { // 今日平均客单均价情况
          this.dialogData = require("../resources/chartData/" + url + "/" + name + ".json").pingjunkedanjian.dialogData
        } else if (this.type === "yiyuanxiangqing") { // 医院详情
          let hospitalDataDetails = require("../resources/hospitalData/hospital.json")
          this.hospitalData = {}
          hospitalDataDetails.forEach((v, e) => {
            if (v.id == this.hospitalId) {
              this.hospitalData = v
              return
            }
          })
        }
      }
    },
    created() {
      Bus.$on('updateChartOptions', this.updateChartOptions)
    },
    beforeDestroy() {
      Bus.$off('updateChartOptions')
    },
  }
</script>

<style scoped lang="less">
  .home_page {
    color: #fff;
    height: 100%;
    position: relative;
    .content_box {
      position: relative;
      height: calc(100% - 370px);
      margin: 0 60px 36px 60px;
      display: flex;
      justify-content: center;
      align-content: center;

      .routerView_box {
        width: 66%;
        height: 100%;
      }


      .leftPanel_box {
        z-index: 999;
        position: absolute;
        box-sizing: border-box;
        padding: 14px;
        top: 0;
        left: 0;
        width: 530px;
        height: 100%;
        background: url('../assets/images/chartBackGround.png') no-repeat center;
        background-size: 100% 100%;

      }

      .rightPanel_box {
        z-index: 999;
        position: absolute;
        box-sizing: border-box;
        padding: 14px;
        top: 0;
        width: 530px;
        height: 100%;
        right: 0;
        background: url('../assets/images/chartBackGround.png') no-repeat center;
        background-size: 100% 100%;
      }
    }

    .routerView_box_fixed {
      position: fixed;
      z-index: 100;
      top: 150px;
      left: 100px;
      right: 100px;
      bottom: 0px;
      /*height: 700px;*/
    }
  }

  .slot {
    .container {
      height: 100%;

      .title {
        padding: 10% 0;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: bold;
        text-align: center;
        color: #fff;
        line-height: 25px;
      }
    }

    .container1 {
      position: relative;
      padding-top: 50px;

      .title1 {
        position: absolute;
        top: 0;
        width: 100%;
        font-size: 20px;
        padding: 0;
      }
    }

    // 大块   横行 1    竖行 2
    .block_1_2 {
      width: 100%;
      padding: 30px 15px 15px;
      background: #061b4d;
      height: 48%;
      border-radius: 10px;
      box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;

      &:first-child {
        margin-bottom: 20px;
      }

      .top {
        position: relative;
        margin-bottom: 7px;
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #fff;
        line-height: 25px;

        p.subtitle {
          width: 40%;
          margin: 0 auto;
          padding: 0;
        }

        .right {
          position: absolute;
          right: 149px;
          top: 0;

          span {
            font-size: 24px;
            margin-left: 20px;
          }
        }
      }

      .cell {
        width: 33%;
        height: 88%;
        margin-right: 3px;
        float: left;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    // 大块   横行 3    竖行 1
    .block_3_1 {
      width: 30%;
      height: 100%;
      float: left;
      margin-right: 5%;
      padding: 15px;
      background: #061b4d;
      border-radius: 10px;
      box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;

      &:last-child {
        margin-right: 0;
      }
    }

    .block_2_2 {
      width: 48%;
      height: 48%;
      float: left;
      margin: 0 4% 25px 0;
      background: #061b4d;
      padding: 15px;
      border-radius: 10px;
      box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;

      &:nth-child(2),
      &:nth-child(4) {
        margin-right: 0;
      }

      &:nth-child(3),
      &:nth-child(4) {
        margin-bottom: 0;
      }
    }

    .block_1_1 {
      width: 66%;
      height: 48%;
      margin-left: 17%;
      padding: 15px;
      float: left;
      background: #061b4d;
      border-radius: 10px;
      box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;
    }

    .block_2_1 {
      width: 48%;
      height: 100%;
      float: left;
      margin: 0 4% 0 0;
      background: #061b4d;
      border-radius: 10px;
      box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;

      &:nth-child(2) {
        margin-right: 0;
      }

      p.title {
        margin-top: 5%;
        padding: 0;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: bold;
        color: #fff;
        line-height: 25px;
      }

      div.block-box {
        height: 46%;
      }
    }

    // 非图表样式
    .block_2_2 {
      .block-box {
        padding: 65px 27px 18px 45px;
        height: 100%;

        p.title {
          padding: 0;
          text-align: left;
          margin-bottom: 28px;
        }

        .bottom-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 175px;

          .img {
            width: 35%;

            img {
              width: 100%;
            }
          }

          .text {
            font-size: 40px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            line-height: 56px;
            position: relative;
          }

          .textColor1 {
            color: #00a0fb;

            &::before {
              content: attr(text);
              position: absolute;
              z-index: 10;
              color:#ea1ade;
              -webkit-mask: linear-gradient(to top, #ea1ade, transparent );
            }
          }

          .textColor2 {
            color: #c52d7b;

            &::before {
              content: attr(text);
              position: absolute;
              z-index: 10;
              color:#7d1bf5;
              -webkit-mask: linear-gradient(to top, #7d1bf5, transparent );
            }
          }

          .textColor3 {
            background: linear-gradient(180deg, #cd2f2f 0%, #ff9e00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .textColor4 {
            background: linear-gradient(180deg, #00ffc7 0%, #364dfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }

      // 今日开单数量
      p.subtitle {
        padding: 3% 0 0;
      }

      .kds-block {
        margin-top: 40px;
        padding: 0 10%;

        .left,
        .right {
          width: 32%;

          .top {
            position: relative;

            img {
              width: 100%;
            }

            span.name {
              position: absolute;
              left: 32%;
              top: 29%;
            }

            span.num {
              position: absolute;
              left: 50%;
              top: 60%;
              transform: translate(-50%, -50%);
              font-size: 20px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              line-height: 28px;
              background: linear-gradient(180deg, #00bafa 0%, #9f36fa 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }

          p,
          span.name {
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #fff;
            line-height: 22px;
          }

          p {
            margin-top: 10%;
            text-align: center;
          }
        }
      }
    }

    // 合作医院数
    .he-zuo-yi-yuan-shu {
      background: none;
      box-shadow: none;
      padding: 0;

      .cell-box {
        width: 257px;
        height: 100%;
        background: #061b4d;
        padding: 43px 0;
        border-radius: 10px;
        box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;

        span {
          display: block;
          margin-top: 38px;
          font-size: 18px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #fff;
          line-height: 25px;
          text-align: center;

          img {
            width: 20px;
            vertical-align: text-top;
          }
        }

        p {
          font-size: 28px;
          text-align: center;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #fff;
          line-height: 40px;
          margin-top: 12px;
        }
      }
    }

    // 康复任务累计数量
    .block_2_2_left {
      width: 65%;

      p.subtitle {
        padding: 1.5% 0 0;
      }

      .cell-box {
        width: 49%;
        height: 85%;
      }
    }

    .block_2_2_right {
      width: 30%;

      .img-box {
        width: 247px;
        height: 247px;
        margin: 30px auto 0;
        background: url("../assets/images/kangfurenwu1.png");
        background-repeat: no-repeat;
        background-size: contain;
        padding: 68px 80px;

        .top,
        .bottom {
          height: 42px;

          .left {
            width: 7px;
            border-radius: 4px;
            height: 42px;
          }

          .right {
            p {
              font-size: 20px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 20px;
              margin-bottom: 6px;
            }

            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 14px;
            }
          }
        }

        .top {
          .left {
            background: linear-gradient(180deg, #ffe654 0%, #ffc215 100%);
          }
        }

        .bottom {
          margin-top: 24px;

          .left {
            background: linear-gradient(180deg, #679aff 0%, #322bfe 100%);
          }
        }
      }

      .img-box-bottom {
        background: url("../assets/images/kangfurenwu2.png");
        background-repeat: no-repeat;
        background-size: contain;

        .top {
          .left {
            background: linear-gradient(180deg, #43fbc4 0%, #79effa 100%);
          }
        }

        .bottom {
          .left {
            background: linear-gradient(180deg, #ff712a 0%, #ff8a50 100%);
          }
        }
      }
    }

    // 购买率
    .gou-mai-lv {
      .gml-box {
        height: 144px;
        margin-top: 64px;
        padding: 0 108px 0 86px;

        .img-box {
          width: 144px;
          height: 144px;
          background: url("../assets/images/goumailv.png");
          background-repeat: no-repeat;
          background-size: contain;
          padding: 54px 0;

          .gml-img-text {
            text-align: center;
            font-size: 24px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #fff;
            line-height: 33px;
          }
        }

        .gml-text {
          .top,
          .bottom {
            height: 42px;

            .left {
              width: 7px;
              border-radius: 4px;
              height: 42px;
              margin-right: 12px;
            }

            .right {
              p {
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #fff;
                line-height: 20px;
                margin-bottom: 6px;
              }

              span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #fff;
                line-height: 14px;
              }
            }
          }

          .top {
            margin-top: 32px;

            .left {
              background: linear-gradient(180deg, #ffe654 0%, #ffc215 100%);
            }
          }

          .bottom {
            margin-top: 24px;

            .left {
              background: linear-gradient(180deg, #679aff 0%, #322bfe 100%);
            }
          }
        }
      }
    }

    // 产品累计数量
    .chan-pin-shu {
      .cps-box {
        margin-top: 27px;

        .cell {
          width: 98px;
          height: 126px;
          margin: 0 11px 15px 0;

          &:nth-child(5),
          &:nth-child(10) {
            margin-right: 0;
          }

          p {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fff;
            line-height: 20px;
            margin-top: 8px;
            text-align: center;
          }
        }
      }

      .cps-box-scroll {
        height: 255px;
        overflow: scroll;
      }
    }

    // 医生活跃
    .yi-sheng-huo-yue {
      p.right {
        background: url("../assets/images/icon-person.png");
        background-position: left center;
        background-repeat: no-repeat;
        background-size: 23px;
        padding-left: 28px;
      }
    }

    // 医院详情
    .yi-yuan-xiang-qing {
      .shadow {
        padding: 15px;
        border-radius: 10px;
        box-shadow: inset -3px -3px 11px #0f245d, inset 3px 3px 11px #0f245d;
      }

      .top-box {
        height: 218px;

        .block-left {
          width: 300px;
          height: 218px;
          margin-right: 21px;

          .subtitle {
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fff;
            line-height: 25px;
          }

          .img-box {
            margin: 8px 0 7px;
            position: relative;

            img {
              width: 90px;
              display: block;
              margin: 0 auto;
            }

            .img {
              width: 74px;
            }
          }

          .img-box2 {
            p {
              position: absolute;
              top: 30px;
              left: 129px;
              font-size: 24px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #fff;
              line-height: 33px;
            }
          }

          .img-box3 {
            padding: 0 30px;

            .left,
            .right {
              width: 90px;

              div {
                margin-bottom: 15px;
                position: relative;

                p {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 20px;
                  font-family: PingFang-SC-Bold, PingFang-SC;
                  font-weight: bold;
                  line-height: 28px;
                }

                p.left-color {
                  background: linear-gradient(180deg, #00bafa 0%, #9f36fa 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }

                p.right-color {
                  background: linear-gradient(180deg, #cd862f 0%, #cd2f2f 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }

              .text {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #fff;
                line-height: 22px;
              }
            }
          }

          .department-detail {
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            height: 66px;

            div {
              width: 71px;
              height: 28px;
              // background: #3f36fa;
              border-radius: 4px;
              border: 1px solid #3f36fa;
              font-size: 14px;
              font-family: PingFang-SC-Regular, PingFang-SC;
              font-weight: 400;
              color: #fff;
              line-height: 26px;
              text-align: center;
              margin: 0 5px 5px 0;

              &:nth-child(3) {
                margin-right: 0;
              }
            }
          }

          .hospital-info {
            margin-top: 13px;

            p {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 20px;
              text-align: center;
            }

            p.type-info {
              margin-top: 12px;

              span {
                margin-left: 20px;
              }
            }
          }
        }

        .block-right {
          height: 218px;

          div {
            width: 221px;
            height: 102px;
            text-align: center;

            p.name {
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 25px;
            }

            p.value {
              font-size: 22px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #fff;
              line-height: 30px;
              margin-top: 15px;
            }
          }

          .top {
            margin-bottom: 13px;

            p.value {
              background-image: -webkit-linear-gradient(top, #7366fd, #fa36f6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }

          .bottom {
            p.value {
              background-image: -webkit-linear-gradient(top, #ff3636, #ff9848);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
      }

      .middle-box {
        margin: 22px 0;
      }

      .middle-box,
      .bottom-box {
        height: 208px;

        .subtitle {
          text-align: center;
          margin: 10px 0 33px;
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
          line-height: 25px;
        }

        .cell-box {
          height: 100px;
          padding: 0 28px;

          .cell {
            position: relative;
            width: 210px;
            height: 105px;
            margin-right: 12px;

            &:last-child {
              margin-right: 0;
            }

            .bg-img {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }

            .name {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 22px;
              position: absolute;
              top: 26px;
              left: 10px;

              img {
                width: 15px;
              }
            }

            .value {
              font-size: 18px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #fff;
              line-height: 25px;
              position: absolute;
              left: 10px;
              top: 53px;
            }
          }
        }
      }
    }
  }
</style>
