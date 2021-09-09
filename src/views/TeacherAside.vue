<template>
  <div>
    <div class="header">
      <div class="collapse-btn">
        <i class="el-icon-menu"></i>
      </div>
      <div class="logo">教师管理</div>
      <div class="header-right">
        <div class="teacherName-right" @click="gotoTeacherInfo()">
          <span el-dropdown-link>
            {{ teacherName }}
          </span>
        </div>
        <el-dropdown class="user-name" trigger="click">
          <span class="el-dropdown-link">
            退出
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="sidebar">
      <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#334256"
        text-color="#ffffff"
        active-text-color="#20a0ff"
        router
      >
        <template v-for="item in items">
          <template>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
    <div class="contnet-box">
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      teacherName: '',
      collapse: false,
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
        url: '/teacher/queryTeacherInfoById',
        data: params
      })
        .then((res) => {
          this.teacherName = res.data.teacherName;
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
}
.teacherName-right {
  float: right;
  /*居中 */
  display: flex;
  margin-right: 20px;
}
</style>