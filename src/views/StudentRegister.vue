<template>
  <div class="register_center">
    <el-form
      ref="studentRegister"
      :model="studentInfo"
      :rules="rules"
      class="studentRegisterForm"
    >
      <el-form-item label="姓名" prop="studentName"
        ><br /><el-input v-model="studentInfo.studentName" style="width: 262px">
        </el-input>
      </el-form-item>
      <el-form-item label="账号" prop="studentAccount"
        ><br /><el-input
          v-model="studentInfo.studentAccount"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="studentPassword"
        ><br /><el-input
          v-model="studentInfo.studentPassword"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="studentPasswordR"
        ><br /><el-input
          v-model="studentInfo.studentPasswordR"
          style="width: 262px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="班级" prop="classesId"
        ><el-select v-model="studentInfo.classesId" placeholder="请选择">
          <el-option
            v-for="item in classesList"
            :key="item.classesId"
            :label="item.classesName"
            :value="item.classesId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="studentEmail"
        ><br /><el-input
          v-model="studentInfo.studentEmail"
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
      },
      classesList: [
      ],
      rules: {
        studentName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        studentAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        studentPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        classesId: [
          { required: true, message: '请选择班级', trigger: 'change', type: 'number' },
        ],
        studentPasswordR: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        studentEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }]
      }
    }
  },
  mounted: function () {
    this.email();
    this.setClassesList();
  },
  methods: {
    email(){
       let params = new URLSearchParams();
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/email/text',
          data: params
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {

          })
    },
    register (studentRegister) {
      this.$refs[studentRegister].validate((valid) => {
        if (valid) {
          if (this.studentInfo.studentPassword == this.studentInfo.studentPasswordR) {
            let params = new URLSearchParams();
            params.append('studentAccount', this.studentInfo.studentAccount);
            params.append('classesId', this.studentInfo.classesId);
            params.append('studentPassword', this.studentInfo.studentPassword);
            params.append('studentName', this.studentInfo.studentName);
            params.append('studentEmail', this.studentInfo.studentEmail);
            // console.log(this.studentInfo.studentAccount);
            // console.log(this.studentInfo.classesId);
            // console.log(this.studentInfo.studentPassword);
            // console.log(this.studentInfo.studentName);
            // console.log(this.studentInfo.studentEmail);
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
                this.$router.push({ path: '/studentLogin' })
              }
            }).catch((res) => {
              console.log(res);
            })
          } else {
            this.$message.error('两次密码输入不一致');
          }
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
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>