<template>
  <div id="postIndex">
    <el-container>
      <el-main>
        <div class="content">
          <div class="main">
            <el-scrollbar height="">
              <el-row>
                <el-col
                  :md="{ span: 14, offset: 5 }"
                  :xs="{ span: 22, offset: 1 }"
                  v-if="search.categoryFlag || search.searchFlag"
                >
                  <el-card shadow="hover">
                    <div class="items items-hint">
                      <div class="search-hint" v-if="search.categoryFlag">
                        <p>
                          分类&emsp;<span>{{ search.words }}</span
                          >&emsp;下的文章
                        </p>
                      </div>
                      <div class="search-hint" v-if="search.searchFlag">
                        <p>
                          包含关键字&emsp;<span>{{ search.words }}</span
                          >&emsp;的文章
                        </p>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                <el-col
                  :md="{ span: 24, offset: 0 }"
                  :xs="24"
                  v-for="(item, index) in articleStickyList"
                  :key="item.uuid"
                >
                  <!-- <router-link :to="{name:'article',params:{uuid:item.uuid}}"> -->
                  <div
                    class="item"
                    @click.stop="jumpArticle(item.uuid, index)"
                    ref="itemRef"
                  >
                    <div
                      class="photo"
                      :style="{ display: isOpenCoverImage ? 'block' : 'none' }"
                    >
                      <img
                        :src="item.photo + '?t=' + new Date().getTime() + index"
                        alt="photo"
                      />
                    </div>
                    <div class="aricle">
                      <div class="article-header">
                        <div class="photo">
                          <el-image :src="item.photo" fit="cover">
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
                              {{ item.title }}
                            </p>
                            <p>
                              <i class="iconfont iconyanjing-"></i> 浏览
                              {{ item?.pageview }} |
                              <i class="iconfont iconpinglun"></i> 评论
                              {{ item.comments.length }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="article-author">
                        <el-image
                          :src="item?.user?.userInfo?.face"
                          fit="cover"
                        ></el-image>
                        <p>
                          {{ item?.user?.userInfo?.nickName }}
                        </p>
                        <p>
                          {{ item?.createDate }}
                        </p>
                      </div>

                      <div class="article-text">
                        <div v-html="item?.content"></div>
                      </div>
                    </div>
                    <div class="aricleTitle">
                      <div class="left-icon">
                        <i class="iconfont icon58pinglun"></i>
                      </div>
                      <h2><span>【置顶】</span>{{ item.title }}</h2>
                      <div class="abstract">
                        <p>
                          {{ item.abstract }}
                        </p>
                      </div>
                      <div class="divider"></div>
                      <div class="userInfo">
                        <i class="iconfont iconren"></i>
                        <span>{{ item.user.userInfo.nickName }}</span>
                        <i class="iconfont iconshijian"></i>
                        <span>{{ item.createDate }}</span>
                        <i class="iconfont iconpinglun"></i>
                        <span>评论 {{ item.comments.length }}</span>
                        <i class="iconfont iconyanjing-"></i>
                        <span>浏览 {{ item.pageview }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- </router-link> -->
                </el-col>
                <el-col
                  :md="{ span: 24, offset: 0 }"
                  :xs="24"
                  v-for="(item, index) in aricleList"
                  :key="item.uuid"
                >
                  <!-- <router-link :to="{name:'article',params:{uuid:item.uuid}}"> -->
                  <div
                    class="item"
                    @click.stop="jumpArticle(item.uuid, index)"
                    ref="itemRef"
                  >
                    <div
                      class="photo"
                      :style="{ display: isOpenCoverImage ? 'block' : 'none' }"
                    >
                      <img
                        :src="item.photo + '?t=' + new Date().getTime() + index"
                        alt="photo"
                      />
                    </div>
                    <div class="aricle">
                      <div class="article-header">
                        <div class="photo">
                          <el-image :src="item.photo" fit="cover">
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
                              {{ item.title }}
                            </p>
                            <p>
                              <i class="iconfont iconyanjing-"></i> 浏览
                              {{ item?.pageview }} |
                              <i class="iconfont iconpinglun"></i> 评论
                              {{ item.comments.length }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="article-author">
                        <el-image
                          :src="item?.user?.userInfo?.face"
                          fit="cover"
                        ></el-image>
                        <p>
                          {{ item?.user?.userInfo?.nickName }}
                        </p>
                        <p>
                          {{ item?.createDate }}
                        </p>
                      </div>

                      <div class="article-text">
                        <div v-html="item?.content"></div>
                      </div>
                    </div>
                    <div class="aricleTitle">
                      <div class="left-icon">
                        <i class="iconfont icon58pinglun"></i>
                      </div>
                      <h2>{{ item.title }}</h2>
                      <div class="abstract">
                        <p>
                          {{ item.abstract }}
                        </p>
                      </div>
                      <div class="divider"></div>
                      <div class="userInfo">
                        <i class="iconfont iconren"></i>
                        <span>{{ item.user.userInfo.nickName }}</span>
                        <i class="iconfont iconshijian"></i>
                        <span>{{ item.createDate }}</span>
                        <i class="iconfont iconpinglun"></i>
                        <span>评论 {{ item.comments.length }}</span>
                        <i class="iconfont iconyanjing-"></i>
                        <span>浏览 {{ item.pageview }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- </router-link> -->
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <div class="paging">
            <el-pagination
              @current-change="handleChangePage"
              v-model:current-page="condition.currPage"
              :hide-on-single-page="hidePage"
              :page-size="condition.pageSize"
              :pager-count="11"
              layout="prev, pager, next"
              :total="total"
            >
              <!--@next-click="handleChangePage"
              @prev-click="handleChangePage" -->
              <!-- v-model:current-page="condition.currPage" -->
            </el-pagination>
          </div>
        </div>
      </el-main>

      <el-aside width="21%">
        <div class="rightContent">
          <div class="testimonials">
            <div class="banner">
              <p>阅读飙升榜</p>
            </div>
            <div class="list">
              <div
                class="list-item"
                v-for="(item, index) in readSoaringList"
                :key="item.uuid"
                @click.stop="jumpArticle(item.uuid, index)"
              >
                <div
                  class="skew-elm1"
                  :style="`background: url('${
                    item.photo + '?t=' + new Date().getTime() + index
                  }') center center no-repeat ;`"
                ></div>
                <div class="text">
                  <h3>{{ index + 1 }}. {{ item.title }}</h3>
                  <p>
                    {{ item.abstract }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="user">
            <div class="photo">
              <img src="../../assets/images/bg-admin.jpg" alt="photo" />
            </div>
            <div class="admin">
              <img src="../../assets/images/sidebar.jpg" alt="face" />
              <p>
                {{ authorName }}
              </p>
            </div>
            <div class="synopsis">
              <p><span>简介：</span>{{ description }}</p>
            </div>
          </div>
          <div class="testimonials">
            <div class="banner">
              <p>推荐阅读</p>
            </div>
            <div class="list">
              <div
                class="list-item"
                v-for="(item, index) in hotArticleList"
                :key="item.uuid"
                @click.stop="jumpArticle(item.uuid, index)"
              >
                <div
                  class="skew-elm1"
                  :style="`background: url('${
                    item.photo + '?t=' + new Date().getTime() + index
                  }') center center no-repeat ;`"
                ></div>
                <div class="text">
                  <h3>{{ index + 1 }}. {{ item.title }}</h3>
                  <p>
                    {{ item.abstract }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  watch
} from "vue";
// import { ElLoading } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//// @ts-ignore
const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const aricleList = computed(() => store.state.foreground.articleLists);
const total = computed(() => store.state.foreground.totals);
const hidePage = computed(() => {
  if (store.state.foreground.articleLists > 7) return false;
  return true;
});
const condition = computed({
  get: () => {
    return store.state.foreground.condition;
  },
  set: (val) => {
    console.log(val);
    store.commit("foreground/setCondition", val);
  }
});
const search = computed({
  get: () => {
    return store.state.foreground.search;
  },
  set: (val) => {
    store.commit("foreground/setSearch", val);
  }
});
const readSoaringList = ref<Array<any>>([]); //阅读飙升
const hotArticleList = ref<Array<any>>([]); //热门文章
const authorName = computed(() => store.state.foreground.webConfig.authorName); // 作者名称
const description = computed(
  () => store.state.foreground.webConfig.siteDescription
); // 站长简介
const isOpenCoverImage = computed(
  () => store.state.foreground.webConfig.isOpenCoverImage
); // 开启封面
const itemRef = ref<any>(null);
const articleStickyList = computed(() => {
  return store.state.foreground.articleStickyList;
}); //置顶
/**
 * 跳转到文章详情页
 */
const jumpArticle = (uuid: string, index = -1) => {
  if (index > -1) {
    itemRef.value[index].classList.add("pic");
  }
  (document as any).startViewTransition(() => {
    // router.push({
    //   name: "article",
    //   params: { uuid }
    // });
    itemRef.value[index].classList.remove("pic");
    router.push(`/home/article/${uuid}`);
    scrollTo(0, 0);
  });
};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.value.currPage = val;
  condition.value.state = 1;
  console.log("是这？", val);
  store.commit("foreground/setCondition", condition.value);
  proxy.getAricleList(condition.value);
  scrollTo(0, 0); // 回到页面顶部
};

onBeforeMount(() => {
  // 挂载开始之前
});
onMounted(async () => {
  // 挂载之后
  condition.value.state = 1;
  // 获取文章列表
  proxy.getAricleList(condition.value);
  readSoaringList.value = await proxy.getTestimonialsAricleList();
  hotArticleList.value = await proxy.getHotArticle();
  const category =
    router.currentRoute.value?.params?.category ||
    condition.value.categoryTitle;

  const article = condition.value.articleVague;

  search.value.words = "";
  search.value.categoryFlag = false;
  search.value.searchFlag = false;
  console.log(category);

  if (category || article) {
    setTimeout(() => {
      search.value.words = category || article;
      if (category) {
        search.value.categoryFlag = true;
        search.value.searchFlag = false;
      } else {
        search.value.categoryFlag = false;
        search.value.searchFlag = true;
      }
    }, 100);
  }
});

</script>

<style lang="scss">
#postIndex {
  margin: 0;
  padding: 0;
  height: 100%;
  .content {
    padding-left: 20px;
    // padding-top: 10px;
    // overflow: hidden;
    // margin-right: 20px;

    .main {
      min-height: 47.8vh;
      display: flex;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px 10px 0;
      height: 100%;
      // background-color: rgba(255, 255, 255, 0.8);
      margin-right: 10px;
      overflow: hidden;
      .el-scrollbar {
        width: 100%;
        overflow: unset;
        // min-height: 800px;
        .el-scrollbar__wrap {
          overflow: unset;
        }
        .el-row {
          box-sizing: border-box;
          padding-top: 20px;
          padding: 20px 10px 0;
          .el-col {
            .is-hover-shadow:hover {
              // box-shadow: 2px 2px 20px #000;
              transform: scale(1.005);
              border-radius: 4px;
            }
            .el-card {
              padding: 0;
              margin-bottom: 20px;

              .el-card__body {
                padding: 0;
              }
            }
          }
        }
        .item,
        .items {
          color: #fff;
          min-height: 180px;
          background-color: rgba(255, 255, 255, 1);
          margin: 0 0 20px;
          border-radius: 10px;
          position: relative;
          view-transition-name: "pic";
          // display: flex;
          width: 99%;
          margin: 0 auto 20px;
          transition: all 0.3s;
          .photo {
            display: none;
            width: 100%;
            // animation: lefterBox 0.5s;
            height: 350px;
            img {
              border-radius: 10px 10px 0 0px;
              object-fit: cover;
              height: 100%;
            }
          }
          .aricle {
            width: 95%;
            padding-bottom: 20px;
            display: none;
            transition: all 0.3s;
            animation: upperBox 0.5s;
            overflow: hidden;
            .article-header {
              background-color: #fff;
              position: relative;
              border-radius: 10px 10px 0 0;
              .photo {
                min-height: 260px;
                border-radius: 10px 10px 0 0;
                .el-image {
                  width: 100%;
                  height: 260px;
                  display: block;
                  border-radius: 10px 10px 0 0;

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
                    i {
                      vertical-align: middle;
                    }
                  }
                }
              }
            }

            .article-author {
              // background-color: rgba(230, 230, 230, 1);
              padding: 15px 20px;
              border-bottom: 1px solid rgb(172, 172, 172);
              color: #000;
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
              background-color: #fff;
              padding: 10px 15px 0;
              color: #000;
              text-indent: 2em;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;

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
                  background: url("../../../assets/images/pre.png") 10px 10px /
                    40px no-repeat #2b2b2b;
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
            }
          }
          .aricleTitle {
            width: 100%;
            padding: 40px 2% 20px;
            .left-icon {
              float: left;
              border: 1px solid #757575;
              border-radius: 50%;
              width: 45px;
              height: 45px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin: 0 25px 10px 0;
              i {
                color: #757575;
                text-align: center;
                font-size: 20px;
              }
            }
            h2 {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #005da6;
              font-size: 22px;
              border-bottom: 1px solid transparent;
              span {
                color: #ff4081;
                font-weight: bold;
              }
              &:hover {
                color: #ff4081;
                border-bottom: 1px solid #ff4081;
                cursor: pointer;
              }
            }

            .abstract {
              margin: 0 0 0;
              margin-block-end: 0;
              margin-inline-end: 0;
              margin-block-start: 1em;
              margin-inline-start: 0;
              line-height: 2em;
              color: rgba(0, 0, 0, 0.65);
              p {
                font-size: 15px;
              }
            }

            .divider {
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            }

            .userInfo {
              margin: 0 0 10px;
              padding: 20px 0 0;
              color: rgba(0, 0, 0, 0.68);
              i {
                vertical-align: middle;
                margin-right: 5px;
              }
              span {
                padding-right: 10px;
                font-size: 15px;
              }
            }
          }

          .search-hint {
            p {
              font-size: 1.5em;
              color: rgba(0, 0, 0, 0.75);
              text-align: center;
              font-weight: bold;
              padding: 10px 0;

              span {
                color: rgb(255, 64, 129);
              }
            }
          }
          &:hover {
            transform: scale(1.02);
            // .photo {
            //   display: block;
            // }
            // .aricle {
            //   display: none;
            // }
            // .aricleTitle {
            //   width: 78%;
            //   display: block;
            //   padding: 20px 15px 8px;
            // }
          }
        }
        .items-hint {
          min-height: unset;
        }
        .pic {
          .photo {
            img {
              view-transition-name: pic;
            }
          }
        }
        .items {
          margin: 0;
        }
      }
    }
    .paging {
      padding: 4% 4% 6%;
      // background-color: rgba(255, 255, 255, 0.8);
      .el-pagination {
        width: 100%;
        color: #fff;
        margin: 0 auto;
        background-color: transparent;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-pager {
          li {
            background-color: transparent;
            color: #fff;
            font-size: 16px;
            padding: 0 18px;
          }
          li.is-active {
            color: #005da6;
          }
        }
        button {
          background-color: transparent;
        }

        .btn-next,
        .btn-prev {
          border-radius: 30px;
          width: 40px;
          height: 40px;
          background-color: #005da6;
          padding: 0;
          box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%),
            0 5px 8px 0 rgb(0 0 0 / 14%), 0 1px 14px 0 rgb(0 0 0 / 12%);
          i {
            color: #fff;
            font-size: 16px;
            text-align: center;
            &:hover {
              color: rgb(64, 158, 255);
            }
          }
          &:hover {
            background-color: #ff4081;
          }
        }

        .btn-next:disabled,
        .btn-prev:disabled {
          background-color: rgba(0, 0, 0, 0.12);
          i {
            color: rgb(192, 196, 204);
          }
        }
      }
    }
  }
  .rightContent {
    padding-top: 20px;
    padding-right: 10px;
    padding-bottom: 20px;
    // background-color: rgba(210, 210, 210, 0.8);
    height: 100%;
    .testimonials {
      width: 100%;
      max-height: 430px;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 1);
      overflow: hidden;
      .banner {
        height: 60px;
        p {
          font-size: 20px;
          font-weight: bold;
          padding: 15px 10px;
          color: #666;
          text-align: center;
          &::before {
            content: "★★★";
            margin-right: 10px;
            color: rgb(255, 215, 000);
          }
          &::after {
            content: "★★★";
            margin-left: 10px;
            color: rgb(255, 215, 000);
          }
        }
      }
      .list {
        padding: 0px 10px 10px;
        box-sizing: border-box;
        height: calc(430px - 60px);
        // height: max-content;
        overflow-y: auto;
        .list-item {
          margin-bottom: 10px;
          display: flex;
          align-items: flex-start;
          border: 1px solid var(--el-color-primary);
          border-radius: 10px;

          .skew-elm1 {
            width: 100px;
            height: 80px;
            // background: #000;
            border-radius: 10px 0px 0px 10px;
            background: url("https://api.baka.fun/acgpic?t=17021992266430")
              center center no-repeat;
            background-size: cover !important;
            position: relative;
            &::before {
              content: "";
              position: absolute;
              width: 0;
              height: 0;
              border-top: 40px solid transparent;
              border-bottom: 40px solid white;
              border-left: 25px solid transparent;
              border-right: 25px solid white;
              right: 0;
            }
          }

          &::before {
            content: 1;
            font-size: 18px;
            color: #000;
          }
          .text {
            background-color: #fff;
            width: 78%;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 10px;
            h3 {
              min-width: 15px;
              color: var(--el-color-primary-dark-2);
              padding: 6px 0 0;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 2em;
              &:hover {
                color: #000;
                color: #ff4081;
                cursor: pointer;
              }
            }

            p {
              box-sizing: border-box;
              padding: 2px 10px 0px 0;
              font-size: 15px;
              line-height: 1.3;
              color: var(--el-color-info-light-3);
              font-weight: 100;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;
              // &:hover {
              //   color: #000;
              //   color: #ff4081;
              //   cursor: pointer;
              // }
            }
          }
        }
      }
    }
    .user {
      margin: 20px 0;
      width: 100%;
      min-height: 300px;
      background-color: #fff;
      border-radius: 10px;
      .photo {
        border-radius: 10px 10px 0 0;
        img {
          border-radius: 10px 10px 0 0;
        }
      }
      .admin {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50px;
        }
        p {
          padding-left: 10px;
          width: calc(100% - 50px);
          font-size: 22px;
          font-weight: bold;
        }
      }

      .synopsis {
        padding: 0 20px 20px;
        p {
          font-size: 14px;
          line-height: 1.5;
          text-indent: 0;
          span {
            font-weight: bold;
          }
        }
      }
    }
  }
}
@media (max-width: 800px) {
  #postIndex {
    .content {
      width: 94%;
      margin: 0 auto;
      padding: 0;
      .main {
        padding: unset;
        width: 100%;
        .el-scrollbar {
          width: 100%;

          .item {
            .aricle {
              display: none;
            }
            .aricleTitle {
              padding: 15px 15px 10px;

              .left-icon {
                margin: 0px 25px 8px 0px;
                width: 40px;
                height: 40px;
              }
              .abstract {
                margin-block-end: 0.5em;
                margin-inline-end: 0;
                margin-block-start: 0.5em;
                margin-inline-start: 0;
                line-height: 1.5em;
                p {
                  font-size: 13px;
                }
              }
              .userInfo {
                padding: 10px 0 0;
                color: rgba(0, 0, 0, 0.68);
                i {
                  vertical-align: middle;
                  margin-right: 5px;
                }
                span {
                  padding-right: 15px;
                  font-size: 12px;
                }
              }
              h2 {
                font-size: 15px;
              }
            }

            .search-hint {
              p {
                font-size: 1.3em !important;
              }
            }

            &:hover {
              .aricle {
                display: none;
              }
              .aricleTitle {
                display: block;
              }
            }
          }
        }
        .author {
          display: none;
        }
      }
    }
    .el-aside {
      width: 0;
    }
  }
}

