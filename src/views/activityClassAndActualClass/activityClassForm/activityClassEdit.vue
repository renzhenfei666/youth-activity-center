<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="学期" :label-width="formLabelWidth" prop="activityClassMainId">
                    <el-select v-model="form.activityClassMainId" clearable placeholder="请选择">
                        <el-option
                        v-for="item in data.activityClassMain"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否限报" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.isLimitNumber">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="招生方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.enrollmentWay">
                        <el-radio :label="0">抢报</el-radio>
                        <el-radio :label="1">老生优先</el-radio>
                        <el-radio :label="2">随机分配</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="报名项目编号" :label-width="formLabelWidth" prop="classCode">
                    <el-input v-model="form.classCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="报名项目名称" :label-width="formLabelWidth" prop="className">
                    <el-input v-model="form.className" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="收费标准(元)" :label-width="formLabelWidth" prop="charge">
                    <el-input v-model="form.charge" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="招生对象" :label-width="formLabelWidth" prop="enrollmentTargets">
                    <el-select v-model="form.enrollmentTargets" multiple placeholder="请选择">
                        <el-option
                        v-for="item in data.enrollmentTargets"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上课时段" :label-width="formLabelWidth" prop="classTime">
                    <el-select v-model="form.classTime" clearable placeholder="请选择">
                        <el-option
                        v-for="(item,index) in data.classTime"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="招收人数" :label-width="formLabelWidth" prop="recruitNumber">
                    <el-input v-model="form.recruitNumber" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="editor('ruleForm')">确 定</el-button>
            </div>
            {{form.enrollmentTargets}}
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
                activityClassMainId:'',
                activityId:'',
                classCode:'',
                className:'',
                classTime:'',
                classPlace:'',
                charge:'',
                enrollmentTargets:[],
                recruitNumber:'',
                isLimitNumber:'',
                isAudit:'',
                enrollmentWay:'',
                teacherId:'',
            },
            data:{
                activityClassMain:[],
                classTime:[],
                enrollmentTargets:[]

            },
            close:false,
            center:true,
            rules: {
                activityClassMainId: [
                    { required: true, message: '请选择学期', trigger: 'blur' },
                ],
                classCode: [
                    { required: true, message: '请输入报名项目编号', trigger: 'blur' }
                ],
                className: [
                    { required: true, message: '请输入报名项目名称', trigger: 'blur' },
                ],
                classTime: [
                    { required: true, message: '请选择上课时间', trigger: 'blur' }
                ],
                charge: [
                    { required: true, message: '请输入收费标准', trigger: 'blur' },
                ],
                enrollmentTargets: [
                    { type:'array',required: true, message: '请选择招生对象', trigger: 'blur' }
                ],
                recruitNumber: [
                    { required: true, message: '请输入招收人数', trigger: 'blur' }
                ],

            }
        };
    },
    created() {
        this.getClsssMain()
        this.getClassTime()
        this.getEnrollmentTargets()
    },
    methods: {
        getDetailById() {
            let p = {};
            p.id = this.id;
            console.log(p);  
            this.api.getDetailById("activityClass",p)
            .then(result => {
                console.log(result);
                this.form = result.data;
                this.form.enrollmentTargets = result.data.enrollmentTargets.split(",");
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
                    p.enrollmentTargets = this.form.enrollmentTargets.toString();
                    p.classTransferDeadline = this.moment(this.form.classTransferDeadline).format("YYYY-MM-DD HH:mm:ss");
                    p.classRetireDeadline = this.moment(this.form.classRetireDeadline).format("YYYY-MM-DD HH:mm:ss");
                    p.oldStartTime = this.moment(this.form.oldStartTime).format("YYYY-MM-DD HH:mm:ss");
                    p.oldEndTime = this.moment(this.form.oldEndTime).format("YYYY-MM-DD HH:mm:ss");
                    p.startTime = this.moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss");
                    p.endTime = this.moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss");
                    p.createTime = this.moment(this.form.createTime).format("YYYY-MM-DD HH:mm:ss");
                    p.modifyTime = this.moment().format("YYYY-MM-DD HH:mm:ss");
                    console.log(p)
                    this.api.update("activityClass",p)
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
        //加载学期
        getClsssMain() {
            let p = {};
            p.sql = `select id,name from activityClassMain 
            where status = 2 and isDeleted = 0 
            order by createTime desc`;
            this.api.queryForMap("activityClassMain",p)
            .then(result => {
                console.log(result);
                this.data.activityClassMain = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //加载上课时间
        getClassTime() {
            let p = {};
            p.sql = `select b.id,b.name from dictionarySort as a 
            left join dictionary as b on a.id = b.dictionarySortId 
            where a.name = '上课时间' order by b.serialNumber asc`;
            //console.log(p);  
            this.api.queryForMap("dictionarySort",p)
            .then(result => {
                console.log(result);
                this.data.classTime = result.data;

            })
            .catch(error => {
                console.log(error);
            });
        },
        getEnrollmentTargets() {
            let p = {};
            p.sql = `select b.id,b.name from dictionarySort as a 
            left join dictionary as b on a.id = b.dictionarySortId 
            where a.name = '年级' order by b.serialNumber asc`;
            console.log(p);  
            this.api.queryForMap("dictionarySort",p)
            .then(result => {
                console.log(result);
                this.data.enrollmentTargets = result.data;
            })
            .catch(error => {
                console.log(error);
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
