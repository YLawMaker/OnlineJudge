<template>
  <el-card>
    <el-row>
      <el-col :span="4">
        <el-input
          v-model="select_word"
          placeholder="学生姓名"
          class="handle-input"
          clearable
        >
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="data"
      class="tableclass"
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '20px' }"
      :cell-style="{ 'text-align': 'center' }"
      stripe
    >
      <el-table-column label="名次" prop="userName">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="查看用户信息"
            placement="right"
          >
            <router-link
              style="text-decoration: none; color: black"
              :to="{
                path: 'userInfo',
                query: {
                  userId: scope.row.userId,
                },
              }"
            >
              {{ scope.row.userName }}
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="userProfile" label="个人简介"> </el-table-column>
      <el-table-column prop="userSolved" label="解决数"> </el-table-column>
      <el-table-column prop="userSubmit" label="提交数"> </el-table-column>
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ getAcceptRate(scope.row.userSolved, scope.row.userSubmit) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-if="pageView">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="selectUserInfo.length"
        @current-change="handleCurrent"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      userInfo: [
        {
          userId: "",
          userName: "",
          userProfile: "",
          userSolved: "",
          userSubmit: "",
        },
      ],
      selectUserInfo: [],
      select_word: "",
      pageSize: 4,
      currentPage: 1,
      selectBackWord: "",
      pageView: false,
    };
  },
  computed: {
    data () {
      return this.selectUserInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.selectUserInfo = this.userInfo;
      } else {
        this.selectUserInfo = [];
        for (let item of this.userInfo) {
          if (item.userName.includes(this.select_word)) {
            sessionStorage.setItem("userRankListSelectWord", this.select_word);
            sessionStorage.setItem("userRankListCurrentPage", 1);
            this.currentPage = 1;
            this.selectUserInfo.push(item);
          }
        }
      }
    },
  },
  mounted: function () {
    if (sessionStorage.getItem("isPublish") == "false") {
      if (sessionStorage.getItem("userRankListCurrentPage") != null) {
        this.currentPage = Number(
          sessionStorage.getItem("userRankListCurrentPage")
        );
      }
      if (sessionStorage.getItem("userRankListSelectWord") != null) {
        this.selectBackWord = sessionStorage.getItem("userRankListSelectWord");
      }
    } else {
      sessionStorage.setItem("isPublish", "false");
    }
    this.getUserInfo();
  },
  methods: {
    //改变页码
    handleCurrent (val) {
      sessionStorage.setItem("userRankListCurrentPage", val);
      this.currentPage = val;
    },
    //获取用户信息
    getUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserRankListInfo",
        data: params,
      })
        .then((res) => {
          //再刷新一次页码
          this.pageView = true;
          this.userInfo = res.data;
          this.selectUserInfo = res.data;
          this.select_word = this.selectBackWord;
        })
        .catch((err) => {
          this.$message.error("读取用户排行榜失败");
        });
    },
    //获取比例
    getAcceptRate (exerciseCorrectTimes, exerciseSubmitTimes) {
      if (
        !(
          exerciseCorrectTimes / exerciseSubmitTimes ==
          exerciseCorrectTimes / exerciseSubmitTimes
        )
      ) {
        var acceptRate = 0 + "%";
      } else {
        var acceptRate =
          ((exerciseCorrectTimes / exerciseSubmitTimes) * 100).toFixed(2) + "%";
      }
      return acceptRate;
    },
  },
};
</script>

<style lang="less" scoped>
.tableclass {
  margin-top: 20px;
}
/* 分页的css样式 */
.pagination {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
// .handle-input {
//   width: 300px;
//   display: inline-block;
//   margin-left: 5%;
// }
.el-card {
  border: 1px solid #7c7979;
}
</style>
