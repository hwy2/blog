<template >
  <div id="friendlyLink">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 16, offset: 4 }" :xs="24">
          <el-row>
            <el-col
              :md="{ span: 6, offset: 0 }"
              :xs="24"
              v-for="(item, index) in friendlyLink"
              :key="index"
            >
              <el-card class="box-card"></el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
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
    const state = reactive({
      friendlyLink: [],
    });
    const methods = {
      getFriendlyLink(){
        // proxy.get('/')
      }
    };
    onBeforeMount(() => {
      document.title = "友情链接列表";
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
#friendlyLink {
  min-height: 47.8vh;
  .content {
    .box-card{
      background-color: #fff;
    }
  }
}

@media (max-width: 800px) {
  #article-main {
    .content {
      width: 100%;
      margin: 0 auto;
      .el-col {
      }
    }
  }
}
</style>