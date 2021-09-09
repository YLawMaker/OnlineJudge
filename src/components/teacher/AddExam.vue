<template>
  <div>
    <div>
      <div class="topBar_Teacher">
        <el-button
          class="addButton_Exam"
          type="primary"
          size="small"
          @click.native.prevent="addDialogvisiable()"
          >添加考试</el-button
        >
      </div>
    </div>
    <el-table :data="examList" style="width: 100%" stripe>
      <el-table-column prop="examName" label="考试名称" width="180">
      </el-table-column>
      <el-table-column prop="examStartTime" label="开始时间" width="180">
      </el-table-column>
      <el-table-column prop="examEndTime" label="结束时间" width="180">
      </el-table-column>
      <el-table-column prop="classes.classesName" label="考试班级" width="180">
      </el-table-column>
      <el-table-column prop="examType" label="考试状态" width="180">
      </el-table-column>
      <el-table-column prop="examLanguage" label="代码语言" width="80">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyExamDialog(scope.row)"
            >修改</el-button
          >
          <el-button
            type="primary"
            @click.native.prevent="modifyClasses(scope.row)"
            >选择题</el-button
          >
          <el-button
            type="primary"
            @click.native.prevent="modifyClasses(scope.row)"
            >编程题</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加考试"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
    >
      <el-form
        ref="addExam"
        :model="exam_add"
        :rules="addRules"
        class="addExamForm"
      >
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="exam_add.examName"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="examStartTime">
          <el-date-picker
            v-model="exam_add.examStartTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="examEndTime">
          <el-date-picker
            v-model="exam_add.examEndTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试班级" prop="classesId">
          <el-select
            v-model="exam_add.classesId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in classesList"
              :key="item.classesId"
              :label="item.classesName"
              :value="item.classesId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言类型" prop="examLanguage">
          <el-select v-model="exam_add.examLanguage" placeholder="请选择">
            <el-option
              v-for="item in language"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addExam('addExam')">添加</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改考试信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form :model="exam_modify" ref="exam_modify">
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="exam_modify.examName"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="examStartTime">
          <el-date-picker
            v-model="exam_modify.examStartTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="examEndTime">
          <el-date-picker
            v-model="exam_modify.examEndTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试班级" prop="classesId">
          <el-select
            v-model="exam_modify.classesId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in classesList"
              :key="item.classesId"
              :label="item.classesName"
              :value="item.classesId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言类型" prop="examLanguage">
          <el-select v-model="exam_modify.examLanguage" placeholder="请选择">
            <el-option
              v-for="item in language"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyExamInfo()">修改</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teacher: {
        teacherId: '',
        teacherName: ''
      },
      exam_add: {
        examId: '',
        examName: '',
        examStartTime: '',
        examEndTime: '',
        teacherId: '',
        classesId: '',
        examType: '',
        examLanguage: ''
      },
      exam_modify: {
        examId: '',
        examName: '',
        examStartTime: '',
        examEndTime: '',
        teacherId: '',
        classesName: '',
        classesId: '',
        examType: '',
        examLanguage: ''
      },
      classesList: [

      ],
      language: [{ value: 'C', label: 'C' }, { value: 'C++', label: 'C++' }, { value: 'Java', label: 'Java' }],
      addExamData: {},
      addRules: {},
      examList: [],
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false
    }
  },
  mounted: function () {
    this.getTeacherInfo();
    this.getExamInfo();
    this.setClassesList()
  },
  methods: {
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
      this.setClassesList()
      this.exam_add = new Object();
    },
    modifyExamDialog (row) {
      this.edittableDataVisible_modify = true
      this.setClassesList()
      this.exam_modify.examId = row.examId
      this.exam_modify.examName = row.examName
      this.exam_modify.examStartTime = row.examStartTime
      this.exam_modify.examEndTime = row.examEndTime
      this.exam_modify.examLanguage = row.examLanguage
      this.exam_modify.classesName = row.classes.classesName
      this.exam_modify.classesId = row.classes.classesId
      // alert(this.exam_modify.classesId)
    },
    modifyExamInfo () {
      let params = new URLSearchParams();
      params.append('examId', this.exam_modify.examId);
      params.append('examStartTime', this.exam_modify.examStartTime);
      params.append('examEndTime', this.exam_modify.examEndTime);
      params.append('examName', this.exam_modify.examName);
      params.append('classesId', this.exam_modify.classesId);
      params.append('examLanguage', this.exam_modify.examLanguage);
      // alert(this.exam_modify.classesId)
      // console.log(this.exam_modify);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/modifyExamInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('考试信息修改成功');
          this.edittableDataVisible_modify = false;
          this.getExamInfo();
          // this.exam_modify = new Object();
        } else if (res.data == false) {
          this.$message.error('考试信息修改失败');
          this.edittableDataVisible_modify = false;
          this.getExamInfo();
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getExamInfo();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    setClassesList () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/classes/queryClassesInfo',
        data: params
      })
        .then((res) => {
          this.classesList = res.data;
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    getTeacherInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/queryTeacherInfoById',
        data: params
      })
        .then((res) => {
          this.teacher = res.data;
          // console.log(this.teacher.teacherId);
          // console.log(this.teacher.teacherName);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    getExamInfo () {
      const that = this
      let params = new URLSearchParams();
      // params.append('teacherId', this.teacher.teacherId)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/teacherQueryExamInfo',
        data: params
      })
        .then((res) => {
          that.examList = res.data;
          for (var key in res.data) {
            that.exam_modify[key] = res.data[key];
          }
          // console.log(that.examList);
          // console.log(that.exam_modify);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');
        })
    },
    addExam (addExam) {
      var that = this;
      this.$refs[addExam].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('examName', this.exam_add.examName);
          params.append('examStartTime', this.exam_add.examStartTime);
          params.append('examEndTime', this.exam_add.examEndTime);
          params.append('teacherId', this.exam_add.teacherId);
          params.append('classesId', this.exam_add.classesId);
          params.append('examType', 'Pending');
          params.append('examLanguage', this.exam_add.examLanguage);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/exam/addExamInfo',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              // console.log(res.data);
              this.$message.error('考试添加失败');
              this.edittableDataVisible_add = false;
              this.getExamInfo();
            } else {
              this.$message.success('考试添加成功');
              this.edittableDataVisible_add = false;
              this.getExamInfo();
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该考试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteExam(row.examId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteExam (examId) {
      let params = new URLSearchParams();
      params.append('examId', examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/deleteExamInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('考试删除成功');
          this.getExamInfo();
        } else if (res.data == false) {
          this.$message.error('考试删除失败');
          this.getExamInfo();
        } else {
          this.$message.error('发生了错误');
          this.getExamInfo();
        }
      }).catch((res) => {
        console.log(res);
      })
    }
  }
}
</script>

<style>
</style>