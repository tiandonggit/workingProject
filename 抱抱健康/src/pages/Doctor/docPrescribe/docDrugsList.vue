/* * @Author: 田东 * @Date: 2020-02-14 16:59:52 * @Last Modified by: 田东 *
@Last Modified time: 2020-02-14 17:23:01 * @Description: 医生开药 产品清单 */

<template>
  <div id="docDrugsList">
    <common-header
      :share-disabled="true"
      :custom-title="'推荐产品'"
      :header-show="true"
      title="产品清单"
    ></common-header>

    <div class="container">
      <div class="block-item" v-for="(item, index) in list" :key="index">
        <div class="top-info">
          <div class="img-box">
            <img :src="item.icon" alt="" />
          </div>
          <div class="right-info">
            <p class="name">{{ item.name }}</p>
            <p class="specification">{{ item.specification }}</p>
            <p class="manufacturer">{{ item.manufacturers }}</p>
            <p class="price-box">
              <span class="activity">
                ¥{{ (item.activityprice / 100).toFixed(2) }}
              </span>
              <span class="price"
                >¥{{ (item.sellingprice / 100).toFixed(2) }}</span
              >
              <span class="num">x{{ item.number }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-box">
      <van-button slot="button" class="next-btn" size="large" @click="confirm">
        确认推荐
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Stepper } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { setTimeout } from "timers";

export default {
  name: "docDrugsList",
  data() {
    return {
      list: []
    };
  },
  components: {
    commonHeader
  },
  computed: {},
  created() {
    this.dataList = JSON.parse(window.localStorage.getItem("docDrugsList"));
    this.list = this.dataList.filter(v => {
      return v.number > 0;
    });
  },
  methods: {
    confirm() {
      let params = [];
      this.list.forEach(v => {
        params.push({ productid: v.id, number: v.number });
      });

      let doctorIM = JSON.parse(JSON.stringify(this.$store.state.DoctorIM));
      let currentSessionId = doctorIM.currentSessionId;
      let patientId = "";
      let chatList = doctorIM.chatList;

      // 匹配到合适的会话id
      for (var i = 0; i < chatList.length; i++) {
        if (chatList[i].imSessionUserList[0].imsessionid === currentSessionId) {
          for (let j = 0; j < chatList[i].imSessionUserList.length; j++) {
              if (chatList[i].imSessionUserList[j].type === 0) {
                patientId = chatList[i].imSessionUserList[j].userid;
              }
          }
        }
      }
      // 提交订单
      this.$http
        .request({
          method: "post",
          url: "ZyOrderController/insertOrUpdate",
          body: {
            list: JSON.stringify(params),
            sessionId: currentSessionId,
            patientId: patientId,
            type: 1
          }
        })
        .then(res => {
          if (res.data.success) {
            // 提交订单成功回调
            window.localStorage.removeItem("docDrugsList");
            this.$router.push({
              name: "docChatIMDetail"
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("加载失败，请检查网络连接");
        });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
</style>
