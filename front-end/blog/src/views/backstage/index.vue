<template>
  <div id="backstage">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="methods.handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="1">
        <template #title>控制台</template>
        <el-menu-item index="1-1">概要</el-menu-item>
        <el-menu-item index="1-1">个人设置</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template #title>撰写</template>
        <el-menu-item index="2-1">撰写文章</el-menu-item>
        <el-menu-item index="2-2">创建页面</el-menu-item>
        <el-submenu index="2-4">
          <template #title>选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="3">
        <template #title>管理</template>
        <el-menu-item index="3-1">文章</el-menu-item>
        <el-menu-item index="3-2">页面</el-menu-item>
        <el-menu-item index="3-3">评论</el-menu-item>
        <el-menu-item index="3-4">分类</el-menu-item>
        <el-menu-item index="3-5">文件</el-menu-item>
        <el-menu-item index="3-6">用户</el-menu-item>
        <el-menu-item index="3-7">友情链接</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template #title>设置</template>
        <el-menu-item index="4-1">基本</el-menu-item>
      </el-submenu>
    </el-menu>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
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
    const methods = {
      handleSelect(key: string, keyPath: string) {
        console.log(key, keyPath);
      },
    };
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