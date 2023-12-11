<template>
  <div id="fileList">
    <div class="container">
      <div class="page-title">
        <h2>管理上传文件</h2>
      </div>
      <div class="page-main">
        <div class="list">
          <el-table
            :data="fileListData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="文件名" prop="name" width="200">
              <template #default="scope">
                <!-- <img slot="reference" v-lazy="scope.row.absoluteUrl" /> -->
                <img :src="scope.row.absoluteUrl" alt="" />
              </template>
            </el-table-column>
            <el-table-column
              label="文件名"
              prop="name"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="相对地址"
              prop="relativeUrl"
              width="350"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="绝对地址"
              prop="absoluteUrl"
              width="350"
              align="center"
            >
            </el-table-column>
            <el-table-column label="上传者" prop="category" align="center">
              <template #default="scope">
                <span>{{ scope.row.user.name }}</span>
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
              :total="fileTotal"
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
<script lang="ts" name="fileList" setup>
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
import { ElNotification, ElMessage } from "element-plus";
import dateFormat from "@/assets/js/dateFormat.js";
import { InfoFilled } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const condition = reactive({
  pageSize: 10,
  currPage: 1,
  userUuid: "",
  name: ""
}); //文件状态
const multipleSelection = ref<Array<any>>([]); //选中数据
const fileListData = ref<Array<any>>([]); //文件数据
const fileTotal = ref<number>(0); //文件总条数
const hideDeletebtn = computed(() => {
  if (fileTotal.value > 1) return true;
  return false;
}); //是否隐藏删除全部按钮
const hidePage = computed(() => {
  if (fileTotal.value > 10) return false;
  return true;
}); //显示与否分页
const user = ref<any>({}); //用户信息
const search = ref<string>();

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
    console.log(item);
    handleDelete(item);
  });
  // proxy.getAricleList();
};
/**
 * 删除（）
 */
const handleDelete = (row: any) => {
  proxy.$axios
    .get("/common/del", { fileUuid: row.uuid })
    .then((resp: any) => {
      if (resp.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        getFileData(condition);
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
  getFileData(condition);
  scrollTo(0, 0); // 回到页面顶部
};

const getFileData = (condition: any) => {
  proxy.$axios
    .get("/common/userList", condition)
    .then((resp: any) => {
      console.log(resp, "file");
      if (resp.code == "200") {
        fileListData.value = resp.result.list;
        fileTotal.value = resp.result.page.totalRow;
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};

watch(search, (newval: any) => {
  condition.name = newval;
  getFileData(condition);
});

onBeforeMount(() => {
  document.title = "文件列表";
  user.value = JSON.parse(proxy.$Cookies.get("user"));
  condition.userUuid = user.value.uuid;
  console.log(user.value);
  getFileData(condition);
});
onMounted(() => {});
</script>

<style lang="scss">
#fileList {
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
        .fileContent {
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
            opacity: 1;
            transition: all 0.3s;
            height: 34px;
          }
          // &:hover {
          //   .operation {
          //     opacity: 1;
          //   }
          // }
        }
      }
    }
  }
}
</style>
