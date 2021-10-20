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
        <el-form :model="aCompletionQuestionInfo" label-width="80px"  ref="aCompletionQuestionInfo">
            <el-form-item prop="completionQuestionDescription" label="题目描述" size="mini">
                <el-input v-model="aCompletionQuestionInfo.completionQuestionDescription" placeholder="题目描述" type="textarea" :autosize="true" style="resize:none;" >
                </el-input>
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
                <el-select v-model="addCompletionQuestionFirstKnowledgeChoice" placeholder="请选择"  @change="addCompletionQuestionFirstPointClick()" style="margin-left:20px">
                    <el-option
                    v-for="(item,index) in addCompletionQuestionFirstKnowledgeOption"
                    :key="index"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-select v-model="aCompletionQuestionInfo.questionLabels" multiple placeholder="请选择"  style="margin-left:20px;width:400px">
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

  </div>
</template>

<script>
export default {
    data(){
        return{
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
            addCompletionQuestionChapterChoice:'',
            addCompletionQuestionFirstKnowledgeOption:[],
            addCompletionQuestionFirstKnowledgeChoice:'',
            addCompletionQuestionSecondKnowledgeOption:[],
            completionQuestionInfoList:[],
            chapterList:[],


        }
    },
    mounted:function(){
        //获取填空题信息
        this.getCompletionQuestionInfo();
        //获取章节信息
        this.getQuestionLabelInfo();
    },
    methods:{
        //添加填空题信息
        addCompletionQuestionInfo(){

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
            let params = new URLSearchParams();
            console.log(this.addCompletionQuestionChapterChoice)
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
        //控制详情弹出框显示
        handleShow(row){

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

</style>