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
        <el-menu-item index="../components/TeacherManage"
          >教师管理</el-menu-item
        >
        <el-menu-item index="../components/ExerciseManage"
          >习题管理</el-menu-item
        >
        <el-menu-item index="../components/QuestionLabelManage"
          >问题标签管理</el-menu-item
        >
        <el-menu-item index="../components/GroupManage">分组管理</el-menu-item>
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
.el-header {
  padding: 0 0;
  box-sizing: border-box;
  flex-shrink: 0;
}
</style>