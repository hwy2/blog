<template >
  <div id="commentList"></div>
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
export default defineComponent({
  name: "commentList",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({});
    const methods = {};
    onBeforeMount(() => {
      document.title = "评论列表";
    });
    onMounted(() => {});
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#commentList {
}
</style>