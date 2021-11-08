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
                        <th style="text-align: center;width:50%;">是否完成</th>
                    </tr>
                        <tr>
                            <td><el-button type="primary" @click='gotoChoice'>选择题</el-button></td>
                            <td>{{this.sumOfChoice}}</td>
                            <td>是</td>
                        </tr>
                         <tr>
                            <td><el-button type="primary" @click="gotoCompletion">填空题</el-button></td>
                            <td>{{this.sumOfCompletion}}</td>
                            <td>否</td>
                        </tr>
                         <tr>
                            <td><el-button type="primary" @click="gotoProgram">编程题</el-button></td>
                            <td>{{this.sumOfProgramming}}</td>
                            <td>否</td>
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
            examQuestion:{
                exam:'',
                choiceQuestions:'',
                completionQuestions:'',
                exercises:'',
            },
            examInfo:[
                {
                    examId:'',
                    examName:'',
                    examStartTime:'',
                    examEndTime:'',
                    examType:'',
                    isPrivate:'',
                    examLanguage:'',
                }
            ],
            sumOfChoice:'',
            sumOfCompletion:'',
            sumOfProgramming:'',
            userId:'',
            leftTime:'',
        }
    },
    mounted: function(){
        this.examInfo.examId=this.$route.query.examId;
        this.userId=this.$route.query.userId;
        this.getExamInfo();
        this.getExamQuestion();
    },
    methods: {
        gotoChoice(){
            this.$router.push({path:'/examChoice',query:{
                userId:this.userId,
                examId:this.examInfo.examId,
                examName:this.examInfo.examName,
                examEndTime:this.examInfo.examEndTime,
                examStartTime:this.examInfo.examStartTime,
                }})
        },
        gotoProgram(){
            this.$router.push({path:'/examProgramming',query:{
                userId:this.userId,
                examId:this.examInfo.examId,
                examName:this.examInfo.examName,
                examEndTime:this.examInfo.examEndTime,
                examLanguage:this.examInfo.examLanguage,
                examStartTime:this.examInfo.examStartTime,
                }})
        },
        gotoCompletion(){
            this.$router.push({path:'/examCompletion',query:{
                userId:this.userId,
                examId:this.examInfo.examId,
                examName:this.examInfo.examName,
                examEndTime:this.examInfo.examEndTime,
                examStartTime:this.examInfo.examStartTime,
                }})
        },
        //获取所有考试题目
        getExamQuestion(){
            let params = new URLSearchParams();
            params.append("examId",this.examInfo.examId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/examQuestion/queryExamQuestionByExamId',
                data: params
            })  
            .then((res) => {
              this.examQuestion = res.data;
              console.log(res.data);
                this.sumOfChoice=res.data.choiceQuestions.length;
                this.sumOfCompletion=res.data.completionQuestions.length;
                this.sumOfProgramming=res.data.exercises.length;
            })
            .catch((err) => {
              this.$message.error('查询考试所有信息失败') ;
            })
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