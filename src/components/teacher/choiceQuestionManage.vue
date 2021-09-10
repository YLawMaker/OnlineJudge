<template>
  <div>
    <div class="topBar_answer">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="goBack(currentPage, searchKey)"
      >
        返回
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="addExerciseAnswerDialog()"
        >添加答案</el-button
      >
    </div>
    <el-table> </el-table>
  </div>
</template>