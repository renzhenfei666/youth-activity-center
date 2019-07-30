<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="form.serialNumber" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="类别" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="editor('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        id:{
            type:String,
            default:''
        },
        editShow:{
            type:Boolean,
            default:false
        },
    },
    data() {
        return {
            formLabelWidth: '200px',
            form:{
                serialNumber:'',
                name:'',
                description:'',
            },
            close:false,
            center:true,
            rules: {
                serialNumber: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入类别', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入说明', trigger: 'blur' }
                ],
            }
        };
    },

    mounted() {
        // this.view(this.id);
    },
    methods: {
        getDetailById() {
            let p = {};
            p.id = this.id;
            console.log(p);  
            this.api.getDetailById("activitySort",p)
            .then(result => {
                console.log(result);
                this.form = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //修改
        editor(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = this.form
                    p.createTime = this.moment(this.form.createTime).format("YYYY-MM-DD HH:mm:ss")
                    p.modifyTime = this.moment().format("YYYY-MM-DD HH:mm:ss")
                    console.log(p)
                    this.api.update("activitySort",p)
                    .then(result => {
                        console.log(result);
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                        });
                        this.confirm();
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(){
            this.$emit('handCancel');
            this.$refs['ruleForm'].resetFields();
        },
        confirm(){
            this.$emit('handCancel');
            this.$emit('getPageInfo');
            this.$refs['ruleForm'].resetFields();
        }
    },
    watch:{
        id(){
            if(this.id){
                this.getDetailById();
            }
        },
    }
};
</script>

<style scoped>

</style>
