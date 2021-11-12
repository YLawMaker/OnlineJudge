<template>
  <div>
       <div class="main">
            <!-- 题干 -->
            <div class="question">
                <div class="title">
                    Problem Description
                </div>
                <div class="nei" style="white-space:pre-wrap;">{{testExerciseDetail.exerciseDescription}}</div>
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Input</div>
                <div class="nei" style="white-space: pre-wrap;">{{testExerciseDetail.exerciseInput}}</div>
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Output</div>
                <div class="nei" style="white-space: pre-wrap;">{{testExerciseDetail.exerciseOutPut}}</div>
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Input</div>
                <div class="nei" style="white-space: pre-wrap;">{{testExerciseDetail.exerciseSampleInput}}</div>
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Output</div>
                <div class="nei" style="white-space: pre-wrap;">{{testExerciseDetail.exerciseSampleOutput}}</div>
            </div>

            <div class="foot">
                <router-link
                style=" text-decoration: none;color:black"
                    :to="{      
                        path: 'testCodeSubmit',     
                        query: {   
                            testProgrammingQuestionId:getTestProgrammingQuestionId(), 
                            },  
                        }" 
                    >
                    代码提交
                </router-link>
        </div>
        </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            testProgrammingQuestionId:'',
            testExerciseDetail:{
                exerciseId:'',
                exerciseDescription:'',
                exerciseInput:'',
                exerciseOutPut:'',
                exerciseSampleInput:'',
                exerciseSampleOutput:'',
            },
        }
    },
    mounted: function(){
        this.testProgrammingQuestionId=this.$route.query.testProgrammingQuestionId;     
        this.getTestExerciseDetail();
    },
    methods:{
        //获得测试编程题编号
        getTestProgrammingQuestionId(){
            return this.testProgrammingQuestionId;
        },
        //获取测试编程题信息
        getTestExerciseDetail(){
            let params=new URLSearchParams();
            params.append('testProgrammingQuestionId',this.testProgrammingQuestionId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/testProgramming/queryExerciseByTestProgrammingQuestionId',
                data: params
            })
            .then((res)=> {
                  this.testExerciseDetail=res.data;
            })
            .catch((err)=> {
                this.$message.error('测试编程题读取失败');
            })
        }
    }
}
</script>

<style>
.question {
  text-align: left;
}

.title {
  font-size: 200%;
  color: #7CA9ED;
}

.main{
    width: 60%;
    margin-left: 20%;
}
.foot{
    margin-top: 10%;
}
</style>