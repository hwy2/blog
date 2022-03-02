<template >
  <div id="linkList" >
    <div class="container">
      <div class="page-title">
        <h2>
          管理友情链接
          <a href="javascript:void(0)" @click="methods.restore">新增</a>
        </h2>
      </div>
      <div class="page-main">
        <div class="content-pane">
          <div class="list">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="methods.handleSelectionChange"
            >
              >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="链接名称">
                <template #default="scope">
                  <p
                    @click="methods.getLinksInfo(scope.row.uuid)"
                    style="color: #467b96; user-select: none; cursor: pointer"
                  >
                    {{ scope.row.name }}&nbsp;
                    <span style="font-size:0.5em;color:#999;" v-if="!scope.row.state">待审核</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="链接地址" prop="URL"> </el-table-column>
              <el-table-column label="分类" prop="sort"></el-table-column>
              <el-table-column label="图片" width="60">
                <template #default="scope">
                  <img
                    style="width: 32px; height: 32px; border-radius: 32px"
                    :src="scope.row.image"
                    alt="图片"
                  />
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #header style="display: flex">
                  <el-input
                    title="根据标题搜索"
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"
                    style="width: 70%"
                  />
                </template>
                <template #default="scope">
                  <el-button
                    title="状态改为删除态"
                    size="mini"
                    type="danger"
                    style="margin-left: auto; margin-right: 10px"
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
                :total="totals"
                @next-click="methods.handleChangePage"
                @prev-click="methods.handleChangePage"
                @current-change="methods.handleChangePage"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="content-right">
          <el-form
            label-position="top"
            label-width="80px"
            :model="formLinks"
            :rules="rulesLinks"
            ref="ruleForm"
          >
            <el-form-item label="链接名称" prop="name">
              <el-input v-model="formLinks.name"></el-input>
            </el-form-item>
            <el-form-item label="链接地址" prop="URL">
              <el-input v-model="formLinks.URL"></el-input>
            </el-form-item>
             <el-form-item label="状态" title="需审核通过才能在前台页面展示">
                <el-radio  v-model="formLinks.state" :label="1" border
                  >审核通过</el-radio
                >
                <el-radio v-model="formLinks.state" :label="0" border
                  >待审核</el-radio
                >
              </el-form-item>
            <el-form-item label="链接分类" prop="sort">
              <el-input v-model="formLinks.sort"></el-input>
            </el-form-item>
            <p>建议以英文字母开头，只包含字母与数字</p>
            <el-form-item label="链接图片" prop="image">
              <el-input v-model="formLinks.image"></el-input>
            </el-form-item>
            <p>需要以http://开头，留空表示没有链接图片</p>
            <el-form-item label="链接描述" prop="description">
              <el-input
                type="textarea"
                v-model="formLinks.description"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="!addOrModify"
                type="primary"
                @click="methods.submitAddForm('ruleForm')"
                >增加链接</el-button
              >
              <el-button
                v-if="addOrModify"
                type="primary"
                @click="methods.submitModifyForm('ruleForm')"
                >编辑链接</el-button
              >
            </el-form-item>
          </el-form>
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
        <el-button type="primary" @click="methods.deleteLinks(links.uuid)"
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
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification,ElLoading } from "element-plus";
export default defineComponent({
  name: "linkList",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      tableData: [],
      multipleSelection: [],
      search: "",
      links: {},
      totals: 0,
      centerDialogVisible: false,
      addOrModify: false,
      condition: {
        currPage: 1,
        pageSize: 10,
        name: "",
      },
      formLinks: {
        name: "",
        URL: "",
        sort: "",
        image: "http://",
        description: "",
        state:1
      },
      rulesLinks: {
        name: [
          { required: true, message: "请输入链接名称", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        URL: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          { required: false, message: "请输入链接分类", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        image: [
          { required: false, message: "请输入图片地址", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: false, message: "请输入描述", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      hidePage: computed(() => {
        if (state.totals > 10) return false;
        return true;
      }),
      hideDeletebtn: computed(() => {
        if (state.totals > 1) return true;
        return false;
      }),
    });
    watch(
      () => state.search,
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
        state.condition.name = newValue;
        methods.getLinksList();
      }
    );
    const methods = {
      /**
       * 获取全部友链
       */
      getLinksList() {
        proxy.$axios
          .get("/links/list", state.condition)
          .then((res: any) => {
            console.log(res);
            state.tableData = res.result.list;
            state.totals = res.result.page.totalRow;
          })
          .catch((err: any) => {
            console.log(err);
            state.tableData = [];
          });
      },
      /**
       * 选择全部
       */
      handleSelectionChange(val: any) {
        console.log(val);
        state.multipleSelection = val;
      },
      /**
       * 删除（弹窗）
       */
      handleDelete(index: number, row: any) {
        console.log(row);
        state.centerDialogVisible = true;
        state.links = row;
      },
      /**
       * 删除全部
       */
      handleBatchDelete() {
        Array.from(state.multipleSelection).map((item: any) => {
          methods.deleteLinks(item.uuid);
        });
        methods.getLinksList();
      },
      /**
       * 分页跳转
       */
      handleChangePage(val: any) {
        state.condition.currPage = val;
        methods.getLinksList();
        scrollTo(0, 0); // 回到页面顶部
      },
      /**
       * 删除方法
       */
      deleteLinks(linksUuid: string) {
        proxy.$axios
          .get("/links/del", {
            linksUuid,
          })
          .then((res: any) => {
            console.log(res);
            state.centerDialogVisible = false;
            if (res.code === "200") {
              ElNotification({
                title: "成功",
                message: "删除成功",
                type: "success",
              });
              state.links = {};
              methods.getLinksList();
            } else {
              ElNotification({
                title: "失败",
                message: res.msg,
                type: "error",
              });
            }
          });
      },
      /**
       * 显示单个links信息
       */
      getLinksInfo(linksUuid: string) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        proxy.$axios
          .get("/links/info", { linksUuid })
          .then((res: any) => {
            console.log(res);
            if (res.code === "200") {
              state.formLinks = res.result.links;
              state.addOrModify = true;
              loading.close();
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      },
      /**
       * 新增链接
       */
      submitAddForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .post("/links/create", state.formLinks)
              .then((res: any) => {
                console.log(res);
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "添加成功",
                    type: "success",
                  });
                  methods.getLinksList();
                } else {
                  ElNotification({
                    title: "错误",
                    message: res.msg,
                    type: "error",
                  });
                }
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            ElNotification({
              title: "错误",
              message: "必填项不能为空",
              type: "error",
            });
            return false;
          }
        });
      },
      /**
       * 修改链接
       */
      submitModifyForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .put("/links/upinfo", { links: state.formLinks })
              .then((res: any) => {
                console.log(res);
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "修改链接成功",
                    type: "success",
                  });
                  methods.getLinksList();
                } else {
                  ElNotification({
                    title: "错误",
                    message: res.msg,
                    type: "error",
                  });
                }
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            ElNotification({
              title: "错误",
              message: "必填项不能为空",
              type: "error",
            });
            return false;
          }
        });
      },
      /**
       * 恢复原样
       */
      restore() {
        state.formLinks = {
          name: "",
          URL: "",
          sort: "",
          image: "http://",
          description: "",
          state:1
        };
        state.addOrModify = false;
      },
    };
    onBeforeMount(() => {
      document.title = "友情链接";
    });
    onMounted(() => {
      methods.getLinksList();
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#linkList {
  min-height: 93.3vh;
  width: 100%;
  .container {
    width: 80%;
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
      display: flex;
      padding-bottom: 10vh;
      .content-pane {
        width: 68%;
        position: relative;
        margin-right: 2%;
        .list {
          padding: 24px;
          background-color: #fff;
        }
        .operation {
          display: flex;
          .el-pagination {
            margin-left: auto;
          }
        }
      }
      .content-right {
        width: 30%;
        padding-left: 15px;
        box-sizing: border-box;
        .el-form {
          .el-form-item {
            .el-form-item__label {
              line-height: 1.5;
              font-weight: bold;
            }
          }
          p {
            font-size: 0.8em;
            margin-top: -8px;
            color: #999;
            padding-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>