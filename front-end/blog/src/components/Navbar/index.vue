<template>
  <div class="navbar">
    <div class="logo">
      <div class="siteName">{{ siteName }}</div>
    </div>
    <div class="information">
      <ul>
        <li>
          <router-link to="/backstage/consoles/profile">{{
            user?.userInfo?.nickName
          }}</router-link>
        </li>
        <li @click="logout()">登出</li>
        <li>
          <router-link tag="a" target="_blank" to="/home/index"
            >网站</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" name="navbar" setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { logoutApi } from "@/utils/api/user";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const siteName = computed(() => store.state.foreground.webConfig.siteName);
const user = ref<any>({});

/**
 * 退出登录
 */
const logout = () => {
  logoutApi({})
    .then((res: any) => {
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: `登出成功，欢迎再次回来`,
          type: "success"
        });
        proxy.$Cookies.remove("accessToken");
        proxy.$Cookies.remove("user");
        router.push("/login");
      } else {
        ElNotification({
          title: "失败",
          message: res.msg,
          type: "error"
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

onMounted(() => {
  if (proxy.$Cookies.get("user")) {
    user.value = JSON.parse(proxy.$Cookies.get("user"));
  } else {
    router.push({ name: "login" });
  }
});
</script>

<style lang="scss">
.navbar {
  display: flex;
  align-items: center;
  background-color: rgb(84, 92, 100);
  height: 60px;
  border-bottom: 1px solid #999;
  .logo {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 28px;
    font-weight: bold;
    font-family: cursive;
    color: #fff;
    padding-left: 20px;
    user-select: none;
  }

  .information {
    width: 20%;
    height: 60px;
    line-height: 60px;
    margin-left: auto;
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
      li:last-child {
        border-right: none;
      }
    }
  }
}
</style>
