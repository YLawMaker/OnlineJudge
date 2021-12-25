<template>
  <el-container>
    <div class="paper-header">
      <el-form
        label-position="top"
        label-width="100px"
        style="padding-top: 0px"
      >
        <el-row>
          <el-col :span="4" :offset="5">
            <el-form-item label="试卷">
              {{ this.examInfo.examName }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考生">
              {{ this.userName }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="考试时长">
              {{ this.examTime }}分钟
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="倒计时间">
              <span class="downTime">{{
                hour
                  ? hourString + ":" + minuteString + ":" + secondString
                  : minuteString + ":" + secondString
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-main class="content">
      <h1 style="text-align: center">{{ this.examInfo.examName }}</h1>
      <table class="table table-striped">
        <tbody>
          <tr>
            <th style="text-align: center">题目类型</th>
            <th style="text-align: center; width: 50%">题目总数</th>
            <th style="text-align: center; width: 50%">是否完成</th>
          </tr>
          <tr>
            <td>
              <el-button type="primary" @click="gotoChoice">选择题</el-button>
            </td>
            <td>{{ this.sumOfChoice }}</td>
            <td
              v-if="
                this.examHistory.examChoiceQuestionTotals == 0 &&
                this.sumOfChoice != 0
              "
            >
              否
            </td>
            <td v-else>是</td>
          </tr>
          <tr>
            <td>
              <el-button type="primary" @click="gotoCompletion"
                >填空题</el-button
              >
            </td>
            <td>{{ this.sumOfCompletion }}</td>
            <td
              v-if="
                this.examHistory.examCompletionQuestionTotals == 0 &&
                this.sumOfCompletion != 0
              "
            >
              否
            </td>
            <td v-else>是</td>
          </tr>
          <tr>
            <td>
              <el-button type="primary" @click="gotoProgram">编程题</el-button>
            </td>
            <td>{{ this.sumOfProgramming }}</td>
            <td>否</td>
          </tr>
        </tbody>
      </table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      examQuestions: {
        examQuestionId: "",
        choiceQuestion: {
          choiceQuestionId: "",
          choiceQuestionDescription: 0,
        },
        completionQuestion: {
          completionQuestionId: "",
          completionQuestionDescription: 0,
        },
        exercise: {
          exerciseId: "",
        },
      },
      examInfo: [
        {
          examId: "",
          examName: "",
          examStartTime: "",
          examEndTime: "",
          examStatus: "",
          examLanguage: "",
          examChoiceQuestionScore: "",
          examCompletionQuestionScore: "",
          examProgrammingScore: "",
        },
      ],
      examHistory: {
        examHistoryId: "",
        examChoiceQuestionTotals: "",
        examProgrammingTotals: "",
        examCompletionQuestionTotals: "",
        examTotals: "",
      },
      sumOfChoice: 0,
      sumOfCompletion: 0,
      sumOfProgramming: 0,
      userId: "",
      leftTime: "",
      choiceStatus: "",
      completionStatus: "",
      programmingStatus: "",
      userName: '',
      examTime: '',
      //倒计小时
      hour: '',
      //倒计分钟
      minute: '',
      //倒计秒
      second: '',
      //计时器
      promiseTimer: '',
    };
  },
  computed: {
    hourString () {
      return this.hour < 10 ? "0" + this.hour : "" + this.hour;
    },
    minuteString () {
      return this.minute < 10 ? "0" + this.minute : "" + this.minute;
    },
    secondString () {
      return this.second < 10 ? "0" + this.second : "" + this.second;
    },
  },
  mounted: function () {
    let params = new URLSearchParams();
    this.$axios({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: "/user/queryUserInfo",
      data: params,
    })
      .then((res) => {
        if (res.data != 0) {
          this.userName = res.data.userName;
        } else {
          this.$router.push("/userLogin");
        }
      })
      .catch((err) => {
        this.$message.error("查询用户信息失败");
      });

    this.examInfo.examId = this.$route.query.examId;
    this.userId = this.$route.query.userId;
    this.getExamInfo();
    this.getExamQuestion();
    this.getScoresOfExamQuestions();
    this.choiceStatus = this.$route.query.choiceStatus;
    this.completionStatus = this.$route.query.completionStatus;
    this.programmingStatus = this.$route.query.programmingStatus;
    if (!this.$route.query.choiceStatus) this.choiceStatus = 2;
    this.examEndTime = this.$route.query.examEndTime;
    this.examStartTime = this.$route.query.examStartTime;
    var date = new Date();
    var now = date.getTime();
    var enddate = new Date(this.examEndTime);
    var startdate = new Date(this.examStartTime);

    var end = enddate.getTime(),
      start = startdate.getTime();
    this.examTime = (end - start) / 1000 / 60;
    let remainTime = (end - now) / 1000;
    if (remainTime > 0) {
      this.hour = Math.floor((remainTime / 3600) % 24);
      this.minute = Math.floor((remainTime / 60) % 60);
      this.second = Math.floor(remainTime % 60);
      this.countDowm();
    }
    if (remainTime <= 0) remainTime = 0.01;
    //时间结束强制退出
    this.$nextTick(() => {
      if (remainTime > 0) setTimeout(this.forceToSubmitExam, remainTime * 1000);
    });
    if (this.programmingStatus == 0) {
      //退出界面
      this.$router.replace({
        path: "/examList",
        query: { userId: this.userId },
      });
    }
  },
  methods: {
    //倒计时
    countDowm () {
      let self = this
      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0 && self.minute === 0 && self.second === 0) {
          self.disabledAnswer = true;
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
    //时间结束自动退出考试
    forceToSubmitExam () {
      this.$router.replace({
        path: "/examList",
        query: { userId: this.userId },
      });
    },
    gotoChoice () {
      if (this.examHistory.examChoiceQuestionTotals == 0 && this.sumOfChoice != 0) {
        this.$router.replace({
          path: "/examChoice",
          query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examStartTime: this.examInfo.examStartTime,
            examChoiceQuestionScore: this.examInfo.examChoiceQuestionScore,
          },
        });
      } else {
        this.$message.error("请按顺序答题");
      }
    },
    gotoProgram () {
      if (this.examHistory.examCompletionQuestionTotals != 0 || this.sumOfCompletion == 0) {
        this.$router.replace({
          path: "/examProgramming",
          query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examLanguage: this.examInfo.examLanguage,
            examStartTime: this.examInfo.examStartTime,
            examProgrammingQuestionScore: this.examInfo.examProgrammingScore,
          },
        });
      } else {
        this.$message.error("请从选择题开始，按顺序答题");
      }
    },
    gotoCompletion () {
      if (
        (this.examHistory.examCompletionQuestionTotals == 0 &&
          this.examHistory.examChoiceQuestionTotals != 0) || (this.sumOfCompletion == 0 && this.sumOfCompletion != 0)
      ) {
        this.$router.replace({
          path: "/examCompletion",
          query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examStartTime: this.examInfo.examStartTime,
            examCompletionQuestionScore:
              this.examInfo.examCompletionQuestionScore,
          },
        });
      } else {
        this.$message.error("请从选择题开始，按顺序答题");
      }
    },
    //获取所有考试题目
    getExamQuestion () {
      let params = new URLSearchParams();
      params.append("examId", this.examInfo.examId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/examQuestion/queryExamQuestionByExamId",
        data: params,
      })
        .then((res) => {
          this.examQuestions = res.data;
          console.log(this.examQuestions);
          var i = 0;
          for (i = 0; i < this.examQuestions.length; i++) {
            var EQ = new Object();
            EQ.choiceQuestion = this.examQuestions[i].choiceQuestion;
            EQ.completionQuestion = this.examQuestions[i].completionQuestion;
            EQ.exercise = this.examQuestions[i].exercise;
            if (EQ.choiceQuestion != null) {
              if (EQ.choiceQuestion.choiceQuestionDescription != null)
                this.sumOfChoice++;
            }
            if (EQ.completionQuestion != null) {
              if (EQ.completionQuestion.completionQuestionDescription != null)
                this.sumOfCompletion++;
            } else if (EQ.exercise != null) {
              this.sumOfProgramming++;
            }
          }
          // alert(this.examQuestions[1].choiceQuestion.choiceQuestionId)
        })
        .catch((err) => {
          this.$message.error("查询考试所有信息失败");
        });
    },
    //获得选择填空得分
    getScoresOfExamQuestions () {
      let params = new URLSearchParams();
      params.append("examId", this.examInfo.examId);
      params.append("userId", this.userId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/examHistory/getScoresOfExamQuestions",
        data: params,
      })
        .then((res) => {
          this.examHistory = res.data;
          console.log(this.examHistory);
        })
        .catch((err) => {
          this.$message.error("查询题目得分信息失败");
        });
    },
    //获取考试信息
    getExamInfo () {
      let params = new URLSearchParams();
      params.append("examId", this.examInfo.examId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/exam/queryExamInfoByExamId",
        data: params,
      })
        .then((res) => {
          this.examInfo = res.data;

        })
        .catch((err) => {
          this.$message.error("查询考试信息失败");
        });
    },
  },
};
</script>

<style scoped>
.el-menu {
  text-align: center;
}
.el-menu-item {
  text-align: center;
  width: auto;
  position: relative;
  padding-left: 10%;
  padding-right: 10%;
}
.content {
  text-align: center;
  justify-content: center;
}
.paper-header {
  width: 100%;
  height: 80px;
  background-color: #f7f7f7;
  position: absolute;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}
</style>