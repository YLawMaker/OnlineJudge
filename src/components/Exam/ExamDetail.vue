<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="this.$route.path"
        router
        mode="horizontal"
        menu-trigger="click"
        :unique-opened="true"
        text-color="#000000"
        :collapse-transition="true"
        style="margin-left: 45%; margin-right: 55%"
      >
        <el-menu-item index="/examDetail">Problems</el-menu-item>

        <!-- <div class="loginbutton">
                <span
                    style="margin-right: 3%; cursor: pointer"
                    el-dropdown-link
                    @click="gotoStudentInfo()"
                    >{{ studentName }}</span
                >
                <el-button plain @click="studentLogin()">登录 </el-button>
                </div> -->
      </el-menu>
    </el-header>
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
            <td v-if="this.examHistory.examChoiceQuestionTotals == 0">否</td>
            <td v-else>是</td>
          </tr>
          <tr>
            <td>
              <el-button type="primary" @click="gotoCompletion"
                >填空题</el-button
              >
            </td>
            <td>{{ this.sumOfCompletion }}</td>
            <td v-if="this.examHistory.examCompletionQuestionTotals == 0">
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
        examQuestionId: '',
        choiceQuestion: {
          choiceQuestionId: '',
          choiceQuestionDescription: 0,
        },
        completionQuestion: {
          completionQuestionId: '',
          completionQuestionDescription: 0,
        },
        exercise: {
          exerciseId: '',
        },
      },
      examInfo: [
        {
          examId: '',
          examName: '',
          examStartTime: '',
          examEndTime: '',
          examStatus: '',
          examLanguage: '',
          examChoiceQuestionScore: '',
          examCompletionQuestionScore: '',
          examProgrammingScore: '',
        }
      ],
      examHistory: {
        examHistoryId: '',
        examChoiceQuestionTotals: '',
        examProgrammingTotals: '',
        examCompletionQuestionTotals: '',
        examTotals: '',
      },
      sumOfChoice: 0,
      sumOfCompletion: 0,
      sumOfProgramming: 0,
      userId: '',
      leftTime: '',
      choiceStatus: "",
      completionStatus: "",
      programmingStatus: "",
    }
  },
  mounted: function () {
    this.examInfo.examId = this.$route.query.examId;
    this.userId = this.$route.query.userId;
    this.getExamInfo();
    this.getExamQuestion();
    this.getScoresOfExamQuestions();
    this.choiceStatus = this.$route.query.choiceStatus;
    this.completionStatus = this.$route.query.completionStatus;
    this.programmingStatus = this.$route.query.programmingStatus;
    if (!this.$route.query.choiceStatus)
      this.choiceStatus = 2;

    var date = new Date();
    var now = date.getTime();
    var enddate = new Date(this.examInfo.examEndTime);
    var startdate = new Date(this.examInfo.examStartTime);
    var end = enddate.getTime(), start = startdate.getTime();
    this.examTime = (end - start) / 1000 / 60;
    let remainTime = (end - now) / 1000;
    if (remainTime > 0) {
      this.hour = Math.floor((remainTime / 3600) % 24)
      this.minute = Math.floor((remainTime / 60) % 60)
      this.second = Math.floor(remainTime % 60)
      this.countDowm()
    }
    if (remainTime <= 0)
      remainTime = 0.01;
    //时间结束强制退出
    this.$nextTick(() => {
      if (remainTime > 0)
        setTimeout(this.forceToSubmitExam, remainTime * 1000);
    });
    if (this.programmingStatus == 0) {
      //退出界面
      this.$router.replace({ path: '/examList', query: { userId: this.userId } });
    }
  },
  methods: {
    //时间结束自动退出考试
    forceToSubmitExam () {
      this.$router.replace({ path: '/examList', query: { userId: this.userId } });
    },
    gotoChoice () {
      if (this.examHistory.examChoiceQuestionTotals == '1111') {
        this.$router.replace({
          path: '/examChoice', query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examStartTime: this.examInfo.examStartTime,
            examChoiceQuestionScore: this.examInfo.examChoiceQuestionScore,
          }
        })
      } else {
        this.$message.error("您已经提交选择题")
      }
    },
    gotoProgram () {
      if (this.examHistory.examCompletionQuestionTotals != '1111') {
        this.$router.replace({
          path: '/examProgramming', query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examLanguage: this.examInfo.examLanguage,
            examStartTime: this.examInfo.examStartTime,
            examProgrammingQuestionScore: this.examInfo.examProgrammingScore,
          }
        })
      } else {
        this.$message.error("请从选择题开始，按顺序答题")
      }
    },
    gotoCompletion () {
      if (this.examHistory.examCompletionQuestionTotals == '1111' && this.examHistory.examChoiceQuestionTotals != '1111') {
        this.$router.replace({
          path: '/examCompletion', query: {
            userId: this.userId,
            examId: this.examInfo.examId,
            examName: this.examInfo.examName,
            examEndTime: this.examInfo.examEndTime,
            examStartTime: this.examInfo.examStartTime,
            examCompletionQuestionScore: this.examInfo.examCompletionQuestionScore,
          }
        })
      } else {
        this.$message.error("您已经提交填空题")
      }
    },
    //获取所有考试题目
    getExamQuestion () {
      let params = new URLSearchParams();
      params.append("examId", this.examInfo.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamQuestionByExamId',
        data: params
      })
        .then((res) => {
          this.examQuestions = res.data;
          console.log(this.examQuestions);
          var i = 0;
          for (i = 0; i < this.examQuestions.length; i++) {
            var EQ = new Object;
            EQ.choiceQuestion = this.examQuestions[i].choiceQuestion;
            EQ.completionQuestion = this.examQuestions[i].completionQuestion;
            EQ.exercise = this.examQuestions[i].exercise;
            if (EQ.choiceQuestion != null) {
              if (EQ.choiceQuestion.choiceQuestionDescription != null)
                this.sumOfChoice++;
            } if (EQ.completionQuestion != null) {
              if (EQ.completionQuestion.completionQuestionDescription != null)
                this.sumOfCompletion++;
            } else if (EQ.exercise != null) {
              this.sumOfProgramming++;
            }
          }
          // alert(this.examQuestions[1].choiceQuestion.choiceQuestionId)
        })
        .catch((err) => {
          this.$message.error('查询考试所有信息失败');
        })
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
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/queryExamInfoByExamId',
        data: params
      })
        .then((res) => {
          this.examInfo = res.data;
          //console.log(res.data);

        })
        .catch((err) => {
          this.$message.error('查询考试信息失败');
        })
    },
  }
}
</script>

<style>
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
</style>