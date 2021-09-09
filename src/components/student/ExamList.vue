<template>
  <div>
      <el-table :data="data" style="width: 90%" class="tableclass" stripe>
        <el-table-column prop="examId" label="考试编号"> </el-table-column>
        <el-table-column  label="考试名称"> 
            <template slot-scope="scope" >
                <span @click="gotoExamDetail(scope.row.examId)" style="cursor: pointer">
                        {{scope.row.examName}}
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="examStartTime" label="考试开始时间"> </el-table-column>
        <el-table-column prop="examEndTime" label="考试结束时间"> </el-table-column>
        <el-table-column prop="classes.classesName" label="面向班级"> </el-table-column>
        <el-table-column  label="考试状态" > 
            <template slot-scope="scope">
             <span v-if="scope.row.examType=='Pending'" style="color:green">
               {{scope.row.examType}}
             </span>
             <span v-if="scope.row.examType=='Running'" style="color:red">
                  {{scope.row.examType}}
             </span>
             <span v-if="scope.row.examType=='Ended'">
                  {{scope.row.examType}}
             </span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher.teacherName" label="创建人"> </el-table-column>
    </el-table>

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
                    teacher:{
                        teacherId:'',
                        teacherName:''
                    },
                    classes:{
                        classesName:''
                    }
                }
            ],
            pageSize: 4,
            currentPage: 1
        }
    },
    computed: {
        data () {
            return this.examInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
  },
    mounted: function () {
        this.getExamInfo();
    },
    methods:{
        gotoExamDetail(examId){
            // this.$router.push({path:'/home',query: {id:'1'}})
        },
        handleCurrent (val) {
            this.currentPage = val;
        },
        getExamInfo () {
            let params = new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/exam/queryExamInfo',
                data: params
            })
            .then((res) => {
            this.examInfo = res.data;
            })
            .catch((err) => {
            this.$message.error('查询考试信息失败');

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
  margin-left: 5%;
}
</style>