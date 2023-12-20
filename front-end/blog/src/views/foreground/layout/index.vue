<template>
  <div class="homePage">
    <div
      class="bg"
      :style="{ backgroundImage: `url(' ${backgroundImage}')` }"
    ></div>
    <div class="toolbar">
      <!-- logo -->
      <div class="logo">
        <a href="javascript:void(0)" @click="openDrawer()">
          <i class="iconfont icongengduo"></i>
        </a>
        <a href="javascript:void(0)" @click="home()">
          {{ blogTitle }}
        </a>
      </div>
      <!-- nav -->
      <div class="nav">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1" @click="home()">
            <a href="javascript:void(0)">首页</a></el-menu-item
          >
          <el-menu-item
            :index="'3-' + index"
            class="secondary-item"
            v-for="(item, index) in pageList"
            :key="index"
            @click="drawer = false"
          >
            <router-link :to="item.to">{{ item.title }}</router-link>
          </el-menu-item>
        </el-menu>
        <!-- search -->
        <div class="search">
          <div class="pcview" v-show="!showSearch">
            <i class="iconfont iconsearch" @click="openSearch"></i>
          </div>
          <div class="handsets" v-show="showSearch">
            <label for="search">
              <!-- <i class="iconfont iconsearch"></i> -->
              <el-input
                type="text"
                name="search"
                clearable
                v-model="condition.articleVague"
                @keydown.enter="listenSearch()"
              >
                <template #prefix>
                  <i class="iconfont iconsearch"></i>
                </template>
                <template #append>
                  <el-button :icon="Close" @click="showSearch=false" />
                </template>
              </el-input>
            </label>
          </div>
        </div>
      </div>
    </div>
    <el-container v-loading="loading">
      <el-main :style="clientHeight">
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
      <!-- 页脚 -->
      <el-footer height="100%">
        <div class="footer-box">
          <div class="copyright">
            <p>
              Copyright © 2018-2023 <a href="/">{{ siteName }}</a>
            </p>
            <p>
              Powered by <a href="/">{{ "HWY" }}</a>
            </p>
          </div>
          <div class="runningTime">
            <p>网站运行时间：{{ runningTime }}</p>
          </div>
          <div class="navigator">
            <p>
              <router-link
                v-for="item in pageList"
                :key="item.uuid"
                :to="item.to"
                >{{ item.title }}</router-link
              >
              ©2018-2023&emsp13;
              {{ siteName }} &emsp; 保留所有权力
            </p>
          </div>
          <div class="recordInfo">
            <p v-if="recordMIIT">
              <a
                href="https://beian.miit.gov.cn/#/Integrated/index"
                target="_blank"
              >
                {{ recordMIIT }}
              </a>
            </p>
            <p v-if="internetAlert">
              <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode="
                target="_blank"
              >
                {{ internetAlert }}
              </a>
            </p>
          </div>
          <div class="report">
            <p>
              举报电话：020-87185235，举报邮箱：gdswxb-gd12377@gd.gov.com
              <a target="_blank" href="https://www.gdjubao.cn/"
                ><i class="iconfont iconyouxiang"></i
              ></a>
            </p>
          </div>
        </div>
      </el-footer>
    </el-container>

    <el-drawer
      title=""
      v-model="drawer"
      direction="ltr"
      size="15%"
      :with-header="false"
    >
      <div class="sidebar-header">
        <div class="head-portrait"></div>
        <div class="siteInfo">
          <div class="authorName">
            <p>
              {{ authorName }}
            </p>
          </div>
          <div class="description">
            <p>
              {{ description }}
            </p>
          </div>
        </div>
      </div>

      <div class="sidebar-toolbar">
        <ul>
          <a
            href="javascript:void(0)"
            @click="home()"
            F
            :class="
              isCategoryNone ? 'collapse-item-none' : 'collapse-item-block'
            "
          >
            <div class="ripple">
              <i class="iconfont iconhome"></i>
              <p>首页</p>
            </div>
          </a>
          <li
            class="collapse-item"
            :class="
              isCategoryNone ? 'collapse-item-none' : 'collapse-item-block'
            "
          >
            <div class="ripple" @click="isCategoryShow()">
              <i class="iconfont iconicon"></i>
              <p>分类</p>
              <i
                class="iconfont icongengduo1"
                :class="[isCategoryNone ? 'anti-rotation' : 'rotate']"
              ></i>
            </div>

            <ul
              class="secondary-warp"
              :style="[isCategoryNone ? 'height:0;' : 'height:auto;']"
            >
              <li
                class="secondary-item"
                v-for="(item, index) in categoryList"
                :key="index"
                @click="listenCategory(item.name)"
              >
                <p>
                  {{ item.name }}
                </p>
                <p>
                  <span>{{ item.value }}</span>
                </p>
              </li>
            </ul>
          </li>
          <li
            class="collapse-item"
            :class="isPageNone ? 'collapse-item-none' : 'collapse-item-block'"
          >
            <div class="ripple" @click="isPageShow()">
              <i class="iconfont iconiconset0335"></i>
              <p>页面</p>
              <i
                class="iconfont icongengduo1"
                :class="[isPageNone ? 'anti-rotation' : 'rotate']"
              ></i>
            </div>
            <ul
              class="secondary-warp"
              :style="[isPageNone ? 'height:0;' : 'height:auto;']"
            >
              <li
                class="secondary-item"
                v-for="(item, index) in pageList"
                :key="index"
                @click="drawer = false"
              >
                <p>
                  <router-link :to="item.to">{{ item.title }}</router-link>
                </p>
                <p><span> </span></p>
              </li>
              <!-- <li class="secondary-item">
              <p>
                <router-link to="/home/friendlyLink">友情链接</router-link>
              </p>
              <p><span> </span></p>
            </li>
            <li class="secondary-item">
              <p>
                <router-link to="/home/privacyPolicy">隐私政策</router-link>
              </p>
              <p><span> </span></p>
            </li> -->
            </ul>
          </li>
          <div class="summary">
            <p><i class="iconfont iconhuizong"></i>数据汇总</p>
          </div>
          <li class="list-item">
            <p>文章总数</p>
            <p>
              <span>{{ articlesTotal }}</span>
            </p>
          </li>
          <li class="list-item">
            <p>评论总数</p>
            <p>
              <span>{{ commentsTotal }}</span>
            </p>
          </li>
          <li class="list-item">
            <p>页面总数</p>
            <p>
              <span>{{ pagesTotal }}</span>
            </p>
          </li>
          <li class="list-item">
            <p>分类总数</p>
            <p>
              <span>{{ categoriesTotal }}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="sidebar-footer">
        <button @click="login()"><i class="iconfont iconren"></i> 登录</button>
      </div>
    </el-drawer>

    <el-dialog
      v-model="searchDialogVisible"
      width="80%"
      destroy-on-close
      center
    >
      <label for="search">
        <i class="iconfont iconsearch"></i>
        <el-input
          type="text"
          name="search"
          v-model="condition.articleVague"
          @keydown.enter="listenSearch()"
        />
      </label>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeMount,
  getCurrentInstance,
  onBeforeUnmount,
  nextTick,
  watch
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { Close } from "@element-plus/icons-vue";
// import dateFormat from "@/assets/js/dateFormat.js";

