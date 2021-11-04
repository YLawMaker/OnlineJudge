<template>
  <div>
    <div>
      <div class="topBar_Teacher">
        <el-input
          v-model="select_word"
          size="mini"
          class="search_input"
          placeholder="请输入考试名称"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button
          class="addButton_Exam"
          type="primary"
          size="small"
          @click.native.prevent="addDialogvisiable()"
          >添加考试</el-button
        >
      </div>
    </div>
    <el-table :data="data" style="width: 100%" stripe>
      <el-table-column prop="examName" label="考试名称" width="180">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: 'ExamInfoHeader',
              query: {
                examIdfromManage: scope.row.examId,
                examManageCurrentPage: currentPage,
              },
            }"
          >
            {{ scope.row.examName }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="examStartTime" label="开始时间" width="180">
      </el-table-column>
      <el-table-column prop="examEndTime" label="结束时间" width="180">
      </el-table-column>
      <el-table-column prop="examStatus" label="考试状态" width="180">
      </el-table-column>
      <el-table-column prop="examLanguage" label="代码语言" width="80">
      </el-table-column>
      <el-table-column prop="group.groupName" label="考试分组" width="80">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyExamDialog(scope.row)"
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
      title="添加考试"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="850px"
    >
      <el-form
        ref="addExam"
        :model="exam_add"
        :rules="addRules"
        class="addExamForm"
        label-width="120px"
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
        <el-form-item label="考试分组" prop="groupId">
          <el-select v-model="exam_add.groupId" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8"
            ><el-form-item
              label="选择题分值(每题)"
              prop="examChoiceQuestionScore"
            >
              <el-input
                v-model="exam_add.examChoiceQuestionScore"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item
              label="填空题分值(每题)"
              prop="examCompletionQuestionScore"
            >
              <el-input
                v-model="exam_add.examCompletionQuestionScore"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编程题分值(每题)" prop="examProgrammingScore">
              <el-input v-model="exam_add.examProgrammingScore"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="addDialogButton">
          <el-button type="primary" @click="addExam('addExam')">添加</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改考试信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
      :close-on-click-modal="false"
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
        <el-form-item label="考试分组" prop="groupId">
          <el-select v-model="exam_modify.groupId" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8"
            ><el-form-item
              label="选择题分值(每题)"
              prop="examChoiceQuestionScore"
            >
              <el-input
                v-model="exam_modify.examChoiceQuestionScore"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item
              label="填空题分值(每题)"
              prop="examCompletionQuestionScore"
            >
              <el-input
                v-model="exam_modify.examCompletionQuestionScore"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编程题分值(每题)" prop="examProgrammingScore">
              <el-input v-model="exam_modify.examProgrammingScore"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

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
        examStatus: '',
        examLanguage: '',
        groupId: '',
        examChoiceQuestionScore: 0,
        examCompletionQuestionScore: 0,
        examProgrammingScore: 0
      },
      exam_modify: {
        examId: '',
        examName: '',
        examStartTime: '',
        examEndTime: '',
        teacherId: '',
        examStatus: '',
        examLanguage: '',
        groupId: '',
        examChoiceQuestionScore: 0,
        examCompletionQuestionScore: 0,
        examProgrammingScore: 0
      },
      groupList: [],
      language: [{ value: 'C', label: 'C' }, { value: 'C++', label: 'C++' }, { value: 'Java', label: 'Java' }],
      addExamData: {},
      addRules: {},
      examList: [],
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      currentPage: 1,
      pagesize: 7,
      select_word: "",
      searchData: []
    }
  },
  created: function () {

    // console.log("created");
  },
  mounted: function () {
    this.$nextTick(() => {
      if (this.$route.params.currentPage == null) {
        this.currentPage = 1;
      } else {
        this.currentPage = this.$route.params.currentPage;
      }
      // console.log(typeof (this.currentPage));
      this.getUserInfo();
      this.getGroupInfo();
    });

    // console.log("mounted");
  },
  computed: {
    data () {
      return this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.examList;
      } else {
        this.searchData = [];
        for (let item of this.examList) {
          if (item.examName.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
      }
    },
  },
  methods: {
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
      this.exam_add = new Object();
    },
    modifyExamDialog (row) {
      // console.log(row);
      this.edittableDataVisible_modify = true
      this.exam_modify.examId = row.examId
      this.exam_modify.examName = row.examName
      this.exam_modify.examStartTime = row.examStartTime
      this.exam_modify.examEndTime = row.examEndTime
      this.exam_modify.examLanguage = row.examLanguage
      this.exam_modify.groupId = row.group.groupId
      this.exam_modify.examChoiceQuestionScore = row.examChoiceQuestionScore
      this.exam_modify.examCompletionQuestionScore = row.examCompletionQuestionScore
      this.exam_modify.examProgrammingScore = row.examProgrammingScore
    },
    modifyExamInfo () {
      let params = new URLSearchParams();

      //获取当前的时间,格式为YYYY-MM-DD HH:MM
      const date = new Date()
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      // console.log(date.toJSON().substr(0, 16).replace(/[T]/g, ' '));


      // 将日期格式处理成字符串，方便比较
      var status = ' ';
      var currentDate = date.toJSON().substr(0, 16).replace(/[T]/g, ' ')
      var startTime = this.exam_modify.examStartTime;
      var endTime = this.exam_modify.examEndTime;
      var temp1, temp2
      temp1 = currentDate.substring(0, 10).split('-')
      temp2 = currentDate.substring(11, 16).split(':')
      currentDate = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]
      temp1 = startTime.substring(0, 10).split('-')
      temp2 = startTime.substring(11, 16).split(':')
      startTime = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]
      temp1 = endTime.substring(0, 10).split('-')
      temp2 = endTime.substring(11, 16).split(':')
      endTime = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]

      if (currentDate >= startTime && currentDate <= endTime) {
        status = "Running"
      } else if (currentDate < startTime) {
        status = "Pending"
      } else {
        status = "Ended"
      }

      params.append('examId', this.exam_modify.examId);
      params.append('examStartTime', this.exam_modify.examStartTime);
      params.append('examEndTime', this.exam_modify.examEndTime);
      params.append('examName', this.exam_modify.examName);
      params.append('examLanguage', this.exam_modify.examLanguage);
      params.append('groupId', this.exam_modify.groupId);
      params.append('examStatus', status);
      params.append('examChoiceQuestionScore', this.exam_modify.examChoiceQuestionScore);
      params.append('examCompletionQuestionScore', this.exam_modify.examCompletionQuestionScore);
      params.append('examProgrammingScore', this.exam_modify.examProgrammingScore);
      // console.log(this.exam_modify.examStartTime);

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
    getGroupInfo () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/group/queryGroupInfo',
      }).then(function (resp) {
        // console.log(resp.data);
        that.groupList = resp.data;
        // console.log(that.groupList);
      })
    },
    // 获取教师用户信息
    getUserInfo () {
      const that = this
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
          // console.log(res.data);
          that.teacher = res.data;
          this.getExamInfo();
          // console.log(that.teacher);
        })
        .catch((err) => {
          // this.$message.error('系统错误请稍后再尝试');
          this.$router.push({ path: '/managerLogin' })
        })
    },
    getExamInfo () {
      const that = this
      let params = new URLSearchParams();
      // console.log("教师ID:" + that.teacher.userId);
      // console.log("教师姓名:" + that.teacher.userName);
      params.append('userId', this.teacher.teacherId)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exam/userQueryExamInfo',
        data: params
      })
        .then((res) => {
          // console.log(res.data);
          that.examList = res.data;
          that.searchData = res.data;
          for (var key in res.data) {
            that.exam_modify[key] = res.data[key];
          }
        })
        .catch((err) => {
          // this.$message.error('系统错误请稍后再尝试');
          console.log(err);
        })
    },
    addExam (addExam) {
      var that = this;
      this.$refs[addExam].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();

          //获取当前的时间,格式为YYYY-MM-DD HH:MM
          const date = new Date()
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          // console.log(date.toJSON().substr(0, 16).replace(/[T]/g, ' '));


          // 将日期格式处理成字符串，方便比较
          var status = ' ';
          var currentDate = date.toJSON().substr(0, 16).replace(/[T]/g, ' ')
          var startTime = this.exam_add.examStartTime;
          var endTime = this.exam_add.examEndTime;
          var temp1, temp2
          temp1 = currentDate.substring(0, 10).split('-')
          temp2 = currentDate.substring(11, 16).split(':')
          currentDate = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]
          temp1 = startTime.substring(0, 10).split('-')
          temp2 = startTime.substring(11, 16).split(':')
          startTime = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]
          temp1 = endTime.substring(0, 10).split('-')
          temp2 = endTime.substring(11, 16).split(':')
          endTime = temp1[0] + temp1[1] + temp1[2] + temp2[0] + temp2[1]

          if (currentDate >= startTime && currentDate <= endTime) {
            status = "Running"
          } else if (currentDate < startTime) {
            status = "Pending"
          } else {
            status = "Ended"
          }

          params.append('examName', this.exam_add.examName);
          params.append('examStartTime', this.exam_add.examStartTime);
          params.append('examEndTime', this.exam_add.examEndTime);
          params.append('teacherId', this.exam_add.teacherId);
          params.append('examStatus', status);
          params.append('examLanguage', this.exam_add.examLanguage);
          params.append('groupId', this.exam_add.groupId);
          params.append('examChoiceQuestionScore', this.exam_add.examChoiceQuestionScore);
          params.append('examCompletionQuestionScore', this.exam_add.examCompletionQuestionScore);
          params.append('examProgrammingScore', this.exam_add.examProgrammingScore);

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
    },
    choiceManage (row) {
      var id = row.examId;
      // console.log(id);
      this.$router.push({ path: '/choiceQuestionManage', query: { examId: id } })
    },
    programmingManage (row) {
      var id = row.examId;
      // console.log(id);
      this.$router.push({ path: '/programmingManage', query: { examId: id } })
    }
  }
}
</script>

<style>
.topBar_Teacher {
  margin-top: 10px;
}
.addButton_Exam {
  float: right;
  margin-right: 25px;
}
.addDialogButton {
  float: right;
  /* margin-bottom: 25px; */
}
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
a {
  /* text-decoration: none; */
  color: #606266;
}
.el-form-item__label {
  text-align: left;
}
.el-dialog {
  overflow: auto;
}
</style>