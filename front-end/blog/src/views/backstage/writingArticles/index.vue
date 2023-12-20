<template>
  <div id="writingArticles">
    <div class="container">
      <div class="page-title">
        <h2>{{ article?.title ? article?.title : "撰写新文章" }}</h2>
      </div>
      <div class="page-main">
        <div class="content-pane">
          <el-form
            label-position="top"
            label-width="80px"
            :model="article"
            :rules="rulesArticle"
            ref="articleForm"
            onSubmit="return false"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="article.title"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="文章内容">
              <div class="md-editor">
                <md-editor
                  v-model="content"
                  @onHtmlChanged="saveHtml"
                  @onSave="saveValue"
                  @onUploadImg="uploadImg"
                  :preview="false"
                />
              </div>
            </el-form-item>
            <div class="bgWhite">
              <h3>其他字段</h3>
              <el-form-item label="文章摘要" prop="abstract">
                <el-input
                  type="textarea"
                  :rows="6"
                  maxlength="256"
                  show-word-limit
                  v-model="article.abstract"
                ></el-input>
              </el-form-item>
              <p>自定义简介摘要，如不填将自动摘取前 100 字。</p>
              <el-form-item label="文章封面图" prop="photo">
                <el-input v-model="article.photo"></el-input>
              </el-form-item>
              <p>自定义封面，如不填将显示随机封面图。</p>
            </div>

            <el-form-item class="clearfix">
              <el-button
                type="primary"
                @click="submitArticleForm('articleForm', true)"
              >
                保存草稿
              </el-button>
              <el-button
                type="primary"
                @click="submitArticleForm('articleForm', false)"
              >
                {{ !paramsUuid ? "发布文章" : "修改文章" }}
              </el-button>
            </el-form-item>
            <div class="clear"></div>
          </el-form>
        </div>
        <div class="content-right">
          <div class="title">
            分类
            <el-button type="primary" :icon="Plus" size="small" circle @click="editDialog = true"></el-button>
          </div>
          <div class="category">
            <el-checkbox-group v-model="checkboxGroup">
              <div v-for="(item, index) in categoryList" :key="index">
                <el-checkbox :label="item.title"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="editDialog" title="添加类别" width="50%">
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
          <el-button  type="primary" @click="handleCreateCategoy()">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="writingArticles">
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount,
  watch,
  onBeforeUnmount
} from "vue";
import dateFormat from "@/assets/js/dateFormat.js";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ElNotification, ElLoading, ElButton } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
// vue2.x的data参数
const content = ref<string>(""); // 富文本编辑框
const checkboxGroup = ref<Array<string>>(["默认"]);
const saveStatus = ref<boolean>(true);
const article = reactive({
  title: "",
  content: "",
  photo: "https://api.baka.fun/acgpic",
  state: 1,
  abstract: "",
  pageview: 0,
  ishot: false,
  userUuid: "",
  categoryUuids: ""
});
const rulesArticle = reactive({
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    {
      max: 255,
      message: "最长为 255 个字符",
      trigger: "blur"
    }
  ],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
  photo: [{ required: true, message: "请输入链接", trigger: "blur" }],
  abstract: [
    { required: true, message: "请输入摘要", trigger: "blur" },
    {
      max: 255,
      message: "最长为 255 个字符",
      trigger: "blur"
    }
  ]
});
const categoryList = computed(() => store.state.backstage.categoryList);
const paramsUuid = ref<any>("");
const formcategory = reactive({
  title: "",
  userUuid: ""
});
const editDialog = ref<boolean>(false)//新增
const validateFormRef = ref()
const user = ref<any>({})


/**
 * 文章状态 （0已删除、1已发布、2草稿、3页面）
 */
enum status {
  delete, // 删除
  release, // 发布
  draft, // 草稿
  awaitingApproval, //待审核
  page // 页面
}

// .5s后再监听article对象的变化，
setTimeout(() => {
  watch(
    () => article,
    (newValue: any, oldValue: any) => {
      console.log(newValue);
      console.log(oldValue);
      saveStatus.value = false;
    },
    {
      deep: true // 深度监听的参数
    }
  );
}, 500);
watch(
  () => saveStatus,
  (newValue: any, oldValue: any) => {
    console.log(newValue);
    if (newValue) {
      // 清除窗口事件
      window.onbeforeunload = null;
    } else {
      // 添加刷新提示
      window.onbeforeunload = (e) => {
        e = e || window.event;
        if (e) {
          e.returnValue = "关闭提示";
        }
        return "关闭提示";
      };
    }
  }
);
watch(
  () => [...checkboxGroup.value],
  (newValue: any, oldValue: any) => {
    if (newValue.length === 0) {
      article.categoryUuids = categoryList.value[0].uuid;
      return;
    }
    const categoryUuidList: string[] = [];
    for (const temp of [...newValue]) {
      categoryUuidList.push(
        [...categoryList.value].filter((item: any) => {
          return item.title === temp;
        })[0].uuid
      );
    }

    article.categoryUuids = categoryUuidList.join(",");
  }
  // { deep: true }对象用法
);

