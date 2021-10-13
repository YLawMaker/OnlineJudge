<template>
  <div>
    <div>
      <div class="topBar_GroupInfoManage">
        <el-input
          v-model="select_word"
          size="mini"
          class="search_input"
          placeholder="请输入关键字"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button
          size="small"
          type="primary"
          class="addButton_GroupInfoManage"
          @click="addDialogvisiable()"
          >添加分组</el-button
        >
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
        <el-table-column prop="isPrivate" label="是否私有"></el-table-column>
        <el-table-column label="创建者"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click.native.prevent="GroupInfoDialog(scope.row)"
              size="small"
              >详情</el-button
            >
            <el-button
              type="danger"
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
        title="添加分组"
        :visible.sync="edittableDataVisible_add"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form>
          <el-form-item label="名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="是否设置为私有">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="0">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add('addExerciseLabel')"
              >添加</el-button
            >
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
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
      radio: '1',
      edittableDataVisible_add: false
    }

  },
  mounted: function () {
    if (this.$route.params.page == null) {
      this.getGroupInfo(this.currentPage, '');//需要触发的函数
    } else {
      this.getGroupInfo(parseInt(this.$route.params.page), this.$route.params.key);//需要触发的函数
    }
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
      this.edittableDataVisible_add = false
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    GroupInfoDialog (row) {
      // alert(row.groupId)
      // alert(this.currentPage)
      // alert(this.select_word)
      this.$router.push({ path: 'GroupUserManage', query: { page: this.currentPage, groupIdFromInfoManage: row.groupId, searchKeyFromInfoManage: this.select_word } })
    },
    getGroupInfo (pageNum, key) {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/group/queryGroupInfo',
      }).then(function (resp) {
        that.groupList = resp.data;
        that.searchData = resp.data;
        that.currentPage = pageNum;
        that.select_word = key
      })
    }
  }
}
</script>

<style>
.el-table .cell {
  white-space: pre-line;
}
.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
}
.topBar_GroupInfoManage {
  margin-top: 10px;
}
.addButton_GroupInfoManage {
  float: right;
  margin-right: 25px;
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