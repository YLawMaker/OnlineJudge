<template>
    <div>
      
    
    <span class="span-label">问题名称</span>
    <el-select
      v-model="select_testProgrammingQuestionId"
      placeholder="请选择题目"
      size="mini"
      class="handle-select"
      style="margin-left: 1%"
    >
      <el-option
        v-for="(item,index) in testProgrammingQuestionNameOptions"
        :key="index"
        :label="item.testProgrammingQuestionLabel"
        :value="item.testProgrammingQuestionId"
      >
      </el-option>
    </el-select>
    <span class="span-label">提交作者姓名</span>
    <el-input
      style="margin-left: 1%"
      v-model="select_userName"
      size="mini"
      placeholder="提交作者姓名"
      class="handle-input"
      clearable=""
    >
    </el-input>
    <span class="span-label">结果</span>
    <el-select
      v-model="select_testProgrammingQuestionResult"
      placeholder="请选择"
      size="mini"
      class="handle-select"
      style="margin-left: 1%"
    >
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button
      type="primary"
      size="mini"
      @click="searchTestProgrammingRealTimeInfo()"
      style="margin-left: 2%"
      >查询</el-button
    >
    <el-table :data="data" style="width: 90%" class="tableclass"  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" stripe>
      <el-table-column prop="testProgrammingQuestionHistoryId" label="测试编程记录编号" width="200px">
      </el-table-column>
       <el-table-column label="习题编号" width="100px">
        <template slot-scope="scope">
          <div @click="goToTestExerciseDetail(scope.row.testProgrammingQuestion.testProgrammingQuestionId)" style="color:blue;cursor:pointer">
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
                  testStatus:testStatus
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
            testStatus:'',
            testProgrammingRealTimeStatusList:[],
            testProgrammingList:[],
            pageSize: 4,
            currentPage: 1,
            select_testProgrammingQuestionId:'',
            select_userName:'',
            select_testProgrammingQuestionResult:'',
            testProgrammingQuestionNameOptions:[],
            statusOptions: [
              {
                value: 'All',
                label: 'All'
              },
              {
                value: 'accept',
                label: 'accept'
              }, {
                value: 'wrong answer',
                label: 'wrong answer'
              },
              {
                value: 'compile error',
                label: 'compile error'
              },
              {
                value: 'time out',
                label: 'time out'
              },
            ],
        }
    },
    computed: {
      data () {
        return this.testProgrammingRealTimeStatusList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    },
    mounted: function(){
        this.testId=this.$route.query.testId;
        this.testStatus=this.$route.query.testStatus;
        //获取测试编程题实时状态
        this.getTestProgrammingRealTimeStatusInfo();
        //获取全部的测试编程题
        this.getTestProgrammingInfo();
        //获取用户信息
        this.getUserInfo();
    },
    methods:{
        //跳转到测试编程题详情界面
        goToTestExerciseDetail(testProgrammingQuestionId){
            if(this.testStatus=='Running'){
                this.$router.push({path:'/testExerciseDetail',query:{"testProgrammingQuestionId":testProgrammingQuestionId}})
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
        //页面变换
        handleCurrent (val) {
          this.currentPage = val;
        },
        //将测试编程题变成第几题
        changeShowQuestion(testProgrammingQuestionId){
            for(var i=0;i<this.testProgrammingList.length;i++){
                if(this.testProgrammingList[i].exerciseId==testProgrammingQuestionId){
                    return '第'+(i+1)+'题';
                }
            }
        },
        //根据输入信息获取测试编程题实时状态
        searchTestProgrammingRealTimeInfo(){
          //根据输入的内容查询信息
          let params = new URLSearchParams();
          params.append("testId",this.testId);
          if(this.select_testProgrammingQuestionId=='全部题目'||this.select_testProgrammingQuestionId==''){
              params.append("testProgrammingQuestionId",0);
          }else{
              params.append("testProgrammingQuestionId",this.select_testProgrammingQuestionId);
          }
          if(this.select_userName==''){
               params.append("userName",'');
          }else{
              params.append("userName",this.select_userName);
          }
          if(this.select_testProgrammingQuestionResult==''||this.select_testProgrammingQuestionResult=='All'){
               params.append("testProgrammingResult",'');
          }else{
              params.append("testProgrammingResult",this.select_testProgrammingQuestionResult);
          }
          this.$axios({
              method: 'post',
              headers: {
              "Content-Type": "application/x-www-form-urlencoded"
              },
              url: '/testProgrammingHistory/queryTestProgrammingRealStatusBySearchInfo',
              data: params
          })
          .then((res) => {
               this.testProgrammingRealTimeStatusList=res.data;
          })
          .catch((err) => {
              this.$message.error('获取测试编程实时状态失败');

          })
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

        //获取全部的测试编程题 并且给查询用的测试问题下拉框赋值
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
                this.testProgrammingQuestionNameOptions=[];
                for(var i=0;i<this.testProgrammingList.length;i++){
                  var testProgrammingQuestion=new Object;
                  testProgrammingQuestion.testProgrammingQuestionId=this.testProgrammingList[i].exerciseId;
                  testProgrammingQuestion.testProgrammingQuestionLabel='第'+(i+1)+'题';
                  this.testProgrammingQuestionNameOptions.push(testProgrammingQuestion);
                }
                var testProgrammingQuestion=new Object;
                testProgrammingQuestion.testProgrammingQuestionId='全部题目';
                testProgrammingQuestion.testProgrammingQuestionLabel='全部题目';
                this.testProgrammingQuestionNameOptions.unshift(testProgrammingQuestion);
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
.handle-input {
  width: 200px;
  display: inline-block;
}
.span-label {
  margin-left: 2%;
}
</style>