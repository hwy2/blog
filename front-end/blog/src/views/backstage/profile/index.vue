<template>
  <div id="profile">
    <div class="container">
      <div class="pageTitle">
        <h2>个人设置</h2>
      </div>
      <div class="page-main">
        <div class="content-left">
          <p>
            <el-image :src="user?.userInfo?.face">
              <template #error>
                <div class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
          </p>
          <p>
            {{ user?.userInfo?.nickName }}
          </p>
          <p>
            {{ user?.role }}
          </p>
          <p>
            目前有<span>{{ dataSummary?.articlesTotal }}</span> 篇文章, 并有
            <span>{{ dataSummary?.commentsTotal }}</span> 条关于你的评论在
            <span>{{ dataSummary?.categoriesTotal }}</span> 个分类中.
          </p>
        </div>
        <div class="content-pane">
          <div class="personal-data">
            <div class="title">
              <p>个人资料</p>
            </div>
            <el-form
              label-position="top"
              label-width="80px"
              :model="formUserInfo"
              :rules="rules"
              ref="ruleForm"
            >
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="formUserInfo.nickName"></el-input>
              </el-form-item>
              <p>
                用户昵称可以与用户名不同, 用于前台显示. 如果你将此项留空,
                将默认使用用户名.
              </p>
              <el-form-item label="生日">
                <el-date-picker
                  v-model="formUserInfo.birth"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio v-model="formUserInfo.sex" label="1" border
                  >男</el-radio
                >
                <el-radio v-model="formUserInfo.sex" label="0" border
                  >女</el-radio
                >
              </el-form-item>
              <el-form-item label="头像" prop="face">
                <el-input v-model="formUserInfo.face"></el-input>
              </el-form-item>
              <el-form-item label="城市" prop="city">
                <el-input v-model="formUserInfo.city"></el-input>
              </el-form-item>
              <el-form-item label="具体地址" prop="address">
                <el-input v-model="formUserInfo.address"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="methods.submitForm('ruleForm')"
                  >更新个人信息</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="update-password">
            <div class="title">
              <p>密码修改</p>
            </div>
            <el-form
              label-position="top"
              label-width="80px"
              :model="formUser"
              :rules="rulesPwd"
              ref="passwordForm"
            >
              <el-form-item label="原密码" prop="oldPwd">
                <el-input show-password v-model="formUser.oldPwd"></el-input>
              </el-form-item>
              <p>原密码，用于验证密码是否正确</p>
              <el-form-item label="新密码" prop="newPwd">
                <el-input show-password v-model="formUser.newPwd"></el-input>
              </el-form-item>
              <p>
                为此用户分配一个密码.
                建议使用特殊字符与字母、数字的混编样式,以增加系统安全性.
              </p>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="methods.submitPwdForm('passwordForm')"
                  >更新密码</el-button
                >
              </el-form-item>
            </el-form>
          </div>
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
  onBeforeMount
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "profile",
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      user: {},
      formUserInfo: {
        uuid: "",
        nickName: "",
        birth: "",
        sex: 0,
        face: "",
        city: "",
        address: "",
      },
      rules: {
        nickName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "blur",
          },
        ],
        face: [
          { required: true, message: "请输入头像链接", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "长度在 3 到 255 个字符",
            trigger: "blur",
          },
        ],
        city: [
          { required: true, message: "请输入城市", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      formUser: {
        oldPwd: "",
        newPwd: "",
      },
      rulesPwd: {
        oldPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6 到 255 个字符",
            trigger: "blur",
          },
        ],
        newPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      dataSummary: computed({
        get: () => {
          return store.state.backstage.dataSummary;
        },
        set: (val) => {
          store.commit("backstage/setDataSummary", val);
        },
      }),
    });
    const methods = {
      /**
       * 修改个人信息
       */
      submitForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .put("/userInfo/upinfo", {
                userInfo: state.formUserInfo,
              })
              .then((res: any) => {
                console.log(res);
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "用户信息更新成功",
                    type: "success",
                  });
                  methods.getUserInfo();
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
      /**
       * 获取用户信息
       */
      getUserInfo() {
        proxy.$axios
          .get("/user/info", { userUuid: (state.user as any).uuid })
          .then((res: any) => {
            if (res.code === "200") {
              proxy.$Cookies.set("user", JSON.stringify(res.result.user));
              state.user = res.result.user;
              location.reload();
            }
            console.log(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      },
      /**
       * 修改密码
       */
      submitPwdForm(formName: string) {
        proxy.$refs[formName].validate((valid: any) => {
          if (valid) {
            proxy.$axios
              .put("/user/pwd", {
                userUuid: (state.user as any).uuid,
                oldPwd: state.formUser.oldPwd,
                newPwd: state.formUser.newPwd,
              })
              .then((res: any) => {
                if (res.code === "200") {
                  ElNotification({
                    title: "成功",
                    message: "密码修改成功",
                    type: "success",
                  });
                  state.formUser.oldPwd = "";
                  state.formUser.newPwd = "";
                } else {
                  ElNotification({
                    title: "失败",
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
    onBeforeMount(()=>{
      document.title="个人设置";
    })
    onMounted(() => {
      state.user = JSON.parse(proxy.$Cookies.get("user"));
      state.formUserInfo = {
        uuid: (state.user as any).userInfo.uuid,
        nickName: (state.user as any).userInfo.nickName,
        birth: (state.user as any).userInfo.birth,
        sex: (state.user as any).userInfo.sex,
        face: (state.user as any).userInfo.face,
        city: (state.user as any).userInfo.city,
        address: (state.user as any).userInfo.address,
      };
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>

<style lang="scss">
#profile {
  background-color: #f6f6f3;
  min-height: 93.5vh;
  color: #444;
  padding-bottom: 10%;

  .container {
    width: 70%;
    margin: 0 auto;
    .pageTitle {
      padding: 1.5% 0;
      h2 {
        font-size: 1.2em;
      }
    }

    .page-main {
      display: flex;
      .content-pane {
        width: 70%;
        padding-right: 20%;
        box-sizing: border-box;
        .title {
          p {
            padding: 0 0 1.5%;
            font-size: 1.2em;
            font-weight: bold;
          }
        }
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

        .update-password {
          padding-top: 5%;
        }
      }
      .content-left {
        width: 30%;
        padding-right: 10%;
        box-sizing: border-box;

        p {
          font-size: 87.5%;
          line-height: 1.5;

          .el-image {
            width: 222px;
            height: 222px;
            border: 1px dashed #d9d9d6;
          }

          span {
            font-style: italic;
            font-weight: bold;
          }
        }
        p:nth-of-type(2) {
          font-size: 1.8em;
          font-weight: normal;
          color: #333;
          padding: 1% 0;
        }
        p:nth-of-type(3) {
          padding: 1% 0;
        }
      }
    }
  }
}
</style>