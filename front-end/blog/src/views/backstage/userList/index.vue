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
            <!-- <el-table-column label="评论" prop="comments.length" width="55">
            </el-table-column> -->
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
            <el-table-column label="用户组" prop="role"> </el-table-column>
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
                  type="danger"
                  style="margin-left: auto"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
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
        <!-- <el-form-item label="密码" prop="password">
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
            placeholder="请确认你的密码, 与上面输入的密码保持一致."
          ></el-input>
        </el-form-item> -->
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
        <el-form-item label="头像" prop="face">
          <el-input
            v-model="formUser.face"
            placeholder="用于前台作者头像"
          ></el-input>
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
        <el-form-item>
          <el-button
            v-if="addOrModify"
            style="margin-left: auto"
            type="primary"
            @click="submitUserForm('UserForm')"
            >新增用户</el-button
          >
          <el-button
            v-if="!addOrModify"
            style="margin-left: auto"
            type="primary"
            @click="submitUserForm('UserForm')"
            >修改用户</el-button
          >
        </el-form-item>
      </el-form>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import dateFormat from "@/assets/js/dateFormat.js";
import { isvalidPass, isvalidUsername } from "@/assets/js/validate.js";

const store = useStore();
const router = useRouter();
const { proxy }: any = getCurrentInstance();
const validatePass1 = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!isvalidPass(value)) {
    callback(
      new Error(
        "最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"
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
let formUser = reactive({
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
  userInfoUuid: ""
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
  proxy.$axios
    .get("/user/list", condition)
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
  proxy.$axios
    .get("/user/del", { userUuid })
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
  formUser = {
    name: row.name,
    email: row.email,
    password: "",
    confirmPassword: "",
    state: row.state,
    role: row.role,
    nickName: row.userInfo?.nickName,
    birth: row.userInfo?.birth,
    sex: row.userInfo?.sex,
    face: row.userInfo?.face,
    city: row.userInfo?.city,
    address: row.userInfo?.address,
    uuid: row.uuid,
    userInfoUuid: row.userInfo?.uuid
  };
  newUserVisible.value = true;
  addOrModify.value = false;
  if (proxy.$refs.UserForm !== undefined) {
    proxy.$refs.UserForm.resetFields();
  }
  rulesUser.password = [
    { required: false, message: "请输入密码", trigger: "blur" },
    { validator: validatePass1, trigger: "blur" }
  ];
  rulesUser.confirmPassword = [
    { required: false, message: "请再次输入密码", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ];
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
};
/**
 * 新增用户按钮处理
 */
const newlyUser = () => {
  if (proxy.$refs.UserForm !== undefined) {
    proxy.$refs.UserForm.resetFields();
  }
  newUserVisible.value = true;
  addOrModify.value = true;
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
};
/**
 * 提交表单
 */
const submitUserForm = (formName: string) => {
  proxy.$refs[formName].validate((valid: any) => {
    if (valid) {
      if (addOrModify) {
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
          address: formUser.address
        };
        updateUser(user, userInfo);
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
  proxy.$axios
    .post("/user/reg", form)
    .then((res: any) => {
      console.log(res);
      newUserVisible.value = false;
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: "新增用户成功",
          type: "success"
        });
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
  proxy.$axios
    .put("/user/upInfo", { user, userInfo })
    .then((res: any) => {
      console.log(res);
      newUserVisible.value = false;
      if (res.code === "200") {
        ElNotification({
          title: "成功",
          message: "修改用户成功",
          type: "success"
        });
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
onBeforeMount(() => {
  document.title = "用户列表";
});
onMounted(() => {
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
  .el-form-item {
    width: 45%;
    display: inline-block;

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
}
</style>