@keyframes upperBox {
  0% {
    height: 0px;
    transform: translateY(0px);
  }
  5% {
    height: 24px;
    transform: translateY(0px);
  }
  10% {
    height: 48px;
    transform: translateY(0px);
  }
  15% {
    height: 72px;
    transform: translateY(0px);
  }
  20% {
    height: 96px;
    transform: translateY(0px);
  }
  25% {
    height: 120px;
    transform: translateY(0px);
  }
  30% {
    height: 144px;
    transform: translateY(0px);
  }
  35% {
    height: 168px;
    transform: translateY(0px);
  }
  40% {
    height: 192px;
    transform: translateY(0px);
  }
  45% {
    height: 216px;
    transform: translateY(0px);
  }
  50% {
    height: 240px;
    transform: translateY(0px);
  }
  55% {
    height: 264px;
    transform: translateY(0px);
  }
  60% {
    height: 288px;
    transform: translateY(0px);
  }
  65% {
    height: 312px;
    transform: translateY(0px);
  }
  70% {
    height: 336px;
    transform: translateY(0px);
  }
  75% {
    height: 360px;
    transform: translateY(0px);
  }
  80% {
    height: 384px;
    transform: translateY(0px);
  }
  85% {
    height: 408px;
    transform: translateY(0px);
  }
  90% {
    height: 432px;
    transform: translateY(0px);
  }
  95% {
    height: 456px;
    transform: translateY(0px);
  }
  100% {
    height: unset;
    transform: translateY(0px);
  }
}

@keyframes lefterBox {
  from {
    height: 0%;
    width: 0%;
    background-size: cover;
  }
  to {
    height: 180%;
    width: 22%;
    background-size: cover;
  }
}
</style>
