<template>
  <div id="userList">
    <div class="container">
      <div class="page-title">
        <h2>
          管理用户
          <a href="javascript:void(0)" @click="newlyUser">新增</a>
        </h2>
      </div>
      <div class="page-main">
        <div class="list">
          <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="头像"
              prop="face"
              width="100"
              align="center"
            >
              <template #default="scope">
                <div
                  class="face"
                  @click="
                    handlePictureCardPreview({
                      url: scope.row.userInfo.face
                    })
                  "
                >
                  <img
                    :src="scope.row.userInfo.face"
                    alt="face"
                    style="width: 80px; height: 80px"
                  />
                  <el-icon><ZoomIn /></el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户名" prop="name">
              <template #default="scope">
                <p @click="handleEdit(scope.$index, scope.row)">
                  <span style="user-select: none; color: rgb(70, 123, 150)">{{
                    scope.row.name
                  }}</span
                  >&nbsp;

                  <i
                    style="color: rgb(70, 123, 150); font-size: 0.5em"
                    class="iconfont iconccgl-shujuzidianxiugaijilu-"
                  ></i>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template #default="scope">
                <p>{{ scope.row?.userInfo?.nickName }}</p>
              </template></el-table-column
            >
            <el-table-column label="电子邮件" prop="email"> </el-table-column>
            <el-table-column label="验证邮箱" prop="state">
              <template #default="scope">
                <span>{{ scope.row.state == 0 ? "未验证" : "验证成功" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户组" prop="role">
              <template #default="scope">
                <span>{{ scope.row.role == 1 ? "管理员" : "普通用户" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="生日" prop="birth">
              <template #default="scope">
                <span>
                  {{ dateFormat(scope.row.userInfo.birth, "yyyy-MM-dd") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="sex">
              <template #default="scope">
                <span>
                  {{ scope.row.userInfo.sex == 0 ? "女" : "男" }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="简介" prop="userInfo.synopsis">
            </el-table-column>
            <el-table-column label="日期" prop="createDate" width="150">
            </el-table-column>
            <el-table-column align="right" width="260">
              <template #header style="display: flex">
                <el-input
                  title="根据标题搜索"
                  v-model="search"
                  size="small"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleUpPwd(scope.row)"
                >
                  重置密码
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="operation" style="margin-top: 20px">
            <el-button
              v-if="hideDeletebtn"
              size="small"
              type="danger"
              @click="handleBatchDelete()"
              >删除全部</el-button
            >
            <el-pagination
              :hide-on-single-page="hidePage"
              layout="prev, pager, next"
              :total="userTtotals"
              @next-click="handleChangePage"
              @prev-click="handleChangePage"
              @current-change="handleChangePage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="警告"
      v-model="centerDialogVisible"
      width="30%"
      destroy-on-close
      center
    >
      <span>你确定要删除吗？这将永远在数据库中删除该记录！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteUser(user.uuid)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :title="!addOrModify ? '修改用户' : '新增用户'"
      v-model="newUserVisible"
    >
      <el-form
        class="newUserFome"
        :model="formUser"
        :rules="rulesUser"
        ref="UserForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="formUser.name"
            placeholder="此用户名将作为用户登录时所用的名称."
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formUser.email"
            placeholder="电子邮箱地址将作为此用户的主要联系方式."
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="addOrModify">
          <el-input
            show-password
            v-model="formUser.password"
            placeholder="建议使用特殊字符与字母、数字的混编样式,以增加系统安全性."
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          v-if="addOrModify"
        >
          <el-input
            show-password
            v-model="formUser.confirmPassword"
            placeholder="请确认你的密码, 与上面输入的密码保持一致."
          ></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="role">
          <el-select v-model="formUser.role" placeholder="请选择">
            <el-option label="管理员" value="1"> </el-option>
            <el-option label="普通用户" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input
            v-model="formUser.nickName"
            placeholder="用户昵称可以与用户名不同, 用于前台显示."
          ></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            v-model="formUser.birth"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="formUser.sex" label="1" border>男</el-radio>
          <el-radio v-model="formUser.sex" label="0" border>女</el-radio>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input
            v-model="formUser.city"
            placeholder="你的城市（选填）"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="formUser.address"
            placeholder="你的地址（选填）"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="face">
          <!-- <el-input
            v-model="formUser.face"
            placeholder="用于前台作者头像"
          ></el-input>
          <br />
          <br /> -->
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
        <el-form-item label="简介" prop="synopsis">
          <el-input
            type="textarea"
            :rows="5"
            v-model="formUser.synopsis"
            placeholder="个人简介（选填）"
          ></el-input>
        </el-form-item>
        <!-- <div class="clearfix"></div> -->
        <el-form-item>
          <el-button
            v-if="addOrModify"
            type="primary"
            @click="submitUserForm('UserForm')"
            >新增用户</el-button
          >
          <el-button
            v-if="!addOrModify"
            type="primary"
            @click="submitUserForm('UserForm')"
            >修改用户</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="重置密码" v-model="resetPasswordDialog">
      <el-form
        class="upPwdUserFome"
        :model="formUser"
        :rules="rulesUser"
        ref="UserForm"
        label-position="top"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            show-password
            v-model="formUser.password"
            placeholder="建议使用特殊字符与字母、数字的混编样式,以增加系统安全性."
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            show-password
            v-model="formUser.confirmPassword"
            placeholder="请确认你的密码, 与左侧输入的密码保持一致."
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 20%; margin: 0 auto; display: block"
            type="primary"
            @click="updateUserPwd('UserForm')"
          >
            重置密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="imgdialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="userList">
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  onBeforeMount,
  watch
} from "vue";
// import { useStore } from "vuex";
// import { useRouter } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { Plus, ZoomIn } from "@element-plus/icons-vue";
import dateFormat from "@/assets/js/dateFormat.js";
import { isvalidPass, isvalidUsername } from "@/assets/js/validate.js";
import {
  getUsetListAPI,
  delUsetAPI,
  regUsetAPI,
  updateUsetAPI,
  resetUsetPwdAPI
} from "@/utils/api/user";
import { commonFaceApi } from "@/utils/api/common";

// const store = useStore();
// const router = useRouter();
const { proxy }: any = getCurrentInstance();
const validatePass1 = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!isvalidPass(value)) {
    callback(
      new Error(
        "最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符：!@#$%^&*?"
      )
    );
  } else {
    if (formUser.confirmPassword !== "") {
      proxy.$refs.UserForm.validateField("confirmPassword");
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== formUser.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const validUsername = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else if (!isvalidUsername(value)) {
    callback(new Error("4到16位（字母，数字，下划线，减号）"));
  } else {
    callback();
  }
};

const tableData = ref<Array<any>>([]); //用户数据
const search = ref<string>(""); //搜索
const userTtotals = ref<number>(0); //用户总数
const multipleSelection = ref<Array<any>>([]); //多条选择
const centerDialogVisible = ref<boolean>(false); //创建弹窗
let user = ref<any>({}); //当前用户
const newUserVisible = ref<boolean>(false); //新用户验证
const addOrModify = ref<boolean>(true); //添加或者修改
const resetPasswordDialog = ref<boolean>(false); //重置密码
const formUser = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  state: "0",
  role: "2",
  nickName: "",
  birth: "1997-01-01",
  sex: "1",
  face: "",
  city: "",
  address: "",
  uuid: "",
  userInfoUuid: "",
  synopsis: ""
});
const rulesUser = reactive({
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { validator: validUsername, trigger: "blur" }
  ],
  email: [
    {
      type: "email",
      required: true,
      message: "请输入正确邮箱地址",
      trigger: "blur"
    },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: validatePass1, trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ],
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
  city: [
    {
      min: 2,
      max: 255,
      message: "长度在 2 到 255 个字符",
      trigger: "blur"
    }
  ],
  address: [
    {
      min: 2,
      max: 255,
      message: "长度在 2 到 255 个字符",
      trigger: "blur"
    }
  ]
});
const condition = reactive({
  pageSize: 10,
  currPage: 1,
  name: "",
  email: ""
});
const hideDeletebtn = computed(() => {
  if (userTtotals.value > 1) return true;
  return false;
});
const hidePage = computed(() => {
  if (userTtotals.value > 10) return false;
  return true;
});

const loginUser = ref<any>(); //当前登录用户
const file = ref<File>(); //上传的文件
const isUpload = ref<boolean>(false); //是否有上传
const fileList = ref<Array<any>>([]); //图片列表
const imgdialogVisible = ref<boolean>(false); //图片弹窗
const dialogImageUrl = ref<string>("");

watch(search, (newValue, oldValue) => {
  condition.name = newValue;
  getUserList();
});

/**
 * 选择全部
 */
const handleSelectionChange = (val: any) => {
  console.log(val);
  multipleSelection.value = val;
};
/**
 * 请求用户列表
 */
const getUserList = () => {
  getUsetListAPI(condition)
    .then((res: any) => {
      console.log(res);
      if (res.code == "200") {
        for (const item of res.result.list) {
          item.createDate = dateFormat(item.createDate, "yyyy-MM-dd");
        }
        tableData.value = res.result.list;
        userTtotals.value = res.result.page.totalRow;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
/**
 * 删除
 */
const handleDelete = (index: number, row: any) => {
  console.log(row);
  centerDialogVisible.value = true;
  user = row;
};
const handleBatchDelete = () => {};
/**
 * 分页跳转
 */
const handleChangePage = (val: any) => {
  condition.currPage = val;
  getUserList();
  scrollTo(0, 0); // 回到页面顶部
};
/**
 * 删除请求
 */
const deleteUser = (userUuid: string) => {
  delUsetAPI({ userUuid })
    .then((res: any) => {
      console.log(res);
      centerDialogVisible.value = false;
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        user.value = {};
        getUserList();
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
};
/**
 * 修改用户信息
 */
const handleEdit = (index: number, row: any) => {
  console.log(row);

  formUser.name = row.name;
  formUser.email = row.email;
  formUser.password = "";
  formUser.confirmPassword = "";
  formUser.state = row.state;
  formUser.role = row.role;
  formUser.nickName = row.userInfo?.nickName;
  formUser.birth = row.userInfo?.birth;
  formUser.sex = row.userInfo?.sex;
  formUser.face = row.userInfo?.face;
  formUser.city = row.userInfo?.city;
  formUser.address = row.userInfo?.address;
  formUser.uuid = row.uuid;
  formUser.userInfoUuid = row.userInfo?.uuid;
  formUser.synopsis = row.userInfo?.synopsis;
  fileList.value = [];
  fileList.value.push({
    name: "face",
    url: formUser.face
  });
  addOrModify.value = false;
  rulesUser.nickName = [
    { required: false, message: "请输入昵称", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ];
  rulesUser.face = [
    { required: false, message: "请输入头像链接", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ];
  newUserVisible.value = true;
};
/**
 * 新增用户按钮处理
 */
const newlyUser = () => {
  console.log(formUser);
  formUser.name = "";
  formUser.email = "";
  formUser.password = "";
  formUser.confirmPassword = "";
  formUser.state = "";
  formUser.role = "2";
  formUser.nickName = "";
  formUser.birth = "";
  formUser.sex = "1";
  formUser.face = "";
  formUser.city = "";
  formUser.address = "";
  formUser.uuid = "";
  formUser.userInfoUuid = "";
  formUser.synopsis = "这个人很懒，没有留下任何信息！";
  addOrModify.value = true;
  fileList.value = [];
  rulesUser.password = [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: validatePass1, trigger: "blur" }
  ];
  rulesUser.confirmPassword = [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ];
  rulesUser.nickName = [
    { required: true, message: "请输入昵称", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ];
  rulesUser.face = [
    { required: true, message: "请输入头像链接", trigger: "blur" },
    {
      min: 3,
      max: 255,
      message: "长度在 3 到 255 个字符",
      trigger: "blur"
    }
  ];
  newUserVisible.value = true;
};
/**
 * 提交表单
 */
const submitUserForm = (formName: string) => {
  if (!formUser.face) formUser.face = "123";
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      if (isUpload.value) {
        uploadFile(file.value)
          .then((res: any) => {
            formUser.face = res.result.fileList[0].absoluteUrl;
            isUpload.value = false;
            isCreateOrUpdate();
          })
          .catch((err) => {
            ElMessage.error("上传文件文件失败", err);
          });
      } else {
        isCreateOrUpdate();
      }
    } else {
      console.log("error");
      ElNotification({
        title: "错误",
        message: "请按格式填写表单",
        type: "error"
      });
      return false;
    }
  });
};
/**
 * 创建用户及用户信息
 */
const createUser = (form: any) => {
  regUsetAPI(form)
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
         newUserVisible.value = false;
        ElNotification({
          title: "成功",
          message: "新增用户成功",
          type: "success"
        });
        getUserList();
      } else {
        ElNotification({
          title: "错误",
          message: res.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};
/**
 * 修改用户信息
 */
const updateUser = (user: any, userInfo: any) => {
  console.log("userInfo", userInfo);
  updateUsetAPI({ user, userInfo })
    .then((res: any) => {
      console.log(res);
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: "修改用户成功",
          type: "success"
        });
        newUserVisible.value = false;
        getUserList();
      } else {
        ElNotification({
          title: "错误",
          message: res.msg,
          type: "error"
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};
/**
 * 修改用户密码
 */
const updateUserPwd = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      resetUsetPwdAPI({
        password: formUser.password,
        confirmPassword: formUser.confirmPassword,
        userUuid: formUser.uuid
      })
        .then((res: any) => {
          console.log(res);
          if (res.code === "200") {
            ElNotification({
              title: "成功",
              message: "重置用户密码成功",
              type: "success"
            });
            resetPasswordDialog.value = false;
            getUserList();
          } else {
            ElNotification({
              title: "错误",
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  });
};
//重置密码
const handleUpPwd = (user: any) => {
  formUser.uuid = user.uuid;
  formUser.password = "";
  formUser.confirmPassword = "";
  resetPasswordDialog.value = true;
  rulesUser.password = [
    { required: false, message: "请输入密码", trigger: "blur" },
    { validator: validatePass1, trigger: "blur" }
  ];
  rulesUser.confirmPassword = [
    { required: false, message: "请再次输入密码", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ];
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
    data.append("userUuid", loginUser.value.uuid);
    commonFaceApi(data)
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
/** 判断是修改还是创建 调用对应方法 */
const isCreateOrUpdate = () => {
  if (addOrModify.value) {
    createUser(formUser);
  } else {
    const user = {
      uuid: formUser.uuid,
      name: formUser.name,
      email: formUser.email,
      password: formUser.password,
      confirmPassword: formUser.confirmPassword,
      state: formUser.state,
      role: formUser.role
    };
    const userInfo = {
      uuid: formUser.userInfoUuid,
      nickName: formUser.nickName,
      birth: formUser.birth,
      sex: formUser.sex,
      face: formUser.face,
      city: formUser.city,
      address: formUser.address,
      synopsis: formUser.synopsis
    };
    updateUser(user, userInfo);
  }
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
  dialogImageUrl.value = uploadFile.url!;
  imgdialogVisible.value = true;
};

onBeforeMount(() => {
  document.title = "用户列表";
});
onMounted(() => {
  loginUser.value = JSON.parse(proxy.$Cookies.get("user"));
  getUserList();
});
</script>

<style lang="scss">
#userList {
  min-height: 93.3vh;
  width: 100%;
  .container {
    width: 95%;
    margin: 0 auto;
    color: #444;
    .page-title {
      padding: 1.5% 0;
      h2 {
        font-size: 1.2em;

        a {
          margin-left: 1%;
          display: inline-block;
          padding: 0.1% 0.5%;
          background-color: #e9e9e6;
          color: #467b96;
          font-size: 0.8em;

          &:hover {
            color: #499bc3;
          }
        }
      }
    }

    .page-main {
      .list {
        padding: 24px;
        background-color: #fff;
        .face {
          position: relative;
          width: 80px;
          height: 80px;
          .el-icon {
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
          }
          &::before {
            content: "";
            width: 80px;
            height: 80px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 999;
          }
          &:hover {
            &::before {
              background-color: rgba($color: #000000, $alpha: 0.2);
            }
            .el-icon {
              opacity: 1;
            }
          }
          img {
            position: relative;
            display: block;

            &:hover {
              background: #000;
            }
          }
        }
        .operation {
          display: flex;
          .el-pagination {
            margin-left: auto;
          }
        }
      }
    }
  }
}

.newUserFome {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-form-item {
    width: 45%;
    // display: inline-block;
    margin-bottom: 3%;

    .el-form-item__label {
      line-height: 2;
    }
    .el-button {
      width: 100%;
    }
  }
  .el-form-item:nth-child(odd) {
    margin-right: 5%;
  }
  .el-form-item:last-child {
    width: 100%;
    .el-button {
      display: block;
      margin: 0 auto;
      width: 30%;
      height: 40px;
    }
  }
}
</style>
