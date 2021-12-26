<template>
  <div>
    <el-table
      :data="exerciseStatisticsInfo"
      style="width: 90%"
      class="tableclass"
      stripe
    >
      <el-table-column label="名次">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="user.userName" label="个人姓名"> </el-table-column>
      <el-table-column prop="exerciseSubmitLanguage" label="语言">
      </el-table-column>
      <el-table-column prop="exerciseSubmitTime" label="提交时间">
      </el-table-column>
    </el-table>
    <div id="myChart" :style="{ width: '600px', height: '300px' }"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      exercise: {
        exerciseId: '',
      },
      exerciseStatisticsInfo: [
        {
          exerciseSubmitLanguage: '',
          exerciseSubmitTime: '',
          user: {
            userName: '',
          },
        },
      ],
      exerciseResultInfo: [


      ],


    }
  },
  mounted: function () {
    this.exercise.exerciseId = this.$route.query.exerciseId;
    //获取习题统计信息
    this.getExerciseStatisticsInfo();
    //获取习题结果信息
    this.getResultInfo();
  },
  methods: {
    //画图表
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      var resultInfo = [];
      for (var i = 0; i < this.exerciseResultInfo.length; i++) {
        var obj = new Object();
        obj.name = this.exerciseResultInfo[i].exerciseResult;
        obj.value = this.exerciseResultInfo[i].number;
        var itemStyle = new Object();
        switch (obj.name) {
          case "accept":
            itemStyle.color = '#00ff00';
            obj.itemStyle = itemStyle;
            break;
          case "wrong answer":
            itemStyle.color = 'red';
            obj.itemStyle = itemStyle;
            break;
          case "time-limit exceeded":
            itemStyle.color = 'blue';
            obj.itemStyle = itemStyle;
            break;
          case "compile error":
            itemStyle.color = 'yellow';
            obj.itemStyle = itemStyle;
            break;
          case "system error!":
            itemStyle.color = 'green';
            obj.itemStyle = itemStyle;
            break;
        };
        resultInfo[i] = obj;
      }
      var option = {

        series: [
          {
            type: 'pie',
            data: resultInfo,
          }
        ]
      }
      console.log(resultInfo)
      myChart.setOption(option);


    },
    //获取习题统计信息
    getExerciseStatisticsInfo () {
      let params = new URLSearchParams();
      params.append('exerciseId', this.exercise.exerciseId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseHistory/queryExerciseStatisticsInfo',
        data: params
      })
        .then((res) => {
          this.exerciseStatisticsInfo = res.data;
        })
        .catch((err) => {
          this.$message.error('查询习题统计信息失败');
        })
    },
    //获取习题结果信息
    getResultInfo () {
      let params = new URLSearchParams();
      params.append('exerciseId', this.exercise.exerciseId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/exerciseHistory/queryExerciseResultInfo',
        data: params
      })
        .then((res) => {
          this.exerciseResultInfo = res.data;
          console.log(this.exerciseResultInfo)
          this.drawLine();
        })
        .catch((err) => {
          this.$message.error('查询习题结果信息失败');
        })
    }
  }
}
</script>

<style>
</style>