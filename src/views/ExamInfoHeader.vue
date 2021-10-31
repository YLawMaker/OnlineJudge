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
              type="primary"
              @click.native.prevent="goBack()"
            >
              返回
            </el-button></el-menu-item
          >

          <el-menu-item index="/faq"><span>试卷一览</span></el-menu-item>
          <el-menu-item index="/ChoiceQuestionManage"
            ><span>选择题</span></el-menu-item
          >
          <el-menu-item index="/CompletionQuestionManage"
            ><span>填空题</span></el-menu-item
          >
          <el-menu-item index="/faq"><span>编程题</span></el-menu-item>
          <el-menu-item index="/CandidateScore"
            ><span>考生成绩</span></el-menu-item
          >
          <el-menu-item index="/faq"><span>成绩分析</span></el-menu-item>
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
      examId: '',
    }
  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'AddExam' })
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
</style>