// 变量定义
const store = useStore();
const { proxy }: any = getCurrentInstance();
const router = useRouter();
const loading = ref<boolean>(true);
const isScroll = ref<boolean>(false);
const isRouterAlive = ref<boolean>(true); // 是否显示路由
const articlesTotal = ref<number>(0); // 文章总数
const commentsTotal = ref<number>(0); // 评论总数
const pagesTotal = ref<number>(0); // 页面总数
const categoriesTotal = ref<number>(0); // 分类总数
const categoryList: any = ref([]); // 分类
const setTimeoutFlag = ref(); // setTimeout
const drawer = ref<boolean>(false); // 抽屉
const isCategoryNone = ref<boolean>(true); // 是否是类别
const isPageNone = ref<boolean>(true); // 是否是页面
const searchDialogVisible = ref<boolean>(false); // 搜索dialog

import backgroundImage from "@/assets/images/bg.jpg";
// const backgroundImage = ref<string>(`url('/src/assets/images/bg.jpg')`); // 背景图片
const clientHeight = computed(
  () => "min-height:" + (document.documentElement.clientHeight - 237) + "px"
); // 动态高度
const blogTitle = computed(() => store.state.foreground.blogTitle); // 网站title
const siteName = computed(() => store.state.foreground.webConfig.siteName);
const runningTime = ref<string>(""); // 运行时间
const startTime = computed(() => store.state.foreground.webConfig.runningTime);
const recordMIIT = computed(
  () => store.state.foreground.webConfig.recordNumber
); // 工信部备案
const internetAlert = computed(
  () => store.state.foreground.webConfig.internetAlert
); // 粤警备案
const condition = computed({
  get: () => {
    return store.state.foreground.condition;
  },
  set: (val) => {
    store.commit("foreground/setCondition", val);
  }
}); // 搜索条件
const search = computed({
  get: () => {
    return store.state.foreground.search;
  },
  set: (val) => {
    store.commit("foreground/etSearch", val);
  }
}); // 搜索
const authorName = computed(() => store.state.foreground.webConfig.authorName); // 作者名称
const description = computed(
  () => store.state.foreground.webConfig.siteDescription
); // 站长简介
const pageList = computed(() => store.state.foreground.pageList); //文章列表
const showSearch = ref(false); //显示搜索？
const defaultActive = ref<any>("1"); //导航栏

