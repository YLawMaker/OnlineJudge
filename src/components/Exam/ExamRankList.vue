<template>
  <div>
      <el-table
        :data="data"
        style="width: 100%"
        :row-style="{ height: '20px' }"
        stripe
      >
        <el-table-column
          label="Rank"
          type="index"
          :index="indexMethod"
          width="80"
        >
        </el-table-column>
        <el-table-column label="账号" prop="user.userAccount" width="">
        </el-table-column>
        <el-table-column label="姓名" prop="user.userName">
        </el-table-column>
        <el-table-column
          label="选择题"
          prop="examChoiceQuestionTotals"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="填空题"
          prop="examCompletionQuestionTotals"
          sortable
        >
        </el-table-column>
        <el-table-column label="编程题" prop="examProgrammingTotals" sortable>
        </el-table-column>
        <el-table-column label="总成绩" prop="examTotals" sortable>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrent"
          :current-page.sync="currentPage"
          :page-size="pagesize"
          layout="total,prev, pager, next"
          :total="this.examHistory.length"
          v-if="this.examHistory.length != 0"
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            examHistory: [],
            userScoreHistory: [],
            currentPage: 1,
            pagesize: 9,
            edittableDataVisible_info: false,
            userName: '',
            examId: 1
        }
    },
    mounted: function () {
        this.examId = this.$route.query.examId
        this.getCandidateScore()
    },
    computed: {
        data () {
        return this.examHistory.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
        }
    },
    methods:{
       handleCurrent (val) {
        this.currentPage = val;
        },
        indexMethod (index) {
        return (this.currentPage - 1) * this.pagesize + index + 1;
        },
        getCandidateScore () {
            const that = this
            let params = new URLSearchParams();
            params.append('examId', this.examId);
            // console.log(this.examId);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/examHistory/queryExamRankById',
                data: params
            }).then(function (resp) {
                that.examHistory = resp.data;

                // console.log(resp.data);
                // console.log(that.examHistory);
                for (var i = 0; i < that.examHistory.length; i++) {
                that.examHistory[i].examTotals = that.examHistory[i].examChoiceQuestionTotals + that.examHistory[i].examCompletionQuestionTotals + that.examHistory[i].examProgrammingTotals
                }
            })
        },
    }

}
</script>

<style>
.tableclass{
    margin-left: 5%;
}
</style>