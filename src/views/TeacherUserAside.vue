<template>
  <div>
 <el-container>
  <el-aside width="200px"  style="background-color:#545c64;height:900px">
      <h3 >标签</h3>
      <el-row class="tac">
        <el-col>  
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :unique-opened=true
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span style="width:200px">导航一</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>

                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
  <el-container>
    <el-header style="">
      <div class="teacherName-right" @click="gotoTeacherInfo()">
        <span el-dropdown-link>
          {{ teacherUserName }}
        </span>
        </div>
    </el-header>
    <el-main>
      <router-view>
      </router-view>
    </el-main>
    <el-footer>
      Footer
    </el-footer>
  </el-container>
</el-container>
   </div>
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
    this.getTeacherUserInfo();
  },
  methods: {
    
    //跳转到教师信息
    gotoTeacherInfo () {
      this.$router.push('/teacherInfo')
    },
    //获取教师用户信息
    getTeacherUserInfo () {
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
.el-submenu{
  width:200px;
}
</style>