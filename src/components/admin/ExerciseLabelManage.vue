<template>
  <div>
    <div>
      <div class="topBar_Class">
        <el-input
          v-model="select_word"
          size="mini"
          class="search_input"
          placeholder="请输入二级标签关键字"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button
          class="addButton_Class"
          size="small"
          type="primary"
          @click.native.prevent="addDialogvisiable()"
          >新建标签</el-button
        >
      </div>
    </div>

    <el-table
      :data="data"
      style="width: 100%"
      :row-style="{ height: '20px' }"
      stripe
      @filter-change="filterChange"
    >
      <el-table-column prop="exerciseLabelId" label="ID" width="180">
      </el-table-column>
      <el-table-column
        prop="firstPoint"
        label="一级标签"
        width="250"
        column-key="firstPoint"
        :filters="filtersListNew"
        :filter-multiple="false"
      >
      </el-table-column>
      <el-table-column prop="secondPoint" label="二级标签" width="860">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyExerciseLabel(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteConfirm(scope.row)"
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
        :total="this.exerciseLabelFilter.length"
        v-if="this.exerciseLabelFilter.length != 0"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="修改标签信息"
      :visible.sync="edittableDataVisible_modify"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="edittableData"
        :rules="edittableDataRules"
        ref="edittableData"
      >
        <el-form-item label="标签编号" prop="exerciseLabelId">
          <el-input
            v-model="edittableData.exerciseLabelId"
            :disabled="edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="一级标签" prop="firstPoint">
          <el-input v-model="edittableData.firstPoint"></el-input>
        </el-form-item>
        <el-form-item label="二级标签" prop="secondPoint">
          <el-input v-model="edittableData.secondPoint"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyExerciseLabelInfoDialog()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加标签"
      :visible.sync="edittableDataVisible_add"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addExerciseLabel"
        :model="addExerciseLabelData"
        :rules="addRules"
        class="addExerciseLabelForm"
      >
        <el-form-item label="一级标签" prop="firstPoint">
          <el-input v-model="addExerciseLabelData.firstPoint"></el-input>
        </el-form-item>
        <el-form-item label="二级标签" prop="secondPoint">
          <el-input v-model="addExerciseLabelData.secondPoint"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('addExerciseLabel')"
            >添加</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      exerciseLabel: [],
      exerciseLabelFilter: [],
      filtersList: [],
      filtersListNew: [],
      select_word: "",
      edittableData: {
        exerciseLabelId: '',
        firstPoint: '',
        secondPoint: '',
      },
      addExerciseLabelData: {
        firstPoint: '',
        secondPoint: '',
      },
      addRules: {
        firstPoint: [
          { required: true, message: '请输入一级标签名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }],
        secondPoint: [
          { required: true, message: '请输入二级标签名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度为1~20', trigger: 'blur' }]
      },
      edittableDataRules: {},
      edittableDataVisible_add: false,
      edittableDataVisible_modify: false,
      edit: true,
      currentPage: 1,
      pagesize: 8,
    }
  },
  mounted: function () {
    this.getExerciseLabel();//需要触发的函数

  },
  computed: {
    data () {
      return this.exerciseLabelFilter.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
    }

  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.exerciseLabelFilter = this.exerciseLabel;
      } else {
        this.exerciseLabelFilter = [];
        for (let item of this.exerciseLabel) {
          if (item.secondPoint.includes(this.select_word)) {
            this.currentPage = 1;
            this.exerciseLabelFilter.push(item);
          }
        }
      }
    },
  },
  methods: {
    modifyExerciseLabel (row) {
      this.edittableDataVisible_modify = true
      this.edittableData.exerciseLabelId = row.exerciseLabelId
      this.edittableData.firstPoint = row.firstPoint
      this.edittableData.secondPoint = row.secondPoint
      // console.log(row.secondPoint);
    },
    handleCurrent (val) {
      this.currentPage = val;
    },
    handleClose (done) {
      this.edittableDataVisible_add = false
      this.edittableDataVisible_modify = false
      this.addExerciseLabelData = new Object()
      // this.$refs.addClasses.clearValidate();
    },
    //一级标签的下拉筛选
    getfilters () {
      var _this = this;
      //数据处理：数组去重操作
      for (var i = 0; i < this.exerciseLabel.length; i++) {
        for (var j = i + 1; j < this.exerciseLabel.length; j++) {
          if (this.exerciseLabel[i].firstPoint === this.exerciseLabel[j].firstPoint) {
            ++i;
          }
        }
        _this.filtersList.push(this.exerciseLabel[i])
      }
      //数据处理：将对象的firstPoint属性改为filter需要的text和value属性
      _this.filtersListNew = _this.filtersList.map((item, index) => {
        return Object.assign({}, { 'text': item.firstPoint, 'value': item.firstPoint })
      })
    },
    addDialogvisiable () {
      this.edittableDataVisible_add = true
    },
    getExerciseLabel () {
      const that = this
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseLabel/queryExerciseLabelInfo',
      }).then(function (resp) {
        that.exerciseLabel = resp.data;
        that.exerciseLabelFilter = resp.data;
        that.getfilters();
      }).catch((res) => {
        console.log(res);
      })
    },
    modifyExerciseLabelInfoDialog () {
      let params = new URLSearchParams();
      params.append('exerciseLabelId', this.edittableData.exerciseLabelId);
      params.append('firstPoint', this.edittableData.firstPoint);
      params.append('secondPoint', this.edittableData.secondPoint);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseLabel/updateExerciseLabelInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('标签修改成功');
          this.edittableDataVisible_modify = false;
          this.getExerciseLabel();
        } else if (res.data == false) {
          this.$message.error('标签修改失败');
          this.edittableDataVisible_modify = false;
          this.getExerciseLabel();
        } else {
          this.$message.error('发生了错误');
          this.edittableDataVisible_modify = false;
          this.getExerciseLabel();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    deleteConfirm (row) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action === 'confirm') {
          this.deleteLabel(row.exerciseLabelId);
        }
      }).catch((resp) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        console.log(resp);
      });
    },
    deleteLabel (exerciseLabelId) {
      let params = new URLSearchParams();
      params.append('exerciseLabelId', exerciseLabelId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseLabel/deleteExerciseLabelInfo',
        data: params
      }).then((res) => {
        if (res.data == true) {
          this.$message.success('标签删除成功');
          this.getExerciseLabel();
        } else if (res.data == false) {
          this.$message.error('标签删除失败');
          this.getExerciseLabel();
        } else {
          this.$message.error('发生了错误');
          this.getExerciseLabel();
        }
      }).catch((res) => {
        console.log(res);
      })
    },
    add (addExerciseLabel) {
      var that = this;
      this.$refs[addExerciseLabel].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('firstPoint', this.addExerciseLabelData.firstPoint);
          params.append('secondPoint', this.addExerciseLabelData.secondPoint);
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/exerciseLabel/addExerciseLabelInfo',
            data: params
          }).then((res) => {
            if (res.data == '0') {
              console.log(res.data);
              this.$message.error('标签添加失败');
              this.edittableDataVisible_add = false;
              this.getExerciseLabel();
            } else {
              this.$message.success('标签添加成功');
              this.edittableDataVisible_add = false;
              this.getExerciseLabel();
              this.addExerciseLabelData = new Object()
            }
          })
        } else {
          this.$message.error('添加失败，请检查输入的内容后后重试');
        }
      })
    },
    resetDateFilter () {
      this.$refs.filterTable.clearFilter('firstPoint');
    },
    clearFilter () {
      this.$refs.filterTable.clearFilter();
    },
    formatter (row, column) {
      return row.address;
    },
    filterTag (value, row) {
      return row.tag === value;
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      // console.log(value);
      return row[property] === value;
    },
    filterChange (filters) {
      const filtersKey = filters.firstPoint;
      // console.log(filtersKey);
      if (filtersKey.length > 0) {
        this.exerciseLabelFilter = this.exerciseLabel.filter(data => {
          return Object.keys(data).some(key => {
            // console.log(data['firstPoint']);
            return data['firstPoint'] === filtersKey[0]
          })
        })
        // console.log(this.exerciseLabelFilter);
        return this.exerciseLabelFilter
      }
      this.exerciseLabelFilter = this.exerciseLabel
      return this.exerciseLabel
    }
  }
}
</script>
<style>
.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
}
.addButton_Class {
  float: right;
  margin-right: 25px;
}
.topBar_Class {
  margin-top: 10px;
}
.block {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>