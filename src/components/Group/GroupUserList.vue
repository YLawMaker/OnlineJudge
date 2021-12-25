<template>
  <el-card>
    <div>
      <div class="topBar_GroupUser">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-back"
          round
          plain
          @click.native.prevent="
            goBack(pageFromInfoManage, searchKeyFromInfoManage)
          "
        >
          返回
        </el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-document-add"
          round
          plain
          @click="addDialogvisiable()"
          >添加用户</el-button
        >
      </div>
      <div>
        <el-table :data="data">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="userAccount" label="Account"></el-table-column>
          <el-table-column prop="userName" label="Name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
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
            :total="this.groupUserList.length"
            v-if="this.groupUserList.length != 0"
          >
          </el-pagination>
        </div>
        <el-dialog
          title="添加用户"
          :visible.sync="edittableDataVisible_add"
          :before-close="handleClose"
          :close-on-click-modal="false"
        >
          <el-form
            ref="addGroupUser"
            :model="addGroupUserData"
            :rules="addRules"
            class="addGroupUserForm"
          >
            <div>
              将学生学号整列复制过来，然后要求他们用学号做UserAccount注册,请保证在一列显示
            </div>
            <el-form-item prop="groupUserList">
              <el-input
                type="textarea"
                :rows="12"
                v-model="addGroupUserData.groupUserList"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add('addGroupUser')"
                >添加</el-button
              >
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      groupUserList: [],
      searchKeyFromInfoManage: '',
      pageFromInfoManage: '',
      currentPage: 1,
      pagesize: 9,
      groupId: '',
      edittableDataVisible_add: false,
      addGroupUserData: {
        groupUserList: ''
      },
      addRules: {
        groupUserList: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
        ]
      },
    }
  },
  mounted: function () {
    // if (this.$route.params.page == null) {
    //   this.getExercise(this.currentPage, '');//需要触发的函数
    // } else {
    //   this.getExercise(parseInt(this.$route.params.page), this.$route.params.key);//需要触发的函数
    // }
    this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage)
  },
  computed: {
    data () {
      return this.groupUserList.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  methods: {
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.addGroupUserData = new Object();
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    getGroupUserInfo (groupId, page, searchKey) {
      const that = this
      let params = new URLSearchParams();
      params.append('groupId', groupId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/userGroup/queryUserGroupInfoByGroupId',
        data: params
      }).then(function (resp) {
        // console.log(resp.data);
        that.groupId = groupId
        that.groupUserList = resp.data
        that.pageFromInfoManage = page
        that.searchKeyFromInfoManage = searchKey
      })
    },
    goBack (pageFromInfoManage, searchKeyFromInfoManage) {
      this.$router.push({ name: 'GroupInfoList', params: { page: pageFromInfoManage, key: searchKeyFromInfoManage } })
    },
    add (addGroupUser) {
      let userList = this.addGroupUserData.groupUserList.split(/[(\r\n)\r\n]+/)
      userList.forEach((item, index) => { // 删除空项
        if (!item) {
          userList.splice(index, 1);
        }
      })
      userList = Array.from(new Set(userList)); // 去重
      // console.log(userList);
      // console.log(this.$route.query.groupIdFromInfoManage)
      this.$refs[addGroupUser].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('userGroupInfo', JSON.stringify([userList, this.$route.query.groupIdFromInfoManage]));
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/userGroup/addUserGroupInfo',
            data: params
          }).then((res) => {
            console.log(res.data);
            if (res.data == '0') {
              // console.log(res.data);
              this.$message.error('请输入用户账号');
              this.edittableDataVisible_add = false;
              this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage);
            } else if (res.data == true) {
              this.$message.success('用户添加成功');
              this.edittableDataVisible_add = false;
              this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage);
              this.addGroupUserData = new Object()
            } else {
              this.$message.error('输入的用户账号有误，请检查后更正错误部分');
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteGroup(row.userId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        // console.log(resp);
      });
    },
    deleteGroup (userId) {
      let params = new URLSearchParams();
      params.append('groupId', this.groupId);
      params.append('userId', userId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/userGroup/deleteUserGroupInfoByGroupIdAndUserId',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('用户删除成功');
          this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage);
        } else if (res.data == false) {
          this.$message.error('用户删除失败');
          this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage);
        } else {
          this.$message.error('发生了错误');
          this.getGroupUserInfo(this.$route.query.groupIdFromInfoManage, this.$route.query.page, this.$route.query.searchKeyFromInfoManage);
        }
      }).catch((res) => {
        console.log(res);
      })
    },
  }
}
</script>

<style scoped>
.topBar_GroupUser {
  text-align: left;
  margin-top: 10px;
  margin-right: 25px;
  margin-left: 10pt;
}
.block {
  text-align: center;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>