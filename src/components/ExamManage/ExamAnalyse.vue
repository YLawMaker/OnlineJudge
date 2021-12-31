<template>
  <el-card>
    <div>
      <div id="chart" style="display: none"></div>
      <div id="chart1" style="display: none"></div>

      <div class="topBar_analyse">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          round
          plain
          @click.native.prevent="importWord()"
          >导出分析</el-button
        >
      </div>
      <br />
      <br />
      <el-row>
        <el-col :span="8" class="examUserInfo"
          >应考人数:{{ this.examUserJoin.examUser }}</el-col
        >
        <el-col :span="8" class="examUserInfo"
          >实考人数:{{ this.examUserJoin.examSubmitUser }}</el-col
        >
        <el-col :span="8" class="examUserInfo"
          >缺考人数:{{ this.examUserJoin.examNotSubmitUser }}</el-col
        >
      </el-row>
      <div>
        <el-table :data="averageScore">
          <el-table-column label="各题型平均分" align="center">
            <el-table-column
              label="选择题"
              prop="averageChoice"
            ></el-table-column>
            <el-table-column
              label="填空题"
              prop="averageCompletion"
            ></el-table-column>
            <el-table-column
              label="程序设计题"
              prop="averageProgramming"
            ></el-table-column>
            <el-table-column
              label="考试平均分"
              prop="averageTotal"
            ></el-table-column>
          </el-table-column>
        </el-table>
        <br />
        <el-table :data="numberInEachSection">
          <el-table-column label="各分段人数" align="center">
            <el-table-column label="60以下" prop="below60"></el-table-column>
            <el-table-column
              label="60~69"
              prop="between60and69"
            ></el-table-column>
            <el-table-column
              label="70~79"
              prop="between70and79"
            ></el-table-column>
            <el-table-column
              label="80~89"
              prop="between80and89"
            ></el-table-column>
            <el-table-column label="90及以上" prop="above89"></el-table-column>
          </el-table-column>
        </el-table>
        <br />
        <el-table :data="examExerciseScore">
          <el-table-column label="各程序设计题平均分" align="center">
            <el-table-column
              label="序号"
              type="index"
              width="100"
            ></el-table-column>
            <el-table-column
              label="题目"
              prop="exerciseTitle"
            ></el-table-column>
            <el-table-column
              label="平均分"
              prop="avgExamProgrammingScore"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<script>
import { log } from 'console';
import ecStat from 'echarts-stat';
const echarts = require('echarts');

