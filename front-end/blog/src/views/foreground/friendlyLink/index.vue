<template>
  <div id="friendlyLink">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 22, offset: 1 }" :xs="24">
          <el-row>
            <el-col :md="{ span: 6, offset: 0 }" :xs="24">
              <el-card class="box-card" @click="applyForLinks">
                <div class="card-media">
                  <main
                    class="laz"
                    style="background-image: url('/src/assets/images/sidebar.jpg')"
                  ></main>
                  <!-- <img :src="item.image" alt="头像" /> -->
                </div>
                <div class="text-center">
                  <img src="@/assets/images/sidebar.jpg" alt="头像" />
                  <p>申请友链</p>
                  <p>点此进行申请</p>
                </div>
              </el-card>
            </el-col>
            <el-col
              :md="{ span: 6, offset: 0 }"
              :xs="24"
              v-for="(item, index) in friendlyLink"
              :key="index"
            >
              <a :href="item.URL" target="_blank">
                <el-card class="box-card" :title="item.description">
                  <div class="card-media">
                    <main
                      class="laz"
                      :style="
                        item.image
                          ? 'background-image: url(' + item.image + ');'
                          : ''
                      "
                    ></main>
                    <!-- <img :src="item.image" alt="头像" /> -->
                  </div>
                  <div class="text-center">
                    <img :src="item.image" alt="头像" />
                    <p>{{ item.name }}</p>
                    <p>{{ item.description }}</p>
                  </div>
                </el-card>
              </a>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-dialog
    title="申请友链"
    v-model="dialogTableVisible"
    style="background-color: #fff"
  >
    <el-form
      :model="formLinks"
      :rules="rulesLinks"
      ref="ruleForm"
      label-position="left"
      @submit.enter.prevent
    >
      <el-form-item label="链接名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="formLinks.name"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="URL" :label-width="formLabelWidth">
        <el-input v-model="formLinks.URL"></el-input>
      </el-form-item>
      <el-form-item label="链接分类" prop="sort" :label-width="formLabelWidth">
        <el-input v-model="formLinks.sort"></el-input>
      </el-form-item>
      <!-- <p>建议以英文字母开头，只包含字母与数字</p> -->
      <el-form-item label="链接图片" prop="image" :label-width="formLabelWidth">
        <el-input v-model="formLinks.image"></el-input>
      </el-form-item>
      <!-- <p>需要以http://开头，留空表示没有链接图片</p> -->
      <el-form-item
        label="链接描述"
        prop="description"
        :label-width="formLabelWidth"
      >
        <el-input type="textarea" v-model="formLinks.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          style="margin-left: auto"
          type="primary"
          @click="submitAddForm('ruleForm')"
          >增加链接</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  onBeforeMount
} from "vue";
import { ElNotification,ElMessage  } from 'element-plus'


const { proxy }: any = getCurrentInstance();
const dialogTableVisible = ref<boolean>(false);
const friendlyLink = ref<Array<any>>([]);
const condition = reactive({
  currPage: 1,
  pageSize: 10,
  state: 1
});
const formLinks = reactive({
  name: "",
  URL: "http://",
  sort: "",
  image: "http://",
  description: "",
  state: 0
});
const rulesLinks = reactive({
  name: [
    { required: true, message: "请输入链接名称", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  URL: [
    { required: true, message: "请输入链接地址", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  sort: [
    { required: false, message: "请输入链接分类", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  image: [
    { required: false, message: "请输入图片地址", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ],
  description: [
    { required: false, message: "请输入描述", trigger: "blur" },
    {
      min: 1,
      max: 255,
      message: "长度在 1 到 255 个字符",
      trigger: "blur"
    }
  ]
});
const formLabelWidth = ref<string>("120px");
const getFriendlyLink = () => {
  proxy.$axios
    .get("/links/list", condition)
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
        friendlyLink.value = res.result.list;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
/**
 * 新增链接
 */
const submitAddForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    console.log(valid)
    if (valid) {
      proxy.$axios
        .post("/links/apply", formLinks)
        .then((res: any) => {
          console.log(res);
          dialogTableVisible.value = false;
          if (res.code === "200") {
            ElNotification({
              title: "成功",
              message: "申请成功，等待站长审核",
              type: "success"
            });
            formLinks.URL = "http://";
            formLinks.image = "http://";
            formLinks.name = formLinks.sort = formLinks.description = "";
            formLinks.state = 0;
          } else {
            ElNotification({
              title: "错误",
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      ElNotification({
        title: "错误",
        message: "必填项不能为空",
        type: "error",
        duration:8000
      });
      return false;
    }
  });
};

const applyForLinks = () => {
  dialogTableVisible.value = true;
};

onBeforeMount(() => {
  document.title = "友情链接列表";
});

onMounted(() => {
  getFriendlyLink();
});
</script>

<style lang="scss">
#friendlyLink {
  min-height: 47.8vh;
  .content {
    padding-top: 30px;
    .box-card {
      background-color: #fff;
      margin: 0 15px 15px 0;
      cursor: pointer;
      .el-card__body {
        padding: 0;
      }
      .card-media {
        main {
          width: 100%;
          height: 80px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 50% 50%;
          filter: blur(6px);
          -webkit-filter: blur(6px);
        }
      }
      .text-center {
        padding: 8px;
        box-sizing: border-box;
        text-align: center;
        img {
          border-radius: 50px;
          width: 60px;
          height: 60px;
          margin: -42px auto 0;
          position: relative;
          z-index: 10;
        }
        p:nth-of-type(1) {
          display: block;
          font-size: 23px;
          margin-bottom: 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          user-select: none;
        }
        p:nth-of-type(2) {
          display: block;
          font-size: 15px;
          min-height: 25px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          user-select: none;
        }
      }
    }
  }
}
.el-dialog {
  background-color: #fff;
  label {
    margin: 0 !important;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
    .el-form-item__content {
      display: flex;
    }
  }
  .el-form-item {
    .el-form-item__label {
      align-items: center;
    }
  }
}

@media (max-width: 800px) {
  #friendlyLink {
    .content {
      width: 100%;
      margin: 0 auto;
      padding: 20px 10px;
      .box-card {
        margin: 0 0 15px 0;
      }
    }
  }
  .el-dialog {
    width: 95%;
  }
}
</style>
