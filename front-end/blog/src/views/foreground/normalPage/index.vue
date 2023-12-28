<template>
  <div id="article-main">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 22, offset: 1 }" :xs="24">
          <div class="article-header">
            <div class="photo">
              <el-image :src="article.photo" fit="cover">
                <template #error>
                  <div class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="pageview">
              <div class="primary">
                <p>
                  {{ article.title }}
                </p>
                <p>浏览 {{ article?.pageview }} | 评论 {{ commentSumber }}</p>
              </div>
            </div>
          </div>
          <div class="article-author">
            <el-image
              :src="isArticleShow ? article?.user?.userInfo?.face : ''"
              fit="cover"
            ></el-image>
            <p>
              {{ isArticleShow ? article?.user?.userInfo?.nickName : "" }}
            </p>
            <p>
              {{ article?.createDate }}
            </p>
          </div>

          <div class="article-text">
            <div v-html="article?.content"></div>

            <blockquote class="moe-post-card-copy">
              本文作者：{{
                isArticleShow ? article?.user?.userInfo?.nickName : ""
              }}<br />
              本文链接：<a :href="articleLink" data-pjax-state>{{
                articleLink
              }}</a
              ><br />
              最后修改时间：{{ article?.updateDate }}<br />
              本站未注明转载的文章均为原创，并采用
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                target="_blank"
                >CC BY-NC-SA 4.0</a
              >
              授权协议，转载请注明来源，谢谢！
            </blockquote>
          </div>

          <div v-if="false" class="article-comment" id="article-comments">
            <div class="comment-header">
              <p class="title">评论</p>
              <p class="smail-title">
                与本文无关评论请发留言板。请不要水评论，谢谢。
              </p>
            </div>
            <el-form
              label-position="top"
              label-width="80px"
              :model="formLabelAlign"
              class="clearfix"
              ref="validateForm"
            >
              <div class="item">
                <el-form-item
                  prop="comments"
                  label="留下你成为大佬的想法吧"
                  :rules="{
                    required: true,
                    message: '评论内容不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input
                    style="display: none"
                    type="textarea"
                    :rows="1"
                    placeholder=""
                    v-model="formLabelAlign.comments"
                  >
                  </el-input>
                  <div class="el-textarea">
                    <div
                      id="textarea"
                      tabindex="0"
                      ref="comments"
                      contenteditable="true"
                      @focus="revise($event, 'focus')"
                      @blur="revise($event, 'blur')"
                      @keyup="makeExpandingArea()"
                    ></div>
                  </div>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item
                  prop="niceName"
                  label="昵称"
                  :rules="[
                    {
                      required: true,
                      message: '昵称不能为空',
                      trigger: 'blur'
                    },
                    {
                      min: 3,
                      max: 255,
                      message: '长度在 3 到 255 个字符',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    v-model="formLabelAlign.niceName"
                    placeholder=""
                    @focus="revise($event, 'focus')"
                    @blur="revise($event, 'blur')"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item
                  prop="email"
                  label="邮箱(保密)"
                  :rules="[
                    {
                      required: true,
                      message: '请输入邮箱地址',
                      trigger: 'blur'
                    },
                    {
                      max: 255,
                      type: 'email',
                      message: '请输入正确的邮箱地址',
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                  <el-input
                    v-model="formLabelAlign.email"
                    placeholder=""
                    @focus="revise($event, 'focus')"
                    @blur="revise($event, 'blur')"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="clear"></div>
              <el-form-item>
                <el-button type="primary" title="发送评论" @click="submitForm()"
                  ><i class="iconfont iconfasong"></i
                ></el-button>
              </el-form-item>
            </el-form>
          </div>

          <div v-if="false" class="article-commentList">
            <div class="comment-header">
              <p class="title">评论列表</p>
              <p class="smail-title">
                {{ commentSumber ? `已有${commentSumber}条评论` : "暂无评论" }}
              </p>
            </div>
            <div class="comment-list">
              <div class="comment-box">
                <div
                  class="comment-box-wrap"
                  v-for="(item, index) in article.comments"
                  :key="index"
                >
                  <div class="avatar">
                    <img :src="item.faceUrl" alt="头像" />
                  </div>
                  <div class="comments-content">
                    <div class="author">
                      <a
                        :href="item.link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ item.nickName }}
                      </a>
                    </div>
                    <div class="time">
                      {{
                        getdateFormat(item.createDate, "yyyy-MM-dd hh:mm:ss")
                      }}
                    </div>

                    <div class="textBox">
                      <div v-html="item.comments"></div>
                    </div>
                  </div>
                  <div class="reply">
                    <a
                      href="javascript:void(0)"
                      @click="changeCommentFlag(item.nickName, item.uuid)"
                    >
                      <button>回复</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dateFormat from "@/assets/js/dateFormat.js";
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  watch
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElNotification, ElLoading } from "element-plus";
import { marked } from "marked";
import { getArticleInfoApi, addPageViewsApi } from "@/utils/api/article";
import { createCommentApi } from "@/utils/api/comment";

const router = useRouter();
const { proxy }: any = getCurrentInstance();
const store = useStore();

// vue2.x的data参数

const uuid = ref<any>();
const article = ref<any>({});
const articleLink = ref<string>(
  "http://" + location.host + router.currentRoute.value.path
);
const isArticleShow = ref<boolean>(false);
const formLabelAlign = reactive({
  niceName: "",
  email: "",
  comments: ""
});

/**
 * 评论条数
 */
const commentSumber = computed(() => {
  if ((article as any).comments) {
    return (article as any).comments.length;
  } else {
    return 0;
  }
});

// 方法
/**
 * 获取文章内容
 */
const getArticleInfo = (uuid: string) => {
  const loading = ElLoading.service({ fullscreen: true });
  getArticleInfoApi({ articleUuid: uuid })
    .then((res: any) => {
      console.log(res);
      document.title = res.result.article.title;
      store.commit("foreground/setArticle", res.result.article);
      res.result.article.createDate = dateFormat(
        res.result.article.createDate,
        "yyyy年MM月dd日"
      );
      res.result.article.updateDate = dateFormat(
        res.result.article.updateDate,
        "yyyy-MM-dd hh:mm:ss"
      );
      article.value = res.result.article;
      (article.value as any).content = marked((article.value as any).content);
      isArticleShow.value = true;
      setArticlePageview(res.result.article.pageview);
      loading.close();
    })
    .catch((error: any) => {
      console.log(error);
      isArticleShow.value = false;
      loading.close();
    });
};
/**
 * 修改文章阅读数
 */
const setArticlePageview = (pageview: number) => {
  addPageViewsApi({
    articleUuid: uuid.value,
    articlePageview: pageview
  })
    .then((res: any) => {
      console.log(res);
    })
    .catch((error: any) => {
      console.log(error);
      isArticleShow.value = false;
    });
};
/**
 * 校验评论表单数据
 */
const submitForm = () => {
  proxy.$refs.validateForm.validate((valid: any) => {
    if (valid) {
      createComments();
    } else {
      ElNotification({
        title: "错误",
        message: `请按格式填写数据`,
        type: "error"
      });
      return false;
    }
  });
};
/**
 * 创建评论
 */
const createComments = () => {
  const loading = ElLoading.service({ fullscreen: true });
  createCommentApi({
    ip: "",
    agent: navigator.userAgent,
    email: formLabelAlign.email,
    nickName: formLabelAlign.niceName,
    comments: formLabelAlign.comments,
    articleUuid: (article.value as any).uuid,
    link: articleLink.value
  })
    .then((res: any) => {
      console.log(res);
      loading.close();
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: `评论成功！`,
          type: "success"
        });

        formLabelAlign.email = "";
        formLabelAlign.comments = "";
        formLabelAlign.niceName = "";
        proxy.$refs.comments.innerText = "";
        getArticleInfo(uuid.value);
      } else {
        ElNotification({
          title: "失败",
          message: res.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      loading.close();
    });
};
/**
 * 输入框自动高度
 */
const makeExpandingArea = () => {
  // 控制输入框自动高度
  const text: any = document.getElementById("textarea");
  text.style.height = "auto";
  text.scrollTop = 0;
  text.style.height = text.scrollHeight + "px";
  formLabelAlign.comments = text?.innerHTML;
};
/**
 * 提示文字上移
 */
const revise = (e: any, type: string) => {
  const formItem =
    e.target.parentElement.parentElement.parentElement.parentElement;
  switch (type) {
    case "focus":
      formItem.classList.add("not-empty");
      break;
    case "blur":
      if (e.target.value || e.target.innerText !== "") {
        formItem.classList.add("not-empty");
      } else {
        formItem.classList.remove("not-empty");
      }
      break;
    default:
      formItem.classList.remove("not-empty");
      break;
  }
};
/**
 * @评论
 */
const changeCommentFlag = (nickName: string, uuid: string) => {
  const comments: any = proxy.$refs.comments;
  comments.innerHTML = `<span contenteditable='false'>@${nickName}&nbsp;</span>`;
  comments.focus();
  const range = document.createRange();
  range.selectNodeContents(comments);
  range.collapse(false);
  const sel: any = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};
/**
 * 时间格式化
 */
const getdateFormat = (data: string, format: string) => {
  return dateFormat(data, format);
};

onBeforeMount(() => {
  // 挂载开始之前
  getArticleInfo(uuid.value);
});
onMounted(() => {
  // 挂载之后
});
watch(
  () => router.currentRoute.value.params.uuid,
  (newval: any) => {
    console.log(newval);
    uuid.value = newval;
    getArticleInfo(uuid.value);
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
#article-main {
  min-height: 47.8vh;
  padding: 20px 0;
  .content {
    .el-col {
      background-color: unset;
      .article-header {
        background-color: #fff;
        position: relative;
        .photo {
          min-height: 326px;
          .el-image {
            width: 100%;
            height: 326px;
            display: block;

            .image-slot {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              background: #f5f7fa;
              color: #909399;
              .el-icon-picture-outline {
                font-family: element-icons !important;
                font-size: 30px;
                font-style: normal;
                font-weight: 400;
                font-variant: normal;
                text-transform: none;
                line-height: 1;
                vertical-align: baseline;
                display: inline-block;
                -webkit-font-smoothing: antialiased;
              }
            }
          }
        }
        .pageview {
          background: rgba(0, 0, 0, 0.3);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .primary {
            color: #fff;
            padding-left: 20px;
            p:nth-of-type(1) {
              font-size: 1.5em;
              line-height: 1.5;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:nth-of-type(2) {
              font-size: 0.9em;
              color: rgba(230, 230, 230, 0.9);
              font-weight: normal;
            }
          }
        }
      }

      .article-author {
        background-color: rgba(230, 230, 230, 0.9);
        padding: 15px 20px;
        border-bottom: 1px solid rgb(172, 172, 172);
        .el-image {
          width: 40px;
          height: 40px;
          border-radius: 40px;
          float: left;
          transition: all 0.3s;
          &:hover {
            transform: scale(1.15) rotateZ(45deg);
          }
        }

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          opacity: 0.8;
          margin-left: 52px;
          font-weight: bold;
        }

        p:nth-of-type(2) {
          font-size: 14px;
          color: #6d6e6b;
          font-weight: 500;
        }
      }

      .article-text {
        background-color: rgba(230, 230, 230, 0.9);
        padding: 10px 15px;

        p {
          margin-bottom: 1.2em;
        }
        a {
          color: #e91e63;
          position: relative;
          overflow: hidden;
          word-break: break-all;
          &::after {
            content: "";
            width: 0;
            height: 1px;
            background: #e91e63;
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

        h1,
        h2 {
          position: relative;
          margin: 0.8em 0 0.6em;
          &::before {
            content: "#";
            font-weight: 700;
            padding-right: 10px;
            transition: all 0.29s;
            color: #e91e63;
          }
          &::after {
            left: 0;
            bottom: -8px;
            width: 100%;
            content: "";
            position: absolute;
            border-bottom: 1px solid #bdbdbd;
          }
        }
        pre {
          font-family: monospace, monospace;
          font-size: 1em;
          margin: 0.8em 0 0.6em;

          &::before {
            content: "";
            background: url("../../../assets/images/pre.png") 10px 10px / 40px
              no-repeat #2b2b2b;
            height: 32px;
            width: 100%;
            display: block;
            border-radius: 5px 5px 0 0;
          }

          code {
            box-sizing: border-box;
            border: 0;
            margin: 0;
            width: 100%;
            display: block;
            padding: 1em;
            font-size: 15px;
            overflow-x: auto;
            font-weight: 200;
            background: #2b2b2b;
            white-space: pre-wrap;
            font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
            color: #bababa;
            overflow: auto;
            max-height: 300px;
            border-radius: 0 0 5px 5px;

            ol {
              padding: 0;
              list-style: decimal;
              padding-left: unset !important;
              margin: 0 0 0 40px !important;
              li {
                white-space: pre;
                margin: 0 !important;
                padding: 5px !important;
                list-style: decimal-leading-zero;
                border-left: 1px solid #ddd !important;
                color: #bababa;
                .hljs-string {
                  color: #6a8759;
                }
                .hljs-bullet,
                .hljs-link,
                .hljs-literal,
                .hljs-number,
                .hljs-quote,
                .hljs-regexp {
                  color: #6896ba;
                }
                .hljs-attribute,
                .hljs-keyword,
                .hljs-name,
                .hljs-section,
                .hljs-selector-tag,
                .hljs-variable {
                  color: #cb7832;
                }
              }
            }
          }
        }
        table {
          width: 100%;
          text-align: center;
          border-collapse: collapse;
          border-spacing: 0;
          thead,
          tbody {
            th {
              text-align: left;
              background: rgb(243, 240, 240);
              border: 1px solid rgb(167, 167, 167);
              padding: 5px 8px;
              word-break: break-all;
            }
            td {
              border: 1px solid rgb(167, 167, 167);
              padding: 5px 8px;
              word-break: break-all;
            }
          }
        }

        h3,
        h4 {
          margin: 0.8em 0 0.6em;
          border-left: 4px solid #e91e63;
          padding-left: 7px;
          line-height: 1.35;
          font-weight: 400;
        }
        blockquote {
          width: 90%;
          line-height: 1.5;
          background-color: rgba(66, 66, 66, 0.1);
          padding: 5px 5px 5px 16px;
          border-left: 3px solid rgb(255, 64, 129);
          margin: 3.5em auto 1em;
          a {
            color: rgb(255, 64, 129);
          }
        }
      }

      .article-comment {
        background-color: rgba(230, 230, 230, 0.9);
        margin-top: 20px;
        padding-bottom: 10px;
        .comment-header {
          padding: 25px 15px 0;
          p:nth-of-type(1) {
            font-size: 1.5em;
            font-weight: bold;
            line-height: 1.5;
          }
          p:nth-of-type(2) {
            padding-bottom: 30px;
            border-bottom: 1px solid rgb(172, 172, 172);
          }
        }

        .el-form {
          padding-top: 10px;

          .el-form-item {
            margin-bottom: 10px;
            .el-form-item__content {
              margin: 0 80px;
              textarea,
              #textarea,
              input {
                background: unset;
                border: unset;
                border-radius: unset;
                resize: none;
                border-bottom: 1px solid rgb(145, 145, 145);
                outline: unset;
                line-height: 1.8;
                &::placeholder {
                  color: #949694;
                }

                span {
                  padding: 3px;
                  border-radius: 5px;
                  color: rgb(233, 30, 99);
                  font-weight: bold;
                }
              }

              #textarea {
                padding: 0 8px;
              }

              textarea {
                overflow: hidden;
                height: auto;
              }

              button {
                margin-top: 30px;
                float: right;
                border-color: rgb(255, 64, 129);
                background-color: rgb(255, 64, 129);
                padding: 3px 20px;
                i {
                  font-size: 2em;
                }
              }
            }

            .el-form-item__label {
              margin: -20px 80px 0 83px;
              font-size: 16px;
              color: rgb(255, 64, 129);
              transition: all 0.3s;
              transform: translateY(55px);
            }
          }

          .not-empty {
            .el-form-item__label {
              color: rgb(128, 128, 128);
              transform: translateY(20px);
            }
          }

          .item:nth-of-type(2),
          .item:nth-of-type(3) {
            float: left;
            width: 50%;

            .el-form-item__content {
              input {
                border-bottom: 2px solid rgb(255, 64, 129);
                &::placeholder {
                  color: rgba(255, 64, 129, 0.9);
                }
              }
            }
          }

          .clear {
            clear: both;
          }
        }
      }

      .article-commentList {
        background-color: rgba(230, 230, 230, 0.9);
        margin-top: 20px;
        padding-bottom: 10px;
        .comment-header {
          padding: 25px 15px 0;
          p:nth-of-type(1) {
            font-size: 1.5em;
            font-weight: bold;
            line-height: 1.5;
          }
          p:nth-of-type(2) {
            padding-bottom: 30px;
            font-size: 1.1em;
            border-bottom: 1px solid rgb(172, 172, 172);
          }
        }

        .comment-list {
          .comment-box {
            .comment-box-wrap {
              display: flex;
              list-style: none;
              position: relative;
              align-items: center;
              padding: 10px 16px 20px 16px;
              &:hover .avatar {
                transform: scale(1.15);
              }
              .avatar {
                position: relative;
                transition: all 0.3s;
                img {
                  width: 45px;
                  height: 45px;
                  border-radius: 50%;
                }
              }

              .comments-content {
                margin-left: 10px;
                position: relative;
                flex-grow: 1;
                .author {
                  line-height: 1.8;
                  font-size: 15px;
                  font-weight: 500;
                  user-select: none;
                  a {
                    font-weight: bold;
                  }
                }
                .time {
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.7);
                }

                .textBox {
                  font-size: 16px;
                  font-weight: 500;
                  margin-top: 10px;
                  line-height: 1.3;
                  word-break: break-all;
                  word-wrap: break-word;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.85);
                  span {
                    padding: 3px;
                    border-radius: 5px;
                    color: rgb(233, 30, 99);
                    font-weight: bold;
                  }
                }
              }

              .reply {
                a {
                  padding: 5px 8px;
                  border-radius: 3px;
                  &:hover {
                    background-color: rgb(190, 190, 190);
                    &::after {
                      content: "";
                      width: 0 !important;
                    }
                  }
                }
                button {
                  border: 0;
                  background-image: unset;
                  background: unset;
                  color: #e91e63;
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
    }
  }

  a {
    color: #e91e63;
    position: relative;
    overflow: hidden;
    word-break: break-all;
    &::after {
      content: "";
      width: 0;
      height: 1px;
      background: #e91e63;
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

@media (max-width: 800px) {
  #article-main {
    .content {
      width: 100%;
      margin: 0 auto;
      .el-col {
        .article-text {
          table {
            thead,
            tbody {
              th {
                text-align: left;
                background: rgb(243, 240, 240);
                border: 1px solid rgb(167, 167, 167);
                padding: 3px 5px;
                word-break: break-all;
              }
              td {
                border: 1px solid rgb(167, 167, 167);
                padding: 3px 5px;
                word-break: break-all;
              }
            }
          }
        }
        .article-comment {
          .comment-header {
            padding: 25px 15px 0;
            p:nth-of-type(1) {
              font-size: 1.2em;
              font-weight: bold;
              line-height: 1.5;
            }
            p:nth-of-type(2) {
              padding-bottom: 30px;
              font-size: 13px;
              border-bottom: 1px solid rgb(172, 172, 172);
            }
          }

          .el-form {
            padding-top: 10px;

            .el-form-item {
              margin-bottom: 10px;
              .el-form-item__content {
                margin: 0 10px;
                textarea,
                input {
                  background: unset;
                  border: unset;
                  border-radius: unset;
                  resize: none;
                  border-bottom: 2px solid rgb(255, 64, 129);
                  &::placeholder {
                    color: rgba(255, 64, 129, 0.9);
                  }
                }

                textarea {
                  overflow: hidden;
                  height: auto;
                }

                button {
                  margin-top: 30px;
                  float: right;
                  border-color: rgb(255, 64, 129);
                  background-color: rgb(255, 64, 129);
                }
              }

              .el-form-item__label {
                margin: -20px 10px 0 13px;
                font-size: 16px;
                color: rgb(255, 64, 129);
                transition: all 0.3s;
                transform: translateY(55px);
              }
            }

            .not-empty {
              .el-form-item__label {
                color: rgb(255, 34, 107);
                transform: translateY(26px);
              }
            }

            .item:nth-of-type(2),
            .item:nth-of-type(3) {
              float: unset;
              width: 100%;
            }

            .clear {
              clear: both;
            }
          }
        }
        .article-commentList {
          .comment-header {
            padding: 25px 15px 0;
            p:nth-of-type(1) {
              font-size: 1.2em;
              font-weight: bold;
              line-height: 1.5;
            }
            p:nth-of-type(2) {
              padding-bottom: 30px;
              font-size: 13px;
              border-bottom: 1px solid rgb(172, 172, 172);
            }
          }
          .comment-list {
            .comment-box {
              .comment-box-wrap {
                .comments-content {
                  .textBox {
                    font-size: 15px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
