
//     页面:获取网络信息
// 开发者:王海洋
const objectType = object => {
  return Object.prototype.toString
    .call(object)
    .slice(8, -1)
    .toLowerCase();
};

const TypeFunction = value => {
  return objectType(value) === "function";
};






export default { objectType, TypeFunction };
