<template>
  <div id="articleList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理文章
          <router-link
            to="/backstage/write/writingArticles"
            @click="changeIndex('/backstage/write/writingArticles')"
            >新增</router-link
          >
        </h2>
      </div>
      <div class="page-main">
        <div class="status">
          <div class="left">
            <el-radio-group v-model="articleStatus" size="small">
              <el-radio-button label="可用" name="0" />
              <el-radio-button label="待审核" name="1" />
              <el-radio-button label="草稿" name="2" />
              <el-radio-button label="已删除" name="2" />
            </el-radio-group>
          </div>
          <div class="right"></div>
        </div>

        <div class="list">
          <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="评论" prop="comments.length" width="55">
            </el-table-column>
            <el-table-column label="标题" style="color: rgb(70, 123, 150)">
              <template #default="scope">
                <b v-if="scope.row.sticky" style="color: #f56c6c">[置顶]</b
                >&nbsp;
                <b v-if="scope.row.ishot" style="color: #f56c6c">[推荐]</b>
                <p
                  class="articleTitle"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  <span style="user-select: none; color: rgb(70, 123, 150)">{{
                    scope.row.title
                  }}</span
                  >&nbsp;
                  <!-- <span
                    style="user-select: none; color: #999"
                    v-if="scope.row.state === 2"
                    >{{ scope.row.state === 2 ? "草稿" : "" }}</span
                  > -->
                  <!-- 草稿 -->
                  <i
                    style="font-size: 16px"
                    v-if="scope.row.state === 2"
                    class="iconfont iconcaogao"
                  ></i>
                  <!-- 删除 -->
                  <i
                    style="font-size: 16px"
                    v-if="scope.row.state === 0"
                    class="iconfont iconshanchu"
                  ></i>
                  &nbsp;
                  <i class="iconfont iconccgl-shujuzidianxiugaijilu-"></i>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              label="作者"
              prop="user.userInfo.nickName"
              width="120"
            >
            </el-table-column>
            <el-table-column label="分类" prop="category" width="180">
              <template #default="scope">
                <div>
                  <span v-for="item in scope.row.categories">
                    {{ item.title }}&nbsp;</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="日期" prop="updateDate" width="150">
            </el-table-column>
            <el-table-column align="right" width="380">
              <template #header style="display: flex">
                <el-input
                  title="根据标题搜索"
                  v-model="search"
                  placeholder="输入关键字搜索"
                  style="width: 70%"
                />
                &emsp;
                <el-select
                  v-model="condition.categoryTitle"
                  clearable
                  placeholder="所有"
                >
                  <el-option
                    v-for="item in categoryList"
                    :key="item.uuid"
                    :label="item.title"
                    :value="item.title"
                  />
                </el-select>
              </template>
              <template #default="scope">
                <el-button
                  :disabled="
                    user.role == 1 &&
                    scope.row.state != 1 &&
                    scope.row.state != 2
                  "
                  size="small"
                  type="warning"
                  style="width: 22%"
                  v-if="scope.row.state == 1 || scope.row.state == 2"
                  @click="handleSetArticleState(scope.row.uuid, '3')"
                >
                  待审核
                </el-button>
                <el-button
                  :disabled="user.role == 1 && scope.row.state != 3"
                  size="small"
                  type="warning"
                  style="width: 22%"
                  v-if="scope.row.state == 3"
                  @click="handleSetArticleState(scope.row.uuid, '1')"
                >
                  审核
                </el-button>
                <el-button
                  :disabled="user.role == 1 && scope.row.state != 0"
                  size="small"
                  type="warning"
                  style="width: 22%"
                  v-if="scope.row.state == 0"
                  @click="handleSetArticleState(scope.row.uuid, '2')"
                >
                  恢复
                </el-button>
                <el-button
                  :disabled="user.role == 1 && scope.row.state != 2"
                  size="small"
                  type="success"
                  style="width: 22%"
                  v-if="scope.row.state == 2"
                  @click="handleSetArticleState(scope.row.uuid, '1')"
                >
                  发布
                </el-button>
                <el-button
                  :disabled="
                    user.role == 1 &&
                    scope.row.state != 1 &&
                    scope.row.state != 3
                  "
                  size="small"
                  type="warning"
                  style="width: 22%"
                  v-if="scope.row.state == 1 || scope.row.state == 3"
                  @click="handleSetArticleState(scope.row.uuid, '2')"
                >
                  存草稿
                </el-button>
                <el-button
                  title="设为置顶"
                  size="small"
                  type="primary"
                  style="width: 22%"
                  @click="handleSticky(scope.row.uuid)"
                  v-if="
                    scope.row.state == 1 && !scope.row.sticky && user.role == 1
                  "
                >
                  置顶
                </el-button>
                <el-button
                  title="设为置顶"
                  size="small"
                  type="primary"
                  style="width: 22%"
                  @click="handleSticky(scope.row.uuid, false)"
                  v-if="
                    scope.row.state == 1 && scope.row.sticky && user.role == 1
                  "
                >
                  取消置顶
                </el-button>
                <el-button
                  title="设为推荐"
                  size="small"
                  type="primary"
                  style="width: 22%"
                  @click="handleSetArticleTestimonials(scope.row.uuid)"
                  v-if="
                    scope.row.state == 1 && !scope.row.ishot && user.role == 1
                  "
                >
                  推荐
                </el-button>
                <el-button
                  title="设为取消推荐"
                  size="small"
                  type="primary"
                  style="width: 22%"
                  @click="handleSetArticleTestimonials(scope.row.uuid, false)"
                  v-if="
                    scope.row.state == 1 && scope.row.ishot && user.role == 1
                  "
                >
                  取消推荐
                </el-button>
                <el-popconfirm
                  width="220"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="确定要删除吗？"
                  @confirm="handleDelete(scope.$index, scope.row)"
                  v-if="scope.row.state != 0"
                >
                  <template #reference>
                    <el-button
                      title="状态改为删除态"
                      size="small"
                      type="danger"
                      style="width: 22%"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
                <!-- <el-button
                  title="永久从数据库删除"
                  size="small"
                  type="danger"
                  style="width: 22%"
                  @click="handleForeverDelete(scope.$index, scope.row)"
                  >永除</el-button
                > -->
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
              :total="articleTotal"
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
      title="警告"
      v-model="centerDialogVisible"
      width="30%"
      destroy-on-close
      center
    >
      <span>你确定要删除吗？这将永远在数据库中删除该记录！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteArticle(article.uuid)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="articleList">
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  watch
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElNotification, ElMessage } from "element-plus";
import dateFormat from "@/assets/js/dateFormat.js";
import { InfoFilled } from "@element-plus/icons-vue";

