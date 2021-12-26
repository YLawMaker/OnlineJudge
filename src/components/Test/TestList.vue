<template>
  <el-card>
    <div>
      <el-table :data="data" style="width: 100%" stripe>
        <el-table-column prop="testName" label="测试名称">
          <template slot-scope="scope">
            <div style="cursor: pointer" @click="goToTestDetail(scope.row)">
              {{ scope.row.testName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="group.groupName" label="测试组别">
        </el-table-column>
        <el-table-column prop="testStartTime" label="测试开始时间">
        </el-table-column>
        <el-table-column prop="testEndTime" label="测试结束时间">
        </el-table-column>
        <el-table-column prop="testStatus" label="测试状态">
          <template slot-scope="scope">
            <div v-if="scope.row.testStatus === 'Pending'" style="color: blue">
              {{ scope.row.testStatus }}
            </div>
            <div
              v-else-if="scope.row.testStatus === 'Running'"
              style="color: red"
            >
              {{ scope.row.testStatus }}
            </div>
            <div v-else style="color: green">
              {{ scope.row.testStatus }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          layout="total,prev,pager,next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="testList.length"
          @current-change="handleCurrent"
          v-if="testList.length != 0"
        >
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      testInfo: {
        group: {
          groupName: '',
        },
        testId: '',
        testName: '',
        testStartTime: '',
        testEndTime: '',
        testLanguage: '',
        testStatus: '',
        user: {
          userName: ''
        },
      },
      testList: [],
      pageSize: 8,
      currentPage: 1,
      user: {
        userId: '',
      }
    }
  },
  mounted: function () {
    //获取测试列表
    this.getTestList();

  },
  computed: {
    data () {
      return this.testList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    //跳转到测试详情
    goToTestDetail (testInfo) {
      if (testInfo.testStatus == "Pending") {
        this.$message.warning("测试未开始")
      } else {
        let params = new URLSearchParams();
        params.append("groupId", testInfo.group.groupId);
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/userGroup/queryUserIfInGroup',
          data: params
        })
          .then((res) => {
            if (res.data == true) {
              this.$router.push({ path: '/testDetail', query: { "testName": testInfo.testName, "testId": testInfo.testId, "testStatus": testInfo.testStatus } })
            } else {
              this.$message.warning("不在测试名单中")
            }
          })
          .catch((err) => {
            this.$message.error('获取测试列表失败');
          })
      }

    },
    //页面改变
    handleCurrent (val) {
      //保存页码信息
      this.currentPage = val;
    },
    //获取习题列表
    getTestList () {
      let params = new URLSearchParams();
      params.append("testName", '');
      params.append("testStatus", '');
      params.append("userName", '');
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/test/searchTestInfo',
        data: params
      })
        .then((res) => {
          this.testList = res.data;
        })
        .catch((err) => {
          this.$message.error('获取测试列表失败');
        })
    },


  }
}
</script>

<style scoped>
/* 分页用的 */
.pagination {
  display: flex;
  justify-content: center;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>