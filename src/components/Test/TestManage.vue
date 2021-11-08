<template>
  <div>
    <div>
      <div class="topBar_Test">
        <el-button
          class="addButton_Test"
          size="small"
          type="primary"
          @click.native.prevent="addDialogvisiable()"
          >新建测试</el-button
        >
      </div>
      <div>
        <el-table :data="testList">
          <el-table-column
            prop="isPrivate"
            label="ID"
            width="80"
          ></el-table-column>
          <el-table-column prop="isPrivate" label="Title"></el-table-column>
          <el-table-column prop="isPrivate" label="StartTime"></el-table-column>
          <el-table-column prop="isPrivate" label="EndTime"></el-table-column>
          <el-table-column prop="isPrivate" label="操作"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testList: []
    }
  }
}
</script>

<style>
.addButton_Test {
  float: right;
  margin-right: 25px;
}
.topBar_Test {
  margin-top: 10px;
}
</style>