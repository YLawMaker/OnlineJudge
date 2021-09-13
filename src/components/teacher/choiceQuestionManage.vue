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
        @click="handleAdd()"
        >添加选择题</el-button
      >
    </div>

    <el-table :data="data" style="width: 90%" class="tableclass" stripe>
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
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDelect(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>



    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="choiceQuestionInfo.length"
        @current-change="handleCurrent"
        v-if="choiceQuestionInfo.length!=0"
      >
      </el-pagination>
    </div>
        <!-- 添加选择题弹出框 -->
        <el-dialog title="添加选择题" :visible.sync="addChoiceQuestionVisible" width="400" center>
            <el-form :model="choiceQuestion" ref="choiceQuestion" label-width="80px"  :rules="submitRules">
               <el-form-item prop="examChoiceQuestionTitle" label="题目名称" size="mini">
                    <el-input v-model="choiceQuestion.examChoiceQuestionTitle" placeholder="考试标题" type="textarea" :autosize="true" style="resize:none;">
                    </el-input>
                </el-form-item>
                 <p style="float:right;margin-right:35px;width:100px;color:red;font-size: 12px;" v-if="isChoiceVisible">请选择正确选项</p>
                <el-form-item  label="考题选项" size="mini" class="e1" :required="true">
                    <el-table  :data="choice" style="width: 100%" class="tableclass">
                      <el-table-column prop="name" label="选项"> </el-table-column>
                      <el-table-column prop="input" label="选项内容" width="600px" align="center"  >
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.input" placeholder="请输入内容" :class="{'w1':isChoiceInputVisible}">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="choiceId" label="答案">
                        <template slot-scope="scope">
                          <el-radio v-model="radio" :label="scope.row.choiceId" :class="{'w2':isChoiceVisible}">
                            <span></span>
                          </el-radio>
                        </template>
                      </el-table-column>
                    </el-table>
                     <p style="float:right;margin-right:43%;width:100px;color:red;font-size:12px;" v-if="isChoiceInputVisible">请输入内容</p>
                </el-form-item>
          
                <el-form-item prop="examChoiceQuestionScore" label="选项分数" size="mini" >
                    <el-input v-model="choiceQuestion.examChoiceQuestionScore" placeholder="选项分数" style="width:100px" maxlength="3" >
                    </el-input>
                </el-form-item>
                
                
            </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addChoiceQuestionVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addChoiceQuestion('choiceQuestion')">确 定</el-button>
                </div>




        </el-dialog>
        <!-- 删除选择题弹出框 -->
        <el-dialog title="删除选择题" :visible.sync="delectChoiceQuestionVisible" width="400px"  height="300px" center>
          <div align="center" style="margin-bottom:20px">
                删除不可恢复是否删除?
            </div>
              <el-button @click="delectChoiceQuestionVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" size="mini" @click="deleteChoiceQuestionInfo">确 定</el-button>
        </el-dialog>
       <!-- 修改选择题弹出框 -->
        <el-dialog title="修改选择题" :visible.sync="editChoiceQuestionVisible" width="400" center>
            <el-form :model="choiceQuestion" ref="choiceQuestion" label-width="80px"  :rules="submitRules">
               <el-form-item prop="examChoiceQuestionTitle" label="题目名称" size="mini">
                    <el-input v-model="choiceQuestion.examChoiceQuestionTitle" placeholder="考试标题" type="textarea" :autosize="true" style="resize:none;">
                    </el-input>
                </el-form-item>
                 <p style="float:right;margin-right:35px;width:100px;color:red;font-size: 12px;" v-if="isChoiceVisible">请选择正确选项</p>
                <el-form-item  label="考题选项" size="mini" class="e1" :required="true">
                    <el-table  :data="choice" style="width: 100%" class="tableclass">
                      <el-table-column prop="name" label="选项"> </el-table-column>
                      <el-table-column prop="input" label="选项内容" width="600px" align="center"  >
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.input" placeholder="请输入内容" :class="{'w1':isChoiceInputVisible}">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="choiceId" label="答案">
                        <template slot-scope="scope">
                          <el-radio v-model="radio" :label="scope.row.choiceId" :class="{'w2':isChoiceVisible}">
                            <span></span>
                          </el-radio>
                        </template>
                      </el-table-column>
                    </el-table>
                     <p style="float:right;margin-right:43%;width:100px;color:red;font-size:12px;" v-if="isChoiceInputVisible">请输入内容</p>
                </el-form-item>
          
                <el-form-item prop="examChoiceQuestionScore" label="选项分数" size="mini" >
                    <el-input v-model="choiceQuestion.examChoiceQuestionScore" placeholder="选项分数" style="width:100px" maxlength="3" >
                    </el-input>
                </el-form-item>
                
                
            </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editChoiceQuestionVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyChoiceQuestionInfo('choiceQuestion')">确 定</el-button>
                </div>
        </el-dialog>

  </div>
</template>


<script>
export default {
  data(){
    //
     const isNum = (rule, value, callback) => {
      const age= /^[0-9]*$/
      if (!age.test(value)) {
        callback(new Error('分数只能为<100的数字'))
      }else{
        callback()
      }
    }
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

        submitRules: {
                examChoiceQuestionTitle: [
                  { required: true, message: '请输入标题', trigger: 'blur' },
                  { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                examChoiceQuestionScore: [
                  { required: true, message: '请输入分数', trigger: 'blur' },
                  {  validator:isNum, trigger: 'blur' }
                ],
                
              
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
        isChoiceVisible:false,
        isChoiceInputVisible:false,
        addChoiceQuestionVisible:false,
        delectChoiceQuestionVisible:false,
        editChoiceQuestionVisible:false,
        pageSize: 10,
        currentPage: 1
    } 
  },
  mounted: function(){
      this.examId=this.$route.query.examId;
      this.getChoiceQuestionInfo();
    
  },
  computed: {
    data () {
      return this.choiceQuestionInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  
  methods:{
    //添加选择题
    addChoiceQuestion(choiceQuestion){
       this.$refs[choiceQuestion].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
              if(this.radio==''){
                  this.isChoiceVisible=true;
              }else{
                  this.isChoiceVisible=false;
              }
              for(var i=0;i<this.choice.length;i++){
            
                if(this.choice[i].input!=''){
                  if(this.choice[i].input.length>50){
                    alert("选项输入的长度要<=50");
                    break;
                  }
                }else{
                  this.isChoiceInputVisible=true;
                  break;
                }
                if(i==this.choice.length-1){
                  this.isChoiceInputVisible=false;
                }
              }
              // //往数据库里修改
              if(this.isChoiceInputVisible==false&&this.isChoiceVisible==false){
                  let params = new URLSearchParams();
                  params.append("examId",this.examId);
                  params.append("examChoiceQuestionTitle",this.choiceQuestion.examChoiceQuestionTitle);
                  params.append("examChoiceQuestionStemA",this.choice[0].input);
                  params.append("examChoiceQuestionStemB",this.choice[1].input);
                  params.append("examChoiceQuestionStemC",this.choice[2].input);
                  params.append("examChoiceQuestionStemD",this.choice[3].input);
                  params.append("examChoiceQuestionCorrectOption",this.choice[this.radio-1].name);
                  params.append("examChoiceQuestionScore",this.choiceQuestion.examChoiceQuestionScore);
                  this.$axios({
                    method: 'post',
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: '/examChoiceQuestion/addChoiceQuestionExamInfo',
                    data: params
                  })
                    .then((res) => {
                        this.$message.success('添加选择题成功');
                        this.addChoiceQuestionVisible=false;
                        this.getChoiceQuestionInfo();
                    })
                    .catch((err) => {
                      this.$message.error('添加选择题失败');

                    })
              }

              
          } else {   //校验不通过
             if(this.radio==''){
                  this.isChoiceVisible=true;
              }else{
                  this.isChoiceVisible=false;
              }
              for(var i=0;i<this.choice.length;i++){
                if(this.choice[i].input!=''){
                  if(this.choice[i].input.length>50){
                    alert("选项输入的长度要<=50");
                    break;
                  }
                }else{
                  this.isChoiceInputVisible=true;
                  break;
                }
                if(i==this.choice.length-1){
                  this.isChoiceInputVisible=false;
                }
              }
          }
        });

       
     

    },
    //修改选择题
    modifyChoiceQuestionInfo(choiceQuestion){
       this.$refs[choiceQuestion].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
              if(this.radio==''){
                  this.isChoiceVisible=true;
              }else{
                  this.isChoiceVisible=false;
              }
              for(var i=0;i<this.choice.length;i++){
                if(this.choice[i].input!=''){
                  if(this.choice[i].input.length>50){
                    alert("选项输入的长度要<=50");
                    break;
                  }
                }else{
                  this.isChoiceInputVisible=true;
                  break;
                }
                if(i==this.choice.length-1){
                  this.isChoiceInputVisible=false;
                }
              }
              // //往数据库里修改
              if(this.isChoiceInputVisible==false&&this.isChoiceVisible==false){
                  let params = new URLSearchParams();
                  params.append("examChoiceQuestionId",this.choiceQuestion.examChoiceQuestionId);
                  params.append("examChoiceQuestionTitle",this.choiceQuestion.examChoiceQuestionTitle);
                  params.append("examChoiceQuestionStemA",this.choice[0].input);
                  params.append("examChoiceQuestionStemB",this.choice[1].input);
                  params.append("examChoiceQuestionStemC",this.choice[2].input);
                  params.append("examChoiceQuestionStemD",this.choice[3].input);
                  params.append("examChoiceQuestionCorrectOption",this.choice[this.radio-1].name);
                  params.append("examChoiceQuestionScore",this.choiceQuestion.examChoiceQuestionScore);
                  this.$axios({
                    method: 'post', 
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: '/examChoiceQuestion/modifyChoiceQuestionExamInfo',
                    data: params
                  })
                    .then((res) => {
                        this.$message.success('修改选择题成功');
                        this.editChoiceQuestionVisible=false;
                        this.getChoiceQuestionInfo();
                        
                    })
                    .catch((err) => {
                      this.$message.error('修改选择题失败');

                    })
              }     
          } else {   //校验不通过
             if(this.radio==''){
                  this.isChoiceVisible=true;
              }else{
                  this.isChoiceVisible=false;
              }
              for(var i=0;i<this.choice.length;i++){
                if(this.choice[i].input!=''){
                  if(this.choice[i].input.length>50){
                    alert("选项输入的长度要<=50");
                    break;
                  }
                }else{
                  this.isChoiceInputVisible=true;
                  break;
                }
                if(i==this.choice.length-1){
                  this.isChoiceInputVisible=false;
                }
              }
          }
        });

    },
    //删除选择题
    deleteChoiceQuestionInfo(){
      let params = new URLSearchParams();
      params.append("examChoiceQuestionId",this.choiceQuestion.examChoiceQuestionId);
      this.$axios({
        method: 'post',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: '/examChoiceQuestion/deleteChoiceQuestionExamInfo',
        data: params
      })
        .then((res) => {
          this.getChoiceQuestionInfo();
          this.delectChoiceQuestionVisible=false;
        })
        .catch((err) => {
          this.$message.error('删除选择题信息失败');

        })
    },
    //获取选择题信息
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
        })
        .catch((err) => {
          this.$message.error('查询选择题信息失败');

        })
    },
    //跳转页面
    handleCurrent (val) {
    this.currentPage = val;
    },
    goBack (currentPage, searchKey) {
      
    },
    //控制修改弹出框
    handleEdit(row){
      this.choiceQuestion=row;
      this.choice[0].input=this.choiceQuestion.examChoiceQuestionStemA;
      this.choice[1].input=this.choiceQuestion.examChoiceQuestionStemB;
      this.choice[2].input=this.choiceQuestion.examChoiceQuestionStemC;
      this.choice[3].input=this.choiceQuestion.examChoiceQuestionStemD;
      switch (this.choiceQuestion.examChoiceQuestionCorrectOption){
        case 'A' : 
            this.radio='1';
            break;
        case 'B' : 
            this.radio='2';
            break;
        case 'C' : 
           this.radio='3';
            break;
        case 'D' : 
            this.radio='4';
            break;
      }
      this.editChoiceQuestionVisible=true;
    },
    //控制删除弹出框
    handleDelect(row){
      this.choiceQuestion.examChoiceQuestionId=row.examChoiceQuestionId;
      this.delectChoiceQuestionVisible=true;
    },
    //控制添加弹出框 重新赋值为空
    handleAdd(){
      this.choiceQuestion.examChoiceQuestionTitle='';
      this.choiceQuestion.examChoiceQuestionScore='';
      this.choice[0].input='';
      this.choice[1].input='';
      this.choice[2].input='';
      this.choice[3].input='';
      this.radio='';
      this.addChoiceQuestionVisible=true;
    }
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
.e1 .el-form-item__error{
  margin-left:45% ;
}
.w2 .el-radio__input{
  border: red 1px;
  border-style:  solid;
}
.w1 .el-input__inner{
   border: red 1px;
  border-style:  solid;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
