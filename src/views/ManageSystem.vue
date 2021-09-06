<template>
  <div class="app">
    <div class="top">
      <ul>
        <li>欢迎来到图书商城后台管理系统</li>
      </ul>
    </div>
    <el-container style="height: 652px; border: 1px solid #eee">
      <el-aside
        class="manage-side"
        width="200px"
        style="background-color: rgb(238, 241, 246)"
      >
        <div>
          <el-menu default-active="2">
            <el-menu-item index="1" disabled>
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">用户管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">商品管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">订单管理</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="manage-header">
          <el-input
            class="search"
            v-model="searchInput"
            placeholder="请输入书籍名称"
            clearable
          ></el-input>
          <el-button type="primary" @click="searchButton">搜索</el-button>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加书籍</el-button
          >
        </el-header>

        <el-main class="manage-body">
          <template>
            <el-table :data="books">
              <el-table-column prop="name" label="书名"> </el-table-column>
              <el-table-column prop="author" label="作者"> </el-table-column>
              <el-table-column prop="price" label="价格"> </el-table-column>
              <el-table-column prop="type" label="类型"> </el-table-column>
              <el-table-column prop="remain" label="剩余"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="modifyBook(scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    type="danger"
                    @click.native.prevent="delBook(scope.row)"
                    >删除
                  </el-button>
                  　
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="添加书籍"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddBook"
    >
      <el-form
        :model="addBook"
        :rules="addBookRules"
        ref="addBookRef"
        label-width="100px"
      >
        <el-form-item label="书名" prop="name">
          <el-input v-model="addBook.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="addBook.author"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addBook.price"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addBook.type" filterable placeholder="请选择">
            <el-option
              v-for="item in bookType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余" prop="remain">
          <el-input v-model="addBook.remain"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="increaseBook">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改书籍"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="resetModifyBook"
    >
      <el-form
        :model="modifyBooks"
        :rules="modifyBookRules"
        ref="modifyBookRef"
        label-width="100px"
      >
        <el-form-item label="书名" prop="name">
          <el-input v-model="modifyBooks.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="modifyBooks.author"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="modifyBooks.price"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="modifyBooks.type" filterable placeholder="请选择">
            <el-option
              v-for="item in bookType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余" prop="remain">
          <el-input v-model="modifyBooks.remain"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyBookButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchInput: '',
      addDialogVisible: false,
      modifyDialogVisible: false,
      user: [],
      books: [],
      addBook: {
        name: '',
        author: '',
        price: '',
        type: '',
        remain: ''
      },
      modifyBooks: {
        name: '',
        author: '',
        price: '',
        type: '',
        remain: ''
      },
      bookType: [
        {
          value: '研究生/本科/专科教材',
          label: '研究生/本科/专科教材'
        },
        {
          value: '高职高专教材',
          label: '高职高专教材'
        },
        {
          value: '学历考试',
          label: '学历考试'
        },
        {
          value: '考研',
          label: '考研'
        },
        {
          value: '公务员',
          label: '公务员'
        },
        {
          value: '汉语工具书',
          label: '汉语工具书'
        },
        {
          value: '英语工具书',
          label: '英语工具书'
        },
        {
          value: '其他语种工具书',
          label: '其他语种工具书'
        },
        {
          value: '中国当代小说',
          label: '中国当代小说'
        },
        {
          value: '中国古典小说',
          label: '中国古典小说'
        },
        {
          value: '外国小说',
          label: '外国小说'
        },
        {
          value: '中国儿童文学',
          label: '中国儿童文学'
        },
        {
          value: '外国儿童文学',
          label: '外国儿童文学'
        },
        {
          value: '绘本',
          label: '绘本'
        },
        {
          value: '宇宙知识',
          label: '宇宙知识'
        },
        {
          value: '人类故事',
          label: '人类故事'
        },
        {
          value: '生物世界',
          label: '生物世界'
        },
        {
          value: '计算机理论',
          label: '计算机理论'
        }, {
          value: '数据库',
          label: '数据库'
        },
        {
          value: '人工智能',
          label: '人工智能'
        },
        {
          value: '网络与数据通信',
          label: '网络与数据通信'
        },
      ],
      addBookRules: {
        name: [
          { required: true, message: '请输入书名', trigger: 'blur' },
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        remain: [
          { required: true, message: '请输入库存量', trigger: 'blur' },
        ],
      },
      modifyBookRules: {
        name: [
          { required: true, message: '请输入书名', trigger: 'blur' },
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        remain: [
          { required: true, message: '请输入库存量', trigger: 'blur' },
        ],
      }
    }
  },
  created () {
    this.selectBooks()
  },
  methods: {
    selectBooks: function () {
      const that = this
      this.$axios.post('http://localhost:8181/book/selectBooks').then(function (resp) {
        that.books = resp.data
      })
    },
    searchButton () {
      // alert(this.searchInput)
      let name = new FormData()
      name.append('name', this.searchInput)
      const that = this
      this.$axios.post('http://localhost:8181/book/serachBooks', name).then(function (resp) {
        that.books = resp.data
      })
    },
    increaseBook () {
      let book = new FormData();
      book.append('name', this.addBook.name)
      book.append('author', this.addBook.author)
      book.append('price', this.addBook.price)
      book.append('type', this.addBook.type)
      book.append('remain', this.addBook.remain)
      this.$axios.post('http://localhost:8181/book/addBook', book).then(resp => {
        if (resp.status == 200) {
          alert("添加书籍成功")
          this.addDialogVisible = false
          this.selectBooks()
        } else {
          alert("添加书籍失败")
          this.addDialogVisible = false
          this.selectBooks()
        }
      })

    },
    resetAddBook () {
      this.$refs.addBookRef.resetFields()
    },
    resetModifyBook () {
      this.$refs.modifyBookRef.resetFields()
    },
    delBook (row) {
      let name = new FormData()
      name.append('name', row.name)
      const that = this
      this.$axios.post('http://localhost:8181/book/delBook', name).then(resp => {
        if (resp.status == 200) {
          alert("删除" + row.name + "成功")
          that.selectBooks()
        } else {
          alert("删除" + row.name + "失败")
          that.selectBooks()
        }
      })
    },
    modifyBook (row) {
      this.modifyDialogVisible = true
      this.modifyBooks.name = row.name
      this.modifyBooks.author = row.author
      this.modifyBooks.price = row.price
      this.modifyBooks.type = row.type
      this.modifyBooks.remain = row.remain
    },
    modifyBookButton () {
      let book = new FormData()
      book.append('name', this.modifyBooks.name)
      book.append('author', this.modifyBooks.author)
      book.append('price', this.modifyBooks.price)
      book.append('type', this.modifyBooks.type)
      book.append('remain', this.modifyBooks.remain)
      this.$axios.post('http://localhost:8181/book/updateBook', book).then(resp => {
        if (resp.status == 200) {
          alert("修改书籍成功")
          this.modifyDialogVisible = false
          this.selectBooks()
        } else {
          alert("修改书籍失败")
          this.modifyDialogVisible = false
          this.selectBooks()
        }
      })

    }
  }
}
</script>

<style>
.top ul {
  list-style: none;
  margin: 0px, 0px;
}
.manage-header .search {
  margin: 5px;
  width: 400px;
}
.manage-header {
  padding: 5px;
}
</style>