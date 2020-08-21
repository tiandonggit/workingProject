/**
* @Description: 选择项目优先级组件
* @Author: 侯湃
* @Date: 2020/6/22
*/
<template>
  <div class="prioritySelect_dialog">
    <ul class="prioritySelect_box">
      <li v-for="(item,index) in priorityList"
          :key="index"
          @click.stop="selectPriority(item)">
        <div class="select_div">
          <div class="colorBox" :style="{background:item.color}"></div>
          <span>{{item.priority || ""}}</span>
        </div>
        <img v-if="priority === item.id" src="../../assets/image/selected.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "prioritySelect",
    props:{
      priority:{
        type:[String,Number],
        default() {
          return ''
        }
      },
      taskId:{
        type:String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        selectedPriority: "", // 选择的优先级
        priorityList: [
          {
            priority: "最高",
            color: "rgba(255, 193, 193, 1)",
            id:0,
          },
          {
            priority: "较高",
            color: "rgba(255, 219, 183, 1)",
            id:1,
          },
          {
            priority: "普通",
            color: "rgba(208, 208, 208, 1)",
            id:2,
          },
          {
            priority: "较低",
            color: "rgba(195, 235, 181, 1)",
            id:3,
          }
        ]
      };
    },
    methods: {
      /**
       * 选择优先级
       * **/
      selectPriority(item) {
        this.selectedPriority = item.id;
        let params = {
          priority: this.selectedPriority,
          id:this.taskId
        };
        this.$emit("selectedPriority", params);
      }
    }
  };
</script>

<style scoped lang="less">
  .prioritySelect_dialog {
    position: absolute;
    width: 167px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    top: 30px;
    left: 0;
    z-index: 9999;

    .prioritySelect_box {
      padding: 15px;

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 30px;

        .select_div {
          display: flex;
          align-items: center;
        }

        .colorBox {
          width: 18px;
          height: 18px;
          border-radius: 2px;
          margin-right: 10px;
        }

        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }

        img {
          display: block;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
</style>
