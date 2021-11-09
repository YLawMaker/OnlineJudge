<template>
  <div>
      <el-table :data="testStandingsInfo" style="width: 100%" stripe>
        <el-table-column label="Rank"> 
                <template slot-scope="scope">
                    {{(scope.$index+1)}}
                </template>
            </el-table-column>
        <el-table-column prop="userName" label="用户姓名" ></el-table-column>
          <div v-if="testStandingsInfo.length>0">
              <div v-for="(item,index) in testStandingsInfo[0].testProgrammingQuestionResultStateTools" :key="index" >
                  <el-table-column  :label="'问题'+(index+1)" >
                      <template slot-scope="scope">
                          <div v-if="scope.row.testProgrammingQuestionResultStateTools[index].testProgrammingQuestionResult==='success'">
                              成功
                          </div>
                          <div v-else-if="scope.row.testProgrammingQuestionResultStateTools[index].testProgrammingQuestionResult==='error'">
                              失败
                          </div>
                          <div v-else>
                              没做
                          </div>
                      </template>
                  </el-table-column>
              </div>
          </div>
          
        
        
    </el-table>
    
  </div>
</template>

<script>
export default {
  data(){
    return{
      testId:'',
      testStandingsInfo:[],
    }
  },
  mounted: function(){
    this.testId=this.$route.query.testId;
    this.getTestStandings();
  },
  methods:{
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
              console.log(this.testStandingsInfo)
          })
          .catch((err) => {
              this.$message.error('获取测试名次排行');
          })
      },
  }
}
</script>

<style>

</style>