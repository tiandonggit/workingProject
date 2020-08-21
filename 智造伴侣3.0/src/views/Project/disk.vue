<template>
  <div class="disk_page">
    <cloud-disk-component :projectCloudDisk="true"></cloud-disk-component>
  </div>
</template>

<script>

  import cloudDiskComponent from "@/components/CloudDisk/cloudDiskComponent";
  import {mapState} from "vuex";

  export default {
    name: "disk",
    components: {
      cloudDiskComponent
    },
    computed: {
      ...mapState(["fileDiskData"])
    },
    created() {
      this.$nextTick(() => {
        if (this.fileDiskData.checkedFileSpaceMessage.fileSpaceId)
          this.$bus.emit("getFileListByFileSpaceId");
      });
    }
  };
</script>

<style scoped lang="less">
  .disk_page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 74px;
  }
</style>
