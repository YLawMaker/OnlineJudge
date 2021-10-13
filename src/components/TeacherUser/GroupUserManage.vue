<template>
  <div>
    <div class="topBar_GroupUser">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="
          goBack(pageFromInfoManage, searchKeyFromInfoManage)
        "
      >
        返回
      </el-button>
      <el-button size="small" type="primary" @click="addDialogvisiable()"
        >添加用户</el-button
      >
    </div>
    <div>
      <el-table :data="groupUserList">
        <el-table-column prop="userAccount" label="Account"></el-table-column>
        <el-table-column prop="userName" label="Name"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupUserList: [],
      searchKeyFromInfoManage: '',
      pageFromInfoManage: '',

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
  methods: {
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
        that.groupUserList = resp.data
        that.pageFromInfoManage = page
        that.searchKeyFromInfoManage = searchKey
      })
    },
    goBack (pageFromInfoManage, searchKeyFromInfoManage) {
      this.$router.push({ name: 'GroupInfoManage', params: { page: pageFromInfoManage, key: searchKeyFromInfoManage } })
    }
  }
}
</script>

<style>
.topBar_GroupUser {
  text-align: right;
  margin-top: 10px;
  margin-right: 25px;
}
</style>