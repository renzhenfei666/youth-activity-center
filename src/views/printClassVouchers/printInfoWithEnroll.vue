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
                <el-table-column prop="studentName" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="监护人电话" align="center">
                </el-table-column>
                <el-table-column prop="gradeName" label="年级" align="center">
                </el-table-column>
                <el-table-column prop="classNumber" label="班号" align="center">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text">单独打印</el-button>
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
                    schoolName:true,
                    gradeName:true,
                    classNumber:true,
                    input3:true,
                },
                a:12,
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
            this.tableHeight = window.innerHeight - this.$refs.row.$el.offsetTop -this.$refs.pagination.$el.offsetTop-50
        },
        methods: {
            //pageSize
            getPageSize(val){
                this.page.pageSize = val
            },
            //currentPage
            getCurrentPage(val){
                this.page.currentPage = val
            },
            //查询分页信息
            getPageInfo() {
                let p = {};
                p.sql = `select * from student`
                p.everyPage = this.page.pageSize
                p.currentPage = this.page.currentPage
                if(this.whereStr !=""){
                    p.whereStr = `where status = 1${this.whereStr}`
                }else{
                    p.whereStr = "where status = 1"
                }
                p.orderStr = ""
                console.log(p)
                this.api.getPageInfo("student",p)
                .then(result => {
                    console.log(result)
                    this.count = result.data.totalCount
                    this.getListByPage()
                })
                .catch(error => {
                    console.log(error)
                })
            },

            //查询分页记录
            getListByPage() {
                this.loading = true
                let p = {}
                p.sql = `select * from student`
                p.everyPage = this.page.pageSize
                p.currentPage = this.page.currentPage
                if(this.whereStr !=""){
                    p.whereStr = `where status = 1${this.whereStr}`
                }else{
                    p.whereStr = "where status = 1"
                }
                p.orderStr = ""
                //console.log(p);  
                this.api.getDataByPage("student",p)
                .then(result => {
                    this.loading = false
                    console.log(result)
                    this.articleList = result.data
                })
                .catch(error => {
                    console.log(error)
                })
            },

            indexSort(index) {
                return (this.page.currentPage-1)*this.page.pageSize+(index+1)
            },
            getStr(data){
                this.page.currentPage=1
                this.whereStr = data
                this.getPageInfo()
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
