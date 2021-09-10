<template>
  <div>
    <div class="topBar_answer">
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="goBack(currentPage, searchKey)"
      >
        返回
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="addChoiceQuestionVisible=true"
        >添加选择题</el-button
      >
    </div>

    <el-table :data="choiceQuestionInfo" style="width: 90%" class="tableclass" stripe>
      <el-table-column prop="examChoiceQuestionId" label="考试选择题编号"> </el-table-column>
      <el-table-column prop="examChoiceQuestionTitle" label="考试选择题标题"> </el-table-column>
      <el-table-column prop="examChoiceQuestionStemA" label="考试选择题A选项"> </el-table-column>
      <el-table-column prop="examChoiceQuestionStemB" label="考试选择题B选项"> </el-table-column>
      <el-table-column prop="examChoiceQuestionStemC" label="考试选择题C选项"> </el-table-column>
      <el-table-column prop="examChoiceQuestionStemD" label="考试选择题D选项"> </el-table-column>
      <el-table-column prop="examChoiceQuestionCorrectOption" label="考试选择题正确答案"> </el-table-column>
      <el-table-column prop="examChoiceQuestionScore" label="考试选择题得分"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click.native.prevent="modifyChoiceQuestionInfo(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click.native.prevent="deleteChoiceQuestionInfo(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
















        <el-dialog title="添加选择题" :visible.sync="addChoiceQuestionVisible" width="400" center>
            <el-form :model="choiceQuestion" ref="choiceQuestion" label-width="80px">
               <el-form-item prop="examChoiceQuestionTitle" label="题目名称" size="mini">
                    <el-input v-model="choiceQuestion.examChoiceQuestionTitle" placeholder="考试标题" type="textarea" :autosize="true" style="resize:none;">
                    </el-input>
                </el-form-item>
                <el-form-item  label="考题选项" size="mini" class="e1">
                    <el-table  :data="choice" style="width: 100%" class="tableclass">
                      <el-table-column prop="name" label="选项"> </el-table-column>
                      <el-table-column prop="input" label="选项内容" width="600px" align="center">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.input" placeholder="请输入内容" >
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="choiceId" label="答案">
                        <template slot-scope="scope">
                          <el-radio v-model="radio" :label="scope.row.choiceId">
                            <span></span>
                          </el-radio>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item prop="examChoiceQuestionScore" label="选项分数" size="mini" >
                    <el-input v-model="choiceQuestion.examChoiceQuestionScore" placeholder="选项分数" style="width:100px" @input="params.discount=params.discount.replace(/[^\d.]/g,'')">
                    </el-input>
                </el-form-item>
                
                
            </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addChoiceQuestionVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addChoiceQuestion">确 定</el-button>
                </div>
        </el-dialog>



  </div>
</template>


<script>
export default {
  data(){
    return{
        examId:'',
        choiceQuestionInfo:[],
        choiceQuestion:{
          examChoiceQuestionId:'',
          examChoiceQuestionTitle:'',
          examChoiceQuestionStemA:'',
          examChoiceQuestionStemB:'',
          examChoiceQuestionStemC:'',
          examChoiceQuestionStemD:'',
          examChoiceQuestionCorrectOption:'',
          examChoiceQuestionScore:'',
        },
        choice:[
          {
            name:'A',
            input:'',
            choiceId:'1',
          },
          {
            name:'B',
            input:'',
            choiceId:'2',
          },
          {
            name:'C',
            input:'',
            choiceId:'3',
          },
          {
            name:'D',
            input:'',
            choiceId:'4',
          },
        ],
        radio:'',
          
        
        addChoiceQuestionVisible:false,
    } 
  },
  mounted: function(){
      this.examId=this.$route.query.examId;
      this.getChoiceQuestionInfo();
  },
  methods:{
    addChoiceQuestion(){

    },
    modifyChoiceQuestionInfo(row){

    },
    deleteChoiceQuestionInfo(row){

    },
    getChoiceQuestionInfo(){
      let params = new URLSearchParams();
      params.append("examId",this.examId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examChoiceQuestion/queryChoiceQuestionInfoById',
        data: params
      })
        .then((res) => {
          this.choiceQuestionInfo=res.data;
          console.log(this.choiceQuestionInfo);
        })
        .catch((err) => {
          this.$message.error('查询选择题信息失败');

        })
    },
    goBack (currentPage, searchKey) {
      
    },
  }
}
</script>


<style>
.tableclass {
  margin-left: 1%;
}
.el-textarea__inner{
  resize: none;
}
.e1 .el-form-item__label{
  padding-top: 15px;
}
.e1 input::-moz-placeholder{text-align: center;}
</style>
