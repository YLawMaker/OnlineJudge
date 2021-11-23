<template>
  <div>
    <div>
      <div class="topBar_Test">
        <el-input
          v-model="select_word"
          size="mini"
          class="search_input"
          placeholder="请输入考试名称"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button
          class="addButton_Test"
          size="small"
          type="primary"
          @click.native.prevent="addDialogvisiable()"
          >新建测试</el-button
        >
      </div>
      <div>
        <el-table :data="data">
          <el-table-column
            prop="testId"
            label="ID"
            width="80"
          ></el-table-column>
          <el-table-column prop="testName" label="Title"
            ><template slot-scope="scope">
              <router-link
                :to="{
                  path: 'TestProblemList',
                  query: {
                    testIdfromManage: scope.row.testId,
                    managePage: currentPage,
                  },
                }"
              >
                {{ scope.row.testName }}
              </router-link>
            </template></el-table-column
          >
          <el-table-column
            prop="testStartTime"
            label="StartTime"
          ></el-table-column>
          <el-table-column prop="testEndTime" label="EndTime"></el-table-column>
          <el-table-column prop="testStatus" label="Status"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click.native.prevent="modifyTestDialog(scope.row)"
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
          title="添加测试"
          :visible.sync="edittableDataVisible_add"
          :before-close="handleClose"
          :close-on-click-modal="false"
          width="850px"
        >
          <el-form
            ref="addTest"
            :model="test_add"
            class="addTestForm"
            label-width="120px"
          >
            <el-form-item label="测试名称" prop="testName">
              <el-input v-model="test_add.testName"></el-input>
            </el-form-item>

            <el-form-item label="开始时间" prop="testStartTime">
              <el-date-picker
                v-model="test_add.testStartTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
              >
              </el-date-picker> </el-form-item
            ><el-form-item label="结束时间" prop="testEndTime">
              <el-date-picker
                v-model="test_add.testEndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="考试分组" prop="groupId">
              <el-select
                v-model="test_add.groupId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="addDialogButton">
              <el-button type="primary" @click="addTest('addTest')"
                >添加</el-button
              >
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="修改"
          :visible.sync="edittableDataVisible_modify"
          :before-close="handleClose"
          :close-on-click-modal="false"
          width="850px"
        >
          <el-form
            ref="modifyTest"
            :model="test_modify"
            class="modifyTestForm"
            label-width="120px"
          >
            <el-form-item label="测试名称" prop="testName">
              <el-input v-model="test_modify.testName"></el-input>
            </el-form-item>

            <el-form-item label="开始时间" prop="testStartTime">
              <el-date-picker
                v-model="test_modify.testStartTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
              >
              </el-date-picker> </el-form-item
            ><el-form-item label="结束时间" prop="testEndTime">
              <el-date-picker
                v-model="test_modify.testEndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="考试分组" prop="groupId">
              <el-select
                v-model="test_modify.groupId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="addDialogButton">
              <el-button type="primary" @click="modifyTest('modifyTest')"
                >修改</el-button
              >
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testList: [],
      test_add: {
        testId: '',
        testName: '',
        testStartTime: '',
        testEndTime: '',
        testStatus: '',
        teacherId: '',
        groupId: '',
      },
      test_modify: {
        testId: '',
        testName: '',
        testStartTime: '',
        testEndTime: '',
        testStatus: '',
        teacherId: '',
        groupId: '',
      },
      // permissions: [{
      //   value: 'public',
      //   label: 'public'
      // }, {
      //   value: 'private',
      //   label: 'private'
      // }],
      groupList: [],
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      currentPage: 1,
      pagesize: 7,
      select_word: "",
      searchData: []
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      if (this.$route.params.page == null) {
        this.getTestInfo(this.currentPage);
      } else {
        this.getTestInfo(this.$route.params.page);
      }
      this.getGroupInfo();
    });
  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.testList;
      } else {
        this.searchData = [];
        for (let item of this.testList) {
          if (item.testName.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
      }
    },
  },
  computed: {
    data () {
      return this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

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
      this.test_add = new Object();
    },
    modifyTestDialog (row) {
      // testId: '',
      //   testName: '',
      //   testStartTime: '',
      //   testPermission: '',
      //   testEndTime: '',
      //   testStatus: '',
      //   teacherId: '',
      //   groupId: '',
      // console.log(row);
      this.edittableDataVisible_modify = true
      this.test_modify.testId = row.testId;
      this.test_modify.testName = row.testName;
      this.test_modify.testStartTime = row.testStartTime;
      this.test_modify.testEndTime = row.testEndTime;
      this.test_modify.teacherId = row.teacherId;
      this.test_modify.groupId = row.group.groupId;
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
    getTestInfo (pageNum) {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/test/queryTestInfoByTestStatus',
      })
        .then((res) => {
          // console.log(res.data);
          that.searchData = res.data;
          that.testList = res.data;
          that.currentPage = parseInt(pageNum);
        })
        .catch((err) => {
          // this.$message.error('系统错误请稍后再尝试');
          console.log(err);
        })
    },
    addTest (addTest) {
      var that = this;
      this.$refs[addTest].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();

          //获取当前的时间,格式为YYYY-MM-DD HH:MM
          const date = new Date()
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          // console.log(date.toJSON().substr(0, 16).replace(/[T]/g, ' '));


          // 将日期格式处理成字符串，方便比较
          var status = ' ';
          var currentDate = date.toJSON().substr(0, 16).replace(/[T]/g, ' ')
          var startTime = this.test_add.testStartTime;
          var endTime = this.test_add.testEndTime;
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

          params.append('testName', this.test_add.testName);
          params.append('testStartTime', this.test_add.testStartTime);
          params.append('testEndTime', this.test_add.testEndTime);
          params.append('testLanguage', 'empty');
          params.append('testStatus', status);
          params.append('groupId', this.test_add.groupId);

          // console.log(params.toString());
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/test/addTestInfo',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              // console.log(res.data);
              this.$message.error('测试添加失败');
              this.edittableDataVisible_add = false;
              this.getTestInfo(this.currentPage);
            } else {
              this.$message.success('测试添加成功');
              this.edittableDataVisible_add = false;
              this.getTestInfo(this.currentPage);
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    modifyTest (modifyTest) {
      let params = new URLSearchParams();

      //获取当前的时间,格式为YYYY-MM-DD HH:MM
      const date = new Date()
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      // console.log(date.toJSON().substr(0, 16).replace(/[T]/g, ' '));


      // 将日期格式处理成字符串，方便比较
      var status = ' ';
      var currentDate = date.toJSON().substr(0, 16).replace(/[T]/g, ' ')
      var startTime = this.test_modify.testStartTime;
      var endTime = this.test_modify.testEndTime;
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

      params.append('testId', this.test_modify.testId);
      params.append('testName', this.test_modify.testName);
      params.append('testStartTime', this.test_modify.testStartTime);
      params.append('testEndTime', this.test_modify.testEndTime);
      params.append('testLanguage', 'empty');
      params.append('testStatus', status);
      params.append('groupId', this.test_modify.groupId);

      // console.log(this.exam_modify.examStartTime);

      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/test/modifyTestInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('测试信息修改成功');
          this.edittableDataVisible_modify = false;
          this.getTestInfo(this.currentPage);
        } else if (res.data == false) {
          this.$message.error('测试信息修改失败');
          this.edittableDataVisible_modify = false;
          this.getTestInfo(this.currentPage);
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getTestInfo(this.currentPage);
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该测试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteExam(row.testId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteExam (testId) {
      let params = new URLSearchParams();
      params.append('testId', testId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/test/deleteTestInfoByTestId',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('测试删除成功');
          this.getTestInfo(this.currentPage);
        } else if (res.data == false) {
          this.$message.error('测试删除失败');
          this.getTestInfo(this.currentPage);
        } else {
          this.$message.error('发生了错误');
          this.getTestInfo(this.currentPage);
        }
      }).catch((res) => {
        console.log(res);
      })
    },
  }
}
</script>

<style scoped>
.addButton_Test {
  float: right;
  margin-right: 25px;
}
.topBar_Test {
  margin-top: 10px;
}
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>