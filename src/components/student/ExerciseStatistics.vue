<template>
  <div>
       <el-table :data="exerciseStatisticsInfo" style="width: 90%" class="tableclass" stripe>
          <el-table-column  label="名次" prop="studentName">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
        </el-table-column>
        <el-table-column prop="student.studentName" label="个人姓名"  >
        </el-table-column>
       <el-table-column prop="exerciseSubmitLanguage" label="语言"  >
        </el-table-column>
        <el-table-column prop="exerciseSubmitTime" label="提交时间"  >
        </el-table-column>
        
     </el-table>
     <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
  </div>
</template>

<script>
export default {
    data(){
        return{
           exercise:{
                    exerciseId:'',
            },
            exerciseStatisticsInfo:[
                {
                    exerciseSubmitLanguage:'',
                    exerciseSubmitTime:'',
                    student:{
                        studentName:'',
                    },
                },
            ],
            

            charts: '',
                opinion:['男','女'],
                opinionData:[
                  {value:335, name:'男'},
                  {value:310, name:'女'},
                
                ]

        }
    },
    mounted: function () {
      this.exercise.exerciseId = this.$route.query.exerciseId;
      this.getExerciseStatisticsInfo();
      this.drawLine();
    },
    methods:{
        drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
       myChart.setOption({
                series: [
                {
                    type: 'pie',
                    data: [
                    {
                        value: 335,
                        name: '直接访问'
                    },
                    {
                        value: 234,
                        name: '联盟广告'
                    },
                    {
                        value: 1548,
                        name: '搜索引擎'
                    }
                    ]
                }
                ]
               })


    },
    
        getExerciseStatisticsInfo(){
            let params=new URLSearchParams();
            params.append('exerciseId',this.exercise.exerciseId);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/exerciseHistory/queryExerciseStatisticsInfo',
                data: params
            })
            .then((res)=> {
                  this.exerciseStatisticsInfo=res.data;
                  console.log(this.exerciseStatisticsInfo);
            })
            .catch((err)=> {
                this.$message.error('系统错误请稍后再尝试');
            })
        }
    }
}
</script>

<style>

</style>