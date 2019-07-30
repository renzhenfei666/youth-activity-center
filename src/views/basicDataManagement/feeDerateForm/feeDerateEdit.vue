<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
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
                    <el-select v-model="form.classNumber" clearable placeholder="请选择" @change="getStudent">
                        <el-option
                        v-for="(item,index) in data.classNumber"
                        :key="index"
                        :label="item.classNumber"
                        :value="item.classNumber">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="studentName">
                    <el-select v-model="form.studentName" clearable placeholder="请选择" @change="getStudentName">
                        <el-option
                        v-for="item in data.studentName"
                        :key="item.id"
                        :label="item.studentName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="减免费用" :label-width="formLabelWidth" prop="derateFee">
                    <el-input placeholder="请输入金额" v-model="form.derateFee" type="number"></el-input>
                </el-form-item>
                <el-form-item label="减免原因" :label-width="formLabelWidth" prop="reason">
                    <el-input
                    type="textarea"
                    placeholder="请输入减免原因"
                    v-model="form.reason"
                    maxlength="100"
                    show-word-limit>
                    </el-input>
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
                schoolName:'',
                gradeName:'',
                classNumber:'',
                studentName:'',
                derateFee:null,
                reason:'',
                studentId:'',
                isUsed:0,
                userOrderId:'',
                useTime:''
            },
            data:{
                schoolName:[],
                gradeName:[],
                classNumber:[],
                studentName:[],
            },
            close:false,
            center:true,
            rules: {
                schoolName: [
                    { required: true, message: '请选择学校', trigger: 'change' }
                ],
                gradeName: [
                    { required: true, message: '请选择年级', trigger: 'change' }
                ],
                classNumber: [
                    { required: true, message: '请选择班级', trigger: 'change' }
                ],
                studentName: [
                    { required: true, message: '请选择学生', trigger: 'change' }
                ],
                derateFee: [
                    { required: true, message: '请输入减免费用', trigger: 'blur' }
                ],
            },
        };
    },

    mounted() {
        // this.view(this.id);
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
        //加载学生
        getStudent(){
            let p = {}
            p.sql = `select id,studentName from student 
            where schoolName = '${this.form.schoolName}' 
            and gradeName = '${this.form.gradeName}' 
            and classNumber = '${this.form.classNumber}' and status = 1 
            order by classNumber asc`
            console.log(p)
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result)
                this.data.studentName = result.data
            })
            .catch(error => {
                console.log(error)
            })
        },
        getStudentName(id){
            let p = {}
            p.sql = `select studentName from student 
            where id = '${id}' and status = 1`
            console.log(p)
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result)
                this.form.studentName = result.data[0].studentName
                this.form.studentId = id
            })
            .catch(error => {
                console.log(error)
            })
        },
        getDetailById() {
            let p = {};
            p.id = this.id;
            console.log(p);  
            this.api.getDetailById("feeDerate",p)
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
                    let p = this.form
                    p.createTime = this.moment(this.form.createTime).format("YYYY-MM-DD HH:mm:ss")
                    p.modifyTime = this.moment().format("YYYY-MM-DD HH:mm:ss")
                    console.log(p)
                    this.api.update("feeDerate",p)
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
