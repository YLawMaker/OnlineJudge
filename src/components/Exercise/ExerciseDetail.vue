<template>
   <div id='app'>
  <div class="examTitle" >{{exercise.exerciseTitle}}</div>
  <div class='container'>
    <form>
      <div class="main">
        <!-- 题干 -->
        <div class="question">
          <div class="title">
              Problem Description
          </div>
          <div class="nei" style="white-space:pre-wrap;">{{exercise.exerciseDescription}}</div>
          <pre id="editor" style="height:10px"></pre>
          <div class="title">Input</div>
          <div class="nei" style="white-space: pre-wrap;">{{exercise.exerciseInput}}</div>
          <pre id="editor" style="height:10px"></pre>
          <div class="title">Output</div>
         <div class="nei" style="white-space: pre-wrap;">{{exercise.exerciseOutPut}}</div>
          <pre id="editor" style="height:10px"></pre>
          <div class="title">Sample Input</div>
         <div class="nei" style="white-space: pre-wrap;">{{exercise.exerciseSampleInput}}</div>
          <pre id="editor" style="height:10px"></pre>
          <div class="title">Sample Output</div>
           <div class="nei" style="white-space: pre-wrap;">{{exercise.exerciseSampleOutput}}</div>
        </div>
        
         <div class="foot">
            <router-link
             style=" text-decoration: none;color:black"
                :to="{  
                    path: 'exerciseStatistics',     
                    query: {   
                        exerciseId:getExerciseId(), 
                        },  
                    }" 
                >
                习题统计
            </router-link>
            <router-link
            style=" text-decoration: none;color:black"
                :to="{  
                    path: 'submitCode',     
                    query: {   
                        exerciseId:getExerciseId(), 
                        },  
                    }" 
                >
                代码提交
            </router-link>
        </div>
      </div>
    </form>

   
  </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            exercise:{
                exerciseId:'',
                exerciseTitle:'',
                exerciseCorrectTimes:'',
                exerciseSubmitTimes:'',
                exerciseDescription:'',
                exerciseInput:'',
                exerciseOutPut:'',
                exerciseSampleInput:'',
                exerciseSampleOutput:'',
            },
         
        }
    },
    mounted: function () {
      this.exercise.exerciseId = this.$route.query.exerciseId
      this.getExerciseInfo();
    },
    methods:{
        getExerciseId(){
            return this.exercise.exerciseId;
        },
        getExerciseInfo(){
            let params=new URLSearchParams();
            params.append('exerciseId',this.exercise.exerciseId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/exercise/queryExerciseDetailsInfoByExerciseId',
                data: params
            })
            .then((res)=> {
                  this.exercise=res.data;
            })
            .catch((err)=> {
                this.$message.error('习题详情读取失败');
            })
        },
        
    }
}
</script>

<style>
.foot{
    margin-top: 10%;
}
.main{
    width: 60%;
    margin-left: 20%;
}
.question {
  text-align: left;
}

.title {
  font-size: 200%;
  color: #7CA9ED;
}
.nei{
    padding: 0 10px;
    width: 100%;
    background-color:lightblue;
}
.num {
  font-size: 150%;
}
.examTitle {
  text-align: center;
  font-size: 200%;
  color: #7CA9ED;
}
.code {
  width: 100%;
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
}
.code textarea {
  width: 100%;
  margin: 0.75rem  0;
  border: none;
  outline: none;
  padding-left: 1.125rem;
  height: 16.5rem;
}
</style>