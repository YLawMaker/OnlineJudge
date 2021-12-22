<template>
  <div>
    <div>
      <div class="topBar_Class">
        <el-input
          v-model="select_word"
          size="mini"
          class="search_input"
          placeholder="请输入章节关键字"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button
          class="addButton_Class"
          size="small"
          type="primary"
          @click.native.prevent="addDialogvisiable()"
          >新建标签</el-button
        >
      </div>
    </div>

    <el-table :data="data" style="width: 100%" stripe>
      <el-table-column prop="questionLabelId" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="chapter" label="章节" width="250">
      </el-table-column>
      <el-table-column
        prop="firstKnowledgePoint"
        label="一级知识点"
        width="250"
      >
      </el-table-column>
      <el-table-column
        prop="secondKnowledgePoint"
        label="二级知识点"
        width="250"
      >
      </el-table-column>
      <el-table-column prop="important" label="是否为重点" width="400">
        <template slot-scope="scope">
          <div v-if="scope.row.important == false">否</div>
          <div v-if="scope.row.important == true">是</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyQuestionLabel(scope.row)"
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
    <div class="block">
      <el-pagination
        @current-change="handleCurrent"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="this.searchData.length"
        v-if="this.searchData.length != 0"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="修改标签信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
    >
      <el-form
        :model="edittableData"
        :rules="edittableDataRules"
        ref="edittableData"
      >
        <el-form-item label="编号" prop="questionLabelId">
          <el-input
            v-model="edittableData.questionLabelId"
            :disabled="edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节" prop="chapter">
          <el-input v-model="edittableData.chapter"></el-input>
        </el-form-item>
        <el-form-item label="一级知识点" prop="firstKnowledgePoint">
          <el-input v-model="edittableData.firstKnowledgePoint"></el-input>
        </el-form-item>
        <el-form-item label="二级知识点" prop="secondKnowledgePoint">
          <el-input v-model="edittableData.secondKnowledgePoint"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyQuestionLabelInfoDialog()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加知识点"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addQuestionLabel"
        :model="addQuestionLabelData"
        :rules="addRules"
        class="addQuestionLabelForm"
      >
        <el-form-item label="章节" prop="chapter">
          <el-input v-model="addQuestionLabelData.chapter"></el-input>
        </el-form-item>
        <el-form-item label="一级知识点" prop="firstKnowledgePoint">
          <el-input
            v-model="addQuestionLabelData.firstKnowledgePoint"
          ></el-input>
        </el-form-item>
        <el-form-item label="二级知识点" prop="secondKnowledgePoint">
          <el-input
            v-model="addQuestionLabelData.secondKnowledgePoint"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio
            v-model="addQuestionLabelData.important"
            label="false"
            @change="getValue()"
            >非重点</el-radio
          >
          <el-radio
            v-model="addQuestionLabelData.important"
            label="true"
            @change="getValue()"
            >重点</el-radio
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('addQuestionLabel')"
            >添加</el-button
          >
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
      questionLabel: [],
      searchData: [],
      select_word: "",
      edittableData: {
        qustionLabelId: '',
        chapter: '',
        firstKnowledgePoint: '',
        secondKnowledgePoint: '',
        important: ''
      },
      addQuestionLabelData: {
        chapter: '',
        firstKnowledgePoint: '',
        secondKnowledgePoint: '',
        important: ''
      },
      addRules: {
        chapter: [
          { required: true, message: '请输入章节名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }],
        firstKnowledgePoint: [
          { required: true, message: '请输入一级标签名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }],
        secondKnowledgePoint: [
          { required: true, message: '请输入二级标签名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }]
      },
      edittableDataRules: {},
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edit: true,
      currentPage: 1,
      pagesize: 8,
    }
  },
  mounted: function () {
    this.getQuestionLabel();//需要触发的函数
  },
  computed: {
    data () {
      return this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.questionLabel;
      } else {
        this.searchData = [];
        for (let item of this.questionLabel) {
          if (item.chapter.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
        // if (this.searchData.length == 0) {
        //   for (let item of this.questionLabel) {
        //     if (item.firstKnowledgePoint.includes(this.select_word)) {
        //       this.currentPage = 1;
        //       this.searchData.push(item);
        //     }
        //   }
        // }
      }
    },
  },
  methods: {
    modifyQuestionLabel (row) {
      this.edittableDataVisible_modify = true
      this.edittableData.questionLabelId = row.questionLabelId
      this.edittableData.chapter = row.chapter
      this.edittableData.firstKnowledgePoint = row.firstKnowledgePoint
      this.edittableData.secondKnowledgePoint = row.secondKnowledgePoint
      this.edittableData.important = row.important
      // console.log(row.secondPoint);
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.addQuestionLabelData = new Object()
      // this.$refs.addClasses.clearValidate();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    getValue () {
      console.log(this.addQuestionLabelData.important);
    },
    getQuestionLabel () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryQuestionLabelInfo',
      }).then(function (resp) {
        that.questionLabel = resp.data;
        that.searchData = resp.data;
        // console.log(resp.data);
      }).catch((res) => {
        console.log(res);
      })
    },
    modifyQuestionLabelInfoDialog () {
      let params = new URLSearchParams();
      params.append('questionLabelId', this.edittableData.questionLabelId);
      params.append('chapter', this.edittableData.chapter);
      params.append('firstKnowledgePoint', this.edittableData.firstKnowledgePoint);
      params.append('secondKnowledgePoint', this.edittableData.secondKnowledgePoint);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/modifyQuestionLabelInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('标签修改成功');
          this.edittableDataVisible_modify = false;
          this.getQuestionLabel();
        } else if (res.data == false) {
          this.$message.error('标签修改失败');
          this.edittableDataVisible_modify = false;
          this.getQuestionLabel();
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getQuestionLabel();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteClass(row.questionLabelId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteClass (questionLabelId) {
      let params = new URLSearchParams();
      params.append('questionLabelId', questionLabelId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/deleteQuestionLabelInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('标签删除成功');
          this.getQuestionLabel();
        } else if (res.data == false) {
          this.$message.error('标签删除失败');
          this.getQuestionLabel();
        } else {
          this.$message.error('发生了错误');
          this.getQuestionLabel();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    add (addQuestionLabel) {
      var that = this;
      this.$refs[addQuestionLabel].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('chapter', this.addQuestionLabelData.chapter);
          params.append('firstKnowledgePoint', this.addQuestionLabelData.firstKnowledgePoint);
          params.append('secondKnowledgePoint', this.addQuestionLabelData.secondKnowledgePoint);
          params.append('important', this.addQuestionLabelData.important);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/questionLabel/addQuestionLabelInfo',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              console.log(res.data);
              this.$message.error('标签添加失败');
              this.edittableDataVisible_add = false;
              this.getQuestionLabel();
            } else {
              this.$message.success('标签添加成功');
              this.edittableDataVisible_add = false;
              this.getQuestionLabel();
              this.addQuestionLabelData = new Object()
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
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>