/**
*@desc 医生端提醒患者支付悬窗
*@author houpai
*@date 2020/04/23 11:44:27
*/
<template>
  <div class="dragBox_page">
    <div
      class="drag"
       @click.stop="submitHandle"
      id="moveDiv"
      ref="moveDiv"
      @mousedown="down"
      @touchstart="down"
      @mousemove="move"
      @touchmove="move"
      @mouseup="end"
      @touchend="end"
    >
    <!-- <div class="drag"
         ref="move_div"
         @click.stop="submitHandle"
         @touchstart="down"
         @touchmove="move"
         @touchend="end"
         :style="{top: typeof top === 'string' ? top : top  + 'px', left: typeof left === 'string' ? left : left + 'px'}"> -->
      <img v-if="!isSendPayMsg" src="../../assets/images/pay_tip.png" alt="">
      <img v-if="isSendPayMsg" src="../../assets/images/pay_over.png" alt="">
    </div>
  </div>
</template>

<script>

  import {Toast} from "vant";

  export default {
    name: "dragBox",
    props: {
      sessionId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      isSendPayMsg: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        flags: false,
        position: { x: 0, y: 0 },
        nx: "",
        ny: "",
        dx: "",
        dy: "",
        xPum: "",
        yPum: "",
      };
    },
    methods: {

      // 实现移动端拖拽
      down() {
        this.flags = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move() {
        if (this.flags) {
          var touch;
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.nx = touch.clientX - this.position.x;
          this.ny = touch.clientY - this.position.y;
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;
          if(this.xPum<0) {
            this.xPum=0;
          }else if(this.xPum>document.documentElement.clientWidth - moveDiv.offsetWidth){
            this.xPum = document.documentElement.clientWidth - moveDiv.offsetWidth;
          }
          if(this.yPum<0) {
            this.yPum=0;
          }else if(this.yPum>document.documentElement.clientHeight- moveDiv.offsetHeight){
            this.yPum = document.documentElement.clientHeight - moveDiv.offsetHeight;
          }
          moveDiv.style.left = this.xPum + "px";
          moveDiv.style.top = this.yPum + "px";
          //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
          moveDiv.addEventListener(
            "touchmove",
            function() {
              event.preventDefault();
            },
            { passive: false }
          );
        }
      },
      //鼠标释放时候的函数
      end() {
        this.flags = false;
      },

      /**
       * 提醒患者支付,每5min可点击一次
       * **/
      submitHandle() {
        this.$emit("remindPatientPay", this.sessionId);
      }
    }
  };
</script>

<style scoped lang="less">
  .dragBox_page {
    .drag {
      .width(116);
      .height(60);
      overflow: hidden;
      position: fixed;
      top: 50%;
      left: 66%;
      z-index: 10000;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
