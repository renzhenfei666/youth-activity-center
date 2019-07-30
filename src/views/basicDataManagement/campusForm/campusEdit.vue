<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="form.serialNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动中心名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地点" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="modify('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        editShow:{
            type:Boolean,
            default:false
        },
        id:{
            type:String
        }
    },
    data() {
        return {
            formLabelWidth: '200px',
            form:{
                id:'',
                serialNumber:'',
                name:'',
                address:'',
            },
            close:false,
            center:true,
            rules: {
                serialNumber: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入活动中心名称', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入地点', trigger: 'blur' }
                ],
            }
        };
    },

    mounted() {
        // this.view(this.id);
    },
    methods: {
        getDetailById(id) {
            let p = {};
            p.id = id;
            console.log(p);  
            this.api.getDetailById("activityCenter",p)
            .then(result => {
                console.log(result);
                let data = result.data;
                this.form = data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //修改
        modify(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = this.form;
                    this.api.update("activityCenter",p)
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
                this.getDetailById(this.id);
            }
        },
    }
};
</script>

<style scoped>

</style>
