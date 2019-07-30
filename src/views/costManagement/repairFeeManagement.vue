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
                <el-table-column type="index" :index="indexSort" sortable label="序号" align="center" width="100">
                </el-table-column>
                <el-table-column prop="className" label="报名班级" align="center">
                </el-table-column>
                <el-table-column prop="bName" label="补交发起人" align="center" :formatter="isBname">
                </el-table-column>
                <el-table-column prop="studentName" label="学生姓名" align="center">
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" align="center">
                </el-table-column>
                <el-table-column prop="gradeName" label="年级" align="center">
                </el-table-column>
                <el-table-column prop="classNumber" label="班级" align="center">
                </el-table-column>
                <el-table-column prop="payable" label="补交金额" align="center">
                </el-table-column>
                <el-table-column prop="status" label="处理状态" :formatter="isStatus" align="center">
                </el-table-column>
                <el-table-column prop="payStatus" label="款项状态" :formatter="isPayStatus" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="createTimeForMat" align="center">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.hasList>0">
                            <div v-if="scope.row.status == 0">
                                <el-button type="text">确认补费</el-button>
                            </div>
                             <div v-else>
                                <el-button type="text">无</el-button>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="scope.row.status == 0">
                                <el-button type="text">确认补费</el-button>
                            </div>
                            <div v-else>
                                <el-button type="text">无</el-button>
                            </div>
                        </div>
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
                    schoolName:true,
                    gradeName:true,
                    classNumber:true,
                    input3:true,
                },
                a:10,
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
                p.sql = `select a.*,b.realName as bName,c.realName as cName,e.className,
                f.studentName,f.schoolName,f.gradeName,f.classNumber from classTransfer as a 
                left join user as b on a.userId = b.id 
                left join admin as c on a.adminId = c.id 
                left join activityEnroll as d on a.activityEnrollId = d.id 
                left join activityClass as e on d.activityClassId = e.id 
                left join student as f on d.studentId = f.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where e.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = "where e.isDeleted = 0";
                }
                p.orderStr = "order by a.status asc,a.createTime desc";
                console.log(p);  
                this.api.getPageInfo("classTransfer",p)
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
                p.sql = `select a.*,b.realName as bName,c.realName as cName,e.className,
                f.studentName,f.schoolName,f.gradeName,f.classNumber from classTransfer as a 
                left join user as b on a.userId = b.id 
                left join admin as c on a.adminId = c.id 
                left join activityEnroll as d on a.activityEnrollId = d.id 
                left join activityClass as e on d.activityClassId = e.id 
                left join student as f on d.studentId = f.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where e.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = "where e.isDeleted = 0";
                }
                p.orderStr = "order by a.status asc,a.createTime desc";
                //console.log(p);  
                this.api.getDataByPage("classTransfer",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
                    for(let value of result.data){
                        this.addAction(value)
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            addAction(value) {
                let p = {};
                p.sql = `select id from actualClass where activityClassId = '${value.toActivityClassId}'`;
                this.api.queryForMap("actualClass",p)
                .then(result => {
                    let data = result.data;
                    if(data.length>0){
                        this.$set(value,"hasList",1)
                    }else{
                        this.$set(value,"hasList",0)
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            indexSort(index) {
                return (this.page.currentPage-1)*this.page.pageSize+(index+1);
            },
            isFeeDerate(row, column, cellValue, index){
                if(cellValue>0){
                    return "是"
                }else{
                    return "否"
                }
            },
            createTimeForMat(row, column, cellValue, index){
                return this.moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
            },
            isStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return "未审核";
				} else if (cellValue == 1) {
					return "审核通过";
				} else if (cellValue == 2) {
					return "审核不通过";
				} else if (cellValue == 3) {
					return "取消调班";
				} else if (cellValue == 4) {
					return "分班完成";
				}
            },
            isPayStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return "未补费";
				} else if (cellValue == 1) {
					return "已补费";
				} else if (cellValue == 2) {
					return "已退款";
				}
            },
            isBname(row, column, cellValue, index){
				if (cellValue != "0") {
					return cellValue;
				} else{
					return row.fName;
				}
            },
            isInvoiceStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return "未开发票";
				} else{
					return "已开发票";
				}
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
                    p.sql = `update activityEnroll set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('activityEnroll',p)
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

</style>
