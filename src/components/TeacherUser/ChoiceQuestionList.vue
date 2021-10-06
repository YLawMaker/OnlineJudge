<template>
  <div>
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
  </div>
</template>

<script>
export default {
    data(){
        return{
            choiceQuestionInfo:{
                choiceQuestionId:'',
                choiceQuestionDescription:'描述',
                choiceQuestionStemA:'1',
                choiceQuestionStemB:'2',
                choiceQuestionStemC:'3',
                choiceQuestionStemD:'4',
                choiceQuestionCorrectOption:'3',
                choiceQuestionDifficulty:'4',
                isPrivate:'false',
                questionLabels:[
                    {
                        questionLabelId:'',
                        chapter:'1',
                        firstKnowledgePoint:'2',
                        secondKnowledgePoint:'3',
                    },
                    {
                        questionLabelId:'',
                        chapter:'1',
                        firstKnowledgePoint:'2',
                        secondKnowledgePoint:'3',
                    },
                    
                ]
            },
            choiceQuestionList:[],
        }
    },
    mounted:function(){
        this.addChoiceQuesionInfo();
    },
    methods:{
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        //添加选择题信息
        addChoiceQuesionInfo(){
           
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/json"
                            },
                url: '/choiceQuestion/addChoiceQuestionInfo',
                data: this.choiceQuestionInfo
            })
            .then((res)=> {
                console.log(res)
                  
            })
            .catch((err)=> {
                this.$message.error('错误');
                
            })
        }
    }
}
</script>

<style>

</style>