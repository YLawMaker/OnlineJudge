<template>
  <div id="app">
    <div class="examTitle">{{ exercise.exerciseTitle }}</div>
    <br />
    <div class="container">
      <form>
        <div class="main">
          <!-- 题干 -->
          <div class="question">
            <div class="title">Problem Description</div>
            <el-card>
              <div class="nei" style="white-space: pre-line">
                {{ exercise.exerciseDescription }}
              </div>
            </el-card>
            <div class="title">Input</div>
            <el-card>
              <div class="nei" style="white-space: pre-line">
                {{ exercise.exerciseInput }}
              </div>
            </el-card>
            <div class="title">Output</div>
            <el-card>
              <div class="nei" style="white-space: pre-line">
                {{ exercise.exerciseOutPut }}
              </div>
            </el-card>
            <div class="title">Sample Input</div>
            <el-card>
              <div class="nei" style="white-space: pre-line">
                {{ exercise.exerciseSampleInput }}
              </div>
            </el-card>
            <div class="title">Sample Output</div>
            <el-card>
              <div class="nei" style="white-space: pre-line">
                {{ exercise.exerciseSampleOutput }}
              </div>
            </el-card>
          </div>
          <div class="foot">
            <router-link
              style="text-decoration: none; color: black"
              :to="{
                path: 'exerciseStatistics',
                query: {
                  exerciseId: getExerciseId(),
                },
              }"
            >
              习题统计
            </router-link>
            <router-link
              style="text-decoration: none; color: black"
              :to="{
                path: 'submitCode',
                query: {
                  exerciseId: getExerciseId(),
                },
              }"
            >
              代码提交
            </router-link>
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
      exercise: {
        exerciseId: '',
        exerciseTitle: '',
        exerciseCorrectTimes: '',
        exerciseSubmitTimes: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
      },

    }
  },
  mounted: function () {
    this.exercise.exerciseId = this.$route.query.exerciseId
    this.getExerciseInfo();
  },
  methods: {
    getExerciseId () {
      return this.exercise.exerciseId;
    },
    getExerciseInfo () {
      let params = new URLSearchParams();
      params.append('exerciseId', this.exercise.exerciseId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exercise/queryExerciseDetailsInfoByExerciseId',
        data: params
      })
        .then((res) => {
          this.exercise = res.data;
        })
        .catch((err) => {
          this.$message.error('习题详情读取失败');
        })
    },
  }
}
</script>

<style scoped>
.foot {
  margin-top: 3%;
}
.main {
  width: 60%;
  margin-left: 20%;
}
.question {
  text-align: left;
}

.title {
  font-size: 130%;
  color: rgb(60, 127, 158);
}
.nei {
  width: 100%;
}
.num {
  font-size: 150%;
}
.examTitle {
  text-align: center;
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
.el-card {
  background: #d3d3d3;
}
</style>