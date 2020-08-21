<template>
  <div class="chatInput_page">
    <div class="container">
      <div class="file-box">
        <label for="img">
          <img src="../../assets/image/icon_img.png" alt />
        </label>
        <input id="img" type="file" />
        <label for="file">
          <img src="../../assets/image/icon_local_file.png" alt />
        </label>
        <input id="file" type="file" />
        <img src="../../assets/image/icon_cloud_file.png" alt />
      </div>
      <div class="input-box">
        <textarea name id v-model.trim="inputMsg" v-hotkey="{enter: this.sendMsg}"></textarea>
      </div>
      <div class="send-btn">
        <span class="btn" @click.stop="sendMsg($event)">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chatInput",
  props: {
    msg: {
      type: String,
      default() {
        return "";
      } 
    },
  },
  data() {
    return {};
  },
  methods: {
    sendMsg(e) {
      e.preventDefault();
      this.$emit("sendMsg", this.msg);
    }
  }
};
</script>

<style scoped lang="less">
.chatInput_page {
  height: 160px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .container {
    padding: 15px 30px 0;

    .file-box {
      img {
        display: inline-block;
        margin-right: 20px;
        width: 24px;
        cursor: pointer;
      }

      #file,
      #img {
        display: none;
      }
    }

    .input-box {
      margin: 15px 0 12px;
      height: 44px;

      textarea {
        border: none;
        outline: none;
        resize: none;
        height: 100%;
        width: 100%;
        font-size: 16px;
        font-weight: 400;
        color: @titleColor;
        line-height: 22px;
      }
    }

    .send-btn {
      cursor: pointer;
      float: right;
      width: 87px;
      height: 35px;
      background: linear-gradient(270deg, @beginColor 0%, @mainColor 100%);
      border-radius: 10px;
      text-indent: 21px;

      span {
        font-size: 14px;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 35px;
        letter-spacing: 18px;
      }
    }
  }
}
</style>
