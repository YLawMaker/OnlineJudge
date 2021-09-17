<template>
  <div class="register_center">
    <h2 style="text-align:center">用户注册</h2>
    <el-form
      ref="studentRegister"
      :model="studentInfo"
      :rules="rules"
      class="studentRegisterForm"
      :label-position="labelPosition"
      label-width=80px
    >
      <el-form-item label="姓名" prop="studentName">
        <el-input v-model="studentInfo.studentName" style="width: 262px">
        </el-input>
      </el-form-item>
      <el-form-item label="账号" prop="studentAccount">
        <el-input
          v-model="studentInfo.studentAccount"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="studentPassword">
        <el-input
          type="password"
          v-model="studentInfo.studentPassword"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="studentPasswordR">
        <el-input
          type="password"
          v-model="studentInfo.studentPasswordR"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="班级" prop="classesId">
        <el-select v-model="studentInfo.classesId" placeholder="请选择">
          <el-option
            v-for="item in classesList"
            :key="item.classesId"
            :label="item.classesName"
            :value="item.classesId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="studentEmail">
        <el-input
          v-model="studentInfo.studentEmail"
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
          v-model="studentInfo.userInputVerificationCode"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
     
      <el-form-item
        ><el-button @click="register('studentRegister')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      studentInfo: {
        studentAccount: '',
        classesId: '',
        studentPassword: '',
        studentPasswordR: '',
        studentName: '',
        studentEmail: '',
        userInputVerificationCode:'',
      },
      classesList: [
      ],
      rules: {
        studentName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        studentAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        studentPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        classesId: [
          { required: true, message: '请选择班级', trigger: 'change', type: 'number' },
        ],
        studentPasswordR: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        userInputVerificationCode:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
        ],
        studentEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }]
      },
      verificationCode:'12345',
      labelPosition:'right'
    }
  },
  mounted: function () {
    this.setClassesList();
  },
  methods: {
    getVerificationCode(){
        var numReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var numRe = new RegExp(numReg)
        if(numRe.test(this.studentInfo.studentEmail)){
          this.$message.success("发送验证码成功");
            let params = new URLSearchParams();
            params.append('Email', this.studentInfo.studentEmail);
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
    register (studentRegister) {
      this.$refs[studentRegister].validate((valid) => {
        if (valid) {
          if(this.verificationCode==this.studentInfo.userInputVerificationCode){
                if(this.studentInfo.studentPassword == this.studentInfo.studentPasswordR) {
                    let params = new URLSearchParams();
                    params.append('studentAccount', this.studentInfo.studentAccount);
                    this.$axios({
                      method: 'post',
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      url: '/student/isStudentInfoExist',
                      data: params
                    }).then((res) => {
                      if (res.data == true) {
                        this.$message.error('该账号已经注册过');
                      } else {
                        //账号未注册过
                        let params = new URLSearchParams();
                        params.append('studentAccount', this.studentInfo.studentAccount);
                        params.append('classesId', this.studentInfo.classesId);
                        params.append('studentPassword', this.studentInfo.studentPassword);
                        params.append('studentName', this.studentInfo.studentName);
                        params.append('studentEmail', this.studentInfo.studentEmail);
                        this.$axios({
                          method: 'post',
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          url: '/student/addStudentInfo',
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
    setClassesList () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/classes/queryClassesInfo',
        data: params
      })
        .then((res) => {
          this.classesList = res.data;
        })
        .catch((err) => {
          // this.$message.error('系统错误请稍后再尝试');
          console.log(err);

        })
    }
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