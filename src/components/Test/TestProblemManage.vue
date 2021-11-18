<template>
  <div>
    <div class="topBar_programming">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="goBack(managePage)"
        >返回</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="addDialogvisiable()"
        >添加</el-button
      >
    </div>
    <el-table>
      <el-table-column label="编号" width="80"></el-table-column>
      <el-table-column label="标题"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrent"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="this.testProgrammingList.length"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="添加编程题"
      :visible.sync="edittableDataVisible_add"
      v-if="edittableDataVisible_add"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="850px"
    >
      <el-input
        v-model="select_word"
        size="mini"
        class="search_input"
        placeholder="请输入习题标题关键字"
        style="width: 200px"
        clearable
      ></el-input>
      <el-table
        :data="data_dialog"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column
          label="编号"
          prop="exerciseId"
          :show-overflow-tooltip="true"
          width="80"
        >
        </el-table-column>
        <el-table-column
          label="标题"
          prop="exerciseTitle"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column type="selection" :reserve-selection="true">
        </el-table-column>
      </el-table>
      <div class="block_addDialog">
        <el-pagination
          @current-change="handleCurrent_dialog"
          :current-page.sync="currentPage_dialog"
          :page-size="pagesize_dialog"
          layout="total,prev, pager, next"
          :total="this.searchData.length"
          v-if="this.searchData.length != 0"
        >
        </el-pagination>
      </div>
      <el-button
        class="addProgrammingDialog_button"
        size="small"
        type="primary"
        @click="addProgramming_dialog('')"
        >添加</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testProgrammingList: [],
      currentPage: 1,
      pagesize: 8,
      currentPage_dialog: 1,
      pagesize_dialog: 7,
      select_word: '',
      managePage: 0,
      testId: 0,
      edittableDataVisible_add: false,
      searchData: [],
      tableData: [],
      programmingList: [],
      multipleSelection: [],
    }
  },
  mounted: function () {
    this.testId = this.$route.query.testIdfromManage;
    this.managePage = this.$route.query.managePage;
    this.getTestProgramming(this.testId)
    this.getExercise()
  },
  computed: {
    data () {
      return this.programmingList.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    },
    data_dialog () {
      return this.searchData.slice((this.currentPage_dialog - 1) * this.pagesize_dialog, this.currentPage_dialog * this.pagesize_dialog);
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.tableData;
      } else {
        this.searchData = [];
        for (let item of this.tableData) {
          //item.exerciseTitle 添加习题的搜索框按习题标题检索
          if (item.exerciseTitle.toString().includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
      }
    },
  },
  methods: {
    goBack (currentPage) {
      // console.log(currentPage);
      this.$router.push({ name: 'TestManage', params: { page: currentPage } })
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.select_word = ""
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleCurrent_dialog (val) {
      this.currentPage_dialog = val;
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    getRowKey (row) {
      return row.exerciseId
    },
    getExercise () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exercise/queryExerciseInfo',
      }).then(function (resp) {
        // console.log(resp.data);
        that.tableData = resp.data;
        // console.log(that.tableData);
        for (var i = 0, len1 = that.tableData.length; i < len1; i++) {
          for (var j = 0, len2 = that.programmingList.length; j < len2; j++) {
            if (that.tableData[i].exerciseId === that.programmingList[j].exercise.exerciseId) {
              that.tableData.splice(i, 1)
              len1 = that.tableData.length
            }
          }
        }
        //添加编程题的dialog数据初始化(去重处理，Dialog不会显示已经添加过的题目)
        that.searchData = that.tableData;
        // console.log(that.tableData);
      })
    },
    getTestProgramming (testId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(examId);
      params.append('testId', testId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/testProgramming/queryTestProgrammingQuestionByTestId',
        data: params
      }).then(function (resp) {
        that.programmingList = resp.data
      })
    },
    addProgramming_dialog () {
      //将添加界面选中的题目的信息格式转换成对象
      // console.log(this.multipleSelection);
      for (var i = 0; i < this.multipleSelection.length; i++) {
        var emptyObject = {};
        emptyObject.testId = Number(this.testId);
        emptyObject.exerciseId = this.multipleSelection[i].exerciseId;
        this.programmingIdList.push(emptyObject)
      }
      // console.log(this.programmingIdList);
      let params = new URLSearchParams();
      params.append('addExamQuestions', JSON.stringify(this.programmingIdList));
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/addExamQuestions',
        data: params
      }).then((res) => {
        if (res.data == false) {
          this.$message.error('添加失败');
          this.edittableDataVisible_add = false;
          this.getprogramming(this.examIdFromExamManage);
          this.getExercise();
        } else {
          this.$message.success('添加成功');
          this.edittableDataVisible_add = false;
          this.getprogramming(this.examIdFromExamManage);
          this.getExercise();
        }
      }).catch((err) => {
        console.log(err);
      })
    },
  }
}
</script>

<style>
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>