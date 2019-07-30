<template>
    <div class="articleList">
        <div class="container">
            <el-row ref="row">
                <el-col :span="18" class="select">
                    <search :searchShow="searchShow" :where="a" @onselected="getStr"></search>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="add">添加</el-button>
                </el-col>
            </el-row>
            <el-table 
            v-loading="loading" border stripe
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="articleList" :height="tableHeight" size="medium"
            class="table" ref="multipleTable">
                <el-table-column type="selection" width="55" align="center" ></el-table-column>
                <el-table-column prop="serialNumber" label="序号" align="center" width="150" sortable>
                </el-table-column>
                <el-table-column prop="name" label="类别" align="center" width="120">
                </el-table-column>
                <el-table-column prop="description" label="说明" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
                    </template>
                    <div></div>
                </el-table-column>
            </el-table>
            <pagination :count="count" :audit="audit"
            @getPageSize="getPageSize" ref="pagination"
            @getCurrentPage="getCurrentPage"
            @getPageInfo="getPageInfo"
            ></pagination>
        </div>
        <!-- 添加 -->
        <activitySortAdd :addShow="addShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 修改 -->
        <activitySortEdit :id="id" :editShow="editShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import activitySortAdd from './activitySortForm/activitySortAdd'
    import activitySortEdit from './activitySortForm/activitySortEdit'
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    selection2:true,
                    input1:true
                },
                a:1,
                articleList: [],
                id: '',
                addShow:false,
                editShow:false,
                title:'',
                count:0,
                audit:false,
                page:{
                    currentPage: 1,
                    pageSize: 10
                },
                whereStr:'',
                loading: true,
                tableHeight:null
            }
        },
        components:{
            activitySortAdd,
            activitySortEdit,
            pagination,
            search
        },
        created() {
            this.getPageInfo()
        },
        mounted(){
            this.tableHeight = window.innerHeight - this.$refs.row.$el.offsetTop -this.$refs.pagination.$el.offsetTop-50;
        },
        methods: {
            //pageSize
            getPageSize(val){
                this.page.pageSize = val;
            },
            //currentPage
            getCurrentPage(val){
                this.page.currentPage = val;
            },
            //查询分页信息
            getPageInfo() {
                let p = {};
                p.sql = "";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where isDeleted = 0`;
                }
                p.orderStr = "order by serialNumber asc";
                console.log(p);  
                this.api.getPageInfo("activitySort",p)
                .then(result => {
                    console.log(result);
                    this.count = result.data.totalCount;
                    this.getListByPage();
                })
                .catch(error => {
                    console.log(error);
                });
            },

            //查询分页记录
            getListByPage() {
                this.loading = true
                let p = {};
                p.sql = "";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where isDeleted = 0`;
                }
                p.orderStr = "order by serialNumber asc";
                //console.log(p);  
                this.api.getDataByPage("activitySort",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;

                })
                .catch(error => {
                    console.log(error);
                });
            },
            //添加
            add() {
                this.addShow = true
            },
            modify(id){
                this.id = id
                this.editShow = true
            },
            //关闭弹窗
            handCancel(){
                this.id = ''
                this.addShow = false
                this.editShow = false
            },
            //删除
            deleteConfirm(id) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let p = {};
                    p.id = id;
                    p.sql = `update activitySort set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('activitySort',p)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                        this.getPageInfo();
                    }).catch(err =>{console.log(err)})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });    
            },
            getStr(data){
                this.page.currentPage=1;
                this.whereStr = data;
                this.getPageInfo();
            }
        }
    }

</script>

<style scoped>
    .el-row{
        margin-bottom:20px;
        text-align: right;
    }
    .articleList{
        width: 100%;
        font-size: 14px;
    }
    .select{
        text-align:left;
    }
</style>
