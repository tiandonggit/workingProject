/**
*@desc 医疗小组名片列表
*@author houpai
*@date 2020/04/22 16:22:32
*/
<template>
  <div class="docGroupList_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医生名片'"
        :header-show="true"
        :rightContent="'个人名片'"
        :rightClass="{'color':'rgba(0, 105, 255, 1)'}"
        @rightContentClick="rightContentClick"
        :title="'医疗小组名片'"
    ></common-header>

    <ul class="docGroupList_box">
      <van-list
          v-model="loading"
          :error.sync="error"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad">
        <li v-for="(item,index) in docGroupList"
            @click.stop="getDocGroupDetail(item.id)"
            :key="item.id">
          <div class="docGroup_desc">
            <img src="../../../assets/images/default.png" alt="">
            <div class="docGroup_detail">
              <p class="docGroup_name">{{item.groupname || ""}}</p>
              <p>
                <span class="docGroup_level">{{item.grouplibeltext || ""}}</span>
              </p>
            </div>
          </div>
          <van-icon name="arrow"/>
        </li>
      </van-list>
    </ul>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from "vant";

  export default {
    name: "docGroupList",
    components: {
      commonHeader
    },
    data() {
      return {
        docGroupList: [], // 医疗小组名片列表
        page: 1,
        limit: 10,
        loading: false, // loading
        finished: false, // 是否已经全部加载
        error: false
      };
    },
    methods: {
      /**
       * 分页加载
       * **/
      onLoad() {
        setTimeout(() => {
          this.getDocGroupList();
        }, 0);
      },
      /**
       * 获取医疗小组
       * **/
      getDocGroupList() {
        this.$http.request({
          url: "/ImGroupController/selectGroup",
          method: "get",
          body: {
            page: this.page,
            limit: 10,
            name:''
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.docGroupList = this.docGroupList.concat(res.data.data.list || []);
            this.finished = this.docGroupList.length == res.data.data.total;
            this.page++;
          } else {
            Toast("接口报错");
            this.finished = true;
            this.loading = false;
            this.error = true;
          }
        }).catch(e => {
          console.log(e);
          this.finished = true;
          this.loading = false;
          this.error = true;
        });
      },
      /**
       * 查看医疗小组详情
       * @params id 医疗小组id
       * **/
      getDocGroupDetail(id) {
        this.$router.push({
          path: "/docGroupDetail",
          query:{
            gid: id
          }
        });
      },
      /**
       * 个人名片
       * **/
      rightContentClick() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped lang="less">
  .docGroupList_page {
    .padding(60, 12, 12, 12);

    .docGroupList_box {
      li {
        display: flex;
        align-items: center;
        background-color: @backgroundColorT;
        .padding(28, 20, 28, 20);
        .borderRadius(10, 10, 10, 10);
        .margin(0, 0, 15, 0);

        img {
          display: block;
          .width(60);
          .height(60);
        }

        .docGroup_desc {
          flex: 1;
          width: 0;
          display: flex;

          .docGroup_detail {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .margin(0, 0, 0, 10);

            p {
              color: rgba(51, 51, 51, 1);
              .fontSize(16);
              .lineHeight(20);
              font-weight: 400;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .docGroup_level {
              display: inline-block;
              background: rgba(118, 118, 118, 0.09);
              border-radius: 4px;
              .fontSize(14);
              font-weight: 400;
              color: rgba(137, 150, 159, 1);
              .padding(4, 6, 4, 6);
            }
          }
        }

        i {
          color: rgba(51, 51, 51, 1);
          .fontSize(24)
        }
      }
    }
  }
</style>
