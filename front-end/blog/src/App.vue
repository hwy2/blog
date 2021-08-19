<template>
    <router-view></router-view>
</template>

<script  lang='ts'>
import { onMounted, onBeforeMount, getCurrentInstance } from "vue";
import snowfall from "./assets/js/snowfall.min.js";
import { useStore } from "vuex";
import router from './router/index.js';
export default {
  name: "App",
  components: {},
  setup() {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const methods = {
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
