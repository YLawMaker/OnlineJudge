<template>
  <div>
    <div class="showTeacherName">
      <div :class="{ teacherNameDiv1: !edit, teacherNameDiv2: edit }">
        <label>教师姓名：</label>
        <span v-show="!edit">{{ teacher.teacherName }}</span>
        <el-input
          v-show="edit"
          v-model="teacher.teacherName"
          style="width: 300px"
          min
        ></el-input>
      </div>
      <span v-show="!edit" @click="edit = !edit" class="editButton">编辑</span>
      <div class="saveButton">
        <el-button
          type="primary"
          v-show="edit"
          @click="(edit = !edit), saveTeacherNmae()"
          >保存</el-button
        >
        <el-button type="primary" v-show="edit" @click="edit = !edit"
          >取消</el-button
        >
      </div>
    </div>
    <div class="showTeacherPassword">
      <label>教师密码：</label>
      <span>*******</span>
      <el-button
        style="margin-left: 20px"
        @click="modifyTeacherPaswordVisiable = !modifyTeacherPaswordVisiable"
        >修改密码</el-button
      >
    </div>

    <el-dialog
      title="修改教师密码"
      :visible.sync="modifyTeacherPaswordVisiable"
      width="30%"
      center
    >
      <el-form :model="password" label-width="100px" :rules="passwordRules">
        <el-form-item prop="teacherPassword" label="新密码" size="mini">
          <el-input
            v-model="password.teacherPassword"
            placeholder="新密码"
            type="password"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          size="mini"
          label="确认新密码"
          prop="teacherPasswordAgain"
        >
          <el-input
            placeholder="请确认新密码"
            v-model="password.teacherPasswordAgain"
            type="password"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyTeacherPaswordVisiable = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="teacherModifyPassword()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modifyTeacherPaswordVisiable: false,
      edit: false,
      password: {
        teacherPassword: '',
        teacherPasswordAgain: '',
      },

      teacher: {
        teacherId: '',
        teacherName: '',

      },
      passwordRules: {
        teacherPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        teacherPasswordAgain: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ]
      },

    }
  },
  mounted: function () {
    this.getTeacherInfo();
  },
  methods: {
    teacherModifyPassword () {
      alert(this.teacherPassword)
      alert(this.teacherPasswordagain)
    },
    saveTeacherNmae () {
      let params = new URLSearchParams();
      params.append('teacherName', this.teacher.teacherName);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/teacher/modifyTeacherInfo',
        data: params
      })
        .then((res) => {
          this.$message.success('修改成功');
        })
        .catch((err) => {
          // this.$message.error('系统错误请稍后再尝试');
          console.log(err);
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

        })
        .catch((err) => {
          //   this.$message.error('系统错误请稍后再尝试');
          console.log(err);
        })
    }
  }

}
</script>

<style>
.teacherNameDiv1 {
  float: left;
  width: 30%;
  height: 50%;
}
.teacherNameDiv2 {
  float: left;
  width: 45%;
}
.editButton {
  font-size: 14px;
  cursor: pointer;
  color: blue;
}
.saveButton {
  float: left;
  width: 50%;
}
.showTeacherName {
  width: 50%;
  height: 50px;
  margin-top: 5%;
  margin-left: 5%;
}
.showTeacherPassword {
  margin-top: 20px;
  padding: 0;
  margin-left: 5%;
}
</style>