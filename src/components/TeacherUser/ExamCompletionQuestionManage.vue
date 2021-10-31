<template>
  <div>
    <div>
      <span class="span-label">章节</span>
      <el-select
        placeholder="请选择"
        size="mini"
        class="handle-select"
        style="margin-left: 1%"
        v-model="searchChapterChoice"
        @change="searchChapterChange()"
      >
        <el-option
          v-for="(item, index) in searchChapterOptions"
          :key="index"
          :label="item"
          :value="index"
        >
        </el-option>
      </el-select>
      <span class="span-label">第一知识点</span>
      <el-select
        placeholder="请选择"
        size="mini"
        class="handle-select"
        style="margin-left: 1%"
        v-model="searchFirstKnowledgeChoice"
        :disabled="searchFirstKnowledgePointVisiable"
        @change="searchFirstPointChange()"
      >
        <el-option
          v-for="(item, index) in searchFirstKnowledgePointOptions"
          :key="index"
          :label="item"
          :value="index"
        >
        </el-option>
      </el-select>
      <span class="span-label">第二知识点</span>
      <el-select
        placeholder="请选择"
        size="mini"
        class="handle-select"
        style="margin-left: 1%"
        v-model="searchSecondKnowledgeChoice"
        :disabled="searchSecondKnowledgePointVisiable"
      >
        <el-option
          v-for="item in searchSecondKnowledgePointOptions"
          :key="item.questionLabelId"
          :label="item.secondKnowledgePoint"
          :value="item.questionLabelId"
        >
        </el-option>
      </el-select>
      <span class="span-label">教师用户姓名</span>
      <el-select
        placeholder="请选择"
        size="mini"
        class="handle-select"
        style="margin-left: 1%"
        v-model="searchTeacherUserId"
      >
        <el-option
          v-for="item in teacherUserList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
        >
        </el-option>
      </el-select>

      <el-button
        type="primary"
        size="mini"
        @click="searchCompletionQuestionInfo()"
        style="margin-left: 2%"
        >查询</el-button
      >
    </div>
    <el-table
      :data="data"
      style="width: 100%; font-size: 12px"
      class="tableclass"
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
    >
      <el-table-column
        prop="completionQuestionId"
        label="填空题编号"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column prop="user.userName" label="创建人" align="center">
      </el-table-column>
      <el-table-column
        prop="completionQuestionDescription"
        label="填空题描述"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].chapter"
        label="填空题章节"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].firstKnowledgePoint"
        label="填空题一级知识点"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="填空题二级知识点"
        min-width="100%"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.questionLabels"
            :key="item.questionLabelId"
          >
            <p
              v-if="index == 3"
              align="center"
              style="margin-top:0px;margin-bottom:0px;display;"
            >
              ...
            </p>
            <p
              v-if="index < 3"
              align="center"
              style="margin-top:0px;margin-bottom:0px;display;"
            >
              {{ item.secondKnowledgePoint }}
            </p>
            <p
              v-if="index > 3"
              style="margin-top:0px;margin-bottom:0px;display;"
            ></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="completionQuestionDifficulty"
        label="填空题难度"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="isPrivate" label="是否私有">
        <template slot-scope="scope">
          <p v-if="scope.row.isPrivate === true" align="center">私有</p>
          <p v-if="scope.row.isPrivate === false" align="center">公有</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template>
          <el-button class="operate" type="text" icon="el-icon-plus">
          </el-button>
          <el-button
            class="operate"
            type="text"
            icon="el-icon-close"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="completionQuestionInfoList.length"
        @current-change="handleCurrent"
        v-if="completionQuestionInfoList.length != 0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
