<template>
  <div>
    <div>
      <div class="topBar_Teacher">
        <el-button
          class="addButton_Teacher"
          type="primary"
          size="small"
          @click.native.prevent="addDialogvisiable()"
          >添加教师</el-button
        >
      </div>
    </div>

    <el-table :data="teachers" style="width: 100%" stripe>
      <el-table-column prop="teacherAccount" label="账号" width="180">
      </el-table-column>
      <el-table-column prop="teacherName" label="姓名" width="180">
      </el-table-column>
      <el-table-column
        prop="teacherPassword"
        label="密码"
        width="180"
        :formatter="passwordFormat"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyTeacher(scope.row)"
            >修改</el-button
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
      title="修改教师信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form :model="edittableData" ref="edittableData">
        <el-form-item label="账号" prop="teacherAccount">
          <el-input
            v-model="edittableData.teacherAccount"
            :disabled="edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="edittableData.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="teacherPassword">
          <el-input v-model="edittableData.teacherPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyTeacherInfoDialog()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加教师"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
    >
      <el-form
        ref="addTeacher"
        :model="addTeacherData"
        :rules="addRules"
        class="addTeacherForm"
      >
        <el-form-item label="教师账号" prop="account">
          <el-input v-model="addTeacherData.account"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="addTeacherData.name"></el-input>
        </el-form-item>
        <el-form-item label="教师密码" prop="password">
          <el-input v-model="addTeacherData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTeacher('addTeacher')"
            >添加</el-button
          >
          <el-button @click="handleClose">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

  <script>
export default {
  data () {
    return {
      teachers: [],
      edittableData: {
        teacherId: '',
        teacherAccount: '',
        teacherName: '',
        teacherPassword: ''
      },
      addTeacherData: {
        account: '',
        name: '',
        password: ''
      },
      addRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 5, message: '账号长度为5', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        teacherPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        teacherName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
      },
      edittableDataRules: {},
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edit: true
    }
  },
  mounted: function () {
    this.getTeachers();//需要触发的函数
  },
  methods: {
    modifyTeacher (row) {
      // console.log(row.teacherId);
      this.edittableDataVisible_modify = true
      this.edittableData.teacherAccount = row.teacherAccount
      this.edittableData.teacherName = row.teacherName
      this.edittableData.teacherPassword = row.teacherPassword
      this.edittableData.teacherId = row.teacherId
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.addTeacherData = new Object()
      // this.$refs.addTeacherData.clearValidate();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    getTeachers () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/queryTeacherInfo',
      }).then(function (resp) {
        that.teachers = resp.data;
        // console.log(resp.data);
      })
    },
    modifyTeacherInfoDialog () {
      let params = new URLSearchParams();
      params.append('teacherId', this.edittableData.teacherId);
      // params.append('teacherAccount', this.edittableData.teacherAccount);
      params.append('teacherName', this.edittableData.teacherName);
      params.append('teacherPassword', this.edittableData.teacherPassword);
      // console.log(this.edittableData.teacherId);
      // console.log(this.edittableData.teacherName);
      // console.log(this.edittableData.teacherPassword);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/modifyTeacherInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('教师信息修改成功');
          this.edittableDataVisible_modify = false;
          this.getTeachers();
        } else if (res.data == false) {
          this.$message.error('教师信息修改失败');
          this.edittableDataVisible_modify = false;
          this.getTeachers();
        } else {
          this.$message.error('输入信息不合法，请检查输入的内容后后重试');
          this.edittableDataVisible_modify = false;
          this.getTeachers();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteTeacher (teacherid) {
      let params = new URLSearchParams();
      params.append('teacherId', teacherid);

      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/deleteTeacher',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('教师删除成功');
          this.getTeachers();
        } else if (res.data == false) {
          this.$message.error('教师删除失败');
          this.getTeachers();
        } else {
          this.$message.error('发生了错误');
          this.getTeachers();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteTeacher(row.teacherId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    addTeacher (addTeacher) {
      var that = this;
      this.$refs[addTeacher].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('teacherAccount', this.addTeacherData.account);
          params.append('teacherPassword', this.addTeacherData.password);
          params.append('teacherName', this.addTeacherData.name);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/teacher/addTeacher',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              // console.log(res.data);
              this.$message.error('教师添加失败');
              this.edittableDataVisible_add = false;
              this.getTeachers();
            } else {
              this.$message.success('教师添加成功');
              this.edittableDataVisible_add = false;
              this.addTeacherData = new Object()
              this.getTeachers();
            }
          })
        } else {
          this.$message.error('输入信息不合法，请检查输入的内容后后重试');
        }
      })
    },
    passwordFormat: function (row, column) {
      // var length = row.teacherPassword.length

      return "******";
    },
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
.addButton_Teacher {
  float: right;
  margin-right: 25px;
}
.topBar_Teacher {
  margin-top: 10px;
}
</style>