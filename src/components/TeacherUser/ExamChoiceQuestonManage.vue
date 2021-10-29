<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%; font-size: 12px"
      class="tableclass"
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
    >
      <el-table-column
        prop="choiceQuestionId"
        label="选择题编号"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column prop="user.userName" label="创建人" align="center">
      </el-table-column>
      <el-table-column
        prop="choiceQuestionDescription"
        label="选择题描述"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].chapter"
        label="选择题章节"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].firstKnowledgePoint"
        label="选择题一级知识点"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="选择题二级知识点"
        min-width="100%"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.questionLabels"
            :key="item.questionLabelId"
          >
            <p
              v-if="index == 3"
              align="center"
              style="margin-top:0px;margin-bottom:0px;display;"
            >
              ...
            </p>
            <p
              v-if="index < 3"
              align="center"
              style="margin-top:0px;margin-bottom:0px;display;"
            >
              {{ item.secondKnowledgePoint }}
            </p>
            <p
              v-if="index > 3"
              style="margin-top:0px;margin-bottom:0px;display;"
            ></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="choiceQuestionDifficulty"
        label="选择题难度"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="isPrivate" label="是否私有">
        <template slot-scope="scope">
          <p v-if="scope.row.isPrivate === true" align="center">私有</p>
          <p v-if="scope.row.isPrivate === false" align="center">公有</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="choiceQuestionList.length"
        @current-change="handleCurrent"
        v-if="choiceQuestionList.length != 0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      choiceQuestionInfo: {
        choiceQuestionId: '',
        choiceQuestionDescription: '',
        choiceQuestionStemA: '',
        choiceQuestionStemB: '',
        choiceQuestionStemC: '',
        choiceQuestionStemD: '',
        choiceQuestionCorrectOption: '',
        choiceQuestionDifficulty: '',
        isPrivate: '',
        user: {
          userId: '',
          userName: '',
        },
        questionLabels: [], //下拉框选择(多选)
      },
      choiceQuestionList: [],
      examId: 0,
      currentPage: 1,
      pageSize: 8,
    }
  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage;
    this.getExamChoiceQuestion(this.examId)
  },
  computed: {
    data () {
      return this.choiceQuestionList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    handleCurrent (val) {
      this.currentPage = val;
    },
    getExamChoiceQuestion (examId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(examId);
      params.append('examId', examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/choiceQuestion/queryChoiceQuestionInfo',
        data: params
      }).then(function (resp) {
        that.choiceQuestionList = resp.data
        console.log(resp.data);
      })
    }
  }
}
</script>

<style>
</style>