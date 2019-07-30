<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="班级编号" :label-width="formLabelWidth" prop="classCode">
                    <el-input v-model="form.classCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="班级名称" :label-width="formLabelWidth" prop="className">
                    <el-input v-model="form.className" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上课时间" :label-width="formLabelWidth" prop="classTime">
                    <el-input v-model="form.classTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上课地点" :label-width="formLabelWidth" prop="classPlace">
                    <el-input v-model="form.classPlace" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="任课老师" :label-width="formLabelWidth" prop="teacherId">
                    <el-input v-model="form.teacherId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="任课老师手机号" :label-width="formLabelWidth" prop="teacherMobile">
                    <el-input v-model="form.teacherMobile" autocomplete="off"></el-input>
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
                classCode:'',
                className:'',
                classTime:'',
                classPlace:'',
                teacherId:'',
                teacherMobile:'',
            },
            close:false,
            center:true,
            rules: {
                classCode: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
                className: [
                    { required: true, message: '请输入活动中心名称', trigger: 'blur' }
                ],
                classTime: [
                    { required: true, message: '请输入地点', trigger: 'blur' }
                ],
                classPlace: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
                teacherId: [
                    { required: true, message: '请输入活动中心名称', trigger: 'blur' }
                ],
                teacherMobile: [
                    { required: true, message: '请输入地点', trigger: 'blur' }
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
            this.api.getDetailById("actualClass",p)
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
                this.getDetailById();
            }
        },
    }
};
</script>

<style scoped>

</style>
