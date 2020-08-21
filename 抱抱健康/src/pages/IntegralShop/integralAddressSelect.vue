/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: integralAddressSelect
* @function: 地址选择页 * @date: 2020/1/3 * @time: 9:40 * * */
<template>
  <div id="integralAddressSelect">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="true"
    ></common-header>
    <div class="main" v-if="!loading">
      <div class="main_box" v-if="objData.length != 0">
        <div
          class="content"
          v-for="(item, index) in objData"
          :key="index"
          @click="onSelect(item)"
        >
          <div class="content_left">
            <div class="left_top">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="phone">
                {{ item.phone }}
              </div>
              <div class="status" v-if="item.status == 0">
                <img
                  src="../../assets/images/integralAddressSelectState.png"
                  alt=""
                />
              </div>
            </div>
            <div class="left_bottom">
              {{ item.address + item.pointnum }}
            </div>
          </div>
          <div class="content_right" @click.stop="goUpdate(item)">
            <img src="../../assets/images/integralAddressSelect.png" alt="" />
            <span>
              编辑
            </span>
          </div>
        </div>
      </div>
      <div class="main_box" v-else>
        <img src="../../assets/images/unIntegralAddressSelect.png" alt="" />
        <p>暂无地址</p>
        <span>您尚未添加收货地址</span>
      </div>
      <div class="foot">
        <van-button type="default" @click="goAdd()">新增地址</van-button>
      </div>
    </div>

    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import integralAddressUpdate from "./integralAddressUpdate";

export default {
  name: "integralAddressSelect",
  components: {
    commonHeader
  },
  data() {
    return {
      loading: true,
      title: "收货地址",
      customTitle: this.$route.query.type ? "礼品商城" : "产品购买",
      isPatient: true,
      objData: [
        // {
        //   id: 111,
        //   businessid: 111,
        //   status: 0, //0是默认1是非默认
        //   name: "张三",
        //   phone: "15142190987",
        //   address: "辽宁省沈阳市",
        //   pointnum: "辽宁省沈阳市辽宁省沈阳市分都很方便2",
        //   isdel: 0
        // }
      ]
    };
  },
  created() {
    this.getListRUserAddress();
  },
  mounted() {},
  methods: {
    onSelect(obj) {
      //选择地址
      localStorage.setItem("productGo", true);
      this.$store.commit("Address/addressData", obj);
      this.$router.go(-1);
    },
    goUpdate(obj) {
      //跳转编辑地址页
      this.$store.commit("Address/addressObj", obj);
      this.$router.push({ name: "integralAddressUpdate" });
    },
    goAdd() {
      //跳转新增地址页
      let obj = {
        id: "",
        status: 1,
        name: "",
        phone: "",
        address: "",
        pointnum: ""
      };
      this.$store.commit("Address/addressObj", obj);
      this.$router.push({
        name: "integralAddressUpdate",
        query: { num: this.objData.length }
      });
    },
    getListRUserAddress() {
      this.loading = true;
      this.$http
        .request({
          method: "get",
          url: "/RUserAddressController/getListRUserAddress",
          body: {}
        })
        .then(res => {
          this.loading = false;
          console.log(res);
          if (res.data.success) {
            console.log("查询成功");
            this.objData = res.data.data;
          } else {
            //失败
            this.$toast("查询失败");
          }
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#integralAddressSelect {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;

    .main_box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 54/375 * 100vw;
      .padding(15, 0, 0, 0);
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      text-align: center;

      img {
        .width(205);
        .padding(78, 0, 0, 0);
      }

      p {
        .padding(29, 0, 15, 0);
        font-weight: bold;
        color: @titleColor;
        .fontSize(18);
      }

      span {
        .fontSize(16);
        color: @qianSpan;
      }

      .content {
        background-color: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);
        .margin(0, 0, 20, 0);
        .padding(13, 0, 13, 10);
        display: flex;
        align-items: center;

        .content_left {
          .width(282);

          .left_top {
            .padding(0, 0, 10, 0);
            display: flex;

            .name {
              font-weight: bold;
              color: @titleColor;
              .lineHeight(22);
              .fontSize(18);
              .padding(0, 20, 0, 0);
            }

            .phone {
              .fontSize(16);
              .lineHeight(22);
              color: @titleColor;
              .padding(0, 20, 0, 0);
            }

            .status {
              display: flex;
              align-items: center;

              img {
                padding: 0;
                .width(38);
                .height(20);
              }
            }
          }

          .left_bottom {
            text-align: left;
            .lineHeight(20);
            .fontSize(16);
          }
        }

        .content_right {
          .padding(2, 0, 0, 0);
          .width(55);
          .height(40);
          border-left: 2/375 * 100vw solid @borderLeftColor;
          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            padding: 0;
            .width(20);
            .height(18);
          }

          span {
            .padding(6, 0, 0, 0);
            .fontSize(14);
            .lineHeight(14);
            color: @qianSpan;
          }
        }
      }
    }

    .foot {
      position: absolute;
      bottom: 10/375 * 100vw;
      left: 0;
      right: 0;

      button {
        .fontSize(18);
        width: 100%;
        background-image: linear-gradient(
          to right,
          @buttonColor,
          @buttonRightColorBlue
        );
        border-radius: 10px;
        color: @fontOne;
      }
    }
  }
}
</style>
