<template>
<el-card>
  <div>
      <div style="text-align:center">
          {{testInfo.testName}}
      </div>
      <div >
        <el-table :data="exerciseList" style="width: 90%;margin-left:5%" stripe>
            <el-table-column label=" " width="30%"> 
                <template slot-scope="scope">
                    <div v-if="scope.row.exerciseDescription==='success'">
                        <i class="el-icon-check"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="问题编号"  width="100px">
                <template slot-scope="scope">
                    <div @click="getoTestExerciseDetail(scope.row.exerciseId)" style="color:blue;cursor:pointer">
                        {{"第"+(scope.$index+1)+"题"}}
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column prop="exerciseTitle" label="问题标题" align="center"></el-table-column>
            <el-table-column label="正确率" align="center" width="200px">
                <template slot-scope="scope">
                {{
                    getAcceptRate(
                    scope.row.exerciseCorrectTimes,
                    scope.row.exerciseSubmitTimes
                    )
                }}
                </template>
            </el-table-column>
        </el-table>
      </div>

      <div class="foot">
          <span @click="goToTestStandings()" style="color:black;cursor:pointer">
              standings
          </span>
          <span @click="goToTestStatus()" style="color:black;cursor:pointer;margin-left:2%">
              status
          </span>
      </div>
  </div>
</el-card>
</template>

<script>
export default {
    data(){
        return{
            testInfo:{
                testName:'',
                testId:'',
                testStatus:'',
            },
            //这里用的是习题的记录来保存提交成功和次数  用习题详情保存了是否成功
            exerciseList:[],
        }
    },
    mounted: function(){
        this.testInfo.testName=this.$route.query.testName;
        this.testInfo.testId=this.$route.query.testId;
        this.testInfo.testStatus=this.$route.query.testStatus;
        this.getTestQuestionList();
    },
    methods:{
        //跳转到测试编程题状态界面
        goToTestStatus(){
            if(this.testInfo.testStatus=='Running'){
                this.$router.push({path:'/testProgrammingRealTimeStatus',query:{"testId":this.testInfo.testId,'testStatus':'Running'}})
            }else{
                //传递表示测试已结束  
                this.$router.push({path:'/testProgrammingRealTimeStatus',query:{"testId":this.testInfo.testId,'testStatus':'Ending'}})
            }
        },
        //跳转到测试习题具体信息界面
        getoTestExerciseDetail(testProgrammingQuestionId){
            if(this.testInfo.testStatus=='Running'){
                this.$router.push({path:'/testExerciseDetail',query:{'testProgrammingQuestionId':testProgrammingQuestionId}})
            }else{
                //获取习题编号并跳转到习题详情界面
                let params=new URLSearchParams();
                params.append('testProgrammingQuestionId',testProgrammingQuestionId);
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
        //跳转到测试名次表界面
        goToTestStandings(){
            if(this.testInfo.testStatus=='Running'){
                this.$router.push({path:'/testStandings',query:{"testId":this.testInfo.testId,'testStatus':'Running'}})
            }else{
                //传递表示测试已结束  
                this.$router.push({path:'/testStandings',query:{"testId":this.testInfo.testId,'testStatus':'Ending'}})
            }
        },
        //获得习题比率
        getAcceptRate (exerciseCorrectTimes, exerciseSubmitTimes) {
            if (!(exerciseCorrectTimes / exerciseSubmitTimes == exerciseCorrectTimes / exerciseSubmitTimes)) {
                var acceptRate = 0 + "%" + "(" + exerciseCorrectTimes + "/" + exerciseSubmitTimes + ")";
            }
            else {
                var acceptRate = ((exerciseCorrectTimes / exerciseSubmitTimes) * 100).toFixed(2) + "%" + "(" + exerciseCorrectTimes + "/" + exerciseSubmitTimes + ")";
            }
            return acceptRate;
        },
        //获取习题问题列表
        getTestQuestionList(){
            let params = new URLSearchParams();
            params.append("testId",this.testInfo.testId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/testProgramming/queryTestProgrammingQuestionAndIsSuccess',
                data: params
            })
            .then((res) => {
                this.exerciseList=res.data;
            })
            .catch((err) => {
                this.$message.error('获取测试列表失败');
            })
        },
    }
}
</script>

<style scoped>
.foot{
    margin-top: 20px;
    margin-left: 100px;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>