/**
 * 保存当前装换的html字段
 */
const saveHtml = (html: string) => {
  console.log(html);
  article.content = content.value;
};
/**
 * 保存当前数据
 */
const saveValue = (v: string) => {
  console.log(v);
  saveStatus.value = true;
  submitArticleForm("articleForm", true);
};
/**
 * 上传图片文件
 */
const uploadImg = async (
  files: FileList,
  callback: (urls: string[]) => void
) => {
  const res = await Promise.all(
    Array.from(files).map((file) => {
      console.log(file);
      return new Promise((rev, rej) => {
        const data = new FormData();
        data.append("files", file);
        data.append("userUuid", article.userUuid);
        proxy.$axios
          .post("/common/enclosure", data)
          .then((resp: any) => rev(resp))
          .catch((error: any) => rej(error));
      });
    })
  );
  console.log(res);
  callback(res.map((item: any) => item.result.fileList[0].absoluteUrl));
};
/**
 * 提交表单
 */
const submitArticleForm = (formName: string, isdraft: boolean) => {
  saveStatus.value = true;
  if (article.abstract === "") {
    article.abstract = content.value.substr(0, 100);
  }
  // console.log(router.currentRoute.value.query.uuid)
  proxy.$refs[formName].validate((valid: any) => {
    if (isdraft) {
      article.state = status.draft;
    }

    if (valid && article.content !== "") {
      if (paramsUuid.value) {
        updateArticle(isdraft);
      } else {
        createArticle(isdraft);
      }
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
const createArticle = (isdraft: boolean) => {
  proxy.$axios
    .post("/article/create", article)
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
        if (isdraft) {
          ElNotification({
            title: "成功",
            message: "保存成功",
            type: "success"
          });
        } else {
          ElNotification({
            title: "成功",
            message: "文章创建成功",
            type: "success"
          });
          saveStatus.value = true;
          // 跳转到文章列表页面
          setTimeout(() => {
            router.push({ name: "articleList" });
            store.commit("backstage/setActiveIndex", "/backstage/articleList");
          }, 1000);
        }
      } else {
        saveStatus.value = false;
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
};
const updateArticle = (isdraft: boolean) => {
  // return
  console.log("article", article);
  proxy.$axios
    .put("/article/update", { article: article })
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
        saveStatus.value = true;
        if (isdraft) {
          ElNotification({
            title: "成功",
            message: "保存成功",
            type: "success"
          });
        } else {
          ElNotification({
            title: "成功",
            message: "文章修改成功",
            type: "success"
          });
          // 跳转到文章列表页面
          setTimeout(() => {
            router.push({ name: "articleList" });
            store.commit("backstage/setActiveIndex", "/backstage/articleList");
          }, 1000);
        }
      } else {
        saveStatus.value = false;
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
};
/**
 * 获取文章内容
 */
const getArticleInfo = (uuid: any) => {
  const loading = ElLoading.service({ fullscreen: true });
  proxy.$axios
    .get("/article/info", { articleUuid: uuid })
    .then((res: any) => {
      console.log(res);
      if (res.code == "200") {
        document.title = "编辑" + res.result.article.title;
        res.result.article.createDate = dateFormat(
          res.result.article.createDate,
          "yyyy年MM月dd日"
        );
        res.result.article.updateDate = dateFormat(
          res.result.article.updateDate,
          "yyyy-MM-dd hh:mm:ss"
        );
        article.title = res.result.article.title;
        article.content = res.result.article.content;
        article.photo = res.result.article.photo;
        article.state = res.result.article.state;
        article.abstract = res.result.article.abstract;
        article.pageview = res.result.article.pageview;
        article.ishot = res.result.article.ishot;
        article.userUuid = res.result.article.user.uuid;
        article.categoryUuids = "";

        (article as any).uuid = res.result.article.uuid;
        const list: string[] = [];
        const list2: string[] = [];
        for (const item of res.result.article.categories) {
          console.log(item);
          list.push(item.uuid);
          list2.push(item.title);
        }
        article.categoryUuids = list.join(",");
        checkboxGroup.value = list2;

        //  res.result.article;
        content.value = res.result.article.content;
        loading.close();
      }
    })
    .catch((error: any) => {
      console.log(error);
      loading.close();
    });
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
            getCategoryList();
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
/**
 * 获取类别列表
 */
const getCategoryList = () => {
  proxy.$axios
    .get("/category/list", {
      userUuid: user.value.uuid
    })
    .then((res: any) => {
      console.log("获取类别列表", res);
      for (const item of res.result.list) {
        item.createDate = dateFormat(item.createDate, "MM-dd");
      }
      store.commit("backstage/setCategoryList", res.result.list);
      store.commit(
        "backstage/setClassificationsTotal",
        res.result.page.totalRow
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
};

onBeforeMount(() => {
  // 挂载之前
  document.title = "撰写文章";
  if (proxy.$Cookies.get("user")) {
    const user = JSON.parse(proxy.$Cookies.get("user"));
    user.value = user
    formcategory.userUuid = user.uuid;
    article.userUuid = user.uuid;
  }
  article.categoryUuids = store.state.backstage.categoryList[0].uuid;
  // proxy.getCategoryList();
});
onMounted(() => {
  // 挂载之后
  if (!proxy.$Cookies.get("accessToken")) {
    router.push({ name: "login" });
  }

  // 如果路由中携带有文章的uuid，默认认为是修改文章
  if (router.currentRoute.value.query.uuid) {
    document.title = "修改文章";
    paramsUuid.value = router.currentRoute.value.query.uuid;
    getArticleInfo(paramsUuid.value);
  }
});


// 单页面导航守卫
onBeforeRouteLeave((to, from, next) => {
  if (!saveStatus.value) {
    const answer = window.confirm("你真的想离开吗? 您有未保存的更改!");
    // 清除窗口绑定，及提交activeIndex导航
    if (answer) {
      store.commit("backstage/setActiveIndex", to.fullPath);
      window.onbeforeunload = null;
      next();
    } else {
      // 取消导航并停留在同一页面上
      store.commit("backstage/setActiveIndex", "/backstage/writingArticles");
      next(false);
    }
  } else {
    window.onbeforeunload = null;
    next(true);
  }
});
onBeforeUnmount(() => {
  window.onbeforeunload = null;
});
</script>

<style lang="scss">
#writingArticles {
  height: calc(100vh - 60px);
  width: 100%;
  overflow: auto;
  .container {
    width: 95%;
    margin: 0 auto;
    color: #444;
    .page-title {
      padding: 1.5% 0;
      width: 76%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      h2 {
        font-size: 1.2em;
        width: 99%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .page-main {
      display: flex;
      padding-bottom: 10vh;
      .content-pane {
        width: 75%;
        position: relative;
        .el-form {
          .bgWhite {
            background-color: #fff;
            padding: 0% 3% 5%;
            border: 1px solid rgb(224, 224, 224);

            h3 {
              padding: 10px 0;
              margin-bottom: 20px;
              border-bottom: 1px solid rgb(221, 220, 220);
              &::before {
                content: "";
                border-color: transparent transparent transparent #999999;
                border-style: dashed solid dashed dashed;
                border-width: 6px 6px 6px 6px;
                width: 0;
                height: 0;
                display: inline-block;
                vertical-align: revert;
              }
            }
          }
          .md-editor {
            margin-bottom: 22px;
            height: 408px;
          }
          .el-form-item {
            .el-form-item__label {
              line-height: 1.5;
              font-weight: bold;
            }
          }
          .clearfix {
            padding-top: 15px;
            .el-form-item__content {
              float: right;
              display: flex;
              justify-content: space-between;
              width: 30%;
              .el-button {
                margin-left: auto;
              }
              .el-button:nth-of-type(1) {
                background-color: #999;
                border-color: #999;
                &:hover {
                  background-color: rgb(182, 182, 182);
                }
              }
            }
          }
          .clear {
            clear: both;
          }
          p {
            font-size: 0.8em;
            margin-top: -8px;
            color: #999;
            padding-bottom: 15px;
          }
        }
        .md-editors {
          margin-bottom: 22px;
          // float: left;
          width: 880px;
        }
      }
      .content-right {
        width: 25%;
        padding-left: 15px;
        box-sizing: border-box;

        .title {
          font-weight: bold;
          font-size: 1.1em;
          margin-bottom: 10px;
        }

        .category {
          width: 100%;
          height: 500px;
          box-sizing: border-box;
          overflow: hidden;
          padding: 15px;
          background-color: #fff;
          overflow-y: auto;
          div {
            padding: 5px 0;
            font-size: 1.1em;
          }
        }
      }
    }
  }
}
</style>
