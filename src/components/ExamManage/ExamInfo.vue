<template>
  <div class="paper-content">
    <div>
      <h1 style="text-align: center">选择题</h1>
      <div class="container">
        <form>
          <div
            class="choiceTab"
            v-for="(item, index) in this.examQuestions"
            :key="item.examQuestionId"
          >
            <div v-if="item.choiceQuestion">
              <div v-show="item.choiceQuestion.choiceQuestionId">
                <!-- 题干 -->
                <div class="question">
                  <span class="num">{{ index + 1 }}、</span>
                  {{ item.choiceQuestion.choiceQuestionDescription }}
                </div>
                <!-- 选项 -->
                <div class="option">
                  <ul>
                    <li class="xuanXiang" :class="{ 'double-line': false }">
                      {{ abcd[0] }}、{{
                        item.choiceQuestion.choiceQuestionStemA
                      }}
                    </li>
                    <li class="xuanXiang" :class="{ 'double-line': false }">
                      {{ abcd[1] }}、{{
                        item.choiceQuestion.choiceQuestionStemB
                      }}
                    </li>
                    <li class="xuanXiang" :class="{ 'double-line': false }">
                      {{ abcd[2] }}、{{
                        item.choiceQuestion.choiceQuestionStemC
                      }}
                    </li>
                    <li class="xuanXiang" :class="{ 'double-line': false }">
                      {{ abcd[3] }}、{{
                        item.choiceQuestion.choiceQuestionStemD
                      }}
                    </li>
                  </ul>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div>
      <h1 style="text-align: center">填空题</h1>
      <div class="container">
        <form>
          <div
            class="completionTab"
            v-for="(item, index) in this.examQuestions"
            :key="item.examQuestionId"
          >
            <div v-if="item.completionQuestion">
              <div v-show="item.completionQuestion.completionQuestionId">
                <!-- 题干 -->
                <div class="question">
                  <span class="num">{{ index + 1 }}、</span>
                  {{ item.completionQuestion.completionQuestionDescription }}
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div>
      <h1 style="text-align: center">编程题</h1>
      <form>
        <div
          class="choiceTab"
          v-for="(item, index) in examQuestions"
          :key="item.examQuestionId"
        >
          <div v-if="item.exercise">
            <div v-show="item.exercise.exerciseId">
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
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      examId: '',
      abcd: ['A', 'B', 'C', 'D'],
      examQuestions: {
        examQuestionId: '',
        choiceQuestion: {
          choiceQuestionId: '',
          choiceQuestionDescription: '',
          choiceQuestionStemA: '',
          choiceQuestionStemB: '',
          choiceQuestionStemC: '',
          choiceQuestionStemD: '',
          choiceQuestionCorrectOption: '',
          choiceQuestionDifficulty: '',
        },
        completionQuestion: {
          letionQuestionId: '',
          completionQuestionDifficulty: '',
          completionQuestionDescription: '',
          completionQuestionAnswers: {
            completionQuestionAnswerId: '',
            completionQuestionAnswerContent: '',
            completionQuestionAnswerNumber: '',
          },
        },
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
        },
      },
    }
  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage;
    this.getExamQuestion();
  },
  methods: {
    //获取所有考试题目
    getExamQuestion () {
      let params = new URLSearchParams();
      params.append("examId", this.examId);
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
          //   console.log(res.data);
        })
        .catch((err) => {
          this.$message.error('查询考试所有信息失败');
        })
    },
  }
}
</script>

<style>
.paper-content {
  position: absolute;
  left: 150px;
  top: 68px;
  right: 150px;
  bottom: 45px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e4e4e4;
  border-top: none;
  scrollbar-width: none; /* Firefox 隐藏进度条*/
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari 隐藏进度条*/
}

.title {
  font-size: 200%;
  color: rgb(0, 140, 255);
}
</style>
