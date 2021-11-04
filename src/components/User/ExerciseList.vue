<template>
  <div>
    <el-input
      v-model="select_word"
      size="mini"
      placeholder="习题标题"
      class="handle-input"
    >
    </el-input>
    <button @click="wwChange()">标签</button>
    <div v-if="ww" class="label">
      <div v-for="(i, o) in options" :key="o" style="float: left">
        <span style="margin-right: 500px">
          {{ i.label }}
        </span>
        <span
          v-for="(w, e) in options[o].children"
          :key="e"
          style="color: blue; cursor: pointer"
          @click="labelClick(w.label)"
        >
          {{ w.label }}
        </span>
      </div>
    </div>
    <el-table :data="data" style="width: 90%" class="tableclass" stripe>
      <el-table-column prop="exerciseId" label="习题编号"> </el-table-column>
      <el-table-column label="习题标题">
        <template slot-scope="scope">
          <router-link
            style="text-decoration: none; color: black"
            :to="{
              path: 'exerciseDetail',
              query: {
                exerciseId: scope.row.exerciseId,
              },
            }"
          >
            {{ scope.row.exerciseTitle }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="正确率" align="center">
        <template slot-scope="scope">
          {{
            getAcceptRate(
              scope.row.exerciseCorrectTimes,
              scope.row.exerciseSubmitTimes
            )
          }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="selectExercise.length"
        @current-change="handleCurrent"
        v-if="selectExercise.length != 0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      exercise: [
        {
          exerciseId: '',
          exerciseTitle: '',
          exerciseCorrectTimes: '',
          exerciseSubmitTimes: '',
          exerciseDescription: '',
          exerciseInput: '',
          exerciseOutPut: '',
          exerciseSampleInput: '',
          exerciseSampleOutput: '',
        }
      ],
      selectExercise: [],
      select_word: '',
      pageSize: 10,
      currentPage: 1,
      isPublish: false,
      selectBackWord: '',
      options: [],
      ww: false,
      labelChoice: [],
    }
  },
  watch: {
    immediate: true,
    select_word: function () {
      if (this.select_word == '') {
        this.selectExercise = this.exercise;
      } else {
        this.selectExercise = [];
        for (let item of this.exercise) {
          if (item.exerciseTitle.includes(this.select_word)) {
            this.currentPage = 1;
            //保存查询后页码为1
            sessionStorage.setItem("exerciseListCurrentPage", 1);
            sessionStorage.setItem("exerciseListSelectWord", this.select_word);
            this.selectExercise.push(item);
          }
        }
      }

    }
  },
  computed: {
    data () {
      return this.selectExercise.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },

  mounted: function () {
    if (sessionStorage.getItem("isPublish") == "false") {
      if (sessionStorage.getItem("exerciseListCurrentPage") != null) {
        this.currentPage = Number(sessionStorage.getItem("exerciseListCurrentPage"));
      }
      if (sessionStorage.getItem("exerciseListSelectWord") != null) {
        this.selectBackWord = sessionStorage.getItem("exerciseListSelectWord");
      }
    } else {
      sessionStorage.setItem("isPublish", "false");
    }

    //获取习题信息
    this.getExercise()
    //获取习题标签信息
    this.getFirstPointInfo()

  },



  methods: {
    //点击标签
    labelClick (secondPoint) {
      var i = 0;
      for (var o = 0; o < this.labelChoice.length; o++) {
        if (this.labelChoice[o].secondPoint == secondPoint) {
          this.labelChoice.splice(o, 1);
          i = 1;
        }
      }
      if (i == 0) {
        var label = new Object;
        label.secondPoint = secondPoint;
        this.labelChoice.push(label);
      }
      if (this.labelChoice.length == 0) {
        let params = new URLSearchParams();
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/exercise/queryExerciseInfo',
          data: params
        })
          .then((res) => {
            this.selectExercise = res.data;
            this.exercise = res.data;
          })
          .catch((err) => {
            this.$message.error('习题列表加载失败');

          })
      } else {
        let params = new URLSearchParams();
        params.append("labels", JSON.stringify(this.labelChoice))
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/exercise/queryExerciseInfoByFirstPoint',
          data: params
        })
          .then((res) => {
            this.selectExercise = res.data;
            this.exercise = res.data;
          })
          .catch((err) => {
            this.$message.error('习题标签加载失败');

          })
      }

    },
    wwChange () {
      this.ww = !this.ww;
    },
    //给sessionStorage存值
    setContextData: function (key, value) {
      if (typeof value == "string") {
        sessionStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    },
    // 从sessionStorage取值
    getContextData: function (key) {
      const str = sessionStorage.getItem(key);
      if (typeof str == "string") {
        try {
          return JSON.parse(str);
        } catch (e) {
          return str;
        }
      }
      return;
    },
    handleCurrent (val) {
      //保存页码信息
      sessionStorage.setItem("exerciseListCurrentPage", val);
      this.currentPage = val;
    },
    //获得习题比率
    getAcceptRate (exerciseCorrectTimes, exerciseSubmitTimes) {
      if (!(exerciseCorrectTimes / exerciseSubmitTimes == exerciseCorrectTimes / exerciseSubmitTimes)) {
        var acceptRate = 0 + "%" + "(" + exerciseCorrectTimes + "/" + exerciseSubmitTimes + ")";
      }
      else {
        var acceptRate = ((exerciseCorrectTimes / exerciseSubmitTimes) * 100).toFixed(2) + "%" + "(" + exerciseCorrectTimes + "/" + exerciseSubmitTimes + ")";
      }
      return acceptRate;
    },
    //获取习题列表
    getExercise () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exercise/queryExerciseInfo',
        data: params
      })
        .then((res) => {
          this.selectExercise = res.data;
          this.exercise = res.data;
          this.select_word = this.selectBackWord;
        })
        .catch((err) => {
          this.$message.error('习题列表加载失败');

        })
    },
    //获取第一点
    getFirstPointInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/label/queryLabelFirstPointInfo',
        data: params
      })
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            var firstPoint = new Object;
            firstPoint.label = res.data[i];
            firstPoint.children = [];
            this.options.push(firstPoint);
          }
          for (var i = 0; i < this.options.length; i++) {
            this.getSecondPointInfo(i);
          }
        })
        .catch((err) => {
          this.$message.error('失败1');
        })
    },
    //获取第二点
    getSecondPointInfo (i) {
      let params = new URLSearchParams();
      params.append("firstPoint", this.options[i].label)
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/label/queryLabelSecondPointInfo',
        data: params
      })
        .then((res) => {
          for (var o = 0; o < res.data.length; o++) {
            var secondPoint = new Object;
            secondPoint.label = res.data[o].secondPoint;
            secondPoint.value = res.data[o].labelId;
            this.options[i].children.push(secondPoint);
          }
        })
        .catch((err) => {
          this.$message.error('失败2');
        })
    }

  }
}
</script>

<style scoped>
.tableclass {
  margin-left: 5%;
}
.pagination {
  display: flex;
  justify-content: center;
}
.handle-input {
  width: 300px;
  display: inline-block;
  margin-left: 5%;
}
.label {
  width: 500px;
  height: 500px;
  position: absolute;
  top: 120px;
  background: white;
  z-index: 999;
  border-radius: 30px;
}
</style>