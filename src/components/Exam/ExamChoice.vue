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
      <h1 style="text-align: center">选择题</h1>
      <div class="container">
        <form>
          <div
            class="choiceTab"
            v-for="(item, index) in this.examChocie"
            :key="item.choiceQuestionId"
          >
            <!-- 题干 -->
            <div class="question">
              <span class="num">{{ index + 1 }}、</span>
              {{ item.choiceQuestionDescription }}
            </div>
            <!-- 选项 -->
            <div class="option">
              <ul>
                <li class="xuanXiang" :class="{ 'double-line': false }">
                  <input
                    type="radio"
                    v-model="item.picked_radio"
                    v-bind:value="abcd[0]"
                  />
                  {{ abcd[0] }}、{{ item.choiceQuestionStemA }}
                </li>
                <li class="xuanXiang" :class="{ 'double-line': false }">
                  <input
                    type="radio"
                    v-model="item.picked_radio"
                    v-bind:value="abcd[1]"
                  />
                  {{ abcd[1] }}、{{ item.choiceQuestionStemB }}
                </li>
                <li class="xuanXiang" :class="{ 'double-line': false }">
                  <input
                    type="radio"
                    v-model="item.picked_radio"
                    v-bind:value="abcd[2]"
                  />
                  {{ abcd[2] }}、{{ item.choiceQuestionStemC }}
                </li>
                <li class="xuanXiang" :class="{ 'double-line': false }">
                  <input
                    type="radio"
                    v-model="item.picked_radio"
                    v-bind:value="abcd[3]"
                  />
                  {{ abcd[3] }}、{{ item.choiceQuestionStemD }}
                </li>
              </ul>
            </div>
            <div class="clearfix"></div>
          </div>
        </form>
      </div>
    </div>
    <div class="paper-footer">
      <el-button type="success" class="sumb" @click="submit()"
        >提交选择题部分</el-button
      >
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
  mounted: function () {
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
        if (res.data != 0) {
          this.userName = res.data.userName;
        } else {
          this.$router.push("/userLogin")
        }
      })
      .catch((err) => {
        this.$message.error('查询用户信息失败');
      })

    this.examName = this.$route.query.examName;
    this.examId = this.$route.query.examId;
    this.userId = this.$route.query.userId;
    this.examEndTime = this.$route.query.examEndTime;
    this.examStartTime = this.$route.query.examStartTime;
    this.getExamChoiceInfo();
    //let remainTime=90*60;
    var date = new Date();
    var now = date.getTime();
    var enddate = new Date(this.examEndTime);
    var startdate = new Date(this.examStartTime);
    var end = enddate.getTime(), start = startdate.getTime();
    this.examTime = (end - start) / 1000 / 60;
    let remainTime = (end - now) / 1000;
    if (remainTime > 0) {
      this.hour = Math.floor((remainTime / 3600) % 24)
      this.minute = Math.floor((remainTime / 60) % 60)
      this.second = Math.floor(remainTime % 60)
      this.countDowm()
    }
  },
  name: 'app',
  data () {
    return {
      examChocie: {
        choiceQuestionId: '',
        choiceQuestionDescription: '',
        choiceQuestionStemA: '',
        choiceQuestionStemB: '',
        choiceQuestionStemC: '',
        choiceQuestionStemD: '',
        choiceQuestionCorrectOption: '',
        choiceQuestionDifficulty: '',
        isPrivate: '',
        picked_radio: '',
      },
      examName: '',
      examTime: '',
      examId: '',
      userName: '',
      userId: '',
      //倒计小时
      hour: '',
      //倒计分钟
      minute: '',
      //倒计秒
      second: '',
      //计时器
      promiseTimer: '',
      abcd: ['A', 'B', 'C', 'D'],

    }
  },
  methods: {
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
    getExamChoiceInfo () {
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamQuestionChoiceByExamId',
        data: params
      })
        .then((res) => {
          this.examChocie = res.data;
          console.log(this.examChocie);

        })
        .catch((err) => {
          this.$message.error('选择题信息读取失败');
        })
    },
    submit () {
      var i = 0, ac = 0;
      for (i = 0; i < this.examChocie.length; i++) {
        if (this.examChocie[i].picked_radio == this.examChocie[i].choiceQuestionCorrectOption) {
          ac++;
        }
      }
      alert(ac);
    },
  }
}
</script>
<style>
.xuanXiang {
  text-align: left;
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