<template>
  <el-card>
  <div>

      <el-table :data="data" style="width: 100%"  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" stripe>
            <el-table-column label="Rank" fixed='left'> 
                <template slot-scope="scope">
                    {{(scope.$index+1)}}
                </template>
            </el-table-column>  
            <el-table-column  label="用户姓名" fixed='left'>
                <template slot-scope="scope">
                        <router-link style="color:blue"
                        :to="{  
                                path: 'userInfo',     
                                query: {   
                                    userId:scope.row.userId, 
                                    },  
                                }" 
                            >
                            {{scope.row.userName}}
                            </router-link>
                    </template>
            </el-table-column>
          <div v-if="testStandingsInfo.length>0">
              <div v-for="(item,index) in testStandingsInfo[0].testProgrammingQuestionResultStateTools" :key="index" >
                  <el-table-column   scoped-slot >
                      <template slot="header">
                            <div @click="goToTestExerciseDetail(index)" style="color:blue;cursor:pointer">
                                {{('第'+(index+1)+'题')}}
                            </div>
                        </template>
                      <template slot-scope="scope">
                          <div v-if="scope.row.testProgrammingQuestionResultStateTools[index].testProgrammingQuestionResult==='success'" style="color:green">
                              success
                          </div>
                          <div v-else-if="scope.row.testProgrammingQuestionResultStateTools[index].testProgrammingQuestionResult==='error'" style="color:#D01F3C">
                              error
                          </div>
                          <div v-else >
                              
                          </div>
                      </template>
                  </el-table-column>
              </div>
          </div>
        </el-table>
        <div class="pagination">
            <el-pagination
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="testStandingsInfo.length"
                @current-change="handleCurrent"
            >
            </el-pagination>
            
        </div>
  </div>
  </el-card>
</template>

<script>
export default {
  data(){
    return{
      testId:'',
      testStatus:'',
      pageSize: 4,
      currentPage: 1,
      testStandingsInfo:[],
    }
  },
  mounted: function(){
    //获取测试编号 和考试状态
    this.testId=this.$route.query.testId;
    this.testStatus=this.$route.query.testStatus;
    //获取测试名称排行
    this.getTestStandings();
  },
   computed: {
    data () {
      return this.testStandingsInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
  },
  methods:{
     //改变页码
    handleCurrent (val) {
      this.currentPage = val;
    },
    //前往测试习题详情界面
    goToTestExerciseDetail(index){
        if(this.testStatus=='Running'){
            this.$router.push({path:'/testExerciseDetail',query:{'testProgrammingQuestionId':this.testStandingsInfo[0].testProgrammingQuestionResultStateTools[index].testProgrammingQuestionId}})
        }else{
            //获取习题编号并跳转到习题详情界面
            let params=new URLSearchParams();
            params.append('testProgrammingQuestionId',this.testStandingsInfo[0].testProgrammingQuestionResultStateTools[index].testProgrammingQuestionId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/testProgramming/queryExerciseByTestProgrammingQuestionId',
                data: params
            })
            .then((res)=> {
                    this.$router.push({path:'/exerciseDetail',query:{'exerciseId':res.data.exerciseId}})
            })
            .catch((err)=> {
                this.$message.error('测试编程题读取失败');
            })
        }
      },
      //获取测试名称排行
      getTestStandings(){
          let params = new URLSearchParams();
          params.append("testId",this.testId);
          this.$axios({
              method: 'post',
              headers: {
              "Content-Type": "application/x-www-form-urlencoded"
              },
              url: '/testProgrammingHistory/queryTestRealStatus',
              data: params
          })
          .then((res) => {
              this.testStandingsInfo=res.data;
            //   console.log(this.testStandingsInfo)
          })
          .catch((err) => {
              this.$message.error('获取测试名次排行');
          })
      },
  }
}
</script>

<style scoped>
.el-card {
  border: 1px solid #7c7979;
}
/* 分页的css样式 */
.pagination .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>