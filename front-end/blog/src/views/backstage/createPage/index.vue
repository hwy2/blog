<template>
  <div id="createPage">
    <div class="container">
      <div class="page-title">
        <h2>{{ article?.title ? article?.title : "创建新页面" }}</h2>
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
              <!-- <el-button
                type="primary"
                @click="submitArticleForm('articleForm', true)"
              >
                保存草稿
              </el-button> -->
              <el-button
                type="primary"
                @click="submitArticleForm('articleForm', false)"
              >
                {{ paramsUuid ? "修改页面" : "发布页面" }}
              </el-button>
            </el-form-item>
            <div class="clear"></div>
          </el-form>
        </div>
        <div class="content-right">
          <div class="order">
            <div class="title">页面顺序</div>
            <el-input v-model="article.pageOrder"></el-input>
          </div>
          <div class="custom">
            <div class="title">自定义模板</div>
            <el-select v-model="article.template" placeholder="请选择">
              <el-option label="不选择" :value="0"></el-option>
              <el-option label="归档页" :value="1"></el-option>
              <el-option label="友链页" :value="2"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="createPage">
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
import { ElNotification, ElLoading } from "element-plus";
import { commonEnclosureApi } from "@/utils/api/common";
import {
  createArticleApi,
  updateArticleApi,
  getArticleInfoApi
} from "@/utils/api/article";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
// vue2.x的data参数
const content = ref<string>(""); // 富文本编辑框
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
  pageOrder: 0,
  template: 0,
  categoryUuids: "",
  uuid: ""
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
    { required: false, message: "请输入摘要", trigger: "blur" },
    {
      max: 255,
      message: "最长为 255 个字符",
      trigger: "blur"
    }
  ]
});
const categoryList = ref<Array<any>>([]);
const paramsUuid = ref();
const user = ref<any>({});
/**
 * 文章状态 （0已删除、1已发布、2草稿、3页面）
 */
enum status {
  delete, // 删除
  release, // 发布
  draft, // 草稿
  reviewed, // 审核
  page // 页面
}
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
        commonEnclosureApi(data)
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
  isdraft ? (article.state = status.draft) : (article.state = status.page);

  if (article.abstract === "") {
    article.abstract = content.value.substr(0, 100);
  }
  if (article.template !== 0) {
    rulesArticle.abstract[0].required = false;
    rulesArticle.content[0].required = false;
  }
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      if (paramsUuid.value) {
        updateArticle(article, isdraft);
      } else {
        createArticle(article, isdraft);
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
/**
 * 创建页面
 */
const createArticle = (article: any, isdraft: boolean) => {
  console.log("创建");
  article.userUuid = user.value.uuid;
  createArticleApi(article)
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
            message: "页面创建成功",
            type: "success"
          });
          // 跳转到文章列表页面
          setTimeout(() => {
            router.push({ name: "pageList" });
            store.commit("backstage/setActiveIndex", "/backstage/pageList");
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
 * 更新页面
 */
const updateArticle = (article: any, isdraft: boolean) => {
  // return
  updateArticleApi({ article: article })
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
            message: "页面修改成功",
            type: "success"
          });
          // 跳转到文章列表页面
          setTimeout(() => {
            router.push({ name: "pageList" });
            store.commit("backstage/setActiveIndex", "/backstage/pageList");
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
  getArticleInfoApi({ articleUuid: uuid })
    .then((res: any) => {
      console.log("info", res.result.article);
      document.title = "编辑" + res.result.article.title;
      res.result.article.createDate = dateFormat(
        res.result.article.createDate,
        "yyyy年MM月dd日"
      );
      res.result.article.updateDate = dateFormat(
        res.result.article.updateDate,
        "yyyy-MM-dd hh:mm:ss"
      );
      article.uuid = res.result.article.uuid;
      article.title = res.result.article.title;
      article.content = res.result.article.content;
      article.photo = res.result.article.photo;
      article.state = res.result.article.state;
      article.abstract = res.result.article.abstract;
      article.pageview = res.result.article.pageview;
      article.ishot = res.result.article.ishot;
      article.userUuid = res.result.article.user.uuid;
      article.pageOrder = res.result.article.pageOrder;
      article.template = res.result.article.template;
      article.categoryUuids = res.result.article.categories[0].uuid;
      content.value = res.result.article.content;
      loading.close();
    })
    .catch((error: any) => {
      console.log(error);
      loading.close();
    });
};

onBeforeMount(() => {
  // 挂载之前
  categoryList.value = store.state.backstage.categoryList;
  user.value = JSON.parse(proxy.$Cookies.get("user"));
  article.userUuid = user.value.uuid;
  article.categoryUuids = categoryList.value[0].uuid;
  document.title = "创建页面";
});
onMounted(() => {
  // 挂载之后
  if (!proxy.$Cookies.get("accessToken")) {
    router.push({ name: "login" });
  }

  // 如果路由中携带有文章的uuid，默认认为是修改文章
  if (router.currentRoute.value.query.uuid) {
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
      store.commit(
        "backstage/setActiveIndex",
        "/backstage/setting/basicSettings"
      );
      next(false);
    }
  } else {
    window.onbeforeunload = null;
    next(true);
  }
});
onBeforeUnmount(() => {
  // 清除窗口绑定事件
  window.onbeforeunload = null;
});
</script>

<style lang="scss">
#createPage {
  height: calc(100vh - 60px);
  overflow: auto;
  width: 100%;
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
              // .el-button:nth-of-type(1) {
              //   background-color: #999;
              //   border-color: #999;
              //   &:hover {
              //     background-color: rgb(182, 182, 182);
              //   }
              // }
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

        .order,
        .custom {
          padding-bottom: 20px;
          .title {
            font-weight: bold;
            font-size: 0.9em;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
