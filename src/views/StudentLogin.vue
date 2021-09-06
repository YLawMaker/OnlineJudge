<template>
    <div class="login_center">
        <el-form
            ref="loginForm"
            :model="student"
            :rules="loginRules"
            class="loginForm"
        >
        <el-form-item prop="studentAccount">
            <el-input
            v-model="student.studentAccount"
            prefix-icon="el-icon-user"
            ></el-input>
        </el-form-item>
        <el-form-item prop="studentPassword">
            <el-input
            type="password"
            v-model="student.studentPassword"
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
    data(){
        return{
            student:{
                studentAccount:'',
                studentPassword:''
            },
            loginRules: {
                studentAccount: [
                { required: true, message: '请输入账号', trigger: 'blur' },
                { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                studentPassword: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    methods:{
        login(){
            let params=new URLSearchParams();
            params.append('studentAccount',this.student.studentAccount);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/student/isStudentInfoExist',
                data: params
            })
            .then((res)=> {
                if(res.data==true){
                        let params=new URLSearchParams();
                        params.append('studentAccount',this.student.studentAccount);
                        params.append('studentPassword',this.student.studentPassword);
                        this.$axios({
                            method: 'post',
                            headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                        },
                            url: '/student/isStudentExist',
                            data: params
                        })
                        .then((res)=> {
                            if(res.data!=false){
                                this.$message.success('登录成功');
                                this.$router.go(-1); 
                            }else{
                                this.$message.error('密码错误');
                            }    
                        })
                        .catch((err)=> {
                            this.$message.error('系统错误请稍后再尝试');
                            
                        })
                }else{
                    this.$message.error('账号不存在');
                }
               
                
            })
            .catch((err)=> {
                this.$message.error('系统错误请稍后再尝试');
                
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