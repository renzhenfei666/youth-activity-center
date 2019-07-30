<template>
    <div>
        <el-dialog :title="title" :visible.sync="show" :center="center" top="10vh" :show-close="close">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="所属类别" :label-width="formLabelWidth" prop="activitySortId">
                    <el-select v-model="form.activitySortId" clearable placeholder="请选择">
                        <el-option
                        v-for="item in activitySortId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="form.serialNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" :label-width="formLabelWidth" prop="activityCode">
                    <el-input v-model="form.activityCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="" label="招生对象" :label-width="formLabelWidth" prop="enrollmentTargets">
                    <el-select v-model="form.enrollmentTargets" multiple placeholder="请选择">
                        <el-option
                        v-for="item in grades"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收费金额" :label-width="formLabelWidth" prop="charge">
                    <el-input v-model="form.charge" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                    <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" v-if="id" @click="editor('ruleForm')">确 定</el-button>
                <el-button type="primary" v-else @click="add('ruleForm')">确 定</el-button>
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
        show:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:''
        },
        selectionData:{
            type:Object
        },
    },
    data() {
        return {
            formLabelWidth: '200px',
            form:{
                serialNumber:'',
                activitySortId:'',
                activityCode:'',
                enrollmentTargets:[],
                charge:'',
                remark:'',
                name:'',
                pid:'',
            },
            activitySortId:[],
            grades:[],
            close:false,
            center:true,
            rules: {
                activitySortId: [
                    { required: true, message: '请选择类别', trigger: 'change' },
                ],
                serialNumber: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
                activityCode: [
                    { required: true, message: '请输入项目编号', trigger: 'blur' }
                ],
                enrollmentTargets: [
                    { type: 'array',required: true, message: '请选择招生对象', trigger: 'change' }
                ],
                charge: [
                    { required: true, message: '请输入收费金额', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
            }
        };
    },

    mounted() {
        this.getActivitySortId();
        this.getGrades();
        // this.view(this.id);
    },
    methods: {
        getDetailById(id) {
            let p = {};
            p.id = id;
            console.log(p);  
            this.api.getDetailById("activity",p)
            .then(result => {
                console.log(result);
                this.form = result.data;
                this.form.enrollmentTargets = result.data.enrollmentTargets.split(",");
            })
            .catch(error => {
                console.log(error);
            });
        },
        //添加
        add(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = {};
                    p.activitySortId = this.form.activitySortId;
                    p.serialNumber = this.form.serialNumber;
                    p.activityCode = this.form.activityCode;
                    p.name = this.form.name;
                    p.enrollmentTargets = this.form.enrollmentTargets;
                    p.charge = this.form.charge;
                    p.remark = this.form.remark;
                    p.pid = this.form.pid;
                    p.isDeleted = 0;
                    console.log(p);  
                    this.api.add("activity",p)
                    .then(result => {
                        console.log(result);
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                        });
                        this.cancel();
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
        //修改
        editor(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let p = {};
                    p.id=this.form.id;
                    p.activitySortId = this.form.activitySortId;
                    p.serialNumber = this.form.serialNumber;
                    p.activityCode = this.form.activityCode;
                    p.name = this.form.name;
                    p.enrollmentTargets = this.form.enrollmentTargets.toString();
                    p.charge = this.form.charge;
                    p.remark = this.form.remark;
                    p.pid = this.form.pid;
                    p.isDeleted = this.form.isDeleted;
                    console.log(p);  
                    this.api.update("activity",p)
                    .then(result => {
                        console.log(result);
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                        });
                        this.cancel();
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
        getActivitySortId() {
            let p = {};
            p.sql = "select id,name from activitySort where isDeleted = 0  order by serialNumber asc";
            console.log(p);  
            this.api.queryForMap("activitySort",p)
            .then(result => {
                console.log(result);
                this.activitySortId = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getGrades() {
            let p = {};
            p.sql = `select b.id,b.name from dictionarySort as a 
            left join dictionary as b on a.id = b.dictionarySortId 
            where a.name = '年级' order by b.serialNumber asc`;
            console.log(p);  
            this.api.queryForMap("dictionarySort",p)
            .then(result => {
                console.log(result);
                this.grades = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        cancel(){
            this.$emit('handCancel');
            this.$emit('getPageInfo');
            this.$refs['ruleForm'].resetFields();
        }
    },
    watch:{
        id(){
            if(this.id){
                this.getDetailById(this.id);
                console.log(this.selectionData);
            }
        },
    }
};
</script>

<style scoped>

</style>
