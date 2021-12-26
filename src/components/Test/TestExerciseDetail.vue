<template>
  <div>
    <div class="main">
      <!-- 题干 -->
      <div class="question">
        <div class="title">Problem Description</div>
        <el-card>
          <div class="nei" style="white-space: pre-line">
            {{ testExerciseDetail.exerciseDescription }}
          </div>
        </el-card>
        <div class="title">Input</div>
        <el-card>
          <div class="nei" style="white-space: pre-line">
            {{ testExerciseDetail.exerciseInput }}
          </div>
        </el-card>
        <div class="title">Output</div>
        <el-card>
          <div class="nei" style="white-space: pre-line">
            {{ testExerciseDetail.exerciseOutPut }}
          </div>
        </el-card>
        <div class="title">Sample Input</div>
        <el-card>
          <div class="nei" style="white-space: pre-line">
            {{ testExerciseDetail.exerciseSampleInput }}
          </div>
        </el-card>
        <div class="title">Sample Output</div>
        <el-card>
          <div class="nei" style="white-space: pre-line">
            {{ testExerciseDetail.exerciseSampleOutput }}
          </div>
        </el-card>
      </div>
      <div class="foot1">
        <router-link
          style="text-decoration: none; color: black"
          :to="{
            path: 'testCodeSubmit',
            query: {
              testProgrammingQuestionId: getTestProgrammingQuestionId(),
            },
          }"
        >
          代码提交
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testProgrammingQuestionId: '',
      testExerciseDetail: {
        exerciseId: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
      },
    }
  },
  mounted: function () {
    this.testProgrammingQuestionId = this.$route.query.testProgrammingQuestionId;
    this.getTestExerciseDetail();
  },
  methods: {
    //获得测试编程题编号
    getTestProgrammingQuestionId () {
      return this.testProgrammingQuestionId;
    },
    //获取测试编程题信息
    getTestExerciseDetail () {
      let params = new URLSearchParams();
      params.append('testProgrammingQuestionId', this.testProgrammingQuestionId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/testProgramming/queryExerciseByTestProgrammingQuestionId',
        data: params
      })
        .then((res) => {
          this.testExerciseDetail = res.data;
        })
        .catch((err) => {
          this.$message.error('测试编程题读取失败');
        })
    }
  }
}
</script>

<style scoped>
.question {
  text-align: left;
}

.title {
  font-size: 130%;
  color: rgb(60, 127, 158);
}
.el-card {
  background: #d3d3d3;
}
.main {
  width: 60%;
  margin-left: 20%;
}
.foot1 {
  margin-top: 3%;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>