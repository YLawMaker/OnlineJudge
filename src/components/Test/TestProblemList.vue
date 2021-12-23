<template>
  <el-card>
    <div>
      <div class="topBar_programming">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-back"
          round
          plain
          @click.native.prevent="goBack(managePage)"
          >返回</el-button
        >
        <el-button
          size="small"
          type="primary"
          icon="el-icon-document-add"
          round
          plain
          @click.native.prevent="addDialogvisiable()"
          >添加</el-button
        >
      </div>
      <el-table
        :data="data"
        style="width: 100%"
        :row-style="{ height: '20px' }"
        stripe
      >
        <el-table-column prop="exercise.exerciseTitle" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="exercise.exerciseDescription"
          label="描述"
          width="180"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="exercise.exerciseInput"
          label="问题输入"
          width="180"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="exercise.exerciseOutPut"
          label="问题输出"
          width="180"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="exercise.exerciseSampleInput"
          label="样例输入"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="exercise.exerciseSampleOutput" label="样例输出">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click.native.prevent="deleteConfirm(scope.row)"
              size="small"
              icon="el-icon-delete-solid"
              round
              plain
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrent"
          :current-page.sync="currentPage"
          :page-size="pagesize"
          layout="total,prev, pager, next"
          :total="this.programmingList.length"
          v-if="this.programmingList.length != 0"
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
  </el-card>
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
      programmingIdList: []
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
      this.$router.push({ name: 'TestInfoList', params: { page: currentPage } })
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
        console.log(that.programmingList);
        for (var i = 0, len1 = that.tableData.length; i < len1; i++) {
          // console.log(that.tableData[i].exerciseId);
          for (var j = 0, len2 = that.programmingList.length; j < len2; j++) {
            // console.log("List:" + that.programmingList[j].exerciseId);
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
        url: '/testProgramming/queryTestProgrammingQuestionInfoByTestId',
        data: params
      }).then(function (resp) {
        // console.log(resp.data);
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
      params.append('testProgrammingQuestions', JSON.stringify(this.programmingIdList));
      // console.log(params.toString());
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/testProgramming/addTestProgrammingQuestionInfos',
        data: params
      }).then((res) => {
        if (res.data == false) {
          this.$message.error('添加失败');
          this.edittableDataVisible_add = false;
          this.getTestProgramming(this.testId);
          this.getExercise();
        } else {
          this.$message.success('添加成功');
          this.edittableDataVisible_add = false;
          this.getTestProgramming(this.testId);
          this.getExercise();
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteProgramming(row.testProgrammingQuestionId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        // console.log(resp);
      });
    },
    deleteProgramming (testProgrammingQuestionId) {
      let params = new URLSearchParams();
      params.append('testProgrammingQuestionId', testProgrammingQuestionId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/testProgramming/deleteTestProgrammingQuestionByTestProgrammingQuestionId',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('题目删除成功');
          this.getTestProgramming(this.testId);
          this.getExercise();
        } else if (res.data == false) {
          this.$message.error('题目删除失败');
          this.getTestProgramming(this.testId);
          this.getExercise();
        } else {
          this.$message.error('系统发生了错误');
          this.getTestProgramming(this.testId);
          this.getExercise();
        }
      }).catch((res) => {
        console.log(res);
      })
    }
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