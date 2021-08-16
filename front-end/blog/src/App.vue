<template>
  <transition name="slide-fade">
    <router-view></router-view>
  </transition>
</template>

<script  lang='ts'>
import { onMounted, onBeforeMount, getCurrentInstance } from "vue";
import snowfall from "./assets/js/snowfall.min.js";
import { useStore } from "vuex";
export default {
  name: "App",
  components: {},
  setup() {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const methods = {
      async getWebConfigInfo() {
        await proxy.$axios
          .get("/webConfig/info")
          .then((res: any) => {
            console.log(res);
            store.commit("setWebConfig", res.result.webConfig);
            store.commit("setBlogTitle", res.result.webConfig.siteName);
            localStorage.setItem(
              "runingTime",
              res.result.webConfig.runningTime
            );
            // 修改或创建 keywords AND description
            const head: any = document.getElementsByTagName("head");
            const keyword: any =
              document.querySelector('meta[name="keywords"]') ||
              document.createElement("meta");
            const description: any =
              document.querySelector('meta[name="description"]') ||
              document.createElement("meta");
            keyword.setAttribute("name", "keywords");
            keyword.setAttribute("content", res.result.webConfig.keyWord);
            description.setAttribute("name", "description");
            description.setAttribute(
              "content",
              res.result.webConfig.siteDescription
            );
            head[0].appendChild(keyword);
            head[0].appendChild(description);
          })
          .catch((error: any) => {
            console.log(error);
          });
      },
    };
    onBeforeMount(() => {
      // 修改网页title
      const title = document.title;
      window.onblur = () => {
        document.title = "(つ ェ ⊂)我藏好了哦~";
      };
      window.onfocus = () => {
        document.title = "(*゜ロ゜)ノ被发现了~";
        setTimeout(() => {
          document.title = title;
        }, 3000);
      };
      document.title = "blog"; // 修改title
      if (JSON.stringify(store.state.webConfig) === "{}") {
        methods.getWebConfigInfo();
      }
    }),
      onMounted(() => {
        let images: string = "/@/assets/images/winter1.png";
        const month: number = new Date().getMonth() + 1;
        switch (month) {
          case 3:
          case 4:
          case 5:
            console.log("春天来了,动物们又到了繁殖的季节");
            images = "/@/assets/images/spring2.png";
            break;
          case 6:
          case 7:
          case 8:
            console.log("夏天来了,人们又到了吃瓜的季节");
            images = "/@/assets/images/summer.png";
            break;
          case 9:
          case 10:
          case 11:
            console.log("秋天来了,蔬果们又到了收获的季节");
            images = "/@/assets/images/autumn.png";
            break;
          case 12:
          case 1:
          case 2:
            console.log("冬天来了,又到了作死的季节");
            images = "/@/assets/images/winter1.png";
            break;
        }

        const elment: any = document.body;
        elment.width = window.innerWidth;
        elment.height = window.innerHeight;

        // 调用雪花插件
        // snowfall.snow(elment, {
        //   image: images,
        //   minSize: 10,
        //   maxSize: 35,
        //   flakeCount: 30,
        // });
      });
  },
};
</script>

<style>
</style>
