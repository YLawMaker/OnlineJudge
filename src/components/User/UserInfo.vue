<template>
  <div>
    <p style="text-align: center">{{ user.userName }}</p>
    <p style="text-align: center">
      {{ user.userProfile }}<el-button>修改</el-button>
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
      user: {
        userId: '',
        userName: '',
        userProfile: '',
        userSolved: '',
        userSubmit: '',
      },
      exerciseInfo: [],
      edittableDataVisible_add: true
    }
  },
  mounted: function () {
    this.user.userId = this.$route.query.userId

    this.getUserInfo();
    this.getUserExerciseInfo();
  },
  methods: {
    //跳转至习题详情界面
    gotoExerciseDetail (item) {
      this.$router.push({
        path: '/exerciseDetail',
        query: {
          exerciseId: item,
        }
      });
    },
    //获取用户信息
    getUserInfo () {
      let params = new URLSearchParams();
      params.append('userId', this.user.userId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/user/queryUserInfoById',
        data: params
      })
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.$message.error('查询用户信息失败');

        })
    },
    //获取用户系统信息
    getUserExerciseInfo () {
      let params = new URLSearchParams();
      params.append('userId', this.user.userId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseHistory/queryExerciseIdByUserId',
        data: params
      })
        .then((res) => {
          this.exerciseInfo = res.data;

        })
        .catch((err) => {
          this.$message.error('查询用户习题信息失败');

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