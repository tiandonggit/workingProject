/*
 * @Author: 田东 
 * @Date: 2019-05-27 18:04:27 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-17 09:33:06
 * @name 分类
 */

<template>
  <div id="category">
    <div class="search-from">
      <form action="/">
        <van-search
          v-model="searchText"
          placeholder="搜索"
          background="#FFF"
          readonly="readonly"
          @click="onSearch()"
        ></van-search>
      </form>
    </div>
    <div class="content_block clearfix">
      <div class="left_bar">
        <ul>
          <li
            class="left_item"
            :class="{active: item.isSelect}"
            v-for="(item, key) in data"
            :key="key"
            @click="selectFirstLevel(item.code, item.id)"
          >
            <a>{{item.text}}</a>
          </li>
        </ul>
      </div>
      <div class="right_cell">
        <div class="top_img" @click="adLink(advert.jumptype, advert.jumplink)">
          <img :src="advert.advertimg" alt>
        </div>
        <div class="content">
          <div
            class="cell"
            v-for="(cell, key) in list"
            :key="key"
            @click="selectSecondLevel(cell.code)"
          >
            <div class="top">
              <img :src="cell.imageurl" alt>
            </div>
            <p class="text">{{cell.text}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="clearfix"></div>
    <Tabber></Tabber>
  </div>
</template>

<script>
import Tabber from "@/components/Tabber";
import { Toast, Dialog } from "vant";
import fly from "flyio";

export default {
  name: "category",
  data() {
    return {
      searchText: "",
      data: [],
      list: [],
      advert: {},
      imgUrl: "https://dummyimage.com/278x110/0f0/fff",
      firstLevelId: "",
      firstLevelCode: ""
    };
  },
  components: {
    Tabber: Tabber
  },
  mounted: function() {
    fly
      .all([this.getAdvert(), this.getFirstLevel()])
      .then(
        fly.spread((res1, res2) => {
          //两个请求都完成
          Toast.clear();
          if (res1.data.success) {
            if (res1.data.data.top.length > 0) {
              this.advert = res1.data.data.top[0];
            }
          } else {
            Toast(res1.data.message);
          }

          if (res2.data.success) {
            this.data = res2.data.data.mainClass;
            this.data.forEach((v, e) => {
              v.isSelect = false;
            });
            this.firstLevelCode = res2.data.data.mainClass[0].code;
            this.data[0].isSelect = true;
            this.list = res2.data.data.subClass;
          } else {
            Toast(res2.data.message);
          }
        })
      )
      .catch(error => {
        console.log("错误为" + error);
      });
  },
  methods: {
    getAdvert() {
      return fly.get("/SAdvertController/selectAdvert", {
        pagePlace: "2"
      });
    },
    getFirstLevel() {
      return fly.get("/SysDictionaryController/selectMainTypeCode");
    },
    adLink(jumptype, link) {
      // 外部链接
      if (jumptype == 1) {
        window.location.href = link;
      } else {
        this.$router.push({
          name: "MallHome"
        });
      }
    },
    onSearch() {
      this.$router.push({
        name: "Searches"
      });
    },
    selectFirstLevel(code, id) {
      this.firstLevelId = id;
      this.firstLevelCode = code;
      this.data.forEach((v, e) => {
        if (v.id == id) {
          v.isSelect = true;
        } else {
          v.isSelect = false;
        }
      });
      this.$http
        .request({
          method: "get",
          url: "/SysDictionaryController/selectSubTypeCode", // 获取二级分类列表
          body: {
            code: id
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.list = data.data;
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    selectSecondLevel(secondLevelCode) {
      this.$router.push({
        name: "SearchesP",
        query: {
          firstLevelCode: this.firstLevelCode,
          secondLevelCode: secondLevelCode
        }
      });
      console.log(this.firstLevelCode, secondLevelCode);
    },
    click(id) {
      console.log(id);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}
.clearfix::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}
#category {
  height: calc(100% - 50px);
  background: @backgroundColorT;
  position: relative;

  .search-from {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .van-search {
    padding: 2.6vw 3.2vw;
  }

  .van-search__content {
    background: @backgroundColor;
  }

  .content_block {
    height: 100%;
    padding-top: 14.27vw;
  }

  .left_bar {
    float: left;
    width: 25.9vw;
    height: 100%;
    overflow: scroll;

    .left_item {
      // height: 12.4vw;
      // line-height: 12.4vw;
      padding: 4vw 0;
      text-align: center;
      background: @backgroundColor;

      a {
        .fontSize(15);
        height: 4.5vw;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .active {
      background: @backgroundColorT;

      a {
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: @mainColor;
        border-left: 0.5vw solid @mainColor;
      }
    }
  }

  .right_cell {
    float: right;
    width: 74.1vw;
    height: 100%;
    overflow: scroll;

    .top_img {
      img {
        display: block;
        width: 100%;
      }
    }

    .content {
      .cell {
        margin: 3vw 3vw 0;
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .top {
          width: 18.4vw;
          height: 18.4vw;
          border-radius: 6.7vw;
          overflow: hidden;
          background: @backgroundColor;
          margin-right: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 100%;
          }
        }

        .text {
          .fontSize(14);
          width: 18.4vw;
          height: 8vw;
          text-align: center;
          line-height: 4vw;
          margin-top: 2vw;
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          color: @titleColor;
        }
      }
    }
  }
}
</style>
