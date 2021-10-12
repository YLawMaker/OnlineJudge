<template>
  <div>
    <div>
        <el-button
        size="small"
        type="primary"
         @click="handleAdd()"
        >添加选择题</el-button
        >
    </div>
     <el-table :data="data" style="width: 100%" class="tableclass" stripe >
      <el-table-column prop="choiceQuestionId" label="选择题编号"> </el-table-column>
      <el-table-column prop="user.userName" label="创建人"> </el-table-column>
      <el-table-column prop="choiceQuestionDescription" label="选择题描述"  :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="questionLabels[0].chapter" label="选择题章节"> </el-table-column>
      <el-table-column prop="questionLabels[0].firstKnowledgePoint" label="选择题一级知识点"> </el-table-column>
      <el-table-column  label="选择题二级知识点" min-width="100%" :show-overflow-tooltip="true"> 
          <template slot-scope="scope">
              <div v-for="item in scope.row.questionLabels" :key="item.questionLabelId" style="margin-top:0px;margin-bottom:0px;display:inline;" >
                    {{item.secondKnowledgePoint}}  
              </div>  
          </template>
      </el-table-column>
      <el-table-column prop="choiceQuestionDifficulty" label="选择题难度"> </el-table-column>
      <el-table-column prop="isPrivate" label="是否私有"> 
          <template slot-scope="scope">
              <p v-if="scope.row.isPrivate===true">
                  私有
              </p>  
              <p v-if="scope.row.isPrivate===false">
                  公有
              </p>  
          </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
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
        :total="choiceQuestionList.length"
        @current-change="handleCurrent"
        v-if="choiceQuestionList.length!=0"
      >
      </el-pagination>
    </div>

    <!-- 添加选择题弹出框 -->
    <el-dialog title="添加选择题" :visible.sync="addChoiceQuestionVisible"  center>
        <el-form :model="choiceQuestionInfo" ref="choiceQuestionInfo" label-width="80px"  :rules="submitRules">
            <el-form-item prop="choiceQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true" style="resize:none;" >
                </el-input>
            </el-form-item>
                <!-- 选择正确选项上方的错误提醒 -->
                <p style="float:right;margin-right:35px;width:100px;color:red;font-size: 12px;" v-if="isChoiceErrorVisible">请选择正确选项</p>
            <el-form-item  label="考题选项" size="mini" class="e1" :required="true">
                <el-table  :data="choice" style="width: 100%" class="tableclass">
                    <el-table-column prop="name" label="选项"> </el-table-column>
                    <el-table-column prop="input" label="选项内容" width="600px" align="center"  >
                    <template slot-scope="scope">
                        <!-- 选项内容的错误红色框 -->
                        <el-input v-model="scope.row.input" placeholder="请输入内容" :class="{'w1':isChoiceInputErrorVisible}">
                        </el-input>
                    </template>
                    </el-table-column>
                    <el-table-column prop="choiceId" label="答案">
                    <template slot-scope="scope">
                        <!-- 选项正确选项的错误红色框 -->
                        <el-radio v-model="radio" :label="scope.row.choiceId" :class="{'w2':isChoiceErrorVisible}">
                        <span></span>
                        </el-radio>
                    </template>
                    </el-table-column>
                </el-table>
                     <!-- 选项内容下方的错误提醒 -->
                    <p style="float:right;margin-right:43%;width:100px;color:red;font-size:12px;" v-if="isChoiceInputErrorVisible">请输入内容</p>
            </el-form-item> 
            <el-form-item  label="标签" size="mini" prop="questionLabels" >
                 <el-select v-model="chapterChoice" placeholder="请选择"  @change="addChapterClick()">
                    <el-option
                    v-for="item in chapterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="firstKnowledgePointChoice" placeholder="请选择" :disabled="firstKnowledgePointVisiable" @change="addFirstKnowledgePointClick()" style="margin-left:20px">
                    <el-option
                    v-for="item in firstKnowledgePointOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="choiceQuestionInfo.questionLabels" multiple placeholder="请选择" :disabled="secondKnowledgePointVisiable" style="margin-left:20px;width:400px">
                    <el-option
                    v-for="item in secondKnowledgePointOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="choiceQuestionDifficulty" label="题目难度" size="mini">
               <el-select v-model="choiceQuestionInfo.choiceQuestionDifficulty" placeholder="请选择" >
                    <el-option
                    v-for="item in difficultyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="isPrivate" label="是否私有" size="mini">
               <el-select v-model="choiceQuestionInfo.isPrivate" placeholder="请选择" >
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
            <el-button @click="addChoiceQuestionVisible = false">取 消</el-button>
            <el-button type="primary" @click="addChoiceQuestionInfo('choiceQuestionInfo')">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 修改选择题弹出框 -->
    <el-dialog title="修改选择题" :visible.sync="editChoiceQuestionVisible"  center>
        <el-form :model="eChoiceQuestionInfo" ref="eChoiceQuestionInfo" label-width="80px"  :rules="submitRules">
            <el-form-item prop="choiceQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="eChoiceQuestionInfo.choiceQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true" style="resize:none;" >
                </el-input>
            </el-form-item>
                <!-- 选择正确选项上方的错误提醒 -->
                <p style="float:right;margin-right:35px;width:100px;color:red;font-size: 12px;" v-if="isChoiceErrorVisible">请选择正确选项</p>
            <el-form-item  label="考题选项" size="mini" class="e1" :required="true">
                <el-table  :data="choice" style="width: 100%" class="tableclass">
                    <el-table-column prop="name" label="选项"> </el-table-column>
                    <el-table-column prop="input" label="选项内容" width="600px" align="center"  >
                    <template slot-scope="scope">
                        <!-- 选项内容的错误红色框 -->
                        <el-input v-model="scope.row.input" placeholder="请输入内容" :class="{'w1':isChoiceInputErrorVisible}">
                        </el-input>
                    </template>
                    </el-table-column>
                    <el-table-column prop="choiceId" label="答案">
                    <template slot-scope="scope">
                        <!-- 选项正确选项的错误红色框 -->
                        <el-radio  v-model="radio" :label="scope.row.choiceId" :class="{'w2':isChoiceErrorVisible}">
                        <span></span>
                        </el-radio>
                    </template>
                    </el-table-column>
                </el-table>
                     <!-- 选项内容下方的错误提醒 -->
                    <p style="float:right;margin-right:43%;width:100px;color:red;font-size:12px;" v-if="isChoiceInputErrorVisible">请输入内容</p>
            </el-form-item> 
            <el-form-item  label="标签" size="mini" prop="questionLabels" >
                 <el-select v-model="chapterChoice" placeholder="请选择"  @change="editChapterClick()">
                    <el-option
                    v-for="item in chapterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="firstKnowledgePointChoice" placeholder="请选择"  @change="editFirstKnowledgePointClick()" style="margin-left:20px">
                    <el-option
                    v-for="item in firstKnowledgePointOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="eChoiceQuestionInfo.questionLabels" multiple placeholder="请选择"  style="margin-left:20px;width:400px" value-key="questionLabelId" :disabled="editSecondKnowledgePointVisiable">
                    <el-option
                    v-for="item in secondKnowledgePointOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="choiceQuestionDifficulty" label="题目难度" size="mini">
               <el-select v-model="eChoiceQuestionInfo.choiceQuestionDifficulty" placeholder="请选择" >
                    <el-option
                    v-for="item in difficultyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="isPrivate" label="是否私有" size="mini">
               <el-select v-model="eChoiceQuestionInfo.isPrivate" placeholder="请选择" >
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
            <el-button @click="editChoiceQuestionVisible = false">取 消</el-button>
            <el-button type="primary" @click="editChoiceQuestionInfo('eChoiceQuestionInfo')">确定修改</el-button>
        </div>
    </el-dialog>

    <!-- 选择题详情弹出框 -->
    <el-dialog title="选择题详情" :visible.sync="choiceQuestionShowVisible"  center>
        <el-form :model="choiceQuestionInfo" ref="choiceQuestionInfo" label-width="100px" :label-position="'top'" >
            <el-form-item prop="choiceQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true"  :disabled="true" >
                </el-input>
            </el-form-item>
            <el-form-item prop="choiceQuestionStemA" label="题目A选项" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionStemA" placeholder="题目描述" type="textarea" :autosize="true"  :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item prop="choiceQuestionStemB" label="题目B选项" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionStemB" placeholder="题目描述" type="textarea" :autosize="true"  :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item prop="choiceQuestionStemC" label="题目C选项" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionStemC" placeholder="题目描述" type="textarea" :autosize="true"  :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item prop="choiceQuestionStemD" label="题目D选项" size="mini">
                <el-input v-model="choiceQuestionInfo.choiceQuestionStemD" placeholder="题目描述" type="textarea" :autosize="true"  :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item prop="chapter" label="所属章节" size="mini">                                                              <!-- 初始化页面时不让他初始化没有对应的值 -->
                <el-input v-model="choiceQuestionInfo.questionLabels[0].chapter" placeholder="所属章节" type="textarea" :autosize="true"  :disabled="true" v-if="choiceQuestionInfo.questionLabels.length>0">
                </el-input>
            </el-form-item>
            <el-form-item prop="firstKnowledgePoint" label="第一知识点" size="mini">
                <el-input v-model="choiceQuestionInfo.questionLabels[0].firstKnowledgePoint" placeholder="第一知识点" type="textarea" :autosize="true"  :disabled="true" v-if="choiceQuestionInfo.questionLabels.length>0">
                </el-input>
            </el-form-item>
            <el-form-item prop="secondKnowledgePoint" label="第二知识点" size="mini"> 
                <p v-for="(item,index) in choiceQuestionInfo.questionLabels" :key="index" style="margin-left:10px;float:left;margin-top:0px;color:black;font-size:12px;margin-bottom: 0px;">
                    {{item.secondKnowledgePoint}}
                </p>
            </el-form-item>
            <el-form-item >
                <el-form inline>
                    <el-form-item  label="是否私有" size="mini"> 
                        <el-input v-model="choiceQuestionInfo.isPrivate" placeholder="是否私有" type="textarea"  :disabled="true" style="width:50px;height:23px;margin-left:5px">
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="题目难度" size="mini"> 
                        <el-input v-model="choiceQuestionInfo.choiceQuestionDifficulty" placeholder="题目难度" type="textarea"  :disabled="true" style="width:50px;height:23px;margin-left:5px">
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="题目正确选项" size="mini"> 
                        <el-input v-model="choiceQuestionInfo.choiceQuestionCorrectOption" placeholder="题目正确选项" type="textarea"  :disabled="true" style="width:50px;height:23px;margin-left:5px">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="choiceQuestionShowVisible = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>


  
