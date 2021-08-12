<template>
  <div id="postIndex">
    <div class="content">
      <div class="main">
        <el-scrollbar height="">
          <el-row>
            <el-col
              :md="{ span: 14, offset: 5 }"
              :xs="24"
              v-for="(item, index) in aricleList"
              :key="index"
              @click="methods.jumpArticle(item.uuid)"
            >
              <!-- <router-link :to="{name:'article',params:{uuid:item.uuid}}"> -->
              <el-card shadow="hover">
                <div class="item">
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
                    </div>
                  </div>
                </div>
              </el-card>
              <!-- </router-link> -->
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <div class="paging">
        <el-pagination
          @next-click="methods.handleNextPage"
          @prev-click="methods.handlePrevPage"
          :page-size="pageSize"
          :pager-count="11"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dateFormat from "/@/assets/js/dateFormat.js";
import {
  toRefs,
  reactive,
  onBeforeMount,
  onMounted,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { ElLoading } from "element-plus";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Index",
  setup: () => {
    //// @ts-ignore
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      // vue2.x的data参数
      aricleList: {},
      pageSize: 7,
      total: 0,
    });
    const methods = {
      getAricleList(data: any) {
        const loading = ElLoading.service({ fullscreen: true });
        proxy.$axios
          .get("/article/list", data)
          .then((res: any) => {
            console.log(res);
            for (const item of res.result.list) {
              item.createDate = dateFormat(item.createDate, "yyyy年MM月dd日");
            }
            state.pageSize = res.result.page.pageSize;
            state.total = res.result.page.totalRow;
            state.aricleList = res.result.list;
            loading.close();
          })
          .catch((error: any) => {
            console.log(error);
            loading.close();
          });
      },
      jumpArticle(uuid: string) {
        router.push({
          name: "article",
          params: { uuid },
        });
      },
      handleNextPage(val: any) {
        methods.getAricleList({ pageSize: state.pageSize, currPage: val });
        scrollTo(0, 0); // 回到页面顶部
      },
      handlePrevPage(val: any) {
        methods.getAricleList({ pageSize: state.pageSize, currPage: val });
        scrollTo(0, 0); // 回到页面顶部
      },
    };
    onBeforeMount(() => {
      // 挂载开始之前
    });
    onMounted(() => {
      // 挂载之后
      methods.getAricleList({ pageSize: 7 });
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#postIndex {
  margin: 0;
  padding: 0;
  .content {
    overflow: hidden;
    .main {
      min-height: 47.8vh;
      .el-scrollbar {
        // min-height: 800px;
        .el-row {
          box-sizing: border-box;
          .el-col {
            margin-bottom: 20px;
            .is-hover-shadow:hover {
              box-shadow: 2px 2px 20px #000;
              transform: scale(1.03);
            }
            .el-card {
              padding: 0;
              background-color: rgba(255, 255, 255, 0.9);
              .el-card__body {
                padding: 0;
              }
            }
          }
        }
        .item {
          color: #fff;
          // background-color: rgba(255,255,255,.8);
          margin: 0;
          .aricleTitle {
            padding: 30px 30px 15px;
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
              color: rgba(0, 0, 0, 0.75);
              font-size: 22.5px;
              &:hover {
                text-shadow: 0 1px 1px rgb(0 0 0 / 35%);
              }
            }

            .abstract {
              margin: 0 0 10px;
              margin-block-end: 1em;
              margin-inline-end: 0;
              margin-block-start: 1em;
              margin-inline-start: 0;
              line-height: 1.5em;
              color: rgba(0, 0, 0, 0.65);
              p {
                font-size: 15px;
              }
            }

            .divider {
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            }

            .userInfo {
              padding: 10px 0 0;
              color: rgba(0, 0, 0, 0.68);
              i {
                vertical-align: middle;
                margin-right: 5px;
              }
              span {
                padding-right: 10px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    .paging {
      padding: 4% 0 6%;
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
          li.active {
            color: rgb(64, 158, 255);
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
          background-color: #ff4081;
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

  @media (max-width: 800px) {
    .content {
      width: 94%;
      margin: 0 auto;
    }

    .main {
      .el-scrollbar {
        .item {
          .aricleTitle {
            padding: 15px;

            h2 {
              font-size: 1.5em;
            }
          }
        }
      }
    }
  }
}
</style>