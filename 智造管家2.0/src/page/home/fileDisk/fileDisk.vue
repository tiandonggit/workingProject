/**
 *@desc 网盘模板tab组件
 *@author houpai
 *@date 2020/03/20 15:50:43
 */
<template>
  <div class="fileDisk_page">
    <ul class="fileType_List">
      <h4>分类</h4>
      <div class="check_box highlightChecked">
        <li>
          <img src="../../../assets/images/file_person.png" alt="">
          <span>个人文件</span>
        </li>
      </div>
      <div class="check_box">
        <li>
          <img src="../../../assets/images/file_enterprise.png" alt="">
          <span>企业文件<i> (暂未开放)</i></span>
        </li>
      </div>
      <div class="check_box">
        <li class="noBorderBoottom">
          <img src="../../../assets/images/file_shared.png" alt="">
          <span>共享文件<i> (暂未开放)</i></span>
        </li>
      </div>
    </ul>
    <div class="routerView_box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "fileDisk"
  };
</script>

<style scoped lang="less">
  .fileDisk_page {
    display: flex;
    width: 100%;
    height: 100%;
    .fileType_List {
      width: 255px;
      box-shadow:0px 0px 12px 0px rgba(0,0,0,0.1);
      h4 {
        height: 82px;
        display: flex;
        align-items: center;
        margin-left: 20px;
        color: @titleColor;
        font-size: 16px;
        font-weight:bold;
        line-height: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      li {
        display: flex;
        align-items: center;
        height: 85px;
        margin-left: 20px;
        border-bottom:1px solid rgba(0, 0, 0, 0.1);
        img {
          display: block;
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }

        span {
          color: @titleColor;
          font-size: 16px;
          font-weight:bold;
          line-height: 20px;
          i {
            color: @highlightFontColor2;
            font-size: 16px;
            font-weight:bold;
            line-height: 20px;
          }
        }
      }

      li.noBorderBoottom {
        border-bottom:none;
      }

      .highlightChecked {
        background-color: @highlightFontColor3;
      }
    }
    .routerView_box {
      overflow: hidden;
      flex: 1;
    }
  }
</style>
