<template>
  <div id="outline" :style="clientHeight">
    <div class="container">
      <div class="synopsis">
        <div class="title">
          <p>网站概要</p>
        </div>
        <div class="details">
          <p>
            目前有 <span>{{ dataSummary?.articlesTotal }}</span> 篇文章, 并有
            <span>{{ dataSummary?.commentsTotal }}</span> 条关于你的评论在
            <span>{{ dataSummary?.categoriesTotal }}</span> 个分类中.
          </p>
          <p>点击下面的链接快速开始:</p>
          <p>
            <router-link
              to="/backstage/writingArticles"
              @click="methods.changeIndex('/backstage/writingArticles')"
              >撰写新文章</router-link
            >
            <router-link
              to="/backstage/basicSettings"
              @click="methods.changeIndex('/backstage/basicSettings')"
              >系统设置</router-link
            >
          </p>
        </div>
      </div>
      <div class="complementary">
        <div class="article">
          <div class="title">
            <p>最近发布的文章</p>
          </div>
          <div class="content">
            <div class="item" v-for="(item, index) in aricleList" :key="index">
              <div class="date">{{ item.createDate }}</div>
              <div class="head">
                <router-link :to="`/home/article/${item.uuid}`">{{
                  item.title
                }}</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="comments">
          <div class="title">
            <p>最近得到的回复</p>
          </div>
          <div class="content">
            <div class="item" v-for="(item, index) in commentList" :key="index">
              <div class="date">{{ item.createDate }}</div>
              <div class="head">
                <a :href="item.link">{{ item.nickName }}</a
                >:{{ item.comments }}
              </div>
            </div>
          </div>
        </div>
        <div class="category">
          <div class="title">
            <p>最近新增的分类</p>
          </div>
          <div class="content">
            <div
              class="item"
              v-for="(item, index) in categoryList"
              :key="index"
            >
              <div class="date">{{ item.createDate }}</div>
              <div class="head" @click="methods.pushHome(item.title)">
                <a href="javascript:void(0)">{{ item.title }}</a>
              </div>
            </div>
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
import { ElNotification } from "element-plus";
import dateFormat from "/@/assets/js/dateFormat.js";
export default defineComponent({
  name: "outline",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      commentList: [],
      categoryList: computed(() => store.state.backstage.categoryList),
      aricleList: computed(() => store.state.foreground.articleLists),
      condition: computed({
        get: () => {
          return store.state.foreground.condition;
        },
        set: (val) => {
          store.commit("foreground/setCondition", val);
        },
      }),
      dataSummary: computed({
        get: () => {
          return store.state.backstage.dataSummary;
        },
        set: (val) => {
          store.commit("backstage/setDataSummary", val);
        },
      }),
      activeIndex: computed({
        get: () => {
          return store.state.backstage.activeIndex;
        },
        set: (val) => {
          store.commit("backstage/setActiveIndex", val);
        },
      }),
      clientHeight: computed(() => {
        let height: number = document.documentElement.clientHeight;
        height = height - 68;
        return "min-height:" + height + "px";
      }),
    });
    const methods = {
      /**
       * 获取评论列表
       */
      getCommentList() {
        proxy.$axios
          .get("/comment/list", {})
          .then((res: any) => {
            console.log(res);
            for (const item of res.result.list) {
              item.createDate = dateFormat(item.createDate, "MM-dd");
            }
            state.commentList = res.result.list;
          })
          .catch((err: any) => {
            console.log(err);
          });
      },
      /**
       * 返回首页，并搜索
       */
      pushHome(category: string) {
        state.condition.currPage = 1;
        state.condition.categoryTitle = category;
        proxy.getAricleList(state.condition);
        router.push({ name: "index", params: { category } });
      },
      /**
       *
       */
      changeIndex(index: string) {
        state.activeIndex = index;
      },
    };
    onBeforeMount(() => {
      document.title = "概要";
    });
    onMounted(() => {
      state.condition.pageSize = 7;
      state.condition.currPage = 1;
      state.condition.state = 1;
      state.condition.categoryTitle = "";
      proxy.getAricleList(state.condition, "MM-dd");
      methods.getCommentList();
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#outline {
  background-color: #f6f6f3;

  min-height: 93vh;
  .container {
    width: 70%;
    margin: 0 auto;
    .synopsis {
      .title {
        padding: 1.5% 0 2%;
        p {
          font-size: 20px;
          font-weight: bold;
          color: #444;
        }
      }

      .details {
        padding-bottom: 3%;
        border-bottom: 1px solid rgba(212, 101, 101, 0.1);
        p {
          font-size: 17px;
          color: #999;
          line-height: 1.5;
          span {
            color: #444;
            font-size: 2em;
            font-style: normal;
            font-family: Georgia, serif;
          }

          a {
            color: #444;
            margin-right: 1.5%;
          }
        }

        p:last-child {
          display: flex;
          padding-top: 1.5%;
          color: #499bc3;

          a {
            position: relative;
            color: #499bc3;
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
      }
    }

    .complementary {
      display: flex;
      padding-top: 3%;
      .article,
      .comments,
      .category {
        width: 33.3%;
        .title {
          p {
            font-size: 17px;
            font-weight: bold;
            color: #444;
          }
        }

        .content {
          padding-top: 2%;
          .item {
            display: flex;
            .date {
              font-size: 14px;
              color: #999;
              text-align: right;
              border-right: 1px solid #ececec;
              margin-right: 4px;
              padding-right: 8px;
              padding: 4px 8px 4px 0;
            }
            .head {
              width: 80%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #444;
              span {
                color: #499bc3;
              }
              a {
                position: relative;
                color: #499bc3;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

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
          }
        }
      }
    }
  }
}
</style>