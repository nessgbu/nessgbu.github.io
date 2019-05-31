<template>
    <div class="users">
        <ul>
            <li v-for="user in users">
                <span>{{user.name}}</span>
                <span>{{user.email}}</span>
            </li>
            
        </ul>
        <button @click="deleteUser">删除</button>
    </div>
</template>

<script>
export default {
    name : 'users',
    // props : ["users"],
    props : {
        users:{
            type : Array,
            required : true
        }
    },

    data(){
        return {

            }
    },
    methods : {
        show : function(user){
            user.show = !user.show;
        },
        deleteUser : function(){
            this.users.pop();
        }
    }
}
</script>

<style>
    .users{
        width:100%;
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
        box-sizing: border-box;
    }
    ul{
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        padding: 0;
    }
    li{
        flex-grow: 1;
        flex-basis: 200px;
        text-align: center;
        padding: 20px;
        border: 1px solid #222;
        margin: 10px;
        
    }
</style>
