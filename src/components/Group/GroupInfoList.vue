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
          icon="el-icon-document-add"
          round
          plain
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
        <el-table-column prop="user.userName" label="创建者"></el-table-column>
        <el-table-column prop="status" label="状态" width="100px">
          考试中
        </el-table-column>
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
              type="primary"
              size="small"
              icon="el-icon-edit-outline"
              round
              plain
              >修改</el-button
            >
            <el-button
              type="danger"
              @click.native.prevent="deleteConfirm(scope.row)"
              size="small"
              icon="el-icon-delete-solid"
              round
              plain
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
        <el-form
          ref="addGroup"
          :model="addGroupData"
          :rules="addRules"
          class="addGroupForm"
        >
          <el-form-item label="名称" prop="groupName">
            <el-input v-model="addGroupData.groupName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add('addGroup')">添加</el-button>
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
      teacherUserId: '',
      edittableDataVisible_add: false,
      addGroupData: {
        groupName: ''
      },
      addRules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }]
      },
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
      this.addGroupData = new Object();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    GroupInfoDialog (row) {
      // alert(row.groupId)
      // alert(this.currentPage)
      // alert(this.select_word)
      this.$router.push({ path: 'GroupUserList', query: { page: this.currentPage, groupIdFromInfoManage: row.groupId, searchKeyFromInfoManage: this.select_word } })
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
        // console.log(resp.data);
        that.groupList = resp.data;
        that.searchData = resp.data;
        that.currentPage = pageNum;
        that.select_word = key
      })
    },
    add (addGroup) {
      this.$refs[addGroup].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('groupName', this.addGroupData.groupName);
          // params.append('userId', this.teacherUserId);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/group/addGroupInfo',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              // console.log(res.data);
              this.$message.error('分组创建失败');
              this.edittableDataVisible_add = false;
              this.getGroupInfo(this.currentPage, '');
            } else {
              this.$message.success('分组创建成功');
              this.edittableDataVisible_add = false;
              this.getGroupInfo(this.currentPage, '');
              this.addGroupData = new Object()
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteGroup(row.groupId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        // console.log(resp);
      });
    },
    deleteGroup (groupId) {
      let params = new URLSearchParams();
      params.append('groupId', groupId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/group/deleteGroupInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('分组删除成功');
          this.getGroupInfo(this.currentPage, '');
        } else if (res.data == false) {
          this.$message.error('分组删除失败');
          this.getGroupInfo(this.currentPage, '');
        } else {
          this.$message.error('发生了错误');
          this.getGroupInfo(this.currentPage, '');
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    //获取教师用户信息
    getTeacherUserInfo () {
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

          this.teacherUserId = res.data.userId;
          // console.log(this.teacher);
        })
        .catch((err) => {
          this.$message.error('系统错误请稍后再尝试');

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