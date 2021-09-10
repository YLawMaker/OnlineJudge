<template>
  <div>
    <div>
      编程题管理
      <div>各种按钮</div>
    </div>
    <el-table :data="programmingList" style="width: 100%">
      <el-table-column prop="examProgrammingId" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="examProgrammingTitle" label="标题" width="180">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: 'programmingAnswerManage',
              query: {
                examProgrammingIdfromManage: scope.row.examProgrammingId,
              },
            }"
          >
            {{ scope.row.examProgrammingTitle }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="examProgrammingDescription"
        label="描述"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="examProgrammingInput" label="问题输入" width="180">
      </el-table-column>
      <el-table-column
        prop="examProgrammingOutput"
        label="问题输出"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="examProgrammingSampleInput"
        label="样例输入"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="examProgrammingSampleOutput"
        label="样例输出"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="examProgrammingScore" label="分数" width="50">
      </el-table-column>
      <el-table-column label="操作"
        ><template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="exerciseInfoDialog(scope.row)"
            size="small"
            >详情</el-button
          >
          <el-button
            type="primary"
            @click.native.prevent="modifyExercise(scope.row)"
            size="small"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
            size="small"
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
      programmingData: {
        examId: '',
        examProgrammingId: '',
        examProgrammingTitle: '',
        examProgrammingDescription: '',
        examProgrammingInput: '',
        examProgrammingOutput: '',
        examProgrammingSampleInput: '',
        examProgrammingSampleOutput: '',
        examProgrammingScore: ''
      },
      programmingList: [],
      examIdFromAddExam: ''
    }
  },
  mounted: function () {
    this.getprogramming(this.$route.query.examId);
  },
  methods: {
    getprogramming (examId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(examId);
      params.append('examId', examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgramming/queryProgrammingInfoById',
        data: params
      }).then(function (resp) {
        that.programmingList = resp.data
      })
    }
  }
}
</script>
