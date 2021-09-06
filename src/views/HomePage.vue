<template>
  <div id="homepage">
    <div class="top">
      <ul>
        <li>欢迎{{ userName }}来到图书商城</li>
      </ul>
    </div>
    <el-container>
      <el-header
        class="homepage-header"
        style="text-align: right; font-size: 12px"
      >
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#FFFFFF"
          @select="handleSelect"
        >
          <el-menu-item index="1" disabled>我的订单</el-menu-item>
          <el-menu-item index="2" disabled>我的收藏</el-menu-item>
          <el-menu-item index="3" disabled>购物车</el-menu-item>
          <el-menu-item index="4" disabled>客户服务</el-menu-item>
        </el-menu>
      </el-header>
    </el-container>
    <el-container style="height: 652px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu default-active="2-2-3">
          <el-menu-item index="2-2-3">新书上架</el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>教育
            </template>
            <el-submenu index="1-1">
              <template slot="title">教材</template>
              <el-menu-item
                index="研究生/本科/专科"
                @click="SelectByType(bookType[0])"
                >研究生/本科/专科</el-menu-item
              >
              <el-menu-item
                index="高职高专教材"
                @click="SelectByType(bookType[1])"
                >高职高专教材</el-menu-item
              >
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">考试</template>
              <el-menu-item index="学历考试" @click="SelectByType(bookType[2])"
                >学历考试</el-menu-item
              >
              <el-menu-item index="考研" @click="SelectByType(bookType[3])"
                >考研</el-menu-item
              >
              <el-menu-item index="公务员" @click="SelectByType(bookType[4])"
                >公务员</el-menu-item
              >
            </el-submenu>
            <el-submenu index="1-3">
              <template slot="title">工具书</template>
              <el-menu-item
                index="汉语工具书"
                @click="SelectByType(bookType[5])"
                >汉语工具书</el-menu-item
              >
              <el-menu-item
                index="英语工具书"
                @click="SelectByType(bookType[6])"
                >英语工具书</el-menu-item
              >
              <el-menu-item
                index="其他语种工具书"
                @click="SelectByType(bookType[7])"
                >其他语种工具书</el-menu-item
              >
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>小说
            </template>
            <el-submenu index="2-1">
              <template slot="title">人气作家</template>
              <el-menu-item index="东野圭吾" @click="SelectByAuthor(author[0])"
                >东野圭吾</el-menu-item
              >
              <el-menu-item index="村上春树" @click="SelectByAuthor(author[1])"
                >村上春树</el-menu-item
              >
            </el-submenu>
            <el-submenu index="2-2">
              <template slot="title">小说</template>
              <el-menu-item
                index="中国当代小说"
                @click="SelectByType(bookType[8])"
                >中国当代小说</el-menu-item
              >
              <el-menu-item
                index="中国古典小说"
                @click="SelectByType(bookType[9])"
                >中国古典小说</el-menu-item
              >
              <el-menu-item index="外国小说" @click="SelectByType(bookType[10])"
                >外国小说</el-menu-item
              >
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>童书
            </template>
            <el-submenu index="3-1">
              <template slot="title">人气作家</template>
              <el-menu-item index="曹文轩" @click="SelectByAuthor(author[2])"
                >曹文轩</el-menu-item
              >
              <el-menu-item index="沈石溪" @click="SelectByAuthor(author[3])"
                >沈石溪</el-menu-item
              >
              <el-menu-item index="郑渊洁" @click="SelectByAuthor(author[4])"
                >郑渊洁</el-menu-item
              >
            </el-submenu>
            <el-submenu index="3-2">
              <template slot="title">小说</template>
              <el-menu-item
                index="中国儿童文学"
                @click="SelectByType(bookType[11])"
                >中国儿童文学</el-menu-item
              >
              <el-menu-item
                index="外国儿童文学"
                @click="SelectByType(bookType[12])"
                >外国儿童文学</el-menu-item
              >
              <el-menu-item index="绘本" @click="SelectByType(bookType[13])"
                >绘本</el-menu-item
              >
            </el-submenu>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>科技
            </template>
            <el-submenu index="4-1">
              <template slot="title">科普读物</template>
              <el-menu-item index="宇宙知识" @click="SelectByType(bookType[14])"
                >宇宙知识</el-menu-item
              >
              <el-menu-item index="人类故事" @click="SelectByType(bookType[15])"
                >人类故事</el-menu-item
              >
              <el-menu-item index="生物世界" @click="SelectByType(bookType[16])"
                >生物世界</el-menu-item
              >
            </el-submenu>
            <el-submenu index="4-2">
              <template slot="title">计算机/网络</template>
              <el-menu-item
                index="计算机理论"
                @click="SelectByType(bookType[17])"
                >计算机理论</el-menu-item
              >
              <el-menu-item index="数据库" @click="SelectByType(bookType[18])"
                >数据库</el-menu-item
              >
              <el-menu-item index="人工智能" @click="SelectByType(bookType[19])"
                >人工智能</el-menu-item
              >
              <el-menu-item
                index="网络与数据通信"
                @click="SelectByType(bookType[20])"
                >网络与数据通信</el-menu-item
              >
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <el-table :data="books" style="width: 100%" v-model="books">
          <el-table-column prop="name" label="书名"> </el-table-column>
          <el-table-column prop="author" label="作者"> </el-table-column>
          <el-table-column prop="price" label="价格"> </el-table-column>
          <el-table-column prop="remain" label="剩余"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click.native.prevent="checkDetail(scope.$index, scope.row)"
                >查看详情</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-shopping-cart-2"
              ></el-button>
              <el-button type="primary" @click.native.prevent="buy(scope.row)"
                >购买</el-button
              >　
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "book",
  inject: ['reload'],
  data () {
    return {
      bookType: ["研究生/本科/专科教材", "高职高专教材", "学历考试", "考研", "公务员", "汉语工具书", "英语工具书", "其他语种工具书",
        "中国当代小说", "中国古典小说", "外国小说", "中国儿童文学", "外国儿童文学", "绘本", "宇宙知识", "人类故事", "生物世界",
        "计算机理论", "数据库", "人工智能", "网络与数据通信"],
      author: ["东野圭吾", "村上春树", "曹文轩", "沈石溪", "郑渊洁"],
      books: [],
      activeIndex: '',
      handleSelect: '',
      userName: '张三'
    }
  },
  methods: {
    checkDetail (index, row) {
      this.$router.push({ name: "BookInfo", params: { bookinf: this.books[index] } })
    },
    SelectByType: function (val) {
      let type = new FormData()
      type.append('type', val)
      const that = this
      this.$axios.post('http://localhost:8181/book/selectBookByType', type).then(function (resp) {
        that.books = resp.data
      })
    },
    SelectByAuthor: function (val) {
      let author = new FormData()
      author.append('author', val)
      const that = this
      this.$axios.post('http://localhost:8181/book/selectBookByAuthor', author).then(function (resp) {
        that.books = resp.data
      })
    },
    buy (row) {

      let name = new FormData()
      name.append('name', row.name)
      const that = this
      this.$axios.post('http://localhost:8181/book/subInventory', name).then(resp => {
        if (resp.status == 200) {
          alert("购买" + row.name + "成功")
          that.SelectByType(row.type)
        } else {
          alert("购买" + row.name + "失败")
          that.SelectByType(row.type)
        }

      })
    },
  }
}

</script>

<style>
.top ul {
  list-style: none;
  margin: 0px, 0px;
  text-align: center;
}
.manage-header .search {
  margin: 5px;
  width: 400px;
}
.manage-header {
  padding: 5px;
}
</style>