/** 获取统计数据 */
const getDataSummaryList = () => {
  proxy.$axios
    .get("/dataSummary/list")
    .then((res: any) => {
      // console.log(res);
      store.commit("foreground/setDataSummary", res.result.list);
      articlesTotal.value = res.result.list.filter((item: any) => {
        return item.name === "articlesTotal";
      })[0].value; // 文章总数

      commentsTotal.value = res.result.list.filter((item: any) => {
        return item.name === "commentsTotal";
      })[0].value; // 评论总数

      categoriesTotal.value = res.result.list.filter((item: any) => {
        return item.name === "categoriesTotal";
      })[0].value; // 分类总数

      pagesTotal.value = res.result.list.filter((item: any) => {
        return item.name === "pagesTotal";
      })[0].value; // 页面总数

      categoryList.value = res.result.list.filter((item: any) => {
        return item.type === 1;
      });
    })
    .catch((error: any) => {
      console.log(error);
    });
};
// 监听移动端滚动
const listenScroll = () => {
  setTimeout(() => {
    const scroll = document.documentElement.scrollTop;
    const outerWidth = window.outerWidth;
    const temp = store.getters["foreground/getWebConfig"].siteName;
    if (outerWidth < 800) {
      const path = router.currentRoute.value.path;
      if (scroll > 80 && /article/.test(path)) {
        isScroll.value = true;
        store.commit(
          "foreground/setBlogTitle",
          store.getters["foreground/getArticle"].title
        );
      } else {
        isScroll.value = false;
        store.commit("foreground/setBlogTitle", temp);
      }
    } else if (scroll > 1) {
      // const elaffix: any = document.querySelector(".el-affix")?.firstChild;
      // elaffix.setAttribute("class", "el-affix--fixed");
    }
  }, 500);
};
// 格式化时间
const tick = (oldDate: string) => {
  const time = {
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  let totalTime = (new Date().getTime() - new Date(oldDate).getTime()) / 1000;
  time.years = Math.floor(totalTime / 31536000);
  totalTime = totalTime - time.years * 31536000;
  time.days = Math.floor(totalTime / 86400);
  totalTime = totalTime - time.days * 86400;
  time.hours = Math.floor(totalTime / 3600);
  totalTime = totalTime - time.hours * 3600;
  time.minutes = Math.floor(totalTime / 60);
  totalTime = totalTime - time.minutes * 60;
  time.seconds = Math.floor(totalTime);

  runningTime.value = `${time.years}年${time.days}日 ${time.hours}时${time.minutes}分${time.seconds}秒`;

  setTimeoutFlag.value = setTimeout(() => {
    tick(oldDate);
  }, 1000);
};
/** 显示/隐藏 类别列表 */
const isCategoryShow = () => {
  isCategoryNone.value = !isCategoryNone.value;
};
/** 打开抽屉 */
const openDrawer = () => {
  drawer.value = true;
};
/** 显示/隐藏 页面列表 */
const isPageShow = () => {
  isPageNone.value = !isPageNone.value;
};
/** 监听类别点击事件 */
const listenCategory = (categoryTitle: string) => {
  //  只搜索类别
  console.log(categoryTitle);
  condition.value.currPage = 1;
  condition.value.pageSize = 7;
  condition.value.categoryTitle = categoryTitle;
  condition.value.articleVague = ""; // 不联合搜索
  condition.value.state = 1;
  proxy.getAricleList(condition.value);
  search.value.words = categoryTitle;
  search.value.categoryFlag = true;
  search.value.searchFlag = false;
  drawer.value = false;
  router.push({ name: "home" });
};
/** 打开搜索框 */
const openSearch = () => {
  showSearch.value = true;
  // searchDialogVisible.value = true;
};

/** 监听搜索框回车事件 */
const listenSearch = () => {
  // 只模糊搜索文章内容
  condition.value.state = 1;
  condition.value.categoryTitle = "";
  proxy.getAricleList(condition.value);
  search.value.words = condition.value.articleVague;
  search.value.categoryFlag = false;
  if (condition.value.articleVague) search.value.searchFlag = true;
  else search.value.searchFlag = false;
  router.push({
    name: "index"
  });
  searchDialogVisible.value = false;
};
/** 登录跳转页面 */
const login = () => {
  router.push("/login");
};
const reload = async () => {
  isRouterAlive.value = false;
  await nextTick(() => {
    isRouterAlive.value = true;
  });
};
/** 搜索项恢复默认值并跳转到首页 */
const home = () => {
  condition.value.currPage = 1;
  condition.value.pageSize = 7;
  condition.value.articleVague = "";
  condition.value.categoryTitle = "";
  condition.value.state = 1;
  if (router.currentRoute.value.path === "/home/index") {
    reload();
    return;
  }
  router.push("/home/index");
};
/** 跳转到文章详情页*/
const jumpArticle = (uuid: string) => {
  scrollTo(0, 0);
  router.push({
    name: "article",
    params: { uuid }
  });
};
const handleSelect = (key: string, keyPath: string) => {
  // console.log(key, keyPath);
  defaultActive.value = key;
};

// 生命周期
onBeforeMount(async () => {
  proxy.getWebConfigInfo();

  if (!Cookies.get("defaultActive")) {
    Cookies.set("defaultActive", "1");
  }
  defaultActive.value = Cookies.get("defaultActive") || "1";
});
onMounted(() => {
  loading.value = false;
  getDataSummaryList();
  search.value.words = "";
  search.value.categoryFlag = false;
  search.value.searchFlag = false;
  window.addEventListener("scroll", listenScroll);
  setTimeout(() => {
    condition.value.state = 4; // 请求页面
    const temp = condition.value.currPage;
    condition.value.currPage = 1;
    proxy.getAricleList(condition.value);
    condition.value.currPage = temp;
  }, 500);
  tick(localStorage.getItem("runingTime") || startTime.value);
});

onBeforeUnmount(() => {
  clearTimeout(setTimeoutFlag.value);
});
watch(defaultActive, (newValue: any) => {
  console.log(newValue);
  Cookies.set("defaultActive", newValue);
});

watch(
  () => router.currentRoute.value.path,
  (newValue: any) => {
    console.log('监听路由',newValue);
    if(newValue == '/home/index'){
      defaultActive.value = '1'
      Cookies.set("defaultActive",  '1');
    }
  }
);

</script>

<style lang="scss">
@import "./scss/home.scss";
</style>
