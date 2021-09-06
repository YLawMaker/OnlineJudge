<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="this.$route.path"
        router
        mode="horizontal"
        menu-trigger="click"
        :unique-opened="isunique"
        text-color="#000000"
        :collapse-transition="iscollapse"
      >
        <el-submenu index="1">
          <template slot="title">教师</template>
          <el-menu-item index="../components/TeacherManage"
            >教师管理</el-menu-item
          >
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">班级</template>
          <el-menu-item index="../components/ClassManage"
            >班级管理</el-menu-item
          >
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">习题</template>
          <el-menu-item index="../components/ExerciseManage"
            >习题管理</el-menu-item
          >
        </el-submenu>
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
      iscollapse: true,
      isunique: true,
    }
  },
  mounted () {

  },
  methods: {

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
</style>