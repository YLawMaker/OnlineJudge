<template>
  <div class="paper-main">
    <div class="paper-header">
      <el-form label-position="top" label-width="100px" style="padding-top:0px; ">
        <el-row>
          <el-col :span="4" :offset="5">
            <el-form-item label="试卷">
              {{this.examName}}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考生">
              {{ userName }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考试时长">
              {{this.examTime}}分钟
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="倒计时间">
              <span class="downTime">{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div ref="paperContent" class="paper-content">
      <h1 style="text-align:center">填空题</h1>
      <div class='container'>
        <form>
          <div class="completionTab" v-for="(item,index) in this.examCompletion" :key="item.completionQuestionId">
            <!-- 题干 -->
            <div class="question">
              <span class="num">{{index+1}}、</span>
              {{item.completionQuestionDescription}}
            </div>
            <!-- 填空 -->
            <div>
              <div v-for="answers in item.completionQuestionAnswers" :key="answers.completionQuestionAnswerId"> 
                <!-- {{i.completionQuestionAnswerContent}}  -->
                <el-input placeholder="请输入答案" style="width:200px" v-model="answers.userInput" v-bind="answers.completionQuestionAnswerId"></el-input>
                {{answers.userInput}}
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </form>
      </div>
    </div>

    <div class="paper-footer">
      <el-button type="success" @click="submit()">提交填空题部分</el-button>
    </div>
  </div>
</template>

<script>
  export default {
      data() {
      return {
        examName:'',
        examTime:'',
        examId:'',
        userName:'',
        userId:'',
        examCompletion:{
          completionQuestionId:'',
          completionQuestionDifficulty:'',
          completionQuestionDescription:'',
          isPrivate:'',
          completionQuestionAnswers:{
            completionQuestionAnswerId:'',
            completionQuestionAnswerContent:'',
            completionQuestionAnswerNumber:'',
            userInput:'',
          },
        },
        //倒计小时
        hour: '',
        //倒计分钟
        minute: '',
        //倒计秒
        second: '',
        //计时器
        promiseTimer: '',
        //数据源
        tempDataSource: {
            
        },

      }
    },
    computed: {
      hourString () {
        return this.hour < 10 ? '0' + this.hour : '' + this.hour
      },
      minuteString () {
        return this.minute < 10 ? '0' + this.minute : '' + this.minute
      },
      secondString () {
        return this.second < 10 ? '0' + this.second : '' + this.second
      }
    },
    mounted: function(){
      let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/user/queryUserInfo',
                data: params
            })
            .then((res) => {
                if(res.data!=0){
                  this.userName=res.data.userName;
                }else{
                  this.$router.push("/userLogin")
                }
            })
            .catch((err) => {
              this.$message.error('查询用户信息失败') ;
            })
        this.examName=this.$route.query.examName;
        this.examId=this.$route.query.examId;
        this.userId=this.$route.query.userId;
        this.examEndTime=this.$route.query.examEndTime;
        this.examStartTime=this.$route.query.examStartTime;
        this.getExamCompletionInfo();
        var date=new Date();
        var now=date.getTime();
        var enddate=new Date(this.examEndTime);
        var startdate=new Date(this.examStartTime);
        var end=enddate.getTime(),start=startdate.getTime();
        this.examTime=(end-start)/1000/60;
        let remainTime=(end-now)/1000;
        if (remainTime> 0) {
          this.hour = Math.floor((remainTime / 3600) % 24)
          this.minute = Math.floor((remainTime / 60) % 60)
          this.second = Math.floor(remainTime % 60)
          this.countDowm()
        }
    },
    methods: {
      //获得填空题信息
      getExamCompletionInfo(){
        let params=new URLSearchParams();
            params.append('examId',this.examId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/examQuestion/queryExamQuestionCompletionByExamId',
                data: params
            })
            .then((res)=> {
                  this.examCompletion=res.data;
                  console.log(this.examCompletion);
                  
            })
            .catch((err)=> {
                this.$message.error('填空题信息读取失败');
            })
      },
      // 提交填空题
      submit(){
        var i=0,j=0,ac=0,numOfQuestions=0;
        for(i=0;i<this.examCompletion.length;i++){
          for(j=0;j<this.examCompletion[i].completionQuestionAnswers.length;j++){
            if(this.examCompletion[i].completionQuestionAnswers[j].completionQuestionAnswerContent==this.examCompletion[i].completionQuestionAnswers[j].userInput){
              ac++;
            }
            numOfQuestions++;
          }
        }
        alert(ac+' : '+numOfQuestions);
      },
      /**
       * 倒计时
       */
      countDowm () {
        let self = this
        clearInterval(this.promiseTimer)
        this.promiseTimer = setInterval(function () {
          if(self.hour===0 && self.minute===0 && self.second===0)
          {
            self.disabledAnswer=true;
          }
          if (self.hour === 0) {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.second = 0
              self.$emit('countDowmEnd', true)
              clearInterval(self.promiseTimer)
            } else {
              self.second -= 1
            }
          } else {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.hour -= 1
              self.minute = 59
              self.second = 59
            } else {
              self.second -= 1
            }
          }
        }, 1000)
      },
    }

  }
</script>

<style scoped>
  .paper-main {
    margin: 10px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden
  }

  .paper-header {
    width: 100%;
    height: 80px;
    background-color: #f7f7f7;
    position: absolute;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .1);
    -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .1);
  }

  .paper-content {
    position: absolute;
    left: 150px;
    top: 60px;
    right: 150px;
    bottom: 45px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #e4e4e4;
    border-top: none;
  }

  .paper-footer {
    position: absolute;
    padding: 5px 10px;
    left: 150px;
    right: 150px;
    bottom: 0px;
    height: 45px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f7f7f7;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
    -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
    text-align: center;
  }

  .downTime{
    color: rgb(230, 93, 110);
    font-size: 16px;
    font-weight: bold;
  }
</style>

