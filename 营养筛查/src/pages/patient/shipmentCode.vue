/** *@desc 出货码 *@author houpai *@date 2019/10/29 16:49:25 */
<template>
  <div class="shipmentCode_page" id="orderQrcode">
    <!-- <common-header
        :share-disabled="false"
        :custom-title="'自提取货码'"
    ></common-header> -->
    <commonHeader
              :share-disabled="true"
              :custom-title="'营养筛查'"
              :header-show="true"
              :title="'自提取货码'"
      ></commonHeader>
    <div class="v-body">
      <div class="v-qrCode">
        <div class="v-bottom">
<!--          <div class="v-title">-->
<!--            取货码-->
<!--          </div>-->
          <ul class="v-code">
            <li v-for="(item,index) in shipmentCode" :key="index">
              {{item}}
            </li>
          </ul>
<!--          <div class="v-message">-->
<!--            产品自提，请到自提站点的自动售货机，输入自提码，交易过程中请确保不要泄露个人信息，谨防上当-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import commonHeader from '../../components/commonHeader/common_header'

  export default {
    name: "shipmentCode",
    components: {
      commonHeader
    },
    data() {
      return {
        shipmentCode: [], // 出货码
      }
    },
    props: {
      code: {
        type: String,
        default() {
          return ''
        }
      }
    },

    created() {
      if (this.$route.query.shipmentCode) {
        try {
          let shipmentCode = this.$route.query.shipmentCode
          if (typeof shipmentCode === 'number') {
            shipmentCode += ''
          }
          this.shipmentCode = shipmentCode.split('')
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  #orderQrcode {
    width: 100%;
    // height: 90%;

    .v-body {
      width: 100%;
      height: 100%;
      font-size: 16px;
      padding: 0 12px 0 12px;
      // margin-top: 15px;
      /*<!--color: @textBlack;-->*/
      display: flex;
      flex-direction: column;
      /*justify-content: center;*/
      background: url("../../assets/img/codeback.png") no-repeat;
      background-position: 19px 59px; 
      background-size: 330px auto;

      .v-qrCode {
        width: 100%;
        // height: 88px;
        margin-top: 288px;
        padding-bottom: 200px;
        /*background: url("../../assets/img/qrcodeBack.png") no-repeat center;*/
        background-size: 100% 100%;

        .v-bottom {
          .v-title {
            font-weight: bold;
            text-align: center;
            padding: 45px 0;
            font-size: 16px;
            color: rgba(51, 51, 51, 1);
            line-height: 22px;
          }

          .v-code {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 60px 0 60px;

            li {
              width: 34px;
              height: 34px;
              background: linear-gradient(180deg, rgba(0, 105, 255, 1) 1%, rgba(1, 128, 255, 1) 100%);
              // box-shadow: 0px 1px 2px 0px rgba(205, 109, 13, 1);
              border-radius: 4px;
              line-height: 38px;
              font-size: 16px;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              text-align: center;
              margin: 10px;
            }
          }

          .v-message {
            padding: 20px;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);

          }
        }
      }
    }
  }
</style>
