/**
*@desc 医生名片样式选择列表
*@author houpai
*@date 2020/04/21 15:29:04
*/
<template>
  <div class="docCardStyleCheck_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医生名片'"
        :header-show="true"
        :title="'名片样式'"
    ></common-header>

    <ul class="styleList_box">
      <li v-for="(item,index) in styleList"
          @click.stop="chooseStyleTemplate(item.id)"
          :key="item.id">
        <img :src="item.previewpictureurl" alt="">
        <span class="style_name">{{item.text || ''}}</span>
        <img src="../../../assets/images/docCardStyleUsing_icon.png"
             v-if="item.tacitlyapprove == 1"
             alt="" class="using_style">
      </li>
    </ul>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from 'vant';
  import {mapState} from 'vuex';

  export default {
    name: "docCardStyleCheck",
    components: {
      commonHeader
    },
    computed:{
      ...mapState(["DoctorIM"])
    },
    data() {
      return {
        loading:false,
        styleList: [] // 名片风格列表
      };
    },
    methods: {
      /**
       * 获取名片模板列表
       * **/
      getStyleList() {
        this.loading = true;
        this.$http.request({
          url:"/RBusinessCardStyleController/selectAll",
          method:'get',
          body:{}
        }).then(res => {
          this.loading = false;
          if(res.data.success) {
            // type=1 为默认名片 放在首位
            let styleList = res.data.data || [];
            styleList.forEach((item,index) => {
              if(item.types == 1) {
                styleList.splice(index,1);
                styleList.unshift(item)
              }
            })
            this.styleList = styleList;
          }else {
            Toast('接口报错')
          }
        }).catch(e => {
          this.loading = false;
          console.log(e)
        })
      },
      /**
       * 选择名片
       * **/
      chooseStyleTemplate(id) {
        this.$http.request({
          url:"/RDoctorController/insertOrUpdate",
          method:'post',
          body:{
            id:this.DoctorIM.doctorMessage.data.docId,
            rbusunesscardstyleid:id
          }
        }).then(res => {
          if(res.data.success) {
            Toast('切换成功');
            this.$router.go(-1);
          }else {
            Toast('接口报错')
          }
        }).catch(e => {
          console.log(e)
        });
      }
    },
    created() {
      this.getStyleList();
    }
  };
</script>

<style scoped lang="less">
  .docCardStyleCheck_page {
    .padding(60, 12, 12, 12);

    .styleList_box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        position: relative;
        .width(165);
        img {
          display: block;
          width: 100%;
          .height(266);
          .borderRadius(10, 10, 10, 10);
          overflow: hidden;
        }

        .style_name {
          display: inline-block;
          width: 100%;
          text-align: center;
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          .padding(12, 0, 12, 0);
        }

        img.using_style {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          .width(60);
          .height(60);
          overflow: hidden;
          border-radius: 0!important;
        }
      }
    }
  }
</style>
