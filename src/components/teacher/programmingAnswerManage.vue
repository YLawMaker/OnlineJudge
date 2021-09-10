<template>
  <div>
    <div class="topBar_answer">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="goBack(currentPage, searchKey)"
      >
        返回
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="addExerciseAnswerDialog()"
        >添加答案</el-button
      >
    </div>
    <el-table :data="programmingAnswerList">
      <el-table-column prop="examProgrammingAnswerInput" label="答案输入">
      </el-table-column>
      <el-table-column prop="examProgrammingAnswerOutput" label="答案输出">
      </el-table-column>
      <el-table-column label="操作"
        ><template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyExercise(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  data () {
    return {
      programmingAnswerList: [],
      programmingId: '',
    }
  },
  mounted: function () {
    // console.log(this.$route.query.examProgrammingIdfromManage);
    this.getprogrammingAnswer(this.$route.query.examProgrammingIdfromManage);
  },
  methods: {
    getprogrammingAnswer (programmingId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(programmingId);
      params.append('programmingId', programmingId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgrammingAnswer/queryProgrammingAnswerInfoById',
        data: params
      }).then(function (resp) {
        that.programmingAnswerList = resp.data
      })
    }
  }
}
</script>
