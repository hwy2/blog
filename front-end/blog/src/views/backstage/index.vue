<template>
  <div id="backstage">
    <el-affix :offset="0">
      <div class="navbar">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="methods.handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="1">
            <template #title>控制台</template>
            <el-menu-item index="/backstage/outline">概要</el-menu-item>
            <el-menu-item index="/backstage/profile">个人设置</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template #title>撰写</template>
            <el-menu-item index="/backstage/writingArticles"
              >撰写文章</el-menu-item
            >
            <el-menu-item index="/backstage/createPage">创建页面</el-menu-item>
            <!-- <el-submenu index="2-4">
              <template #title>选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu> -->
          </el-submenu>
          <el-submenu index="3">
            <template #title>管理</template>
            <el-menu-item index="/backstage/articleList">文章</el-menu-item>
            <el-menu-item index="/backstage/pageList">页面</el-menu-item>
            <el-menu-item index="/backstage/commentList">评论</el-menu-item>
            <el-menu-item index="/backstage/categoryList">分类</el-menu-item>
            <el-menu-item index="/backstage/fileList">文件</el-menu-item>
            <el-menu-item index="/backstage/userList">用户</el-menu-item>
            <el-menu-item index="/backstage/linkList">友情链接</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template #title>设置</template>
            <el-menu-item index="/backstage/basicSettings">基本</el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="information">
          <ul>
            <li>
              <router-link to="/backstage/profile">{{
                user?.userInfo?.nickName
              }}</router-link>
            </li>
            <li @click="methods.logout()">登出</li>
            <li>
              <router-link tag="a" target="_blank" to="/home/index"
                >网站</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </el-affix>
    <router-view></router-view>
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
  name: "backstage",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      user: {},
      activeIndex: computed({
        get: () => {
          return store.state.backstage.activeIndex;
        },
        set: (val) => {
          store.commit("backstage/setActiveIndex", val);
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
    });
    const methods = {
      /**
       * 导航栏选中index
       */
      handleSelect(key: string, keyPath: string) {
        // console.log(key, keyPath);
        state.activeIndex=key;
      },
      /**
       * 获取类别列表
       */
      getCategoryList() {
        proxy.$axios
          .get("/category/list", {})
          .then((res: any) => {
            console.log(res);
            for (const item of res.result.list) {
              item.createDate = dateFormat(item.createDate, "MM-dd");
            }
            store.commit("backstage/setCategoryList", res.result.list);
          })
          .catch((err: any) => {
            console.log(err);
          });
      },
      /**
       * 退出登录
       */
      logout() {
        proxy.$axios
          .get("/user/logout", {})
          .then((res: any) => {
            if (res.code === "200") {
              ElNotification({
                title: "成功",
                message: `登出成功，欢迎再次回来`,
                type: "success",
              });
              proxy.$Cookies.remove("accessToken");
              proxy.$Cookies.remove("user");
              router.push("/login");
            } else {
              ElNotification({
                title: "失败",
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
       * 获取数据统计
       */
      getDataSummaryList() {
        proxy.$axios
          .get("/dataSummary/list")
          .then((res: any) => {
            console.log(res);
            state.dataSummary.articlesTotal = res.result.list.filter(
              (item: any) => {
                return item.name === "articlesTotal";
              }
            )[0].value; // 文章总数

            state.dataSummary.commentsTotal = res.result.list.filter(
              (item: any) => {
                return item.name === "commentsTotal";
              }
            )[0].value; // 评论总数

            state.dataSummary.categoriesTotal = res.result.list.filter(
              (item: any) => {
                return item.name === "categoriesTotal";
              }
            )[0].value; // 分类总数
          })
          .catch((error: any) => {
            console.log(error);
          });
      },
    };
    onBeforeMount(() => {
      proxy.getWebConfigInfo();
      document.title = "博客后台";
    });
    onMounted(() => {
      if (proxy.$Cookies.get("user")) {
        state.user = JSON.parse(proxy.$Cookies.get("user"));
      } else {
        router.push({ name: "login" });
      }
      methods.getDataSummaryList();
      methods.getCategoryList();
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
  created() {
    const store = useStore();
    // 页面加载时读取数据
    if (sessionStorage.getItem("store")) {
      store.replaceState(
        Object.assign(
          {},
          store.state,
          JSON.parse((sessionStorage as any).getItem("store"))
        )
      );
    }

    // 页面刷新时保存信息
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(store.state));
    });
  },
});
</script>

<style lang="scss">
#backstage {
  background-color: #f6f6f3;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;

  .navbar {
    display: flex;
    background-color: rgb(84, 92, 100);
    .el-menu {
      width: 80%;
    }
    .information {
      flex-grow: 1;
      border-bottom: 1px solid rgb(230, 230, 230);
      height: 60px;
      line-height: 60px;
      color: #fff;

      ul {
        display: flex;
        li {
          width: 33%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-right: 1px solid #999;
          text-align: center;
          color: #fff;
          cursor: pointer;
          user-select: unset;
          a {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>