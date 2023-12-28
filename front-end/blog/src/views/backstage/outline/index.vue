<template>
  <div id="outline" :style="clientHeight">
    <div class="container">
      <div class="synopsis">
        <div class="title">
          <p>网站概要</p>
        </div>
        <div class="details">
          <p>
            目前有<span>{{ dataSummary?.articlesTotal }}</span> 篇文章, 并有
            <span>{{ dataSummary?.commentsTotal }}</span> 条关于你的评论在
            <span>{{ dataSummary?.categoriesTotal }}</span> 个分类中.
          </p>
          <p>点击下面的链接快速开始:</p>
          <p>
            <router-link
              to="/backstage/write/writingArticles"
              @click="changeIndex('/backstage/write/writingArticles')"
              >撰写新文章</router-link
            >
            <router-link
              to="/backstage/setting/basicSettings"
              v-if="user.role == 1"
              @click="changeIndex('/backstage/setting/basicSettings')"
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
            <div v-if="!aricleList.length" class="notDate">无数据</div>
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
                >:<span v-html="item.comments"></span>
              </div>
            </div>
            <div v-if="!commentList.length" class="notDate">无数据</div>
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
              <div class="head" @click="pushHome(item.title)">
                <a href="javascript:void(0)">{{ item.title }}</a>
              </div>
            </div>
            <div v-if="!categoryList.length" class="notDate">无数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="outline">
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { ElNotification } from "element-plus";
import dateFormat from "@/assets/js/dateFormat.js";
import { getUserArticleListApi } from "@/utils/api/article";
import { getuserCommentListApi } from "@/utils/api/comment";
import { getUserCategoryListApi } from "@/utils/api/category";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
const commentList = ref<Array<any>>([]);
const categoryList = ref<Array<any>>([]);
const aricleList = ref<Array<any>>([]);
const condition = computed({
  get: () => {
    return store.state.foreground.condition;
  },
  set: (val) => {
    store.commit("foreground/setCondition", val);
  }
});
const dataSummary = reactive({
  articlesTotal: 0,
  commentsTotal: 0,
  categoriesTotal: 0
});
const activeIndex = computed({
  get: () => {
    return store.state.backstage.activeIndex;
  },
  set: (val) => {
    store.commit("backstage/setActiveIndex", val);
  }
});
const clientHeight = computed(() => {
  let height: number = document.documentElement.clientHeight;
  height = height - 68;
  return "min-height:" + height + "px";
});
const user = ref<any>({});

// 获取用户文章
const getUserArticleList = (uuid: string) => {
  console.log(user.value);
  getUserArticleListApi({ userUuid: uuid, state: 1 })
    .then((res: any) => {
      console.log(res);
      for (const item of res.result.list) {
        item.createDate = dateFormat(item.createDate, "MM-dd");
      }
      aricleList.value = res.result.list;
      dataSummary.articlesTotal = res.result.page.totalRow;
      store.commit("backstage/setArticlesTotal", res.result.page.totalRow);
      // commentList.value = res.result.list;
    })
    .catch((err: any) => {
      console.log(err);
    });
};
const statisticalData: any = computed(
  () => store.state.backstage.statisticalData
);

/**
 * 获取评论列表
 */
const getCommentList = (uuid: string) => {
  getuserCommentListApi({ userUuid: uuid })
    .then((res: any) => {
      console.log("评论列表1546465", res);
      if (res.code == "200") {
        for (const item of res.result.list) {
          item.createDate = dateFormat(item.createDate, "MM-dd");
        }
        dataSummary.commentsTotal = res.result.page.totalRow;
        commentList.value = res.result.list;
        store.commit("backstage/setCommentsTotal", res.result.page.totalRow);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

/**
 * 获取用户类别列表
 */
const getCategoryList = (uuid: string) => {
  getUserCategoryListApi({ userUuid: uuid })
    .then((res: any) => {
      console.log("类别列表", res);
      if (res.code == "200") {
        categoryList.value = res.result.list;
        dataSummary.categoriesTotal = res.result.page.totalRow;
        store.commit(
          "backstage/setClassificationsTotal",
          res.result.page.totalRow
        );
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

/**
 * 返回首页，并搜索
 */
const pushHome = (category: string) => {
  condition.value.currPage = 1;
  condition.value.categoryTitle = category;
  proxy.getAricleList(condition.value);
  router.push({ name: "index", params: { category } });
};
/**
 *
 */
const changeIndex = (index: string) => {
  activeIndex.value = index;
};
onBeforeMount(() => {
  document.title = "概要";
  const temp = JSON.parse(proxy.$Cookies.get("user"));
  getCommentList(temp.uuid);
  getUserArticleList(temp.uuid);
  getCategoryList(temp.uuid);
  user.value = temp;
});
onMounted(() => {
  condition.value.pageSize = 7;
  condition.value.currPage = 1;
  condition.value.state = 1;
  condition.value.categoryTitle = "";
  proxy.getAricleList(condition.value, "MM-dd");
});
</script>

<style lang="scss">
#outline {
  background-color: #f6f6f3;

  min-height: 93vh;
  .container {
    width: 95%;
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
              height: 1.2em;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #444;
              span {
                color: #499bc3;
                span {
                  color: rgb(233, 30, 99);
                  cursor: pointer;
                }
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
          .notDate{
            color: #999;
            font-size: 13px;
            padding-left: 30px;
            font-family: 'Courier New', Courier, monospace;
          }
        }
      }
    }
  }
}
</style>
