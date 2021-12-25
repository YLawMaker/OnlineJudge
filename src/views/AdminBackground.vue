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
        <el-menu-item index="../components/TeacherList">教师管理</el-menu-item>
        <el-menu-item index="../components/ExerciseInfoList"
          >习题管理</el-menu-item
        >
        <el-menu-item index="../components/QuestionLabelList"
          >问题标签管理</el-menu-item
        >
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


<style lang="less" scoped>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 150px;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: transparent;
}
.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
.el-dropdown-link:hover {
  color: #b1b1b1;
  cursor: pointer;
}
.el-header {
  padding: 0 0;
  box-sizing: border-box;
  flex-shrink: 0;
}
.el-header {
  padding: 0 20px 0 10px;
  background: #3a77b4;
  display: flex;
  justify-content: space-between;
}
.el-menu {
  height: 100%;
}
.el-menu {
  .el-button--header {
    color: white;
    border-color: #3a77b4;
    background-color: #3a77b4;
  }
  .el-button--header:hover {
    color: white;
    border-color: #2965a1;
    background-color: #2965a1;
  }
  .el-menu-item {
    padding: 0 20px 0 10px !important;
    border-right: 1px solid #3a77b4 !important;
    background-color: #3a77b4 !important;
    color: white !important;
  }
  .el-menu-item:hover {
    padding: 0 20px 0 10px !important;
    border-right: 1px solid #3a77b4 !important;
    background-color: #2965a1 !important;
    color: white !important;
  }
  .el-menu-item.is-active {
    padding: 0 20px 0 10px !important;
    border-right: 1px solid #3a77b4 !important;
    background-color: #3a77b4 !important;
    color: white !important;
  }
  i {
    color: #fff;
  }
  i:active {
    color: #ffd04b;
  }
}
</style>