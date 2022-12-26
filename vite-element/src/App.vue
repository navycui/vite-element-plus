<script setup>
  import Footer from '@/components/layout/Footer.vue'
  import Header from '@/components/layout/Header.vue'

  // export default {
  //   name: 'App',
  //   components: {
  //     Header,
  //     Footer
  //   },
  //   data() {
  //     return {
  //       sys_id:'',
  //       sessionStorage:''
  //     }
  //   },
  //   mounted(){
  //     // this.callSve()
  //   },
  //   methods:{// 'Content-Type': 'text/xml','Content-Type': 'application/json;charset=UTF-8'
  //     callSve(){
  //       console.log('axios calll')
  //       this.axios.get('http://localhost:8080/api/users',{params:{userId:'haijun',pwd:'123'}}).then(res => {
  //         console.log("Access-Control-Allow-Methods",res)
  //       }).catch((e)=>{
  //         console.log(e)
  //       })
  //     },
  //   }
  // }
</script>

<template>
  <div class="wrap">
    <div class="wrapInner">
      <Header/>
        <div id="container" class="container">
          <div id="content" class="content">
            <router-view></router-view>
          </div>
        </div>
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
