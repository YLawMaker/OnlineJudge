<template>
  <div>
      <el-table :data="examRankInfo" style="width: 90%" class="tableclass" stripe>
          <el-table-column  label="名次" prop="studentName">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
        </el-table-column>
        <el-table-column prop="studentName" label="姓名">

        </el-table-column>
       <el-table-column prop="choiceScore" label="选择题分数"  >
        </el-table-column>
        <el-table-column prop="programmingScore" label="编程题分数"  >
        </el-table-column>
        <el-table-column prop="totalScore" label="总分" >  
        </el-table-column>
     </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return{
            examRankInfo:[
                {
                    studentName:'',
                    choiceScore:'',
                    programmingScore2:'',
                    totalScore:''
                },
            ],
            examId:1,
        }
    },
    mounted:function(){
        this.getExamRankInfo();
    },
    methods:{
        //获取考试排行榜信息
        getExamRankInfo(){
            let params=new URLSearchParams();
            params.append("examId",this.examId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/student/examScore',
                data: params
            })
            .then((res)=> {
                console.log(res)
                  this.examRankInfo=res.data;
            })
            .catch((err)=> {
                this.$message.error('查询考试排行榜错误');
                
            })
        },
    }

}
</script>

<style>
.tableclass{
    margin-left: 5%;
}
</style>