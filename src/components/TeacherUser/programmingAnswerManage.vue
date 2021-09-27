<template>
  <div>
    <div class="topBar_answer">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="goBack(examIdFromManage)"
      >
        返回
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="addDialogvisiable()"
        >添加答案</el-button
      >
    </div>
    <el-table
      :data="programmingAnswerList"
      :row-style="{ height: '20px' }"
      stripe
    >
      <el-table-column prop="examProgrammingAnswerInput" label="答案输入">
        <template slot-scope="scope">
          <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
            {{ scope.row.examProgrammingAnswerInput }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="examProgrammingAnswerOutput" label="答案输出">
        <template slot-scope="scope">
          <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
            {{ scope.row.examProgrammingAnswerOutput }}
          </div>
        </template>
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
            size="small"
            @click.native.prevent="modifyProgrammingAnswerInfoDialog(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click.native.prevent="deleteConfirm(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加编程题答案"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
    >
      <el-form
        ref="addProgrammingAnswer"
        :model="addProgrammingAnswerData"
        :rules="addRules"
        class="addProgrammingAnswerForm"
      >
        <el-form-item label="答案输入" prop="examProgrammingAnswerInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingAnswerData.examProgrammingAnswerInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案输出" prop="examProgrammingAnswerOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="addProgrammingAnswerData.examProgrammingAnswerOutput"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addProgrammingAnswer('addProgrammingAnswer')"
            >添加</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改编程题答案"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form
        ref="modifyProgrammingAnswer"
        :model="modifyProgrammingAnswerData"
        :rules="addRules"
        class="modifyProgrammingAnswerForm"
      >
        <el-form-item label="答案输入" prop="examProgrammingAnswerInput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingAnswerData.examProgrammingAnswerInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案输出" prop="examProgrammingAnswerOutput">
          <el-input
            type="textarea"
            :autosize="true"
            v-model="modifyProgrammingAnswerData.examProgrammingAnswerOutput"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyProgrammingAnswer()"
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
        ref="ProgrammingAnswerInfo"
        :model="modifyProgrammingAnswerData"
        :rules="addRules"
        class="ProgrammingAnswerInfoForm"
      >
        <el-form-item label="答案输入" prop="examProgrammingAnswerInput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingAnswerData.examProgrammingAnswerInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案输出" prop="examProgrammingAnswerOutput">
          <el-input
            type="textarea"
            :autosize="true"
            :disabled="edit"
            v-model="modifyProgrammingAnswerData.examProgrammingAnswerOutput"
          ></el-input>
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
      addProgrammingAnswerData: {
        examProgrammingAnswerId: '',
        examProgrammingId: '',
        examProgrammingAnswerInput: '',
        examProgrammingAnswerOutput: ''
      },
      modifyProgrammingAnswerData: {
        examProgrammingAnswerId: '',
        examProgrammingId: '',
        examProgrammingAnswerInput: '',
        examProgrammingAnswerOutput: ''
      },
      edit: true,
      addRules: {},
      programmingAnswerList: [],
      programmingId: '',
      examIdFromManage: '',
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edittableDataVisible_info: false
    }
  },
  mounted: function () {
    // console.log(this.$route.query.examProgrammingIdfromManage);
    // console.log(this.$route.query.examIdFromManage);
    this.examIdFromManage = this.$route.query.examIdFromManage;
    this.programmingId = this.$route.query.examProgrammingIdfromManage
    this.getprogrammingAnswer(this.programmingId);
  },
  methods: {
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.edittableDataVisible_info = false
    },
    modifyProgrammingAnswerInfoDialog (row) {
      // alert(row.examProgrammingAnswerId)
      this.edittableDataVisible_modify = true
      this.modifyProgrammingAnswerData.examProgrammingAnswerId = row.examProgrammingAnswerId;
      this.modifyProgrammingAnswerData.examProgrammingAnswerInput = row.examProgrammingAnswerInput;
      this.modifyProgrammingAnswerData.examProgrammingAnswerOutput = row.examProgrammingAnswerOutput;
    },
    programmingInfoDialog (row) {
      this.edittableDataVisible_info = true
      this.modifyProgrammingAnswerData.examProgrammingAnswerInput = row.examProgrammingAnswerInput;
      this.modifyProgrammingAnswerData.examProgrammingAnswerOutput = row.examProgrammingAnswerOutput;
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    goBack (examIdFromManage) {
      this.$router.push({ path: '/programmingManage', query: { examId: examIdFromManage } })
    },
    getprogrammingAnswer (programmingId) {
      const that = this
      let params = new URLSearchParams();
      // console.log(programmingId);
      params.append('programmingId', programmingId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgrammingAnswer/queryProgrammingAnswerInfoById',
        data: params
      }).then(function (resp) {
        that.programmingAnswerList = resp.data
      })
    },
    addProgrammingAnswer (addProgrammingAnswer) {
      var that = this;
      var id = this.programmingId
      this.$refs[addProgrammingAnswer].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('examProgrammingId', this.programmingId);
          params.append('examProgrammingAnswerInput', this.addProgrammingAnswerData.examProgrammingAnswerInput);
          params.append('examProgrammingAnswerOutput', this.addProgrammingAnswerData.examProgrammingAnswerOutput);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/examProgrammingAnswer/addExamProgrammingAnswer',
            data: params
          }).then((res) => {
            if (res.data == 0) {
              // console.log(res.data);
              this.$message.error('答案添加失败');
              this.edittableDataVisible_add = false;
              this.getprogrammingAnswer(id);
            } else {
              this.$message.success('答案添加成功');
              this.edittableDataVisible_add = false;
              this.addProgrammingAnswerData = new Object();
              this.getprogrammingAnswer(id);
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    modifyProgrammingAnswer () {
      let params = new URLSearchParams();
      params.append('examProgrammingAnswerId', this.modifyProgrammingAnswerData.examProgrammingAnswerId);
      params.append('examProgrammingAnswerInput', this.modifyProgrammingAnswerData.examProgrammingAnswerInput);
      params.append('examProgrammingAnswerOutput', this.modifyProgrammingAnswerData.examProgrammingAnswerOutput);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgrammingAnswer/modifyExamProgrammingAnswer',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('答案修改成功');
          this.edittableDataVisible_modify = false;
          this.getprogrammingAnswer(this.programmingId);
        } else if (res.data == false) {
          this.$message.error('答案修改失败');
          this.edittableDataVisible_modify = false;
          this.getprogrammingAnswer(this.programmingId);
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getprogrammingAnswer(this.programmingId);
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该答案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteProgrammingAnswer(row.examProgrammingAnswerId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteProgrammingAnswer (examProgrammingAnswerId) {
      let params = new URLSearchParams();
      params.append('examProgrammingAnswerId', examProgrammingAnswerId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examProgrammingAnswer/deleteExamProgrammingAnswer',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('删除成功');
          this.getprogrammingAnswer(this.programmingId);
        } else if (res.data == false) {
          this.$message.error('删除失败');
          this.getprogrammingAnswer(this.programmingId);
        } else {
          this.$message.error('发生了错误');
          this.getprogrammingAnswer(this.programmingId);
        }
      }).catch((res) => {
        console.log(res);
      })
    }
  }
}
</script>
<style>
.el-table .cell {
  white-space: pre-line;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
}
</style>
