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
                <el-table-column prop="name" label="名称" align="center">
                </el-table-column>
                <el-table-column prop="roleType" label="用户类别" align="center" :formatter="isRoleType">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.roleType==0">
                            <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                            <el-button type="text" icon="el-icon-setting" @click="deleteConfirm(scope.row.id)" class="red">设置权限</el-button>
                        </div>
                        <div v-else>
                            <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :count="count" :audit="audit"
            @getPageSize="getPageSize" 
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
                p.sql = "";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                p.whereStr = "";
                p.orderStr = "";
                console.log(p);  
                this.api.getPageInfo("role",p)
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
                p.orderStr = "";
                console.log(p);  
                //console.log(p);  
                this.api.getDataByPage("role",p)
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
            isRoleType(row, column, cellValue, index){
				if (cellValue == 0) {
					return '管理员类'
				} else if (cellValue == 1) {
					return '用户类'
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
