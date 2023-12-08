<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/notification/style/css";

const snowflake = (images:string) => {
  const elment: any = document.body;
  elment.width = window.innerWidth;
  elment.height = window.innerHeight;
  setInterval(function () {
    var rain: any = document.createElement("div");
    rain.style.position = "fixed";
    rain.style.transition = "all 0.3s";
    let random = Math.random() * 50;
    rain.style.height = random + "px";
    rain.style.width = random + "px";
    rain.style.background = `url('${images}') center center no-repeat`; //可以使用雨滴图片代替，懒没找
    rain.style.backgroundSize = "cover";
    rain.style.filter = "blur(1px)";
    rain.style.top = "0px";
    rain.style.opacity = (Math.random() * 10) / 10;
    rain.style.left = Math.random() * 1920 + "px";
    document.body.appendChild(rain);
    var t = 1;
    var timer = setInterval(function () {
      var height = parseInt(rain.style.top);
      t++;
      rain.style.top = height + 2 *10 + "px"; // 模拟物体下落的公式

      if (parseInt(rain.style.top) >= window.innerHeight) {
        clearInterval(timer); //删掉也可以，直接移除元素就不用停止循环调用
        rain.remove();
      }
    }, 100);
  }, 150);
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
});
onMounted(() => {
  let images: string = "/src/assets/images/winter1.png";
  const month: number = new Date().getMonth() + 1;
  switch (month) {
    case 3:
    case 4:
    case 5:
      console.log("春天来了,动物们又到了繁殖的季节");
      images = "/src/assets/images/spring2.png";
      break;
    case 6:
    case 7:
    case 8:
      console.log("夏天来了,人们又到了吃瓜的季节");
      images = "/src/assets/images/summer.png";
      break;
    case 9:
    case 10:
    case 11:
      console.log("秋天来了,蔬果们又到了收获的季节");
      images = "/src/assets/images/autumn.png";
      break;
    case 12:
    case 1:
    case 2:
      console.log("冬天来了,又到了作死的季节");
      images = "/src/assets/images/winter1.png";
      break;
  }
  // 调用雪花组件
  // snowflake(images)
});
</script>