const router = useRouter();
const { proxy }: any = getCurrentInstance();
const store = useStore();

// vue2.x的data参数
const tableData = ref<Array<any>>([]);
const search = ref<string>("");
const multipleSelection = ref<Array<any>>([]);
const centerDialogVisible = ref<boolean>(false);
const article = ref<any>({});
const condition = reactive({
  pageSize: 10,
  currPage: 1,
  categoryTitle: "",
  articleVague: "",
  state: "",
  userUuid: ""
});
const articleTotal = ref<number>(0);
const hideDeletebtn = computed(() => {
  if (articleTotal.value > 1) return true;
  return false;
});
const hidePage = computed(() => {
  if (articleTotal.value > 10) return false;
  return true;
});
const user = ref<any>({});
const articleStatus = ref<string>("可用");
const categoryList = computed(() => {
  return store.state.backstage.categoryList;
});
// 方法
/**
 * 修改导航
 */
const changeIndex = (index: string) => {
  store.commit("backstage/setActiveIndex", index);
};
/**
 * 修改文章
 */
const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  changeIndex("/backstage/writingArticles");
  router.push({
    name: "writingArticles",
    query: { uuid: row.uuid }
  });
};
/**
 * 删除（修改文章状态为删除）
 */
const handleDelete = (index: number, row: any) => {
  console.log(row);
  const categoryUuids: string[] = [];
  row.categories.forEach((item: any) => {
    categoryUuids.push(item.uuid);
  });
  row.categoryUuids = categoryUuids.join(",");
  row.state = "0";
  delete row.comments;
  delete row.user;
  delete row.categories;
  delete row.updateDate;
  delete row.createDate;
  delete row.category;

  proxy.$axios
    .put("/article/update", { article: row })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        getUserArticleList(condition);
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
 * 弹窗
 */
// const handleForeverDelete = (index: number, row: any) => {
//   centerDialogVisible.value = true;
//   article.value = row;
// };
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
  proxy.getAricleList();
};
/**
 * 选择全部
 */
const handleSelectionChange = (val: any) => {
  console.log(val);
  multipleSelection.value = val;
};
/**
 * 选择文章状态
 */
