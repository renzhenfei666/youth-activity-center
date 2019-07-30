<template>
    <div>
        <el-dialog title="添加" :visible.sync="addShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-table
                    :data="tableData" border stripe
                    height="277">
                        <el-table-column
                        label="字典名称" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.name" autocomplete="off"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                @click="handlePush(scope.$index)">插入</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" align="center">
                    <el-button type="primary" icon="el-icon-plus" circle @click="pushData"></el-button>
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
                name:'',
            },
            close:false,
            center:true,
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
            },
            tableData:[]
        }
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
                        for(let i in this.tableData){
                            await this.addDictionary(i,result)
                        }
                        this.confirm()
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                        })
                    }catch(err){
                        this.cancel()
                        this.$message.error('添加失败')
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //添加
        add(formName,data) {
            let p = {}
            p.serialNumber = Number(data.data[0].serialNumber) + 1
            p.name = this.form.name
            return this.api.add("dictionarySort",p)
        }, 
        //获取最大的序号
        getMaxSerialNumber() {
            let p = {};
            p.sql = "select max(serialNumber) as serialNumber from dictionarySort"
            return this.api.queryForMap("dictionarySort",p)
        },
        addDictionary(i,result){
            let p = {}
            p.serialNumber = i+1
            p.name = this.tableData[i].name
            p.dictionarySortId = result.data
            return this.api.add("dictionary",p)
        },
        pushData(){
            this.tableData.push({name:''})
        },
        handlePush(index) {
            console.log(index)
            this.tableData.splice(index+1,0,{name:''})
        },
        handleDelete(index) {
            console.log(index)
            this.tableData.splice(index,1)
        },
        cancel(){
            this.$emit('handCancel')
            this.$refs['ruleForm'].resetFields()
            this.tableData = []
        },
        confirm(){
            this.$emit('handCancel')
            this.$emit('getPageInfo')
            this.$refs['ruleForm'].resetFields()
        }
    },
};
</script>

<style scoped>

</style>
