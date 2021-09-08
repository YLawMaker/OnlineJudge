<template>
  <div>
    <div>
      <div class="topBar_Teacher">
        <el-button
          class="addButton_Exam"
          type="primary"
          size="small"
          @click.native.prevent="addDialogvisiable()"
          >添加考试</el-button
        >
      </div>
    </div>
    <el-table>
      <el-table-column prop="examName" label="考试名称" width="180">
      </el-table-column>
      <el-table-column prop="examStartTime" label="开始时间" width="180">
      </el-table-column>
      <el-table-column prop="examEndTime" label="结束时间" width="180">
      </el-table-column>
      <el-table-column prop="examType" label="考试状态" width="180">
      </el-table-column>
      <el-table-column prop="examLanguage" label="代码语言" width="180">
      </el-table-column>
      <el-table-column label="操作" width="180"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teacher: {
        teacherId: '',
        teacherName: ''
      },
      exam: {
        examId: '',
        examName: '',
        examStartTime: '',
        examEndTime: '',
        teacherId: '',
        classesId: '',
        examType: '',
        examLanguage: ''
      },
      examList: []
    }
  },
  mounted: function () {
    this.getTeacherInfo();
  },
  methods: {
    addDialogvisiable () {
      //   this.edittableDataVisible_add = true
    },
    getTeacherInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/queryTeacherInfoById',
        data: params
      })
        .then((res) => {
          this.teacher = res.data;
          console.log(this.teacher);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    getExamInfo () {
      let params = new URLSearchParams();
      params.append('teacherId', this.teacher.teacherId)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/teacherQueryExamInfo',
        data: params
      })
        .then((res) => {
          this.examList = res.data;
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');
        })
    }
  }
}
</script>

<style>
</style>