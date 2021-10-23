<template>
  <div>
      <div>
            <el-button
            size="small"
            type="primary"
            @click="handleAdd()"
            >添加选择题
            </el-button>
      </div>
     <el-table :data="completionQuestionInfoList" style="width: 100%;font-size:12px" class="tableclass" stripe  :header-cell-style="{'text-align':'center'}" :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" >
      <el-table-column prop="completionQuestionId" label="填空题编号" align="center" width="100px"> </el-table-column>
      <el-table-column prop="user.userName" label="创建人" align="center"> </el-table-column>
      <el-table-column prop="completionQuestionDescription" label="选择题描述"  :show-overflow-tooltip="true" align="center"> </el-table-column>
      <el-table-column prop="questionLabels[0].chapter" label="选择题章节" align="center"> </el-table-column>
      <el-table-column prop="questionLabels[0].firstKnowledgePoint" label="选择题一级知识点" align="center"> </el-table-column>
      <el-table-column  label="选择题二级知识点" min-width="100%" :show-overflow-tooltip="true"> 
          <template slot-scope="scope"> 
              <div v-for="(item,index) in scope.row.questionLabels" :key="item.questionLabelId"  >
                  <p v-if="index==3" align="center" style="margin-top:0px;margin-bottom:0px;display;">
                      ...
                  </p>
                  <p v-if="index<3" align="center" style="margin-top:0px;margin-bottom:0px;display;">
                    {{item.secondKnowledgePoint}}
                  </p>
                  <p v-if="index>3" style="margin-top:0px;margin-bottom:0px;display;">
                  </p>
              </div>  
          </template>
      </el-table-column>
      <el-table-column prop="completionQuestionDifficulty" label="选择题难度" align="center"> </el-table-column>
      <el-table-column prop="isPrivate" label="是否私有"> 
          <template slot-scope="scope">
              <p v-if="scope.row.isPrivate===true" align="center">
                  私有
              </p>  
              <p v-if="scope.row.isPrivate===false" align="center">
                  公有
              </p>  
          </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
           <el-button
            type="primary"
            @click="handleShow(scope.row)"
            >详情</el-button
          >
          <el-button
            type="primary"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
     </el-table>



    <!-- 添加填空题弹出框 -->
    <el-dialog title="添加选择题" :visible.sync="addCompletionQuestionInfoVisible"  center>
        <el-form :model="aCompletionQuestionInfo" label-width="80px"  ref="aCompletionQuestionInfo" :rules="addCompletionQuestionSubmitRules">
            <el-form-item prop="completionQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="aCompletionQuestionInfo.completionQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true" style="resize:none;" >
                </el-input>
                <el-button @click="addCompletionQuestionAddSpace()">添加填空</el-button>
                <el-button @click="addCompletionQuestionDeleteSpace()">删除填空</el-button>
            </el-form-item>
            <el-form-item prop="completionQuestionAnswers" label="题目答案" size="mini">
                <div v-for="(item,index) in aCompletionQuestionInfo.completionQuestionAnswers" :key="index" style="width:400px;float:left">
                    <p style="display:inline;">答案{{aCompletionQuestionInfo.completionQuestionAnswers[index].completionQuestionAnswerNumber}}:</p>
                    <el-input v-model="aCompletionQuestionInfo.completionQuestionAnswers[index].completionQuestionAnswerContent" placeholder="题目答案"  :autosize="true" style="resize:none;width:300px" >
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item  label="标签" size="mini" prop="questionLabels" >
                 <el-select v-model="addCompletionQuestionChapterChoice" placeholder="请选择"  @change="addCompletionQuestionChapterClick()">
                    <el-option
                    v-for="(item,index) in chapterList"
                    :key="index"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-select v-model="addCompletionQuestionFirstKnowledgeChoice" placeholder="请选择" :disabled="addCompletionQuestionFirstKnowledgeUse" @change="addCompletionQuestionFirstPointClick()" style="margin-left:20px">
                    <el-option
                    v-for="(item,index) in addCompletionQuestionFirstKnowledgeOption"
                    :key="index"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-select v-model="aCompletionQuestionInfo.questionLabels" multiple placeholder="请选择"  :disabled="addCompletionQuestionSecondKnowledgeUse" style="margin-left:20px;width:400px" >
                    <el-option
                    v-for="item in addCompletionQuestionSecondKnowledgeOption"
                    :key="item.questionLabelId"
                    :label="item.secondKnowledgePoint"
                    :value="item.questionLabelId">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="completionQuestionDifficulty" label="题目难度" size="mini">
               <el-select v-model="aCompletionQuestionInfo.completionQuestionDifficulty" placeholder="请选择" >
                    <el-option
                    v-for="item in difficultyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="isPrivate" label="是否私有" size="mini">
               <el-select v-model="aCompletionQuestionInfo.isPrivate" placeholder="请选择" >
                    <el-option
                    v-for="item in isPrivateOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addCompletionQuestionInfoVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCompletionQuestionInfo('aCompletionQuestionInfo')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 填空题详情弹出框 -->
    <el-dialog title="选择题详情" :visible.sync="showCompletionQuestionInfoVisible"  center>                
                                                                                                              <!-- 上下分离 -->
        <el-form :model="showCompletionQuestionInfo" label-width="80px"  ref="showCompletionQuestionInfo" :label-position="'top'">
            <el-form-item prop="completionQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="showCompletionQuestionInfo.completionQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true" style="resize:none;" :disabled="true" >
                </el-input>
            </el-form-item>
            <el-form-item prop="completionQuestionAnswers" label="题目答案" size="mini" >
                <div v-for="(item,index) in showCompletionQuestionInfo.completionQuestionAnswers" :key="index" style="width:400px;float:left;" class="e1">
                    <p style="display:inline;">答案{{showCompletionQuestionInfo.completionQuestionAnswers[index].completionQuestionAnswerNumber}}:</p>
                    <el-input v-model="showCompletionQuestionInfo.completionQuestionAnswers[index].completionQuestionAnswerContent" placeholder="题目答案"  :autosize="true" style="resize:none;width:300px;" :disabled="true">
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item prop="chapter" label="所属章节" size="mini">                                                              <!-- 初始化页面时不让他初始化没有对应的值 -->
                <el-input v-model="showCompletionQuestionInfo.questionLabels[0].chapter" placeholder="所属章节" type="textarea" :autosize="true"  :disabled="true" v-if="showCompletionQuestionInfo.questionLabels.length>0">
                </el-input>
            </el-form-item>
            <el-form-item prop="firstKnowledgePoint" label="第一知识点" size="mini">
                <el-input v-model="showCompletionQuestionInfo.questionLabels[0].firstKnowledgePoint" placeholder="第一知识点" type="textarea" :autosize="true"  :disabled="true" v-if="showCompletionQuestionInfo.questionLabels.length>0">
                </el-input>
            </el-form-item>
            <el-form-item prop="secondKnowledgePoint" label="第二知识点" size="mini"> 
                <p v-for="(item,index) in showCompletionQuestionInfo.questionLabels" :key="index" style="margin-left:10px;float:left;margin-top:0px;color:black;font-size:12px;margin-bottom: 0px;">
                    {{item.secondKnowledgePoint}}
                </p>
            </el-form-item>
            <el-form-item >
                <el-form inline>
                    <el-form-item  label="是否私有" size="mini"> 
                        <el-input v-model="showCompletionQuestionInfo.isPrivate" placeholder="是否私有" type="textarea"  :disabled="true" style="width:50px;height:23px;margin-left:5px">
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="题目难度" size="mini"> 
                        <el-input v-model="showCompletionQuestionInfo.completionQuestionDifficulty" placeholder="题目难度" type="textarea"  :disabled="true" style="width:50px;height:23px;margin-left:5px">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showCompletionQuestionInfoVisible = false">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //登录用户信息
            user:{
                userId:'',
                userName:'',
            },
            //详情用填空题信息
            showCompletionQuestionInfo:{
                completionQuestionId:'',
                completionQuestionDifficulty:'',
                completionQuestionDescription:'',
                isPrivate:'',
                user:{
                    userId:'',
                    userName:'',
                },
                completionQuestionAnswers:[],
                questionLabels:[] //下拉框选择(多选)
            },
            //添加填空题信息
            aCompletionQuestionInfo:{
                completionQuestionId:'',
                completionQuestionDifficulty:'',
                completionQuestionDescription:'',
                isPrivate:'',
                user:{
                    userId:'',
                    userName:'',
                },
                completionQuestionAnswers:[],
                questionLabels:[] //下拉框选择(多选)
            },
            //添加填空题提交规则
            addCompletionQuestionSubmitRules: {
                completionQuestionDescription: [
                    { required: true, message: '请输入填空题内容', trigger: 'blur' },
                    { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
                ],
                completionQuestionAnswers: [
                    { required: true, message: '请输入填空题答案', trigger: 'blur' },
                ],
                questionLabels: [
                    { required: true, message: '请选择标签', trigger: 'blur' },
                ],
                completionQuestionDifficulty: [
                    { required: true, message: '请选择难度', trigger: 'blur' },
                
                ],
                isPrivate: [
                    { required: true, message: '请选择是否私有', trigger: 'blur' },
                    
                ],
            },
            //下拉选择是否公有或私有
            isPrivateOption:[
                {
                    value:true,
                    label:"私有",
                },
                {
                    value:false,
                    label:"公有",
                },
            ],
            //表示难度1-10
            difficultyOption:[
                {
                    label:1,
                    value:1,
                },
                {
                    label:2,
                    value:2,
                },
                {
                    label:3,
                    value:3,
                },
                {
                    label:4,
                    value:4,
                },
                {
                    label:5,
                    value:5,
                },
                {
                    label:6,
                    value:6,
                },
                {
                    label:7,
                    value:7,
                },
                {
                    label:8,
                    value:8,
                },
                {
                    label:9,
                    value:9,
                },
                {
                    label:10,
                    value:10,
                },
            ],
            //添加填空题弹出框显示
            addCompletionQuestionInfoVisible:false,
            addCompletionQuestionChapterChoice:'',//添加填空题时章节选择
            addCompletionQuestionFirstKnowledgeOption:[],//添加填空题第一知识点内容
            addCompletionQuestionFirstKnowledgeUse:true,//添加填空题时第一知识点能否使用
            addCompletionQuestionFirstKnowledgeChoice:'',//添加填空题时第一知识点选择
            addCompletionQuestionSecondKnowledgeOption:[],//添加填空题时第二知识点内容
            addCompletionQuestionSecondKnowledgeUse:true,//添加填空题时第二知识点能否使用
            //填空题详情弹出框显示
            showCompletionQuestionInfoVisible:false,
            completionQuestionInfoList:[],
            chapterList:[],//章节内容
        }
    },
    mounted:function(){
        //获取填空题信息
        this.getCompletionQuestionInfo();
        //获取章节信息
        this.getQuestionLabelInfo();
        //获取当前教师信息
        this.getCurrentTeacherUserInfo();
    },
    methods:{
        //添加填空题信息添加填空
        addCompletionQuestionAddSpace(){
            var completionQuestionAnswer=new Object;
            completionQuestionAnswer.completionQuestionAnswerNumber=this.aCompletionQuestionInfo.completionQuestionAnswers.length+1;
            completionQuestionAnswer.completionQuestionAnswerContent='';
            this.aCompletionQuestionInfo.completionQuestionAnswers.push(completionQuestionAnswer)
        },
        //添加填空题信息删除填空
        addCompletionQuestionDeleteSpace(){
            this.aCompletionQuestionInfo.completionQuestionAnswers.splice(this.aCompletionQuestionInfo.completionQuestionAnswers.length-1,1);
        },
        //添加填空题信息
        addCompletionQuestionInfo(aCompletionQuestionInfo){
            this.$refs[aCompletionQuestionInfo].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
                if (valid) {   // 如果校验通过，请求接口，允许提交表单
                    
                    let params = new URLSearchParams();
                    for(var i=0;i<this.aCompletionQuestionInfo.questionLabels.length;i++){
                        var questionLabel=new Object();
                        questionLabel.questionLabelId=this.aCompletionQuestionInfo.questionLabels[i];
                        this.aCompletionQuestionInfo.questionLabels[i]=questionLabel;
                    }
                    this.aCompletionQuestionInfo.user=this.user;
                    params.append("completionQuestionInfo",JSON.stringify(this.aCompletionQuestionInfo))
                    this.$axios({
                        method: 'post',
                        headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                    },
                        url: '/completionQuestion/addCompletionQuestionInfo',
                        data: params
                    })  
                    .then((res)=> {
                        this.$message.success('添加填空题成功');
                        this.addCompletionQuestionInfoVisible=false;
                        this.getCompletionQuestionInfo();
                    })
                    .catch((err)=> {
                        this.$message.error('添加填空题错误');
                    })
                //校验不通过
                }else{
                    //界面会显示
                }
            });
        },
        //获取填空题信息
        getCompletionQuestionInfo(){
            let params = new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/completionQuestion/queryCompletionQuestionInfoByUserId',
                data: params
            })  
            .then((res)=> {
                this.completionQuestionInfoList=res.data;
            })
            .catch((err)=> {
                this.$message.error('查询填空题错误');
                
            })
        },
        //获取标签信息(获取chapter)
        getQuestionLabelInfo(){
            let params = new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/queryChapterInfo',
                data: params
            })
            .then((res)=> {
                //初始化
                this.chapterList=res.data;
            })
            .catch((err)=> {
                this.$message.error('获取章节信息错误');
                
            })
        },
        //添加填空题点击章节信息
        addCompletionQuestionChapterClick(){
            //解除第一知识点的禁用,赋值第一知识点选择为空 第二知识点为空并禁用
            this.addCompletionQuestionFirstKnowledgeUse=false;
            this.addCompletionQuestionFirstKnowledgeChoice='';
            this.addCompletionQuestionSecondKnowledgeUse=true;
            this.aCompletionQuestionInfo.questionLabels='';
            let params = new URLSearchParams();
            params.append("chapter",this.chapterList[this.addCompletionQuestionChapterChoice]);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
                this.addCompletionQuestionFirstKnowledgeOption=res.data;
            })
            .catch((err)=> {
                this.$message.error('添加填空题获取第一知识点错误');
            })
        },
        //添加填空题点击第一知识点
        addCompletionQuestionFirstPointClick(){
            //第二知识点的禁用解除 赋值第二知识点选择为空
            this.addCompletionQuestionSecondKnowledgeUse=false;
            this.aCompletionQuestionInfo.questionLabels='';
             let params = new URLSearchParams();
            params.append("chapter",this.chapterList[this.addCompletionQuestionChapterChoice]);
            params.append("firstKnowledgePoint",this.addCompletionQuestionFirstKnowledgeOption[this.addCompletionQuestionFirstKnowledgeChoice]);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
                this.addCompletionQuestionSecondKnowledgeOption=res.data;
            })
            .catch((err)=> {
                this.$message.error('添加填空题获取第二知识点错误');
                
            })
        },
        //获取当前教师用户信息
        getCurrentTeacherUserInfo () {
        let params = new URLSearchParams();
        this.$axios({
            method: 'post',
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/user/queryUserInfo',
            data: params
        })
            .then((res) => {
                this.user=res.data;
            })
            .catch((err) => {
            this.$message.error('系统错误请稍后再尝试');

            })
        },
        //控制详情弹出框显示
        handleShow(row){
            //详情弹出框显示 赋值  不能直接赋值row row类似一个指针直接指向row了
            this.showCompletionQuestionInfoVisible=true;
            this.showCompletionQuestionInfo.completionQuestionDescription=row.completionQuestionDescription;
            this.showCompletionQuestionInfo.completionQuestionDifficulty=row.completionQuestionDifficulty;
            this.showCompletionQuestionInfo.completionQuestionAnswers=row.completionQuestionAnswers;
            this.showCompletionQuestionInfo.questionLabels=row.questionLabels;
            if(row.isPrivate==true){
                this.showCompletionQuestionInfo.isPrivate="私有";
            }else{
                this.showCompletionQuestionInfo.isPrivate="公有";
            } 
        },
        //控制修改弹出框显示
        handleEdit(row){

        },
        //删除弹出框显示
        handleDelete(row){

        },
        
        //添加弹出框显示
        handleAdd(){
            this.addCompletionQuestionInfoVisible=true;
        }
    }
}
</script>

<style>
/* 详情弹出框的input 禁用样式 */
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
  /* 下拉框禁止*/
  resize: none;
  padding: 0;
}
.e1 .el-input .el-input__inner{
    background-color: white;
  border-color: white;
  color: black;
  cursor: default;
}
</style>