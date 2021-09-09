<template>
  <div>
      <span class="span-label" style="margin-left:5%">考试名称</span>
      <el-input
      v-model="select_examName"
      size="mini"
      placeholder="考试名称"
      class="handle-input"
      clearable=""
      >
      </el-input>
      <span class="span-label" style="margin-left:2%">创建人</span>
      <el-input
      v-model="select_teacherName"
      size="mini"
      placeholder="创建人"
      class="handle-input"
      clearable=""
      >
      </el-input>
      <span class="span-label">考试状态</span>
      <el-select v-model="select_examType" placeholder="请选择" size="mini" class="handle-select" style="margin-left:1%">
      <el-option
      v-for="item in examTypeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="searchExamInfo()" style="margin-left:2%">查询</el-button>
      <el-table :data="data" style="width: 90%" class="tableclass" stripe>
        <el-table-column prop="examId" label="考试编号"> </el-table-column>
        <el-table-column  label="考试名称"> 
            <template slot-scope="scope" >
                <span @click="gotoExamDetail(scope.row.examId,scope.row.examType,scope.row.classes.classesId)" style="cursor: pointer">
                        {{scope.row.examName}}
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="examStartTime" label="考试开始时间"> </el-table-column>
        <el-table-column prop="examEndTime" label="考试结束时间"> </el-table-column>
        <el-table-column prop="classes.classesName" label="面向班级"> </el-table-column>
        <el-table-column  label="考试状态" > 
            <template slot-scope="scope">
             <span v-if="scope.row.examType=='Pending'" style="color:green">
               {{scope.row.examType}}
             </span>
             <span v-if="scope.row.examType=='Running'" style="color:red">
                  {{scope.row.examType}}
             </span>
             <span v-if="scope.row.examType=='Ended'">
                  {{scope.row.examType}}
             </span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher.teacherName" label="创建人"> </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="examInfo.length"
        @current-change="handleCurrent"
        v-if="examInfo.length!=0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            examInfo:[
                {
                    examId:'',
                    examName:'',
                    examStartTime:'',
                    examEndTime:'',
                    examType:'',
                    teacher:{
                        teacherId:'',
                        teacherName:''
                    },
                    classes:{
                        classesId:'',
                        classesName:'',
                    }
                }
            ],
            examTypeOptions: [
                {
                value: '',
                label: ''
                },
                {
                value: 'Ended',
                label: 'Ended'
                }, {
                value: 'Running',
                label: 'Running'
                },
                {
                value: 'Pending',
                label: 'Pending'
                },
            ],
            select_examType:'',
            select_examName:'',
            select_teacherName:'',
            pageSize: 4,
            currentPage: 1
        }
    },
    computed: {
        data () {
            return this.examInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
  },
    mounted: function () {
        var page=this.getContextData("currentPage");
        if(page==null){
            this.setContextData("currentPage",1);
        }
        if(this.getContextData("select_examName")==null){
          this.setContextData("select_examName",'');
        }
        if(this.getContextData("select_examType")==null){
          this.setContextData("select_examType",'');
        }
        if(this.getContextData("select_teacherName")==null){
          this.setContextData("select_teacherName",'');
        }
        this.getExamInfo();
    },
    methods:{
        searchExamInfo(){
          //查询之后返回第一页
          this.setContextData("currentPage",1);
          //保存查询信息
          if(this.select_examName!=''){
                this.setContextData("select_examName", this.select_examName);
          }else{
              this.setContextData("select_examName", '');
          }
          if(this.select_examType!=''){
                this.setContextData("select_examType", this.select_examType);
          }else{
              this.setContextData("select_examType", '');
          }
          if(this.select_teacherName!=''){
                this.setContextData("select_teacherName", this.select_teacherName);
          }else{
              this.setContextData("select_teacherName", '');
          }
          this.getExamInfo();
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
        //去到考试详情界面
        gotoExamDetail(examId,examType,classesId){
            let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/student/queryStudentInfo',
                data: params
            })
            .then((res)=> {
    
                  if(res.data!=0){
                      if(res.data.classes.classesId==classesId){
                          if(examType!="Running"){
                              this.$message.warning('不在考试时段或考试已结束');
                          }else{
                              this.$router.push({path:'/examDetail',query: {"examId":examId}})
                          }
                      }else{
                          
                         this.$message.warning('没有权限参加此考试');
                      }
                      
                       
                  }else{
                      this.$message('请先登录');
                      this.$router.push('/studentLogin');
                  }
            })
            .catch((err)=> {
                this.$message.error('查询学生信息失败');
                
            })
            


            
        },
        //换页时调用
        handleCurrent (val) {
            this.currentPage = val;
            this.setContextData("currentPage",this.currentPage);
        },
        //获取考试信息
        getExamInfo () {
            this.select_examName=this.getContextData("select_examName");
            this.select_examType=this.getContextData("select_examType");
            this.select_teacherName=this.getContextData("select_teacherName");
            let params = new URLSearchParams();
            params.append("examName",this.select_examName);
            params.append("examType",this.select_examType);
            params.append("teacherName",this.select_teacherName);
            this.$axios({
                method: 'post',
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                url: '/exam/searchExamInfo',
                data: params
            })
            .then((res) => {
              this.examInfo = res.data;
              this.currentPage=this.getContextData("currentPage");
            })
            .catch((err) => {
              this.$message.error('查询考试信息失败');

            })
        },
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
  width: 300px;
  display: inline-block;
  margin-left: 1%;
}
.span-label{
    margin-left: 1%; 
}
.handle-select{
  width: 200px;
  display: inline-block;
}
</style>