<template>
  <div>
      <div class="submit">
           <div class="select">
                <el-select v-model.trim="value" placeholder="请选择" style="width:20%">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                </el-select>
           </div>
           
            <el-input type="textarea" class="submitText" v-model="code" :rows="20" placeholder="请输入代码">

            </el-input>
            <el-button type="primary" @click="submitCode()">提交</el-button>
      </div>
     
  </div>
</template>

<script>
export default {
    data(){
        return{
            code:'',
            exercise:{
                exerciseId:'',
            },
            options: [{
                    value: 'c',
                    label: 'c'
                }, {
                    value: 'java',
                    label: 'java'
                }],
            value:'c',
            exerciseHistoryId:'',
        }    
    },
    mounted: function () {
      this.exercise.exerciseId = this.$route.query.exerciseId;
      this.exerciseHistoryId = this.$route.query.exerciseHistoryId;
      if(!this.exerciseHistoryId){

      }
      //有传值过来
      else{
            this.getCodeInfo();
      }
      
    },
    methods:{
        //提交代码
        submitCode(){
            let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/user/queryUserInfo',
                data: params
            })
            .then((res)=> {
                  if(res.data!=0){
                        if(this.code.trim().length<20){
                            this.$message.warning('代码长度过短');
                        }
                        else{
                            let yy = new Date().getFullYear();
                        　　let mm = new Date().getMonth()+1;
                        　　let dd = new Date().getDate();
                        　　let hh = new Date().getHours()<10?'0'+new Date().getHours():new Date().getHours();
                        　　let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
                        　　var time = yy+'-'+mm+'-'+dd+' '+hh+':'+mf;
                            let params=new URLSearchParams();
                            params.append('exerciseId',this.exercise.exerciseId);
                            params.append('exerciseSubmitLanguage',this.value);
                            params.append('exerciseCode',this.code);
                            params.append('exerciseSubmitTime',time);
                            this.$axios({
                                method: 'post',
                                headers: {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                url: '/exerciseHistory/addCodeInfo',
                                data: params
                            })
                            .then((res)=> {
                                if(res.data==true){
                                    this.$message.success('提交成功');
                                    this.$router.push('exerciseRealTimeStatus');
                                }
                            })
                            .catch((err)=> {
                                this.$message.error('提交失败');
                            })
                        }
                        
                  }else{
                      this.$message('请先登录');
                      this.$router.push('/userLogin');
                  }
            })
            .catch((err)=> {
                this.$message.error('查询学生信息失败');
                
            })
           
        },
        //获得提交的代码信息
        getCodeInfo(){
             
                let params=new URLSearchParams();
                params.append('exerciseHistoryId',this.exerciseHistoryId);
            
                this.$axios({
                    method: 'post',
                    headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                                },
                    url: '/exerciseHistory/queryCodeInfoByExerciseHistoryId',
                    data: params
                })
                .then((res)=> {
                    this.code=res.data;
                })
                .catch((err)=> {
                    this.$message.error('查看代码失败');
                })
            }
                        
                
        
    }

}
</script>

<style>
.submit{
    text-align: center;
    margin-left: 32.5%;
    width: 35%;
    height: 700px;
}
.select{
    width: 100%;
    text-align-last: center;
}
.submitText{
    resize: none;
    width: 600px;
    height: 500px;
}
</style>