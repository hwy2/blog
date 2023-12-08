<template>
  <div id="categoryList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理类别 &emsp;<el-button
            size="small"
            type="primary"
            @click="openDialog()"
            >新增</el-button
          >
        </h2>
      </div>
      <div class="page-main">
        <div class="list">
          <el-table
            :data="categoryListData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="uuid"
              prop="uuid"
              width="300"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="标题"
              prop="title"
              width="260"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="创建者"
              prop="name"
              width="260"
              align="center"
            >
              <template #default="scope">
                <span>{{ scope.row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="createDate"
              width="260"
              align="center"
            >
              <template #default="scope">
                <span>{{
                  dateFormat(scope.row.createDate, "yyyy-MM-dd")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template #header style="display: flex">
                <el-input
                  title="根据标题搜索"
                  v-model="search"
                  placeholder="输入关键字搜索"
                  style="width: 70%"
                />
              </template>
              <template #default="scope">
                <el-button
                  title="编辑"
                  size="small"
                  type="primary"
                  @click="editCategory(scope.row)"
                >
                  编辑
                </el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="确定要删除吗？"
                  @confirm="handleDelete(scope.row)"
                  v-if="scope.row.state != 0"
                >
                  <template #reference>
                    <el-button
                      title="状态改为删除态"
                      size="small"
                      type="danger"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <div class="operation" style="margin-top: 20px">
            <el-popconfirm
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
              :total="categoryTotal"
              @next-click="handleChangePage"
              @prev-click="handleChangePage"
              @current-change="handleChangePage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="editDialog" :title="dialogTitle" width="50%">
      <el-form
        label-position="left"
        label-width="80px"
        :model="formcategory"
        class="clearfix"
        ref="validateFormRef"
      >
        <el-form-item
          prop="title"
          label="标题"
          :rules="[
            {
              required: true,
              message: '标题不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 255,
              message: '长度在 2 到 255 个字符',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="formcategory.title" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" v-if="btnName == '修改'" @click="handleUpdateCategoy()">
            {{ btnName }}
          </el-button>
          <el-button v-else type="primary" @click="handleCreateCategoy()">
            {{ btnName }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" name="categoryList" setup>
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount,
  watch
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification, ElMessage, FormInstance } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import dateFormat from "@/assets/js/dateFormat.js";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const categoryListData = ref<Array<any>>([]); //数据
const multipleSelection = ref<any>([]); //多选数据
const categoryTotal = ref<number>(0); //总数
const hideDeletebtn = computed(() => {
  if (categoryTotal.value > 1) return true;
  return false;
}); //是否隐藏全部删除
const hidePage = computed(() => {
  if (categoryTotal.value > 10) return false;
  return true;
});
const condition = reactive({
  pageSize: 10,
  currPage: 1,
  categoryTitle: "",
  userUuid: ""
}); //搜索条目
const search = ref<string>("");
const formcategory = reactive({
  title: "",
  userUuid: "",
  uuid:''
}); //类别表单
const user = ref<any>({}); //用户
const editDialog = ref<boolean>(false); //弹窗
const dialogTitle = ref<string>("编辑"); //弹窗标题
const btnName = ref<string>("修改"); //弹窗标题
const validateFormRef = ref<FormInstance>();

/**
 * 选择全部
 */
const handleSelectionChange = (val: any) => {
  console.log(val);
  multipleSelection.value = val;
};
/**
 * 删除（修改文章状态为删除）
 */
const handleDelete = (row: any) => {
  console.log(row);

  proxy.$axios
    .get("/category/del", { uuid: row.uuid })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        getCategoryList(condition);
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
 * 批量删除
 */
const handleBatchDelete = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请选择要删除的数据！");
    return;
  }
  Array.from(multipleSelection.value).map((item: any) => {
    handleDelete(item);
  });
  proxy.getAricleList();
};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.currPage = val;
  getCategoryList(condition);
  scrollTo(0, 0); // 回到页面顶部
};
/**
 * 获取所有的分类
 */
const getCategoryList = (condition: any) => {
  proxy.$axios
    .get("/category/list", condition)
    .then((resp: any) => {
      console.log(resp);
      if (resp.code === "200") {
        categoryListData.value = resp.result.list;
        categoryTotal.value = resp.result.page.totalRow;
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
 * 窗口打开之前
 * @param done
 */
const openDialog = () => {
  dialogTitle.value = "创建类别";
  btnName.value = "创建";
  formcategory.title = "";
  formcategory.userUuid = user.value.uuid;
  editDialog.value = true;
};
// 编辑窗口
const editCategory = (data: any) => {
  dialogTitle.value = "修改类别";
  btnName.value = "修改";
  formcategory.title = data.title;
  formcategory.userUuid = data.userUuid;
  formcategory.uuid = data.uuid
  editDialog.value = true;
};
/** 创建 */
const handleCreateCategoy = () => {
  (validateFormRef.value as any).validate((valid: any, fields: any) => {
    if (valid) {
      proxy.$axios
        .post("/category/create", {
          title: formcategory.title,
          userUuid: formcategory.userUuid
        })
        .then((resp: any) => {
          if (resp.code === "200") {
            ElNotification({
              title: "成功",
              message: "创建成功",
              type: "success"
            });
            editDialog.value = false;
            getCategoryList(condition);
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
    }else {
      ElNotification({
        title: "失败",
        message: "请按照规则填写",
        type: "error"
      });
    }
  });
};
/** 修改 */
const handleUpdateCategoy = () => {
  (validateFormRef.value as any).validate((valid: any, fields: any) => {
    if (valid) {
      proxy.$axios
        .put("/category/update", {
          title: formcategory.title,
          categoryUuid: formcategory.uuid
        })
        .then((resp: any) => {
          if (resp.code === "200") {
            ElNotification({
              title: "成功",
              message: "修改成功",
              type: "success"
            });
            editDialog.value = false;
            getCategoryList(condition);
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
    }else {
      ElNotification({
        title: "失败",
        message: "请按照规则填写",
        type: "error"
      });
    }
  });
};

watch(search, (newval: string) => {
  condition.categoryTitle = newval;
  getCategoryList(condition);
});

onBeforeMount(() => {
  document.title = "分类列表";
  getCategoryList(condition);
  const temp = JSON.parse(proxy.$Cookies.get("user"));
  user.value = temp;
});
onMounted(() => {});
</script>

<style lang="scss">
#categoryList {
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
}
</style>
