<template>
  <el-card>
    <div>
      <div></div>
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
            <template slot-scope="scope">
              <div
                class="userScoreHistory"
                @click="userScoreHistoryDialog(scope.row)"
              >
                {{ scope.row.user.userName }}
              </div>
            </template>
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
        <el-dialog
          :visible.sync="edittableDataVisible_info"
          :before-close="handleClose"
          :close-on-click-modal="false"
        >
          <div class="userScoreTopBar">{{ this.userName }}历史成绩表</div>
          <el-table :data="userScoreHistory">
            <el-table-column
              prop="exam.examName"
              label="考试名称"
            ></el-table-column>
            <el-table-column
              prop="examChoiceQuestionTotals"
              label="选择题成绩"
            ></el-table-column>
            <el-table-column
              prop="examCompletionQuestionTotals"
              label="填空题成绩"
            ></el-table-column>
            <el-table-column
              prop="examProgrammingTotals"
              label="编程题成绩"
            ></el-table-column>
            <el-table-column prop="examTotals" label="总分"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </div>
  </el-card>
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
      examId: 0
    }
  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage
    this.getCandidateScore()
  },
  computed: {
    data () {
      return this.examHistory.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  methods: {
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_info = false
    },
    indexMethod (index) {
      return (this.currentPage - 1) * this.pagesize + index + 1;
    },
    userScoreHistoryDialog (row) {
      this.edittableDataVisible_info = true
      this.userName = row.user.userName
      this.getUserScoreHistory(row.user.userId)
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
    getUserScoreHistory (userId) {
      const that = this
      let params = new URLSearchParams();
      params.append('userId', userId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamHistoryInfoByUserId',
        data: params
      }).then(function (resp) {
        that.userScoreHistory = resp.data;
        // console.log(that.userScoreHistory);
      })
    }
  }
}
</script>

<style scoped>
.block {
  text-align: center;
}
.userScoreTopBar {
  text-align: center;
}
.userScoreHistory {
  color: #337ab7;
  cursor: pointer; /*鼠标悬停变小手*/
}
.el-card {
  border: 1px solid #7c7979;
}
</style>