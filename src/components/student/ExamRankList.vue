<template>
  <div>
      <!-- <el-table :data="data" style="width: 90%" class="tableclass" stripe>
          <el-table-column  label="名次" prop="studentName">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
        </el-table-column>
        <el-table-column prop="studentProfile" label="姓名">

        </el-table-column>
       <el-table-column prop="studentProfile" label="个人简介"  >
        </el-table-column>
        <el-table-column prop="studnetSolved" label="解决数"  >
        </el-table-column>
        <el-table-column prop="studnetSubmit" label="提交数"  >  
        </el-table-column>
     </el-table> -->
  </div>
</template>

<script>
export default {
    data(){
        return{
            examRankInfo:[],
            examId:'',
        }
    },
    mounted:function(){

    },
    methods:{
        //获取考试排行榜信息
        getExamRankInfo(){
            let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/student/queryStudnetRankListInfo',
                data: params
            })
            .then((res)=> {
                  this.studentInfo=res.data;
                  this.selectstudentInfo=res.data;
            })
            .catch((err)=> {
                this.$message.error('系统错误请稍后再尝试');
                
            })
        },
    }

}
</script>

<style>

</style>