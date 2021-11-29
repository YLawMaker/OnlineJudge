<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            ><el-button
              size="small"
              type="header"
              @click.native.prevent="goBack()"
            >
              返回
            </el-button></el-menu-item
          >

          <el-menu-item index="/ExamInfo"><span>试卷一览</span></el-menu-item>
          <el-menu-item index="/ExamChoiceQuestonList"
            ><span>选择题</span></el-menu-item
          >
          <el-menu-item index="/ExamCompletionQuestionList"
            ><span>填空题</span></el-menu-item
          >
          <el-menu-item index="/ProgrammingList"
            ><span>编程题</span></el-menu-item
          >
          <el-menu-item index="/CandidateScore"
            ><span>考生成绩</span></el-menu-item
          >
          <el-menu-item index="/ExamAnalyse"
            ><span>考试分析</span></el-menu-item
          >
        </el-menu>
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
      examId: 0,
      examManageCurrentPage: 0,
    }
  },
  mounted: function () {
    this.examId = Number(this.$route.query.examIdfromManage)
    this.examManageCurrentPage = Number(this.$route.query.examManageCurrentPage)
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'ExamInfoList', params: { currentPage: this.examManageCurrentPage } })
      // , params: { page: currentPage, key: searchKey }
    },
    handleSelect (key, keyPath) {
      this.$router.push({ path: key, query: { examIdfromManage: this.examId } });
    },
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
.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
.el-submenu {
  width: 100px;
}
.el-button--header {
  color: #909399;
  background-color: #fff;
  border-color: #fff;
  font-size: 14px;
}
</style>