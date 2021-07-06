<template>
  <div id="postIndex">

  </div>
</template>

<script lang="ts">
import {
  toRefs,
  reactive,
  onBeforeMount,
  onMounted,
  defineComponent,
  getCurrentInstance
} from "vue";
export default defineComponent({
  name: "Index",
  setup: () => {
    const {ctx} = getCurrentInstance()
    const state = reactive({
      //vue2.x的data参数
      testMsg: "data参数",
    });
    const methods ={
      getAricleList: function(){
        ctx.$axios.get('/article/list')
      }
    }
    onBeforeMount(() => {
      //挂载开始之前
    });
    onMounted(() => {
      //挂载之后
    });
    return { ...toRefs(state),methods };
  },
});
</script>

<style lang="less">
#postIndex {
  width: 100%;
  min-height: 680px;
  box-sizing: border-box;
}
@media (max-width: 640px) {
  #postIndex {
    width: 100%;
    min-height: 590px;
  }
}
</style>>
