<template>
  <div id="app">
    <div class="paper-header">
      <el-form
        label-position="top"
        label-width="100px"
        style="padding-top: 0px"
      >
        <el-row>
          <el-col :span="4" :offset="5">
            <el-form-item label="试卷">
              {{ this.examName }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考生">
              {{ userName }}
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
    <div class="paper-content">
      <h1 style="text-align: center">编程题</h1>
      <div class="container">
        <form>
          <div
            class="choiceTab"
            v-for="(item, index) in exerciseInfo"
            :key="item.examQuestionId"
          >
            <div v-if="item.exercise">
              <!-- 题干 -->
              <div class="question">
                <span class="num"
                  >第{{ index + 1 }}题 、
                  {{ item.exercise.exerciseTitle }}</span
                >
                <div class="title">Problem Description</div>
                {{ item.exercise.exerciseDescription }}
                <pre id="editor" style="height: 10px"></pre>
                <div class="title">Input</div>
                {{ item.exercise.exerciseInput }}
                <pre id="editor" style="height: 10px"></pre>
                <div class="title">Output</div>
                {{ item.exercise.exerciseOutPut }}
                <pre id="editor" style="height: 10px"></pre>
                <div class="title">Sample Input</div>
                {{ item.exercise.exerciseSampleInput }}
                <pre id="editor" style="height: 10px"></pre>
                <div class="title">Sample Output</div>
                {{ item.exercise.exerciseSampleOutput }}
                <pre style="height: 10px"></pre>
              </div>
              <!-- 输入代码 -->
              <div class="head">
                <form role="form">
                  <div class="editor-header">
                    <div class="code">
                      <el-table :data="tabledatas">
                        <el-table-column label="代码输入框">
                          <textarea
                            placeholder="请输入代码"
                            v-show="true"
                            :rows="10"
                            v-model="item.exercise.code"
                          ></textarea>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </form>
                <pre id="editor" style="height: 10px"></pre>
                <el-button
                  style="height: 35px"
                  @click="submit(item.examQuestionId, item.exercise.code)"
                  >提交</el-button
                >
                <el-tag style="position: absolute; left: 47%; height: 35px"
                  >结果：{{ item.subStat }}</el-tag
                >
                <pre style="height: 15px"></pre>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="paper-footer">
      <el-button type="success" class="sumb" @click="submitExam()"
        >提交试卷</el-button
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
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
    this.examProgrammingQuestionScore =
      this.$route.query.examProgrammingQuestionScore;
    this.examName = this.$route.query.examName;
    this.examEndTime = this.$route.query.examEndTime;
    this.examStartTime = this.$route.query.examStartTime;
    this.examLanguage = this.$route.query.examLanguage;
    this.examId = this.$route.query.examId;
    this.userId = this.$route.query.userId;
    this.getExamProgrammingInfo();
    //倒计时
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
  },
  name: "app",
  data () {
    return {
      //倒计小时
      hour: "",
      //倒计分钟
      minute: "",
      //倒计秒
      second: "",
      //计时器
      promiseTimer: "",
      tabledatas: [{ tab: "" }],
      exerciseInfo: {
        examQuestionId: "",
        exercise: {
          exerciseId: "",
          exerciseTitle: "",
          exerciseCorrectTimes: "",
          exerciseSubmitTimes: "",
          exerciseDescription: "",
          exerciseInput: "",
          exerciseOutPut: "",
          exerciseSampleInput: "",
          exerciseSampleOutput: "",
          code: "",
        },
        subStat: "未提交",
      },
      examProgrammingQuestionScore: "",
      examId: "",
      examName: "",
      examTime: "",
      examLanguage: "",
      examEndTime: "",
      userName: "",
      userId: "",
    };
  },
  methods: {
    //时间结束自动退出考试
    forceToSubmitExam () {
      this.$router.replace({ path: "/examList", query: { userId: this.userId } });
    },
    submitExam () {
      this.$confirm("是否确定提交本场考试？", "确认提交试卷", {
        distinguishCancelAndClose: true,
        confirmButtonText: "提交",
        cancelButtonText: "取消",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("examId", this.examId);
          params.append("userId", this.userId);
          this.$axios({
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            url: "/examHistory/getExamResult",
            data: params,
          })
            .then((res) => {
              this.$message({
                type: "info",
                message: "提交考试信息成功",
              });
              // this.$router.replace({
              //   path: "/examList",
              //   query: { userId: this.userId },
              // });
              this.$router.replace({ path: '/examDetail', query: { userId: this.userId, choiceStatus: 0, completionStatus: 0, programmingStatus: 0, examId: this.examId } });
            })
            .catch((err) => {
              this.$message.error("提交考试信息失败");
            });
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "已取消提交" : "继续答题",
          });
        });
    },
    countDowm () {
      let self = this;
      clearInterval(this.promiseTimer);
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0 && self.minute === 0 && self.second === 0) {
          self.disabledAnswer = true;
        }
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0;
            self.$emit("countDowmEnd", true);
            clearInterval(self.promiseTimer);
          } else {
            self.second -= 1;
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1;
            self.minute = 59;
            self.second = 59;
          } else {
            self.second -= 1;
          }
        }
      }, 1000);
    },
    getExamProgrammingInfo () {
      let params = new URLSearchParams();
      params.append("examId", this.examId);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/examQuestion/queryExamQuestionProgrammingByExamId",
        data: params,
      })
        .then((res) => {
          this.exerciseInfo = res.data;
          for (var i = 0; i < this.exerciseInfo.length; i++) {
            this.exerciseInfo[i].subStat = "未提交";
          }
          console.log(this.exerciseInfo);
        })
        .catch((err) => {
          this.$message.error("编程题信息读取失败");
        });
    },
    submit (examQuestionId, code) {
      for (var i = 0; i < this.exerciseInfo.length; i++) {
        if (!code) {
          this.$message.warning("请输入代码");
          return;
        }
        if (this.exerciseInfo[i].examQuestionId == examQuestionId) {
          var exerciseInfo = new Object();
          exerciseInfo = this.exerciseInfo[i];
          exerciseInfo.subStat = "提交中";
          Vue.set(this.exerciseInfo, i, exerciseInfo);
          break;
        }
      }
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
            if (code.length < 20) {
              this.$message.warning("代码长度过短");
            } else {
              let params = new URLSearchParams();
              params.append(
                "examProgrammingQuestionScore",
                this.examProgrammingQuestionScore
              );
              params.append("userId", this.userId);
              params.append("examQuestionId", examQuestionId);
              params.append("examProgrammingQuestionCode", code);
              this.$axios({
                method: "post",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                url: "/examProgrammingHistory/addExamProgrammingQuestionHistory",
                data: params,
              })
                .then((res) => {
                  if (res.data == true) {
                    this.$message.success("提交成功");
                    var result = "";
                    let params = new URLSearchParams();
                    params.append("examQuestionId", examQuestionId);
                    params.append("userId", this.userId);
                    this.$axios({
                      method: "post",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      url: "/examProgrammingHistory/queryExamProgrammingQuestionResultHistoryByExamQuestionIdAndUserId",
                      data: params,
                    })
                      .then((res) => {
                        //this.subStat=res.data;
                        console.log(examQuestionId);
                        console.log(this.userId);
                        console.log(res.data);
                        //this.$message.success("查询编程题结果成功");
                        result = res.data;
                        for (var i = 0; i < this.exerciseInfo.length; i++) {
                          if (
                            this.exerciseInfo[i].examQuestionId ==
                            examQuestionId
                          ) {
                            var exerciseInfo = new Object();
                            exerciseInfo = this.exerciseInfo[i];
                            exerciseInfo.subStat = result;
                            Vue.set(this.exerciseInfo, i, exerciseInfo);
                            break;
                          }
                        }
                      })
                      .catch((err) => {
                        this.$message.error("查询编程题结果信息失败");
                      });
                  }
                })
                .catch((err) => {
                  this.$message.error("提交失败");
                });
            }
          } else {
            this.$message("请先登录");
            this.$router.push("/userLogin");
          }
        })
        .catch((err) => {
          this.$message.error("查询学生信息失败");
        });
    },
  },
};
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
  margin: 0.75rem 0;
  border: none;
  outline: none;
  padding-left: 1.125rem;
  height: 16.5rem;
}
.paper-header {
  width: 99%;
  height: 80px;
  background-color: #f7f7f7;
  position: absolute;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
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

.downTime {
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
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>