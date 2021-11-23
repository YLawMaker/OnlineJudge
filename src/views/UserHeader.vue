<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="this.$route.path"
        router
        mode="horizontal"
        menu-trigger="click.stop"
        :unique-opened="true"
        text-color="#000000"
        :collapse-transition="true"
      >
        <el-submenu index="1">
          <template slot="title">Online Judge</template>
          <el-menu-item index="/faq">F.A.Q</el-menu-item>
          <el-menu-item index="1-2">Hand In Hand</el-menu-item>
          <el-menu-item index="1-3">Online Acmers</el-menu-item>
          <el-menu-item index="/managerLogin">管理员登陆</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">Online Exercise</template>
          <el-menu-item @click="goToExerciseList()">ExerciseList</el-menu-item>
          <el-menu-item @click="goToExerciseRealTimeStatus()"
            >Realtime Judge Status</el-menu-item
          >
          <el-menu-item @click="gotoUserRankList()">UserRankList</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">Online Teaching</template>
          <el-menu-item @click="goToExamList()">Exam List</el-menu-item>
          <el-menu-item @click="goToTestList()">Test List</el-menu-item>
          <el-menu-item @click="goToExamRankList()"
            >Exam Statistics</el-menu-item
          >
          <el-menu-item @click="goToPersonalExamHistory()"
            >个人考试记录</el-menu-item
          >
        </el-submenu>
        <el-submenu index="4" v-if="this.userIdentity == 'teacher'">
          <template slot="title">Teacher</template>
          <el-menu-item @click="goToTeacherManager()"
            >TeacherManager</el-menu-item
          >
        </el-submenu>

        <div class="loginbutton">
          <span
            style="
              margin-right: 3%;
              font-size: 16px;
              cursor: pointer; /*鼠标悬停变小手*/
            "
            @click="gotoUserInfo()"
            >{{ userName }}</span
          >
          <el-button
            plain
            @click="userLogin()"
            v-if="userName == ''"
            style="margin-top: -5px"
            >登录
          </el-button>
          <span
            v-if="userName != ''"
            @click="exitLogin()"
            style="
              float: right;
              font-size: 16px;
              cursor: pointer; /*鼠标悬停变小手*/
            "
            >退出登录</span
          >
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <router-view> </router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      userName: '',
      userId: '',
      userIdentity: '',
    }
  },
  mounted: function () {
    sessionStorage.setItem("isPublish", "false");
    this.getUserInfo();
  },

  methods: {
    //跳转到测试列表界面
    goToTestList () {
      if (this.userId == "") {
        this.$message.error("请先登录用户");
        this.$router.push('/userLogin')
      } else {
        this.$router.push({ path: '/testList' });

      }

    },
    //跳转到用户排行榜 保存返回值
    gotoUserRankList () {
      if (this.$route.path != "/userRankList") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push('/userRankList')
      }
    },
    goToTeacherManager () {
      this.$router.push('/examInfoList');
    },
    //跳转到个人考试记录
    goToPersonalExamHistory () {
      if (this.$route.path != "/personalExamHistory") {
        if (this.userId == "") {
          this.$message.error("请先登录用户");
          this.$router.push('/userLogin')
        } else if (this.userIdentity == "student") {
          this.$router.replace({ path: '/personalExamHistory', query: { userId: this.userId } });
        } else if (this.userIdentity == "teacher") {
          this.$router.push('/examInfoList');
        }
      }
    },

    //跳转到习题实时状态界面 保存返回值用
    goToExerciseRealTimeStatus () {
      if (this.$route.path != "/exerciseRealTimeStatus") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push('/exerciseRealTimeStatus')
      }
    },
    //跳转到习题列表界面 保存返回值用
    goToExerciseList () {

      if (this.$route.path != "/exerciseList") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push('/exerciseList')
      }
    },


    //跳转到考试列表界面

    goToExamList () {
      if (this.$route.path != "/examList") {
        if (this.userId == "") {
          this.$message.error("请先登录用户");
          this.$router.push('/userLogin')
        } else if (this.userIdentity == "student") {
          this.$router.replace({ path: '/examList', query: { userId: this.userId } });
        } else if (this.userIdentity == "teacher") {
          this.$router.push('/examInfoList');
        }
      }
    },
    //跳转到考试排行榜界面
    goToExamRankList () {
      if (this.$route.path != "/examRankList") {
        if (this.userId == "") {
          this.$message.error("请先登录用户");
          this.$router.push('/userLogin')
        } else if (this.userIdentity == "student") {
          this.$router.push('/examRankList');
        } else if (this.userIdentity == "teacher") {
          this.$router.push('/examInfoList');
        }
      }
    },
    //跳转到用户登录界面
    userLogin () {
      sessionStorage.setItem("isPublish", "true");
      this.$router.push('/userLogin')
    },
    //获取用户信息
    getUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/user/queryUserInfo',
        data: params
      })
        .then((res) => {
          if (res.data != false) {
            this.userName = res.data.userName;
            this.userId = res.data.userId;
            this.userIdentity = res.data.userIdentity
          }
        })
        .catch((err) => {
          this.$message.error('查询学生信息失败');

        })
    },
    //跳转到用户信息界面
    gotoUserInfo () {
      this.$router.push({ path: '/userInfo', query: { userId: this.userId } })
    },
    exitLogin () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/user/exitLogin',
        data: params
      })
        .then((res) => {
          alert("退出成功");
          this.userName = '';
        })
        .catch((err) => {
          this.$message.error('删除选择题错误');

        })
    },

  }
}
</script>


<style>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 150px;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: transparent;
}
.welcome {
  overflow: hidden;
  background: white;
  text-align: center;
}
.loginbutton {
  text-align: right;
  padding: 15px 10px 0px 0px;
}
</style>