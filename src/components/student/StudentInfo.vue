<template>
  <div>
    <p style="text-align: center">{{ student.studentName }}</p>
    <p style="text-align: center">
      {{ student.studentProfile }}<el-button>修改</el-button>
    </p>
    <p style="text-align: center"><el-button>修改密码</el-button></p>

    <h2 style="text-align: center">未解决问题</h2>

    <el-link
      :underline="false"
      v-for="(item, i) in exerciseInfo"
      :key="i"
      style="width: 1%"
      class="p"
      @click="gotoExerciseDetail(item)"
    >
      {{ item }}
    </el-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      student: {
        studentId: '',
        studentName: '',
        studentProfile: '',
        studnetSolved: '',
        studnetSubmit: '',
      },
      exerciseInfo: [],
      edittableDataVisible_add: true
    }
  },
  mounted: function () {
    this.student.studentId = this.$route.query.studentId

    this.getStudentInfo();
    this.getStudentExerciseInfo();
  },
  methods: {
    gotoExerciseDetail (item) {
      this.$router.push({
        path: '/exerciseDetail',
        query: {
          exerciseId: item,
        }
      });
    },
    getStudentInfo () {
      let params = new URLSearchParams();
      params.append('studentId', this.student.studentId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/student/queryStudentInfoById',
        data: params
      })
        .then((res) => {
          this.student = res.data;
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    getStudentExerciseInfo () {
      let params = new URLSearchParams();
      params.append('studentId', this.student.studentId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseHistory/queryExerciseIdByStudentId',
        data: params
      })
        .then((res) => {
          this.exerciseInfo = res.data;

        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    }
  }

}
</script>

<style>
.p {
  float: left;
}
</style>