<template>
  <el-card>
    <div>
      <div>
        <div class="topBar_GroupManage">
          <el-input
            v-model="select_word"
            size="mini"
            class="search_input"
            placeholder="请输入关键字"
            style="width: 200px"
            clearable
          ></el-input>
        </div>
      </div>
      <div>
        <el-table
          :data="data"
          style="width: 100%"
          :row-style="{ height: '20px' }"
          stripe
        >
          <el-table-column
            prop="groupId"
            label="编号"
            width="200"
          ></el-table-column>
          <el-table-column prop="groupName" label="分组名称">
            <template slot-scope="scope">
              <router-link
                :to="{
                  /* path: 'ExerciseAnswerManage',
                query: {
                  exerciseIdfromManage: scope.row.exerciseId,
                  page: currentPage,
                  searchKey: select_word,
                },*/
                }"
              >
                {{ scope.row.groupName }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="user.userName"
            label="创建者"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click.native.prevent="GroupInfoDialog(scope.row)"
                size="small"
                icon="el-icon-info"
                round
                plain
                >详情</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete-solid"
                round
                plain
                @click.native.prevent="deleteConfirm(scope.row)"
                size="small"
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
          title="详情"
          :visible.sync="edittableDataVisible_info"
          :before-close="handleClose"
          :close-on-click-modal="false"
        >
        </el-dialog>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      groupList: [],
      searchData: [],
      select_word: '',
      currentPage: 1,
      pagesize: 9,
      edittableDataVisible_info: false
    }

  },
  mounted: function () {
    // if (this.$route.params.page == null) {
    //   this.getExercise(this.currentPage, '');//需要触发的函数
    // } else {
    //   this.getExercise(parseInt(this.$route.params.page), this.$route.params.key);//需要触发的函数
    // }
    this.getGroupInfo()
  },
  computed: {
    data () {
      return this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.searchData = this.groupList;
      } else {
        this.searchData = [];
        for (let item of this.groupList) {
          if (item.groupName.includes(this.select_word)) {
            this.currentPage = 1;
            this.searchData.push(item);
          }
        }
      }
    },
  },
  methods: {
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_info = false
      this.addexerciseData = new Object();
      this.$refs.addExercise.clearValidate();
    },
    GroupInfoDialog (row) {
      alert(row.groupName)
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
        that.searchData = resp.data;
      })
    }
  }
}
</script>

<style>
.el-table .cell {
  white-space: pre-line;
}
.topBar_GroupManage {
  margin-top: 10px;
}
.router-link-active {
  text-decoration: none;
}
a {
  /* text-decoration: none; */
  color: #606266;
}
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>