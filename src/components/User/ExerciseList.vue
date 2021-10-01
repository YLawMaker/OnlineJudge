<template>
  <div>
    <el-input
      v-model="select_word"
      size="mini"
      placeholder="习题标题"
      class="handle-input"
    >
    </el-input>
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
            {{ scope.row.exerciseTitle}}
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
        v-if="selectExercise.length!=0"
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
      isPublish:false,
      selectBackWord:'',
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
            sessionStorage.setItem("exerciseListCurrentPage",1);
            sessionStorage.setItem("exerciseListSelectWord",this.select_word);
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
     if(sessionStorage.getItem("isPublish")=="false"){
        if(sessionStorage.getItem("exerciseListCurrentPage")!=null){
          this.currentPage=Number(sessionStorage.getItem("exerciseListCurrentPage"));
        }
        if(sessionStorage.getItem("exerciseListSelectWord")!=null){
          this.selectBackWord=sessionStorage.getItem("exerciseListSelectWord");
        }
      }else{
          sessionStorage.setItem("isPublish","false");
      }
    
    this.getExercise()
     
  },

  

  methods: {
      
    //给sessionStorage存值
    setContextData: function(key, value) { 
      if(typeof value == "string"){
        sessionStorage.setItem(key, value);
      }else{
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    },
    // 从sessionStorage取值
    getContextData: function(key){
      const str = sessionStorage.getItem(key);
      if( typeof str == "string" ){
        try{
          return JSON.parse(str);
        }catch(e) {
          return str;
        }
      }
      return;
    },
    handleCurrent (val) {
      //保存页码信息
      sessionStorage.setItem("exerciseListCurrentPage",val);
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
          this.select_word=this.selectBackWord;
        })
        .catch((err) => {
          this.$message.error('习题列表加载失败');

        })
    },
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
</style>