const selectState = (val: string) => {
  // （0已删除、1已发布、2草稿、3页面）
  switch (val) {
    case "可用":
      condition.state = "1";
      break;
    case "待审核":
      condition.state = "3";
      break;
    case "草稿":
      condition.state = "2";
      break;
    case "已删除":
      condition.state = "0";
      break;
    default:
      console.log(val);
  }
  getUserArticleList(condition);
};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.currPage = val;
  getUserArticleList(condition);
  scrollTo(0, 0); // 回到页面顶部
};
/**
 * 永久删除文章
 */
const deleteArticle = (uuid: string) => {
  proxy.$axios
    .get("/article/del", { articleUuid: uuid })
    .then((resp: any) => {
      centerDialogVisible.value = false;
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        article.value = {};
        getUserArticleList(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      centerDialogVisible.value = false;
      console.log(error);
    });
};
/**
 *置顶文章
 * @param condition
 */
const handleSticky = (uuid: string, sticky: boolean = true) => {
  proxy.$axios
    .post("/article/setSticky", { articleUuid: uuid, sticky })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "设置成功",
          type: "success"
        });
        getUserArticleList(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      centerDialogVisible.value = false;
      console.log(error);
    });
};
/**
 *修改文章状态
 * @param condition
 */
const handleSetArticleState = (uuid: string, state: string) => {
  proxy.$axios
    .post("/article/setArticleState", { articleUuid: uuid, state: state })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "设置成功",
          type: "success"
        });
        getUserArticleList(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      centerDialogVisible.value = false;
      console.log(error);
    });
};
/**
 *修改推荐文章
 * @param condition
 */
const handleSetArticleTestimonials = (uuid: string, ishot: boolean = true) => {
  proxy.$axios
    .post("/article/setIshotArticle", { articleUuid: uuid, ishot })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "设置成功",
          type: "success"
        });
        getUserArticleList(condition);
      } else {
        ElNotification({
          title: "失败",
          message: resp.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      centerDialogVisible.value = false;
      console.log(error);
    });
};
/**
 * 获取用户文章
 * @param condition
 */
const getUserArticleList = (condition: any) => {
  proxy.$axios
    .get("/article/userArticleList", condition)
    .then((res: any) => {
      console.log(res);
      if (res.code == "200") {
        for (const item of res.result.list) {
          item.createDate = dateFormat(item.createDate, "MM-dd");
          item.updateDate = dateFormat(item.updateDate, "yyyy-MM-dd");
        }
        tableData.value = res.result.list;
        articleTotal.value = res.result.page.totalRow;
        // commentList.value = res.result.list;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

watch(search, (newValue: any) => {
  condition.articleVague = newValue;
  getUserArticleList(condition);
});
watch(articleStatus, (newValue: any) => {
  selectState(newValue);
});
watch(
  () => condition.categoryTitle,
  (newval: any) => {
    console.log(newval);
    getUserArticleList(condition);
  }
);

onBeforeMount(() => {
  // 挂载开始之前
  document.title = "管理文章";
});
onMounted(() => {
  // 挂载之后

  const temp = JSON.parse(proxy.$Cookies.get("user"));
  user.value = temp;
  condition.userUuid = temp.uuid;
  getUserArticleList(condition);
});
</script>

<style lang="scss">
#articleList {
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

        .el-table_1_column_3 {
          .cell {
            color: rgb(70, 123, 150);
            span:nth-of-type(2) {
              color: #999;
              margin-right: 0 !important;
            }
            i {
              font-size: 0.8em;
            }
          }
        }

        .is-right {
          .cell {
            display: flex;
            justify-content: end;
            .el-select {
              width: 54%;
            }
          }
        }
        .el-table__cell {
          .cell {
            display: flex;
            align-items: center;
            .articleTitle {
              width: 86%;
              margin-left: 5px;
            }
          }
        }

        .operation {
          display: flex;
          .el-pagination {
            margin-left: auto;
          }
        }
      }
    }
  }
  .cell {
    position: relative;
  }
  .articleTitle {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    span:first-child {
      display: inline-block;
      max-width: 94%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 15px;
      font-weight: bold;
      transform: unset;
    }
    span {
      font-size: 12px;
      transform: scale(0.8);
      color: #e9e9e6;
      display: inline-block;
    }

    .iconfont {
      display: inline-block;
      font-size: 0.8em;
      color: rgb(70, 123, 150);
      vertical-align: super;
    }
  }
}
</style>
