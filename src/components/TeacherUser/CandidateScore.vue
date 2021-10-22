<template>
  <div>
    <div></div>
    <div>
      <el-table
        :data="examHistory"
        style="width: 100%"
        :row-style="{ height: '20px' }"
        stripe
      >
        <el-table-column label="Rank" width="80"> </el-table-column>
        <el-table-column label="账号" width=""> </el-table-column>
        <el-table-column label="姓名"> </el-table-column>
        <el-table-column label="选择题"> </el-table-column>
        <el-table-column label="填空题"> </el-table-column>
        <el-table-column label="编程题"> </el-table-column>
        <el-table-column label="总成绩"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      examHistory: []
    }
  },
  methods: {

  }
}
</script>

<style>
</style>