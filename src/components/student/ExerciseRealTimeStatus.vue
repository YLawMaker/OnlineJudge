<template>
  <div>

        <el-input
        v-model="select_exerciseId"
        size="mini"
        placeholder="习题id"
        class="handle-input"
        >
        </el-input>
        <el-input
        v-model="select_studentName"
        size="mini"
        placeholder="学生姓名"
        class="handle-input"
        >
        </el-input>
         <el-select v-model="select_language" placeholder="请选择" size="mini" class="handle-select">
            <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
         <el-select v-model="select_status" placeholder="请选择" size="mini" class="handle-select">
            <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>

        <el-button type="primary" size="mini" @click="searchExerciseRealTimeInfo()" style="margin-left:2%">查询</el-button>

      <el-table :data="data" style="width: 90%" class="tableclass" stripe>
        <el-table-column prop="exerciseHistoryId" label="习题记录编号">
        </el-table-column>
        <el-table-column prop="exerciseSubmitTime" label="提交时间">
        </el-table-column>
         <el-table-column prop="exerciseResult" label="提交结果">
        </el-table-column>
        <el-table-column prop="exercise.exerciseId" label="习题编号">
        </el-table-column>
        <el-table-column label="代码长度">
           <router-link
            style="text-decoration: none; color: black"
            :to="{
              path: '/submitCode',
              
            }"
          >
            代码
          </router-link>
        </el-table-column>
        <el-table-column prop="exerciseSubmitLanguage" label="提交语言">
        </el-table-column>
        <el-table-column prop="student.studentName" label="提交作者">
        </el-table-column>
    </el-table>

     <div class="pagination">
        <el-pagination
            layout="total,prev,pager,next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="exerciseRealTimeInfo.length"
            @current-change="handleCurrent"
            v-if="exerciseRealTimeInfo.length!=0"
        >
        </el-pagination>
     </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            exerciseRealTimeInfo:[
               {
                   exerciseHistoryId:'',
                   exerciseSubmitTime:'',
                   exerciseResult:'',
                   exerciseSubmitLanguage:'',   
                   exerciseCode:'',
                   student:{
                       studentId:'',
                       studentName:''
                   },
                   exercise:{
                       exerciseId:'',
                   }
               }
            ],
            languageOptions: [
                {
                value: '',
                label: '     '
                },
                {
                value: 'c',
                label: 'c'
                }, {
                value: 'java',
                label: 'java'
                },
            ],
            statusOptions: [
                {
                value: '',
                label: '     '
                },
                {
                value: 'accept',
                label: 'accept'
                }, {
                value: 'wrong answer',
                label: 'wrong answer'
                },
                {
                value: 'loding',
                label: 'loding'
                },
            ],
            select_exerciseId: '',
            select_studentName: '',
            select_language: '',
            select_status: '',
            pageSize: 4,
            currentPage: 1,
        }
    },
    
    computed: {
        data () {
            
            return this.exerciseRealTimeInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);

        }
    },
    mounted: function () {
        
        this.setContextData("currentPage",1);
        this.getExerciseRealTimeInfo();
    },
    methods:{
        searchExerciseRealTimeInfo(){
            this.setContextData("currentPage",1);
            this.getExerciseRealTimeInfo();
            if(this.select_exerciseId!=''){
                  sessionStorage.setItem(select_exerciseId, this.select_exerciseId);
            }
            if(this.select_studentName!=''){
                  sessionStorage.setItem(select_studentName, this.select_studentName);
            }

            // if(this.select_language!=''){
            //     alert(this.select_language)
            //       sessionStorage.setItem(select_language, this.select_language);
            // }
            if(this.select_status!=''){
                  sessionStorage.setItem(select_status, this.select_status);
            }
        },
        //给sessionStorage存值
        setContextData: function(key, value) { 
            if(typeof value == "string"){
                sessionStorage.setItem(key, value);
            }else{
                sessionStorage.setItem(key, JSON.stringify(value));
            }
            },
        // 从sessionStorage取值
        getContextData: function(key){
            const str = sessionStorage.getItem(key);
            if( typeof str == "string" ){
                try{
                return JSON.parse(str);
                }catch(e) {
                return str;
                }
            }
            return;
            },
        handleCurrent (val) {
            this.currentPage = val;
            this.setContextData("currentPage",this.currentPage);
        },
        getExerciseRealTimeInfo(){
            let params=new URLSearchParams();
            if(this.select_exerciseId!=''){
                //不为空格
                if(this.select_exerciseId.length > 0 && this.select_exerciseId.trim().length != 0){
                    var numReg = /^[0-9]+$/
                    var numRe = new RegExp(numReg)
                    if(numRe.test(this.select_exerciseId)){
                        params.append("exerciseId",this.select_exerciseId);
                    }
                    else{
                       params.append("exerciseId",0);
                    }
                }
                else{
                     params.append("exerciseId",0);
                }
            }else{
                  params.append("exerciseId",0);
            }
            if(this.select_studentName!=''){
                 //不为空格
                if(this.select_studentName.length > 0 && this.select_studentName.trim().length != 0){
                    params.append("studentName",this.select_studentName);
                }
                else{
                    params.append("studentName",'');
                }
            }else{
                params.append("studentName",'');
            }
            if(this.select_language==null){
                params.append("exerciseSubmitLanguage",'');
            }else{
                 params.append("exerciseSubmitLanguage",this.select_language);
            }
            if(this.select_status==null){
                 params.append("exerciseResult",'');
            }else{
                params.append("exerciseResult",this.select_status);
            }
           
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/exerciseHistory/queryExerciseRealTimeStatusInfo',
                data: params
            })
            .then((res)=> {
                  if(res.data!=0){
                    this.exerciseRealTimeInfo=res.data;
                      
                    this.currentPage=this.getContextData("currentPage");
                    // this.select_exerciseId=sessionStorage.getItem("select_exerciseId");
                    // this.select_studentName=sessionStorage.getItem("select_studentName");
                    // this.select_language=sessionStorage.getItem("select_language");
                    // this.select_status=sessionStorage.getItem("select_status");
                      
                      
                   
                  }else{
                      var t=[]
                      this.exerciseRealTimeInfo=t;
                      this.currentPage=1;
                  }
            })
            .catch((err)=> {
                this.$message.error('查询学生信息失败');
                
            })
        }
    }
}
</script>

<style>
.tableclass {
  margin-left: 5%;
}
.pagination {
  display: flex;
  justify-content: center;
}
.handle-input {
  width: 200px;
  display: inline-block;
  margin-left: 5%;
}
.handle-select{
  width: 200px;
  display: inline-block;
  margin-left: 5%;
}
</style>