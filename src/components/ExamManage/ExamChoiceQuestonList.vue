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
        @change="searchChapter()"
      >
        <el-option
          v-for="item in searchChapterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
        @change="searchFirstPoint()"
      >
        <el-option
          v-for="item in searchFirstKnowledgePointOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
        @click="searchChoiceQuestionInfo()"
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
        prop="choiceQuestionId"
        label="选择题编号"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column prop="user.userName" label="创建人" align="center">
      </el-table-column>
      <el-table-column
        prop="choiceQuestionDescription"
        label="选择题描述"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].chapter"
        label="选择题章节"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].firstKnowledgePoint"
        label="选择题一级知识点"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="选择题二级知识点"
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
        prop="choiceQuestionDifficulty"
        label="选择题难度"
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
        <template slot-scope="scope">
          <div
            v-for="(item, i) in choiceQuestionStatus"
            :key="item.choiceQuestionId"
          >
            <el-button
              class="operate"
              type="text"
              icon="el-icon-plus"
              v-if="
                item.status == 0 &&
                item.choiceQuestionId == scope.row.choiceQuestionId
              "
              @click="cilckAddButtonEvent(scope.row.choiceQuestionId, i)"
            ></el-button>
            <el-button
              class="operate"
              type="text"
              icon="el-icon-close"
              v-if="
                item.status == 1 &&
                item.choiceQuestionId == scope.row.choiceQuestionId
              "
              @click="cilckDeleteButtonEvent(scope.row.choiceQuestionId, i)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="choiceQuestionList.length"
        @current-change="handleCurrent"
        v-if="choiceQuestionList.length != 0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      choiceQuestionInfo: {
        choiceQuestionId: '',
        choiceQuestionDescription: '',
        choiceQuestionStemA: '',
        choiceQuestionStemB: '',
        choiceQuestionStemC: '',
        choiceQuestionStemD: '',
        choiceQuestionCorrectOption: '',
        choiceQuestionDifficulty: '',
        isPrivate: '',
        user: {
          userId: '',
          userName: '',
        },

        questionLabels: [], //下拉框选择(多选)
      },
      teacherUserList: [],//教师用户列表
      choiceQuestionList: [],//选择题列表
      chapterList: [],//chapter数组
      chapterChoice: '',//下拉框选择
      chapterOptions: [],//参数为label value
      searchChapterOptions: [],//查询用章节信息
      firstKnowledgePointList: [],//firstKnowledgePoint数组
      firstKnowledgePointChoice: '',//下拉框选择
      firstKnowledgePointOptions: [],//参数为label value
      searchFirstKnowledgePointOptions: [],//查询用第一知识点
      secondKnowledgePointList: [],//secondKnowledgePoint数组
      secondKnowledgePointOptions: [],//参数为label value
      searchSecondKnowledgePointOptions: [],//查询用第二知识点
      firstKnowledgePointVisiable: true,//第一知识点下拉框能否使用 true为禁用
      secondKnowledgePointVisiable: true,//第二知识点下拉框能否使用 true为禁用
      editSecondKnowledgePointVisiable: false,//修改选择题信息时下拉框能否使用 true为禁用
      searchChapterChoice: '',//查询时的章节选择
      searchFirstKnowledgeChoice: '',//查询时的第一知识点选择
      searchSecondKnowledgeChoice: '',//查询时的第二知识点选择
      searchTeacherUserId: '',//查询时的教师用户名称选择
      searchFirstKnowledgePointVisiable: true,//查询时第一知识点下拉框能否使用 true为禁用
      searchSecondKnowledgePointVisiable: true,//查询时第二知识点下拉框能否使用 true为禁用
      examId: 0,
      currentPage: 1,
      pageSize: 8,
      choiceQuestionInExam: [],
      choiceQuestionStatus: []
    }
  },
  created: function () {

  },
  mounted: function () {
    this.examId = this.$route.query.examIdfromManage;
    //获取选择题标签信息
    this.getQuestionLabelInfo();
    //获取查询选择题标签信息
    this.getSearchQuestionLabelInfo();
    //获取选择题信息
    this.getChoiceQuestionInfo();
    //获取当前教师用户信息
    this.getCurrentTeacherUserInfo();
    //获取全部教师信息
    this.getTeacherUserInfo();

  },
  computed: {
    data () {
      return this.choiceQuestionList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    handleCurrent (val) {
      this.currentPage = val;
    },
    cilckAddButtonEvent (choiceQuestionId, i) {
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      params.append('questionId', choiceQuestionId);
      params.append('examQuestionType', "choiceQuestion");
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/addExamQuestion',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.choiceQuestionStatus[i].status = 1
        } else if (res.data == false) {
          this.$message.error('题目添加失败');
        } else {
          this.$message.error('系统发生了错误');
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    cilckDeleteButtonEvent (choiceQuestionId, i) {
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      params.append('questionId', choiceQuestionId);
      params.append('examQuestionType', "choiceQuestion");
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/deleteExamQuestion',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.choiceQuestionStatus[i].status = 0
        } else if (res.data == false) {
          this.$message.error('题目删除失败');
        } else {
          this.$message.error('系统发生了错误');
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    //获取选择题信息
    getChoiceQuestionInfo () {
      const that = this
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/choiceQuestion/queryChoiceQuestionInfo',
        data: params
      }).then(function (resp) {
        that.choiceQuestionList = resp.data
        //获取考试已添加的选择题
        that.getExamQuestionChoiceByExamId(that.examId);
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
          for (var i = 0; i < this.chapterList.length; i++) {
            var chapter = new Object();
            chapter.label = this.chapterList[i];
            chapter.value = i;
            this.chapterOptions.push(chapter);
          }

        })
        .catch((err) => {
          this.$message.error('获取章节信息错误');

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
          this.chapterList = res.data;
          if (this.chapterList.length > 0) {
            var chapter = new Object();
            chapter = ' ';
            this.chapterList.unshift(chapter);
          }
          for (var i = 0; i < this.chapterList.length; i++) {
            var chapter = new Object();
            chapter.label = this.chapterList[i];
            chapter.value = i;
            this.searchChapterOptions.push(chapter);
          }

        })
        .catch((err) => {
          this.$message.error('获取章节信息错误');
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
          this.choiceQuestionInfo.user.userId = res.data.userId;
          this.choiceQuestionInfo.user.userName = res.data.userName;
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

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
    //查询时点击章节信息
    searchChapter () {
      //不为空时 查询时第一知识点可以使用 第二知识点禁用 第一知识点和第二知识点选择为空
      if (this.searchChapterOptions[this.searchChapterChoice].label != ' ') {
        this.searchFirstKnowledgePointVisiable = false;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
        this.searchFirstKnowledgeChoice = '';
        //获取第一知识点的数据写在下拉框数据里
        this.getSearchFirstKnowledgePointInfo(this.searchChapterOptions[this.searchChapterChoice].label);
      } else {
        this.searchFirstKnowledgePointVisiable = true;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
        this.searchFirstKnowledgeChoice = '';
      }
    },
    //查询时点击第一知识点
    searchFirstPoint () {
      //查询时第二知识点可以使用  第二知识点选择为空
      if (this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice].label != ' ') {
        this.searchSecondKnowledgePointVisiable = false;
        this.searchSecondKnowledgeChoice = '';
        this.getSearchSecondKnowledgePointInfo(this.searchChapterOptions[this.searchChapterChoice].label, this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice].label)
      } else {
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = '';
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
          this.firstKnowledgePointList = res.data;
          if (this.firstKnowledgePointList.length > 0) {
            var firstKnowledgePoint = new Object();
            firstKnowledgePoint = ' ';
            this.firstKnowledgePointList.unshift(firstKnowledgePoint);
          }
          for (var i = 0; i < this.firstKnowledgePointList.length; i++) {
            var firstKnowledgePoint = new Object();
            firstKnowledgePoint.label = this.firstKnowledgePointList[i];
            firstKnowledgePoint.value = i;
            this.searchFirstKnowledgePointOptions.push(firstKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error('获取第一知识点错误');

        })
    },
    //获取第二知识点
    getSecondKnowledgePointInfo (chapter, firstKnowledgePoint) {
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
          this.secondKnowledgePointOptions = [];
          this.secondKnowledgePointList = res.data;

          //重新赋值
          for (var i = 0; i < this.secondKnowledgePointList.length; i++) {
            var secondKnowledgePoint = new Object();
            secondKnowledgePoint.label = this.secondKnowledgePointList[i].secondKnowledgePoint;
            secondKnowledgePoint.value = this.secondKnowledgePointList[i].questionLabelId;
            this.secondKnowledgePointOptions.push(secondKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error('获取第二知识点错误');

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
          this.secondKnowledgePointList = res.data;
          if (this.secondKnowledgePointList.length > 0) {
            var secondKnowledgePoint = new Object();
            secondKnowledgePoint.secondKnowledgePoint = ' ';
            secondKnowledgePoint.questionLabelId = 0
            this.secondKnowledgePointList.unshift(secondKnowledgePoint);
          }
          //重新赋值
          for (var i = 0; i < this.secondKnowledgePointList.length; i++) {
            var secondKnowledgePoint = new Object();
            secondKnowledgePoint.label = this.secondKnowledgePointList[i].secondKnowledgePoint;
            secondKnowledgePoint.value = this.secondKnowledgePointList[i].questionLabelId;
            this.searchSecondKnowledgePointOptions.push(secondKnowledgePoint);
          }

        })
        .catch((err) => {
          this.$message.error('获取第二知识点错误');

        })
    },
    //点击查询选择题信息  这里他把=0也识别为''会用true所以加上 userId为0也会传0
    searchChoiceQuestionInfo () {
      let params = new URLSearchParams();
      if (this.searchTeacherUserId == '') {
        params.append("userId", 0);
      } else {
        params.append("userId", this.searchTeacherUserId);
      }
      if (this.searchChapterChoice == '' && this.searchChapterChoice != '0' || this.searchChapterChoice == ' ') {
        params.append("chapter", '');
      } else {
        params.append("chapter", this.searchChapterOptions[this.searchChapterChoice].label);
      }
      if (this.searchFirstKnowledgeChoice == '' && this.searchFirstKnowledgeChoice != '0' || this.searchFirstKnowledgeChoice == ' ') {
        params.append("firstKnowledge", '');
      } else {
        params.append("firstKnowledge", this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice].label);
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
        url: '/choiceQuestion/queryChoiceQuestionInfoBySearchInfo',
        data: params
      })
        .then((res) => {
          this.currentPage = 1;
          this.choiceQuestionList = res.data;
        })
        .catch((err) => {
          this.$message.error('查询信息错误');

        })
    },
    //获取当前考试添加过的选择题
    getExamQuestionChoiceByExamId (examId) {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamQuestionChoiceByExamId',
        data: params
      }).then(function (resp) {
        that.choiceQuestionInExam = resp.data;

        //可以优化，时间复杂度过高
        for (var i = 0; i < that.choiceQuestionList.length; i++) {
          var questionstatus = {};
          questionstatus.choiceQuestionId = that.choiceQuestionList[i].choiceQuestionId;
          questionstatus.status = 0;
          that.choiceQuestionStatus.push(questionstatus)
        }

        for (var i = 0; i < that.choiceQuestionList.length; i++) {
          for (var j = 0; j < that.choiceQuestionInExam.length; j++) {
            // console.log(that.choiceQuestionList[i].choiceQuestionId + "  " + that.choiceQuestionInExam[j].choiceQuestionId);
            if (that.choiceQuestionList[i].choiceQuestionId == that.choiceQuestionInExam[j].choiceQuestion.choiceQuestionId) {
              that.choiceQuestionStatus[i].status = 1;
            }
          }
        }

      })
    }
  }
}
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
}
</style>