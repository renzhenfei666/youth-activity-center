<template>
    <div class="articleList">
        <div class="container">
            <el-row ref="row">
                <el-col :span="18" class="select">
                    <search :searchShow="searchShow" :where="a" @onselected="getStr"></search>
                </el-col>
            </el-row>
            <el-table 
            v-loading="loading" border stripe
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="articleList" :height="tableHeight" size="medium"
            class="table" ref="multipleTable">
                <el-table-column type="selection" width="55" align="center" ></el-table-column>
                <el-table-column prop="dCode" label="项目编号" align="center" width="150" sortable>
                </el-table-column>
                <el-table-column prop="cname" label="项目" align="center" width="300">
                </el-table-column>
                <el-table-column prop="classCode" label="班级编号" align="center"></el-table-column>
                <el-table-column prop="className" label="班级名称" align="center"></el-table-column>
                <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
                <el-table-column prop="classPlace" label="上课地点" align="center"></el-table-column>
                <el-table-column prop="realName" label="任课教师" align="center"></el-table-column>
                <el-table-column prop="count" label="班级人数" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
                        <el-button type="text" icon="el-icon-thumb"  class="red">班级花名册</el-button>
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
        <!-- 修改 -->
        <actualClassEdit :id="id" :editShow="editShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import actualClassEdit from './actualClassForm/actualClassEdit'
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    activityClassMain:true,
                    input2:true
                },
                a:4,
                articleList: [],
                id: '',
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
            pagination,
            search
        },
        created() {
            this.getPageInfo();
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
                p.sql = `select a.*,b.name,c.name as cname,d.classCode as dCode,e.realName from actualClass as a 
                left join activityClassMain as b on a.activityClassMainId = b.id 
                left join activity as c on a.activityId = c.id 
                left join activityClass as d on a.activityClassId = d.id 
                left join user as e on a.teacherId = e.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0 and e.roleId = 3${this.whereStr}`;
                }else{
                    p.whereStr = "where a.isDeleted = 0 and e.roleId = 3";
                }
                p.orderStr = "order by a.classCode asc";
                console.log(p);  
                this.api.getPageInfo("actualClass",p)
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
                p.sql = `select a.*,b.name,c.name as cname,d.classCode as dCode,e.realName from actualClass as a 
                left join activityClassMain as b on a.activityClassMainId = b.id 
                left join activity as c on a.activityId = c.id 
                left join activityClass as d on a.activityClassId = d.id 
                left join user as e on a.teacherId = e.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0 and e.roleId = 3${this.whereStr}`;
                }else{
                    p.whereStr = "where a.isDeleted = 0 and e.roleId = 3";
                }
                p.orderStr = "order by a.classCode asc";
                //console.log(p);  
                this.api.getDataByPage("actualClass",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
                    for (let value of result.data) {
                        this.studentNum(value);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            studentNum(value) {
                let p = {};
                p.sql = `select count(*) as count from activityEnroll 
                where actualClassId='${value.id}' and payStatus =1`;
                this.api.queryForMap("activityEnroll",p)
                .then(result => {
                    console.log(result.data);
                    this.$set(value,"count",result.data[0].count);
                })
                .catch(error => {
                    console.log(error);
                });
            },
            //修改
            modify(id) {
                this.id = id;
                this.editShow = true;
            },
            //关闭弹窗
            handCancel(){
                this.id = '';
                this.editShow = false;
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
                    p.sql = `update actualClass set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('actualClass',p)
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
