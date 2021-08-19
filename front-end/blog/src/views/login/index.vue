<template>
  <div id="login">
    <div class="content">
      <el-form
        label-position="top"
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        class="clearfix"
        ref="validateForm"
      >
        <div class="item">
          <p>{{ blogTitle }}</p>
        </div>

        <el-form-item prop="account" size="medium">
          <i class="iconfont iconren"></i>
          <el-input placeholder="账户" v-model="ruleForm.account"> </el-input>
        </el-form-item>
        <el-form-item prop="password" size="medium">
          <i class="iconfont iconmobile"></i>
          <el-input
            type="password"
            show-password
            placeholder="密码"
            v-model="ruleForm.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="methods.submitForm('validateForm')"
            >登录</el-button
          >
        </el-form-item>

        <div class="item">
          <a href="javascript:void(0)" @click="methods.fackHome()">返回首页</a>
        </div>
      </el-form>
    </div>
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
  name: "login",
  components: {},
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      blogTitle: computed(() => store.state.foreground.blogTitle), // 网站title
      ruleForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
          {
            mix: 1,
            max: 255,
            message: "账号不能大于255位字符",
            trigger: "blur/change",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            mix: 6,
            max: 255,
            message: "密码不能少于6位",
            trigger: "change",
          },
        ],
      },
    });

    const methods = {
      submitForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            if (state.ruleForm.password.length < 6) {
              ElNotification({
                title: "错误",
                message: `密码不能少于6位`,
                type: "error",
              });
              return;
            }
            methods.login();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      login() {
        proxy.$axios
          .post("/user/login", {
            email: state.ruleForm.account,
            password: state.ruleForm.password,
          })
          .then((res: any) => {
            console.log(res);
            if (res.code === "200") {
              ElNotification({
                title: "成功",
                message: `登录成功，欢迎回来`,
                type: "success",
              });
              proxy.$Cookies.set("accessToken", res.result.accessToken.token, {
                expires: new Date(res.result.accessToken.expiresIn),
              });
              proxy.$Cookies.set("user",JSON.stringify(res.result.user) , {
                expires: new Date(res.result.accessToken.expiresIn),
              });
              setTimeout(() => {
                router.push({
                  name: "backstage",
                });
              }, 500);
            } else {
              ElNotification({
                title: "错误",
                message: res.msg,
                type: "error",
              });
            }
          })
          .catch((err: any) => {
            console.log("err", err);
          });
      },
      fackHome() {
        router.go(-1);
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
#login {
  .content {
    background: url("../../assets/images/bg-admin.jpg") no-repeat center center;
    background-size: cover;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-items: center;
    align-items: center;

    .el-form {
      width: 30%;
      background-color: transparent;
      margin: 0 auto;

      .el-form-item {
        .el-form-item__content {
          width: 65%;
          margin: 0 auto 30px;
          display: flex;
          background-color: #fff;
          border-radius: 50px;
          height: 5vh;
          .iconfont {
            font-size: 1.5em;
            padding: 0 15px;
            line-height: 5vh;
            color: #999;
          }
          .el-input {
            flex-grow: 1;

            input {
              border: 0;
              border-radius: 0 50px 50px 0;
              height: 100%;
              font-size: 1.2em;
            }

            .el-input__suffix {
              i {
                line-height: 5vh;
              }
            }
          }

          .el-button {
            width: 80%;
            border-radius: 50px;
            margin: 0 auto;
            background-color: rgba(102, 177, 255, 0.9);
            border-color: rgba(102, 177, 255, 0.9);
          }
        }
      }

      .el-form-item:nth-of-type(4) {
        .el-form-item__content {
          background-color: transparent;
        }
      }

      .item {
        p {
          font-size: 1.5em;
          font-weight: bold;
          color: #fff;
          text-align: center;
          line-height: 1.8;
          padding-bottom: 0.8rem;
          letter-spacing: 1.5px;
          user-select: none;
        }

        a {
          text-align: center;
          display: block;
          color: #566473;
        }
      }
    }
  }
}
</style>