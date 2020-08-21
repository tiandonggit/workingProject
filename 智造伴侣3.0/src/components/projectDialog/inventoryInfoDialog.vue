/**
*@desc 修改清单信息弹窗
*@author tiandong
*@date 2020/03/23 11:14:23
*/
<template>
  <div class="modal-box" @click.stop="dialogShowOrFalse">
    <el-dialog
        class="inventoryInfoDialog_page"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
        :visible.sync="isShowInventoryInfoDialog"
        :show-close="false"
        :before-close="handleClose">
      <div class="inventoryInfo-container">
        <div class="title-box">
          <div class="title" v-if="inventoryInfo.projectName && inventoryInfo.listName">
            {{inventoryInfo.projectName + "-" + inventoryInfo.listName}}
          </div>
          <div style="color: #fff;width: 20px;height: 100%" v-else></div>
          <div class="right">
            <el-dropdown
                trigger="click"
                @command="deleteTask($event)"
                placement="bottom">
              <span class="el-dropdown-link">
                <img class="img1" src="../../assets/image/icon-p-more.png" alt/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="deleteTask">删除任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <img class="img2" @click.stop="handleClose" src="../../assets/image/icon_i_close.png" alt/>
          </div>
        </div>
        <div class="scroll_box" v-loading="loading">
          <div class="info-box">
            <!--            面包屑-->
            <task-breadcrumb
                :breadcrumbList="breadcrumbList"
                @breadcrumbChange="breadcrumbChange"></task-breadcrumb>
            <div class="title">
              <el-checkbox v-model="inventoryInfo.completed"
                           @change="completeSubTask(inventoryInfo)"/>
              <div>{{inventoryInfo.name ||""}}</div>
            </div>
            <!--            项目负责人、时间、负责人、优先级-->
            <div class="info">
              <div class="name" @click.stop="dialogShowOrFalse('responsiblePersonSelectShow')">
                <img src="../../assets/image/icon_i_fuzeren.png" alt/>
                <div class="highlight_div" :class="[{'fontColor999':!inventoryInfo.execUserNickname}]">
                  {{inventoryInfo.execUserNickname || "设置负责人"}}
                </div>
                <responsible-person-select
                    @responsiblePersonUpdate="updateInventoryInfo"
                    :taskId="inventoryInfo.id"
                    v-if="dialogShow.responsiblePersonSelectShow"
                    :execUser="inventoryInfo.execUser"></responsible-person-select>
              </div>
              <div class="date">
                <img src="../../assets/image/icon_i_date.png" alt/>
                <div>
                  <date-picker
                      @changeSelectTimes="taskDetailUpadate"
                      :id="inventoryInfo.id"
                      :time="inventoryInfo.time"></date-picker>
                </div>
              </div>
              <div class="level"
                   :class="[{'level':true,'highest':inventoryInfo.priority===0,'high':inventoryInfo.priority===1,'normal':inventoryInfo.priority===2,'low':inventoryInfo.priority===3}]"
                   @click.stop="dialogShowOrFalse('prioritySelectDialogShow')">
                <i class="icon-youxianji iconfont"></i>
                <div :class="[{'fontColor999':inventoryInfo.priority === ''}]">
                  {{inventoryInfo.priority | priorityFormat }}
                </div>
                <priority-select
                    :taskId="inventoryInfo.id"
                    :priority="inventoryInfo.priority"
                    @selectedPriority="updateInventoryInfo"
                    v-if="dialogShow.prioritySelectDialogShow"></priority-select>
              </div>
            </div>
            <!--            项目标签-->
            <div class="field">
              <img src="../../assets/image/icon_i_biaoqian.png" alt/>
              <span
                  class="tip_span"
                  v-if="!inventoryInfo.tags.length"
                  @click.stop="dialogShowOrFalse('tagAddShow')">添加标签</span>
              <el-tag
                  v-for="tag in inventoryInfo.tags"
                  :key="tag.id"
                  size="small"
                  :color="tag.color"
                  @close="tagsUpadate(tag)"
                  closable>
                {{tag.name}}
              </el-tag>
              <img
                  v-if="inventoryInfo.tags.length"
                  src="../../assets/image/icon_i_jiahao.png"
                  alt
                  @click.stop="dialogShowOrFalse('tagAddShow')"/>
              <tag-add
                  v-if="dialogShow.tagAddShow"
                  :tagIds="tagIds"
                  :projectId="inventoryInfo.projectId"
                  @tagsUpadate="tagsUpadate"></tag-add>
            </div>
            <!--            项目描述-->
            <div class="desc">
              <img src="../../assets/image/icon_i_desc.png" alt/>
              <div class="task_desc">
                <div class="addTask_desc">
                <span
                    class="tip_span"
                    v-if="!inventoryInfo.description && !taskDescEdit"
                    @click.stop="taskDescEditFocus">
                  添加任务描述
                </span>
                  <span v-if="inventoryInfo.description && !taskDescEdit">
                  任务描述
                  <i @click.stop="taskDescEditFocus">编辑</i>
                </span>
                </div>
                <div class="edit_desc" v-if="inventoryInfo && !taskDescEdit">
                  <p>{{inventoryInfo.description || ""}}</p>
                </div>
                <div v-if="taskDescEdit">
                  <el-input
                      v-model="inventoryInfo.description"
                      type="text"
                      maxLength="50"
                      ref="taskDescInput"
                      size="small"
                      v-if="taskDescEdit"
                      placeholder=""></el-input>
                </div>
                <div class="taskdesc_btn" v-if="taskDescEdit">
                  <el-button
                      type="primary"
                      size="mini"
                      @click.stop="updateInventoryInfo({description:inventoryInfo.description,id:inventoryInfo.id})">
                    确定
                  </el-button>
                  <el-button
                      type="primary"
                      class="cancel_btn"
                      size="mini"
                      @click.stop="taskDescEdit=false">
                    取消
                  </el-button>
                </div>
              </div>
            </div>
            <!--            项目附件-->
            <div class="fujian">
              <div class="fujian-info"
                   :key="fileItem.id"
                   v-for="fileItem in inventoryInfo.files">
                <img src="../../assets/image/icon_other.png"
                     alt="">
                <div class="nameAndAction_box">
                  <p>{{fileItem.name || ''}}</p>
                  <p class="size_action">
                    <span>{{fileItem.displaySize || ''}}</span>
                    <span>
                      <i @click.stop="submitDownloadFile(fileItem.id)">下载</i>
                      <i @click.stop="deleteProjectFile(fileItem.id)">删除</i>
                    </span>
                  </p>
                </div>
              </div>
              <div class="fujian-info"
                   v-for="uploadingItem in uploadingFileList"
                   :key="uploadingItem.id">
                <img src="../../assets/image/icon_excel.png" alt/>
                <div class="nameAndAction_box">
                  <p>{{ uploadingItem.name || ""}}</p>
                  <p class="size_action">
                    <el-progress :format="format" :percentage="uploadingItem.progress"></el-progress>
                  </p>
                </div>
              </div>
              <div class="add-new-fujian" v-if="(!uploadingFileList.length) && inventoryInfo.id">
                <input type="file"
                       ref="clearFile"
                       @change="uploadFile"/>
                上传新附件
              </div>
            </div>
          </div>
          <!--          自定义字段-->
          <div class="field-box">
            <div class="title">
              <img src="../../assets/image/icon_i_ziduanguanli.png" alt/>
              <div class="relative_box">
                自定义字段
                <span class="addfields_span" @click.stop="dialogShowOrFalse('fieldsAddShow')">
                  添加
                </span>
                <add-fields
                    :fieldsIds="fieldsIds"
                    @fieldsUpadate="fieldsUpadate"
                    :projectId="inventoryInfo.projectId"
                    v-if="dialogShow.fieldsAddShow"></add-fields>
              </div>
            </div>
            <div class="value"
                 v-for="(item,index) in inventoryInfo.fields"
                 :key="index">
              {{item.name || ""}}
              <!--              单选/多选 类型-->
              <div class="relative_box"
                   v-if="item.type == '1' || item.type == '2'"
                   style="padding-left: 30px">
                <el-tag
                    v-for="tag in item.value"
                    :disable-transitions="item.type == '1'"
                    @click.stop="addCustomFields(item)"
                    @close="closeFieldsTag(tag,item)"
                    :key="tag"
                    size="small"
                    :color="'#cfcfcf'"
                    :closable="item.type == '2'">
                  {{tag || ""}}
                </el-tag>
                <span class="highlight_div"
                      v-if="(item.value.length !== item.options.length && item.type == '2') || !item.value.length"
                      @click.stop="addCustomFields(item)">
                  添加
                </span>
                <custom-fields
                    v-if="item.editFields"
                    @updateCustomFields="updateCustomFields"
                    :fieldId="item.id"
                    :customFieldsList="item.optionsArray"
                    :value="item.value"
                    :customFieldsType="item.type"></custom-fields>
              </div>
              <!--              文本类型-->
              <div class="relative_box"
                   style="padding-left: 30px"
                   @click.stop="$stopstop"
                   v-if="item.type == '0'">
                <div class="highlight_div"
                     :class="[{'color333':item.value}]"
                     @click.stop="addCustomFields(item)"
                     v-if="!item.editFields">
                  {{item.value || "添加"}}
                </div>
                <el-input
                    v-model="item.value"
                    @blur="valueSubmit(item)"
                    class="fields_input"
                    v-if="item.editFields"
                    type="text"
                    maxLength="10"
                    :ref="`textFieldsInput${item.id}`"
                    size="small"
                    placeholder=""></el-input>
              </div>
              <!--              时间类型-->
              <div class="relative_box"
                   style="padding-left: 30px"
                   v-if="item.type == '3'">
                <div>
                  <date-picker
                      @changeSelectTimes="fieldsTimeUpadte"
                      :item="item"
                      :dateType="'date'"
                      :time="item.value"></date-picker>
                </div>
              </div>
            </div>
          </div>
          <!--          子任务-->
          <div class="task-box">
            <div class="title">
              <img src="../../assets/image/icon_i_zirenwu.png" alt/>
              <div>子任务</div>
            </div>
            <div class="task"
                 v-for="item in inventoryInfo.subtasks"
                 :key="item.id">
              <div class="left">
                <el-checkbox
                    v-model="item.completed"
                    @change="completeSubTask(item)"/>
                <div @click.stop="getInventoryInfo(item.id,false,false)">
                  {{item.name || ""}}
                </div>
              </div>
              <div class="right">
                <div class="name">
                  <img src="../../assets/image/icon_i_fuzeren.png" alt/>
                  <div @click.stop="openSubTaskResPersonSelect(item)"
                       :class="[{'fontColor999':!item.execUserNickname}]"
                       class="highlight_div">
                    {{item.execUserNickname || "设置负责人"}}
                  </div>
                  <responsible-person-select
                      :taskType="'subTask'"
                      :taskId="item.id"
                      @responsiblePersonUpdate="updateInventoryInfo"
                      v-if="item.responsiblePersonSelectShow"
                      :execUser="item.execUser"></responsible-person-select>
                </div>
                <div class="date">
                  <img src="../../assets/image/icon_i_date.png" alt/>
                  <div>
                    <date-picker
                        @changeSelectTimes="taskDetailUpadate"
                        :id="item.id"
                        :time="item.time"></date-picker>
                  </div>
                </div>
              </div>
            </div>
            <!--            添加子任务-->
            <div class="add-task-div"
                 @click.stop="addSubTask=true"
                 v-if="addSubTask">
              <el-input
                  v-model="newTaskDetail.name"
                  type="text"
                  maxLength="10"
                  ref="addSubTaskInput"
                  v-hotkey="{'enter': addSubTaskSubmit, 'esc': closeAddSubTask }"
                  size="small"
                  placeholder="输入标题 回车创建 ESC取消"></el-input>
              <div class="flex_div">
                <div class="name" @click.stop="dialogShowOrFalse('subResponsiblePersonSelectShow','addSubTask')">
                  <img src="../../assets/image/icon_i_fuzeren.png" alt/>
                  <div :class="[{'fontColor999':!newTaskDetail.execUserNickname}]" class="highlight_div">
                    {{newTaskDetail.execUserNickname || "设置负责人"}}
                  </div>
                  <responsible-person-select
                      @responsiblePersonUpdate="updateInventoryInfo"
                      :taskType="'addTask'"
                      v-if="dialogShow.subResponsiblePersonSelectShow"
                      :execUser="newTaskDetail.execUser"></responsible-person-select>
                </div>
                <div class="date">
                  <img src="../../assets/image/icon_i_date.png" alt/>
                  <div>
                    <date-picker
                        @changeSelectTimes="taskDetailUpadate"
                        :grayBg="true"
                        :time="newTaskDetail.time"></date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div class="add-task"
                 @click.stop="addSubTaskShow"
                 v-else>
              添加子任务
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import prioritySelect from "@/components/prioritySelect/prioritySelect";
  import responsiblePersonSelect from "@/components/responsiblePersonSelect/responsiblePersonSelect";
  import datePicker from "./datePicker/datePicker";
  import tagAdd from "@/components/tagAdd/tagAdd";
  import customFields from "./customFields/customFields";
  import addFields from "./addFields/addFields";
  import taskBreadcrumb from "./taskBreadcrumb/taskBreadcrumb";
  import {mapState} from "vuex";
  import {homeSrv} from "../../views/Home/home.service";
  import {projectSrv} from "../../views/Project/project.service";
  import {cloudDiskSrv} from "../../views/CloudDisk/cloudDisk.service";
  import proto from "@/utils/UploadRequest_pb";
  import proto1 from "@/utils/UploadResponse_pb";

  const CryptoJS = require("crypto-js");

  export default {
    name: "inventoryInfoDialog",
    components: {
      prioritySelect,
      responsiblePersonSelect,
      tagAdd,
      datePicker,
      customFields,
      addFields,
      taskBreadcrumb
    },
    props: {
      isShowInventoryInfoDialog: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    filters: {
      priorityFormat(value) {
        let priority = "";
        switch (value) {
          case 0:
            priority = "最高";
            break;
          case 1:
            priority = "较高";
            break;
          case 2:
            priority = "普通";
            break;
          case 3:
            priority = "较低";
            break;
          default:
            priority = "普通";
        }
        return priority;
      }
    },
    computed: {
      ...mapState(["homeData", "loginData", "imData", "mailListData", "projectData"]),
      /**
       * 当前任务已添加过的标签id
       * **/
      tagIds() {
        let tagIds = [];
        this.inventoryInfo.tags.forEach(item => {
          tagIds.push(item.id);
        });
        return tagIds;
      },
      /**
       * 当前任务添加过的自定义字段id
       * **/
      fieldsIds() {
        let fieldsIds = [];
        this.inventoryInfo.fields.forEach(item => {
          fieldsIds.push(item.id);
        });
        return fieldsIds;
      }
    },
    data() {
      return {
        dialogShow: {
          prioritySelectDialogShow: false, // 选择优先级
          responsiblePersonSelectShow: false, // 选择负责人
          subResponsiblePersonSelectShow: false,
          tagAddShow: false, // 添加标签
          fieldsAddShow: false // 添加自定义字段
        },
        taskDescEdit: false, // 任务描述编辑
        addSubTask: false, // 添加子任务
        inventoryInfo: {
          projectName: "",
          id: "",
          listId: "", // 清单id
          name: "", // 任务名
          execUser: "", // 负责人
          execUserNickname: "", // 负责人昵称
          startDate: "", // 开始时间
          endDate: "", // 结束时间
          time: [],// 任务时间
          priority: "", // 优先级
          description: "", // 任务描述
          status: "0", // 0 未完成 1 已完成
          completed: false, // 任务是否完成
          tags: [], // 任务标签
          fields: [],
          subtasks: [],
          files: []
        },
        newTaskDetail: {
          execUser: "", // 负责人名字
          execUserNickname: "",
          name: "", // 任务名
          time: [],
          startDate: "",
          endDate: ""
        },
        loading: false,
        breadcrumbList: [],
        uploadFileSocket: null,
        isDestroy: false, // 用于优化计算大文件SHA1值过久(组件销毁之后还在继续执行)的内存回收问题
        uploadingFileList: [], // 上传中的文件
        uploadFileAry: [] // file文件(单选)
      };
    },
    methods: {
      /**
       * 任务面包屑点击事件
       * **/
      breadcrumbChange(params) {
        let {index, id} = params;
        this.breadcrumbList = this.breadcrumbList.slice(0, index);
        this.getInventoryInfo(id, true,false);
      },
      /**
       * 关闭任务详情弹窗
       * **/
      handleClose() {
        this.$emit("closeInventoryInfoDialog");
      },
      /**
       * 删除任务
       * **/
      deleteTask(command) {
        if (command === "deleteTask") {
          this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let params = {
              projectId: this.inventoryInfo.projectId,
              id: this.inventoryInfo.id
            };
            projectSrv.deleteTask(params).then(response => {
              if (response.success) {
                this.$message.success("删除成功");
                this.$emit("refreshList");
                this.handleClose();
              } else {
                this.$message.error(response.message || "操作失败");
              }
            }).catch(error => {
              console.log(error);
            });
          }).catch(() => {
          });
        }
      },
      /**
       * 开启/关闭二级弹窗
       * **/
      dialogShowOrFalse(dialog, parentDialog) {
        this.closeSubDialog();
        // this.taskDescEdit = false;
        this.addSubTask = false;
        Object.keys(this.dialogShow).forEach(item => {
          this.dialogShow[item] = false;
        });
        if (dialog) {
          this.dialogShow[dialog] = true;
        }
        if (parentDialog) {
          this[parentDialog] = true;
        }
      },
      /**
       * 关闭子弹窗
       * **/
      closeSubDialog() {
        this.inventoryInfo.subtasks.length && this.inventoryInfo.subtasks.forEach(item => {
          item.responsiblePersonSelectShow = false;
        });
        this.inventoryInfo.fields.length && this.inventoryInfo.fields.forEach(item => {
          item.editFields = false;
        });
      },
      /**
       * 调用updata接口更新
       * **/
      updateInventoryInfo(params) {
        if (params.taskType === "subTask") {
          this.inventoryInfo.subtasks.forEach(item => {
            if (params.id === item.id) {
              Object.keys(params).forEach(key => {
                item[key] = params[key];
              });
              // 调用update接口
              this.taskDetailUpadate(params);
            }
            item.responsiblePersonSelectShow = false;
          });
        } else if (params.taskType === "addTask") {
          Object.keys(params).forEach(key => {
            this.newTaskDetail[key] = params[key];
          });
          this.dialogShowOrFalse("", "addSubTask");
        } else {
          Object.keys(params).forEach(key => {
            this.inventoryInfo[key] = params[key];
          });
          // 调用update接口
          this.taskDetailUpadate(params);
          this.dialogShowOrFalse();
        }
      },
      /**
       * 为任务添加/移除字段
       * **/
      fieldsUpadate(fieldItem) {
        if (!fieldItem.id) return false;
        let params = {
          taskId: this.inventoryInfo.id,
          fieldId: fieldItem.id
        };
        let matchingResults = this.$hasValueFromArray(
          this.inventoryInfo.fields,
          "id",
          fieldItem.id
        );
        if (matchingResults.value) {
          projectSrv.deleteFieldForTask(params).then(response => {
            if (response.success) {
              this.getInventoryInfo();
            } else {
              this.$message.error(response.message || "操作失败");
            }
          }).catch(error => {
            console.log(error);
          });
        } else {
          projectSrv.addFieldForTask(params).then(response => {
            if (response.success) {
              this.getInventoryInfo();
            } else {
              this.$message.error(response.message || "操作失败");
            }
          }).catch(error => {
            console.log(error);
          });
        }
      },
      /**
       * 更新标签
       * **/
      tagsUpadate(tagItem) {
        if (!tagItem.id) return false;
        let params = {
          taskId: this.inventoryInfo.id,
          tagId: tagItem.id,
          projectId: this.inventoryInfo.projectId
        };
        let matchingResults = this.$hasValueFromArray(
          this.inventoryInfo.tags,
          "id",
          tagItem.id
        );
        if (matchingResults.value) {
          projectSrv.removeTaskTags(params).then(response => {
            if (response.success) {
              this.inventoryInfo.tags.splice(matchingResults.index, 1);
            } else {
              this.$message.error(response.message || "操作失败");
            }
          }).catch(error => {
            console.log(error);
          });
        } else {
          projectSrv.addTaskTags(params).then(response => {
            if (response.success) {
              this.inventoryInfo.tags.push(tagItem);
            } else {
              this.$message.error(response.message || "操作失败");
            }
          }).catch(error => {
            console.log(error);
          });
        }
      },
      /**
       * 任务描述编辑input聚焦
       * **/
      taskDescEditFocus() {
        this.dialogShowOrFalse();
        this.taskDescEdit = true;
        this.$nextTick(() => {
          this.$refs.taskDescInput.focus();
        });
      },
      /**
       * 任务checkbox勾选update,区分子任务还是根业务
       * 单独走任务详情update接口,checkbox异步勾选,如果接口失败则恢复提交前的勾选状态
       * **/
      completeSubTask(value) {
        let params = {
          id: value.id,
          status: value.completed ? 2 : 1
        };
        projectSrv.taskDetailUpadate(params).then(response => {
          if (response.success) {
          } else {
            this.$message.error(response.message || "操作失败");
            value.completed = !value.completed;
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 子任务负责人弹窗互斥
       * **/
      openSubTaskResPersonSelect(taskItem) {
        this.dialogShowOrFalse();
        this.inventoryInfo.subtasks.length && this.inventoryInfo.subtasks.forEach(item => {
          item.responsiblePersonSelectShow = taskItem.id === item.id;
        });
      },
      /**
       * 添加子任务
       * **/
      addSubTaskShow() {
        this.dialogShowOrFalse();
        this.addSubTask = true;
        try {
          this.$nextTick(() => {
            this.$refs.addSubTaskInput.focus();
            let scrollBox = document.querySelector(".scroll_box");
            scrollBox.scrollTop = scrollBox.scrollHeight;
          });
        } catch (e) {
          console.log(e);
        }
      },
      /**
       * 关闭添加子任务input
       * **/
      closeAddSubTask() {
        this.addSubTask = false;
      },
      /**
       * 新建子任务提交
       * **/
      addSubTaskSubmit() {
        let params = {
          projectId: this.inventoryInfo.projectId,
          name: this.newTaskDetail.name,
          parentId: this.inventoryInfo.id,
          listId: this.inventoryInfo.listId,
          execUser: this.newTaskDetail.execUser,
          execUserNickname: this.newTaskDetail.execUserNickname,
          startDate: this.newTaskDetail.startDate,
          endDate: this.newTaskDetail.endDate
        };
        if (!params.name) {
          this.$message.error("请输入任务名称");
          return false;
        }
        projectSrv.addSubTask(params).then(response => {
          if (response.success) {
            this.newTaskDetail = {
              execUser: "",
              execUserNickname: "",
              name: "",
              time: [],
              startDate: "",
              endDate: ""
            };
            let newSubtask = response.data;
            newSubtask.responsiblePersonSelectShow = false;
            if (newSubtask.startDate && newSubtask.endDate) {
              newSubtask.time = [
                new Date(newSubtask.startDate),
                new Date(newSubtask.endDate)
              ];
            }
            this.inventoryInfo.subtasks.unshift(newSubtask);
            this.addSubTask = false;
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 更新自定义字段的值
       * **/
      updateCustomFields(params) {
        if (params.customFieldsType == "1" || params.customFieldsType == "2") {
          try {
            let matchingResult = this.$hasValueFromArray(
              this.inventoryInfo.fields,
              "id",
              params.id
            );
            if (matchingResult.value) {
              if (params.customFieldsType == "1") {
                matchingResult.value.editFields = false;
              }
              // 多选的时候字段数为零的时候关闭弹窗
              if (params.customFieldsType == "2" && !params.value.length) {
                this.inventoryInfo.fields[matchingResult.index].editFields = false;
              }
              this.updateCustomFieldsSubmit(this.inventoryInfo.fields[matchingResult.index], params.value);
            }

          } catch (e) {
            console.log(e);
          }
        }
      },
      /**
       * 关闭自定义字段标签
       * **/
      closeFieldsTag(tag, item) {
        let value;
        try {
          value = item.value.concat();
          let deleteIndex = this.$getIndex(value, tag);
          if (deleteIndex !== undefined) {
            value.splice(deleteIndex, 1);
          }
        } catch (e) {
          console.log(e);
        }
        this.updateCustomFieldsSubmit(item, value);
      },
      /**
       * 自定义字段值更新时间
       * **/
      fieldsTimeUpadte(params) {
        this.updateCustomFieldsSubmit(params.item, params.value);
      },
      /**
       * 给自定义字段设置值
       * **/
      updateCustomFieldsSubmit(item, value) {
        let params = {
          taskId: this.inventoryInfo.id,
          fieldId: item.id,
          value: typeof value === "string" ? value : value.join()
        };
        projectSrv.setFieldValue(params).then(response => {
          if (response.success) {
            if (item.type == 3) {
              // 时间转换
            } else {
              item.value = value;
            }
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 添加自定义字段值
       * **/
      addCustomFields(customFieldsItem) {
        this.dialogShowOrFalse();
        this.inventoryInfo.fields.length && this.inventoryInfo.fields.forEach(item => {
          item.editFields = customFieldsItem.id === item.id;
        });
        // 如果是文本类型的字段,聚焦input
        if (customFieldsItem.type == 0) {
          this.$nextTick(() => {
            try {
              let refName = `textFieldsInput${customFieldsItem.id}`;
              this.$refs[refName][0].focus();
            } catch (e) {
              console.log(e);
            }
          });
        }
      },
      /**
       * 自定义字段文本字段失焦事件
       * **/
      valueSubmit(item) {
        this.updateCustomFieldsSubmit(item, item.value);
      },
      /**
       * 任务详情查询
       * **/
      getInventoryInfo(id = "", notUpdateBreadcrumb = true, loading = true) {
        if (loading) {
          this.loading = true;
        }
        let params = {
          id: this.projectData.selectedTask.id || ""
        };
        if (id) {
          params.id = id;
        }
        projectSrv.getTaskDetail(params).then(response => {
          if (response.success && response.data) {
            let inventoryInfo = response.data;
            // 处理开始时间和截止时间
            if (inventoryInfo.startDate && inventoryInfo.endDate) {
              let time = [
                new Date(inventoryInfo.startDate),
                new Date(inventoryInfo.endDate)
              ];
              inventoryInfo.time = time;
            } else {
              inventoryInfo.time = [];
            }
            // 处理任务完成状态(checkbox)
            inventoryInfo.completed = inventoryInfo.status === 2;
            // 自定义字段 数据处理(编辑状态、字段value)
            inventoryInfo.fields.length && inventoryInfo.fields.forEach(item => {
              item.editFields = false;
              item.options = item.optionsArray || [];
              if (item.type == 3 && item.value) {
                item.value = new Date(item.value);
              } else if (item.type == 1 || item.type == 2) {
                item.value = item.value ? item.value.split(",") : [];
              }
            });
            // 子任务数据处理(编辑状态、time处理等)
            inventoryInfo.subtasks.length && inventoryInfo.subtasks.forEach(item => {
              item.responsiblePersonSelectShow = false;
              item.completed = item.status === 2;
              if (item.startDate && item.endDate) {
                let time = [
                  new Date(item.startDate),
                  new Date(item.endDate)
                ];
                item.time = time;
              }
            });
            // 子任务查询的时候 处理面包屑
            if (id && !notUpdateBreadcrumb) {
              this.breadcrumbList.push({
                name: this.inventoryInfo.name,
                id: this.inventoryInfo.id
              });
            }
            this.inventoryInfo = inventoryInfo;
            console.log("this.inventoryInfo", this.inventoryInfo);
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error("获取任务详情接口报错");
          }
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      },
      /**
       * 任务详情 update
       * @params fieldsObj key value 要更新的字段对象
       * **/
      taskDetailUpadate(fieldsObj) {
        // 子任务创建之前设置时间
        if (!fieldsObj.id) {
          this.newTaskDetail.startDate = fieldsObj.startDate;
          this.newTaskDetail.endDate = fieldsObj.endDate;
        } else {
          projectSrv.taskDetailUpadate(fieldsObj).then(response => {
            if (response.success) {
              this.taskDescEdit = false;
            } else {
              this.$message.error(response.message || "操作失败");
            }
          }).catch(error => {
            console.log(error);
          });
        }
      },
      /**
       * 文件上传webSocket初始化
       * **/
      uploadFileSocketInit() {
        console.log("文件上传sokect连接中...");
        let severToken = window.localStorage.getItem("serverToken");
        if (!severToken) {
          this.$message("登录已过期,请重新登录");
          this.$routerLink("login");
          return false;
        }
        // let socketUrl = "wss://" + this.loginData.imServerToken.ImServer + "/im_websocket";
        let socketUrl = this.$globalServiceHost.fileDiskSocketHost;
        this.uploadFileSocket = new WebSocket(socketUrl);
        this.uploadFileSocket.binaryType = "arraybuffer";
        this.uploadFileSocket.onopen = this.websocketonopen;
        this.uploadFileSocket.onmessage = this.websocketonmessage;
        this.uploadFileSocket.onerror = this.websocketonerror;
        this.uploadFileSocket.onclose = this.websocketclose;
      },
      /**
       *@desc websocket连接成功后,如果还有待上传,则继续上传.
       *@author houpai
       *@date 2020/03/26 10:59:01
       */
      websocketonopen() {
        console.log("文件上传sokect连接成功");
        if (this.uploadData.uploadingFileList.length && this.uploadData.uploadingFileList[0].uploadOffset && this.uploadData.uploadingFileList[0].chunkSize && this.uploadData.uploadingFileList[0].fileId) {
          let patchParams = {
            uploadOffset: this.uploadData.uploadingFileList[0].uploadOffset,
            chunkSize: this.uploadData.uploadingFileList[0].chunkSize,
            fileId: this.uploadData.uploadingFileList[0].fileId
          };
          this.synchronizationUploadHandle("PatchRequest", patchParams);
        } else if (this.uploadData.uploadingFileList.length && !this.uploadData.uploadingFileList[0].fileId) {
          this.synchronizationUploadHandle("CreationRequest");
        }
      },

      /**
       *@desc websocket接收消息,protocol反序列化
       *@author houpai
       *@date 2020/03/26 11:48:24
       */
      websocketonmessage(e) {
        this.uploadResponseHandle(e);
      },

      websocketonerror() {
        console.log("文件上传socket连接错误");
      },

      websocketclose() {
        if (!this.uploadFileSocket) {
          console.log("socket重新连接");
          setTimeout(() => {
            this.uploadFileSocketInit();
          }, 3000);
        }
      },
      /**
       * proto UploadRequest
       * **/
      UploadRequest() {
        let UploadRequest = new proto.UploadRequest();
        return UploadRequest;
      },
      /**
       * proto UploadResponse
       * **/
      UploadResponse() {
        let UploadResponse = new proto1.UploadResponse();
        return UploadResponse;
      },
      /**
       * proto CreationRequest
       * **/
      CreationRequest() {
        let CreationRequest = new proto.CreationRequest();
        return CreationRequest;
      },
      /**
       * proto PatchRequest
       * **/
      PatchRequest() {
        let PatchRequest = new proto.PatchRequest();
        return PatchRequest;
      },
      uploadResponseHandle(e) {
        let uploadResponse = new proto1.UploadResponse.deserializeBinary(e.data);
        let msgType = uploadResponse.getMsgtype();
        if (msgType === 1) {
          let SuccessResponse = uploadResponse.getSuccessresponse();
          let successCode = SuccessResponse.getCode();
          // successCode 10008 jwtToken即将过期
          console.log("successCode", successCode);
          if (successCode == "10008") {
            this.getServerToken();
          }
          let newOffset = SuccessResponse.getNewoffset();
          let fileId = SuccessResponse.getFileid();
          let chunkSize = SuccessResponse.getChunksize();
          let isFinish = SuccessResponse.getIsfinish();
          if (isFinish) {
            this.uploadFileAry = [];
            this.uploadingFileList = [];
            this.getInventoryInfo("", true, false);
          } else {
            if (this.uploadingFileList.length) {
              let progress = (newOffset * chunkSize) / this.uploadingFileList[0].filesize;
              this.uploadingFileList[0].progress = Number((Number(progress) * 100).toFixed(0)) || 0;
              this.uploadingFileList[0].uploadOffset = newOffset;
              this.uploadingFileList[0].chunkSize = chunkSize;
              this.uploadingFileList[0].uploadStatus = "uploading";
              this.uploadingFileList[0].fileId = fileId;
            }
            let patchParams = {
              uploadOffset: newOffset,
              chunkSize: chunkSize,
              fileId: fileId
            };
            console.log('upload patchParams', patchParams)
            this.synchronizationUploadHandle("PatchRequest", patchParams);
          }
        } else if (msgType === 2) {
          // 上传失败的时候 给出提示
          let ErrorResponse = uploadResponse.getErrorresponse();
          let errorMessage = ErrorResponse.getMessage();
          let errorCode = ErrorResponse.getCode();
          this.$message.error(errorMessage || "上传失败");
          // jwtToken失效重新获取,然后再次重新上传
          if (errorCode == "10009") {
            console.log("errCode", errorCode);
            this.getServerToken();
            this.synchronizationUploadHandle("CreationRequest");
          } else {
            this.uploadFileAry = [];
            this.uploadingFileList = [];
          }
        }
      },
      /**
       * 上传项目附件 (一次只能上传一个文件,弹窗关闭则终止上传)
       * @param: type CreationRequest 初次上传 PatchRequest 切片续传
       * @param: patchParams 切片续传参数 {uploadOffset:1,chunkSize:2}
       * **/
      synchronizationUploadHandle(type = "CreationRequest", patchParams = {}) {
        if (!this.uploadFileSocket) {
          this.$message.error("网络连接异常");
          return false;
        }
        if (!this.uploadFileAry.length) return false;
        let uploadFile = this.uploadFileAry[0];
        let size = uploadFile.size;
        let name = uploadFile.name;
        let vm = this;
        let parentId = "0";
        let fileSpaceId = this.inventoryInfo.filespaceId || "";
        let projectId = this.inventoryInfo.projectId || "";
        let taskId = this.inventoryInfo.id || ''
        console.log('fileSpaceId', fileSpaceId);
        console.log('projectId', projectId);
        let sha1 = CryptoJS.algo.SHA1.create();
        let step = 1024 * 1024;
        let total = uploadFile.size;
        let cuLoaded = 0;
        if (type === "CreationRequest") {
          let reader = new FileReader();
          vm.readBlob(uploadFile, 0, step, reader);
          reader.onload = function (e) {
            let wordBuffer = CryptoJS.lib.WordArray.create(e.target.result);
            sha1.update(wordBuffer);
            cuLoaded += e.loaded;
            //如果没有读完，继续
            if (cuLoaded < total && !vm.isDestroy) {
              vm.readBlob(uploadFile, cuLoaded, step, reader);
            } else if (!vm.isDestroy) {
              cuLoaded = total;
              let sha1Base64 = sha1.finalize().toString(CryptoJS.enc.Base64);
              console.log("sha1 base64 === ", sha1Base64);
              let UploadRequest = vm.UploadRequest();
              let CreationRequest = vm.CreationRequest();
              let jwtToken = localStorage.getItem("serverToken");
              CreationRequest.setHashsha512(sha1Base64);
              CreationRequest.setFilename(name);
              CreationRequest.setFilesize(size);
              CreationRequest.setParentid(parentId);
              CreationRequest.setProjectid(projectId);
              CreationRequest.setTaskid(taskId)
              UploadRequest.setAction(3);
              UploadRequest.setJwttoken(jwtToken);
              UploadRequest.setFilespaceid(fileSpaceId);
              UploadRequest.setCreationrequest(CreationRequest);
              let buff = UploadRequest.serializeBinary();
              console.log("buffer ===", buff);
              try {
                vm.uploadFileSocket.send(buff.buffer);
              } catch (e) {
                console.log(e, "socket端开连接");
              }
            }
          };
        } else {
          // 切片上传
          console.log(type, patchParams);
          let start = patchParams.uploadOffset * patchParams.chunkSize;
          let end = start + patchParams.chunkSize;
          let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
          if (end > size) {
            end = size;
          }
          let reader = new FileReader();
          reader.readAsArrayBuffer(blobSlice.call(uploadFile, start, end));
          reader.onload = function (e) {
            let UploadRequest = vm.UploadRequest();
            let PatchRequest = vm.PatchRequest();
            UploadRequest.setFilespaceid(fileSpaceId);
            UploadRequest.setAction(1);
            let jwtToken = localStorage.getItem("serverToken");
            UploadRequest.setJwttoken(jwtToken);
            PatchRequest.setUploadoffset(patchParams.uploadOffset);
            PatchRequest.setChunksize(patchParams.chunkSize);
            PatchRequest.setFileid(patchParams.fileId);
            PatchRequest.setData(new Uint8Array(e.target.result));
            UploadRequest.setPatchrequest(PatchRequest);
            let buff = UploadRequest.serializeBinary();
            vm.uploadFileSocket.send(buff.buffer);
          };
        }
      },
      /**
       * 分片读取reader
       * **/
      readBlob(file, start, step, reader) {
        //指定开始位置和结束位置读取文件
        let blob = file.slice(start, start + step);
        reader.readAsArrayBuffer(blob);
      },
      /**
       * socket文件切片上传 文件大小不得300M,
       * 上传过程中计算文件上传进度,单个上传 不缓存数据
       * 发送createUpload获取文件切片大小和切片索引.
       * **/
      uploadFile(e) {
        let file = e.target.files || e.dataTransfer.files;
        if (!file.length) return false;
        this.uploadFileAry = Array.from(file);
        let isAllow = true;
        for (let i = 0; i < this.uploadFileAry.length; i++) {
          if (this.uploadFileAry[i].size > 1024 * 1024 * 300) {
            this.$message.error("单个上传文件不得超过300M");
            this.$refs.clearFile.value = ""; // 清空file文件
            isAllow = false;
            break;
          }
        }
        if (!isAllow) return false;
        if (!this.uploadFileSocket) {
          this.$message.error("网络连接异常,请稍候重试");
          this.$refs.clearFile.value = ""; // 清空file文件
          return false;
        }
        this.uploadFileAry.length && this.uploadFileAry.forEach(item => {
          let uploadingFileItem = {
            uploadOffset: 0,
            chunkSize: 0,
            fileId: "",
            id: "uploading",
            userid: "",
            filesize: item.size,
            name: item.name,
            displaysize: "",
            addtime: this.$formatedDate(new Date()),
            parentid: 0,
            isfile: 0,
            mimetype: item.type,
            fileSpaceId: this.inventoryInfo.filespaceId,
            progress: 0
          };
          this.uploadingFileList.push(uploadingFileItem);
        });
        this.$refs.clearFile.value = ""; // 清空file文件
        this.synchronizationUploadHandle("CreationRequest");
      },
      /**
       * 文件是否可以下载
       * **/
      submitDownloadFile(fileId) {
        let vm = this;
        window.removeEventListener("beforeunload", vm.$returnValue, false);
        let params = {
          fileId: fileId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.submitDownloadFile(params).then(response => {
          if (response.success) {
            location.href = this.$globalServiceHost.fileDiskServiceHost + "/file" + response.data;
            window.addEventListener("beforeunload", vm.$returnValue, false);
          } else {
            this.$message.error(response.message || "文件下载接口报错");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 删除项目文件
       * **/
      deleteProjectFile(fileId) {
        this.$confirm("此操作将永久删除该项目文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = {
            fileId: fileId,
            token: localStorage.getItem("serverToken")
          };
          cloudDiskSrv.makeSureDeleteFile(params).then(response => {
            if (response.success) {
              this.$message.success("删除成功");
              this.getInventoryInfo("", true, false);
            } else {
              this.$message.error(response.message || "删除失败");
            }
          }).catch(error => {
            console.log(error);
          });
        }).catch(() => {
        });
      },
      /**
       * @Description: 上传进度format
       * @Author: 侯湃
       * @Date: 2020/5/20
       */
      format(percentage) {
        return percentage === 0 ? "等待" : `${percentage.toFixed(0)}%`;
      },
    },
    created() {
      this.getInventoryInfo();
      this.uploadFileSocketInit();
    },
    beforeDestroy() {
      this.isDestroy = true;
      if (this.uploadFileSocket) {
        this.uploadFileSocket.close();
      }
    }
  };
</script>

<style scoped lang="less">
  .modal-box {
    /deep/ .v-modal {
      opacity: 0.2 !important;
    }
  }

  .relative_box {
    position: relative;
  }

  .inventoryInfoDialog_page {
    /deep/ .el-dialog {
      border-radius: 10px;
      overflow: hidden;
      width: 800px !important;
      // height: 77%;
      margin-top: 173px !important;
    }

    /deep/ .el-dialog__header {
      padding: 0 !important;
    }

    /deep/ .el-dialog__footer {
      padding: 20px !important;
    }

    /deep/ .el-dialog__body {
      height: 100%;
      padding: 0 !important;
    }

    /deep/ .el-tag--mini .el-icon-close {
      margin-left: -6px !important;
    }

    /deep/ .el-tag {
      border-radius: 12px !important;
      margin-right: 10px;
    }

    /deep/ .el-progress.el-progress--line {
      width: 100% !important;
    }

    .scroll_box {
      max-height: 600px;
      overflow-y: scroll;
      padding: 0 8px 0 0;
      margin: 0 0 10px 0;
    }

    .inventoryInfo-container {
      width: 100%;
      padding: 0 20px;
      display: flex;
      flex-direction: column;

      .title-box {
        width: 100%;
        height: 55px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 16px;
          font-weight: bold;
          color: @titleColor;
          line-height: 22px;
          /*margin-bottom: 10px;*/
        }

        .right {
          display: flex;
          align-items: center;

          .img1 {
            margin-right: 18px;
            width: 18px;
          }

          .img2 {
            width: 28px;
            cursor: pointer;
          }
        }
      }

      .info-box {
        display: flex;
        flex-direction: column;
        padding: 10px 0 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .title {
          display: flex;
          align-items: center;

          /deep/ .el-checkbox__inner, /deep/ .el-checkbox__input.is-indeterminate {
            width: 26px !important;
            height: 26px !important;
            overflow: hidden;
            border-radius: 2px !important;
            margin-right: 15px;
          }

          /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: @barBackgroundColor !important;
            border-color: @barBackgroundColor !important;
          }

          /deep/ .el-checkbox__input.is-indeterminate, /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: @barBackgroundColor !important;
            border-color: @barBackgroundColor !important;

          }

          /deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
            transform: rotate(45deg) scaleY(1.4) !important;
          }

          /deep/ .el-checkbox__inner::after {
            left: 10px !important;
            top: 6px !important;
            border: 2px solid #FFF !important;
            border-left: 0 !important;
            border-top: 0 !important;
          }

          /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
            height: 3px !important;
            top: 7px !important;
          }

          div {
            font-size: 20px;
            font-weight: bold;
            color: @titleColor;
            line-height: 28px;
          }
        }

        .info {
          display: flex;
          align-items: center;
          margin: 10px 0;

          .name,
          .date,
          .level {
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;

            i {
              color: #999999;
              font-size: 28px;
            }

            img {
              width: 20px;
              margin-right: 10px;
            }

            div {
              font-size: 14px;
              font-weight: 400;
              color: @titleColor;
              line-height: 18px;
            }
          }

          .date {
            margin: 0 50px;
          }


          .level {
            position: relative;
          }

          .level.highest {
            color: rgba(255, 193, 193, 1);

            i {
              color: rgba(255, 193, 193, 1);
            }

            div {
              color: rgba(255, 193, 193, 1);
            }
          }

          .level.high {
            color: rgba(255, 219, 183, 1);

            i {
              color: rgba(255, 219, 183, 1);
            }

            div {
              color: rgba(255, 219, 183, 1);
            }
          }

          .level.normal {
            color: rgba(208, 208, 208, 1);

            i {
              color: rgba(208, 208, 208, 1);
            }

            div {
              color: rgba(208, 208, 208, 1);
            }
          }

          .level.low {
            color: rgba(195, 235, 181, 1);

            i {
              color: rgba(195, 235, 181, 1);
            }

            div {
              color: rgba(195, 235, 181, 1);
            }
          }
        }

        .field {
          display: flex;
          align-items: center;
          margin: 10px 0;
          position: relative;
          min-height: 25px;

          img {
            width: 20px;
            margin-right: 10px;
          }
        }

        .desc {
          display: flex;
          margin: 10px 0;

          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          div.task_desc {
            flex: 1;
            width: 0;
            font-size: 14px;
            font-weight: 400;
            color: @titleColor;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            /deep/ .el-input .el-input__inner {
              border: 0 !important;
              background-color: rgba(242, 242, 242, 1) !important;
              border-radius: 10px;
            }

            .addTask_desc {
              span {
                font-size: 16px;
                font-weight: 400;
                color: @titleColor;

                i {
                  margin-left: 12px;
                  color: @fontColor999;
                  font-size: 14px;
                }

                i:hover {
                  color: @barBackgroundColor;
                  cursor: pointer;
                }
              }
            }


            .edit_desc {
              margin: 10px 0 0 0;
            }

            .taskdesc_btn {
              padding-top: 10px;
            }

          }
        }

        .fujian {
          padding: 3px 0 5px 28px;
          background: url("../../assets/image/icon_i_fujian.png");
          background-position: 0 0px;
          background-repeat: no-repeat;
          background-size: 20px;
          display: flex;
          flex-wrap: wrap;

          .fujian-info:hover {
            background-color: #f6f6f6;

            .size_action {
              i {
                display: inline !important;
              }
            }
          }

          .fujian-info {
            width: 49%;
            display: flex;
            align-items: center;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            padding: 10px;
            margin: 0 6px 4px 0;

            img {
              width: 38px;
              height: 38px;
              margin-right: 10px;
            }

            div {
              font-size: 14px;
              font-weight: 400;
              color: @titleColor;
              line-height: 20px;
            }

            .nameAndAction_box {
              flex: 1;
              width: 0;
              height: 40px;
              /*display: flex;*/
              /*align-items: center;*/
              /*justify-content: space-between;*/

              .size_action {
                display: flex;
                justify-content: space-between;
                align-items: center;

                i {
                  margin: 0 4px;
                  display: none;
                  cursor: pointer;
                }

                i:hover {
                  color: @barBackgroundColor;
                }
              }
            }
          }

          .add-new-fujian:hover {
            color: @barBackgroundColor;
          }

          .add-new-fujian {
            width: 100%;
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: @descTitleColor;
            line-height: 16px;
            position: relative;
            margin:10px 0 0 0;

            input {
              cursor: pointer;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              opacity: 0;
            }
          }
        }
      }

      .field-box {
        padding: 20px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .title {
          display: flex;
          align-items: center;

          img {
            width: 20px;
            margin-right: 10px;
          }

          div {
            font-size: 16px;
            font-weight: 400;
            color: @titleColor;
            line-height: 16px;
          }
        }

        .value {
          font-size: 14px;
          min-height: 24px;
          font-weight: 400;
          color: @titleColor;
          margin-top: 15px;
          padding-left: 30px;
          display: flex;
          align-items: center;


          span.el-tag {
            margin-right: 10px !important;
          }

          .radio_span {
            border-radius: 10px;
            color: @fontColorFFF;
            text-align: center;
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
            padding: 0 10px;
          }
        }
      }

      .task-box {
        padding: 20px 0;


        /deep/ .el-checkbox__inner, /deep/ .el-checkbox__input.is-indeterminate {
          width: 20px !important;
          height: 20px !important;
          overflow: hidden;
          border-radius: 2px !important;
          margin-right: 15px !important;
        }

        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: @barBackgroundColor !important;
          border-color: @barBackgroundColor !important;
        }

        /deep/ .el-checkbox__input.is-indeterminate, /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: @barBackgroundColor !important;
          border-color: @barBackgroundColor !important;

        }

        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
          transform: rotate(45deg) scaleY(1.4) !important;
        }

        /deep/ .el-checkbox__inner::after {
          left: 7px !important;
          top: 3px !important;
          border: 2px solid #FFF !important;
          border-left: 0 !important;
          border-top: 0 !important;
        }

        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
          height: 3px !important;
          top: 7px !important;
        }

        .title {
          display: flex;
          align-items: center;
          margin-bottom: 15px;

          img {
            width: 20px;
            margin-right: 10px;
          }

          div {
            font-size: 16px;
            font-weight: 400;
            color: @titleColor;
            line-height: 16px;
          }
        }

        .task {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          cursor: pointer;

          .left {
            display: flex;
            align-items: center;

            img {
              width: 20px;
              margin-right: 10px;
            }

            div {
              font-size: 14px;
              font-weight: 400;
              color: @titleColor;
              line-height: 16px;
            }
          }

          .right {
            display: flex;

            .date {
              margin: 0 10px !important;
            }

            .name,
            .date {
              margin-left: 20px;
              display: flex;
              align-items: center;
              position: relative;
              cursor: pointer;

              img {
                width: 20px;
                margin-right: 10px;
              }

              div {
                font-size: 14px;
                font-weight: 400;
                color: @titleColor;
                line-height: 18px;
              }
            }
          }
        }

        .add-task {
          width: 70px;
          margin-left: 30px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: @descTitleColor;
          line-height: 14px;
        }

        .add-task:hover {
          color: @barBackgroundColor;
          cursor: pointer;
        }

        .add-task-div {
          width: 100%;
          display: flex;
          align-items: center;
          height: 38px;
          background: rgba(242, 242, 242, 1);
          border-radius: 10px;

          /deep/ .el-input {
            flex: 1 !important;
          }

          /deep/ .el-input.el-input--small .el-input__inner {
            border: 0 !important;
            background-color: rgba(242, 242, 242, 1) !important;
            font-size: 14px;
          }

          .flex_div {
            display: flex;
            align-items: center;

            .date {
              margin: 0 10px;
            }

            .name, .date {
              display: flex;
              align-items: center;
              position: relative;

              i {
                color: #999999;
                font-size: 28px;
              }

              img {
                width: 20px;
                margin-right: 10px;
              }

              div {
                font-size: 14px;
                font-weight: 400;
                color: @titleColor;
                line-height: 18px;
              }
            }
          }
        }
      }
    }

    .tip_span {
      font-size: 14px !important;
      color: @titleColor !important;
    }

    .tip_span:hover {
      color: @barBackgroundColor !important;
      cursor: pointer;
    }

    .highlight_div {
      color: @fontColor999;
    }

    .highlight_div.color333 {
      color: @titleColor;
    }

    .highlight_div:hover {
      color: @barBackgroundColor !important;
      cursor: pointer;
    }

    /deep/ .fields_input.el-input--small .el-input__inner {
      height: 24px !important;
      line-height: 24px !important;
      font-size: 14px;
      color: @titleColor;
      border: 0;
      border-bottom: 1px dashed @titleColor;
      padding: 0 !important;
    }

    /deep/ .fields_input.el-input--small .el-input__inner:focus {
      border-color: @titleColor !important;
    }

    .fontColor999 {
      color: @fontColor999 !important;
    }

    .addfields_span {
      color: @fontColor999;
      font-size: 14px;
      margin-left: 12px;
      cursor: pointer;
    }

    .addfields_span:hover {
      color: @barBackgroundColor;
    }
  }
</style>
