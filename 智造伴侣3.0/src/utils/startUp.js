// 由于文件空间的权限是后台配置 vuex的缓存中存储的文件空间权限可能不是最新,所以初始化的时候清空
import store from "../store/index";
let checkedFileSpaceMessage = {
  fileSpaceName: "",
  fileSpaceId: "",
  filePermission: []
};
store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
