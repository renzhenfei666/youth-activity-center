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
                <el-table-column prop="classCode" label="报名项目编号" align="center" width="150" sortable>
                </el-table-column>
                <el-table-column prop="className" label="报名项目名称" align="center" width="300">
                </el-table-column>
                <el-table-column prop="charge" label="价格" align="center"></el-table-column>
                <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
                <el-table-column prop="classTime" label="已报人数" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
                        <el-button type="text" icon="el-icon-thumb" @click="deleteConfirm(scope.row.id)" class="red">生成上课班级</el-button>
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
        <activityClassAdd :addShow="addShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 修改 -->
        <activityClassEdit :id="id" :editShow="editShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import activityClassAdd from './activityClassForm/activityClassAdd'
    import activityClassEdit from './activityClassForm/activityClassEdit'
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    activityClassMain:true,
                    classTime:true,
                    input1:true
                },
                a:3,
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
                classTime:[],
                whereStr:'',
                loading: true,
                tableHeight:null
            }
        },
        components:{
            activityClassAdd,
            pagination,
            search,
            activityClassEdit
        },
        created() {
            this.getPageInfo();
        },
        mounted(){
            this.tableHeight = window.innerHeight - this.$refs.row.$el.offsetTop -this.$refs.pagination.$el.offsetTop-50;
            console.log(this.tableHeight);
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
                    p.whereStr = "where isDeleted = 0";
                }
                p.orderStr = "order by classCode asc";
                console.log(p);  
                this.api.getPageInfo("activityClass",p)
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
                    p.whereStr = "where isDeleted = 0";
                }
                p.orderStr = "order by classCode asc";
                //console.log(p);  
                this.api.getDataByPage("activityClass",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;

                })
                .catch(error => {
                    console.log(error);
                });
            },
            //修改
            modify(id) {
                this.id = id
                this.editShow = true
            },
            //添加
            add() {
                this.addShow = true
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
                    p.sql = `update activityClass set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('activityClass',p)
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
            },
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
