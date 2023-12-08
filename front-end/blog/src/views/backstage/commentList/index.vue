<template>
  <div id="commentList">
    <div class="container">
      <div class="page-title">
        <h2>管理评论</h2>
      </div>
      <div class="page-main">
        <div class="status">
          <div class="left">
            <el-radio-group v-model="commentStatus" size="small">
              <el-radio-button label="已通过" name="0" />
              <el-radio-button label="待审核" name="1" />
              <el-radio-button label="垃圾" name="2" />
            </el-radio-group>
          </div>
          <div class="right"></div>
        </div>
        <div class="list">
          <el-table
            :data="commentListData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="作者"
              prop="user.userInfo.nickName"
              width="260"
            >
              <template #default="scope">
                <div class="authorInfor">
                  <div class="leftIcon">
                    <img :src="scope.row.faceUrl" />
                  </div>
                  <div class="rightName">
                    <h3>{{ scope.row.nickName }}</h3>
                    <p>
                      <a :href="`mailto:${scope.row.email}`" target="_blank"
                        >hwy@3dcw.cn</a
                      >
                    </p>
                    <p>{{ scope.row.ip }}<br />{{ scope.row.vestingPlace }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="内容" prop="category">
              <template #default="scope">
                <div class="commentContent">
                  <p class="timer">
                    {{ dateFormat(scope.row.createDate, "yyyy年MM月dd日") }} 于
                    <router-link
                      :to="`/home/article/${scope.row.article.uuid}`"
                      >{{ scope.row.article.title }}</router-link
                    >
                  </p>
                  <p class="content">
                    <span v-html="scope.row.comments"></span>
                  </p>
                  <p class="operation">
                    <el-button
                      type="success"
                      :icon="Check"
                      :disabled="scope.row.status == 0"
                      @click="updateStatus(0, scope.row.uuid)"
                    >
                      通过</el-button
                    >
                    <el-button
                      type="info"
                      :disabled="scope.row.status == 1"
                      @click="updateStatus(1, scope.row.uuid)"
                    >
                      <i class="iconfont icondaishenhe"></i>&nbsp;待审核
                    </el-button>
                    <el-button
                      type="warning"
                      :disabled="scope.row.status == 2"
                      @click="updateStatus(2, scope.row.uuid)"
                    >
                      <i class="iconfont iconyouhailaji"></i>&nbsp;垃圾
                    </el-button>

                    <el-button
                      type="primary"
                      :icon="Edit"
                      @click="editComment(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="primary"
                      :icon="Edit"
                      @click="restore(scope.row)"
                    >
                      回复
                    </el-button>
                    <el-popconfirm
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      :icon="InfoFilled"
                      icon-color="#626AEF"
                      title="确定要删除吗？"
                      @confirm="handleDelete(scope.$index, scope.row)"
                    >
                      <template #reference>
                        <el-button
                          title="状态改为删除态"
                          type="danger"
                          :icon="Delete"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="operation" style="margin-top: 20px">
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除吗？"
              @confirm="handleBatchDelete()"
              v-if="hideDeletebtn"
            >
              <template #reference>
                <el-button size="small" type="danger"> 删除全部 </el-button>
              </template>
            </el-popconfirm>
            <el-pagination
              :hide-on-single-page="hidePage"
              layout="prev, pager, next"
              :total="commentTotal"
              @next-click="handleChangePage"
              @prev-click="handleChangePage"
              @current-change="handleChangePage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="editDialog"
      :title="dialogTitle"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="80px"
        :model="formLabelAlign"
        class="clearfix"
        ref="validateForm"
      >
        <div class="item">
          <el-form-item
            prop="nickName"
            label="昵称"
            :rules="[
              {
                required: true,
                message: '昵称不能为空',
                trigger: 'blur'
              },
              {
                min: 3,
                max: 255,
                message: '长度在 3 到 255 个字符',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="formLabelAlign.nickName"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱(保密)"
            :rules="[
              {
                required: true,
                message: '请输入邮箱地址',
                trigger: 'blur'
              },
              {
                max: 255,
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input v-model="formLabelAlign.email" placeholder=""></el-input>
          </el-form-item>
        </div>
        <div class="itemContent">
          <el-form-item
            prop="comments"
            label="留下你成为大佬的想法吧"
            :rules="{
              required: true,
              message: '评论内容不能为空',
              trigger: 'blur'
            }"
          >
            <!-- <el-input
              type="textarea"
              :rows="8"
              placeholder=""
              v-model="formLabelAlign.comments"
            >
            </el-input> -->
            <el-input
              style="display: none"
              type="textarea"
              :rows="1"
              placeholder=""
              v-model="formLabelAlign.comments"
            >
            </el-input>
            <div class="el-textarea">
              <div
                class="el-textarea__inner"
                id="textarea"
                tabindex="0"
                ref="comments"
                style="min-height: 150px; height: auto"
                contenteditable="true"
                @keyup="makeExpandingArea()"
              ></div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="updateComments()">
            {{ btnName }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" name="commentList" setup>
import {
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  ref,
  onBeforeMount,
  watch
} from "vue";
// import { useStore } from "vuex";
// import { useRouter } from "vue-router";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import dateFormat from "@/assets/js/dateFormat.js";
import { Check, Delete, Edit, InfoFilled } from "@element-plus/icons-vue";

// const store = useStore();
// const router = useRouter();
const { proxy }: any = getCurrentInstance();

const condition = reactive({
  pageSize: 10,
  currPage: 1,
  categoryTitle: "",
  articleVague: "",
  status: "0",
  userUuid: ""
}); //评论状态
const multipleSelection = ref<Array<any>>([]); //选中数据
const commentListData = ref<Array<any>>([]); //评论数据
const commentTotal = ref<number>(0); //评论总条数
const hideDeletebtn = computed(() => {
  if (commentTotal.value > 1) return true;
  return false;
}); //是否隐藏删除全部按钮
const hidePage = computed(() => {
  if (commentTotal.value > 10) return false;
  return true;
}); //显示与否分页
const commentStatus = ref<string>("已通过"); //评论状态切换
const editDialog = ref<boolean>(false); //编辑窗口
const formLabelAlign = reactive({
  //评论表单
  nickName: "",
  email: "",
  comments: "",
  uuid: ""
});
const user = ref<any>({}); //用户信息
const dialogTitle = ref<string>("编辑评论"); //弹窗标题
const btnName = ref<string>("修改"); //弹窗提交按钮的文字

/**
 * 获取评论数据
 */
const getCommentData = (condition: any) => {
  proxy.$axios
    .get("/comment/userCommentList", condition)
    .then((resp: any) => {
      console.log(resp, "kk");
      commentListData.value = resp.result.list;
      commentTotal.value = resp.result.page.totalRow;
    })
    .catch((error: any) => {
      console.log(error);
    });
};
/**
 * 选择评论状态
 */
const selectState = (val: string) => {
  // （0垃圾、1可用、2待审核）
  switch (val) {
    case "已通过":
      condition.status = "0";
      break;
    case "待审核":
      condition.status = "1";
      break;
    case "垃圾":
      condition.status = "2";
      break;
    default:
      console.log(val);
  }
  getCommentData(condition);
};
/**
 * 选择全部
 */
const handleSelectionChange = (val: any) => {
  console.log(val);
  multipleSelection.value = val;
};
/**
 * 批量删除
 */
const handleBatchDelete = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请选择要删除的数据！");
    return;
  }
  Array.from(multipleSelection.value).map((item: any) => {
    handleDelete(1, item);
  });
  // proxy.getAricleList();
};
/**
 * 删除（）
 */
const handleDelete = (index: number, row: any) => {
  console.log(row);

  proxy.$axios
    .get("/comment/del", { commentUuid: row.uuid })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        getCommentData(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};
/**
 * 修改状态
 */
const updateStatus = (status: number, commentUuid: string) => {
  proxy.$axios
    .post("/comment/updateCommentStatus", { status, commentUuid })
    .then((resp: any) => {
      if (resp.code === "200") {
        console.log(resp);
        ElNotification({
          title: "成功",
          message: "修改成功",
          type: "success"
        });
        getCommentData(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.currPage = val;
  getCommentData(condition);
  scrollTo(0, 0); // 回到页面顶部
};
/**
 * 窗口关闭之前
 * @param done
 */
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("你确定要关闭窗口吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
/**
 * 修改弹窗弹出
 * @param data
 */
const editComment = (data: any) => {
  dialogTitle.value = "编辑评论";
  btnName.value = "修改";
  formLabelAlign.comments = data.comments;
  formLabelAlign.email = data.email;
  formLabelAlign.nickName = data.nickName;
  formLabelAlign.uuid = data.uuid;
  editDialog.value = true;
  setTimeout(() => {
    const comments: any = proxy.$refs.comments;
    comments.innerHTML = data.comments;
  }, 50);
};
/**
 * 回复
 */
const restore = (data: any) => {
  dialogTitle.value = "回复评论";
  btnName.value = "回复";
  editDialog.value = true;
  setTimeout(() => {
    const comments: any = proxy.$refs.comments;
    comments.innerHTML = `<span contenteditable='false' class='nickName'>@${data.nickName}&nbsp;</span>`;
    comments.focus();
    const range = document.createRange();
    range.selectNodeContents(comments);
    range.collapse(false);
    const sel: any = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    formLabelAlign.email = user.value.email;
    formLabelAlign.nickName = user.value.name;
  }, 50);

  // editDialog.value = true;
};
/**
 * 输入框自动高度
 */
const makeExpandingArea = () => {
  // 控制输入框自动高度
  const text: any = document.getElementById("textarea");
  console.log(text.style.height);
  if (text.scrollHeight > 150) {
    text.style.height = "150px";
    text.scrollTop = 0;
    text.style.height = text.scrollHeight + "px";
  }
  // if(text.style.height<) {
  //   text.style.height = "150px";
  // }

  formLabelAlign.comments = text?.innerHTML;
};
/**
 * 提交修改
 */
const updateComments = () => {
  proxy.$axios
    .put("/comment/update", { comment: formLabelAlign })
    .then((resp: any) => {
      console.log(resp, "");
      if (resp.code == "200") {
        ElNotification({
          title: "成功",
          message: "修改成功",
          type: "success"
        });
        editDialog.value = false;
        getCommentData(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};

onBeforeMount(() => {
  document.title = "评论列表";
  user.value = JSON.parse(proxy.$Cookies.get("user"));
  condition.userUuid = user.value.uuid;
  console.log(user.value);
  getCommentData(condition);
});
onMounted(() => {});

watch(commentStatus, (newval: any) => {
  selectState(newval);
});
</script>

<style lang="scss">
#commentList {
  height: calc(100vh - 60px);
  overflow: auto;
  width: 100%;
  .container {
    width: 95%;
    margin: 0 auto;
    color: #444;
    padding-bottom: 30px;
    .page-title {
      padding: 1.5% 0;
      h2 {
        font-size: 1.2em;

        a {
          margin-left: 1%;
          display: inline-block;
          padding: 0.1% 0.5%;
          background-color: #e9e9e6;
          color: #467b96;
          font-size: 0.8em;

          &:hover {
            color: #499bc3;
          }
        }
      }
    }
    .page-main {
      .status {
        display: flex;
        padding-bottom: 20px;
        .left {
          display: flex;
          p {
            padding: 3px 15px;
            border: 1px solid var(--borderColor);
            border-collapse: collapse;
            font-size: 0.8em;
            cursor: pointer;
          }
          .active {
            background-color: #e9e9e6;
          }
        }
      }

      .list {
        padding: 24px;
        background-color: #fff;
        .authorInfor {
          display: flex;
          justify-content: center;
          align-items: center;
          .leftIcon {
            width: 20%;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .rightName {
            width: 80%;
            padding-left: 20px;
            box-sizing: border-box;
            text-align: left;
            h3 {
              color: #499bc3;
            }
            p:nth-of-type(1) {
              a {
                color: #499bc3;
              }
            }
            p {
              line-height: 1.5;
              color: #999;
            }
          }
        }
        .operation {
          display: flex;
          .el-pagination {
            margin-left: auto;
          }
        }
        .commentContent {
          .timer {
            color: #999;
            a {
              position: relative;
              color: #499bc3;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 16px;

              &::after {
                content: "";
                width: 0;
                height: 1px;
                background: #499bc3;
                position: absolute;
                top: 100%;
                left: 50%;
                transition: all 1s;
                margin-top: 2px;
              }

              &:hover {
                &::after {
                  content: "";
                  width: 100%;
                  left: 0%;
                }
              }
            }
          }
          .content {
            width: 98%;
            padding: 20px 0 30px;
            span.nickName {
              padding: 3px;
              border-radius: 5px;
              color: rgb(233, 30, 99);
              font-weight: bold;
            }
          }
          .operation {
            opacity: 0;
            transition: all 0.3s;
            height: 34px;
          }
          &:hover {
            .operation {
              opacity: 1;
            }
          }
        }
      }
    }
  }

  .el-form {
    display: flex;
    align-items: center;
    justify-content: center;
    .itemContent {
      width: 70%;

      #textarea {
        height: 60px;
        overflow: hidden;
        span.nickName {
          padding: 3px;
          border-radius: 5px;
          color: rgb(233, 30, 99);
          font-weight: bold;
        }
      }
    }
    .item {
      width: 30%;
      padding-right: 20px;
    }
  }
}
</style>
