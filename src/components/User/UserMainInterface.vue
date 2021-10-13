<template>
    <div>
        welcome ojsys
        
    </div>
   
</template>


<script>
export default {
  data(){
    return{
        props: { multiple: true },
        id:[],
        options2:[],
    }
  },
  mounted() {
    
  },
  
  methods:{
        tt(){
            console.log(this.id)
        },
       getInfo(){
        let params = new URLSearchParams();
        this.$axios({
          method: 'post',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: '/label/queryLabelFirstPointInfo',
          data: params
        })
          .then((res) => {
              for(var i=0;i<res.data.length;i++){
                var firstPoint=new Object;
                firstPoint.label=res.data[i];
                firstPoint.children=[];
                this.options2.push(firstPoint);  
              }
              for(var i=0;i<this.options2.length;i++){
                this.getInfo2(i);
              }
          })
          .catch((err) => {
            this.$message.error('失败1');
          })
       },
       getInfo2(i){
          let params = new URLSearchParams();
          params.append("firstPoint",this.options2[i].label)
          this.$axios({
            method: 'post',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: '/label/queryLabelSecondPointInfo',
            data: params
          })
          .then((res) => {
            for(var o=0;o<res.data.length;o++){
              var secondPoint=new Object;
              secondPoint.label=res.data[o].secondPoint;
              secondPoint.value=res.data[o].labelId;
              this.options2[i].children.push(secondPoint);
            }
          })
          .catch((err) => {
            this.$message.error('失败2');
          })
      }
  }
}
</script>