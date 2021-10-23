<template>
    <el-container>
        <el-header>
            <el-menu
                :default-active="this.$route.path"
                router
                mode="horizontal"
                menu-trigger="click"
                :unique-opened="true"
                text-color="#000000"
                :collapse-transition="true"
                style="margin-left:45%;margin-right:55%;"
            >
                
                <el-menu-item index="/examDetail">Problems</el-menu-item>

                <!-- <div class="loginbutton">
                <span
                    style="margin-right: 3%; cursor: pointer"
                    el-dropdown-link
                    @click="gotoStudentInfo()"
                    >{{ studentName }}</span
                >
                <el-button plain @click="studentLogin()">登录 </el-button>
                </div> -->
            </el-menu>
         </el-header>
        <el-main class="content">
            <h1 style="text-align:center">{{this.examInfo.examName}}</h1>
            <table class="table table-striped">
                <tbody>
                    <tr>   
                        <th style="text-align: center;">题目类型</th>
                        <th style="text-align: center;width:50%;">题目总数</th>
                        <th style="text-align: center;width:50%;">已完成题数</th>
                    </tr>
                        <tr>
                            <td><el-button type="primary" @click='gotoChoice'>选择题</el-button></td>
                            <td>2</td>
                            <td>0</td>
                        </tr>
                         <tr>
                            <td><el-button type="primary" @click="gotoProgram">编程题</el-button></td>
                            <td>1</td>
                            <td>0</td>
                        </tr>
                         <tr>
                            <td><el-button type="primary" @click="gotoCompletion">填空题</el-button></td>
                            <td>1</td>
                            <td>0</td>
                        </tr>
                </tbody>
            </table>
        
        </el-main>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            examInfo:[
                {
                    examId:'',
                    examName:'',
                    examStartTime:'',
                    examEndTime:'',
                    examType:'',
                    isPrivate:'',
                }
            ],
            userId:'',
        }
    },
    mounted: function(){
        this.examInfo.examId=this.$route.query.examId;
        this.getExamInfo();
        this.examInfo.examName=this.$route.query.examName;
        this.userId=this.$route.query.userId;
    },
    methods: {
        gotoChoice(){
            this.$router.push({path:'/examChoice',query:{
                userId:this.userId,
                examId:this.examInfo.examId,
                examName:this.examInfo.examName,
                }})
        },
        gotoProgram(){
            this.$router.push({ path:'/examProgramming' })
        },
        gotoCompletion(){
            this.$router.push({path:'/examCompletion'})
        },
        //获取考试信息
        getExamInfo () {
            let params = new URLSearchParams();
            params.append("examId",this.examInfo.examId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/exam/queryExamInfoByExamId',
                data: params
            })  
            .then((res) => {
              this.examInfo = res.data;
              console.log(res.data);
              this.pageExamInfo=this.examInfo.slice(0,4);
              this.currentPage=1;
            })
            .catch((err) => {
              this.$message.error('查询考试信息失败') ;
            })
        },
    }
}
</script>

<style>
.el-menu{
    text-align: center;
}
.el-menu-item{
    text-align: center;
    width: auto;
    position: relative;
    padding-left: 10%;
    padding-right: 10%;
    font-size: 120%;
}
.content{
    text-align: center;
    justify-content: center;
}
</style>