</template>

<script>
export default {
    data(){
       
        return{
            choiceQuestionInfo:{
                choiceQuestionId:'',
                choiceQuestionDescription:'',
                choiceQuestionStemA:'',
                choiceQuestionStemB:'',
                choiceQuestionStemC:'',
                choiceQuestionStemD:'',
                choiceQuestionCorrectOption:'',
                choiceQuestionDifficulty:'',
                isPrivate:'',
                user:{
                    userId:'',
                    userName:'',
                },
                questionLabels:[] //下拉框选择(多选)
            },
            //修改用下选择题信息
            eChoiceQuestionInfo:{
                choiceQuestionId:'',
                choiceQuestionDescription:'',
                choiceQuestionStemA:'',
                choiceQuestionStemB:'',
                choiceQuestionStemC:'',
                choiceQuestionStemD:'',
                choiceQuestionCorrectOption:'',
                choiceQuestionDifficulty:'',
                isPrivate:'',
                user:{
                    userId:'',
                    userName:'',
                },
                questionLabels:[] //下拉框选择(多选)
            },
            //添加选择题的校验
            submitRules: {
                choiceQuestionDescription: [
                  { required: true, message: '请输入标题', trigger: 'blur' },
                  { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
                ],
                questionLabels: [
                  { required: true, message: '请选择标签', trigger: 'blur' },
                ],
                choiceQuestionDifficulty: [
                  { required: true, message: '请选择难度', trigger: 'blur' },
                
                ],
                isPrivate: [
                  { required: true, message: '请选择是否私有', trigger: 'blur' },
                  
                ],
            },
            choiceQuestionList:[],
            chapterList:[],//chapter数组
            chapterChoice:'',//下拉框选择
            chapterOptions:[],//参数为label value
            firstKnowledgePointList:[],//firstKnowledgePoint数组
            firstKnowledgePointChoice:'',//下拉框选择
            firstKnowledgePointOptions:[],//参数为label value
            secondKnowledgePointList:[],//secondKnowledgePoint数组
            secondKnowledgePointOptions:[],//参数为label value
            firstKnowledgePointVisiable:true,//第一知识点下拉框能否使用 true为禁用
            secondKnowledgePointVisiable:true,//第二知识点下拉框能否使用 true为禁用
            editSecondKnowledgePointVisiable:false,//修改选择题信息时下拉框能否使用 true为禁用
            //表示ABCD四个选项
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
            //选择的正确答案
            radio:'',
            //选择题内容错误
            isChoiceInputErrorVisible:false,
            //选择题正确选项错误
            isChoiceErrorVisible:false,
            //添加选择题的弹出框
            addChoiceQuestionVisible:false,
             //选择题详情的弹出框
            choiceQuestionShowVisible:false,
            //修改选择题弹出框
            editChoiceQuestionVisible:false,
            
            pageSize: 9,
            currentPage: 1,
            kongge:" ",
        }
    },
    
    mounted:function(){
        //获取选择题标签信息
        this.getQuestionLabelInfo();
        //获取选择题信息
        this.getChoiceQuestionInfo();
        //获取教师用户信息
        this.getTeacherUserInfo();
    },
    computed: {
        data () {
        return this.choiceQuestionList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
    },
    
    methods:{
        //跳转页面调用
        handleCurrent (val) {
            this.currentPage = val;
        },
        //添加信息点击章节
        addChapterClick(){
             //清空数据信息并解除禁用 清空第一知识点
            this.firstKnowledgePointVisiable=false;
            this.firstKnowledgePointChoice='';
            this.secondKnowledgePointChoice=[];
            //获取第一知识点的数据写在下拉框数据里
            this.getFirstKnowledgePointInfo();
        },
        //添加信息点击第一知识点
        addFirstKnowledgePointClick(){
            //清空数据信息并解除禁用
            this.secondKnowledgePointVisiable=false;
            this.secondKnowledgePointChoice=[];
            this.choiceQuestionInfo.questionLabels=[];
            //获取第二知识点的数据写在下拉框数据里
            this.getSecondKnowledgePointInfo();
        },
        //修改信息点击章节
        editChapterClick(){
            this.editSecondKnowledgePointVisiable=true;
            this.eChoiceQuestionInfo.questionLabels=[];
            //获取第一知识点的数据写在下拉框数据里
            this.getFirstKnowledgePointInfo();
        },
        editFirstKnowledgePointClick(){
            this.editSecondKnowledgePointVisiable=false;
            this.eChoiceQuestionInfo.questionLabels=[];
            //获取第二知识点的数据写在下拉框数据里
            this.getSecondKnowledgePointInfo();
        },
        //添加选择题
        addChoiceQuestionInfo(choiceQuestionInfo){
            this.$refs[choiceQuestionInfo].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
            if (valid) {   // 如果校验通过，请求接口，允许提交表单
                //判断是否选择正确选项
                if(this.radio==''){
                    this.isChoiceErrorVisible=true;
                }else{
                    this.isChoiceErrorVisible=false;
                }
                //选项内容的校验
                for(var i=0;i<this.choice.length;i++){
                    if(this.choice[i].input!=''){
                        if(this.choice[i].input.length>50){
                            alert("选项输入的长度要<=50");
                            break;
                        }
                    }else{
                         this.isChoiceInputErrorVisible=true;
                         break;
                    }
                    if(i==this.choice.length-1){
                          this.isChoiceInputErrorVisible=false;
                    }
                }
                // //往数据库里修改
                if(this.isChoiceInputErrorVisible==false&&this.isChoiceErrorVisible==false){
                    this.choiceQuestionInfo.choiceQuestionStemA=this.choice[0].input;
                    this.choiceQuestionInfo.choiceQuestionStemB=this.choice[1].input;
                    this.choiceQuestionInfo.choiceQuestionStemC=this.choice[2].input;
                    this.choiceQuestionInfo.choiceQuestionStemD=this.choice[3].input;
                    this.choiceQuestionInfo.choiceQuestionCorrectOption=this.choice[this.radio-1].name;
                    for(var i=0;i<this.choiceQuestionInfo.questionLabels.length;i++){
                        var questionLabel=new Object();
                        questionLabel.questionLabelId=this.choiceQuestionInfo.questionLabels[i];
                        this.choiceQuestionInfo.questionLabels[i]=questionLabel;
                    }
                    this.$axios({
                            method: 'post',
                            headers: {
                                        "Content-Type": "application/json"
                                        },
                            url: '/choiceQuestion/addChoiceQuestionInfo',
                            data: this.choiceQuestionInfo
                        })
                        .then((res)=> {
                            this.addChoiceQuestionVisible=false;
                            if(res.data==true){
                                this.getChoiceQuestionInfo();
                                this.$message.success('添加成功');
                            }else{
                                this.$message.error('添加失败');
                            }

                        })
                        .catch((err)=> {
                            this.$message.error('错误');
                        })
                }
            } else {   //校验不通过 
                if(this.radio==''){
                    this.isChoiceErrorVisible=true;
                }else{
                    this.isChoiceErrorVisible=false;
                }
                for(var i=0;i<this.choice.length;i++){
                    if(this.choice[i].input!=''){
                        if(this.choice[i].input.length>50){
                            alert("选项输入的长度要<=50");
                            break;
                        }
                    }else{
                      this.isChoiceInputErrorVisible=true;
                    break;
                    }
                    if(i==this.choice.length-1){
                      this.isChoiceInputErrorVisible=false;
                    }
                }
            }
            });
        },
        //修改选择题
        editChoiceQuestionInfo(choiceQuestionInfo){
            this.$refs[choiceQuestionInfo].validate((valid) => {  //开启校验 不管标题和分数是否通过都要判断表单里的数据
            if (valid) {   // 如果校验通过，请求接口，允许提交表单
                //判断是否选择正确选项
                if(this.radio==''){
                    this.isChoiceErrorVisible=true;
                }else{
                    this.isChoiceErrorVisible=false;
                }
                //选项内容的校验
                for(var i=0;i<this.choice.length;i++){
                    if(this.choice[i].input!=''){
                        if(this.choice[i].input.length>50){
                            alert("选项输入的长度要<=50");
                            break;
                        }
                    }else{
                         this.isChoiceInputErrorVisible=true;
                         break;
                    }
                    if(i==this.choice.length-1){
                          this.isChoiceInputErrorVisible=false;
                    }
                }
                // //往数据库里修改
                if(this.isChoiceInputErrorVisible==false&&this.isChoiceErrorVisible==false){
                    this.eChoiceQuestionInfo.choiceQuestionStemA=this.choice[0].input;
                    this.eChoiceQuestionInfo.choiceQuestionStemB=this.choice[1].input;
                    this.eChoiceQuestionInfo.choiceQuestionStemC=this.choice[2].input;
                    this.eChoiceQuestionInfo.choiceQuestionStemD=this.choice[3].input;
                    this.eChoiceQuestionInfo.choiceQuestionCorrectOption=this.choice[this.radio-1].name;
                    for(var i=0;i<this.eChoiceQuestionInfo.questionLabels.length;i++){
                        var questionLabel=new Object();
                        questionLabel.questionLabelId=this.eChoiceQuestionInfo.questionLabels[i];
                        this.eChoiceQuestionInfo.questionLabels[i]=questionLabel;
                    }
                    
                    this.$axios({
                            method: 'post',
                            headers: {
                                        "Content-Type": "application/json"
                                        },
                            url: '/choiceQuestion/modifyChoiceQuestionInfo',
                            data: this.eChoiceQuestionInfo
                        })
                        .then((res)=> {
                            this.editChoiceQuestionVisible=false;
                            if(res.data==true){
                                this.getChoiceQuestionInfo();
                                this.$message.success('修改成功');
                            }else{
                                this.$message.error('修改失败');
                            }

                        })
                        .catch((err)=> {
                            this.$message.error('修改信息错误');
                        })
                }
            } else {   //校验不通过 
                if(this.radio==''){
                    this.isChoiceErrorVisible=true;
                }else{
                    this.isChoiceErrorVisible=false;
                }
                for(var i=0;i<this.choice.length;i++){
                    if(this.choice[i].input!=''){
                        if(this.choice[i].input.length>50){
                            alert("选项输入的长度要<=50");
                            break;
                        }
                    }else{
                      this.isChoiceInputErrorVisible=true;
                    break;
                    }
                    if(i==this.choice.length-1){
                      this.isChoiceInputErrorVisible=false;
                    }
                }
            }
            });
        },
         //控制添加弹出框 重新赋值为空
        handleAdd(){
            //选择框禁用
            this.firstKnowledgePointVisiable=true;
            this.secondKnowledgePointVisiable=true;
            //清空数据
            this.chapterChoice='';
            this.choice[0].input='';
            this.choice[1].input='';
            this.choice[2].input='';
            this.choice[3].input='';
            this.choiceQuestionInfo.questionLabels=[];
            this.secondKnowledgePointChoice=[];
            this.choiceQuestionInfo.choiceQuestionDescription='';
            this.choiceQuestionInfo.isPrivate='';
            this.choiceQuestionInfo.choiceQuestionDifficulty='';
            this.radio='';
            this.firstKnowledgePointChoice='';
            this.firstKnowledgePointOptions=[];
            this.secondKnowledgePointOptions=[];
            //显示
            this.addChoiceQuestionVisible=true;
        },
        //控制修改弹出框 获取对应信息并赋值
        handleEdit(row){
            //选择框可以使用

            //清空数据
            this.chapterChoice='';
            this.choice[0].input='';
            this.choice[1].input='';
            this.choice[2].input='';
            this.choice[3].input='';
            this.secondKnowledgePointChoice=[];
            this.eChoiceQuestionInfo.questionLabels=[];
            this.eChoiceQuestionInfo.choiceQuestionDescription='';
            this.eChoiceQuestionInfo.isPrivate='';
            this.eChoiceQuestionInfo.choiceQuestionDifficulty='';
            this.eChoiceQuestionInfo.choiceQuestionId='';
            this.radio='';
            this.firstKnowledgePointChoice='';
            this.firstKnowledgePointOptions=[];
            this.secondKnowledgePointOptions=[];
            //赋值
            this.choice[0].input=row.choiceQuestionStemA;
            this.choice[1].input=row.choiceQuestionStemB;
            this.choice[2].input=row.choiceQuestionStemC;
            this.choice[3].input=row.choiceQuestionStemD;
            this.eChoiceQuestionInfo.choiceQuestionDescription=row.choiceQuestionDescription;
            this.eChoiceQuestionInfo.isPrivate=row.isPrivate;
            this.eChoiceQuestionInfo.choiceQuestionId=row.choiceQuestionId;
            switch(row.choiceQuestionCorrectOption){
                case 'A':this.radio='1';break;
                case 'B':this.radio='2';break;
                case 'C':this.radio='3';break;
                case 'D':this.radio='4';break;
            }
            for(var i=0;i<this.chapterOptions.length;i++){
                if(this.chapterOptions[i].label==row.questionLabels[0].chapter){
                    this.chapterChoice=this.chapterOptions[i].value;
                }
            }
            this.getEditFirstKnowledgePointInfo(row);
            this.eChoiceQuestionInfo.choiceQuestionDifficulty=row.choiceQuestionDifficulty;
            this.editChoiceQuestionVisible=true;
        },
        //控制详情弹出框并赋值
        handleShow(row){
            this.choiceQuestionInfo.choiceQuestionDescription=row.choiceQuestionDescription;
            this.choiceQuestionInfo.choiceQuestionStemA=row.choiceQuestionStemA;
            this.choiceQuestionInfo.choiceQuestionStemB=row.choiceQuestionStemB;
            this.choiceQuestionInfo.choiceQuestionStemC=row.choiceQuestionStemC;
            this.choiceQuestionInfo.choiceQuestionStemD=row.choiceQuestionStemD;
            this.choiceQuestionInfo.choiceQuestionCorrectOption=row.choiceQuestionCorrectOption;
            this.choiceQuestionInfo.choiceQuestionDifficulty=row.choiceQuestionDifficulty;
            if(row.isPrivate==true){
                this.choiceQuestionInfo.isPrivate="私有";
            }else{
                this.choiceQuestionInfo.isPrivate="公有";
            }
            this.choiceQuestionInfo.questionLabels=row.questionLabels;
            this.choiceQuestionShowVisible=true;
        },
        //获取用户可以查询的选择题信息(不用传参数)
        getChoiceQuestionInfo(){
            let params = new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/choiceQuestion/queryChoiceQuestionInfo',
                data: params
            })
            .then((res)=> {
                this.choiceQuestionList=res.data;
            })
            .catch((err)=> {
                this.$message.error('错误');
                
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
                this.chapterList=res.data;
                for(var i=0;i<this.chapterList.length;i++){
                    var chapter=new Object();
                    chapter.label=this.chapterList[i];
                    chapter.value=i;
                    this.chapterOptions.push(chapter);
                }
                
            })
            .catch((err)=> {
                this.$message.error('获取章节信息错误');
                
            })
        },
         //获取第一知识点
        getFirstKnowledgePointInfo(){
            let params = new URLSearchParams();
            params.append("chapter",this.chapterOptions[this.chapterChoice].label);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
                //给下拉框内容清空
               this.firstKnowledgePointOptions=[];
               this.firstKnowledgePointList=res.data;
                for(var i=0;i<this.firstKnowledgePointList.length;i++){
                    var firstKnowledgePoint=new Object();
                    firstKnowledgePoint.label=this.firstKnowledgePointList[i];
                    firstKnowledgePoint.value=i;
                    this.firstKnowledgePointOptions.push(firstKnowledgePoint);
                }
            })
            .catch((err)=> {
                this.$message.error('获取第一知识点错误');
                
            })
        },
        //获取第二知识点
        getSecondKnowledgePointInfo(){
            let params = new URLSearchParams();
            params.append("chapter",this.chapterOptions[this.chapterChoice].label);
            params.append("firstKnowledgePoint",this.firstKnowledgePointOptions[this.firstKnowledgePointChoice].label);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
               //给下拉框内容清空
               this.secondKnowledgePointOptions=[];
               this.secondKnowledgePointList=res.data;
                //重新赋值
                for(var i=0;i<this.secondKnowledgePointList.length;i++){
                    var secondKnowledgePoint=new Object();
                    secondKnowledgePoint.label=this.secondKnowledgePointList[i].secondKnowledgePoint;
                    secondKnowledgePoint.value=this.secondKnowledgePointList[i].questionLabelId;
                    this.secondKnowledgePointOptions.push(secondKnowledgePoint);
                }
                 
               
            })
            .catch((err)=> {
                this.$message.error('获取第二知识点错误');
                
            })
        },
        //获取教师用户信息
        getTeacherUserInfo () {
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
               
                this.choiceQuestionInfo.user.userId=res.data.userId;
                this.choiceQuestionInfo.user.userName=res.data.userName;
            })
            .catch((err) => {
            this.$message.error('系统错误请稍后再尝试');

            })
        },
        //修改时获取第一知识点
        getEditFirstKnowledgePointInfo(row){
            let params = new URLSearchParams();
            params.append("chapter",this.chapterOptions[this.chapterChoice].label);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/queryFirstKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
                //给下拉框内容清空
               this.firstKnowledgePointOptions=[];
               this.firstKnowledgePointList=res.data;
                for(var i=0;i<this.firstKnowledgePointList.length;i++){
                    var firstKnowledgePoint=new Object();
                    firstKnowledgePoint.label=this.firstKnowledgePointList[i];
                    firstKnowledgePoint.value=i;
                    this.firstKnowledgePointOptions.push(firstKnowledgePoint);
                    
                }
                
                for(var i=0;i<this.firstKnowledgePointOptions.length;i++){
                        if(this.firstKnowledgePointOptions[i].label==row.questionLabels[0].firstKnowledgePoint){
                            this.firstKnowledgePointChoice=this.firstKnowledgePointOptions[i].value;
                        }
                    }

                    this.getEditSecondKnowledgePointInfo(row);
            })
            .catch((err)=> {
                this.$message.error('获取第一知识点错误');
                
            })
        },
        //修改时获取第二知识点
        getEditSecondKnowledgePointInfo(row){
            
            let params = new URLSearchParams();
            params.append("chapter",this.chapterOptions[this.chapterChoice].label);
            params.append("firstKnowledgePoint",this.firstKnowledgePointOptions[this.firstKnowledgePointChoice].label);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/questionLabel/querySecondKnowledgePointInfoByChapter',
                data: params
            })
            .then((res)=> {
               //给下拉框内容清空
               this.secondKnowledgePointOptions=[];
               this.secondKnowledgePointList=res.data;
                //重新赋值
                for(var i=0;i<this.secondKnowledgePointList.length;i++){
                    var secondKnowledgePoint=new Object();
                    secondKnowledgePoint.label=this.secondKnowledgePointList[i].secondKnowledgePoint;
                    secondKnowledgePoint.value=this.secondKnowledgePointList[i].questionLabelId;
                    this.secondKnowledgePointOptions.push(secondKnowledgePoint);
                }
                for(var i=0;i<row.questionLabels.length;i++){
                    this.eChoiceQuestionInfo.questionLabels.push(row.questionLabels[i].questionLabelId);   
                }
            })
            .catch((err)=> {
                this.$message.error('获取第二知识点错误');
                
            })
        },
  }
    
}
</script>

<style>
.w2 .el-radio__input{
  border: red 1px;
  border-style:  solid;
}
.w1 .el-input__inner{
   border: red 1px;
  border-style:  solid;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: black;
  cursor: default;
  /* 下拉框禁止*/
  resize: none;
  padding: 0;
}
/* 分页的css样式 */
.pagination {
  display: flex;
  justify-content: center;
}
</style>