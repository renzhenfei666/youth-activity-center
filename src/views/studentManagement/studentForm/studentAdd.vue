<template>
    <div>
        <el-dialog title="注册学生" :visible.sync="addShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="studentName">
                    <el-input v-model="form.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学校名称" :label-width="formLabelWidth" prop="schoolName">
                    <el-select v-model="form.schoolName" clearable placeholder="请选择" @change="getGrade">
                        <el-option
                        v-for="(item,index) in data.schoolName"
                        :key="index"
                        :label="item.schoolName"
                        :value="item.schoolName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年级" :label-width="formLabelWidth" prop="gradeName">
                    <el-select v-model="form.gradeName" clearable placeholder="请选择" @change="getClassNumber">
                        <el-option
                        v-for="(item,index) in data.gradeName"
                        :key="index"
                        :label="item.gradeName"
                        :value="item.gradeName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" :label-width="formLabelWidth" prop="classNumber">
                    <el-select v-model="form.classNumber" clearable placeholder="请选择">
                        <el-option
                        v-for="(item,index) in data.classNumber"
                        :key="index"
                        :label="item.classNumber"
                        :value="item.classNumber">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监护人电话" :label-width="formLabelWidth" prop="mobile">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
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
        sourceType:{
            type:Number
        }
    },
    data() {
        return {
            formLabelWidth: '200px',
            form:{
                studentName:'',
                schoolName:'',
                mobile:'',
                gradeName:'',
                classNumber:'',
                sourceType:this.sourceType,
                status:1,
                isGraduation:0
            },
            data:{
                schoolName:[],
                gradeName:[],
                classNumber:[],
            },
            close:false,
            center:true,
            rules: {
                studentName: [
                    { required: true, message: '请输入学生姓名', trigger: 'blur' }
                ],
                schoolName: [
                    { required: true, message: '请选择学校', trigger: 'change' }
                ],
                gradeName: [
                    { required: true, message: '请选择年级', trigger: 'change' }
                ],
                classNumber: [
                    { required: true, message: '请选择班级', trigger: 'change' }
                ],
                mobile: [
                    { required: true, message: '请输入监护人电话', trigger: 'blur' }
                ],
            },
        };
    },

    created() {
        this.getSchool();
    },
    methods: {
        //加载学校
        getSchool() {
            let p = {}
            p.sql = `select distinct schoolName from student where status = 1`
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result)
                this.data.schoolName = result.data
            })
            .catch(error => {
                console.log(error)
            })
        },
        //加载年级
        getGrade() {
            let p = {}
            p.sql = `select distinct gradeName from student 
            where schoolName = '${this.form.schoolName}' and status = 1 
            ORDER BY FIND_IN_SET(gradeName,'一年级,二年级,三年级,四年级,五年级,六年级,七年级,八年级,九年级')`
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result)
                this.data.gradeName = result.data
            })
            .catch(error => {
                console.log(error);
            })
        },
        //加载班级
        getClassNumber() {
            let p = {}
            p.sql = `select distinct classNumber from student 
            where schoolName = '${this.form.schoolName}' 
            and gradeName = '${this.form.gradeName}' and status = 1 
            order by classNumber asc`
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result)
                this.data.classNumber = result.data
            })
            .catch(error => {
                console.log(error)
            })
        },
        //添加
        add(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = this.form
                    console.log(p)
                    this.api.add("student",p)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                        });
                        this.confirm()
                    }).catch(err =>{
                        console.log(err)
                    })  
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
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
