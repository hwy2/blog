<template>
  <div id="profile" :style="clientHeight">
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
          <p>角色： <b>{{ user?.role == 1 ? "管理员" : "用户" }}</b></p>
          <p>邮箱： <b>{{ user?.email }}</b></p>
          <p>邮箱是否验证：<b style="color: cornflowerblue;">{{ user?.state== 1 ? "已验证" : "未验证" }}</b> </p>

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
              <div class="flex">
                <el-form-item label="生日" prop="birth">
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
              </div>
              <el-form-item label="头像" prop="face">
                <!-- <el-input v-model="formUserInfo.face"></el-input> -->
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :http-request="uploadFile"
                  :before-upload="beforeUpload"
                  :on-change="uploadChange"
                  :limit="1"
                  :on-remove="uploadRemove"
                  v-model:file-list="fileList"
                  :on-preview="handlePictureCardPreview"
                  :on-exceed="uploadExceed"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item label="城市" prop="city">
                <el-input v-model="formUserInfo.city"></el-input>
              </el-form-item>
              <el-form-item label="具体地址" prop="address">
                <el-input v-model="formUserInfo.address"></el-input>
              </el-form-item>
              <el-form-item label="个人简介" prop="synopsis">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="formUserInfo.synopsis"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >更新个人信息</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="content-right">
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
                <el-button type="primary" @click="submitPwdForm('passwordForm')"
                  >更新密码</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="update-password email-calibration" v-if="user.state == 0">
            <div class="title">
              <p>邮箱验证</p>
            </div>
            <el-form
              label-position="top"
              label-width="80px"
              :model="formUser"
              ref="emailForm"
            >
              <el-form-item
                label="邮箱号"
                prop="email"
                :rules="[
                  {
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                  },
                  {
                    type: 'email',
                    message: '请输入正确的电子邮件地址',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input v-model="formUser.email"></el-input>
              </el-form-item>
              <p>用户创建是输入的邮箱号</p>
              <el-form-item
                label="验证码"
                prop="captcha"
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input v-model="formUser.captcha"></el-input>
                <el-button type="primary" @click="postCaptcha"
                  >发送验证码</el-button
                >
              </el-form-item>
              <p>请输入邮箱收到的验证码</p>
              <el-form-item>
                <el-button type="primary" @click="verifyEmail('emailForm')">
                  验证邮箱
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="imgdialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="profile">
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
const user = ref<any>({});
const formUserInfo = reactive({
  uuid: "",
  nickName: "",
  birth: "",
  sex: 0,
  face: "",
  city: "",
  address: "",
  synopsis: ""
});
const rules = reactive({
  nickName: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ],
  face: [
    { required: true, message: "请输入头像链接", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ],
  birth: [
    {
      type: "date",
      required: true,
      message: "请选择日期",
      trigger: "change"
    }
  ],
  city: [
    { required: true, message: "请输入城市", trigger: "blur" },
    {
      min: 2,
      max: 255,
      message: "长度在 2 到 255 个字符",
      trigger: "blur"
    }
  ],
  address: [
    { required: true, message: "请输入地址", trigger: "blur" },
    {
      min: 2,
      max: 255,
      message: "长度在 2 到 255 个字符",
      trigger: "blur"
    }
  ]
});
const formUser = reactive({
  oldPwd: "",
  newPwd: "",
  email: "",
  captcha: ""
});
const rulesPwd = reactive({
  oldPwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 255,
      message: "长度在 6 到 255 个字符",
      trigger: "blur"
    }
  ],
  newPwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 255,
      message: "长度在 6 到 255 个字符",
      trigger: "blur"
    }
  ]
});
const dataSummary: any = computed({
  get: () => {
    return store.state.backstage.dataSummary;
  },
  set: (val) => {
    store.commit("backstage/setDataSummary", val);
  }
});
const clientHeight = computed(() => {
  let height: number = document.documentElement.clientHeight;
  height = height - 68;
  return "min-height:" + height + "px";
});
const file = ref<File>(); //上传的文件
const isUpload = ref<boolean>(false); //是否有上传
const fileList = ref<Array<any>>([]); //图片列表
const imgdialogVisible = ref<boolean>(false); //图片弹窗
const dialogImageUrl = ref<string>("");

/**
 * 修改个人信息
 */
const submitForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      if (isUpload.value) {
        uploadFile(file.value)
          .then((res: any) => {
            formUserInfo.face = res.result.fileList[0].absoluteUrl;
            isUpload.value = false;
            updateUserInfo();
          })
          .catch((err) => {
            ElMessage.error("上传文件文件失败", err);
          });
      } else {
        updateUserInfo();
      }
    } else {
      ElNotification({
        title: "错误",
        message: "必填项不能为空",
        type: "error"
      });
      return false;
    }
  });
};
/**
 * 获取用户信息
 */
