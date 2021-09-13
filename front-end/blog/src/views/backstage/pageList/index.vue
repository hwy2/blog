<template >
  <div id="pageList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理独立页面
          <router-link
            to="/backstage/createPage"
            @click="methods.changeIndex('/backstage/createPage')"
            >新增</router-link
          >
        </h2>
      </div>
      <div class="page-main">
        <div class="list">
          <el-table
            :data="
              tableData.filter(
                (data) =>
                  !search ||
                  data.title.toLowerCase().includes(search.toLowerCase())
              )
            "
            style="width: 100%"
            @selection-change="methods.handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="评论" prop="comments.length" width="55">
            </el-table-column>
            <el-table-column label="标题" prop="title">
              <template #default="scope">
                <p @click="methods.handleEdit(scope.$index, scope.row)">
                  <span style="user-select: none; color: rgb(70, 123, 150)">{{
                    scope.row.title
                  }}</span>&nbsp;

                  <i
                    style="color: rgb(70, 123, 150); font-size: 0.5em"
                    class="iconfont iconccgl-shujuzidianxiugaijilu-"
                  ></i>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              label="作者"
              prop="user.userInfo.nickName"
              width="150"
            >
            </el-table-column>
            <el-table-column label="日期" prop="updateDate" width="150">
            </el-table-column>
            <el-table-column align="right" width="260">
              <template #header style="display: flex">
                <el-input
                  title="根据标题搜索"
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template #default="scope">
                <el-button
                  size="mini"
                  type="danger"
                  style="margin-left: auto"
                  @click="methods.handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="operation" style="margin-top: 20px">
            <el-button
              v-if="hideDeletebtn"
              size="mini"
              type="danger"
              @click="methods.handleBatchDelete()"
              >删除全部</el-button
            >
            <el-pagination
              :hide-on-single-page="hidePage"
              layout="prev, pager, next"
              :total="articleTotal"
              @next-click="methods.handleChangePage"
              @prev-click="methods.handleChangePage"
              @current-change="methods.handleChangePage"
            >
            </el-pagination>
          </div>
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
        <el-button type="primary" @click="methods.deleteArticle(article.uuid)"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "outline",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      search: "",
      centerDialogVisible: false, // 提示框
      article: {},
      tableData: computed(() => store.state.foreground.articleLists),
      multipleSelection: [],
      condition: {
        pageSize: 10,
        currPage: 1,
        categoryTitle: "",
        articleVague: "",
        state: 4,
      },
      hideDeletebtn: computed(() => {
        if (store.state.foreground.totals > 1) return true;
        return false;
      }),
      hidePage: computed(() => {
        if (store.state.foreground.totals > 10) return false;
        return true;
      }),
    });
    const methods = {
      /**
       * 修改导航
       */
      changeIndex(index: string) {
        store.commit("backstage/setActiveIndex", index);
      },
      /**
       * 修改文章
       */
      handleEdit(index: number, row: any) {
        console.log(index, row);
        methods.changeIndex("/backstage/createPage");
        router.push({
          name: "createPage",
          params: { uuid: row.uuid },
        });
      },
      /**
       * 删除
       */
      handleDelete(index: number, row: any) {
        console.log(row);
        state.centerDialogVisible = true;
        state.article = row;
      },
      /**
       * 批量删除
       */
      handleBatchDelete() {
        Array.from(state.multipleSelection).map((item: any) => {
          methods.handleDelete(1, item);
        });
        proxy.getAricleList();
      },
      /**
       * 选择全部
       */
      handleSelectionChange(val: any) {
        console.log(val);
        state.multipleSelection = val;
      },
      deleteArticle(uuid: string) {
        proxy.$axios
          .get("/article/del", { articleUuid: uuid })
          .then((resp: any) => {
            state.centerDialogVisible = false;
            if (resp.code === "200") {
              ElNotification({
                title: "成功",
                message: "删除成功",
                type: "success",
              });
              state.article = {};
              proxy.getAricleList(state.condition);
            } else {
              ElNotification({
                title: "失败",
                message: resp.msg,
                type: "error",
              });
            }
          })
          .catch((error: any) => {
            state.centerDialogVisible = false;
            console.log(error);
          });
      },
    };
    onBeforeMount(() => {
      document.title = "页面列表";
    });
    onMounted(() => {
      proxy.getAricleList(state.condition);
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#pageList {
  min-height: 93.3vh;
  width: 100%;
  .container {
    width: 70%;
    margin: 0 auto;
    color: #444;
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
              font-size: 0.5em;
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
}
</style>