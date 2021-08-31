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
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="article.title"></el-input>
            </el-form-item>
            <el-form-item>
              <md-editor
                v-model="content"
                @onHtmlChanged="methods.saveHtml"
                @onSave="methods.saveValue"
                @onUploadImg="methods.uploadImg"
                :preview="false"
              />
            </el-form-item>
            <div class="bg">
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
              <el-form-item label="文章封面图" prop="photo">
                <el-input v-model="article.photo"></el-input>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                @click="methods.submitWebConfigForm('webConfigForm')"
              >
                保存草稿
              </el-button>
              <el-button
                type="primary"
                @click="methods.submitWebConfigForm('webConfigForm')"
              >
                发布文章
              </el-button>
            </el-form-item>
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
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "home",
  components: {
    MdEditor,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      // vue2.x的data参数
      content: "",// 富文本编辑框
      checkboxGroup: ['默认'],
      article: {
        title: "",
        content: "",
        photo: "",
        state: "1",
        abstract: "",
        pageview: 0,
        ishot: false,
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
        photo: [{ required: false, message: "请输入链接", trigger: "blur" }],
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

    const methods = {
      saveHtml(html: string) {
        console.log(html);
        state.article.content = html;
      },
      saveValue(v: string) {
        console.log(v);
        ElNotification({
          title: "成功",
          message: "保存成功",
          type: "success",
        });
      },
      async uploadImg(files: FileList, callback: (urls: string[]) => void) {
        const res = await Promise.all(
          Array.from(files).map((file) => {
            return new Promise((rev, rej) => {
              proxy.$axios
                .post("/common/enclosure", {
                  files: file,
                })
                .then((resp: any) => rev(resp))
                .catch((error: any) => rej(error));
            });
          })
        );
        callback(res.map((item: any) => item.result.url));
      },
    };
    onBeforeMount(() => {
      // 挂载之前
      document.title = "撰写文章";
    });
    onMounted(() => {
      // 挂载之后
    });

    return {
      ...toRefs(state),
      methods,
    };
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
      .content-pane {
        width: 75%;
        .el-form {
          .bg {
            background-color: #fff;
            padding: 0% 3% 5%;

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
      .content-right {
        width: 25%;
        padding-left: 15px;
        box-sizing: border-box;

        .title {
          font-weight: bold;
          font-size: 1.10em;
        }

        .category {
          width: 100%;
          height: 51vh;
          box-sizing: border-box;
          overflow: hidden;
          padding: 15px;
          background-color: #fff;
          div{
            padding: 5px 0;
            font-size: 1.05rem;
          }
        }
      }
    }
  }
}
</style>