const getUserInfo = () => {
  proxy.$axios
    .get("/user/info", { userUuid: user.value.uuid })
    .then((res: any) => {
      if (res.code === "200") {
        proxy.$Cookies.set("user", JSON.stringify(res.result.user));
        user.value = res.result.user;
        formUserInfo.uuid = res.result.user.userInfo.uuid;
        formUserInfo.nickName = res.result.user.userInfo.nickName;
        formUserInfo.birth = res.result.user.userInfo.birth;
        formUserInfo.sex = res.result.user.userInfo.sex;
        formUserInfo.face = res.result.user.userInfo.face;
        formUserInfo.city = res.result.user.userInfo.city;
        formUserInfo.address = res.result.user.userInfo.address;
        formUserInfo.synopsis = res.result.user.userInfo.synopsis;
        formUser.email = res.result.user.email;
        fileList.value = [];
        fileList.value.push({
          name: "face",
          url: formUserInfo.face
        });
      }
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
};
/**
 * 修改密码
 */
const submitPwdForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      proxy.$axios
        .put("/user/pwd", {
          userUuid: (user.value as any).uuid,
          oldPwd: formUser.oldPwd,
          newPwd: formUser.newPwd
        })
        .then((res: any) => {
          if (res.code === "200") {
            ElNotification({
              title: "成功",
              message: "密码修改成功",
              type: "success"
            });
            formUser.oldPwd = "";
            formUser.newPwd = "";
          } else {
            ElNotification({
              title: "失败",
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
        type: "error"
      });
      return false;
    }
  });
};

/**
 * 上传前校验
 */
const beforeUpload = (file: any) => {
  console.log("file.type", file.type);
  // 类型判断
  const isAPK = ["image/png", "image/jpg", "image/jpeg"].includes(file.type);
  // 大小判断
  const is1M = file.size / 1024 / 1024 < 1;
  if (!isAPK) {
    // 类型不匹配
    ElMessage.error("上传文件只能是 png，jpg  格式!");
  }
  if (!is1M) {
    // 大小不匹配
    ElMessage.error("上传文件大小不能超过 1MB !");
  }
  // 返回 false 阻断 true 正常上传
  return isAPK && is1M;
};
/**
 * 自定义上传
 */
const uploadFile = (param: any) => {
  console.log("hhh", param);
  return new Promise((rev, rej) => {
    const data = new FormData();
    data.append("files", param);
    data.append("userUuid", user.value.uuid);
    proxy.$axios
      .post("/common/enclosure", data)
      .then((resp: any) => rev(resp))
      .catch((error: any) => rej(error));
  });
};
/**
 * 上传前的change事件
 * @param uploadFile
 */
const uploadChange = (uploadFile: any) => {
  console.log(uploadFile);
  file.value = uploadFile.raw;
  beforeUpload(uploadFile.raw);
  isUpload.value = true;
};
/**
 * 上传前的remove事件
 * @param uploadFile
 */
const uploadRemove = (uploadFile: any) => {
  console.log("处罚法");
  isUpload.value = false;
};
/**
 * 修改用户信息
 */
const updateUserInfo = () => {
  proxy.$axios
    .put("/userInfo/upinfo", {
      userInfo: formUserInfo
    })
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: "用户信息更新成功",
          type: "success"
        });
        getUserInfo();
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
};
/**
 * 上传超限制
 */
const uploadExceed = (uploadFile: any) => {
  ElMessage.error("只能上传一个图片，如需修改请删除之前的图片");
};
/**
 * 查看图片
 * @param uploadFile
 */
const handlePictureCardPreview = (uploadFile: any) => {
  console.log("1232313");
  dialogImageUrl.value = uploadFile.url!;
  imgdialogVisible.value = true;
};
/**
 * 发送验证码
 */
const postCaptcha = () => {
  proxy.$axios
    .post("/user/emailPost", {
      userUuid: user.value.uuid,
      email: formUser.email
    })
    .then((res: any) => {
      if (res.code === "200") {
        ElNotification.success("发送验证码成功");
      } else {
        ElNotification.error(res.msg);
      }
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
};

const verifyEmail = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      proxy.$axios
        .post("/user/captchaEmail", {
          userUuid: user.value.uuid,
          email: formUser.email,
          captcha: formUser.captcha
        })
        .then((res: any) => {
          if (res.code === "200") {
            ElNotification.success("邮箱验证成功");
            getUserInfo();
          } else {
            ElNotification.error(res.msg);
          }
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  });
};

onBeforeMount(() => {
  document.title = "个人设置";
});
onMounted(() => {
  if (proxy.$Cookies.get("user")) {
    user.value = JSON.parse(proxy.$Cookies.get("user"));
    getUserInfo();
  } else {
    router.push({ name: "login" });
  }
});
</script>

<style lang="scss">
#profile {
  background-color: #f6f6f3;
  min-height: 93.5vh;
  color: #444;
  padding-bottom: 10%;

  .container {
    width: 95%;
    margin: 0 auto;
    .pageTitle {
      padding: 1.5% 0;
      h2 {
        font-size: 1.2em;
      }
    }

    .page-main {
      display: flex;
      .content-pane,
      .content-right {
        width: 50%;
        padding-right: 30px;
        box-sizing: border-box;
        .title {
          p {
            padding: 0 0 1.5%;
            font-size: 1.2em;
            font-weight: bold;
          }
        }
        .el-form {
          .flex {
            display: flex;
            .el-form-item {
              width: 50%;
              box-sizing: border-box;
            }
          }
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
        width: 25%;
        padding-right: 30px;
        box-sizing: border-box;

        p {
          font-size: 87.5%;
          line-height: 1.5;
          padding: 1% 0;

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
      .content-right {
        width: 25%;
        padding-right: 0px;
        .email-calibration {
          .el-form {
            .el-form-item:nth-of-type(2) {
              .el-input {
                width: 50%;
              }
              .el-button {
                margin-left: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
