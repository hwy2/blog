<template >
    <div id="createPage">
        
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
  onBeforeMount,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "outline",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({});
    const methods = {};
    onBeforeMount(() => {
      document.title = "创建页面";
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
    #createPage{}
</style>