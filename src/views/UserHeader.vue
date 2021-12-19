<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="this.$route.path"
        router
        mode="horizontal"
        menu-trigger="click.stop"
        background-color="#3A77B4"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :collapse-transition="true"
      >
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-monitor"></i>Online Judge</template
          >

          <el-menu-item index="/managerLogin">管理员登陆</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i class="iconfont icon-exercise"></i>Online Exercise</template
          >
          <el-menu-item @click="goToExerciseList()" index="2-1"
            >ExerciseList</el-menu-item
          >
          <el-menu-item @click="goToExerciseRealTimeStatus()" index="2-2"
            >Realtime Judge Status</el-menu-item
          >
          <el-menu-item @click="gotoUserRankList()" index="2-3"
            >UserRankList</el-menu-item
          >
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i class="iconfont icon-exam"></i>Online Teaching</template
          >
          <el-menu-item @click="goToExamList()" index="3-1"
            >Exam List</el-menu-item
          >
          <el-menu-item @click="goToExamRankList()" index="3-2"
            >Exam Statistics</el-menu-item
          >
          <el-menu-item @click="goToTestList()" index="3-3"
            >Test List</el-menu-item
          >
        </el-submenu>
        <el-submenu index="4" v-if="this.userIdentity == 'teacher'">
          <template slot="title"
            ><i class="iconfont icon-teacher"></i>Teacher</template
          >
          <el-menu-item @click="goToTeacherManager()" index="4-1"
            >TeacherManager</el-menu-item
          >
        </el-submenu>
      </el-menu>
      <div class="loginbutton">
        <el-button plain @click="userLogin()" v-if="userName == ''"
          >登录
        </el-button>
        <div class="userName-right">
          <i v-if="userName != ''" class="el-icon-user-solid"></i>
          <span @click="gotoUserInfo()"> {{ userName }} </span>
        </div>
        <el-button type="danger" v-if="userName != ''" @click="exitLogin()"
          >退出登录</el-button
        >
      </div>
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
      userName: "",
      userId: "",
      userIdentity: "",
    };
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
        this.$router.push("/userLogin");
      } else {
        this.$router.push({ path: "/testList" });
      }
    },
    goToTeacherManager () {
      this.$router.push("/examInfoList");
    },
    //跳转到用户排行榜 保存返回值
    gotoUserRankList () {
      if (this.$route.path != "/userRankList") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push("/userRankList");
      }
    },

    //跳转到习题实时状态界面 保存返回值用
    goToExerciseRealTimeStatus () {
      if (this.$route.path != "/exerciseRealTimeStatus") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push("/exerciseRealTimeStatus");
      }
    },
    //跳转到习题列表界面 保存返回值用
    goToExerciseList () {
      if (this.$route.path != "/exerciseList") {
        sessionStorage.setItem("isPublish", "true");
        this.$router.push("/exerciseList");
      }
    },

    //跳转到考试列表界面

    goToExamList () {
      if (this.$route.path != "/examList") {
        if (this.userId == "") {
          this.$message.error("请先登录用户");
          this.$router.push("/userLogin");
        } else if (this.userIdentity == "student") {
          this.$router.push({
            path: "/examList",
            query: { userId: this.userId },
          });
        } else if (this.userIdentity == "teacher") {
          this.$router.push("/examInfoList");
        }
      }
    },
    //跳转到考试排行榜界面
    goToExamRankList () {
      if (this.$route.path != "/examRankList") {
        if (this.userId == "") {
          this.$message.error("请先登录用户");
          this.$router.push("/userLogin");
        } else if (this.userIdentity == "student") {
          this.$router.push("/examRankList");
        } else if (this.userIdentity == "teacher") {
          this.$router.push("/examInfoList");
        }
      }
    },
    //跳转到用户登录界面
    userLogin () {
      sessionStorage.setItem("isPublish", "true");
      this.$router.push("/userLogin");
    },
    //获取用户信息
    getUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserInfo",
        data: params,
      })
        .then((res) => {
          if (res.data != false) {
            this.userName = res.data.userName;
            this.userId = res.data.userId;
            this.userIdentity = res.data.userIdentity;
          }
        })
        .catch((err) => {
          this.$message.error("查询用户信息失败");
        });
    },
    //跳转到用户信息界面
    gotoUserInfo () {
      this.$router.push({ path: "/userInfo", query: { userId: this.userId } });
    },
    exitLogin () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/exitLogin",
        data: params,
      })
        .then((res) => {
          this.$router.push({ path: "/userMainInterface"});
          alert("退出成功");
          this.userName = "";
          this.userIdentity = "";
          this.userId = "";
        })
        .catch((err) => {
          this.$message.error("退出登录失败");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  margin: 0 20px;
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

.el-header {
  padding: 0;
  background: #3a77b4;
  display: flex;
  justify-content: space-between;
}
.el-header {
  .el-menu {
    padding: 0 20px;
    height: 100%;
  }
  .el-submenu {
    margin-right: 20px;
  }
  .el-submenu {
    i {
      color: white;
      margin-right: 10px;
    }
  }
  .loginbutton {
    color: white;
    width: auto;
  }
  .loginbutton {
    .userName-right {
      display: inline;
      font-size: 1em;
      cursor: pointer; /*鼠标悬停变小手*/
    }
    .el-button {
      display: inline;
      margin: 10px 10px 0 20px;
    }
  }
}
</style>
