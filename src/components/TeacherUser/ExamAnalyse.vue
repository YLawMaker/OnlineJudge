<template>
  <div>
    <div></div>
    <div>
      <el-table>
        <el-table-column label="各部分得分" align="center">
          <el-table-column label="题型" width="100"></el-table-column>
          <el-table-column label="选择题"></el-table-column>
          <el-table-column label="填空题"></el-table-column>
          <el-table-column label="程序设计题"></el-table-column>
          <el-table-column label="总分"></el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-table>
        <el-table-column label="各分段人数" align="center">
          <el-table-column label="分数段" width="100"></el-table-column>
          <el-table-column label="60以下"></el-table-column>
          <el-table-column label="60~69"></el-table-column>
          <el-table-column label="70~79"></el-table-column>
          <el-table-column label="80~89"></el-table-column>
          <el-table-column label="90及以上"></el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-table>
        <el-table-column label="选择题章节知识点分布" align="center">
          <el-table-column label="序号" width="100"></el-table-column>
          <el-table-column label="章"></el-table-column>
          <el-table-column label="节"></el-table-column>
          <el-table-column label="知识点"></el-table-column>
          <el-table-column label="正确人数/实考人数"></el-table-column>
          <el-table-column label="正确率"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style>
</style>