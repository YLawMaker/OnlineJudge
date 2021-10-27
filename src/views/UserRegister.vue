<template>
  <div class="register_center">
    <h2 style="text-align:center">用户注册</h2>
    <el-form
      ref="userRegister"
      :model="userInfo"
      :rules="rules"
      class="userRegisterForm"
      :label-position="labelPosition"
      label-width=80px
    >
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="userInfo.userName" style="width: 262px">
        </el-input>
      </el-form-item>
      <el-form-item label="账号" prop="userAccount">
        <el-input
          v-model="userInfo.userAccount"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input
          type="password"
          v-model="userInfo.userPassword"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="userPasswordR">
        <el-input
          type="password"
          v-model="userInfo.userPasswordR"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
     
      <el-form-item label="邮箱" prop="userEmail">
        <el-input
          v-model="userInfo.userEmail"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
       <el-form-item
        ><el-button @click="getVerificationCode()">获取验证码</el-button>
      </el-form-item>

      <el-form-item label="验证码"       prop="userInputVerificationCode">
        <el-input
         maxlength="4"
          v-model="userInfo.userInputVerificationCode"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
     
      <el-form-item
        ><el-button @click="register('userRegister')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userInfo: {
        userAccount: '',
        userPassword: '',
        userPasswordR: '',
        userName: '',
        userEmail: '',
        userInputVerificationCode:'',
      },

      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      
        userPasswordR: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        userInputVerificationCode:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
        ],
        userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }]
      },
      verificationCode:'12345',
      labelPosition:'right'
    }
  },
  mounted: function () {
    
  },
  methods: {
    getVerificationCode(){
        var numReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var numRe = new RegExp(numReg)
        if(numRe.test(this.userInfo.userEmail)){
          this.$message.success("发送验证码成功");
            let params = new URLSearchParams();
            params.append('Email', this.userInfo.userEmail);
            this.$axios({
              method: 'post',
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              url: '/email/text',
              data: params
            })
              .then((res) => {
                this.verificationCode=res.data;
              })
              .catch((err) => {

              })
        }else{
            this.$message.error("邮箱格式不正确");
        }
      
    },
    register (userRegister) {
      this.$refs[userRegister].validate((valid) => {
        if (valid) {
          if(this.verificationCode==this.userInfo.userInputVerificationCode){
                if(this.userInfo.userPassword == this.userInfo.userPasswordR) {
                    let params = new URLSearchParams();
                    params.append('userAccount', this.userInfo.userAccount);
                    this.$axios({
                      method: 'post',
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      url: '/user/isUserInfoExist',
                      data: params
                    }).then((res) => {
                      if (res.data == true) {
                        this.$message.error('该账号已经注册过');
                      } else {
                        //账号未注册过
                        let params = new URLSearchParams();
                        params.append('userAccount', this.userInfo.userAccount);
                        params.append('userPassword', this.userInfo.userPassword);
                        params.append('userName', this.userInfo.userName);
                        params.append('userEmail', this.userInfo.userEmail);
                        this.$axios({
                          method: 'post',
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          url: '/user/addUserInfo',
                          data: params
                        }).then((res) => {
                          if (res.data == '0') {
                            this.$message.error('注册失败');
                          } else {
                            this.$message.success('注册成功');
                            this.$router.go(-1);
                          }
                        }).catch((res) => {
                          console.log(res);
                        })     
                      }
                    }).catch((res) => {
                      console.log(res);
                    })
                  } else {
                    this.$message.error('两次密码输入不一致');
                  }
            }else{
               this.$message.error('验证码错误');
            }
        }else{
          this.$message.error('输入格式不规范');
        }
      })
   

      
    },
   
  }
}
</script>

<style>
.register_center {
  background-color: rgba(255, 255, 255, 0.7);
  width: 350px;
  height: 280px;
  position: absolute;
  top: 20%;
  left: 47%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>