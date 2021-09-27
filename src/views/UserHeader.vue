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
          <el-menu-item index="/exerciseList">ExerciseList</el-menu-item>
          <el-menu-item index="/exerciseRealTimeStatus"
            >Realtime Judge Status</el-menu-item
          >
          <el-menu-item index="/userRankList">UserRankList</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">Online Teaching</template>
          <el-menu-item @click="goToExamList()">Exams</el-menu-item>
        </el-submenu>

        <div class="loginbutton">
          <span
            style="margin-right: 3%; cursor: pointer"
            el-dropdown-link
            @click="gotoUserInfo()"
            >{{ userName }}</span
          >
          <el-button plain @click="userLogin()">登录 </el-button>
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      userName: '',
      userId: '',
      classesId: ''
    }
  },
  mounted: function () {
    this.getUserInfo();
  },
  methods: {
    //跳转到考试列表界面
    goToExamList(){
      if(this.userId==""){
          this.$message.error("请先登录用户");
          this.$router.push('/userLogin')
      }else{
          this.$router.push({ path: '/examList', query: { userId: this.userId } });
      }
    },
    //跳转到用户登录界面
    userLogin(){
      this.$router.push('/userLogin')
    },
    //获取用户信息
    getUserInfo() {
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
          if (res.data != 0) {
            this.userName = res.data.userName;
            this.userId = res.data.userId;
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
  padding: 7.5px 10px 0px 0px;
}
</style>