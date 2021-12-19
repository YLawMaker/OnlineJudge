<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#3A77B4"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
        >
          <el-menu-item class="backOJ" index="/userMainInterface">
            <i class="el-icon-back"></i>
            <span style="">返回OJ</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-kaoshizuoda"></i>
              <span>考试</span>
            </template>
            <el-menu-item index="/examInfoList">考试管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="iconfont icon-wodetiku-yunjiepoutikuxuanti"></i>
              <span>题库</span>
            </template>
            <el-menu-item index="/choiceQuestionList">选择题题库</el-menu-item>
            <el-menu-item index="/completionQuestionList"
              >填空题题库</el-menu-item
            >
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="iconfont icon-navicon-rqfz"></i
              ><span>分组</span></template
            >
            <el-menu-item index="/groupInfoList"> 分组管理 </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="teacherName-right" @click="gotoTeacherInfo()">
          <i class="el-icon-user-solid"></i>
          <span el-dropdown-link> {{ teacherUserName }}教师 </span>
        </div>
      </el-header>
      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teacherUserName: "",
    };
  },
  computed: {},
  mounted: function () {
    this.getTeacherUserInfo();
  },
  methods: {
    //跳转界面
    handleSelect (key, keyPath) {
      this.$router.push(key);
    },
    //跳转到教师信息
    gotoTeacherInfo () {
      this.$router.push("/teacherInfo");
    },
    //获取教师用户信息
    getTeacherUserInfo () {
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
          this.teacherUserName = res.data.userName;
          // console.log(this.teacher);
        })
        .catch((err) => {
          this.$message.error("系统错误请稍后再尝试");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
.el-dropdown-link:hover {
  color: #b1b1b1;
  cursor: pointer;
}
.teacherName-right {
  padding-top: 20px;
  color: #ffffff;
  height: 100%;
  width: 120px;
  font-size: 1em;
  cursor: pointer;
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
  .backOJ {
    padding: 0 20px 0 0px;
    font-size: 1em;
  }
  .el-menu-item {
    background-color: #3a77b4;
    padding: 0 20px 0 10px;
    border-right: 1px solid #3a77b4;
  }
  i {
    color: #fff;
  }
  i:active {
    color: #ffd04b;
  }
  .el-submenu {
    width: 100px;
    margin-left: 30px;
  }
  .el-submenu__title {
    span {
      margin-left: 10px;
    }
  }
}
</style>
