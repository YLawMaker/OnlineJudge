<template>
  <div id="bookInfo">
    <div class="return">
      <el-button type="primary" @click="$router.push('HomePage')"
        >返回上一页</el-button
      >
    </div>
    <div class="bookImg">
      <el-image style="width: 350px; height: 350px" :src="src"> </el-image>
    </div>
    <div class="bookInf">
      <table>
        <tr>
          <td>书籍名称:</td>
          <td>{{ name }}</td>
        </tr>
        <tr>
          <td>作者:</td>
          <td>{{ author }}</td>
        </tr>
        <tr>
          <td>价格:</td>
          <td>{{ price }}</td>
        </tr>
        <tr>
          <td>剩余数量:</td>
          <td>{{ remain }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      author: '',
      price: '',
      remain: '',
      src: ''
    }
  },
  created () {
    this.getInfo();
  },
  methods: {
    getInfo () {
      this.name = this.$route.params.bookinf.name
      this.author = this.$route.params.bookinf.author
      this.price = this.$route.params.bookinf.price
      this.remain = this.$route.params.bookinf.remain
    }
  }
}
</script>

<style>
.bookImg {
  text-align: center;
}
.bookInf table {
  border-width: 1px;
  border-style: solid;
  border-color: #999999;
  margin: auto;
}
</style>