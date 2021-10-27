<template>
  <div>
    <div class="topBar_answer">
      <!-- <el-button size="small" type="primary" @click.native.prevent="goBack()">
        返回
      </el-button> -->
      <!-- <el-input
        v-model="select_word"
        size="mini"
        class="search_input"
        placeholder="请输入编程题编号"
        style="width: 200px"
        clearable
      ></el-input>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="programmingPreview()"
        >预览</el-button
      > -->
      <el-button
        size="small"
        type="primary"
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
      <el-table-column prop="exerciseTitle" label="标题" width="180">
      </el-table-column>
      <el-table-column
        prop="exerciseDescription"
        label="描述"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="exerciseInput"
        label="问题输入"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="exerciseOutPut"
        label="问题输出"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="exerciseSampleInput" label="样例输入" width="180">
      </el-table-column>
      <el-table-column prop="exerciseSampleOutput" label="样例输出">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
            size="small"
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
        placeholder="请输入标题关键字"
        style="width: 200px"
        clearable
      ></el-input>
      <el-table
        ref="addProgrammingTable"
        :data="data_dialog"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column
          label="标题"
          prop="exerciseTitle"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="描述"
          prop="exerciseDescription"
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
        @click="addProgramming_dialog()"
        >添加</el-button
      >
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      programmingData: {
        examId: '',
        examProgrammingId: '',
        examProgrammingTitle: '',
        examProgrammingDescription: '',
        examProgrammingInput: '',
        examProgrammingOutput: '',
        examProgrammingSampleInput: '',
        examProgrammingSampleOutput: '',
        examProgrammingScore: ''
      },
      edit: true,
      addRules: {},
      programmingList: [],
      searchData: [],
      examIdFromExamManage: 0,
      edittableDataVisible_add: false,
      DataVisible_preview: false,
      currentPage: 1,
      pagesize: 8,
      currentPage_dialog: 1,
      pagesize_dialog: 5,
      select_word: '',
      multipleSelection: [],
      tableData: [],
      programmingIdList: []
    }
  },
  mounted: function () {
    this.examIdFromExamManage = this.$route.query.examIdfromManage;
    this.getprogramming(this.examIdFromExamManage);
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
          if (item.exerciseTitle.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);

          }
        }
      }
    },
  },
  methods: {
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.addProgrammingData = new Object();
      this.select_word = ""
    },
    handleCurrent_dialog (val) {
      this.currentPage_dialog = val;
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    getRowKey (row) {
      return row.exerciseId
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true

    },
    //根据输入框输入的编号，预览相应的编程题
    programmingPreview () { },
    // programmingIdListInit () {
    //   for (var i = 0; i < this.programmingList.length; i++) {
    //     this.programmingIdList[i] = this.programmingList[i].exerciseId
    //   }
    //   console.log("当前考试已添加的编程题的ID为:" + this.programmingIdList);
    // },
    getprogramming (examId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(examId);
      params.append('examId', examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamQuestionProgrammingByExamId',
        data: params
      }).then(function (resp) {
        that.programmingList = resp.data
        // that.programmingIdListInit();
        // console.log(that.programmingList);
      })
    },
    addProgramming_dialog () {
      if (this.programmingIdList.length == 0) {
        this.programmingIdList = this.multipleSelection.map(item => item.exerciseId)
      }
      console.log("选中的编程题的ID为:" + this.multipleSelection.map(item => item.exerciseId));
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
            if (that.tableData[i].exerciseId === that.programmingList[j].exerciseId) {
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
    deleteConfirm (row) {
      alert(row.exerciseTitle)
    }
  }
}
</script>
<style>
.el-tooltip__popper {
  max-width: 30%;
  background: black !important;
  color: white !important;
  opacity: 50 !important; /*背景色透明度*/
  white-space: pre-line !important;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
}
.el-table .cell {
  white-space: pre-line;
}
.router-link-active {
  text-decoration: none;
}
a {
  /* text-decoration: none; */
  color: #606266;
}
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
.block_addDialog {
  position: absolute;
  bottom: 7px;
  left: 50%;
  transform: translate(-50%, -50%);
}
.addProgrammingDialog_button {
  margin: 25px 25px 25px 25px;
  float: right;
}
.el-dialog {
  overflow: auto;
}
</style>
