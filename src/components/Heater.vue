<template>
    <heater >
        <h1 @click="changeTitle">Welcom! {{ title }}</h1>
    </heater>
</template>

<script>
export default {
    props : {
        title : {
            type : String
        }
    },
    methods : {
        changeTitle : function(){
            this.$emit("titleChanged","Title Changed Already!");//第一个参数是事件名，第二个参数是传的参数
        }
    }
}
</script>

<style scoped>
    heater{
        margin: 0 auto;
        height: 100px;
        position: relative;
        display: block;
        background-color: #333;
        line-height: 100px;
    }
    h1{
        text-align: center;
        color: #FFF;
    }
</style>




