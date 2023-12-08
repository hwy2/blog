<template>
  <div id="backstage">
    <el-container>
      <el-header>
        <Navbar></Navbar>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar></Sidebar>
        </el-aside>
        <el-main>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import dateFormat from "@/assets/js/dateFormat.js";
import { Navbar, Sidebar } from "@/components";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();

const user = ref<any>({});

const dataSummary = computed({
  get: () => {
    return store.state.backstage.dataSummary;
  },
  set: (val) => {
    store.commit("backstage/setDataSummary", val);
  }
});

/**
 * 获取类别列表
 */
const getCategoryList = () => {
  proxy.$axios
    .get("/category/list", {
      userUuid: user.value.uuid
    })
    .then((res: any) => {
      console.log("获取类别列表", res);
      for (const item of res.result.list) {
        item.createDate = dateFormat(item.createDate, "MM-dd");
      }
      store.commit("backstage/setCategoryList", res.result.list);
      store.commit(
        "backstage/setClassificationsTotal",
        res.result.page.totalRow
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
};

/**
 * 获取数据统计
 */
const getDataSummaryList = () => {
  proxy.$axios
    .get("/dataSummary/list")
    .then((res: any) => {
      console.log(res);
      dataSummary.value.articlesTotal = res.result.list.filter((item: any) => {
        return item.name === "articlesTotal";
      })[0].value; // 文章总数

      dataSummary.value.commentsTotal = res.result.list.filter((item: any) => {
        return item.name === "commentsTotal";
      })[0].value; // 评论总数

      dataSummary.value.categoriesTotal = res.result.list.filter(
        (item: any) => {
          return item.name === "categoriesTotal";
        }
      )[0].value; // 分类总数
    })
    .catch((error: any) => {
      console.log(error);
    });
};
onBeforeMount(() => {
  proxy.getWebConfigInfo();
  document.title = "博客后台";
});
onMounted(() => {
  if (proxy.$Cookies.get("user")) {
    user.value = JSON.parse(proxy.$Cookies.get("user"));
  } else {
    router.push({ name: "login" });
  }
  getDataSummaryList();
  getCategoryList();
});
</script>

<style lang="scss">
#backstage {
  background-color: #f6f6f3;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  .el-container {
    .el-header {
      padding: 0;
    }

    .el-main {
      padding: 0;
    }
  }
}
</style>
