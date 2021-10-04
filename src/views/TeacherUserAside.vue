<template>
  <el-container>
    <el-header
      ><el-menu
        :default-active="this.$route.path"
        router  
        mode="horizontal"
        menu-trigger="click"
        :unique-opened="isunique"
        text-color="#000000"
        :collapse-transition="iscollapse"
      >
        <el-menu-item index="../addExam">考试管理</el-menu-item>
        <div class="teacherName-right" @click="gotoTeacherInfo()">
          <span el-dropdown-link>
            {{ teacherUserName }}
          </span>
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
      teacherUserName: '',
      collapse: false,
      isunique: true,
      iscollapse: true,
      items: [
        {
          icon: 'el-icon-doucument',
          index: 'addExam',
          title: '添加考试'
        },
        {
          icon: 'el-icon-doucument',
          index: 'Consumer',
          title: '用户管理'
        },
        {
          icon: 'el-icon-doucument',
          index: 'Singer',
          title: '歌手管理'
        },
        {
          icon: 'el-icon-doucument',
          index: 'SongList',
          title: '歌单管理'
        },
      ]
    }
  },
  computed: {
    //默认
    onRoutes () {
      return this.$route.path.replace('/', '');
    }
  },
  mounted: function () {
    this.getTeacherInfo();
  },
  methods: {
    gotoTeacherInfo () {
      this.$router.push('/teacherInfo')
    },
    getTeacherInfo () {
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
    
          this.teacherUserName = res.data.userName;
          // console.log(this.teacher);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    }
  }

}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  background-color: #334256;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
.sidebar::-webkit-scrollbar {
  width: 0px;
}
.sidebar > ul {
  height: 100%;
}
.contnet-box {
  margin-left: 150px;
}
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #ffffff;
  margin-left: -0.4%;
  margin-top: -0.3%;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
  /*居中 */
  display: flex;
  height: 70px;
  align-items: center;
}

.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
.teacherName-right span {
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
}
.teacherName-right {
  float: right;
  /*居中 */
  display: flex;
  margin-right: 20px;
}
</style>