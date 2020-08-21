/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: integralAddressUpdate
* @function: 新增(修改)地址页 * @date: 2020/1/3 * @time: 9:41 * * */
<template>
  <div id="integralAddressUpdate">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="true"
      :rightContent="isDel"
      :rightClass="{ fontSize: '16px' }"
      @rightContentClick="onClickLeft()"
    ></common-header>
    <div class="main">
      <div class="main_box">
        <div class="box_list">
          <div class="list_left">
            联系人
          </div>
          <div class="list_right">
            <van-field v-model="name" placeholder="请输入联系人" />
          </div>
        </div>
        <div class="box_list">
          <div class="list_left">
            电话号码
          </div>
          <div class="list_right">
            <van-field
              maxlength="11"
              v-model="phone"
              placeholder="请输入电话号码"
            />
          </div>
        </div>
        <div class="box_list">
          <div class="list_left">
            所在地址
          </div>
          <div class="list_right">
            <van-field
              v-model="address"
              @click="selectAddress()"
              readonly
              placeholder="请选择地址"
            />
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="box_list">
          <div class="list_left">
            详细地址
          </div>
          <div class="list_right">
            <van-field
              v-model.trim="pointnum"
              maxLength="100"
              placeholder="街道、小区、楼牌号等"
            />
          </div>
        </div>
        <div class="box_list">
          <div class="list_left">
            设置默认
          </div>
          <div class="list_right">
            <van-switch v-model="status" inactive-color="#CCCCCC" size="18px" />
          </div>
        </div>
      </div>
      <div class="foot">
        <van-button type="default" @click="goAdd()">保存</van-button>
      </div>
    </div>
    <select-address
      v-model="show"
      :title="addressTitle"
      :data="addressData"
      @gitAddress="gitAddress"
    ></select-address>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import selectAddress from "../../components/selectAddress/select_address";
import areaList from "../../assets/js/cs";
export default {
  name: "integralAddressUpdate",
  components: {
    commonHeader,
    selectAddress
  },
  data() {
    return {
      title: "新增地址",
      customTitle: "产品购买",
      isPatient: true,
      status: false, //true是默认false是非默认
      id: 0,
      name: "",
      phone: "",
      address: "",
      pointnum: "",
      isDel: "",
      show: false,
      addressTitle: "所在地址",
      addressData: {}
    };
  },
  created() {
    //地址信息
    this.addressData = areaList.data;
    //缓存里的用户信息,没有为空
    let obj = this.$store.state.Address.addressObj;
    this.id = obj.id;
    console.log(obj);
    if (obj.status == 0) {
      //为0默认
      this.status = true;
    } else if (obj.status == 1) {
      //为1非默认
      this.status = false;
    }
    this.name = obj.name;
    this.phone = obj.phone;
    this.address = obj.address;
    this.pointnum = obj.pointnum;
    //判断是否是新增
    if (this.id != "") {
      this.title = "修改地址";
      //说明不是新增,展示删除按钮
      this.isDel = "删除";
    }
  },
  mounted() {},
  methods: {
    goAdd() {
      //对信息进行验证
      if (this.name == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (this.phone == "") {
        this.$toast("请输入手机号");
        return;
      }
      if (!this.TestPhone(this.phone)) {
        this.$toast("手机号填写错误");
        return;
      }
      if (this.address == "") {
        this.$toast("请选择地址");
        return;
      }
      if (this.pointnum == "") {
        this.$toast("请填写详细地址");
        return;
      }
      let obj = {};
      obj.status = this.status ? "0" : "1";
      obj.name = this.name;
      obj.phone = this.phone;
      obj.address = this.address;
      obj.pointnum = this.pointnum;
      if (this.id != "") {
        obj.id = this.id;
      }
      //保存
      this.$http
        .request({
          method: "post",
          url: "/RUserAddressController/insertOrUpdate",
          body: obj
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            //保存成功
            //判断地址是否只有唯一一个
            if (this.$route.query.num == 0) {
              //只有新添加的一个
              console.log("保存成功,返回立即支付页");
              obj.id = res.data.data;
              this.$store.commit("Address/addressData", obj);
              localStorage.setItem("productGo", true);
              this.$router.go(-2);
            } else {
              //地址不是只有一个,看缓存里的是否和默认地址是否一样,如果一样则相应修改
              if (this.$store.state.Address.addressData.id == this.id) {
                this.$store.commit("Address/addressData", obj);
              }
              console.log("保存成功,返回上一页");
              this.$router.go(-1);
            }
          } else {
            //失败
            this.$toast("保存失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    gitAddress(e) {
      //获取地址
      this.address = e;
    },
    onClickLeft() {
      if (this.isDel != "删除") return;
      // console.log(this.$store.state.Address.addressObj.id);
      let msg = "确认删除么?";
      this.$dialog
        .confirm({
          message: msg,
          confirmButtonText: "删除"
        })
        .then(() => {
          // on confirm
          this.onDel();
        })
        .catch(() => {
          return;
        });
    },
    onDel() {
      //删除地址
      if (this.isDel == "") return;
      console.log("根据id删除", this.id);

      this.$http
        .request({
          method: "post",
          url: "/RUserAddressController/deleteByPrimaryKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            //删除成功,看缓存里的是否和默认地址一样,如果一样则清空
            if (this.$store.state.Address.addressData.id == this.id) {
              this.$store.commit("Address/addressData", {
                id: "",
                status: 1,
                name: "",
                phone: "",
                address: "",
                pointnum: ""
              });
            }
            console.log("删除成功,返回上一页");
            this.$router.go(-1);
          } else {
            //失败
            this.$toast("删除失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectAddress() {
      //打开选择地址
      this.show = true;
    }
  },
  watch: {
    //-监听输入身高正则验证
    phone(val) {
      val = val.toString();
      if (!val) {
        return;
      }
      this.phone = val.replace(/[^0-9]+/g, "");
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#integralAddressUpdate {
  /deep/ .header {
    z-index: 1000;
  }

  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 59/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;

    .main_box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      background-color: @backgroundColorT;
      text-align: center;
      .borderRadius(10, 10, 10, 10);

      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      .box_list {
        border-bottom: 1px solid @borderLeftColor;
        .padding(10, 10, 10, 10);
        display: flex;
        justify-content: space-between;

        .list_left {
          .width(84);
          .fontSize(16);
          font-weight: bold;
          text-align: left;
          display: flex;
          align-items: center;
        }

        .list_right {
          flex: 1;
          text-align: left;
          display: flex;
          align-items: center;

          /deep/ .van-cell {
            padding: 0;
            .fontSize(16);
          }

          /deep/ input {
            .overflowline(1);
          }

          /deep/ .van-cell:not(:last-child)::after {
            border: 0;
          }
        }

        &:last-child {
          border: 0;
        }
      }
    }

    .foot {
      position: absolute;
      margin-bottom: env(safe-area-inset-bottom);
      bottom: 10/375 * 100vw;
      left: 0;
      right: 0;
      z-index: 2;

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
