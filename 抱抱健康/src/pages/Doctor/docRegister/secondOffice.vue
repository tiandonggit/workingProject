/* *@Description: 选择三级科室 *@Author: tiandong *@Date: 2020-01-03 */
<!---->
<template>
  <div id="secondOffice">
    <common-header
      :share-disabled="true"
      :custom-title="'选择科室'"
      :header-show="true"
      title="选择科室"
    ></common-header>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        @click.stop="activeEvent(item, index)"
        :class="index == selected ? 'active' : ''"
      >
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "secondOffice",
  data() {
    return {
      items: [],
      activeItem: "",
      selected: -1
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.items = JSON.parse(this.$route.query.items);
    console.log(this.items);
  },
  methods: {
    activeEvent(item, index) {
      this.selected = index;
      this.$store.commit("DoctorInfoID/setOffice", {
        office: item.text,
        id: item.id
      });
      this.$router.push({
        name: "infoID"
      });
    }
  }
};
</script>

<style lang="less" scoped>
#secondOffice {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background: @backgroundColor;
  .padding(44, 0, 44, 0);
}

ul {
  background: @backgroundColorT;
  .width(351);
  margin: 0 auto;
  .borderRadius(10,10,10,10);
  overflow: hidden;

  .active {
    color: @mainColor;
  }
  li {
    width: 100%;
    .height(44);
    .lineHeight(44);
    .fontSize(16);
    color: @titleColor;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:last-child {
      border-bottom:  none;
    }

    span {
      .margin(0, 0, 0, 10);
    }
  }
}
</style>
