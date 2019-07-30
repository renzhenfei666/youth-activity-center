<template>
    <div>
        <el-dialog title="查看" :visible.sync="viewShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item label="学校名称" :label-width="formLabelWidth" >
                    <el-select v-model="form.schoolName" disabled>
                    </el-select>
                </el-form-item>
                <el-form-item label="年级" :label-width="formLabelWidth">
                    <el-select v-model="form.gradeName" disabled >
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" :label-width="formLabelWidth">
                    <el-select v-model="form.classNumber" disabled>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-select v-model="form.studentName" disabled>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单编号" :label-width="formLabelWidth">
                    <el-input disabled v-model="form.userOrderId"></el-input>
                </el-form-item>
                <el-form-item label="是否使用" :label-width="formLabelWidth">
                    <el-input disabled v-model="form.isUsed"></el-input>
                </el-form-item>
                <el-form-item label="减免费用" :label-width="formLabelWidth">
                    <el-input disabled v-model="form.derateFee"></el-input>
                </el-form-item>
                <el-form-item label="减免原因" :label-width="formLabelWidth">
                    <el-input disabled
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
            </div>
            {{form}}
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        viewShow:{
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
            form:[],
            close:false,
            center:true,

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
            this.getDetailById();
        },
    }
};
</script>

<style scoped>

</style>
