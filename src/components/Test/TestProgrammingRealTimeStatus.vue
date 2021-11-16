<template>
    <div>
    <el-table :data="data" style="width: 90%" class="tableclass"  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" stripe>
      <el-table-column prop="testProgrammingQuestionHistoryId" label="测试编程记录编号" width="200px">
      </el-table-column>
       <el-table-column label="习题编号" width="100px">
        <template slot-scope="scope">
          <div @click="goToTestDetail()" style="color:blue;cursor:pointer">
              {{changeShowQuestion(scope.row.testProgrammingQuestion.testProgrammingQuestionId)}}
          </div>
              
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
              path: '/testCodeSubmit',
              query: {
                  testProgrammingQuestionId: scope.row.testProgrammingQuestion.testProgrammingQuestionId,
                  testProgrammingQuestionHistoryId: scope.row.testProgrammingQuestionHistoryId,
                },
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

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="testProgrammingRealTimeStatusList.length"
        @current-change="handleCurrent"
        v-if="testProgrammingRealTimeStatusList.length != 0"
      >
      </el-pagination>
    </div>
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
            testId:'',
            userId:'',
            testProgrammingRealTimeStatusList:[],
            testProgrammingList:[],
            pageSize: 4,
            currentPage: 1,
        }
    },
    computed: {
      data () {
        return this.testProgrammingRealTimeStatusList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    },
    mounted: function(){
        this.testId=this.$route.query.testId;
        //获取测试编程题实时状态
        this.getTestProgrammingRealTimeStatusInfo();
        //获取全部的测试编程题
        this.getTestProgrammingInfo();
        //获取用户信息
        this.getUserInfo();

    },
    methods:{
        //跳转到测试详情界面
        goToTestDetail(){
            let params = new URLSearchParams();
            params.append("testId",this.testId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/test/queryTestInfoByTestId',
                data: params
            })
            .then((res) => {
                this.$router.push({path:'/testDetail',query:{"testName":res.data.testName,"testId":res.data.testId,"testStatus":res.data.testStatus}})
            })
            .catch((err) => {
                this.$message.error('获取测试信息失败');

            })
          
        },
        //页面变换
        handleCurrent (val) {
          this.currentPage = val;
          this.setContextData("exerciseRealTimeStatusCurrentPage", val);
        },
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

        //获取用户信息
        getUserInfo () {
          let params = new URLSearchParams();
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/user/queryUserInfo',
            data: params
          })
            .then((res) => {
              if (res.data != false) {
                this.userId = res.data.userId;
              }
            })
            .catch((err) => {
              this.$message.error('查询用户信息失败');

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
</style>