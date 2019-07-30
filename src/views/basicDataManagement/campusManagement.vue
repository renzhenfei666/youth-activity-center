<template>
    <div class="articleList">
        <div class="container">
            <el-row ref="row">
                <el-col :span="18" class="select">
                </el-col>
                <el-col :span="6" :offset="18">
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
                <el-table-column prop="serialNumber" label="序号" align="center" width="100" sortable>
                </el-table-column>
                <el-table-column prop="name" label="活动中心名称" align="center">
                </el-table-column>
                <el-table-column prop="address" label="地点" align="center">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)">删除</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :count="count" :audit="audit" ref="pagination"
            @getPageSize="getPageSize" 
            @getCurrentPage="getCurrentPage"
            @getPageInfo="getPageInfo"
            ></pagination>
        </div>
        <!-- 添加 -->
        <campusAdd :addShow="addShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 修改 -->
        <campusEdit :editShow="editShow" :id="id" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import campusAdd from './campusForm/campusAdd'
    import campusEdit from './campusForm/campusEdit'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
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
                loading: true,
                tableHeight:null
            }
        },
        components:{
            pagination,
            campusAdd,
            campusEdit
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
                p.whereStr = "";
                p.orderStr = "order by serialNumber asc";
                console.log(p);  
                this.api.getPageInfo("activityCenter",p)
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
                p.whereStr = "";
                p.orderStr = "order by serialNumber asc";
                //console.log(p);  
                this.api.getDataByPage("activityCenter",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
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
                    this.api.deleteByIds('activityCenter',p)
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
        },
        
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

</style>
