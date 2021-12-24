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
          <el-menu-item>
            <div @click="goBack()">返回</div>
          </el-menu-item>

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

<style lang="less" scoped>
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
.el-dropdown-link:hover {
  color: #b1b1b1;
  cursor: pointer;
}
.el-button--header {
  color: #909399;
  background-color: #fff;
  border-color: #fff;
  font-size: 14px;
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
    padding: 0 20px 0 10px;
    border-right: 1px solid #3a77b4;
    background-color: #3a77b4;
    color: white;
  }
  .el-menu-item:hover {
    padding: 0 20px 0 10px;
    border-right: 1px solid #3a77b4;
    background-color: #2965a1;
    color: white;
  }
  .el-menu-item.is-active {
    padding: 0 20px 0 10px;
    border-right: 1px solid #3a77b4;
    background-color: #3a77b4;
    color: white;
  }
  i {
    color: #fff;
  }
  i:active {
    color: #ffd04b;
  }
}
</style>