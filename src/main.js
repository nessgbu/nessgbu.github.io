// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Users from './components/Users'
import Home from './components/Home'
import HelloWorld from './components/HelloWorld'
Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.component('Users',Users);
Vue.use(VueRouter);
Vue.use(VueResource);
//配置路由
const router = new VueRouter({
  routes : [
    {path : "/",component : Home},
    {path : '/helloworld',component : HelloWorld}
  ],
  mode : 'history'
});

new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'

})
