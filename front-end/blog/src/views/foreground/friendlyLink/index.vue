<template >
  <div id="friendlyLink">
    <div class="content">
      <el-row>
        <el-col :md="{ span: 18, offset: 3 }" :xs="24">
          <el-row>
            <el-col :md="{ span: 6, offset: 0 }" :xs="24">
              <el-card class="box-card" @click="methods.applyForLinks">
                <div class="card-media">
                  <main
                    class="laz"
                    style="background-image: url(/@/assets/images/sidebar.jpg)"
                  ></main>
                  <!-- <img :src="item.image" alt="头像" /> -->
                </div>
                <div class="text-center">
                  <img src="/@/assets/images/sidebar.jpg" alt="头像" />
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
    <el-form :model="formLinks" :rules="rulesLinks" ref="ruleForm">
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
          @click="methods.submitAddForm('ruleForm')"
          >增加链接</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
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
      dialogTableVisible: false,
      friendlyLink: [],
      condition: {
        currPage: 1,
        pageSize: 10,
        state: 1,
      },
      formLinks: {
        name: "",
        URL: "",
        sort: "",
        image: "http://",
        description: "",
        state: 0,
      },
      rulesLinks: {
        name: [
          { required: true, message: "请输入链接名称", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        URL: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          { required: false, message: "请输入链接分类", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        image: [
          { required: false, message: "请输入图片地址", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: false, message: "请输入描述", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
    });
    const methods = {
      getFriendlyLink() {
        proxy.$axios
          .get("/links/list", state.condition)
          .then((res: any) => {
            console.log(res);
            if (res.code === "200") {
              state.friendlyLink = res.result.list;
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      },
      /**
       * 新增链接
       */
      submitAddForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .post("/links/apply", state.formLinks)
              .then((res: any) => {
                console.log(res);
                state.dialogTableVisible = false;
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "申请成功，等待站长审核",
                    type: "success",
                  });
                  state.formLinks = {
                    name: "",
                    URL: "",
                    sort: "",
                    image: "http://",
                    description: "",
                    state: 0,
                  };
                } else {
                  ElNotification({
                    title: "错误",
                    message: res.msg,
                    type: "error",
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
            });
            return false;
          }
        });
      },
      applyForLinks() {
        state.dialogTableVisible = true;
      },
    };
    onBeforeMount(() => {
      document.title = "友情链接列表";
    });
    onMounted(() => {
      methods.getFriendlyLink();
    });
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
    margin: 0;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
    .el-form-item__content {
      display: flex;
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