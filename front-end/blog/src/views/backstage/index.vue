<template>
  <div id="backstage">
    <el-row>
      <el-col :md="{ span: 18, offset: 3 }" :xs="24">
          scss
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "backstage",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({});
    const methods = {};
    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#backstage {
  background-color: #999;
  width: 100%;
  height: 100vh;
}
</style>