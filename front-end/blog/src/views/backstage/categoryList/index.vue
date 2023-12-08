<template>
  <div id="categoryList">
    <div class="container">
      <div class="page-title">
        <h2>管理类别</h2>
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
            <el-table-column label="uuid" prop="uuid" width="260">
            </el-table-column>
            <el-table-column label="标题" prop="title" width="260">
            </el-table-column>
            <el-table-column align="right">
              <template #default="scope">
                <el-popconfirm
                  width="220"
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
                      style="width: 22%"
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
  </div>
</template>
<script lang="ts" name="categoryList" setup>
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const categoryListData = ref<Array<any>>([]);//数据
const multipleSelection = ref<any>([]);//多选数据
const categoryTotal = ref<number>(0);//总数
const hideDeletebtn = computed(() => {
  if (categoryTotal.value > 1) return true;
  return false;
});//是否隐藏全部删除
const condition = reactive({
  pageSize: 10,
  currPage: 1,
  categoryTitle: "",
  articleVague: "",
  state: "",
  userUuid: ""
});//搜索条目

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

  // proxy.$axios
  //   .put("/article/update", { article: row })
  //   .then((resp: any) => {
  //     if (resp.code === "200") {
  //       ElNotification({
  //         title: "成功",
  //         message: "删除成功",
  //         type: "success"
  //       });
  //       getUserArticleList(condition);
  //     } else {
  //       ElNotification({
  //         title: "失败",
  //         message: resp.msg,
  //         type: "error"
  //       });
  //     }
  //   })
  //   .catch((error: any) => {
  //     console.log(error);
  //   });
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
  getUserArticleList(condition);
  scrollTo(0, 0); // 回到页面顶部
};

onBeforeMount(() => {
  document.title = "分类列表";
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
