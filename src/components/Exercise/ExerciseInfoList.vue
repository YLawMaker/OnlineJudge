<template>
  <el-card>
    <div>
      <div>
        <div class="topBar_Exercise">
          <el-input
            v-model="select_word"
            size="mini"
            class="search_input"
            placeholder="请输入习题标题"
            style="width: 200px"
            clearable
          ></el-input>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-document-add"
            round
            plain
            class="addButton_Exercise"
            @click="addDialogvisiable()"
            >添加习题</el-button
          >
        </div>
      </div>
      <el-table
        :data="data"
        style="width: 100%"
        :row-style="{ height: '20px' }"
        stripe
      >
        <el-table-column prop="exerciseId" label="编号" width="60">
        </el-table-column>
        <el-table-column
          prop="exerciseTitle"
          label="标题"
          width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: 'ExerciseAnswerList',
                query: {
                  exerciseIdfromManage: scope.row.exerciseId,
                  page: currentPage,
                  searchKey: select_word,
                },
              }"
            >
              {{ scope.row.exerciseTitle }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="exerciseCorrectTimes" label="AC次数" width="80">
        </el-table-column>
        <el-table-column prop="exerciseSubmitTimes" label="提交次数" width="80">
        </el-table-column>
        <el-table-column
          prop="exerciseDescription"
          label="问题描述"
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

        <el-table-column
          prop="exerciseSampleInput"
          label="样例输入"
          width="160"
        >
          <template slot-scope="scope">
            <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
              {{ scope.row.exerciseSampleInput }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="exerciseSampleOutput"
          label="样例输出"
          width="140"
        >
          <template slot-scope="scope">
            <div style="max-height: 50px; overflow-y: auto overflow-y:hidden">
              {{ scope.row.exerciseSampleOutput }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-info"
              round
              plain
              @click.native.prevent="exerciseInfoDialog(scope.row)"
              size="mini"
              >详情</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              round
              plain
              @click.native.prevent="modifyExercise(scope.row)"
              size="mini"
              :disabled="scope.row.isExam"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              round
              plain
              @click.native.prevent="deleteConfirm(scope.row)"
              size="mini"
              :disabled="scope.row.isExam"
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
      <!-- 修改 -->
      <el-dialog
        title="修改习题信息"
        :visible.sync="edittableDataVisible_modify"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="edittableData"
          :rules="edittableDataRules"
          ref="edittableData"
        >
          <el-form-item label="题目编号" prop="exerciseId">
            <el-input
              v-model="edittableData.exerciseId"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="exerciseTitle">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseTitle"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题描述" prop="exerciseDescription">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输入" prop="exerciseInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输出" prop="exerciseOutPut">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseOutPut"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输入" prop="exerciseSampleInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseSampleInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输出" prop="exerciseSampleOutput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="edittableData.exerciseSampleOutput"
            ></el-input>
          </el-form-item>
          <el-form-item label="习题标签" prop="questionLabel">
            <el-cascader
              :options="options"
              collapse-tags
              v-model="edittableData.questionLabel.questionLabelId"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            @click="modifyExerciseInfoDialog('edittableData')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 添加 -->
      <el-dialog
        title="添加习题"
        :visible.sync="edittableDataVisible_add"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="addExercise"
          :model="addexerciseData"
          :rules="addRules"
          class="addExerciseForm"
        >
          <el-form-item label="题目" prop="exerciseTitle">
            <el-input v-model="addexerciseData.exerciseTitle"></el-input>
          </el-form-item>
          <el-form-item label="题目描述" prop="exerciseDescription">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="addexerciseData.exerciseDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输入" prop="exerciseInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="addexerciseData.exerciseInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输出" prop="exerciseOutPut">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="addexerciseData.exerciseOutPut"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输入" prop="exerciseSampleInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="addexerciseData.exerciseSampleInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输出" prop="exerciseSampleOutput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="addexerciseData.exerciseSampleOutput"
            ></el-input>
          </el-form-item>
          <el-form-item label="习题标签" prop="questionLabelId">
            <el-cascader
              :options="options"
              collapse-tags
              v-model="addexerciseData.questionLabelId"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addExercise('addExercise')"
              >添加</el-button
            >
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog
        title="详情"
        :visible.sync="edittableDataVisible_info"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form :model="showexerciseData" ref="showexerciseData">
          <el-form-item label="题目编号" prop="exerciseId">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseId"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="exerciseTitle">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseTitle"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题描述" prop="exerciseDescription">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseDescription"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输入" prop="exerciseInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseInput"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="问题输出" prop="exerciseOutPut">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseOutPut"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输入" prop="exerciseSampleInput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseSampleInput"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例输出" prop="exerciseSampleOutput">
            <el-input
              type="textarea"
              :autosize="true"
              v-model="showexerciseData.exerciseSampleOutput"
              :disabled="edit"
            ></el-input>
          </el-form-item>
          <el-form-item prop="chapter" label="所属章节" size="mini">
            <el-input
              v-model="showexerciseData.questionLabel.chapter"
              placeholder="所属章节"
              type="textarea"
              :autosize="true"
              :disabled="edit"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="firstKnowledgePoint"
            label="第一知识点"
            size="mini"
          >
            <el-input
              v-model="showexerciseData.questionLabel.firstKnowledgePoint"
              placeholder="第一知识点"
              type="textarea"
              :autosize="true"
              :disabled="edit"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="secondKnowledgePoint"
            label="第二知识点"
            size="mini"
          >
            <el-input
              v-model="showexerciseData.questionLabel.secondKnowledgePoint"
              placeholder="第二知识点"
              type="textarea"
              :autosize="true"
              :disabled="edit"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
//习题标签的校验
const validatorQuestionLable = (rule, value, callback) => {
  if (value.questionLabelId[2] == undefined) {
    new callback(new Error('请输入标签'))
  } else {
    callback();
  }
};
export default {
  data () {
    return {
      exercise: [],
      exerciseBackup: [],
      select_word: "",
      searchData: [],
      edittableData: {
        exerciseId: '',
        exerciseTitle: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
        exerciseCorrectTimes: '',
        exerciseSubmitTimes: '',
        questionLabel: {
          questionLabelId: [],
          chapter: '',
          firstKnowledgePoint: '',
          secondKnowledgePoint: '',

        },
      },
      addexerciseData: {
        exerciseId: '',
        exerciseTitle: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
        exerciseCorrectTimes: '0',
        exerciseSubmitTimes: '0',
        questionLabelId: '',
      },
      showexerciseData: {
        exerciseId: '',
        exerciseTitle: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
        exerciseCorrectTimes: '',
        exerciseSubmitTimes: '',
        questionLabel: {
          questionLabelId: '',
          chapter: '',
          firstKnowledgePoint: '',
          secondKnowledgePoint: '',
        },
      },
      empty: {
        exerciseId: '',
        exerciseTitle: '',
        exerciseDescription: '',
        exerciseInput: '',
        exerciseOutPut: '',
        exerciseSampleInput: '',
        exerciseSampleOutput: '',
        exerciseCorrectTimes: '0',
        exerciseSubmitTimes: '0'
      },
      edittableDataRules: {
        exerciseTitle: [
          { required: true, message: '请输入题目标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1~50', trigger: 'blur' }
        ],
        exerciseDescription: [
          { required: true, message: '请输入题目描述', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseInput: [
          { required: true, message: '请输入问题输入', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseOutPut: [
          { required: true, message: '请输入问题输出', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseSampleInput: [
          { required: true, message: '请输入样例输入', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度为1~1000', trigger: 'blur' }
        ],
        exerciseSampleOutput: [
          { required: true, message: '请输入样例输出', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度为1~1000', trigger: 'blur' }
        ],
        questionLabel: [
          { required: true, validator: validatorQuestionLable, trigger: 'blur' },
        ]
      },
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edittableDataVisible_info: false,
      edit: true,
      currentPage: 1,
      pagesize: 8,
      addRules: {
        exerciseTitle: [
          { required: true, message: '请输入题目标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1~50', trigger: 'blur' }
        ],
        exerciseDescription: [
          { required: true, message: '请输入题目描述', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseInput: [
          { required: true, message: '请输入问题输入', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseOutPut: [
          { required: true, message: '请输入问题输出', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度为1~2000', trigger: 'blur' }
        ],
        exerciseSampleInput: [
          { required: true, message: '请输入样例输入', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度为1~1000', trigger: 'blur' }
        ],
        exerciseSampleOutput: [
          { required: true, message: '请输入样例输出', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度为1~1000', trigger: 'blur' }
        ],
        questionLabelId: [
          { required: true, message: '请选择标签', trigger: 'blur' },
        ]
      },
      h: {},
      //标签信息上传用
      labels: [],
      //后台读取的标签信息 放入下拉框中
      options: [],
      //标签选择用
      labelChoice: [],
    }
  },
  mounted: function () {
    if (this.$route.params.page == null) {
      this.getExercise(this.currentPage, '');//需要触发的函数
    } else {
      this.getExercise(parseInt(this.$route.params.page), this.$route.params.key);//需要触发的函数
    }
    this.geChapterInfo();
  },
  computed: {
    data () {
      return this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.exercise;
      } else {
        this.searchData = [];
        for (let item of this.exercise) {
          if (item.exerciseTitle.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
      }
    },
  },
  methods: {
    modifyExercise (row) {
      this.edittableDataVisible_modify = true
      this.edittableData.exerciseId = row.exerciseId
      this.edittableData.exerciseTitle = row.exerciseTitle
      this.edittableData.exerciseDescription = row.exerciseDescription
      this.edittableData.exerciseInput = row.exerciseInput
      this.edittableData.exerciseOutPut = row.exerciseOutPut
      this.edittableData.exerciseSampleInput = row.exerciseSampleInput
      this.edittableData.exerciseSampleOutput = row.exerciseSampleOutput
      this.edittableData.questionLabel.questionLabelId = []
      this.edittableData.questionLabel.questionLabelId.push(undefined)
      this.edittableData.questionLabel.questionLabelId.push(undefined)
      this.edittableData.questionLabel.questionLabelId.push(row.questionLabel.questionLabelId)
      // console.log(this.edittableData)
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.edittableDataVisible_info = false
      this.addexerciseData = new Object();
      // this.$refs.addExercise.clearValidate();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    exerciseInfoDialog (row) {
      this.edittableDataVisible_info = true
      this.showexerciseData.exerciseId = row.exerciseId
      this.showexerciseData.exerciseTitle = row.exerciseTitle
      this.showexerciseData.exerciseDescription = row.exerciseDescription
      this.showexerciseData.exerciseInput = row.exerciseInput
      this.showexerciseData.exerciseOutPut = row.exerciseOutPut
      this.showexerciseData.exerciseSampleInput = row.exerciseSampleInput
      this.showexerciseData.exerciseSampleOutput = row.exerciseSampleOutput
      this.showexerciseData.questionLabel = row.questionLabel
      // console.log(row)
    },
    getExercise (pageNum, key) {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exercise/queryExerciseInfo',
      }).then(function (resp) {
        // console.log(resp.data)
        that.exercise = resp.data;
        that.exerciseBackup = resp.data;
        that.searchData = resp.data;
        that.currentPage = pageNum;
        that.select_word = key
      })
    },
    modifyExerciseInfoDialog (edittableData) {
      this.$refs[edittableData].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('exerciseId', this.edittableData.exerciseId);
          params.append('exerciseTitle', this.edittableData.exerciseTitle);
          params.append('exerciseDescription', this.edittableData.exerciseDescription);
          params.append('exerciseInput', this.edittableData.exerciseInput);
          params.append('exerciseOutPut', this.edittableData.exerciseOutPut);
          params.append('exerciseSampleInput', this.edittableData.exerciseSampleInput);
          params.append('exerciseSampleOutput', this.edittableData.exerciseSampleOutput);
          params.append('questionLabelId', this.edittableData.questionLabel.questionLabelId[2]);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/exercise/modifyExerciseInfo',
            data: params
          }).then((res) => {
            if (res.data == true) {
              this.$message.success('习题信息修改成功');
              this.edittableDataVisible_modify = false;
              this.getExercise(this.currentPage, '');
            } else if (res.data == false) {
              this.$message.error('习题信息修改失败');
              this.edittableDataVisible_modify = false;
              this.getExercise(this.currentPage, '');
            } else {
              this.$message.error('发生了错误');
              this.edittableDataVisible_modify = false;
              this.getExercise(this.currentPage, '');
            }
          }).catch((res) => {
            console.log(res);
          })
        } else {
          this.$message.error('修改失败，请检查输入的内容后后重试');
        }
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该习题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteExercise(row.exerciseId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteExercise (exerciseId) {
      let params = new URLSearchParams();
      params.append('exerciseId', exerciseId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exercise/deleteExercise',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('习题删除成功');
          this.getExercise(this.currentPage, '');
        } else if (res.data == false) {
          this.$message.error('习题删除失败');
          this.getExercise(this.currentPage, '');
        } else {
          this.$message.error('发生了错误');
          this.getExercise(this.currentPage, '');
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    addExercise (addExercise) {
      var that = this;
      this.$refs[addExercise].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('exerciseTitle', this.addexerciseData.exerciseTitle);
          params.append('exerciseCorrectTimes', 0);
          params.append('exerciseSubmitTimes', 0);
          params.append('exerciseDescription', this.addexerciseData.exerciseDescription);
          params.append('exerciseInput', this.addexerciseData.exerciseInput);
          params.append('exerciseOutPut', this.addexerciseData.exerciseOutPut);
          params.append('exerciseSampleInput', this.addexerciseData.exerciseSampleInput);
          params.append('exerciseSampleOutput', this.addexerciseData.exerciseSampleOutput);
          params.append('questionLabelId', this.addexerciseData.questionLabelId[2])

          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/exercise/addExercise',
            data: params
          }).then((res) => {
            if (res.data == 0) {
              // console.log(res.data);
              this.$message.error('习题添加失败');
              this.edittableDataVisible_add = false;
              this.getExercise(this.currentPage, '');
            } else {
              this.$message.success('习题添加成功');
              this.edittableDataVisible_add = false;
              this.addexerciseData = this.empty
              this.getExercise(this.currentPage, '');
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    geChapterInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryChapterInfo',
        data: params
      })
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            var chapter = new Object;
            chapter.label = res.data[i];
            chapter.children = [];
            this.options.push(chapter);
          }
          for (var i = 0; i < this.options.length; i++) {
            this.getFirstKnowledgePointInfo(i);
          }
        })
        .catch((err) => {
          this.$message.error('失败1');
        })
    },
    getFirstKnowledgePointInfo (i) {
      let params = new URLSearchParams();
      params.append("chapter", this.options[i].label)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          for (var o = 0; o < res.data.length; o++) {
            var firstKnowledgePoint = new Object;
            firstKnowledgePoint.label = res.data[o];
            firstKnowledgePoint.children = [];
            this.options[i].children.push(firstKnowledgePoint);
          }
          //结束后再查询
          for (var o = 0; o < res.data.length; o++) {
            this.getSecondKnowledgePointInfo(i, o);
          }
        })
        .catch((err) => {
          this.$message.error('失败2');
        })
    },
    getSecondKnowledgePointInfo (chapterId, firstKnowledgePointId) {
      let params = new URLSearchParams();
      params.append("chapter", this.options[chapterId].label)
      params.append("firstKnowledgePoint", this.options[chapterId].children[firstKnowledgePointId].label)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          for (var o = 0; o < res.data.length; o++) {
            var secondKnowledgePoint = new Object;
            secondKnowledgePoint.label = res.data[o].secondKnowledgePoint;
            secondKnowledgePoint.value = res.data[o].questionLabelId;
            secondKnowledgePoint.important = res.data[o].important;
            this.options[chapterId].children[firstKnowledgePointId].children.push(secondKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error('失败3');
        })
    }

    // Search (index) {
    //   if (index == 1) {
    //     var search = this.search;
    //     this.exercise = this.exerciseBackup;
    //     if (this.search == '') {   //如果没有输入内容，不让往下执行
    //       this.getExercise();
    //       return
    //     }
    //     this.searchData = []
    //     this.exercise.forEach((item) => {
    //       if (item.exerciseTitle.indexOf(this.search) > -1) {
    //         this.searchData.push(item)
    //       }
    //     })
    //     this.exercise = this.searchData
    //   } else if (index == 2) {
    //     this.search = ''
    //     this.getExercise()
    //   }
    // }

  }
}
</script>
<style scoped>
.el-tooltip__popper {
  max-width: 50%;
  background: black !important;
  color: white !important;
  opacity: 100 !important; /*背景色透明度*/
  white-space: pre-line !important;
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
.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
  resize: none;
}
.block {
  text-align: center;
}
.addButton_Exercise {
  float: right;
  margin-right: 25px;
}
.topBar_Exercise {
  margin-top: 10px;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>