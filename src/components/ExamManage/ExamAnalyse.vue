<template>
  <el-card>
    <div>
      <div id="chart" style="display: none"></div>

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
    }
  },
  mounted: function () {

    this.examId = this.$route.query.examIdfromManage
    this.anaylseScoreAndSection()
    this.getExamExerciseScore()
    this.getExamUserJoinInfo()
    this.getHistory()
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
        console.log(resp.data);
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
          data: ['优秀', '良好', '中等', '及格', '不及格',]
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
          if (tagName === "img2") return [400, 250];
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
          test: that.test,
          table_2: that.tableData_2
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
        // console.log(resp.data);
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
</style>