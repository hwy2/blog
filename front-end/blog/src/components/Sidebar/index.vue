<template>
  <div class="Sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="vertical"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-sub-menu :index="route.name" v-for="route in urlList">
        <template #title>{{ (route.meta as any).title }}</template>
        <el-menu-item
          :index="children.path"
          v-for="children in route.children"
          >{{ (children.meta as any).title }}</el-menu-item
        >
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="Sidebar">
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { backstageRouteRe } from "../../router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
const activeIndex = computed({
  get: () => {
    return store.state.backstage.activeIndex;
  },
  set: (val) => {
    store.commit("backstage/setActiveIndex", val);
  }
});
const urlList = ref<Array<any>>([]);
const user = ref<any>({});
/**
 * 导航栏选中index
 */
const handleSelect = (key: string, keyPath: string) => {
  // console.log(key, keyPath);
  activeIndex.value = key;
};

const handleESelectroleUrl = () => {
 urlList.value = backstageRouteRe.map((item) => {
    item.children = item.children?.map((items: any) => {
      let role:Array<number> =items.meta.role
      if (role.includes(parseInt(user.value.role))){
        return items
      }
      
    });
    return item;
  });
  console.log(urlList.value)
};

onMounted(() => {
  if (proxy.$Cookies.get("user")) {
    user.value = JSON.parse(proxy.$Cookies.get("user"));
    handleESelectroleUrl();
  } else {
    router.push({ name: "login" });
  }
});
</script>

<style lang="scss">
.Sidebar {
  height: 100vh;
  overflow: hidden;
  &::-webkit-scrollbar {
    width: 5px;
  }
  .el-menu {
    height: 100%;
    overflow-y: auto;
    .is-active {
      background-color: #4e7e8c;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #aaa;
      border-radius: 10px;
    }
  }
}
</style>
