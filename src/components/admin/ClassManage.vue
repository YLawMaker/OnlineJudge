<template>
  <div>
    <div>
      <div class="topBar_Class">
        <el-button
          class="addButton_Class"
          size="small"
          type="primary"
          @click.native.prevent="addDialogvisiable()"
          >创建班级</el-button
        >
      </div>
    </div>

    <el-table :data="classes" style="width: 100%" stripe>
      <el-table-column prop="classesId" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="classesName" label="班级名称" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyClasses(scope.row)"
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
      title="修改班级信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form
        :model="edittableData"
        :rules="edittableDataRules"
        ref="edittableData"
      >
        <el-form-item label="班级编号" prop="classesId">
          <el-input
            v-model="edittableData.classesId"
            :disabled="edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="classesName">
          <el-input v-model="edittableData.classesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyClassesInfoDialog()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加班级"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
    >
      <el-form
        ref="addClasses"
        :model="addClassData"
        :rules="addRules"
        class="addClassesForm"
      >
        <el-form-item label="班级名称" prop="classesName">
          <el-input v-model="addClassData.classesName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('addClasses')">添加</el-button>
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
      classes: [],
      edittableData: {
        classesId: '',
        classesName: ''
      },
      addClassData: {
        classesName: '',
      },
      addRules: {
        classesName: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度为1~16', trigger: 'blur' }]
      },
      edittableDataRules: {},
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edit: true
    }
  },
  mounted: function () {
    this.getClasses();//需要触发的函数
  },
  methods: {
    modifyClasses (row) {
      this.edittableDataVisible_modify = true
      this.edittableData.classesId = row.classesId
      this.edittableData.classesName = row.classesName
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.addClassData = new Object()
      this.$refs.addClasses.clearValidate();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    getClasses () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/classes/queryClassesInfo',
      }).then(function (resp) {
        that.classes = resp.data;
        // console.log(resp.data);
      }).catch((res) => {
        console.log(res);
      })
    },
    modifyClassesInfoDialog () {
      let params = new URLSearchParams();
      params.append('classesId', this.edittableData.classesId);
      params.append('classesName', this.edittableData.classesName);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/classes/modifyClassesInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('班级信息修改成功');
          this.edittableDataVisible_modify = false;
          this.getClasses();
        } else if (res.data == false) {
          this.$message.error('教师信息修改失败');
          this.edittableDataVisible_modify = false;
          this.getClasses();
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getClasses();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteClass(row.classesId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteClass (classesid) {
      // console.log(classesid);
      let params = new URLSearchParams();
      params.append('classesId', classesid);

      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/classes/deleteClasses',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('班级删除成功');
          this.getClasses();
        } else if (res.data == false) {
          this.$message.error('班级删除失败');
          this.getClasses();
        } else {
          this.$message.error('发生了错误');
          this.getClasses();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    add (addClasses) {
      var that = this;
      this.$refs[addClasses].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('classesName', this.addClassData.classesName);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/classes/addClasses',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              console.log(res.data);
              this.$message.error('班级添加失败');
              this.edittableDataVisible_add = false;
              this.getClasses();
            } else {
              this.$message.success('班级添加成功');
              this.edittableDataVisible_add = false;
              this.getClasses();
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
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
.addButton_Class {
  float: right;
  margin-right: 25px;
}
.topBar_Class {
  margin-top: 10px;
}
</style>