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
                  @onHtmlChanged="methods.saveHtml"
                  @onSave="methods.saveValue"
                  @onUploadImg="methods.uploadImg"
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
                @click="methods.submitArticleForm('articleForm', true)"
              >
                保存草稿
              </el-button>
              <el-button
                type="primary"
                @click="methods.submitArticleForm('articleForm', false)"
              >
                发布文章
              </el-button>
            </el-form-item>
            <div class="clear"></div>
          </el-form>
        </div>
        <div class="content-right">
          <div class="title">分类</div>
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
  </div>
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
import dateFormat from "/@/assets/js/dateFormat.js";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ElNotification, ElLoading } from "element-plus";
export default defineComponent({
  name: "writingArticles",
  components: {
    MdEditor,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      // vue2.x的data参数
      content: "", // 富文本编辑框
      checkboxGroup: ["默认"],
      saveStatus: true,
      article: {
        title: "",
        content: "",
        photo: "http://localhost:3000/common/wallpaper",
        state: 1,
        abstract: "",
        pageview: 0,
        ishot: false,
        userUuid: computed(() => {
          if (proxy.$Cookies.get("user")) {
            const user = JSON.parse(proxy.$Cookies.get("user"));
            return user.uuid;
          }
          return "";
        }),
        categoryUuids: computed(
          () => store.state.backstage.categoryList[0].uuid
        ),
      },
      rulesArticle: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            max: 255,
            message: "最长为 255 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        photo: [{ required: true, message: "请输入链接", trigger: "blur" }],
        abstract: [
          { required: true, message: "请输入摘要", trigger: "blur" },
          {
            max: 255,
            message: "最长为 255 个字符",
            trigger: "blur",
          },
        ],
      },
      categoryList: computed(() => store.state.backstage.categoryList),
    });
    /**
     * 文章状态 （0已删除、1已发布、2草稿、3页面）
     */
    enum status {
      delete, // 删除
      release, // 发布
      draft, // 草稿
      page, // 页面
    }
    // .5s后再监听article对象的变化，
    setTimeout(() => {
      watch(
        () => state.article,
        (newValue: any, oldValue: any) => {
          console.log(newValue);
          console.log(oldValue);
          state.saveStatus = false;
        },
        {
          deep: true, // 深度监听的参数
        }
      );
    }, 500);
    watch(
      () => state.saveStatus,
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
      () => [...state.checkboxGroup],
      (newValue: any, oldValue: any) => {
        if (newValue.length === 0) {
          state.article.categoryUuids = state.categoryList[0].uuid;
          return;
        }
        const categoryUuidList: string[] = [];
        for (const temp of [...newValue]) {
          categoryUuidList.push(
            [...state.categoryList].filter((item: any) => {
              return item.title === temp;
            })[0].uuid
          );
        }
        state.article.categoryUuids = categoryUuidList.join(",");
      }
      // { deep: true }对象用法
    );

    const methods = {
      /**
       * 保存当前装换的html字段
       */
      saveHtml(html: string) {
        console.log(html);
        state.article.content = state.content;
      },
      /**
       * 保存当前数据
       */
      saveValue(v: string) {
        console.log(v);
        state.saveStatus = true;
        methods.submitArticleForm("articleForm", true);
      },
      /**
       * 上传图片文件
       */
      async uploadImg(files: FileList, callback: (urls: string[]) => void) {
        const res = await Promise.all(
          Array.from(files).map((file) => {
            console.log(file);
            return new Promise((rev, rej) => {
              const data = new FormData();
              data.append("files", file);
              proxy.$axios
                .post("/common/enclosure", data)
                .then((resp: any) => rev(resp))
                .catch((error: any) => rej(error));
            });
          })
        );
        console.log(res);
        callback(res.map((item: any) => item.result.fileList[0].absoluteUrl));
      },
      /**
       * 提交表单
       */
      submitArticleForm(formName: string, isdraft: boolean) {
        state.saveStatus = true;
        if (state.article.abstract === "") {
          state.article.abstract = state.content.substr(0, 100);
        }
        proxy.$refs[formName].validate((valid: any) => {
          if (isdraft) {
            state.article.state = status.draft;
          } else {
            state.article.state = status.release;
          }

          if (valid && state.article.content !== "") {
            if (router.currentRoute.value.params.uuid) {
              methods.updateArticle(isdraft);
            } else {
              methods.createArticle(isdraft);
            }
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
      createArticle(isdraft: boolean) {
        proxy.$axios
          .post("/article/create", state.article)
          .then((res: any) => {
            console.log(res);
            if (res.code === "200") {
              if (isdraft) {
                ElNotification({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                });
              } else {
                ElNotification({
                  title: "成功",
                  message: "文章创建成功",
                  type: "success",
                });
                state.saveStatus = true;
                // 跳转到文章列表页面
                setTimeout(() => {
                  router.push({ name: "articleList" });
                  store.commit(
                    "backstage/setActiveIndex",
                    "/backstage/articleList"
                  );
                }, 1000);
              }
            } else {
              state.saveStatus = false;
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
      },
      updateArticle(isdraft: boolean) {
        proxy.$axios
          .put("/article/update", { article: state.article })
          .then((res: any) => {
            console.log(res);
            if (res.code === "200") {
              state.saveStatus = true;
              if (isdraft) {
                ElNotification({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                });
              } else {
                ElNotification({
                  title: "成功",
                  message: "文章修改成功",
                  type: "success",
                });
                // 跳转到文章列表页面
                setTimeout(() => {
                  router.push({ name: "articleList" });
                  store.commit(
                    "backstage/setActiveIndex",
                    "/backstage/articleList"
                  );
                }, 1000);
              }
            } else {
              state.saveStatus = false;
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
      },
      /**
       * 获取文章内容
       */
      getArticleInfo(uuid: any) {
        const loading = ElLoading.service({ fullscreen: true });
        proxy.$axios
          .get("/article/info", { articleUuid: uuid })
          .then((res: any) => {
            console.log(res);
            document.title = "编辑" + res.result.article.title;
            res.result.article.createDate = dateFormat(
              res.result.article.createDate,
              "yyyy年MM月dd日"
            );
            res.result.article.updateDate = dateFormat(
              res.result.article.updateDate,
              "yyyy-MM-dd hh:mm:ss"
            );
            state.article = {
              title: res.result.article.title,
              content: res.result.article.content,
              photo: res.result.article.photo,
              state: res.result.article.state,
              abstract: res.result.article.abstract,
              pageview: res.result.article.pageview,
              ishot: res.result.article.ishot,
              userUuid: res.result.article.user.uuid,
              categoryUuids: "",
            };
            (state.article as any).uuid = res.result.article.uuid;
            const list: string[] = [];
            const list2: string[] = [];
            for (const item of res.result.article.categories) {
              console.log(item);
              list.push(item.uuid);
              list2.push(item.title);
            }
            state.article.categoryUuids = list.join(",");
            state.checkboxGroup = list2;

            //  res.result.article;
            state.content = res.result.article.content;
            loading.close();
          })
          .catch((error: any) => {
            console.log(error);
            loading.close();
          });
      },
    };
    onBeforeMount(() => {
      // 挂载之前
      document.title = "撰写文章";
    });
    onMounted(() => {
      // 挂载之后
      if (!proxy.$Cookies.get("accessToken")) {
        router.push({ name: "login" });
      }

      // 如果路由中携带有文章的uuid，默认认为是修改文章
      if (router.currentRoute.value.query.uuid) {
        const paramsUuid = router.currentRoute.value.query.uuid;
        methods.getArticleInfo(paramsUuid);
      }
    });
    // 单页面导航守卫
    onBeforeRouteLeave((to, from, next) => {
      if (!state.saveStatus) {
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
            "/backstage/writingArticles"
          );
          next(false);
        }
      } else {
        window.onbeforeunload = null;
        next(true);
      }
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
  destroyed() {
    // 清除窗口绑定事件
    window.onbeforeunload = null;
  },
});
</script>

<style lang="scss">
#writingArticles {
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
        }

        .category {
          width: 100%;
          height: 51vh;
          box-sizing: border-box;
          overflow: hidden;
          padding: 15px;
          background-color: #fff;
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