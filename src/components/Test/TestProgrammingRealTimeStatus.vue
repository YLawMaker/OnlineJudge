<template>
    <div>
    <el-table :data="testProgrammingRealTimeStatusList" style="width: 90%" class="tableclass"  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" stripe>
      <el-table-column prop="testProgrammingQuestionHistoryId" label="测试编程记录编号" width="200px">
      </el-table-column>
       <el-table-column label="习题编号" width="100px">
        <template slot-scope="scope">
              {{changeShowQuestion(scope.row.testProgrammingQuestion.testProgrammingQuestionId)}}
        </template>
      </el-table-column>
      <el-table-column prop="testProgrammingSubmitTime" label="提交时间">
      </el-table-column>
      <el-table-column prop="testProgrammingResult" label="提交结果">
      </el-table-column>
     

      <el-table-column label="代码">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.user.userId===userId"
            style="text-decoration: none; color: blue"
            :to="{
              path: '/submitCode',
             
            }"
          >
            代码
          </router-link>
          <span v-else> 代码 </span>
        </template>
      </el-table-column>
      <el-table-column label="提交作者">
        <template slot-scope="scope">
          <router-link
            style="text-decoration: none; color: blue"
            :to="{
              path: 'userInfo',
              query: {
                userId: scope.row.user.userId,
              },
            }"
          >
            {{ scope.row.user.userName }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            testProgrammingRealTimeStatusInfo:{
                testProgrammingQuestionHistoryId:'',
                testProgrammingSubmitTime:'',
                testProgrammingCode:'',
                testProgrammingResult:'',
                testProgrammingQuestion:{
                    testProgrammingQuestionId:'',
                },
                user:{
                    userId:'',
                }
            },
            testId:4,
            userId:6,
            testProgrammingRealTimeStatusList:[],
            testProgrammingList:[],
        }
    },
    mounted: function(){
        //获取测试编程题实时状态
        this.getTestProgrammingRealTimeStatusInfo();
        //获取全部的测试编程题
        this.getTestProgrammingInfo();

    },
    methods:{
        //将测试编程题变成第几题
        changeShowQuestion(testProgrammingQuestionId){
            for(var i=0;i<this.testProgrammingList.length;i++){
                if(this.testProgrammingList[i].exerciseId==testProgrammingQuestionId){
                    return '第'+(i+1)+'题';
                }
            }
        },
        //获取测试编程题实时状态
        getTestProgrammingRealTimeStatusInfo () {
            let params = new URLSearchParams();
            params.append("testId",this.testId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/testProgrammingHistory/queryTestProgrammingRealStatus',
                data: params
            })
            .then((res) => {
                this.testProgrammingRealTimeStatusList=res.data;
            })
            .catch((err) => {
                this.$message.error('获取测试编程实时状态失败');

            })
        },

        //获取全部的测试编程题
        getTestProgrammingInfo () {
            let params = new URLSearchParams();
            params.append("testId",this.testId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/testProgramming/queryTestProgrammingQuestionByTestId',
                data: params
            })
            .then((res) => {
                this.testProgrammingList=res.data;
            })
            .catch((err) => {
                this.$message.error('获取全部的测试编程题');

            })
        },
    }
}
</script>

<style>
.tableclass {
  margin-left: 5%;
}
</style>