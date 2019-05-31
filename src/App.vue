<!-- 模板：html结构 -->
<template>
  <div id="app">
    <ul>
      <li><router-link to='/'>Home</router-link></li>
      <li><router-link to='/helloworld'>Hello</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<!-- 行为 -->
<script>
export default {
  name : 'app',
  data(){
    return {

    }
  }
  
}
</script>

<!-- 样式 -->
<style>
#app {

}
</style>
