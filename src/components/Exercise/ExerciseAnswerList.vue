<template>
  <el-card>
    <div>
      <div class="topBar_answer">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-back"
          round
          plain
          @click.native.prevent="goBack(currentPage, searchKey)"
        >
          返回
        </el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-document-add"
          round
          plain
          @click.native.prevent="addExerciseAnswerDialog()"
          >添加答案</el-button
        >
      </div>
      <el-table :data="exerciseAnswer" style="width: 100%">
        <el-table-column prop="exerciseAnswerId" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="exerciseAnswerInput" label="答案输入">
          <template slot-scope="scope">
            <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
              {{ scope.row.exerciseAnswerInput }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="exerciseAnswerOutput" label="答案输出">
          <template slot-scope="scope">
            <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
              {{ scope.row.exerciseAnswerOutput }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              round
              plain
              size="small"
              @click.native.prevent="modifyExercise(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              round
              plain
              size="small"
              @click.native.prevent="deleteConfirm(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加答案"
        :visible.sync="edittableDataVisible_add"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="edittableData"
          :rules="edittableDataRules"
          ref="edittableData"
        >
          <el-form-item label="答案输入" prop="exerciseAnswerInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseAnswerInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="答案输出" prop="exerciseAnswerOutput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseAnswerOutput"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addExerciseAnswer('edittableData')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="修改答案"
        :visible.sync="edittableDataVisible_modify"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="edittableData"
          :rules="edittableDataRules"
          ref="edittableData"
        >
          <el-form-item label="答案编号" prop="exerciseAnswerId">
            <el-input
              v-model="edittableData.exerciseAnswerId"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="答案输入" prop="exerciseAnswerInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseAnswerInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="答案输出" prop="exerciseAnswerOutput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseAnswerOutput"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="modifyExerciseDialog()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      exerciseAnswer: [],
      edittableData: {
        exerciseAnswerId: '',
        exerciseId: '',
        exerciseAnswerInput: '',
        exerciseAnswerOutput: ''
      },
      edittableDataRules: {},
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edit: true,
      currentPage: 1,
      searchKey: ''
    }
  },
  mounted: function () {
    this.edittableData.exerciseId = this.$route.query.exerciseIdfromManage
    this.currentPage = this.$route.query.page
    this.searchKey = this.$route.query.searchKey
    // alert(this.searchKey)
    this.getExerciseAnswer();//需要触发的函数
  },
  methods: {
    goBack (currentPage, searchKey) {
      // alert(searchKey);
      this.$router.push({ name: 'ExerciseInfoList', params: { page: currentPage, key: searchKey } })
    },
    addExerciseAnswerDialog () {
      this.edittableDataVisible_add = true
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.setnull()
    },
    getExerciseAnswer () {
      const that = this
      let params = new URLSearchParams();
      params.append('exerciseId', this.edittableData.exerciseId);
      // console.log(params.get("exerciseId"));
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseAnswer/queryExerciseAnswerInfoByExerciseId',
        data: params
      }).then(function (resp) {
        that.exerciseAnswer = resp.data;
        // console.log(resp);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该答案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteExerciseAnswer(row.exerciseAnswerId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        // console.log(resp);
      });
    },
    deleteExerciseAnswer (exerciseAnswerId) {
      let params = new URLSearchParams();
      params.append('exerciseAnswerId', exerciseAnswerId);
      // console.log(params.get("exerciseAnswerId"));
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseAnswer/deleteExerciseAnswer',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('答案删除成功');
          this.getExerciseAnswer();
        } else if (res.data == false) {
          this.$message.error('答案删除失败');
          this.getExerciseAnswer();
        } else {
          this.$message.error('发生了错误');
          this.getExerciseAnswer();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    addExerciseAnswer (answer) {
      var that = this;
      this.$refs[answer].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('exerciseId', this.edittableData.exerciseId);
          params.append('exerciseAnswerInput', this.edittableData.exerciseAnswerInput);
          params.append('exerciseAnswerOutput', this.edittableData.exerciseAnswerOutput);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/exerciseAnswer/addExerciseAnswer',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              console.log(res.data);
              this.$message.error('答案添加失败');
              this.edittableDataVisible_add = false;
              this.getExerciseAnswer()
              this.setnull()
            } else {
              this.$message.success('答案添加成功');
              this.edittableDataVisible_add = false;
              this.getExerciseAnswer()
              this.setnull()
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    modifyExercise (row) {
      this.edittableDataVisible_modify = true
      this.edittableData.exerciseAnswerId = row.exerciseAnswerId
      this.edittableData.exerciseAnswerInput = row.exerciseAnswerInput
      this.edittableData.exerciseAnswerOutput = row.exerciseAnswerOutput
    },
    modifyExerciseDialog () {
      let params = new URLSearchParams();
      params.append('exerciseAnswerId', this.edittableData.exerciseAnswerId);
      params.append('exerciseAnswerInput', this.edittableData.exerciseAnswerInput);
      params.append('exerciseAnswerOutput', this.edittableData.exerciseAnswerOutput);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseAnswer/modifyExerciseAnswerInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('答案修改成功');
          this.edittableDataVisible_modify = false;
          this.getExerciseAnswer();
          this.setnull()
        } else if (res.data == false) {
          this.$message.error('答案修改失败');
          this.edittableDataVisible_modify = false;
          this.getExerciseAnswer();
          this.setnull()
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getExerciseAnswer();
          this.setnull()
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    setnull () {
      this.edittableData.exerciseAnswerId = '';
      this.edittableData.exerciseAnswerInput = '';
      this.edittableData.exerciseAnswerOutput = ''
    }
  }
}
</script>
<style>
.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
}
.maintitle {
  text-align: center;
}
.topBar_answer {
  text-align: left;
  margin-top: 10px;
  margin-right: 25px;
  margin-left: 10px;
}
</style>