export default {
  data () {
    return {
      averageScore: [{
        averageChoice: 0,
        averageCompletion: 0,
        averageProgramming: 0,
        averageTotal: 0,
      }],
      numberInEachSection: [{
        below60: 0,
        between60and69: 0,
        between70and79: 0,
        between80and89: 0,
        above89: 0,
        total: 0
      }],
      candidateScore: [],
      examExerciseScore: [],
      should: 10,
      actual: 9,
      examId: 0,
      img1: '',
      test: '2018213556',
      tableData_2: {
        totalNumber: 0,
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        percent1: 0,
        percent2: 0,
        percent3: 0,
        percent4: 0,
        percent5: 0,
      },
      examUserJoin: {},
      history: [],
      anaylse: [],
      a1: [],
      a2: [],
      a3: [],
      a4: [],
      userScoreHistory: [],
      linearResult: [],
      linearImg: [],
      imgResult: [],
    }
  },
  mounted: function () {

    this.examId = this.$route.query.examIdfromManage
    this.anaylseScoreAndSection()
    this.getExamExerciseScore()
    this.getExamUserJoinInfo()
    this.getHistory()
    this.getUserProgramminngScore()
  },
  methods: {
    anaylseScoreAndSection () {
      const that = this
      //考生总数
      var totalNum = 0
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamRankById',
        data: params
      }).then(function (resp) {
        // console.log(resp.data);
        that.candidateScore = resp.data;

        for (var i = 0; i < resp.data.length; i++) {
          that.averageScore[0].averageChoice = that.averageScore[0].averageChoice + resp.data[i].examChoiceQuestionTotals
          that.averageScore[0].averageCompletion = that.averageScore[0].averageCompletion + resp.data[i].examCompletionQuestionTotals
          that.averageScore[0].averageProgramming = that.averageScore[0].averageProgramming + resp.data[i].examProgrammingTotals
          that.candidateScore[i].examTotals = that.candidateScore[i].examChoiceQuestionTotals + that.candidateScore[i].examCompletionQuestionTotals + that.candidateScore[i].examProgrammingTotals
          totalNum = totalNum + 1
        };
        // console.log(that.candidateScore);
        that.averageScore[0].averageChoice = (that.averageScore[0].averageChoice) / totalNum
        that.averageScore[0].averageCompletion = (that.averageScore[0].averageCompletion) / totalNum
        that.averageScore[0].averageProgramming = (that.averageScore[0].averageProgramming) / totalNum
        that.averageScore[0].averageTotal = that.averageScore[0].averageChoice + that.averageScore[0].averageCompletion + that.averageScore[0].averageProgramming
        for (var i = 0; i < that.candidateScore.length; i++) {
          if (that.candidateScore[i].examTotals < 60) {
            that.numberInEachSection[0].total++;
            that.numberInEachSection[0].below60++;
          } else if (that.candidateScore[i].examTotals >= 60 && that.candidateScore[i].examTotals < 70) {
            that.numberInEachSection[0].total++;
            that.numberInEachSection[0].between60and69++;
          } else if (that.candidateScore[i].examTotals >= 70 && that.candidateScore[i].examTotals < 80) {
            that.numberInEachSection[0].total++;
            that.numberInEachSection[0].between70and79++;
          } else if (that.candidateScore[i].examTotals >= 80 && that.candidateScore[i].examTotals < 90) {
            that.numberInEachSection[0].total++;
            that.numberInEachSection[0].between80and89++;
          } else {
            that.numberInEachSection[0].total++;
            that.numberInEachSection[0].above89++;
          }
        }
        that.tableData_2.totalNumber = that.numberInEachSection[0].total;
        that.tableData_2.level1 = that.numberInEachSection[0].above89;
        that.tableData_2.level2 = that.numberInEachSection[0].between80and89;
        that.tableData_2.level3 = that.numberInEachSection[0].between70and79;
        that.tableData_2.level4 = that.numberInEachSection[0].between60and69;
        that.tableData_2.level5 = that.numberInEachSection[0].below60;
        that.tableData_2.percent1 = that.tableData_2.level1 / that.tableData_2.totalNumber * 100
        that.tableData_2.percent2 = that.tableData_2.level2 / that.tableData_2.totalNumber * 100
        that.tableData_2.percent3 = that.tableData_2.level3 / that.tableData_2.totalNumber * 100
        that.tableData_2.percent4 = that.tableData_2.level4 / that.tableData_2.totalNumber * 100
        that.tableData_2.percent5 = that.tableData_2.level5 / that.tableData_2.totalNumber * 100
        that.drawGradeLevelPhoto()

      })
    },
    getExamExerciseScore () {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examQuestion/queryExamProgrammingResultScoreByExamId',
        data: params
      }).then(function (resp) {
        // console.log(resp.data);
        that.examExerciseScore = resp.data
        that.examExerciseScore.forEach(function (item) {
          if (item.avgExamProgrammingScore == null) {
            item.avgExamProgrammingScore = 0;
          }
        })
      })
    },
    //查询考试用户参加情况
    getExamUserJoinInfo () {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      // console.log(this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamUserJoinInfo',
        data: params
      }).then(function (resp) {
        that.examUserJoin = resp.data
      })
    },
    drawGradeLevelPhoto () {
      var that = this
      var myChart = echarts.init(document.getElementById('chart'), null, {
        width: 500,
        height: 500
      });
      var gradeLevel;
      var d = [0, 0, 0, 0, 0]
      //echart获取分段人数数据
      d[0] = that.numberInEachSection[0].below60
      d[1] = that.numberInEachSection[0].between60and69
      d[2] = that.numberInEachSection[0].between70and79
      d[3] = that.numberInEachSection[0].between80and89
      d[4] = that.numberInEachSection[0].above89

      gradeLevel = {
        color: ['#4F81BD'],
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'black',
              width: 1
            }
          },
          data: ['不及格', '及格', '中等', '良好', '优秀']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'black',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 0.5,
              color: 'black',
            }
          },
        },
        series: [
          {
            data: d,
            type: 'bar',
            barWidth: '50 %',
            animation: false
          }
        ],
      }
      myChart.setOption(gradeLevel);
      myChart.resize()
      that.img1 = myChart.getDataURL({
        pixelRatio: 2,      // 导出的图片分辨率比例，默认为 1。
        backgroundColor: '#fff'   // 导出的图片背景色，默认使用 option 里的 backgroundColor
      })
      // console.log(that.img1);
    },
    drawLinearRegressionPhoto (result, i) {
      echarts.registerTransform(ecStat.transform.regression);
      var that = this
      var myChart = echarts.init(document.getElementById('chart1'), null, {
        width: 500,
        height: 500
      });
      var linear;
      linear = {
        dataset: [
          {
            source: result
          },
          {
            transform: {
              type: 'ecStat:regression',
              // 'linear' by default.
              // config: { method: 'linear', formulaOn: 'end'}
              // print: true
            }
          }
        ],
        title: {
          text: '题目' + i,
          // subtext: 'By ecStat.regression',
          sublink: 'https://github.com/ecomfe/echarts-stat',
          left: 'center'
        },
        legend: {
          bottom: 5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            // name: 'scatter',
            type: 'scatter'
          },
          {
            // name: 'line',
            type: 'line',
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 16 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
          }
        ]
      };
      myChart.setOption(linear);
      myChart.resize()
      var t
      t = myChart.getDataURL({
        pixelRatio: 2,      // 导出的图片分辨率比例，默认为 1。
        backgroundColor: '#fff'   // 导出的图片背景色，默认使用 option 里的 backgroundColor
      })
      that.linearImg.push(t)

    },
    //点击导出
    importWord () {
      // 这里要引入处理图片的插件，下载docxtemplater后，引入的就在其中了
      var ImageModule = require('docxtemplater-image-module-free');
      var JSZipUtils = require('jszip-utils')
      var PizZip = require('pizzip')
      var Docxtemplater = require('docxtemplater')
      var fs = require("fs");
      var expressions = require("angular-expressions");
      var saveAs = require('file-saver')

      const that = this
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent('formwork.docx', function (error, content) {
        // formwork.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error
        };
        expressions.filters.size = function (input, width, height) {
          return {
            data: input,
            size: [width, height],
          };
        };
        function angularParser (tag) {
          const expr = expressions.compile(tag.replace(/’/g, "'"));
          return {
            get (scope) {
              return expr(scope);
            },
          };
        }
        // 图片处理
        let opts = {}
        opts.centered = true;  // 图片居中，在word模板中定义方式为{%%image}
        opts.fileType = "docx";
        opts.getImage = (chartId) => {
          return that.base64DataURLToArrayBuffer(chartId);
        }
        opts.getSize = function (img, tagValue, tagName) {
          //自定义指定图像大小，此处可动态调试各别图片的大小
          if (tagName === "imgN") return [400, 250];
          return [400, 400];
        }
        let imageModule = new ImageModule(opts)
        // 创建一个PizZip实例，内容为模板的内容
        const zip = new PizZip(content)
        // 创建并加载docxtemplater实例对象
        const doc = new Docxtemplater()
        doc.attachModule(imageModule);
        // console.log(opts);
        doc.loadZip(zip);
        // 设置模板变量的值
        doc.setData({
          img1: that.img1,
          linearImg1: that.linearImg[0],
          linearImg2: that.linearImg[1],
          linearImg3: that.linearImg[2],
          linearImg4: that.linearImg[3],
          linearImg5: that.linearImg[4],
          linearImg6: that.linearImg[5],
          linearImg7: that.linearImg[6],
          linearImg8: that.linearImg[7],
          table_2: that.tableData_2,
          r1: that.a1.toString(),
          r2: that.a2.toString(),
          r3: that.a3.toString(),
          r4: that.a4.toString()
        })
        try {
          // 用模板变量的值替换所有模板变量
          doc.render()
        } catch (error) {
          // 抛出异常
          const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          }
          console.log(JSON.stringify({ error: e }))
          throw error
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, '输出结果.docx')
      })

    },
    // 导出echarts图片，格式转换，官方自带，不需要修改
    base64DataURLToArrayBuffer (dataURL) {
      const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
      if (!base64Regex.test(dataURL)) {
        return false;
      }
      const stringBase64 = dataURL.replace(base64Regex, "");
      let binaryString;
      if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
      } else {
        binaryString = new Buffer(stringBase64, "base64").toString("binary");
      }
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes.buffer;
    },
    getHistory () {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      // console.log(this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamHistoryInfo',
        data: params
      }).then(function (resp) {
        that.anaylse = resp.data
        // console.log(that.anaylse);
        for (var i = 0; i < 4; i++) {
          that.anaylse[i].points.forEach((item, index) => {
            if (i == 0) {
              that.a1.push(item.user.userName)
            } else if (i == 1) {
              that.a2.push(item.user.userName)
            } else if (i == 2) {
              that.a3.push(item.user.userName)
            } else {
              that.a4.push(item.user.userName)
            }
          })
        }
        // console.log(that.a1.toString());
        // console.log(that.anaylse[1].points[0].user.userName);
        // console.log(resp.data);
      })
    },
    getUserProgramminngScore () {
      const that = this
      let params = new URLSearchParams();
      params.append('examId', this.examId);
      // console.log(this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examHistory/queryExamUserProgrammingQuestionScoreInfoDrawInfo',
        data: params
      }).then(function (resp) {
        let arr = resp.data
        // console.log(resp.data);
        let temp = []
        let l = arr[0].examProgrammingTotalAndScores.length
        let arrNew = []
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr[i].examProgrammingTotalAndScores.length; j++) {
            temp.push(arr[i].examProgrammingTotalAndScores[j].total)
            temp.push(arr[i].examProgrammingTotalAndScores[j].score)
            arrNew.push(temp)
            temp = []
          }
        }
        var result = []
        // console.log(l);
        for (var i = 0; i < arrNew.length; i += l) {
          result.push(arrNew.slice(i, i + l))
        }
        that.linearResult = result

        // JSON.stringify
        // console.log(JSON.stringify(that.linearResult[0]));
        for (var i = 0; i < that.linearResult.length; i++) {
          that.drawLinearRegressionPhoto(result[i], i + 1)
          that.imgResult[i] = new Object()
          that.imgResult[i].img = that.linearImg[i]
        }
        // that.imgResult = JSON.stringify(that.imgResult)
        // that.imgResult = { 'image': that.imgResult }
        // console.log(that.linearImg[1],);
        // console.log(that.imgResult);
      })
    }
  }
}
</script>

<style scoped>
.topBar_analyse {
  float: right;
  margin-bottom: 10px;
  margin-right: 25px;
}
.examUserInfo {
  text-align: center;
  background-color: #f5f7fa;
}
.el-card {
  border: 1px solid #7c7979;
}
</style>