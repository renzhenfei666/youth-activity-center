<template>
    <div class="articleList">
        <div class="container">
            <search :searchShow="searchShow" :where="a" @onselected="getStr" ref="row"></search>
            <el-table 
            v-loading="loading" border stripe
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="articleList" :height="tableHeight" size="medium"
            class="table" ref="multipleTable">
                <el-table-column type="index" :index="indexSort" label="序号" align="center" width="100" sortable>
                </el-table-column>
                <el-table-column prop="cname" label="项目" align="center">
                </el-table-column>
                <el-table-column prop="classCode" label="班级编号" align="center">
                </el-table-column>
                <el-table-column prop="className" label="班级名称" align="center">
                </el-table-column>
                <el-table-column prop="classTime" label="上课时间" align="center">
                </el-table-column>
                <el-table-column prop="classPlace" label="上课地点" align="center">
                </el-table-column>
                <el-table-column prop="number" label="班级人数" align="center">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">插班管理</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">人员微调</el-button>
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
    </div>

</template>

<script>
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    activityClassMain:true,
                    input1:true,
                },
                a:6,
                articleList: [],
                id: '',
                show:false,
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
                p.sql = `select a.*,b.name,c.name as cname from actualClass as a 
                left join activityClassMain as b on a.activityClassMainId = b.id 
                left join activity as c on a.activityId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where a.isDeleted = 0`;
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
                p.sql = `select a.*,b.name,c.name as cname from actualClass as a 
                left join activityClassMain as b on a.activityClassMainId = b.id 
                left join activity as c on a.activityId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where a.isDeleted = 0`;
                }
                p.orderStr = "order by a.classCode asc";
                //console.log(p);  
                this.api.getDataByPage("actualClass",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
                    for(let value of result.data){
                        this.getNumber(value)
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            getNumber(value) {
                let p = {};
                p.sql = `select id from activityEnroll where actualClassId = '${value.id}' and payStatus = 1`;
                this.api.queryForMap("activityEnroll",p)
                .then(result => {
                    this.$set(value,"number",result.data.length);
                })
                .catch(error => {
                    console.log(error);
                });
            },
            indexSort(index) {
                return (this.page.currentPage-1)*this.page.pageSize+(index+1);
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

</style>
