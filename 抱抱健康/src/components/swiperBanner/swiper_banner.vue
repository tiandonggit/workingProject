/** *@desc banner *@author houpai *@date 2019/07/02 11:47:46 */
<template>
  <div class="swiper_box">
    <van-swipe :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in swiperList" :key="index">
        <div style="width: 100%;height: 100%">
          <img :src="item.url" alt />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: "swiper_banner",
  props: {
    swiperList: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="less">
.swiper_box {
  width: 100%;
  height: 100%;
  .van-swipe {
    height: 100%;
  }
  .van-swipe-item {
    text-align: center;
    line-height: 44vw;
    background: #f2f2f2;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
