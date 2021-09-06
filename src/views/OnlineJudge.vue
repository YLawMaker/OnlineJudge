<template>
  <el-container>
    <el-header>
      <el-menu
        mode="horizontal"
        menu-trigger="hover"
        unique-opened="true"
        text-color="#000000"
        collapse-transition="true"
      >
        <el-submenu index="1">
          <template slot="title">Online Judge</template>
          <el-menu-item index="1-1">F.A.Q</el-menu-item>
          <el-menu-item index="1-2">Hand In Hand</el-menu-item>
          <el-menu-item index="1-3">Online Acmers</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">Online Exercise</template>
          <el-menu-item index="2-1">Problem Archive</el-menu-item>
          <el-menu-item index="2-2">Realtime Judge Status</el-menu-item>
          <el-menu-item index="2-3">Authors Ranklist</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">Online Teaching</template>
          <el-menu-item index="3-1">Exams</el-menu-item>
        </el-submenu>
        <div class="loginbutton"><el-button plain @click="studentLogin()">登录</el-button></div>
      </el-menu>
    </el-header>
    <el-main>
      <div class="welcome">
        <span>Welcome to Online Judge System</span>
      </div>
      </el-main>
  </el-container>
</template>

<script>
export default {
  methods:{
    studentLogin(){
      this.$router.push('/studentLogin')
    }
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