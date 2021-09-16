<template>
  <div>
       <el-input v-model="select_word" size="mini" placeholder="学生姓名" class="handle-input">

        </el-input>
      <el-table :data="data" style="width: 90%" class="tableclass" stripe>
          <el-table-column  label="名次" prop="studentName">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
        </el-table-column>
        <el-table-column  label="姓名">
             <template slot-scope="scope">
                       <router-link
                       :to="{  
                            path: 'studentInfo',     
                            query: {   
                                studentId:scope.row.studentId, 
                                },  
                            }" 
                        >
                        {{scope.row.studentName}}
                        </router-link>
                </template>
        </el-table-column>
       <el-table-column prop="studentProfile" label="个人简介"  >
        </el-table-column>
        <el-table-column prop="studentSolved" label="解决数"  >
        </el-table-column>
        <el-table-column prop="studentSubmit" label="提交数"  >  
        </el-table-column>
         <el-table-column  label="成功率"  align="center" >
            <template slot-scope="scope">
                {{getAcceptRate(scope.row.studentSolved,scope.row.studentSubmit)}}
            </template> 
        </el-table-column>
     </el-table>
      <div class="pagination">
            <el-pagination
            layout="total,prev,pager,next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="selectstudentInfo.length"
            @current-change="handleCurrent">
            </el-pagination>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            studentInfo:[
                {
                    studentId:'',
                    studentName:'',
                    studentProfile:'',
                    studentSolved:'',
                    studentSubmit:'',
                },
            ],
            selectstudentInfo:[],
            select_word:'',
            pageSize:4,
            currentPage:1
        }
    },
    computed:{
        data(){
            return this.selectstudentInfo.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
        }
    },
    watch:{
        select_word:function(){
            if(this.select_word==''){
                this.selectstudentInfo=this.studentInfo;
            }else{
                this.selectstudentInfo=[];
                for(let item of this.studentInfo){
                    if(item.studentName.includes(this.select_word)){
                        this.currentPage=1;
                        this.selectstudentInfo.push(item);
                    }
                }
            }

        }
    },
    mounted:function(){
        this.getStudentInfo();
    },
    methods:{
        handleCurrent(val){
            this.currentPage=val;
        },
        getStudentInfo(){
            let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/student/queryStudentRankListInfo',
                data: params
            })
            .then((res)=> {
                console.log(res)
                  this.studentInfo=res.data;
                  this.selectstudentInfo=res.data;
            })
            .catch((err)=> {
                console.log(err)
                
            })
        },
        getAcceptRate(exerciseCorrectTimes,exerciseSubmitTimes){
                if(!(exerciseCorrectTimes/exerciseSubmitTimes==exerciseCorrectTimes/exerciseSubmitTimes)){
                       var acceptRate=0+"%";
                }
                else{
                      var acceptRate=((exerciseCorrectTimes/exerciseSubmitTimes)*100).toFixed(2)+"%";
                }
            return  acceptRate;
        },
    }


}
</script>
    
<style scoped>
.tableclass{
    margin-left: 5%;
}
.pagination{
    display: flex;
    justify-content: center;
}
.handle-input{
    width:300px;
    display:inline-block;
    margin-left: 5%;
}
</style>