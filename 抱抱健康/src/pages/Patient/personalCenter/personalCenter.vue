<template>
  <div class="personalCenter_page">
    <common-header
        :share-disabled="true"
        :title="'个人中心'"
        :header-show="true"
        :custom-title="'康复中心'"></common-header>
    <div class="personalCenter_banner">
      <div class="patient_photo">
        <!--        <img src="../../../assets/images/patient.png" alt="">-->
        <img :src="url" alt=""/>
        <span>{{ name }}</span>
      </div>
    </div>
    <ul class="personalCenter_menu">
      <li @click.stop="routerLink('patientMessageComplete')">
        <img src="../../../assets/images/personMessage.png" alt=""/>
        <span>个人信息</span>
        <van-icon name="arrow"></van-icon>
      </li>
      <li @click.stop="routerLink('agreement', '1')">
        <img src="../../../assets/images/agreement.png" alt=""/>
        <span>用户协议</span>
        <van-icon name="arrow"></van-icon>
      </li>
      <li @click.stop="routerLink('agreement', '2')">
        <img src="../../../assets/images/privacyPolicy.png" alt=""/>
        <span>隐私政策</span>
        <van-icon name="arrow"></van-icon>
      </li>
      <li @click.stop="routerLink('agreement', '3')">
        <img src="../../../assets/images/jiankangbi.png" alt=""/>
        <span>健康币规则</span>
        <van-icon name="arrow"></van-icon>
      </li>
      <li>
        <img src="../../../assets/images/customerService.png" alt=""/>
        <span>客服电话</span>
        <a href="tel:4000909975">4000909975</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "personalCenter",
    components: {
      commonHeader
    },
    data() {
      return {
        name: "", // 患者姓名
        url: "" // 患者头像
      }
    },
    methods: {
      /**
       * 路由跳转
       * @params routerName
       * @params routerParams**/
      routerLink(routerName, routerParams) {
        if (routerName && typeof routerName === "string") {
          if (routerParams && typeof routerParams === "string") {
            try {
              this.$router.push({
                name: routerName,
                params: {
                  type: routerParams
                }
              })
            } catch (e) {
              console.log(e)
            }
          } else {
            try {
              this.$router.push({name: routerName})
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          return false
        }
      },

      /**
       * 获取用户姓名和头像**/
      getPatientMessage() {
        this.$http
          .request({
            method: "get",
            url: "/RPatientController/selectByPrimarySS",
            body: {}
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              this.name = res.data.data.pname
              this.url = res.data.data.purl
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    created() {
      this.getPatientMessage()
    }
  }
</script>

<style scoped lang="less">
  .personalCenter_page {
    box-sizing: border-box;
    .padding(44,12,0,12);

    .personalCenter_banner {
      .margin(0, 0, 9, 0);
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      /*<!--.height(72);-->*/
      .margin(30, 0, 30, 0);

      .patient_photo {
        display: flex;
        align-items: center;

        img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
        }

        span {
          margin-left: 20px;
          color: #000000;
          font-size: 18px;
        }
      }
    }

    .personalCenter_menu {
      width: 100%;
      background-color: #fff;
      border-radius: 10px;

      li {
        .lineHeight(46);
        .height(46);
        border-bottom: 1px solid #f1f1f1;
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 25px;
          height: 30px;
          object-fit: contain;
          margin: 0 12px;
        }

        a {
          color: #999;
          flex: 1;
          text-align: right;
          margin-right: 12px;
          font-size: 16px;
        }

        span {
          color: #333;
          font-size: 16px;
        }

        /deep/ .van-icon {
          flex: 1;
          text-align: right;
          margin-right: 12px;
          color: #333;
          font-size: 16px;
        }
      }
    }
  }
</style>
