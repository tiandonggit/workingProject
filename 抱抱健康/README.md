# app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

目录结构（mddir）
|-- 
    |-- .browserslistrc
    |-- .env.development
    |-- .env.production
    |-- .eslintrc.js
    |-- .gitignore
    |-- babel.config.js
    |-- jest.config.js
    |-- package-lock.json
    |-- package.json
    |-- postcss.config.js
    |-- README.md
    |-- vue.config.js
    |-- dist
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
    |   |-- App.vue
    |   |-- main.js
    |   |-- assets
    |   |   |-- css
    |   |   |   |-- cssCommon.less                          //公共样式
    |   |   |   |-- icon.css
    |   |   |   |-- reset.css
    |   |   |-- iconfont
    |   |   |-- images
    |   |-- components
    |   |   |-- agreement                                   //服务协议
    |   |   |   |-- agreement.vue
    |   |   |-- commonHeader
    |   |   |   |-- common_header.vue
    |   |   |   |-- READEME.md
    |   |   |-- navbar
    |   |   |   |-- navbar.vue
    |   |   |   |-- READEME.md
    |   |   |-- swiperBanner
    |   |       |-- swiper_banner.vue
    |   |-- pages
    |   |   |-- Doctor
    |   |   |   |-- articles                                //医生端文章
    |   |   |   |   |-- articleDetail.vue
    |   |   |   |   |-- articlesList.vue
    |   |   |   |   |-- articlesSearch.vue
    |   |   |   |   |-- articlesSearchAgain.vue
    |   |   |   |-- docAuditor                              //医生端审查
    |   |   |   |   |-- auditorFail.vue
    |   |   |   |   |-- auditorSuccess.vue
    |   |   |   |   |-- focusAccount.vue
    |   |   |   |   |-- testing.vue
    |   |   |   |-- docHome                                 //医生端首页
    |   |   |   |   |-- docCard.vue
    |   |   |   |   |-- docHome.vue
    |   |   |   |   |-- editIntro.vue
    |   |   |   |   |-- recoverySolution.vue
    |   |   |   |-- docIM                                   //医生端IM聊天
    |   |   |   |   |-- docAddChatGroupPerson.vue
    |   |   |   |   |-- docAddGroupPerson.vue
    |   |   |   |   |-- docChangeGroupName.vue
    |   |   |   |   |-- docChatGroup.vue
    |   |   |   |   |-- docChatIMDetail.vue
    |   |   |   |   |-- docChatIMList.vue
    |   |   |   |   |-- docCreateGroup.vue
    |   |   |   |   |-- docDoctorInfo.vue
    |   |   |   |   |-- docGetQuestionnaire.vue
    |   |   |   |   |-- docIMaddFriend.vue
    |   |   |   |   |-- docIMCardDetail.vue
    |   |   |   |   |-- docIMEditRemark.vue
    |   |   |   |   |-- docIMPatientInfo.vue
    |   |   |   |   |-- docIMSettings.vue
    |   |   |   |   |-- docPatientInfo.vue
    |   |   |   |   |-- docSearchChatGroupPerson.vue
    |   |   |   |   |-- docSearchGroupPerson.vue
    |   |   |   |   |-- docSearchPerson.vue
    |   |   |   |   |-- docSelectGroup.vue
    |   |   |   |   |-- submitAdvise.vue
    |   |   |   |-- docRegister                             //医生端注册
    |   |   |   |   |-- confirmHospital.vue
    |   |   |   |   |-- docRegister.vue
    |   |   |   |   |-- infoID.vue
    |   |   |   |   |-- searchCity.vue
    |   |   |   |   |-- searchCityAgain.vue
    |   |   |   |   |-- secondOffice.vue
    |   |   |   |   |-- selectHospital.vue
    |   |   |   |   |-- selectOffice.vue
    |   |   |   |-- task                                    //医生端im聊天任务
    |   |   |       |-- docPatientTask.vue
    |   |   |-- Patient
    |   |       |-- articles                                //患者端文章
    |   |       |   |-- articleDetail.vue
    |   |       |   |-- articlesList.vue
    |   |       |   |-- articlesSearch.vue
    |   |       |   |-- articlesSearchAgain.vue
    |   |       |-- chooseDisease                           //患者端选择疾病
    |   |       |   |-- chooseDisease.vue
    |   |       |-- patientHome                             //患者端首页
    |   |       |   |-- patientHome.vue
    |   |       |-- PatientIM                               //患者端聊天
    |   |       |   |-- chatIMDetail.vue
    |   |       |   |-- chatIMList.vue
    |   |       |   |-- chatIMListSearch.vue
    |   |       |   |-- chatIMSettings.vue
    |   |       |   |-- doctorMessage.vue
    |   |       |   |-- doctorTeamSearch.vue
    |   |       |   |-- payAdvisory.vue
    |   |       |   |-- payAdvisoryDetails.vue
    |   |       |   |-- updateRemark.vue
    |   |       |-- patientRegister                          //患者端注册
    |   |       |   |-- patientMessageComplete.vue
    |   |       |   |-- patientRegister.vue
    |   |       |-- personalCenter                           //患者端个人中心
    |   |       |   |-- personalCenter.vue
    |   |       |-- task                                     //患者端任务
    |   |           |-- diseaseMessage.vue
    |   |           |-- patientTask.vue
    |   |           |-- questionnaire.vue
    |   |           |-- questionnaireDetail.vue
    |   |-- router
    |   |   |-- index.js
    |   |-- store
    |   |   |-- index.js
    |   |   |-- modules
    |   |       |-- Doctor
    |   |       |   |-- Address.js                          //医生端地址数据
    |   |       |   |-- DoctorIM.js                         //医生端聊天所需数据
    |   |       |   |-- DoctorInfoID.js                     //医生端个人信息
    |   |       |-- Patient
    |   |           |-- PatientIM.js
    |   |           |-- PatientMessage.js
    |   |-- utils
    |       |-- h5plus.js
    |       |-- httpConfig.js
    |       |-- method.js
    |       |-- plugin.js
    |       |-- request.js
    |       |-- startUp.js                                  //应用启动时请求医生或者患者个人信息，并保存
    |-- tests
        |-- unit
            |-- .eslintrc.js
            |-- example.spec.js