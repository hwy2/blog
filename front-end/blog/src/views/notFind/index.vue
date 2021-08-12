<template>
  <div id="article-main">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 14, offset: 5 }" :xs="24">
          
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>

<style lang="scss">
#article-main {
  min-height: 47.8vh;
  .content {
    .el-col {
      background-color: unset;
     
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