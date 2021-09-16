<template>
  <div class="login_center">
    <p>后台登录</p>
    <el-form
      ref="loginForm"
      :model="user"
      :rules="loginRules"
      class="loginForm"
    >
      <el-form-item prop="userAccount">
        <el-input
          v-model="user.userAccount"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userPassword">
        <el-input
          type="password"
          v-model="user.userPassword"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="login">登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        userAccount: '',
        userPassword: ''
      },
      loginRules: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 6, message: '长度在 5 到 6 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 6 到 12个字符', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    login () {
      if (this.user.userAccount.length == 5) {
        let params = new URLSearchParams();
        params.append('teacherAccount', this.user.userAccount);
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/teacher/teacherLogin',
          data: params
        })
          .then((res) => {
            if (res.data == "") {
              this.$message.error('账号错误');
            } else {
              if (this.user.userPassword == res.data.teacherPassword) {
                this.$router.push('/teacherAside')
                this.$message.success('教师登录成功');
              } else {
                this.$message.error('密码错误');
              }
            }
          })
          .catch((err) => {
            this.$message.error('系统错误请稍后再尝试');

          })
      }
      if (this.user.userAccount.length == 6) {
        let params = new URLSearchParams();
        params.append('adminAccount', this.user.userAccount);
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/admin/adminLogin',
          data: params
        })
          .then((res) => {
            if (res.data == "") {
              this.$message.error('账号错误');
            } else {
              if (this.user.userPassword == res.data) {
                this.$router.push('/AdminBackground')
                this.$message.success('管理登录成功');
              } else {
                this.$message.error('密码错误');
              }
            }


          })
          .catch((err) => {
            this.$message.error('系统错误请稍后再尝试');

          })
      }

    }
  }
}
</script>

<style >
.loginForm {
  position: absolute;
  width: 100%;
  padding: 25px;
  box-sizing: border-box;
}
.login_center {
  background-color: rgba(255, 255, 255, 0.7);
  width: 350px;
  height: 280px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>