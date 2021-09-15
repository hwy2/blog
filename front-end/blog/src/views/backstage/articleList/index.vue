<template>
  <div id="articleList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理文章
          <router-link
            to="/backstage/writingArticles"
            @click="methods.changeIndex('/backstage/writingArticles')"
            >新增</router-link
          >
        </h2>
      </div>
      <div class="page-main">
        <div class="status">
          <div class="left">
            <p class="active" @click="methods.selectState($event, '可用')">
              可用
            </p>
            <p @click="methods.selectState($event, '待审核')">待审核</p>
            <p @click="methods.selectState($event, '草稿')">草稿</p>
            <p @click="methods.selectState($event, '已删除')">已删除</p>
          </div>
          <div class="right"></div>
        </div>

        <div class="list">
          <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="methods.handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="评论" prop="comments.length" width="55">
            </el-table-column>
            <el-table-column label="标题" style="color: rgb(70, 123, 150)">
              <template #default="scope">
                <p @click="methods.handleEdit(scope.$index, scope.row)">
                  <span
                    style="
                      user-select: none;
                      color: rgb(70, 123, 150);
                    "
                    >{{ scope.row.title }}</span
                  >&nbsp;
                  <span
                    style="user-select: none;  color: #999"
                    v-if="scope.row.state === 2"
                    >{{ scope.row.state === 2 ? "草稿" : "" }}</span
                  >
                  &nbsp;
                  <span
                    style="user-select: none; color: #999"
                    v-if="scope.row.state === 0"
                    >{{ scope.row.state === 0 ? "已删除" : "" }}</span
                  > &nbsp;
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
            <el-table-column label="分类" prop="category" width="180">
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
                  style="width: 70%"
                />
                <el-select
                  size="mini"
                  v-model="categoryValue"
                  placeholder="请选择"
                  style="width: 30%"
                >
                  <el-option
                    v-for="item in categoryList"
                    :key="item.uuid"
                    :label="item.title"
                    :value="item.title"
                  >
                  </el-option>
                </el-select>
              </template>
              <template #default="scope">
                <el-button
                  title="状态改为删除态"
                  size="mini"
                  type="danger"
                  style="margin-left: auto; width: 22%"
                  @click="methods.handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
                <el-button
                  title="永久从数据库删除"
                  size="mini"
                  type="danger"
                  style="width: 22%"
                  @click="methods.handleForeverDelete(scope.$index, scope.row)"
                  >永除</el-button
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
  toRefs,
  reactive,
  onBeforeMount,
  onMounted,
  defineComponent,
  getCurrentInstance,
  computed,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
export default defineComponent({
  setup: () => {
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const store = useStore();

    // vue2.x的data参数
    const state = reactive({
      tableData: computed(() => store.state.foreground.articleLists),
      search: "",
      multipleSelection: [],
      centerDialogVisible: false,
      categoryValue: "",
      article: {},
      condition: {
        pageSize: 10,
        currPage: 1,
        categoryTitle: "",
        articleVague: "",
        state: "",
      },
      categoryList: computed(() => store.state.backstage.categoryList),
      articleTotal: computed(() => store.state.foreground.totals),
      hideDeletebtn: computed(() => {
        if (store.state.foreground.totals > 1) return true;
        return false;
      }),
      hidePage: computed(() => {
        if (store.state.foreground.totals > 10) return false;
        return true;
      }),
    });
    // 方法
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
        methods.changeIndex("/backstage/writingArticles");
        router.push({
          name: "writingArticles",
          query: { uuid: row.uuid },
        });
      },
      /**
       * 删除（修改文章状态为删除）
       */
      handleDelete(index: number, row: any) {
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
                type: "success",
              });
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
            console.log(error);
          });
      },
      /**
       * 弹窗
       */
      handleForeverDelete(index: number, row: any) {
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
      /**
       * 选择文章状态
       */
      selectState(event: any, val: string) {
        // （0已删除、1已发布、2草稿、3页面）
        switch (val) {
          case "可用":
            state.condition.state = "";
            event.target.classList.add("active");
            event.target.nextElementSibling.classList.remove("active");
            event.target.nextElementSibling.nextElementSibling.classList.remove(
              "active"
            );
            event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove(
              "active"
            );
            break;
          case "待审核":
            state.condition.state = "3";
            event.target.classList.add("active");
            event.target.previousElementSibling.classList.remove("active");
            event.target.nextElementSibling.nextElementSibling.classList.remove(
              "active"
            );
            event.target.nextElementSibling.classList.remove("active");
            break;
          case "草稿":
            state.condition.state = "2";
            event.target.classList.add("active");
            event.target.nextElementSibling.classList.remove("active");
            event.target.previousElementSibling.classList.remove("active");
            event.target.previousElementSibling.previousElementSibling.classList.remove(
              "active"
            );
            break;
          case "已删除":
            state.condition.state = "0";
            event.target.classList.add("active");
            event.target.previousElementSibling.classList.remove("active");
            event.target.previousElementSibling.previousElementSibling.classList.remove(
              "active"
            );
            event.target.previousElementSibling.previousElementSibling.previousElementSibling.classList.remove(
              "active"
            );
            break;
          default:
            console.log(val);
        }
        proxy.getAricleList(state.condition);
      },
      /**
       * 分页跳转
       */
      handleChangePage(val: any) {
        state.condition.currPage = val;
        proxy.getAricleList(state.condition);
        scrollTo(0, 0); // 回到页面顶部
      },
      /**
       * 永久删除文章
       */
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
    watch(
      () => state.search,
      (newValue: any, oldValue: any) => {
        state.condition.articleVague = newValue;
        proxy.getAricleList(state.condition);
      }
    );
    watch(
      () => state.categoryValue,
      (newValue: any, oldValue: any) => {
        state.condition.categoryTitle = newValue;
        proxy.getAricleList(state.condition);
      }
    );

    onBeforeMount(() => {
      // 挂载开始之前
      document.title = "管理文章";
    });
    onMounted(() => {
      // 挂载之后
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
#articleList {
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
              font-size: 0.5em;
            }
          }
        }

        .el-table_1_column_7 {
          .cell {
            display: flex;
            .el-select {
              width: 54%;
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