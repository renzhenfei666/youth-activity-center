<template>
    <div class="login">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="email">
                <el-input placeholder="请输入账号" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                email:"",
                password:"",
            },
            rules: {
                email: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        };
    },
    mounted() {

    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.login()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        login(){
            this.axios.get('/api/login',{params:{email:this.form.email,password:this.form.password}})
            .then(res => {
                console.log(res);
                if(res.code===0){
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    sessionStorage.setItem('userId',res.data.id)
                    this.$router.push("/articleList");
                }else{
                    this.$message.error('用户名或密码错误');
                }
            })
            .catch(err => console.log(err))
        }
    },
};
</script>

<style lang="stylus" scoped>
.login
    width 100%
    height 100%
    background #2f4050

    .el-form
        position absolute
        width 400px
        height 200px
        top 50%
        left 50%
        transform translate(-50%,-50%)
        background #fff
        padding 70px 20px 0 20px
        .headPic
            width 100px
            height 100px
            border-radius 50%
            background #fff
            position absolute
            left 170px
            top -40px
            img
                display block
                width 80px
                height 80px
                border-radius 50%
                position absolute
                left 10px
                top 10px
        .el-form-item
            padding-bottom 10px
            .el-button
                margin 0 auto
                width 100%

</style>

