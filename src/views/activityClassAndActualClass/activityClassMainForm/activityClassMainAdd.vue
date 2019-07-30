<template>
    <div>
        <el-dialog title="添加" :visible.sync="addShow" :center="center" top="10vh" :show-close="close">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="学年" :label-width="formLabelWidth" prop="schoolYear">
                    <el-input v-model="form.schoolYear" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学期" :label-width="formLabelWidth" prop="semester">
                    <el-input v-model="form.semester" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="招生简章" :label-width="formLabelWidth" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="新生报名开始时间" :label-width="formLabelWidth" prop="startTime">
                    <el-date-picker
                    v-model="form.startTime"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="新生报名结束时间" :label-width="formLabelWidth" prop="endTime">
                    <el-date-picker
                    v-model="form.endTime"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="老生报名开始时间" :label-width="formLabelWidth" prop="oldStartTime">
                    <el-date-picker
                    v-model="form.oldStartTime"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="老生报名结束时间" :label-width="formLabelWidth" prop="oldEndTime">
                    <el-date-picker
                    v-model="form.oldEndTime"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="调班截止时间" :label-width="formLabelWidth" prop="classTransferDeadline">
                    <el-date-picker
                    v-model="form.classTransferDeadline"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="退班截止时间" :label-width="formLabelWidth" prop="classRetireDeadline">
                    <el-date-picker
                    v-model="form.classRetireDeadline"
                    type="datetime" value-format="timestamp"
                    placeholder="选择日期时间">
                    </el-date-picker>
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
                schoolYear:'',
                semester:'',
                name:'',
                content:'',
                startTime:'',
                endTime:'',
                status: 0,
                isDeleted: 0,
                oldStartTime:'',
                oldEndTime:'',
                classTransferDeadline:'',
                classRetireDeadline:''
            },
            close:false,
            center:true,
            rules: {
                schoolYear: [
                    { required: true, message: '请输入学年', trigger: 'blur' },
                ],
                semester: [
                    { required: true, message: '请输入学期', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入招生简章', trigger: 'blur' }
                ],
                startTime: [
                    { type: 'date', required: true, message: '请选择新生报名开始时间', trigger: 'change' }
                ],
                endTime: [
                    { type: 'date', required: true, message: '请选择新生报名结束时间', trigger: 'change' }
                ],
                oldStartTime: [
                    { type: 'date', required: true, message: '请选择老生报名开始时间', trigger: 'change' }
                ],
                oldEndTime: [
                    { type: 'date', required: true, message: '请选择老生报名结束时间', trigger: 'change' }
                ],
                classTransferDeadline: [
                    { type: 'date', required: true, message: '请选择调班截止时间', trigger: 'change' }
                ],
                classRetireDeadline: [
                    { type: 'date', required: true, message: '请选择退班截止时间', trigger: 'change' }
                ]
            }
        };
    },

    mounted() {
        // this.view(this.id);
    },
    methods: {
        //添加
        add(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.endTime < this.form.startTime) {
                        this.$message.error('报名结束时间需要大于开始时间！');
                        return;
                    }
                    if (this.form.oldEndTime < this.form.oldStartTime) {
                        this.$message.error('老生报名结束时间需要大于开始时间！');
                        return;
                    }
                    let p = this.form;
                    p.classTransferDeadline = this.moment(this.form.classTransferDeadline).format("YYYY-MM-DD HH:mm:ss");
                    p.classRetireDeadline = this.moment(this.form.classRetireDeadline).format("YYYY-MM-DD HH:mm:ss");
                    p.oldStartTime = this.moment(this.form.oldStartTime).format("YYYY-MM-DD HH:mm:ss");
                    p.oldEndTime = this.moment(this.form.oldEndTime).format("YYYY-MM-DD HH:mm:ss");
                    p.startTime = this.moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss");
                    p.endTime = this.moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss");
                    console.log(p);  
                    this.api.add("activityClassMain",p)
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
};
</script>

<style scoped>

</style>
