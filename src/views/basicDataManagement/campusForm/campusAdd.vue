<template>
    <div>
        <el-dialog title="添加" :visible.sync="addShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <!-- <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="form.serialNumber" autocomplete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="活动中心名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地点" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addAwait('ruleForm')">确 定</el-button>
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
                // serialNumber:'',
                name:'',
                address:'',
            },
            close:false,
            center:true,
            rules: {
                // serialNumber: [
                //     { required: true, message: '请输入序号', trigger: 'blur' },
                // ],
                name: [
                    { required: true, message: '请输入活动中心名称', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入地点', trigger: 'blur' }
                ],
            },
        };
    },

    mounted() {
        // this.view(this.id);
    },
    methods: {
        //添加
        addAwait(formName){
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    try{
                        let data = await this.getMaxSerialNumber()
                        let result = await this.add(formName,data)
                        this.confirm()
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                        })
                    }catch(err){
                        this.cancel()
                        this.$message.error('添加失败');
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        add(formName,data) {
            let p = {};
            p.serialNumber = Number(data.data[0].serialNumber) + 1
            p.name = this.form.name
            p.address = this.form.address
            return this.api.add("activityCenter",p)
        }, 
        //获取最大的序号
        getMaxSerialNumber() {
            let p = {};
            p.sql = "select max(serialNumber) as serialNumber from activityCenter";
            return this.api.queryForMap("activityCenter",p)
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
};
</script>

<style scoped>

</style>
