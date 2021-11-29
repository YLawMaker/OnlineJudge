<template>
<div class="paper">
    <el-table
        :data="examHistory"
        style="width:100%">
        <el-table-column
            prop="exam.examName"
            label="考试名称">
        </el-table-column>
        <el-table-column
            prop="examChoiceQuestionTotals"
            label="选择题得分">
        </el-table-column>
        <el-table-column
            prop="examCompletionQuestionTotals"
            label="填空题得分">
        </el-table-column>
        <el-table-column
            prop="examProgrammingTotals"
            label="编程题得分">
        </el-table-column>
        <el-table-column
            prop="examTotals"
            label="总分">
        </el-table-column>        
    </el-table>
</div>
</template>
<script>
    export default{
        data(){
            return{
                userId:'',
                examHistory:[{
                    examHistoryId:'',
                    examChoiceQuestionTotals:'',
                    examProgrammingTotals:'',
                    examCompletionQuestionTotals:'',
                    examTotals:'',
                    user:{},
                    exam:{
                        examId:'',
                        examName:'',
                        examStartTime:'',
                        examEndTime:'',
                        examStatus:'',
                        examLanguage:'',
                        examChoiceQuestionScore:'',
                        examCompletionQuestionScore:'',
                        examProgrammingScore:'',
                    }
            },]
            }
        },
        mounted () {
            this.userId=this.$route.query.userId;
            this.queryExamHistoryInfoByUserId();
        },
        methods: {
            
        //获得选择填空得分
        queryExamHistoryInfoByUserId(){
            let params = new URLSearchParams();
            params.append("userId", this.userId);
            this.$axios({
                method: "post",
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                },
                url: "/examHistory/queryExamHistoryInfoByUserId",
                data: params,
            })
                .then((res) => {
                    this.examHistory=res.data;
                    console.log(this.examHistory);
                })
                .catch((err) => {
                this.$message.error("查询题目得分信息失败");
                });
        },
        }
    }
</script>
<style>

</style>
