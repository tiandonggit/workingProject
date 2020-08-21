/**
* @Description: 日期选择组件
* @Author: 侯湃
* @Date: 2020/6/28
*/
<template>
  <el-date-picker
      v-model="date"
      size="mini"
      :class="[{'gray':grayBg,'noTime':!date.length}]"
      :clearable="false"
      :prefix-icon="'none'"
      :type="dateType"
      @change="changeSelectTimes"
      placeholder="设置日期"
      :range-separator="dateType === 'daterange' && date.length ? '-' : '' "
      start-placeholder="设置时间"
      end-placeholder="">
  </el-date-picker>
</template>

<script>
  export default {
    name: "datePicker",
    props: {
      time: {
        type: [Array, Number, Date, String],
        default() {
          return [];
        }
      },
      // 时间类型: 时间段/日期
      dateType: {
        type: String,
        default() {
          return "daterange";
        }
      },
      // 是否是灰色背景
      grayBg: {
        type: Boolean,
        default() {
          return false;
        }
      },
      // 任务id
      id: {
        type: String,
        default() {
          return "";
        }
      },
      // 自定义字段item
      item:{
        type:Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      time(val) {
        if (Array.isArray(this.time)) {
          this.date = val.concat();
        } else {
          this.date = val;
        }
      }
    },
    data() {
      return {
        date: ""
      };
    },
    methods: {
      /**
       * 确认时间
       * **/
      changeSelectTimes(data) {
        let params = {};
        // 时间段选取
        if (Array.isArray(data)) {
          try {
            params.id = this.id;
            params.startDate = this.$formatedDateToString(data[0]);
            params.endDate = this.$formatedDateToString(data[1]);
          } catch (e) {
            console.log(e);
          }
        } else {
          params.value = this.$formatedDateToString(data);
          params.item = this.item
        }
        this.$emit("changeSelectTimes", params);
      }
    },
    created() {
      if (Array.isArray(this.time)) {
        this.date = this.time.concat();
      } else {
        this.date = this.time;
      }
    }
  };
</script>

<style scoped lang="less">

  /deep/ .el-date-editor--daterange.el-input, .noTime.el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner  {
    width: 60px !important;

    /deep/ .el-range-input {
      width: 100% !important;;
    }

    /deep/ .el-range-input:nth-child(4) {
      display: none;
    }
  }

  /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
    width: 152px;
    border: 0 !important;
    padding: 3px 0 !important;
    background: none !important;

    /deep/ .el-input__icon.el-range__close-icon {
      display: none;
    }
  }


  /deep/ .el-date-editor--date .el-input__inner {
    padding: 0 !important;
    font-size: 14px !important;
    color: @titleColor !important;
  }

  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--date {
    width: 100px !important;
  }


  /deep/ .el-input__inner {
    border: 0 !important;
    padding: 0 !important;
    font-size: 14px !important;
    color: @titleColor !important;
    width: 100% !important;
    background: none !important;
    height: 24px !important;
    line-height: 24px !important;
  }

  /deep/ .none {
    display: none !important;
  }

  /deep/ .el-range-input {
    font-size: 14px !important;
    color: @titleColor;
    width: 50%;
    background: none !important;
    text-align: left !important;
  }

  /deep/ .el-range-separator {
    padding: 0 !important;
    font-size: 14px;
  }

  /deep/ .el-range-input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: @fontColor999 !important;
  }

  /deep/ .el-date-editor:hover {
    /deep/ .el-range-input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: @barBackgroundColor !important;
    }
  }

  /deep/ .el-range-separator {
    text-align: left !important;
  }
</style>
