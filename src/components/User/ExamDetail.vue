<template>
  <p>123456</p>
</template>

<script>
export default {
    data(){
        return{
            examId:''
        }
    },
    mounted: function(){
        this.examId=this.$route.query.examId;
        alert(this.examId);
    }
}
</script>

<style>

</style>