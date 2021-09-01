<template>
  <div id="articleList">
      <div class="container">
          
      </div>
  </div>
</template>
<script lang="ts">
import dateFormat from "/@/assets/js/dateFormat.js";
import {
  toRefs,
  reactive,
  onBeforeMount,
  onMounted,
  defineComponent,
  getCurrentInstance,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
export default defineComponent({
  setup: () => {
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const store = useStore();

    // vue2.x的data参数
    const state = reactive({});
    // 方法
    const methods = {};

    onBeforeMount(() => {
      // 挂载开始之前
      document.title = '文章列表'
    });
    onMounted(() => {
      // 挂载之后
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#articleList {
  min-height: 93.3vh;
  width: 100%;
  .container{

  }
}
</style>