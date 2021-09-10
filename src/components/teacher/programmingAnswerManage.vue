<template>
  <div>
    <div>
      答案管理
      <div>各种按钮</div>
    </div>
    <el-table :data="programmingAnswerList">
      <el-table-column prop="examProgrammingAnswerInput" label="答案输入">
      </el-table-column>
      <el-table-column prop="examProgrammingAnswerOutput" label="答案输出">
      </el-table-column>
      <el-table-column label="操作"> </el-table-column>
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
