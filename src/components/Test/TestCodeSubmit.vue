<template>
  <div>
      <div class="submit">
           
           
            <el-input type="textarea" class="submitText" v-model="code" :rows="20" placeholder="请输入代码" resize="none">

            </el-input>
            <el-button type="primary" @click="submitCode()">提交</el-button>
      </div>
     
  </div>
</template>

<script>
export default {
    data(){
        return{
            code:'',
            testId:'',
            testProgrammingQuestionId:'',
            testProgrammingQuestionHistoryId:'',
        }    
    },
    mounted: function () {
      this.testProgrammingQuestionId = this.$route.query.testProgrammingQuestionId;
      //测试编程题历史编号和测试状态是从测试实时状态传过来的
      this.testProgrammingQuestionHistoryId = this.$route.query.testProgrammingQuestionHistoryId;
      this.testStatus = this.$route.query.testStatus;
      //获取testId
      this.getTestId();
      if(this.testProgrammingQuestionHistoryId==null){

      }
      //有传值过来
      else{
            this.getCodeInfo();
      }
      
    },
    methods:{
        //提交代码
        submitCode(){
                if(this.testStatus=='Running'){
                    if(this.code.trim().length<20){
                        this.$message.warning('代码长度过短');
                    }
                    else{
                        let yy = new Date().getFullYear();
                        let mm = new Date().getMonth()+1;
                        let dd = new Date().getDate();
                        let hh = new Date().getHours()<10?'0'+new Date().getHours():new Date().getHours();
                        let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
                        var time = yy+'-'+mm+'-'+dd+' '+hh+':'+mf;
                        let params=new URLSearchParams();
                        params.append('testProgrammingQuestionId',this.testProgrammingQuestionId);
                        params.append('testProgrammingCode',this.code);
                        params.append('testProgrammingSubmitTime',time);
                        this.$axios({
                            method: 'post',
                            headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                        },
                            url: '/testProgrammingHistory/addTestProgrammingQuestionHistoryInfo',
                            data: params
                        })
                        .then((res)=> {
                            if(res.data==true){
                                
                                this.$message.success('提交成功');
                                this.$router.push({path:'/testProgrammingRealTimeStatus',query:{"testId":this.testId}})
                            }
                        })
                        .catch((err)=> {
                            this.$message.error('提交失败');
                        })
                    }
                }else{
                    //测试不在运行中，不能往测试中提交代码
                    this.$message.warning('测试已结束,不能提交代码');
                }
                
        },
        //获得提交的代码信息
        getCodeInfo(){
            let params=new URLSearchParams();
            params.append('testProgrammingQuestionHistoryId',this.testProgrammingQuestionHistoryId);
        
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/testProgrammingHistory/queryTestProgrammingHistoryByTestProgrammingQuestionHistoryId',
                data: params
            })
            .then((res)=> {
                this.code=res.data.testProgrammingCode;
            })
            .catch((err)=> {
                this.$message.error('查看代码失败');
            })
        },
        //获取testId
        getTestId(){
            let params=new URLSearchParams();
            params.append('testProgrammingQuestionId',this.testProgrammingQuestionId);
        
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/testProgramming/queryTestIdByTestProgrammingQuestionId',
                data: params
            })
            .then((res)=> {
                this.testId=res.data;
            })
            .catch((err)=> {
                this.$message.error('获取testId失败');
            })
        }
                        
                
        
    }

}
</script>

<style>
.submit{
    text-align: center;
    margin-left: 32.5%;
    width: 35%;
    height: 700px;
}
.submitText{
    resize: none;
    width: 600px;
    height: 500px;
}
</style>