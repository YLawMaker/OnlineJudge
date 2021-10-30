<template>
  <div>
    <div></div>
    <div>
      <el-table>
        <el-table-column label="各部分得分" align="center">
          <el-table-column label="题型" width="100"></el-table-column>
          <el-table-column label="选择题"></el-table-column>
          <el-table-column label="填空题"></el-table-column>
          <el-table-column label="程序设计题"></el-table-column>
          <el-table-column label="总分"></el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-table>
        <el-table-column label="各分段人数" align="center">
          <el-table-column label="分数段" width="100"></el-table-column>
          <el-table-column label="60以下"></el-table-column>
          <el-table-column label="60~69"></el-table-column>
          <el-table-column label="70~79"></el-table-column>
          <el-table-column label="80~89"></el-table-column>
          <el-table-column label="90及以上"></el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-table :data="examExerciseScore">
        <el-table-column label="各程序设计题平均分" align="center">
          <el-table-column
            label="序号"
            type="index"
            width="100"
          ></el-table-column>
          <el-table-column label="题目" prop="exerciseTitle"></el-table-column>
          <el-table-column
            label="平均分"
            prop="avgExamProgrammingScore"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      averageScore: [{
        averageChoice: 0,
        averageCompletion: 0,
        averageProgramming: 0,
        averageTotal: 0,
      }],
      numberInEachSection: [{
        below60: 0,
        between60and69: 0,
        between70and79: 0,
        between80and89: 0,
        above89: 0
      }],
      candidateScore: [],
      examExerciseScore: [],
      should: 10,
      actual: 9,
      examId: 0,
    }
  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage
    this.anaylseScoreAndSection()
    this.getExamExerciseScore()
  },
  methods: {
    anaylseScoreAndSection () {
      const that = this
      //考生总数
      var totalNum = 0
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamRankById',
        data: params
      }).then(function (resp) {
        that.candidateScore = resp.data;

        for (var i = 0; i < resp.data.length; i++) {
          that.averageScore[0].averageChoice = that.averageScore[0].averageChoice + resp.data[i].examChoiceQuestionTotals
          that.averageScore[0].averageCompletion = that.averageScore[0].averageCompletion + resp.data[i].examCompletionQuestionTotals
          that.averageScore[0].averageProgramming = that.averageScore[0].averageProgramming + resp.data[i].examProgrammingTotals
          that.candidateScore[i].examTotals = that.candidateScore[i].examChoiceQuestionTotals + that.candidateScore[i].examCompletionQuestionTotals + that.candidateScore[i].examProgrammingTotals
          totalNum = totalNum + 1
        };
        // console.log(that.candidateScore);
        that.averageScore[0].averageChoice = (that.averageScore[0].averageChoice) / totalNum
        that.averageScore[0].averageCompletion = (that.averageScore[0].averageCompletion) / totalNum
        that.averageScore[0].averageProgramming = (that.averageScore[0].averageProgramming) / totalNum
        that.averageScore[0].averageTotal = that.averageScore[0].averageChoice + that.averageScore[0].averageCompletion + that.averageScore[0].averageProgramming
        for (var i = 0; i < that.candidateScore.length; i++) {
          if (that.candidateScore[i].examTotals < 60) {
            that.numberInEachSection[0].below60++;
          } else if (that.candidateScore[i].examTotals >= 60 && that.candidateScore[i].examTotals < 70) {
            that.numberInEachSection[0].between60and69++;
          } else if (that.candidateScore[i].examTotals >= 70 && that.candidateScore[i].examTotals < 80) {
            that.numberInEachSection[0].between70and79++;
          } else if (that.candidateScore[i].examTotals >= 80 && that.candidateScore[i].examTotals < 90) {
            that.numberInEachSection[0].between80and89++;
          } else {
            that.numberInEachSection[0].above89++;
          }
        }
      })
    },
    getExamExerciseScore () {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamProgrammingResultScoreByExamId',
        data: params
      }).then(function (resp) {
        that.examExerciseScore = resp.data
        console.log(that.examExerciseScore);
      })
    }
  }
}
</script>

<style>
</style>