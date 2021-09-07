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
            :total="selectExerciseRealTimeInfo.length"
            @current-change="handleCurrent"
            v-if="selectExerciseRealTimeInfo.length!=0"
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
            languageOptions: [{
                value: 'c',
                label: 'c'
                }, {
                value: 'java',
                label: 'java'
                },
                ],
            selectExerciseRealTimeInfo: [],
            select_exerciseId: '',
            select_studentName: '',
            select_language: '',
            select_status: '',
            pageSize: 4,
            currentPage: 1
        }
    },
    
    computed: {
        data () {
             
            return this.exerciseRealTimeInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
    },
    mounted: function () {
        this.currentPage=this.getContextData("currentPage");
        this.getExerciseRealTimeInfo();
    },
    methods:{
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
            params.append("exerciseId",0);
            params.append("studentId",0);
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/exerciseHistory/queryExerciseRealtimeStatusInfo',
                data: params
            })
            .then((res)=> {
                  if(res.data!=0){
                      this.selectExerciseRealTimeInfo=res.data;
                      this.exerciseRealTimeInfo=res.data;
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