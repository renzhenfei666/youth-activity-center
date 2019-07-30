<template>
    <div>
        <el-dialog title="修改" :visible.sync="editShow" :center="center" top="10vh" :show-close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    :data="tableData" border stripe
                    height="300" size="small">
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
                                @click="deleteConfirm(scope.row.id)">删除</el-button>
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
                name:'',
                serialNumber:0
            },
            close:false,
            center:true,
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
            },
            tableData:[],
            loading: true,
        }
    },

    mounted() {
        // this.view(this.id);
    },
    methods: {
        getDetailById() {
            let p = {};
            p.id = this.id;
            console.log(p);  
            this.api.getDetailById("dictionarySort",p)
            .then(result => {
                console.log(result);
                let data = result.data;
                this.form = data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getDictionaryList() {
            this.loading = true
            let p = {};
            p.sql = `select * from dictionary where dictionarySortId ='${this.id}' order by serialNumber asc`
            console.log(p);  
            this.api.queryForMap("dictionary",p)
            .then(result => {
                this.loading = false
                console.log(result);
                let data = result.data;
                this.tableData = data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //删除
        deleteConfirm(id) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let p = {};
                p.ids = id;
                this.api.deleteByIds('dictionary',p)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    });
                    this.getDictionaryList();
                }).catch(err =>{console.log(err)})
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });    
        },
        //添加
        addAwait(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updateDictionarySort()
                    for(let i in this.tableData){
                        if(this.tableData[i].id){
                            this.updateDictionary(i)
                        }else{
                            this.addDictionary(i)
                        }
                    }
                    this.confirm()
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        addDictionary(i,result){
            let p = {}
            p.serialNumber = i+1
            p.name = this.tableData[i].name
            p.dictionarySortId = this.id
            this.api.add("dictionary",p)
            .then(res => {

            }).catch(err =>{console.log(err)})
        },
        updateDictionary(i,result){
            let p = {}
            p.id = this.tableData[i].id
            p.serialNumber = i+1
            p.name = this.tableData[i].name
            p.dictionarySortId = this.id
            this.api.update("dictionary",p)
            .then(res => {

            }).catch(err =>{console.log(err)})
        },
        updateDictionarySort(){
            let p = this.form
            this.api.update("dictionarySort",p)
            .then(res => {

            }).catch(err =>{console.log(err)})
        },
        pushData(){
            this.tableData.push({name:''})
        },
        handlePush(index) {
            console.log(index)
            this.tableData.splice(index+1,0,{name:''})
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
    watch:{
        id(){
            if(this.id){
                this.getDetailById()
                this.getDictionaryList()
            }
        },
    }
};
</script>

<style scoped>

</style>
