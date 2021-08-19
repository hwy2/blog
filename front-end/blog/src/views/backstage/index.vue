<template>
  <div id="backstage">
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
          <el-menu-item index="2-1">撰写文章</el-menu-item>
          <el-menu-item index="2-2">创建页面</el-menu-item>
          <el-submenu index="2-4">
            <template #title>选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template #title>管理</template>
          <el-menu-item index="3-1">文章</el-menu-item>
          <el-menu-item index="3-2">页面</el-menu-item>
          <el-menu-item index="3-3">评论</el-menu-item>
          <el-menu-item index="3-4">分类</el-menu-item>
          <el-menu-item index="3-5">文件</el-menu-item>
          <el-menu-item index="3-6">用户</el-menu-item>
          <el-menu-item index="3-7">友情链接</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template #title>设置</template>
          <el-menu-item index="4-1">基本</el-menu-item>
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
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "backstage",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      user: {},
      activeIndex: "/backstage/outline",
    });
    const methods = {
      handleSelect(key: string, keyPath: string) {
        state.activeIndex = key;
      },
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
              router.push('/login');
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
    };
    onMounted(() => {
      state.user = JSON.parse(proxy.$Cookies.get("user"));
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#backstage {
  background-color: #f6f6f3;
  width: 100%;
  height: 100vh;

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