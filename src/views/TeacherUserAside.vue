<template>
  <div>
 <el-container>
 
  
    <el-header style="">
      <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">考试</template>
          <el-menu-item index="/addExam">添加考试</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">题库</template>
          <el-menu-item index="/choiceQuestionList">选择题题库</el-menu-item>
        </el-submenu> 
        <el-menu-item index="/faq" ><span >返回OJ</span></el-menu-item>
        <div class="teacherName-right" @click="gotoTeacherInfo()">
        <span el-dropdown-link>
          {{ teacherUserName }}教师
        </span>
        </div>
    </el-menu>
      
    </el-header>
    <el-main>
      <router-view>
      </router-view>
    </el-main>
    <el-footer>
      Footer
    </el-footer>
  
</el-container>
   </div>
</template>

<script>

export default {
  data () {
    return {
      teacherUserName: '',
    }
  },
  computed: {
    
  },
  mounted: function () {
    this.getTeacherUserInfo();
  },
  methods: {
    //跳转界面
      handleSelect(key, keyPath) {
        this.$router.push(key);
      },
    //跳转到教师信息
    gotoTeacherInfo () {
      this.$router.push('/teacherInfo');
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
  width:100px;
}

</style>