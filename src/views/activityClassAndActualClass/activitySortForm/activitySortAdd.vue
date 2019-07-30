<template>
    <div>
        <el-dialog title="添加" :visible.sync="addShow" :center="center" top="10vh" :show-close="close">
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
                <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        addShow:{
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
                isDeleted:0
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

    methods: {
        //添加
        add(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = this.form;
                    console.log(p);  
                    this.api.add("activitySort",p)
                    .then(result => {
                        console.log(result);
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
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
}
</script>

<style scoped>

</style>
