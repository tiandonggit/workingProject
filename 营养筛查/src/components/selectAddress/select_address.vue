/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectAddress *
@function: 城市三级联动 * @date: 2020/1/7 * @time: 14:33 * * */
<template>
  <div id="selectAddress">
    <van-popup
      v-model="value"
      position="bottom"
      safe-area-inset-bottom
      @close="onShow"
    >
      <div class="main">
        <div class="title">
          <div>{{ title }}</div>
          <van-icon name="clear" color="#CCCCCC" @click="onShow"/>
        </div>
        <div class="content">
          <div class="content_top">
            <div
              :class="province == '请选择' || key == 1 ? 'ball' : 'ball blues'"
            ></div>
            <div
              @click="onSelect(1)"
              :class="
                province == '请选择' || key == 1 ? 'top_list' : 'top_list blue'
              "
            >
              {{ province }}
            </div>
            <span v-if="province != '请选择'">-</span>
            <div
              :class="
                city == '请选择' || key == 1 || key == 2 ? 'ball' : 'ball blues'
              "
              v-if="province != '请选择'"
            ></div>
            <div
              @click="onSelect(2)"
              :class="
                city == '请选择' || key == 1 || key == 2
                  ? 'top_list'
                  : 'top_list blue'
              "
            >
              {{ province != "请选择" ? city : "" }}
            </div>
            <span v-if="city != '请选择'">-</span>
            <div
              :class="
                district == '请选择' || key == 1 || key == 2 || key == 3
                  ? 'ball'
                  : 'ball blues'
              "
              v-if="city != '请选择'"
            ></div>
            <div
              @click="onSelect(3)"
              :class="
                district == '请选择' || key == 1 || key == 2 || key == 3
                  ? 'top_list'
                  : 'top_list blue'
              "
            >
              {{ city != "请选择" ? district : "" }}
            </div>
          </div>
          <div class="content_body" v-show="key == 1">
            <div
              v-for="(item, key, index) in provinceDtat"
              :key="index"
              @click="onSelectCity(item, key, 1)"
            >
              <div class="body_list">
                <div :class="item == province ? 'ball blue' : 'ball'"></div>
                <div class="city">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="content_body" v-show="key == 2">
            <div
              v-for="(item, key, index) in cityData"
              :key="index"
              @click="onSelectCity(item, key, 2)"
            >
              <div
                class="body_list"
                v-if="
                  provinceNum.toString().substring(0, 2) == key.substring(0, 2)
                "
              >
                <div :class="item == city ? 'ball blue' : 'ball'"></div>
                <div class="city">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="content_body" v-show="key == 3">
            <div
              v-for="(item, key, index) in districtData"
              :key="index"
              @click="onSelectCity(item, key, 3)"
            >
              <div
                class="body_list"
                v-if="cityNum.toString().substring(0, 4) == key.substring(0, 4)"
              >
                <div :class="item == district ? 'ball blue' : 'ball'"></div>
                <div class="city">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "select_address",
  props: {
    title: {
      type: String,
      default() {
        return "标题";
      }
    },
    value: {
      type: Boolean,
      default() {
        return false;
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      show: false,
      province: "请选择", //省
      provinceNum: 0,
      city: "请选择", //市
      cityNum: 0,
      district: "请选择", //区
      districtNum: 0,
      areaList: [],
      provinceDtat: {},
      cityData: {},
      districtData: {},
      key: 1
    };
  },
  created() {
    this.provinceDtat = this.data.province_list;
    this.cityData = this.data.city_list;
    this.districtData = this.data.county_list;
  },
  mounted() {},
  methods: {
    onSelectCity(name, num, key) {
      if (key == 1) {
        if (this.province != name) {
          this.city = "请选择";
          this.district = "请选择";
        }
        this.province = name;
        this.provinceNum = num;
      } else if (key == 2) {
        if (this.city != name) {
          this.district = "请选择";
        }
        this.city = name;
        this.cityNum = num;
      } else if (key == 3) {
        this.district = name;
        this.districtNum = num;
        this.gitAddress();
        this.onShow();
      }
      if (this.key < 3) this.key++;
    },
    gitAddress() {
      this.$emit("gitAddress", this.province + this.city + this.district);
    },
    onSelect(key) {
      if (key == 1) {
        this.key = 1;
      } else if (key == 2) {
        this.key = 2;
      } else if (key == 3) {
        this.key = 3;
      }
      console.log(this.key);
    },
    onShow() {
      this.$emit("input", this.show);
    }
  },
  watch: {
    data(val) {
      console.log(val, "111");
    }
  }
};
</script>

<style lang="less" scoped>
#selectAddress {
  /deep/ .van-popup {
    .borderRadius(10, 10, 0, 0);
  }

  .main {
    overflow-y: hidden;

    .title {
      border-bottom: 1px solid #e6e6e6;
      .padding(15, 12, 15, 12);
      .fontSize(18);

      div {
        font-weight: bold;
      }

      color: @titleColor;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .content {
      .padding(11, 0, 0, 2);

      .content_top {
        display: flex;
        align-items: center;

        .top_list {
          .fontSize(16);
          font-weight: bold;
          .lineHeight(22);
          .padding(0, 10, 0, 0);
          max-width: 80/375 * 100vw;
          .overflowline(1);
        }

        .blue {
          color: @font9FFColor;
        }

        span {
          color: @font9FFColor;
        }

        .ball {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 2px solid @font9FFColor;
          .margin(0, 10, 0, 10);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .blues {
          background-color: @font9FFColor;
        }

      }

      .content_body {
        position: relative;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none !important;
          width: 0px;
          height: 0px;
        }

        .padding(19, 0, 19, 0);
        .height(202);

        .body_list {
          .padding(0, 0, 15, 0);
          display: flex;
          align-items: center;

          .ball {
            width: 10px;
            height: 10px;
            .margin(0, 10, 0, 10);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .blue {
            width: 6px;
            height: 6px;
            border: 2px solid @font9FFColor;
            border-radius: 50%;
            background-color: @font9FFColor;
          }

          .city {
            .fontSize(16);
            color: @titleColor;
          }
        }
      }
    }
  }
}
</style>
