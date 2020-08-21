<!--
  作者:许鹏
  用途:营养师审核
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月29日
  Time: 15:16
  Application: Nutritionist Audit
  State: page
-->
<template>
  <div id="audit">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <!-- <common_header :customTitle="title" /> -->
    <van-tabs v-model="active" @change="onClick">
      <van-tab title="未提交"></van-tab>
      <van-tab title="已提交"></van-tab>
      <div id="nr" v-show="view">
        <div
          class="tag"
          v-for="(item, index) in list"
          :key="index"
          @click="jump(item.pricriptionId)"
        >
          <div class="backgrd" v-if="item.modifyStatus == 1"></div>
          <div class="tag_n">
            <span class="l n">{{ item.patientName }}</span>
            <span class="r y" v-if="item.checkStatus == 0">未提交</span>
            <span class="r y" v-if="item.checkStatus == 1">审核中…</span>
            <span class="r lv" v-if="item.checkStatus == 2">审核通过</span>
          </div>
          <div class="tag_n">
            <span class="l"
              >{{ item.patientSex
              }}<span class="age">{{ item.patientAge }}岁</span></span
            ><span class="r b">{{ item.doctorIdea }}</span>
          </div>
          <div class="tag_n c">营养产品:{{ item.productName }}</div>
          <div class="tag_n" v-show="last_tag">
            购药状态:<span>已付款</span>
          </div>
        </div>
        <div class="tag">
          <div class="tag_n">
            <span class="l n">赵奎</span><span class="r lv">{{ type }}</span>
          </div>
          <div class="tag_n">
            <span class="l">男<span class="age">35岁</span></span
            ><span class="r b">缺铁性贫血</span>
          </div>
          <div class="tag_n c">
            营养产品:胶原蛋粉 维生素E 补铁口服液 啊飒飒啥事申请1
          </div>
          <div class="tag_n" v-show="last_tag">
            购药状态:<span class="y">已付款</span>
          </div>
        </div>
        <div class="tag">
          <div class="backgrd" v-show="true"></div>
          <div class="tag_n">
            <span class="l n">赵三</span><span class="r y">未提交</span>
          </div>
          <div class="tag_n">
            <span class="l">男<span class="age">35岁</span></span
            ><span class="r b">缺铁性贫血</span>
          </div>
          <div class="tag_n c">
            营养产品:胶原蛋粉 维生素E 补铁口服液 啊飒飒啥事申请1
          </div>
          <div class="tag_n" v-show="last_tag">
            购药状态:<span>已付款</span>
          </div>
        </div>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
export default {
  name: "audit",
  data() {
    return {
      title: "营养师审核",
      customTitle: "营养筛查",
      active: "",
      name: "王大锤",
      position: "内科主任",
      hospital: "中国医科大学附属盛京医院",
      department: "内科",
      time: "2015-0-1",
      view: true,
      type: "",
      last_tag: false,
      list: []
    };
  },
  mounted: function() {
    this.findList(1);
  },
  methods: {
    //点击切换类别
    onClick() {
      // alert(this.active);
      this.view = false;
      if (this.active == "0") {
        this.type = "未提交";
        this.last_tag = false;
        this.findList(1);
      } else {
        this.type = "审核通过";
        this.last_tag = true;
        this.findList(2);
      }
      setTimeout(() => {
        this.view = true;
      }, 1000);
    },
    //列表展示
    findList(key) {
      this.$http
        .request({
          method: "get",
          url: "/RpPrescriptionController/doctorHistoryPrescription",
          body: {
            userType: 1,
            checkStatus: key
          },
          headers: {
            // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
          }
        })
        .then(res => {
          console.log(res);
          this.list = res.data.data;
          this.view = true;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转页面
    jump(key) {
      if (this.active == "0") {
        //跳转到生成营养诊断报告页面
        this.$router.push({
          name: "diagnosis",
          query: {
            prescriptionId: key
          }
        });
      } else {
        //跳转到审核通过营养监测报告页面
        this.$router.push({
          name: "results",
          query: {
            prescriptionId: key,
            type: 1
          }
        });
      }
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style scoped lang="less">
#audit {
  /deep/ .van-tab {
    .fontSize(18);
    .lineHeight(44);
  }

  /deep/ .van-tabs--line .van-tabs__wrap {
    .height(44);
    width: 92%;
    left: 4vw;
    border-radius: 2.7vw;
    top: 42px;
  }

  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 0px;
  }
  /deep/ .van-tabs__line {
    background-color: @mainColor;
  }
  /deep/ .van-tabs--line {
    padding-top: (92 / 375) * 100vw;
  }
  #nr {
    overflow-y: auto;
    margin-top: 2.7vw;
    -webkit-overflow-scrolling: touch;
  }
  .tag {
    .backgrd {
      .width(114);
      .height(95);
      background: url("../../assets/img/yzf.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
    width: 93.5vw;
    /*margin-top: 2.7vw;*/
    background: @fontColorff;
    margin: 0 auto;
    border-radius: 2.7vw;
    margin-bottom: 2.7vw;
    position: relative;
    .tag_n {
      width: 100%;
      height: 12.275vw;
      line-height: 12.275vw;
      border-bottom: 1px solid @backcolor;
      padding-left: 2.7vw;
      padding-right: 2.7vw;
      color: @fontColor66;
      .fontSize(16);
      .l {
        float: left;
        .age {
          margin-left: 10.7vw;
        }
      }
      .r {
        float: right;
        color: @fontColor33;
      }
      .y {
        color: @mainColor;
        font-weight: 400;
      }
      .b {
        color: @fontColor33;
        font-weight: bold;
      }
      .lv {
        color: @mainColor;
      }
      .n {
        color: @fontColor33 !important;
        font-weight: 400;
      }
    }
    .tag_n:last-child {
      border-bottom: 0px;
    }
    .c {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-wrap: break-word;
      -webkit-line-clamp: 1;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /*! autoprefixer: on */
    }
  }
}
</style>
