<template>
  <div id="profile">
    <div class="pageTitle">
      <h2>个人设置</h2>
    </div>
    <div class="page-main">
      <div class="content-left">
        <p>
          <el-image>
            <template #error>
              <div class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-image>
        </p>
        <p>
          {{ user?.userInfo?.nickName }}
        </p>
        <p>
          {{ user?.role }}
        </p>
        <p>
          目前有<span>{{ articlesTotal }}</span> 篇文章, 并有
          <span>{{ commentsTotal }}</span> 条关于你的评论在
          <span>{{ categoriesTotal }}</span> 个分类中.
        </p>
      </div>
      <div class="content-pane"></div>
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
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "profile",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      user: {},
      articlesTotal:computed(()=>{
        store.getters
      }),
      commentsTotal:0,
      categoriesTotal:0,
    });
    const methods = {};
    onMounted(() => {
      state.user = JSON.parse(proxy.$Cookies.get("user"));
      console.log(state.user);
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#profile {
  background-color: #f6f6f3;
  width: 70%;
  margin: 0 auto;
  min-height: 93.5vh;
  color: #444;
  .pageTitle {
    padding: 1.5% 0;
    h2 {
      font-size: 1.2em;
    }
  }

  .page-main {
    display: flex;
    .content-pane {
      width: 60%;
    }
    .content-left {
      width: 40%;
      padding-right: 10%;
      box-sizing: border-box;

      p {
        font-size: 87.5%;
        line-height: 1.5;

        span {
          font-style: italic;
        }
      }
    }
  }
}
</style>