<template>
  <div>
      456121212
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
            }
        }
    },
    mounted:function(){
        this.addChoiceQuesionInfo();
    },
    methods:{
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