<template>
  <div>
    <div class="topBar_answer">
      <el-button size="small" type="primary" @click.native.prevent="goBack()">
        返回
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="addDialogvisiable()"
        >添加编程题</el-button
      >
    </div>
    <el-table
      :data="programmingList"
      style="width: 100%"
      :row-style="{ height: '20px' }"
      stripe
    >
      <el-table-column prop="examProgrammingTitle" label="标题" width="180">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: 'programmingAnswerManage',
              query: {
                examProgrammingIdfromManage: scope.row.examProgrammingId,
                examIdFromManage: examIdFromAddExam,
              },
            }"
          >
            {{ scope.row.examProgrammingTitle }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="examProgrammingDescription"
        label="描述"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="examProgrammingInput"
        label="问题输入"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="examProgrammingOutput"
        label="问题输出"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="examProgrammingSampleInput"
        label="样例输入"
        width="180"
      >
        <template slot-scope="scope">
          <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
            {{ scope.row.examProgrammingSampleInput }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="examProgrammingSampleOutput"
        label="样例输出"
        width="180"
      >
        <template slot-scope="scope">
          <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
            {{ scope.row.examProgrammingSampleOutput }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="examProgrammingScore" label="分数" width="50">
      </el-table-column>
      <el-table-column label="操作"
        ><template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="programmingInfoDialog(scope.row)"
            size="small"
            >详情</el-button
          >
          <el-button
            type="primary"
            @click.native.prevent="modifyProgrammingInfoDialog(scope.row)"
            size="small"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加编程题"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
    >
      <el-form
        ref="addProgramming"
        :model="addProgrammingData"
        :rules="addRules"
        class="addProgrammingForm"
      >
        <el-form-item label="题目" prop="examProgrammingTitle">
          <el-input
            v-model="addProgrammingData.examProgrammingTitle"
          ></el-input>
        </el-form-item>
        <el-form-item label="题目描述" prop="examProgrammingDescription">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingData.examProgrammingDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输入" prop="examProgrammingInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingData.examProgrammingInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输出" prop="examProgrammingOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingData.examProgrammingOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输入" prop="examProgrammingSampleInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingData.examProgrammingSampleInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输出" prop="examProgrammingSampleOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingData.examProgrammingSampleOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="examProgrammingScore">
          <el-input v-model="addProgrammingData.examProgrammingScore">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addProgramming('addProgramming')"
            >添加</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改编程题"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form
        ref="modifyProgramming"
        :model="modifyProgrammingData"
        :rules="addRules"
        class="modifyProgrammingForm"
      >
        <el-form-item label="题目" prop="examProgrammingTitle">
          <el-input
            v-model="modifyProgrammingData.examProgrammingTitle"
          ></el-input>
        </el-form-item>
        <el-form-item label="题目描述" prop="examProgrammingDescription">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingData.examProgrammingDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输入" prop="examProgrammingInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingData.examProgrammingInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输出" prop="examProgrammingOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingData.examProgrammingOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输入" prop="examProgrammingSampleInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingData.examProgrammingSampleInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输出" prop="examProgrammingSampleOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingData.examProgrammingSampleOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="examProgrammingScore">
          <el-input v-model="modifyProgrammingData.examProgrammingScore">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyProgramming()"
            >修改</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="edittableDataVisible_info"
      :before-close="handleClose"
    >
      <el-form
        ref="ProgrammingInfo"
        :model="modifyProgrammingData"
        :rules="addRules"
        class="ProgrammingInfoForm"
      >
        <el-form-item label="题目" prop="examProgrammingTitle">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingTitle"
          ></el-input>
        </el-form-item>
        <el-form-item label="题目描述" prop="examProgrammingDescription">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输入" prop="examProgrammingInput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题输出" prop="examProgrammingOutput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输入" prop="examProgrammingSampleInput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingSampleInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例输出" prop="examProgrammingSampleOutput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingSampleOutput"
          ></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="examProgrammingScore">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingData.examProgrammingScore"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
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
      addProgrammingData: {
        examId: '',
        examProgrammingTitle: '',
        examProgrammingDescription: '',
        examProgrammingInput: '',
        examProgrammingOutput: '',
        examProgrammingSampleInput: '',
        examProgrammingSampleOutput: '',
        examProgrammingScore: ''
      },
      modifyProgrammingData: {
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
      examIdFromAddExam: '',
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edittableDataVisible_info: false
    }
  },
  mounted: function () {
    // alert(this.$route.query.examId)
    this.examIdFromAddExam = this.$route.query.examId;
    this.getprogramming(this.$route.query.examId);
  },
  methods: {
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.edittableDataVisible_info = false
      this.addProgrammingData = new Object();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    modifyProgrammingInfoDialog (row) {
      this.edittableDataVisible_modify = true
      this.modifyProgrammingData.examId = this.examIdFromAddExam;
      this.modifyProgrammingData.examProgrammingId = row.examProgrammingId;
      this.modifyProgrammingData.examProgrammingTitle = row.examProgrammingTitle;
      this.modifyProgrammingData.examProgrammingDescription = row.examProgrammingDescription;
      this.modifyProgrammingData.examProgrammingInput = row.examProgrammingInput;
      this.modifyProgrammingData.examProgrammingOutput = row.examProgrammingOutput;
      this.modifyProgrammingData.examProgrammingSampleInput = row.examProgrammingSampleInput;
      this.modifyProgrammingData.examProgrammingSampleOutput = row.examProgrammingSampleOutput;
      this.modifyProgrammingData.examProgrammingScore = row.examProgrammingScore;
    },
    programmingInfoDialog (row) {
      this.edittableDataVisible_info = true
      this.modifyProgrammingData.examProgrammingTitle = row.examProgrammingTitle;
      this.modifyProgrammingData.examProgrammingDescription = row.examProgrammingDescription;
      this.modifyProgrammingData.examProgrammingInput = row.examProgrammingInput;
      this.modifyProgrammingData.examProgrammingOutput = row.examProgrammingOutput;
      this.modifyProgrammingData.examProgrammingSampleInput = row.examProgrammingSampleInput;
      this.modifyProgrammingData.examProgrammingSampleOutput = row.examProgrammingSampleOutput;
      this.modifyProgrammingData.examProgrammingScore = row.examProgrammingScore;
    },
    modifyProgramming () {
      let params = new URLSearchParams();
      params.append('examProgrammingId', this.modifyProgrammingData.examProgrammingId);
      params.append('examProgrammingTitle', this.modifyProgrammingData.examProgrammingTitle);
      params.append('examProgrammingDescription', this.modifyProgrammingData.examProgrammingDescription);
      params.append('examProgrammingInput', this.modifyProgrammingData.examProgrammingInput);
      params.append('examProgrammingOutput', this.modifyProgrammingData.examProgrammingOutput);
      params.append('examProgrammingSampleInput', this.modifyProgrammingData.examProgrammingSampleInput);
      params.append('examProgrammingSampleOutput', this.modifyProgrammingData.examProgrammingSampleOutput);
      params.append('examProgrammingScore', this.modifyProgrammingData.examProgrammingScore);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgramming/modifyProgramExamInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('编程题修改成功');
          this.edittableDataVisible_modify = false;
          this.getprogramming(this.examIdFromAddExam);
        } else if (res.data == false) {
          this.$message.error('编程题修改失败');
          this.edittableDataVisible_modify = false;
          this.getprogramming(this.examIdFromAddExam);
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getprogramming(this.examIdFromAddExam);
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    goBack () { this.$router.push({ name: 'AddExam' }) },

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
        url: '/examProgramming/queryProgrammingInfoById',
        data: params
      }).then(function (resp) {
        that.addProgrammingData.examId = examId
        that.programmingList = resp.data
        // console.log(that.programmingList);
      })
    },
    addProgramming (addProgramming) {
      var that = this;
      var id = this.addProgrammingData.examId
      this.$refs[addProgramming].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('examId', this.addProgrammingData.examId);
          params.append('examProgrammingTitle', this.addProgrammingData.examProgrammingTitle);
          params.append('examProgrammingDescription', this.addProgrammingData.examProgrammingDescription);
          params.append('examProgrammingInput', this.addProgrammingData.examProgrammingInput);
          params.append('examProgrammingOutput', this.addProgrammingData.examProgrammingOutput);
          params.append('examProgrammingSampleInput', this.addProgrammingData.examProgrammingSampleInput);
          params.append('examProgrammingSampleOutput', this.addProgrammingData.examProgrammingSampleOutput);
          params.append('examProgrammingScore', this.addProgrammingData.examProgrammingScore);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/examProgramming/addProgramExamInfo',
            data: params
          }).then((res) => {
            if (res.data == 0) {
              // console.log(res.data);
              this.$message.error('编程题添加失败');
              this.edittableDataVisible_add = false;
              this.getprogramming(id);
            } else {
              this.$message.success('编程题添加成功');
              this.edittableDataVisible_add = false;
              this.addProgrammingData = new Object();
              this.getprogramming(id);
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteProgramming(row.examProgrammingId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteProgramming (examProgrammingId) {
      let params = new URLSearchParams();
      params.append('examProgrammingId', examProgrammingId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgramming/deleteProgramExamInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('删除成功');
          this.getprogramming(this.examIdFromAddExam);
        } else if (res.data == false) {
          this.$message.error('删除失败');
          this.getprogramming(this.examIdFromAddExam);
        } else {
          this.$message.error('发生了错误');
          this.getprogramming(this.examIdFromAddExam);
        }
      }).catch((res) => {
        console.log(res);
      })
    }
  }
}
</script>
<style>
.el-tooltip__popper {
  max-width: 50%;
  background: white !important;
  color: white !important;
  opacity: 0 !important; /*背景色透明度*/
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
</style>
