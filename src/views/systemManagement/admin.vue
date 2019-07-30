<template>
    <div class="articleList">
        <div class="container">
            <el-table 
            v-loading="loading" border stripe
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="articleList" :height="tableHeight" size="medium"
            class="table" ref="multipleTable">
                <el-table-column type="selection" width="55" align="center" ></el-table-column>
                <el-table-column type="index" :index="indexSort" label="序号" align="center" width="100" sortable>
                </el-table-column>
                <el-table-column prop="loginName" label="登录名" align="center">
                </el-table-column>
                <el-table-column prop="realName" label="真实姓名" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="手机" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" :formatter="isStatus">
                </el-table-column>
                <el-table-column prop="roleName" label="角色" align="center">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
                    </template>
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
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
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
                loading: true,
                tableHeight:null
            }
        },
        components:{
            pagination
        },
        created() {
            this.getPageInfo()
        },
        mounted(){
            this.tableHeight = window.innerHeight -this.$refs.pagination.$el.offsetTop-50;
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
                p.sql = `select a.id,a.loginName,a.realName,a.mobile,a.status,b.name as roleName from admin as a
                left join role b on a.roleId=b.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                p.whereStr = `where b.roleType = 0`;
                p.orderStr = "order by a.createTime asc";
                console.log(p);  
                this.api.getPageInfo("admin",p)
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
                p.sql = `select a.id,a.loginName,a.realName,a.mobile,a.status,b.name as roleName from admin as a
                left join role b on a.roleId=b.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                p.whereStr = `where b.roleType = 0`;
                p.orderStr = "order by a.createTime asc";
                //console.log(p);  
                this.api.getDataByPage("admin",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
                })
                .catch(error => {
                    console.log(error);
                });
            },
            indexSort(index) {
                return (this.page.currentPage-1)*this.page.pageSize+(index+1);
            },
            isStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return '待审核'
				} else if (cellValue == 1) {
					return '审核通过'
				} else if (cellValue == 2) {
					return '审核不通过'
				}
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

</style>
