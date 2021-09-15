<template >
  <div id="archiveArticles">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 14, offset: 5 }" :xs="24">
          <div class="list-card">
            <header class="article-header">
              <h2>文章归档</h2>
            </header>
            <div class="archives-list-content">
              <div
                class="article-list-item"
                v-for="(item, index) in articleList"
                :key="index"
              >
                <div
                  class="item-header"
                  @click="methods.modifyState(index, $event)"
                >
                  <p>{{ item.date }}</p>
                  <p>{{ item?.res?.length }}篇</p>
                  <i :class="listNone[index]?'rotate':''" class="iconfont icongengduo1 anti-rotation"></i>
                </div>
                <div class="item-body" v-show="listNone[index]">
                  <router-link
                    :to="{ name: 'article', params: { uuid: `${resList.uuid}` }}"
                    v-for="(resList, j) in item?.res"
                    :key="j"
                  >
                    <span>{{
                      methods.getdateFormat(resList.createDate, "MM-dd")
                    }}</span
                    >&emsp; {{ resList.title }}</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import dateFormat from "/@/assets/js/dateFormat.js";
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification, ElLoading } from "element-plus";
export default defineComponent({
  name: "outline",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      articleList: [],
      condition: {
        pageSize: 99999999,
        currPage: 1,
        categoryTitle: "",
        articleVague: "",
        state: 1,
      },
      listNone: [],
    });
    const methods = {
      getArticleList() {
        const loading = ElLoading.service({ fullscreen: true });
        proxy.$axios
          .get("/article/list", state.condition)
          .then((res: any) => {
            console.log(res);
            loading.close();
            const list: any[] = [];
            res.result.list.forEach((item: any, i: number) => {
              let index = -1;
              const createTime = item.createDate.substring(0, 4);
              const alreadyExists = list.some((newDate: any, j: number) => {
                if (createTime === newDate.date) {
                  index = j;
                  return true;
                }
              });
              if (!alreadyExists) {
                const resList: any = [];
                resList.push(item);
                list.push({
                  date: createTime,
                  res: resList,
                });
              } else {
                list[index].res.push(item);
              }
            });
            (state.articleList as any[]) = list;
            console.log(list);
          })
          .catch((error: any) => {
            console.log(error);
            loading.close();
          });
      },
      getdateFormat(data: string, format: string) {
        return dateFormat(data, format);
      },
      modifyState(index: number, event: any) {
        if (state.listNone[index]) {
          (state.listNone as boolean[])[index] = false;
          event.target.children[2].classList.remove("rotate");
          return;
        }
        event.target.children[2].classList.add("rotate");
        (state.listNone as boolean[])[index] = true;
      },
    };
    watch(
      () => state.articleList,
      (newValue: any, oldValue: any) => {
        console.log(newValue, oldValue);
        for (const article of newValue) {
          (state.listNone as boolean[]).push(false);
        }
        (state.listNone as boolean[])[0]=true;
      }
    );
    onBeforeMount(() => {
      document.title = "归档文章";
    });
    onMounted(() => {
      methods.getArticleList();
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#archiveArticles {
  min-height: 47.8vh;
  .content {
    .el-col {
      background-color: unset;
      .article-header {
        padding: 15px;
        background-color: rgba(255, 255, 255, 0.9);
        position: relative;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.05);
        h2 {
          font-weight: 400;
        }
      }
      .archives-list-content {
        background-color: rgba(255, 255, 255, 0.9);
        padding-bottom: 10px;
        .article-list-item {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          .item-header {
            display: flex;
            box-sizing: border-box;
            padding: 15px;
            cursor: pointer;

            p:nth-of-type(1) {
              font-weight: bold;
              font-size: 1.2em;
            }
            p:nth-of-type(2) {
              color: rgba(0, 0, 0, 0.54);
            }
            p {
              margin-right: auto;
            }
            .anti-rotation {
              margin-left: auto;
              animation: antiRotation 0.2s;
              transform: rotateZ(90deg);
            }
            .rotate {
              animation: gyrate 0.2s;
              transform: rotateZ(270deg) !important;
            }
          }
          .item-body {
            padding: 0 24px;
            a {
              padding: 15px 10px;
              display: block;
              border-bottom: 1px solid rgb(218, 217, 217);
              &:hover {
                background-color: rgba(0, 0, 0, 0.2);
              }
            }
            a:last-child {
              border-bottom: 0;
            }
          }
        }
        .article-list-item:last-child{
          border-bottom: 0;
        }
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
      }
    }
  }
}

// 向上旋转
@keyframes gyrate {
  0% {
    transform: rotateZ(90deg);
  }
  25% {
    transform: rotateZ(135deg);
  }
  50% {
    transform: rotateZ(180deg);
  }
  75% {
    transform: rotateZ(225deg);
  }
  100% {
    transform: rotateZ(270deg);
  }
}

// 向下旋转
@keyframes antiRotation {
  0% {
    transform: rotateZ(270deg);
  }
  25% {
    transform: rotateZ(315deg);
  }
  50% {
    transform: rotateZ(360deg);
  }
  75% {
    transform: rotateZ(405deg);
  }
  100% {
    transform: rotateZ(450deg);
  }
}
</style>