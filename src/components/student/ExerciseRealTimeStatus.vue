<template>
  <div>
    <el-table
      :data="exerciseRealTimeInfo"
      style="width: 90%"
      class="tableclass"
      stripe
    >
      <el-table-column prop="exerciseResult" label="习题编号">
      </el-table-column>
      <el-table-column prop="exerciseSubmitLanguage" label="习题编号">
      </el-table-column>
      <el-table-column prop="exerciseSubmitTime" label="习题编号">
      </el-table-column>
      <el-table-column prop="student.studentName" label="习题编号">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      exerciseRealTimeInfo: [],
    }
  },
  mounted: function () {
    this.getExerciseRealTimeInfo();
  },
  methods: {
    getExerciseRealTimeInfo () {
      let params = new URLSearchParams();
      params.append("exerciseId", 0);
      params.append("studentId", 0);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseHistory/queryExerciseRealtimeStatusInfo',
        data: params
      })
        .then((res) => {
          if (res.data != 0) {
            this.exerciseRealTimeInfo = res.data;
            console.log(this.exerciseRealTimeInfo);
          }
        })
        .catch((err) => {
          this.$message.error('查询学生信息失败');

        })
    }
  }
}
</script>

<style>
</style>