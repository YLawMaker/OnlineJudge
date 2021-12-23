<template>
  <div class="login_center">
    <p>后台登录</p>
    <el-form
      ref="loginForm"
      :model="admin"
      :rules="loginRules"
      class="loginForm"
    >
      <el-form-item prop="adminAccount">
        <el-input
          v-model="admin.adminAccount"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="adminPassword">
        <el-input
          type="password"
          v-model="admin.adminPassword"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" round @click="login('loginForm')"
          >登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      admin: {
        adminAccount: '',
        adminPassword: ''
      },
      loginRules: {
        adminAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 6, message: '长度在 5 到 6 个字符', trigger: 'blur' }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 6 到 12个字符', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    login (loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          if (this.admin.adminAccount.length == 6) {
            let params = new URLSearchParams();
            params.append('adminAccount', this.admin.adminAccount);
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
                  this.$message.error('账号或密码错误');
                } else {
                  if (this.admin.adminPassword == res.data) {
                    this.$router.push('/AdminBackground')
                    this.$message.success('管理登录成功');
                  } else {
                    this.$message.error('账号或密码错误');
                  }
                }


              })
              .catch((err) => {
                this.$message.error('系统错误请稍后再尝试');

              })
          }
        } else {
          this.$message.error('输入不符合规范');
        }
      })


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