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
                style="margin-left:30%;margin-right:30%;"
            >
                <el-menu-item @click="gotoExamList()">Exam  List</el-menu-item>
                
                <el-menu-item index="/examDetail">Problem</el-menu-item>
                <el-menu-item index="/examRankList">RankList</el-menu-item>

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
            <h1 style="text-align:center">{{examName}}</h1>
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
            examId:8,
            userId:1,
            examName:'测试考试'
        }
    },
    mounted: function(){
        this.examInfo.examId=this.$route.query.examId;
       // alert(this.examInfo.examId);
    },
    methods: {
        gotoChoice(){
            this.$router.push({path:'/examChoice',query:{
                userId:this.userId,
                examId:this.examId,
                }})
        },
        gotoProgram(){
            this.$router.push({ path:'/examProgramming' })
        },
        gotoExamList(){
            if(this.userId==""){
                this.$message.error("请先登录用户");
                this.$router.push('/userLogin')
            }else{
                this.$router.push({ path: '/examList', query: { userId: this.userId } });
            }
        },
        gotoCompletion(){
            this.$router.push({path:'/examCompletion'})
        }
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