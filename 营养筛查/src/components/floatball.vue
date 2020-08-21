<template>
  <div id="webId">
    <!-- 如果碰到滑动问题，1.1 请检查这里是否属于同一点。 -->
    <!-- 悬浮的HTML -->
    <div
      class="nudifloat"
      @click="$throttle(toscre)"
      id="moveDiv"
      ref="moveDiv"
      @mousedown="down"
      @touchstart="down"
      @mousemove="move"
      @touchmove="move"
      @mouseup="end"
      @touchend="end"
    >
      拟定<br />方案
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
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
    toscre() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectWindow",
          body: {
            id: window.sessionStorage.getItem("id"),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code==1) {
            window.sessionStorage.setItem("id",res.data.total);
            this.$router.push({ name: "selectIllness" });
          } else {
            Toast("您还未绑定智配柜，无法进行下一步操作");
          }
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
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
  },
};
</script>
<style>
.xuanfu {
  height: 4.5rem;
  width: 4.5rem;
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
  z-index: 1000000;
  position: fixed;
  top: 4.2rem;
  right: 3.2rem;
  border-radius: 0.8rem;
  background-color: rgba(0, 0, 0, 0.55);
}
.yuanqiu {
  height: 2.7rem;
  width: 2.7rem;
  border: 0.3rem solid rgba(140, 136, 136, 0.5);
  margin: 0.65rem auto;
  color: #000000;
  font-size: 1.6rem;
  line-height: 2.7rem;
  text-align: center;
  border-radius: 100%;
  background-color: #ffffff;
}
.nudifloat {
  width: 44px;
  height: 44px;
  background: linear-gradient(
    180deg,
    rgba(1, 128, 255, 1) 0%,
    rgba(0, 105, 255, 1) 100%
  );
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  position: fixed;
  z-index: 1000000;
  top: 400px;
  right: 12px;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 16px;
  text-align: center;
}
</style>
