<template>
  <div class="home">
    <div id="example-3">
      <input type="checkbox" v-model="isAllChecked" @click="chooseAll" />
      <input
        type="checkbox"
        id="jack"
        value="Jack"
        v-model="checkedCode"
        @change="singleChecked"
      />
      <label for="jack">Jack</label>
      <input type="checkbox" id="john" value="John" v-model="checkedCode" @change="singleChecked"/>
      <label for="john">John</label>
      <input type="checkbox" id="mike" value="Mike" v-model="checkedCode" @change="singleChecked"/>
      <label for="mike">Mike</label>
      <br />
      <span>Checked names: {{ checkedCode }}</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  data() {
    return {
      checkedCode: [],
      isAllChecked: false,
    };
  },
  watch: {
    isAllChecked(res,res2){
      console.log(res,res2)
    }
  },
  components: {},
  methods: {
    // 用户单选
    singleChecked: function() {
      console.log(this.checkedCode)
      //判断每一个CheckBox是否选中，全选中让全选按钮选中
      if (this.checkedCode.length === 3) {
        this.isAllChecked = true;
      } else {
        // 只要有一个checkbox不选中，让全选按钮不选中
        this.isAllChecked = false;
      }
    },

    // 用户全选
    chooseAll: function(e) {
      var that = this;
      if (that.checkedCode.length !== 0) {
        that.checkedCode = [];
      }
      console.log(that.isAllChecked);
      if (!that.isAllChecked) {
        this.checkedCode = ["Jack", "John", "Mike"];
      } else {
        that.checkedCode = [];
      }
    }
  }
};
</script>
<style scoped></style>
