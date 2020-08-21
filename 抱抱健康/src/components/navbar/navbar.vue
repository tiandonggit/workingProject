/** *@desc navbar *@author suoxh *@date 2019/07/12 */
<template>
  <div class="navBar">
    <div @click="goBack" class="leftIcon">
      <van-icon name="arrow-left" />
    </div>
    <div class="search_box">
      <div class="search_left" @click="search">
        <i class="iconfont iconsousuo"></i>
        <input
          type="text"
          v-model="searchText"
          :placeholder="placeholder"
          @keyup.enter="enterDown"
          :disabled="disabled"
        />
      </div>
      <div
        v-if="isSearchBtn"
        class="search_btn"
        @click="clickRight(searchText)"
      >
        搜索
      </div>
      <div v-else class="search_right" @click="clickRight(searchText)">
        {{ rightText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      searchText: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default() {
        return "请输入手机号码";
      }
    },
    isSearchBtn: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rightText: {
      type: String,
      default() {
        return "添加";
      }
    },
    disabled: {
      type: String,
      default() {
        return "disabled";
      }
    }
  },
  methods: {
    //搜索跳转
    search() {
      this.$emit("soTire");
    },
    //回车
    enterDown() {
      this.$emit("enterDown", this.searchText);
    },
    clickRight(value) {
      this.$emit("clickRight", value);
    },
    goBack() {
      this.$emit("goHistory");
    }
  },
  mounted() {
    // console.log(this.$props);
  },
  created() {}
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.navBar {
  width: 100%;
  .height(50);
  display: flex;
  text-align: center;
  align-items: center;
  background-color: #fff;
  .padding(8, 8, 8, 8);
  .leftIcon {
    width: 7%;
    .fontSize(25);
  }
  .search_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 9.2vw;
    padding-left: 5px;
    padding-right: 5px;
    background: @backgroundColorT;
    width: 100%;
    .search_left {
      width: 80%;
      height: 100%;
      padding: 0 0 0 3.2vw;
      background: rgba(233, 140, 46, 0.1);
      border-radius: 2.7vw;
      overflow: hidden;
      display: flex;
      align-items: center;

      .iconfont {
        .fontSize(16);
      }
      input {
        border: none;
        .fontSize(15);
        background-color: transparent;
        padding: 0 1.2vw;
        width: 45vw;
      }
    }

    .search_btn {
      background-color: rgba(233, 140, 46, 1);
      border-radius: 5px;
      color: @fontOne;
      width: 14.5vw;
      text-align: center;
      line-height: 8vw;
      height: 8vw;
      .fontSize(13);
    }
  }
}
</style>
