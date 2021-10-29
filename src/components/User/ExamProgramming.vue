<template>
<div id='app'>
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
    <div class="paper-content">
        <h1 style="text-align:center">编程题</h1>
        <div class='container'>
            <form>
              <div class="choiceTab" v-for="(item,index) in exerciseInfo" :key="item.exerciseId">
                <!-- 题干 -->
                <div class="question">
                <span class="num">第{{index+1}}题：  {{item.exerciseTitle}}</span>
                <div class="title">Problem Description</div>
                {{item.exerciseDescription}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Input</div>
                {{item.exerciseInput}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Output</div>
                {{item.exerciseOutPut}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Input</div>
                {{item.exerciseSampleInput}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Output</div>
                {{item.exerciseSampleOutput}}
                </div>
                <!-- 输入代码 -->
                <div class="head">
                  <form role="form">
                    <div class="editor-header">
                      <div class="code">
                          <el-table :data="tabledatas" >
                          <el-table-column label="代码输入框">
                              <textarea placeholder="请输入代码" v-show="true" :rows="10" v-model="item.code"></textarea>
                          </el-table-column>
                          </el-table>
                      </div>
                    </div>
                  </form>
                  <pre id="editor" style="height:10px"></pre>
                  <el-button class="btn btn-primary" @click="submit(item.exerciseId,item.code)" :loading="item.subStat">提交</el-button>
                  <pre style="height:15px"></pre>
                  </div>
                  <div class="clearfix"></div>
              </div>
            </form>
            
          </div>
    </div>
    <div class="paper-footer">
          <el-button type="success" class="sumb" >提交编程题部分</el-button>
        </div>
</div>
</template>

<script>
export default {
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
      this.examEndTime=this.$route.query.examEndTime;
      this.examStartTime=this.$route.query.examStartTime;
      this.examLanguage=this.$route.query.examLanguage;
      this.examId=this.$route.query.examId;
      this.userId=this.$route.query.userId;
      this.getExamProgrammingInfo();
      //let remainTime=90*60;
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
  name: 'app',
  data () {
    return {
      //倒计小时
      hour: '',
      //倒计分钟
      minute: '',
      //倒计秒
      second: '',
      //计时器
      promiseTimer: '',
      tabledatas: [
        { tab: '' }
      ],
      exerciseInfo:{
        exerciseId:'',
        exerciseTitle:'',
        exerciseCorrectTimes:'',
        exerciseSubmitTimes:'',
        exerciseDescription:'',
        exerciseInput:'',
        exerciseOutPut:'',
        exerciseSampleInput:'',
        exerciseSampleOutput:'',
        code:'',
        subStat:false,
      },
      examId:'',
      examName:'',
      examTime:'',
      examLanguage:'',
      examEndTime:'',
      userName:'',
      userId:'',
    }
  },
  methods: {
    sub(exerciseId){
      var i=0;
      for(i=0;i<this.exerciseInfo.length;i++){
        if(this.exerciseInfo[i].exerciseId===exerciseId){
          if(this.exerciseInfo[i].subStat==true)
          this.exerciseInfo[i].subStat=false;
          else
          this.exerciseInfo[i].subStat=true;

          this.exerciseInfo[i].exerciseDescription='asd';
          break;
        }
      }
    },
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
      getExamProgrammingInfo(){
            let params=new URLSearchParams();
            params.append('examId',this.examId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/examQuestion/queryExamQuestionProgrammingByExamId',
                data: params
            })
            .then((res)=> {
                  this.exerciseInfo=res.data;
                  console.log(this.exerciseInfo);
                  
            })
            .catch((err)=> {
                this.$message.error('编程题信息读取失败');
            })
        },
        submit(exerciseId,code,subStat){
          let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/user/queryUserInfo',
                data: params
            })
            .then((res)=> {
                  if(res.data!=0){
                        if(code.length<20){
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
                            params.append('userId',this.userId);
                            params.append('exerciseId',exerciseId);
                            params.append('exerciseSubmitLanguage',this.examLanguage);
                            params.append('exerciseCode',code);
                            params.append('exerciseSubmitTime',time);
                            this.$axios({
                                method: 'post',
                                headers: {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                url: '/exerciseHistory/addCodeInfo',
                                data: params
                            })
                            .then((res)=> {
                                if(res.data==true){
                                    this.$message.success("提交成功");
                                }
                            })
                            .catch((err)=> {
                                this.$message.error('提交失败');
                            })
                        }
                        
                  }else{
                      this.$message('请先登录');
                      this.$router.push('/userLogin');
                  }
            })
            .catch((err)=> {
                this.$message.error('查询学生信息失败');
                
            })
        },
  }
  
}
</script>
<style>
.question {
  text-align: left;
}
.title {
  font-size: 200%;
  color: rgb(0, 140, 255);
}
.num {
  font-size: 150%;
}
.examTitle {
  font-size: 200%;
  color: black;
}
.code {
  width: 100%;
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
}
.code textarea {
  width: 100%;
  margin: 0.75rem  0;
  border: none;
  outline: none;
  padding-left: 1.125rem;
  height: 16.5rem;
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

  .downTime{
    color: rgb(230, 93, 110);
    font-size: 16px;
    font-weight: bold;
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
</style>