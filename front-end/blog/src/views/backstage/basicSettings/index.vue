<template>
  <div id="basicSettings">
    <div class="container">
      <div class="page-title">
        <h2>基本设置</h2>
      </div>
      <div class="page-main">
        <div class="content-left"></div>
        <div class="content-pane">
          <el-form
            label-position="top"
            label-width="80px"
            :model="webConfig"
            :rules="rulesWebConfig"
            ref="webConfigForm"
          >
            <el-form-item label="站点名称" prop="siteName">
              <el-input v-model="webConfig.siteName"></el-input>
            </el-form-item>
            <p>站点的名称将显示在网页的标题处.</p>
            <el-form-item label="站点地址" prop="siteAddress">
              <el-input v-model="webConfig.siteAddress"></el-input>
            </el-form-item>
            <p>站点地址主要用于生成内容的永久链接</p>
            <el-form-item label="站点描述" prop="siteDescription">
              <el-input v-model="webConfig.siteDescription"></el-input>
            </el-form-item>
            <p>站点描述将显示在网页代码的头部.</p>
            <el-form-item label="关键词" prop="keyWord">
              <el-input v-model="webConfig.keyWord"></el-input>
            </el-form-item>
            <p>请以半角逗号 "," 分割多个关键字.</p>
            <el-form-item label="网站作者" prop="authorName">
              <el-input v-model="webConfig.authorName"></el-input>
            </el-form-item>
            <p>前台首页抽屉顶部显示的作者名称</p>
            <el-form-item label="建站时间" prop="runningTime">
              <el-date-picker
                v-model="webConfig.runningTime"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <p>创建网站时间，用于计算网站存在时间</p>
            <el-form-item label="工信部备案号" prop="recordNumber">
              <el-input v-model="webConfig.recordNumber"></el-input>
            </el-form-item>
            <p>工信部备案号</p>
            <el-form-item label="网警备案号" prop="internetAlert">
              <el-input v-model="webConfig.internetAlert"></el-input>
            </el-form-item>
            <p>网警备案号</p>

            <el-form-item>
              <el-button
                type="primary"
                @click="methods.submitWebConfigForm('webConfigForm')"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
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
  name: "basicSettings",
  components: {},
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      // vue2.x的data参数
      webConfig: {
        siteName: "",
        siteAddress: "",
        authorName: "",
        runningTime: "",
        siteDescription: "",
        keyWord: "",
        recordNumber: "",
        internetAlert: "",
      },
      rulesWebConfig: {
        siteName: [
          { required: true, message: "请输入站点名称", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "blur",
          },
        ],
        siteAddress: [
          { required: true, message: "请输入站点永久链接", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
        authorName: [
          { required: true, message: "请输入作者名称", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
        runningTime: [{ type:'date', required: true, message: "建站时间", trigger: "blur" }],
        siteDescription: [
          { required: false, message: "站点描述", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
        keyWord: [
          { required: false, message: "站点关键词", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
        recordNumber: [
          { required: true, message: "请输入工信部备案号", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
        internetAlert: [
          { required: false, message: "请输入网警备案号", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "change",
          },
        ],
      },
    });

    const methods = {
      submitWebConfigForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .put("/webConfig/update", {
                webConfig: state.webConfig,
              })
              .then((res: any) => {
                console.log(res);
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "用户信息更新成功",
                    type: "success",
                  });
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
    };
    onBeforeMount(() => {
      // 挂载之前
      document.title = '基本设置';
    });
    onMounted(() => {
      // 挂载之后
      const webConfig: any = store.getters["foreground/getWebConfig"];
      delete webConfig.createDate;
      delete webConfig.updateDate;
      state.webConfig = webConfig;
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#basicSettings {
  min-height: 93.3vh;
  width: 100%;

  .container {
    width: 70%;
    margin: 0 auto;
    color: #444;
    .page-title {
      padding: 1.5% 0;
      h2 {
        font-size: 1.2em;
      }
    }
    .page-main {
      display: flex;
      .content-left {
        width: 15%;
      }
      .content-pane {
        width: 60%;
        .el-form {
          .el-form-item {
            .el-form-item__label {
              line-height: 1.5;
              font-weight: bold;
            }
          }
          p {
            font-size: 0.8em;
            margin-top: -8px;
            color: #999;
            padding-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>