## 功能（common-header公共头部组件）
## 使用
* 公共头部组件,代码如下
```bash
 <common-header :share-disabled="true"
                    :custom-title="'自定义标题'"
                    :back-redirect="'helloWorld3'"></common-header>
```
## 组件参数注释
*  share-disabled: Boolean 默认为false（禁用微信分享）
*  custom-title: String（自定义标题,必传参数,否则title不更新）
* back-redirect: String（  是否监听微信返回按钮并重定向
* 1.直接传入路由名字就行.(此处使用的path跳转,待优化)
* 2.ios端前进返回按钮都会出发重定向,使用时请注意(后续有问题再修改优化)
* 3.需要引用weixin-js-sdk 这个包,然后挂在到vue原型上.


