<template>
  <div id="linkList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理友情链接
          <a href="javascript:void(0)" @click="restore">新增</a>
        </h2>
      </div>
      <div class="page-main">
        <div class="content-pane">
          <div class="list">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="链接名称">
                <template #default="scope">
                  <p
                    @click="getLinksInfo(scope.row.uuid)"
                    style="color: #467b96; user-select: none; cursor: pointer"
                  >
                    {{ scope.row.name }}&nbsp;
                    <span
                      style="font-size: 0.5em; color: #999"
                      v-if="!scope.row.state"
                      >待审核</span
                    >
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
                    size="small"
                    placeholder="输入关键字搜索"
                    style="width: 70%"
                  />
                </template>
                <template #default="scope">
                  <el-button
                    title="状态改为删除态"
                    size="small"
                    type="danger"
                    style="margin-left: auto; margin-right: 10px"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <div class="operation" style="margin-top: 20px">
              <!-- <el-button
                v-if="hideDeletebtn"
                size="small"
                type="danger"
                @click="handleBatchDelete()"
                >删除全部</el-button
              > -->
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
                :total="totals"
                @next-click="handleChangePage"
                @prev-click="handleChangePage"
                @current-change="handleChangePage"
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
              <el-radio v-model="formLinks.state" :label="1" border
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
                @click="submitAddForm('ruleForm')"
                >增加链接</el-button
              >
              <el-button
                v-if="addOrModify"
                type="primary"
                @click="submitModifyForm('ruleForm')"
                >编辑链接</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog v-model="centerDialogVisible" title="警告" width="30%" center>
      <p style="text-align: c">
        你确定要删除吗？这将永远在数据库中删除该记录！
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteLinks(links.uuid)">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" name="linkList" setup>
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount,
  watch
} from "vue";
// import { useStore } from "vuex";
// import { useRouter } from "vue-router";
import { ElNotification, ElLoading, ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import {
  getLinksListApi,
  delLinksApi,
  getLinksInfoApi,
  createLinksApi,
  upinfoLinksApi
} from "@/utils/api/links";

// const store = useStore();
// const router = useRouter();
const { proxy }: any = getCurrentInstance();

const tableData = ref<Array<any>>([]); //外链数据
const multipleSelection = ref<Array<any>>([]); //多选数据
const search = ref<string>(""); //搜索
const links = ref<any>({}); //当前链接
const totals = ref<number>(0); //链接总数
const centerDialogVisible = ref<boolean>(false); //居中的弹窗
const addOrModify = ref<boolean>(false); //添加或者修改
const condition = reactive({
  currPage: 1,
  pageSize: 10,
  name: ""
}); //搜索条目
let formLinks = reactive({
  name: "",
  URL: "",
  sort: "",
  image: "http://",
  description: "",
  state: 1,
  uuid: ""
}); //表单数据
const rulesLinks = reactive({
  name: [
    { required: true, message: "请输入链接名称", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  URL: [
    { required: true, message: "请输入链接地址", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  sort: [
    { required: false, message: "请输入链接分类", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  image: [
    { required: false, message: "请输入图片地址", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  description: [
    { required: false, message: "请输入描述", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ]
}); //验证信息
const hidePage = computed(() => {
  if (totals.value > 10) return false;
  return true;
});
const hideDeletebtn = computed(() => {
  if (totals.value > 1) return true;
  return false;
});
watch(search, (newValue, oldValue) => {
  console.log(newValue, oldValue);
  condition.name = newValue;
  getLinksList();
});
/**
 * 获取全部友链
 */
const getLinksList = () => {
  getLinksListApi(condition)
    .then((res: any) => {
      console.log(res);
      if (res.code == "200") {
        tableData.value = res.result.list;
        totals.value = res.result.page.totalRow;
      }
    })
    .catch((err: any) => {
      console.log(err);
      tableData.value = [];
    });
};
/**
 * 选择全部
 */
const handleSelectionChange = (val: any) => {
  console.log(val);
  multipleSelection.value = val;
};
/**
 * 删除（弹窗）
 */
const handleDelete = (index: number, row: any) => {
  console.log(row);
  centerDialogVisible.value = true;
  links.value = row;
};
/**
 * 删除全部
 */
const handleBatchDelete = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请选择要删除的数据！");
    return;
  }
  Array.from(multipleSelection.value).map((item: any) => {
    deleteLinks(item.uuid);
  });
  getLinksList();
};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.currPage = val;
  getLinksList();
  scrollTo(0, 0); // 回到页面顶部
};
/**
 * 删除方法
 */
const deleteLinks = (linksUuid: string) => {
  delLinksApi({
    linksUuid
  }).then((res: any) => {
    console.log(res);
    centerDialogVisible.value = false;
    if (res.code === "200") {
      ElNotification({
        title: "成功",
        message: "删除成功",
        type: "success"
      });
      links.value = {};
      getLinksList();
    } else {
      ElNotification({
        title: "失败",
        message: res.msg,
        type: "error"
      });
    }
  });
};
/**
 * 显示单个links信息
 */
const getLinksInfo = (linksUuid: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  getLinksInfoApi({ linksUuid })
    .then((res: any) => {
      console.log(res, "info");
      if (res.code === "200") {
        let links = res.result.links;
        formLinks.name = links.name;
        formLinks.URL = links.URL;
        formLinks.sort = links.sort;
        formLinks.image = links.image;
        formLinks.description = links.description;
        formLinks.state = links.state;
        formLinks.uuid = links.uuid;
        addOrModify.value = true;
        loading.close();
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
/**
 * 新增链接
 */
const submitAddForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      formLinks.uuid = "";
      createLinksApi(formLinks)
        .then((res: any) => {
          console.log(res);
          if (res.code === "200") {
            ElNotification({
              title: "成功",
              message: "添加成功",
              type: "success"
            });
            getLinksList();
          } else {
            ElNotification({
              title: "错误",
              message: res.msg,
              type: "error"
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
        type: "error"
      });
      return false;
    }
  });
};
/**
 * 修改链接
 */
const submitModifyForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      upinfoLinksApi({ links: formLinks })
        .then((res: any) => {
          console.log(res);
          if (res.code === "200") {
            ElNotification({
              title: "成功",
              message: "修改链接成功",
              type: "success"
            });
            getLinksList();
          } else {
            ElNotification({
              title: "错误",
              message: res.msg,
              type: "error"
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
        type: "error"
      });
      return false;
    }
  });
};
/**
 * 恢复原样
 */
const restore = () => {
  formLinks.name = "";
  formLinks.URL = "";
  formLinks.sort = "";
  formLinks.image = "http://";
  formLinks.description = "";
  formLinks.state = 1;
  addOrModify.value = false;
};
onBeforeMount(() => {
  document.title = "友情链接";
});
onMounted(() => {
  getLinksList();
});
</script>

<style lang="scss">
#linkList {
  min-height: 93.3vh;
  width: 100%;
  .container {
    width: 95%;
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
