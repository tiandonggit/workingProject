## 功能（navbar公共头部组件）
## 使用
* 公共头部组件,代码如下
```bash
    <nav-bar 
    rightText="添加"
    :isSearchBtn=true
    placeholder="搜索群组" 
    @clickRight="YYY"
    @goHistory="XXX"
    />
```
## 组件参数注释
*  rightText       String       选填      自定义右边文字
*  isSearchBtn     Boolen       选填      是否显示右边‘确定’按钮，默认false
*  placeholder     String       选填      自定义输入框内容


## 事件
*  XXX       返回上一步   
*  YYY       点击右边文字或者按钮





