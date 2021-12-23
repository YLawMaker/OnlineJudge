<template>
  <div class="login_center">
    <el-form
      ref="loginForm"
      :model="user"
      :rules="loginRules"
      class="loginForm"
    >
      <h2>用户登录</h2>
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
        <el-button type="primary" round plain @click="login('loginForm')"
          >登录
        </el-button>
        <el-button round plain @click="register">注册 </el-button>
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
        userPassword: '',
        userIdentity: '',
      },
      loginRules: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      },
    }

  },
  mounted: function () {


  },
  methods: {
    login (loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('userAccount', this.user.userAccount);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/user/isUserInfoExist',
            data: params
          })
            .then((res) => {
              if (res.data == true) {
                let params = new URLSearchParams();
                params.append('userAccount', this.user.userAccount);
                params.append('userPassword', this.user.userPassword);
                this.$axios({
                  method: 'post',
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  url: '/user/isUserExist',
                  data: params
                })
                  .then((res) => {
                    if (res.data != false) {
                      if (res.data.userIdentity == "teacher") {
                        this.$router.push("/examInfoList")
                      } else {
                        this.$message.success('登录成功');
                        this.$router.go(-1);
                      }

                    } else {
                      this.$message.error('密码错误');
                    }
                  })
                  .catch((err) => {
                    this.$message.error('查询密码错误');

                  })
              } else {
                this.$message.error('账号不存在');
              }
            })
            .catch((err) => {
              this.$message.error('查询账号错误');

            })
        } else {
          this.$message.error('输入格式不规范');
        }
      })

    },
    register () {
      this.$router.push('/userRegister')
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
  top: 40%;
  left: 48%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>