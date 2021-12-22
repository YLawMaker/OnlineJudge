<template>
  <el-form :model="user" :rules="rules">
    <p style="text-align: center">
      {{ user.userName }}
    </p>
    <p style="text-align: center">
      {{ user.userProfile }}
    </p>
    <p style="text-align: center">
      <el-button @click="dialogUserInfo = true">修改信息</el-button>
      <el-dialog
        title="修改信息"
        :visible.sync="dialogUserInfo"
        :close-on-click-modal="false"
      >
        <el-form
          ref="UserInfo"
          :model="user"
          class="UserInfoform"
          :rules="rules"
        >
          <el-form-item label="新用户名" prop="newuserName">
            <el-input v-model="user.newuserName"></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="newuserProfile">
            <el-input v-model="user.newuserProfile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogUserInfo = false">取 消</el-button>
            <el-button type="primary" @click="submitUserInfo()"
              >确 定</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </p>

    <div style="text-align: center">
      <el-button @click="dialogUserPwd = true">修改密码</el-button>
      <p v-show="dialogUserPwd" style="position: center">
        <el-dialog
          title="修改密码"
          :visible.sync="dialogUserPwd"
          :close-on-click-modal="false"
        >
          <el-form ref="UserPwd" :model="user" :rules="rules">
            <el-form-item label="原密码" prop="userPassword">
              <el-input type="password" v-model="user.userPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newuserPassword">
              <el-input
                type="password"
                v-model="user.newuserPassword"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newuserPasswordR">
              <el-input
                type="password"
                v-model="user.newuserPasswordR"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUserPwd = false">取 消</el-button>
            <el-button type="primary" @click="submitUserPwd()">确 定</el-button>
          </div>
        </el-dialog>
      </p>
    </div>

    <h2 style="text-align: center">未解决问题</h2>

    <el-link
      :underline="false"
      v-for="(item, i) in exerciseInfo"
      :key="i"
      style="width: 1%"
      class="p"
      @click="gotoExerciseDetail(item)"
    >
      {{ item }}
    </el-link>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      user: {
        userId: "",
        userPassword: "",
        newuserPassword: "",
        newuserPasswordR: "",
        newuserName: "",
        newuserProfile: "",
        userName: "",
        userProfile: "",
        userSolved: "",
        userSubmit: "",
      },
      exerciseInfo: [],
      editUserInfo: false,
      editUserPwd: false,
      dialogUserInfo: false,
      dialogUserPwd: false,

      rules: {
        newuserName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        newuserProfile: [
          { required: false, message: "请输入简介", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur",
          },
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        newuserPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        newuserPasswordR: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted: function () {
    this.user.userId = this.$route.query.userId;
    //获取用户信息
    this.getUserInfo();

    this.getUserExerciseInfo();
  },
  methods: {
    //跳转至习题详情界面
    gotoExerciseDetail (item) {
      this.$router.push({
        path: "/exerciseDetail",
        query: {
          exerciseId: item,
        },
      });
    },
    //取消修改信息
    cancelModify () {
      this.editUserInfo = false;
      this.editUserPwd = false;
    },
    //开始修改信息
    modifyUserInfo () {
      this.editUserInfo = true;
    },
    modifyUserPwd () {
      this.editUserPwd = true;
    },
    //提交修改信息
    submitUserInfo () {
      let params = new URLSearchParams();
      params.append("userName", this.user.newuserName);
      params.append("userProfile", this.user.newuserProfile);
      params.append("userId", this.user.userId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/modifyUserInfo",
        data: params,
      })
        .then((res) => {
          this.$message.success("修改学生信息成功");
          this.user.userName = this.user.newuserName;
          this.user.userProfile = this.user.newuserProfile;
        })
        .catch((err) => {
          this.$message.error("修改学生信息失败");
        });
    },
    submitUserPwd () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserInfo",
        data: params,
      })
        .then((res) => {
          if (res.data != 0) {
            if (res.data.userPassword != this.user.userPassword)
              this.$message.error("密码错误");
            else if (this.user.newuserPassword == this.user.newuserPasswordR) {
              this.user.userPassword = this.user.newuserPassword;
              let params = new URLSearchParams();
              params.append("userId", this.user.userId);
              params.append("userPassword", this.user.userPassword);
              this.$axios({
                method: "post",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                url: "/user/modifyPassword",
                data: params,
              })
                .then((res) => {
                  if (res.data == "0") {
                    this.$message.error("修改失败");
                  } else {
                    this.$message.success("修改成功");
                    this.$router.go(-1);
                  }
                })
                .catch((res) => {
                  console.log(res);
                });
            } else {
              //2次密码不
              alert("密码不符");
            }
          } else {
            this.$message("请先登录");
            this.$router.push("/userLogin");
          }
        })
        .catch((err) => {
          this.$message.error("查询学生信息失败");
        });
    },
    //获取用户信息
    getUserInfo () {
      let params = new URLSearchParams();
      params.append("userId", this.user.userId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserInfoById",
        data: params,
      })
        .then((res) => {
          this.user = res.data;
          this.user.userPassword = "";
        })
        .catch((err) => {
          this.$message.error("查询用户信息失败");
        });
    },
    //获取用户系统信息
    getUserExerciseInfo () {
      let params = new URLSearchParams();
      params.append("userId", this.user.userId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/exerciseHistory/queryExerciseIdByUserId",
        data: params,
      })
        .then((res) => {
          this.exerciseInfo = res.data;
        })
        .catch((err) => {
          this.$message.error("查询用户习题信息失败");
        });
    },
  },
};
</script>

<style>
.p {
  float: left;
}
</style>