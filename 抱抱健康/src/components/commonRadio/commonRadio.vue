<template>
  <div class="radio">
    <div v-for="(item, index) in objList" :key="index">
      <van-swipe-cell :disabled="!update">
        <div class="radio_box">
          <div
            :class="value == item.id ? 'radio_bg blue' : 'radio_bg '"
            @click="select(item.id)"
          >
            <div class="radio_top">
              <div class="radio_name">
                {{ item.name }}
              </div>
              <div
                class="radio_update"
                v-show="update"
                @click.stop="onUpdate(index)"
              >
                修改
              </div>
            </div>
            <div class="radio_bottom" v-if="item.synopsis">
              {{ item.synopsis }}
            </div>
          </div>
        </div>
        <template #right>
          <div class="delect_img" @click.stop="onDelect(index)">
            <img src="../../assets/images/shanchu.png" alt="" />
          </div>
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
<script>
export default {
  name: "radio",
  data() {
    return {};
  },
  props: {
    objList: {
      type: Object,
      value: {}
    },
    value: {
      type: Number || String,
      value: ""
    },
    update: {
      type: Boolean,
      value: false
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    onDelect(key) {
      console.log("删除", key);
      let obj = this.objList[key];
      obj.key = key;
      this.$emit("onDelect", obj);
    },
    onUpdate(key) {
      //修改方法
      console.log("修改", key);
      let obj = this.objList[key];
      obj.key = key;
      this.$emit("onUpdate", obj);
    },
    select(id) {
      this.value = id;
    }
  },
  watch: {
    value(val) {
      this.$emit("input", val); //传值给父组件, 让父组件监听到这个变化
    }
  }
};
</script>
<style lang="less" scoped>
.radio {
  padding: 12px 0 0;
  .radio_box {
    padding: 0 12px;
    margin-bottom: 15px;
    .radio_bg {
      background: @backColorE2;
      color: @titleColor;
      border-radius: 10px 10px 10px 10px;
      div {
        font-size: 16px;
        line-height: 20px;
      }
      .radio_top {
        padding: 15px 10px;
        display: flex;
        /*justify-content: space-between;*/
        /*align-items: center;*/
        border-bottom: 1px solid @backgroundColorff;

        .radio_name {
          flex: 1;
          width: 0;
        }

        .radio_update {
          color: #0069FF;
        }
      }
      .radio_bottom {
        padding: 13px 10px;
        text-align: justify;
        text-justify: newspaper;
        word-break: break-all;
      }
    }
    .blue {
      background: @mainColor;
      color: @fontColorff;

      .radio_update {
        color: @fontColorff!important;
      }
    }
    &:last-child {
      padding: 0;
    }
  }
}
.delect_img {
  width: 48px;
  padding: 0 20px 0 10px;
  display: flex;
  height: 100%;
  align-items: center;
  img {
    width: 18px;
  }

}
</style>
