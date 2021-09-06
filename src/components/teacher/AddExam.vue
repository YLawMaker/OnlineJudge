<template>
  <div>
      456789
  </div>
</template>

<script>
export default {
    data(){
        return{
            teacher:{
                teacherName:''
            }
        }
    },
    mounted:function(){
        this.getTeacherInfo();
    },
    methods:{
        getTeacherInfo(){
            let params=new URLSearchParams();
            this.$axios({
                method: 'post',
                headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                            },
                url: '/teacher/queryTeacherInfoById',
                data: params
            })
            .then((res)=> {
                  this.teacher=res.data;
                  console.log(this.teacher);
            })
            .catch((err)=> {
                this.$message.error('系统错误请稍后再尝试');
                
            })
        }
    }
}
</script>

<style>

</style>