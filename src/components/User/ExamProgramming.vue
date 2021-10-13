<template>
<div id='app'>
    <div class="paper-header">
      <el-form label-position="top" label-width="100px" :model="tempDataSource" style="padding-top:0px; ">
        <el-row>
          <el-col :span="4" :offset="1">
            <el-form-item label="试卷">
              XXX考试
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考生">
              123456
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="分数" v-if="this.type===2 || this.type===3">
              100
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考试时长">
              90分
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="倒计时间">
              <span class="downTime">{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="交卷时间" v-if="this.type===2 || this.type===3">
              xx
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="paper-content">
        <h1 style="text-align:center">编程题</h1>
        <div class='container'>
            <form>
            <div class="choiceTab" v-for="(item,index) in questions" :key="item.id">
                <!-- 题干 -->
                <div class="question">
                <span class="num">第{{index+1}}题</span>
                <div class="title">Problem Description</div>
                {{item.problemDescription}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Input</div>
                {{item.input}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Output</div>
                {{item.output}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Input</div>
                {{item.sampleInput}}
                <pre id="editor" style="height:10px"></pre>
                <div class="title">Sample Output</div>
                {{item.sampleOutput}}
                </div>
                <!-- 输入 -->
                <div class="head">
                <form role="form">
                    <div class="editor-header">
                    
                    <div class="code">
                        <el-table :data="tabledatas" border>
                        <el-table-column label="代码输入框">
                            <template slot-scope="scope">
                            <textarea placeholder="请输入代码" v-show="true" :rows="10" v-model="scope.row.tab"></textarea>
                            <!-- <span>{{scope.row.tab}}</span> -->
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    </div>
                </form>
                <pre id="editor" style="height:10px"></pre>
                <button class="btn btn-primary" onclick="submit()">提交</button>
                <pre style="height:15px"></pre>
                </div>
                <div class="clearfix"></div>
            </div>
            </form>
            <button type="button" class="sumb">提交试卷</button>
        </div>
    </div>
</div>
</template>
<script>
export default {
    computed: {
      hourString () {
        return this.hour < 10 ? '0' + this.hour : '' + this.hour
      },
      minuteString () {
        return this.minute < 10 ? '0' + this.minute : '' + this.minute
      },
      secondString () {
        return this.second < 10 ? '0' + this.second : '' + this.second
      }
    },
    mounted () {
        let remainTime=90*60;
        if (remainTime> 0) {
          this.hour = Math.floor((remainTime / 3600) % 24)
          this.minute = Math.floor((remainTime / 60) % 60)
          this.second = Math.floor(remainTime % 60)
          this.countDowm()
        }
    },
  name: 'app',
  data () {
    return {
        //倒计小时
        hour: '',
        //倒计分钟
        minute: '',
        //倒计秒
        second: '',
        //计时器
        promiseTimer: '',
      username: 'yzk',
      abcd: ['A', 'B', 'C', 'D'],
      questions: [
        {
          id: 1,
          problemDescription: 'Calculate A + B.',
          input: 'Each line will contain two integers A and B. Process to end of file.',
          output: 'For each case, output A + B in one line.',
          sampleInput: '1 1',
          sampleOutput: '2'
        },
        {
          id: 2,
          problemDescription: 'asdaw,da,wd,aw,d,awdawd,aw,d,aw,d',
          input: '',
          output: '',
          sampleInput: '',
          sampleOutput: ''
        }
      ],
      tabledatas: [
        { tab: '' }
      ]
    }
  },
  methods: {
      countDowm () {
        let self = this
        clearInterval(this.promiseTimer)
        this.promiseTimer = setInterval(function () {
          if(self.hour===0 && self.minute===0 && self.second===0)
          {
            self.disabledAnswer=true;
          }
          if (self.hour === 0) {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.second = 0
              self.$emit('countDowmEnd', true)
              clearInterval(self.promiseTimer)
            } else {
              self.second -= 1
            }
          } else {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.hour -= 1
              self.minute = 59
              self.second = 59
            } else {
              self.second -= 1
            }
          }
        }, 1000)
      },
  }
  
}
</script>
<style>
.question {
  text-align: left;
}
.title {
  font-size: 200%;
  color: rgb(0, 140, 255);
}
.num {
  font-size: 150%;
}
.examTitle {
  font-size: 200%;
  color: black;
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
.paper-header {
    width: 100%;
    height: 80px;
    background-color: #f7f7f7;
    position: absolute;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .1);
    -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .1);
  }
  .paper-content {
    position: absolute;
    left: 305px;
    top: 60px;
    right: 0px;
    bottom: 45px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #e4e4e4;
    border-top: none;
  }

  .downTime{
    color: rgb(230, 93, 110);
    font-size: 16px;
    font-weight: bold;
  }
</style>