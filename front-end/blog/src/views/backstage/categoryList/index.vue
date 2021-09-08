<template >
    <div id="categoryList">
        
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
      document.title = "分类列表";
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
    #categoryList{}
</style>