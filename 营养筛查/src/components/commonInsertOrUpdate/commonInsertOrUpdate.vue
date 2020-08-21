<!--
  开发者:张松仁
  页面:医生方案修改或删除
  -------------------
  Created by webStorm
  User: 张松仁
  Date: 2020-4-2
  Time: 15:38:13
  Application: 方案列表展示组件
  State: component
  Prop:  type Object
         @param  {Object}  value       是否显示
         @param  {Object}  objData     修改按钮是否显示
         @param  {Object}  status      展示的样式
 -->
<template>
  <div class="insertOrUpdate">
    <van-dialog
      v-if="status == 0"
      v-model="value"
      :message="message"
      @confirm="confirm"
      show-cancel-button
    >
    </van-dialog>
    <van-dialog
      v-else
      v-model="value"
      @confirm="confirm"
      @cancel="cancel"
      :beforeClose="close"
      show-cancel-button
    >
      <div class="insertOrUpdate_box">
        <div class="insertOrUpdate_title">
          请为该方案设置一个名称
        </div>
        <div class="insertOrUpdate_input">
          <van-field v-model="obj.name" placeholder="请输入名称(最多20字)" maxlength="20"/>
        </div>
        <div class="insertOrUpdate_title">
          请为该方案设置备注简介
        </div>
        <div class="insertOrUpdate_input padd_bott">
          <van-field
            rows="1"
            v-model="obj.synopsis"
            autosize="{ maxHeight: 100, minHeight: 24 }"
            type="textarea"
            placeholder="请输入简介内容(最多60字)"
            maxlength="60"
            show-word-limit
          />
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: "insertOrUpdate",
  data() {
    return {
      message: "是否确认删除该方案",
      obj: {
        name: "",
        synopsis: ""
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      value: false
    },
    status: {
      type: Number || String,
      value: 0
    },
    objData: {
      type: Object,
      value: {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    confirm() {
      //点击确认按钮
      console.log("确认", this.obj);
      if (this.obj.name == "") {
        this.$toast("方案名称不能为空");
      } else {
        this.$emit("confirm", this.obj);
      }
    },
    close(action, done) {
      console.log("关闭前",action,action === 'confirm');
      let that = this;
      //关闭前验证
      if(action === 'confirm') {
        if (that.obj.name == "") {
          done(false);
        } else {
          done();
        }
      } else if(action === 'cancel') {
        done() //关闭
      }

    },
    cancel() {
      //点击取消按钮
      this.$emit("cancel", this.obj);
    }
  },
  watch: {
    value(val) {
      // console.log(val);
      this.$emit("input", val); //传值给父组件, 让父组件监听到这个变化
    },
    objData(val) {
      this.obj = JSON.parse(JSON.stringify(val));
    }
  }
};
</script>
<style lang="less" scoped>
.insertOrUpdate {
  /deep/.van-overlay {
    /*z-index: 1000000 !important;*/
    background-color: rgba(0, 0, 0, 0.3);
  }

  /deep/.van-dialog {
    /*z-index: 1000001 !important;*/
    .insertOrUpdate_box {
      padding: 20px 10px;
      .insertOrUpdate_title {
        font-size: 16px;
        font-weight: bold;
        color: @fontColor33;
        line-height: 20px;
        text-align: center;
      }
    }
    .insertOrUpdate_input {
      padding: 15px 0 20px;
      .van-cell {
        background-color: @backcolor;
        border-radius: 10px;
        padding: 14px 0 14px 10px;
      }
      .van-field__control {
        font-size: 16px;
        word-break:break-all;
      }
    }
    .padd_bott {
      padding-bottom: 0;
    }
    .van-button {
      border-radius: 0;
    }
  }
}
</style>
