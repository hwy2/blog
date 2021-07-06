<template>
    <header
      class="
        p-4
        pb-0
        shadow-lg
        flex
        items-center
        justify-between
        pb-4
        text-white
      "
    >
      <!-- logo -->
      <div class="mb-4 md:mb-0">
        <h1 class="leading-none text-xl md:text-2xl text-gray-darkest">
          <i 
            class="
              iconfont
              icongengduo
              text-xl
              md:text-2xl
              text-white
              mr-4
              hover:text-gray-400
            "
          ></i>
          <a
            href="/"
            class="no-underline text-gray-darkest hover:text-gray-400"
            >{{ title }}</a
          >
        </h1>
      </div>
      <!-- search -->
      <div class="mb-4 md:mb-0">
        <h1>
          <i class="text-xl md:text-2xl iconfont iconsearch hover:text-gray-400"></i>
        </h1>
      </div>
    </header>
</template>

<script lang="ts">
import {
  toRefs,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  defineComponent,
} from "vue";
export default defineComponent({
  name: "Header",
  setup: () => {
    const state = reactive({
      //vue2.x的data参数
      title: "黄文勇的技术站",
    });
    const methods = {
      
    }
    onBeforeMount(() => {
      //挂载开始之前
    });
    onMounted(() => {
      //挂载之后
    });
    onBeforeUpdate(() => {
      //数据更新时调用
    });
    onUpdated(() => {
      //数据更新后调用
    });
    onBeforeUnmount(() => {
      //实例销毁之前调用
    });
    onUnmounted(() => {
      // 实例销毁后调用
    });
    return { ...toRefs(state),methods };
  },
});
</script>

<style >
</style>
