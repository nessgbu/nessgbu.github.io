<template>
    <Footer class="footer">
        <p>Copyright 2017 Vue  {{ title }}</p>
    </Footer>
</template>

<script>
export default {
    props : {
        title : {
            type : String
        }
    }
}
</script>

<style scoped>
    Footer{
        height: 50px;
        line-height: 50px;
        background-color: #333;
    }
    p{
        text-align: center;
        color: white;
    }
</style>
