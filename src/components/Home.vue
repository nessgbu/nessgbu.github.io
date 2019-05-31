<template>
    <div class="home">
        <App-Heater v-bind:title="title"></App-Heater>
        <User v-bind:users="users"></User>
        <App-Footer v-bind:title="title"></App-Footer>
    </div>
</template>

<!-- 行为 -->
<script>
import User from './Users'
import Heater from './Heater'
import Footer from './Footer'

export default {
  name: 'App',
  components: {
    'App-Heater':Heater,
    User,
    'App-Footer':Footer
    
  },
  data(){
    return {
        users : [],
        title : 'This is a title'
    }
  },
  methods : {
    // updateTitle : function(title){
    //   this.title = title;
    // }
  },
    created(){
        this.$http.get('http://jsonplaceholder.typicode.com/users').then( (data) => { this.users = data.body; });
    }
}
</script>

<!-- 样式 -->
<style>
#app {

}
</style>