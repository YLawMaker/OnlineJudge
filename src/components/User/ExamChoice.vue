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
      <h1 style="text-align:center">选择题</h1>
      <div class='container'>
        <form>
          <div class="choiceTab" v-for="(item,index) in questions" :key="item.id">
            <!-- 题干 -->
            <div class="question">
              <span class="num">{{index+1}}、</span>
              {{item.tiMu}}
            </div>
            <!-- 选项 -->
            <div class="option">
              <ul>
                <li class="xuanXiang" v-for="(tiao,i) in item.xuanXiang" :key="tiao" :class="{'double-line':false}">
                  <input type="radio" v-model="item.picked_radio" v-bind:value="abcd[i]"/>
                  {{abcd[i]}} {{tiao}}
                </li>
              </ul>
            </div>
            <div class="clearfix"></div>
          </div>
        </form>
        <button type="button" class="sumb">提交</button>
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
          picked_radio: '',
          tiMu: '1*8=?',
          xuanXiang: ['2', '6', '8', '10']
        },
        {
          id: 2,
          picked_radio: '',
          tiMu: '2*5=?',
          xuanXiang: ['2', '6', '8', '10']
        },
        {
          id: 3,
          picked_radio: '',
          tiMu: '下面哪些城市属于河南？',
          xuanXiang: ['郑州', '开封', '阜阳', '信阳']
        },
        {
          id: 4,
          picked_radio: '',
          tiMu: '纽约是下面哪个国家的城市?',
          xuanXiang: ['中国', '日本', '韩国', '美国']
        },
        {
          id: 5,
          ppicked_radio: '',
          tiMu: '2*8=?',
          xuanXiang: ['16', '6', '8', '10']
        },
        {
          id: 6,
          picked_radio: '',
          tiMu: '下面哪些属于植物?',
          xuanXiang: ['狗', '棉花', '猫', '水']
        }
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
.xuanXiang {
  text-align: left;
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