//答案输入的校验
const validatorAccountNumber = (rule, value, callback) => {
  if (value.length > 0) {
    for (var i = 0; i < value.length; i++) {
      if (value[i].completionQuestionAnswerContent == '') {
        new callback(new Error('请输入答案'))
      }
    }
    callback();
  } else {
    new callback(new Error('至少输入一个答案'))
  }
};
export default {
  data () {
    return {
      //登录用户信息
      user: {
        userId: '',
        userName: '',
      },
      //详情用填空题信息
      showCompletionQuestionInfo: {
        completionQuestionId: '',
        completionQuestionDifficulty: '',
        completionQuestionDescription: '',
        isPrivate: '',
        user: {
          userId: '',
          userName: '',
        },
        completionQuestionAnswers: [],
        questionLabels: [] //下拉框选择(多选)
      },
      //添加填空题信息
      aCompletionQuestionInfo: {
        completionQuestionId: '',
        completionQuestionDifficulty: '',
        completionQuestionDescription: '',
        isPrivate: '',
        user: {
          userId: '',
          userName: '',
        },
        completionQuestionAnswers: [],
        questionLabels: [] //下拉框选择(多选)
      },
      //修改填空题信息
      eCompletionQuestionInfo: {
        completionQuestionId: '',
        completionQuestionDifficulty: '',
        completionQuestionDescription: '',
        isPrivate: '',
        user: {
          userId: '',
          userName: '',
        },
        completionQuestionAnswers: [],
        questionLabels: [] //下拉框选择(多选)
      },
      //添加填空题提交规则
      addCompletionQuestionSubmitRules: {
        completionQuestionDescription: [
          { required: true, message: '请输入填空题内容', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ],
        completionQuestionAnswers: [
          { required: true, validator: validatorAccountNumber, trigger: 'blur' },
        ],
        questionLabels: [
          { required: true, message: '请选择标签', trigger: 'blur' },
        ],
        completionQuestionDifficulty: [
          { required: true, message: '请选择难度', trigger: 'blur' },

        ],
        isPrivate: [
          { required: true, message: '请选择是否私有', trigger: 'blur' },

        ],
      },
      //修改填空题提交规则
      editCompletionQuestionSubmitRules: {
        completionQuestionDescription: [
          { required: true, message: '请输入填空题内容', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ],
        completionQuestionAnswers: [
          { required: true, validator: validatorAccountNumber, trigger: 'blur' },
        ],
        questionLabels: [
          { required: true, message: '请选择标签', trigger: 'blur' },
        ],
        completionQuestionDifficulty: [
          { required: true, message: '请选择难度', trigger: 'blur' },

        ],
        isPrivate: [
          { required: true, message: '请选择是否私有', trigger: 'blur' },

        ],
      },
      //下拉选择是否公有或私有
      isPrivateOption: [
        {
          value: true,
          label: "私有",
        },
        {
          value: false,
          label: "公有",
        },
      ],
      //表示难度1-10
      difficultyOption: [
        {
          label: 1,
          value: 1,
        },
        {
          label: 2,
          value: 2,
        },
        {
          label: 3,
          value: 3,
        },
        {
          label: 4,
          value: 4,
        },
        {
          label: 5,
          value: 5,
        },
        {
          label: 6,
          value: 6,
        },
        {
          label: 7,
          value: 7,
        },
        {
          label: 8,
          value: 8,
        },
        {
          label: 9,
          value: 9,
        },
        {
          label: 10,
          value: 10,
        },
      ],
      //添加填空题弹出框显示
      addCompletionQuestionInfoVisible: false,
      addCompletionQuestionChapterChoice: '',//添加填空题时章节选择
      addCompletionQuestionFirstKnowledgeOption: [],//添加填空题第一知识点内容
      addCompletionQuestionFirstKnowledgeUse: true,//添加填空题时第一知识点能否使用
      addCompletionQuestionFirstKnowledgeChoice: '',//添加填空题时第一知识点选择
      addCompletionQuestionSecondKnowledgeOption: [],//添加填空题时第二知识点内容
      addCompletionQuestionSecondKnowledgeUse: true,//添加填空题时第二知识点能否使用
      //填空题详情弹出框显示
      showCompletionQuestionInfoVisible: false,
      //填空题修改弹出框显示
      editCompletionQuestionInfoVisible: false,
      editCompletionQuestionChapterChoice: '',//修改填空题时章节选择
      editCompletionQuestionFirstKnowledgeOption: [],//修改填空题第一知识点内容
      editCompletionQuestionFirstKnowledgeUse: false,//修改填空题时第一知识点能否使用
      editCompletionQuestionFirstKnowledgeChoice: '',//修改填空题时第一知识点选择
      editCompletionQuestionSecondKnowledgeOption: [],//修改填空题时第二知识点内容
      editCompletionQuestionSecondKnowledgeUse: false,//修改填空题时第二知识点能否使用
      //删除填空题弹出框显示
      deleteCompletionQuestionVisible: false,
      deleteCompletionQuestionId: '',//要删除的填空题编号
      teacherUserList: [],//教师用户列表
      searchChapterOptions: [],//查询用章节信息
      searchFirstKnowledgePointOptions: [],//查询用第一知识点
      searchSecondKnowledgePointOptions: [],//查询用第二知识点
      searchChapterChoice: '',//查询时的章节选择
      searchFirstKnowledgeChoice: '',//查询时的第一知识点选择
      searchSecondKnowledgeChoice: '',//查询时的第二知识点选择
      searchTeacherUserId: '',//查询时的教师用户名称选择
      searchFirstKnowledgePointVisiable: true,//查询时第一知识点下拉框能否使用 true为禁用
      searchSecondKnowledgePointVisiable: true,//查询时第二知识点下拉框能否使用 true为禁用
      completionQuestionInfoList: [],
      chapterList: [],//章节内容
      pageSize: 8,
      currentPage: 1,
    }
  },
  computed: {
    data () {
      return this.completionQuestionInfoList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  mounted: function () {
    //获取填空题信息
    this.getCompletionQuestionInfo();
    //获取章节信息
    this.getQuestionLabelInfo();
    //获取当前教师信息
    this.getCurrentTeacherUserInfo();
    //获取查询选择题标签信息
    this.getSearchQuestionLabelInfo();
    //获取全部教师信息 
    this.getTeacherUserInfo();
  },
  methods: {
    //查询填空题信息
    searchCompletionQuestionInfo () {
      let params = new URLSearchParams();
      if (this.searchTeacherUserId == '') {
        params.append("userId", 0);
      } else {
        params.append("userId", this.searchTeacherUserId);
      }
      if (this.searchChapterChoice == '' && this.searchChapterChoice != '0' || this.searchChapterChoice == ' ') {
        params.append("chapter", '');
      } else {
        params.append("chapter", this.searchChapterOptions[this.searchChapterChoice]);
      }
      if (this.searchFirstKnowledgeChoice == '' && this.searchFirstKnowledgeChoice != '0' || this.searchFirstKnowledgeChoice == ' ') {
        params.append("firstKnowledge", '');
      } else {
        params.append("firstKnowledge", this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice]);
      }
      if (this.searchSecondKnowledgeChoice == '' || this.searchSecondKnowledgeChoice == ' ') {
        params.append("questionLabelId", 0);
      } else {
        params.append("questionLabelId", this.searchSecondKnowledgeChoice);
      }
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/completionQuestion/queryCompletionQuestionInfoBySearchInfo',
        data: params
      })
        .then((res) => {
          this.currentPage = 1;
          this.completionQuestionInfoList = res.data;
        })
        .catch((err) => {
          this.$message.error('查询填空题信息错误');

        })
    },
    //获取全部教师信息 
    getTeacherUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/user/queryTeacherUserInfo',
        data: params
      })
        .then((res) => {
          var teacherUser = new Object;
          teacherUser.userId = '';
          teacherUser.userName = '';
          this.teacherUserList = res.data;
          this.teacherUserList.unshift(teacherUser);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    //查询时点击第一知识点
    searchFirstPointChange () {
      //查询时第二知识点可以使用  第二知识点选择为空
      if (this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice] != ' ') {
        this.searchSecondKnowledgePointVisiable = false;
        this.searchSecondKnowledgeChoice = '';
        this.getSearchSecondKnowledgePointInfo(this.searchChapterOptions[this.searchChapterChoice], this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice])
      } else {
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
      }
    },
    //查询章节变化时
    searchChapterChange () {
      //不为空时 查询时第一知识点可以使用 第二知识点禁用 第一知识点和第二知识点选择为空
      if (this.searchChapterOptions[this.searchChapterChoice] != ' ') {
        this.searchFirstKnowledgePointVisiable = false;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
        this.searchFirstKnowledgeChoice = '';
        //获取查询第一知识点的数据
        this.getSearchFirstKnowledgePointInfo(this.searchChapterOptions[this.searchChapterChoice]);
      } else {
        this.searchFirstKnowledgePointVisiable = true;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
        this.searchFirstKnowledgeChoice = '';
      }
    },
    //获取查询第一知识点信息
    getSearchFirstKnowledgePointInfo (chapter) {
      let params = new URLSearchParams(chapter);
      params.append("chapter", chapter);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          //给下拉框内容清空 并初始化
          this.searchFirstKnowledgePointOptions = [];
          this.searchFirstKnowledgePointOptions = res.data;
          if (this.searchFirstKnowledgePointOptions.length > 0) {
            var firstKnowledgePoint = new Object();
            firstKnowledgePoint = ' ';
            this.searchFirstKnowledgePointOptions.unshift(firstKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error('获取查询第一知识点错误');

        })
    },
    //获取查询第二知识点
    getSearchSecondKnowledgePointInfo (chapter, firstKnowledgePoint) {
      let params = new URLSearchParams();
      params.append("chapter", chapter);
      params.append("firstKnowledgePoint", firstKnowledgePoint);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          //给下拉框内容清空 并初始化
          this.searchSecondKnowledgePointOptions = [];
          this.searchSecondKnowledgePointOptions = res.data;
          if (this.searchSecondKnowledgePointOptions.length > 0) {
            var secondKnowledgePoint = new Object();
            secondKnowledgePoint.secondKnowledgePoint = ' ';
            secondKnowledgePoint.questionLabelId = 0
            this.searchSecondKnowledgePointOptions.unshift(secondKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error('获取查询第二知识点错误');

        })
    },
    //获取查询标签信息(获取chapter)
    getSearchQuestionLabelInfo () {
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
          //初始化
          this.searchChapterOptions = res.data;
          if (this.searchChapterOptions.length > 0) {
            var chapter = new Object();
            chapter = ' ';
            this.searchChapterOptions.unshift(chapter);
          }
        })
        .catch((err) => {
          this.$message.error('获取查询章节信息错误');
        })
    },
    //跳转页面调用
    handleCurrent (val) {
      this.currentPage = val;
    },
    //添加填空题信息添加填空
    addCompletionQuestionAddSpace () {
      var completionQuestionAnswer = new Object;
      completionQuestionAnswer.completionQuestionAnswerNumber = this.aCompletionQuestionInfo.completionQuestionAnswers.length + 1;
      completionQuestionAnswer.completionQuestionAnswerContent = '';
      this.aCompletionQuestionInfo.completionQuestionAnswers.push(completionQuestionAnswer)
    },
    //添加填空题信息删除填空
    addCompletionQuestionDeleteSpace () {
      this.aCompletionQuestionInfo.completionQuestionAnswers.splice(this.aCompletionQuestionInfo.completionQuestionAnswers.length - 1, 1);
    },
    //修改填空题信息添加填空
    editCompletionQuestionAddSpace () {
      var completionQuestionAnswer = new Object;
      completionQuestionAnswer.completionQuestionAnswerNumber = this.eCompletionQuestionInfo.completionQuestionAnswers.length + 1;
      completionQuestionAnswer.completionQuestionAnswerContent = '';
      this.eCompletionQuestionInfo.completionQuestionAnswers.push(completionQuestionAnswer)
    },
    //修改填空题信息删除填空
    editCompletionQuestionDeleteSpace () {
      this.eCompletionQuestionInfo.completionQuestionAnswers.splice(this.eCompletionQuestionInfo.completionQuestionAnswers.length - 1, 1);
    },
    //修改填空题信息
    editCompletionQuestionInfo (eCompletionQuestionInfo) {
      this.$refs[eCompletionQuestionInfo].validate((valid) => {  //开启校验
        if (valid) {   // 如果校验通过，请求接口，允许提交表单
          let params = new URLSearchParams();
          for (var i = 0; i < this.eCompletionQuestionInfo.questionLabels.length; i++) {
            var questionLabel = new Object();
            questionLabel.questionLabelId = this.eCompletionQuestionInfo.questionLabels[i];
            this.eCompletionQuestionInfo.questionLabels[i] = questionLabel;
          }
          this.eCompletionQuestionInfo.user = this.user;
          params.append("completionQuestionInfo", JSON.stringify(this.eCompletionQuestionInfo))
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/completionQuestion/modifyCompletionQuestionInfo',
            data: params
          })
            .then((res) => {
              if (res.data == true) {
                this.$message.success('修改填空题成功');
                this.editCompletionQuestionInfoVisible = false;
                this.getCompletionQuestionInfo();
              } else if (res.data == false) {
                this.$message.error('修改填空题失败');
              } else {
                this.$message.error('系统错误');
              }

            })
            .catch((err) => {
              this.$message.error('修改填空题错误');
            })
          //校验不通过
        } else {
          //界面会显示
        }
      });
    },
    //添加填空题信息
    addCompletionQuestionInfo (aCompletionQuestionInfo) {
      this.$refs[aCompletionQuestionInfo].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
        if (valid) {   // 如果校验通过，请求接口，允许提交表单
          let params = new URLSearchParams();
          for (var i = 0; i < this.aCompletionQuestionInfo.questionLabels.length; i++) {
            var questionLabel = new Object();
            questionLabel.questionLabelId = this.aCompletionQuestionInfo.questionLabels[i];
            this.aCompletionQuestionInfo.questionLabels[i] = questionLabel;
          }
          this.aCompletionQuestionInfo.user = this.user;
          params.append("completionQuestionInfo", JSON.stringify(this.aCompletionQuestionInfo))
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/completionQuestion/addCompletionQuestionInfo',
            data: params
          })
            .then((res) => {
              if (res.data == true) {
                this.$message.success('添加填空题成功');
                this.addCompletionQuestionInfoVisible = false;
                this.getCompletionQuestionInfo();
              } else if (res.data == false) {
                this.$message.error('添加填空题失败');
              } else {
                this.$message.error('系统错误');
              }
            })
            .catch((err) => {
              this.$message.error('添加填空题错误');
            })
          //校验不通过
        } else {
          //界面会显示
        }
      });
    },
    //删除填空题信息
    deleteCompletionQuestionInfo () {
      let params = new URLSearchParams();
      params.append("completionQuestionId", this.deleteCompletionQuestionId)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/completionQuestion/deleteCompletionQuestionInfoByCompletionQuestionId',
        data: params
      })
        .then((res) => {
          if (res.data == true) {
            this.$message.success('删除填空题成功');
            this.deleteCompletionQuestionVisible = false;
            this.getCompletionQuestionInfo();
          } else if (res.data == false) {
            this.$message.error('删除填空题失败');
          } else {
            this.$message.error('系统错误');
          }

        })
        .catch((err) => {
          this.$message.error('删除填空题错误');
        })
    },
    //获取填空题信息
    getCompletionQuestionInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/completionQuestion/queryCompletionQuestionInfoByUserId',
        data: params
      })
        .then((res) => {
          this.completionQuestionInfoList = res.data;
        })
        .catch((err) => {
          this.$message.error('查询填空题错误');

        })
    },
    //获取标签信息(获取chapter)
    getQuestionLabelInfo () {
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
          //初始化
          this.chapterList = res.data;
        })
        .catch((err) => {
          this.$message.error('获取章节信息错误');

        })
    },
    //添加填空题点击章节信息
    addCompletionQuestionChapterClick () {
      //解除第一知识点的禁用,赋值第一知识点选择为空 第二知识点为空并禁用
      this.addCompletionQuestionFirstKnowledgeUse = false;
      this.addCompletionQuestionFirstKnowledgeChoice = '';
      this.addCompletionQuestionSecondKnowledgeUse = true;
      this.aCompletionQuestionInfo.questionLabels = '';
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.addCompletionQuestionChapterChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.addCompletionQuestionFirstKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error('添加填空题获取第一知识点错误');
        })
    },
    //修改填空题点击章节信息
    editCompletionQuestionChapterClick () {
      //解除第一知识点的禁用,赋值第一知识点选择为空 第二知识点为空并禁用
      this.editCompletionQuestionFirstKnowledgeUse = false;
      this.editCompletionQuestionFirstKnowledgeChoice = '';
      this.editCompletionQuestionSecondKnowledgeUse = true;
      this.eCompletionQuestionInfo.questionLabels = '';
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.editCompletionQuestionChapterChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.editCompletionQuestionFirstKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error('添加填空题获取第一知识点错误');
        })
    },
    //添加填空题点击第一知识点
    addCompletionQuestionFirstPointClick () {
      //第二知识点的禁用解除 赋值第二知识点选择为空
      this.addCompletionQuestionSecondKnowledgeUse = false;
      this.aCompletionQuestionInfo.questionLabels = '';
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.addCompletionQuestionChapterChoice]);
      params.append("firstKnowledgePoint", this.addCompletionQuestionFirstKnowledgeOption[this.addCompletionQuestionFirstKnowledgeChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.addCompletionQuestionSecondKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error('添加填空题获取第二知识点错误');

        })
    },
    //修改填空题点击第一知识点
    editCompletionQuestionFirstPointClick () {
      //第二知识点的禁用解除 赋值第二知识点选择为空
      this.editCompletionQuestionSecondKnowledgeUse = false;
      this.eCompletionQuestionInfo.questionLabels = '';
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.editCompletionQuestionChapterChoice]);
      params.append("firstKnowledgePoint", this.editCompletionQuestionFirstKnowledgeOption[this.editCompletionQuestionFirstKnowledgeChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.editCompletionQuestionSecondKnowledgeOption = res.data;
          console.log(res.data)
        })
        .catch((err) => {
          this.$message.error('添加填空题获取第二知识点错误');
        })
    },
    //获取当前教师用户信息
    getCurrentTeacherUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/user/queryUserInfo',
        data: params
      })
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

        })
    },
    //控制详情弹出框显示
    handleShow (row) {
      //详情弹出框显示 赋值  不能直接赋值row row类似一个指针直接指向row了
      this.showCompletionQuestionInfoVisible = true;
      this.showCompletionQuestionInfo.completionQuestionDescription = row.completionQuestionDescription;
      this.showCompletionQuestionInfo.completionQuestionDifficulty = row.completionQuestionDifficulty;
      this.showCompletionQuestionInfo.completionQuestionAnswers = row.completionQuestionAnswers;
      this.showCompletionQuestionInfo.questionLabels = row.questionLabels;
      if (row.isPrivate == true) {
        this.showCompletionQuestionInfo.isPrivate = "私有";
      } else {
        this.showCompletionQuestionInfo.isPrivate = "公有";
      }
    },
    //控制修改弹出框显示
    handleEdit (row) {
      //先清空数据
      this.eCompletionQuestionInfo.questionLabels = [];
      //详情弹出框显示 赋值  不能直接赋值row row类似一个指针直接指向row了
      this.editCompletionQuestionInfoVisible = true;
      this.eCompletionQuestionInfo.completionQuestionId = row.completionQuestionId;
      this.eCompletionQuestionInfo.completionQuestionDescription = row.completionQuestionDescription;
      this.eCompletionQuestionInfo.completionQuestionDifficulty = row.completionQuestionDifficulty;
      this.eCompletionQuestionInfo.completionQuestionAnswers = row.completionQuestionAnswers;
      for (var i = 0; i < row.questionLabels.length; i++) {
        this.eCompletionQuestionInfo.questionLabels.push(row.questionLabels[i].questionLabelId)
      }
      this.eCompletionQuestionInfo.isPrivate = row.isPrivate;

      this.editCompletionQuestionChapterChoice = row.questionLabels[0].chapter;
      this.editCompletionQuestionFirstKnowledgeChoice = row.questionLabels[0].firstKnowledgePoint;
      for (var i = 0; i < this.chapterList.length; i++) {
        if (this.chapterList[i] == row.questionLabels[0].chapter) {
          this.editCompletionQuestionChapterChoice = i;
        }
      }
      this.editCompletionQuestionGetFirstKnowledgeInfo(row);
    },
    //删除弹出框显示
    handleDelete (row) {
      //先清空
      this.deleteCompletionQuestionId = '';
      //再赋值
      this.deleteCompletionQuestionVisible = true;
      this.deleteCompletionQuestionId = row.completionQuestionId;
    },
    //修改填空题信息时获取第一知识点
    editCompletionQuestionGetFirstKnowledgeInfo (row) {
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.editCompletionQuestionChapterChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.editCompletionQuestionFirstKnowledgeOption = res.data;
          for (var i = 0; i < this.editCompletionQuestionFirstKnowledgeOption.length; i++) {
            if (this.editCompletionQuestionFirstKnowledgeOption[i] == row.questionLabels[0].firstKnowledgePoint) {
              this.editCompletionQuestionFirstKnowledgeChoice = i;
            }
          }
          this.editCompletionQuestionGetSecondKnowledgeInfo();
        })
        .catch((err) => {
          this.$message.error('修改填空题获取第一知识点错误');
        })
    },
    //修改填空题信息时获取第二知识点
    editCompletionQuestionGetSecondKnowledgeInfo () {
      let params = new URLSearchParams();
      params.append("chapter", this.chapterList[this.editCompletionQuestionChapterChoice]);
      params.append("firstKnowledgePoint", this.editCompletionQuestionFirstKnowledgeOption[this.editCompletionQuestionFirstKnowledgeChoice]);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
        data: params
      })
        .then((res) => {
          this.editCompletionQuestionSecondKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error('修改填空题获取第二知识点错误');

        })
    }
  }
}
</script>

<style>
/* 详情弹出框的input 禁用样式 */
.e2 .el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
  /* 下拉框禁止*/
  resize: none;
  padding: 0;
}
/*详情内的答案的禁用样式 */
.e1 .el-input .el-input__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
}
/* 分页的css样式 */
.pagination {
  display: flex;
  justify-content: center;
}
</style>