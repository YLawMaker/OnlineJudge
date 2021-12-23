<template>
  <el-card>
    <el-row type="flex" justify="start">
      <el-col :span="20">
        <el-form inline>
          <el-form-item label="习题id">
            <el-input
              v-model="select_exerciseId"
              placeholder="习题id"
              class="handle-input"
              clearable
              @keyup.native="proving"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="用户姓名">
            <el-input
              v-model="select_userName"
              placeholder="用户姓名"
              class="handle-input"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="语言">
            <el-select
              v-model="select_language"
              placeholder="请选择"
              class="handle-select"
            >
              <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果">
            <el-select
              v-model="select_status"
              placeholder="请选择"
              class="handle-select"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              round
              plain
              @click="searchExerciseRealTimeInfo()"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      :data="data"
      class="tableclass"
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '20px' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="exerciseHistoryId" label="习题记录编号">
      </el-table-column>
      <el-table-column prop="exerciseSubmitTime" label="提交时间">
      </el-table-column>
      <el-table-column prop="exerciseResult" label="提交结果">
      </el-table-column>
      <el-table-column label="习题编号">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="查看习题"
            placement="right"
          >
            <router-link
              :to="{
                path: 'exerciseDetail',
                query: {
                  exerciseId: scope.row.exercise.exerciseId,
                },
              }"
            >
              {{ scope.row.exercise.exerciseId }}
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="代码">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.user.userId === userId"
            style="text-decoration: none; color: blue"
            :to="{
              path: '/submitCode',
              query: {
                exerciseHistoryId: scope.row.exerciseHistoryId,
                exerciseId: scope.row.exercise.exerciseId,
              },
            }"
          >
            代码
          </router-link>
          <span v-else> 代码 </span>
        </template>
      </el-table-column>
      <el-table-column prop="exerciseSubmitLanguage" label="提交语言">
      </el-table-column>
      <el-table-column label="提交作者">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="查看作者"
            placement="right"
          >
            <router-link
              :to="{
                path: 'userInfo',
                query: {
                  userId: scope.row.user.userId,
                },
              }"
            >
              {{ scope.row.user.userName }}
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="pageView">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="exerciseRealTimeInfo.length"
        @current-change="handleCurrent"
        v-if="exerciseRealTimeInfo.length != 0"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      exerciseRealTimeInfo: [
        {
          exerciseHistoryId: "",
          exerciseSubmitTime: "",
          exerciseResult: "",
          exerciseSubmitLanguage: "",
          exerciseCode: "",
          user: {
            userId: "",
            userName: "",
          },
          exercise: {
            exerciseId: "",
          },
        },
      ],
      languageOptions: [
        {
          value: "",
          label: "     ",
        },
        {
          value: "c",
          label: "c",
        },
        {
          value: "java",
          label: "java",
        },
      ],
      statusOptions: [
        {
          value: "",
          label: "     ",
        },
        {
          value: "accept",
          label: "accept",
        },
        {
          value: "wrong answer",
          label: "wrong answer",
        },
        {
          value: "loding",
          label: "loding",
        },
      ],
      select_exerciseId: "",
      select_userName: "",
      select_language: "",
      select_status: "",
      pageSize: 4,
      currentPage: 1,
      userId: "",
      pageView: false,
    };
  },

  computed: {
    data () {
      return this.exerciseRealTimeInfo.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  mounted: function () {
    //获取用户信息
    this.getUserInfo();
    if (sessionStorage.getItem("isPublish") == "false") {
      if (sessionStorage.getItem("exerciseRealTimeStatusCurrentPage") != null) {
        this.currentPage = Number(
          sessionStorage.getItem("exerciseRealTimeStatusCurrentPage")
        );
      }
      //获取查询信息 从session中读取
      if (sessionStorage.getItem("select_exerciseId") != null) {
        this.select_exerciseId = sessionStorage.getItem("select_exerciseId");
      }
      if (sessionStorage.getItem("select_userName") != null) {
        this.select_userName = sessionStorage.getItem("select_userName");
      }
      if (sessionStorage.getItem("select_language") != null) {
        this.select_language = sessionStorage.getItem("select_language");
      }
      if (sessionStorage.getItem("select_status") != null) {
        this.select_status = sessionStorage.getItem("select_status");
      }
    } else {
      sessionStorage.setItem("isPublish", "false");
    }

    this.getExerciseRealTimeInfo();
  },

  methods: {
    //查看用户是否登录 若登录成功则获取userId
    getUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserInfo",
        data: params,
      })
        .then((res) => {
          //等于0表示用户没有登录 这里表示登录成功
          if (res.data != 0) {
            this.userId = res.data.userId;
          } else {
            this.userId = 0;
          }
        })
        .catch((err) => {
          this.$message.error("查询用户信息失败");
        });
    },
    //查询习题实时状态
    searchExerciseRealTimeInfo () {
      //查询之后返回第一页 查询后保存页码为1
      this.currentPage = 1;
      this.setContextData("exerciseRealTimeStatusCurrentPage", 1);
      //保存查询信息
      if (this.select_exerciseId != "") {
        sessionStorage.setItem("select_exerciseId", this.select_exerciseId);
      } else {
        sessionStorage.setItem("select_exerciseId", "");
      }
      if (this.select_userName != "") {
        sessionStorage.setItem("select_userName", this.select_userName);
      } else {
        sessionStorage.setItem("select_userName", "");
      }
      if (this.select_language != "") {
        sessionStorage.setItem("select_language", this.select_language);
      } else {
        sessionStorage.setItem("select_language", "");
      }
      if (this.select_status != "") {
        sessionStorage.setItem("select_status", this.select_status);
      } else {
        sessionStorage.setItem("select_status", "");
      }
      this.getExerciseRealTimeInfo();
    },
    //给sessionStorage存值
    setContextData: function (key, value) {
      if (typeof value == "string") {
        sessionStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    },
    // 从sessionStorage取值
    getContextData: function (key) {
      const str = sessionStorage.getItem(key);
      if (typeof str == "string") {
        try {
          return JSON.parse(str);
        } catch (e) {
          return str;
        }
      }
      return;
    },
    //页面变换
    handleCurrent (val) {
      this.currentPage = val;
      this.setContextData("exerciseRealTimeStatusCurrentPage", val);
    },
    //获取习题实时数据
    async getExerciseRealTimeInfo () {
      let params = new URLSearchParams();

      if (this.select_exerciseId != "") {
        if (this.select_exerciseId == null) {
          params.append("exerciseId", 0);
        } else {
          //不为空格 不为null
          if (
            this.select_exerciseId.length > 0 &&
            this.select_exerciseId.trim().length != 0
          ) {
            var numReg = /^[0-9]+$/;
            var numRe = new RegExp(numReg);
            if (numRe.test(this.select_exerciseId)) {
              params.append("exerciseId", this.select_exerciseId);
            } else {
              params.append("exerciseId", 0);
            }
          } else {
            params.append("exerciseId", 0);
          }
        }
      } else {
        params.append("exerciseId", 0);
      }

      if (this.select_userName != "") {
        if (this.select_userName == null) {
          params.append("userName", "");
          //不为空格  不为null
        } else {
          if (
            this.select_userName.length > 0 &&
            this.select_userName.trim().length != 0
          ) {
            params.append("userName", this.select_userName);
          } else {
            params.append("userName", "");
          }
        }
      } else {
        params.append("userName", "");
      }

      if (this.select_language == null) {
        params.append("exerciseSubmitLanguage", "");
      } else {
        params.append("exerciseSubmitLanguage", this.select_language);
      }

      if (this.select_status == null) {
        params.append("exerciseResult", "");
      } else {
        params.append("exerciseResult", this.select_status);
      }
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/exerciseHistory/queryExerciseRealTimeStatusInfo",
        data: params,
      })
        .then((res) => {
          if (res.data != 0) {
            //再刷新一次页码
            this.pageView = true;
            this.exerciseRealTimeInfo = res.data;
          } else {
            var t = [];
            this.exerciseRealTimeInfo = t;
            this.currentPage = 1;
          }
        })
        .catch((err) => {
          this.$message.error("读取习题实时状态失败");
        });
    },
    // 只能输入数字且只有一位小数
    proving () {
      this.select_exerciseId = this.select_exerciseId.replace(/[^\d]/g, "");
    },
  },
};
</script>

<style lang="less" scoped>
// .tableclass {
//   margin-top: 20px;
// }
.pagination {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
// .span-label {
//   margin-left: 2%;
// }
.handle-input {
  width: 200px;
  display: inline-block;
}
.handle-select {
  width: 200px;
  display: inline-block;
}
.el-row {
  .el-col {
    span {
      margin-right: 20px;
    }
    .el-input,
    .el-select {
      min-width: 200px;
    }
  }
}
.el-table {
  a.el-tooltip.item {
    text-decoration: none;
    color: black;
  }
}
</style>
