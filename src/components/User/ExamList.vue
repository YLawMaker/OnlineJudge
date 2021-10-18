<template>
  <div>
      
      


    <div class="block">
      <el-timeline >
        <el-timeline-item  v-for="exam in pageExamInfo" :key="exam.examId" :timestamp="exam.examStartTime" placement="top">
          <el-card>
            <h4>{{exam.examName}}</h4>
            <p style="width:300px;float:left">开始时间{{exam.examStartTime}}</p>
            <p style="width:300px;float:left">结束时间{{exam.examEndTime}}</p>
          </el-card>
        </el-timeline-item>
        
      </el-timeline>
    </div>

   

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="examInfo.length"
        @current-change="handleCurrent"
        v-if="examInfo.length!=0"
      >
      </el-pagination>
    </div>
  </div>
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
            pageExamInfo:[],
            pageSize: 4,
            currentPage: 1,
            userId:''
        }
    },
   
    mounted: function () { 
        this.getExamInfo();
    },
    methods:{
      //查询考试信息
        searchExamInfo(){
          //查询之后返回第一页
          this.setContextData("currentPage",1);
          this.getExamInfo();
        },
        //去到考试详情界面
        gotoExamDetail(examId){
          this.$router.push({path:'/examDetail',query: {"examId":examId}})
        },
        //换页时调用
        handleCurrent (val) {
            this.currentPage = val;
            this.pageExamInfo=this.examInfo.slice((val-1)*this.pageSize,val*this.pageSize)
        },
        //获取考试信息
        getExamInfo () {
            let params = new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/exam/queryExamInfoByUserId',
                data: params
            })
            .then((res) => {
              this.examInfo = res.data;
              console.log(res.data);
              this.pageExamInfo=this.examInfo.slice(0,4)
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
.tableclass {
  margin-left: 5%;
}
.pagination {
  display: flex;
  justify-content: center;
}
.handle-input {
  width: 300px;
  display: inline-block;
  margin-left: 1%;
}
.span-label{
    margin-left: 1%; 
}
.handle-select{
  width: 200px;
  display: inline-block;
}
</style>