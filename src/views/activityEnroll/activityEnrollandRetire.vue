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
                <el-table-column type="index" :index="indexSort" label="序号" align="center" width="100">
                </el-table-column>
                <el-table-column prop="classCode" label="项目编号" align="center" width="150" sortable>
                </el-table-column>
                <el-table-column prop="className" label="活动班名称" align="center">
                </el-table-column>
                <el-table-column prop="studentName" label="姓名" align="center" width="80">
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" align="center">
                </el-table-column>
                <el-table-column prop="gradeName" label="年级" align="center" width="80">
                </el-table-column>
                <el-table-column prop="classNumber" label="班号" align="center" width="80">
                </el-table-column>
                <el-table-column prop="payment" label="学费" align="center" width="80">
                </el-table-column>
                <el-table-column prop="feeDerate" :formatter="isFeeDerate" label="是否减免" align="center" width="80">
                </el-table-column>
                <el-table-column prop="cMobile" label="报名手机号" :formatter="isEnrollMobile" align="center">
                </el-table-column>
                <el-table-column prop="eMobile" label="家长手机号" align="center">
                </el-table-column>
                <el-table-column prop="introducer" label="介绍人" align="center" width="100">
                </el-table-column>
                <el-table-column prop="createTime" :formatter="createTimeForMat" label="报名日期" align="center">
                </el-table-column>
                <el-table-column prop="status" label="报名状态" :formatter="isStatus" align="center" width="80">
                </el-table-column>
                <el-table-column prop="payStatus" label="付款状态" :formatter="isPayStatus" align="center" width="80">
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
                    input:true,
                    input3:true,
                },
                a:5,
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
                p.sql = `select a.*,b.classCode,b.className,c.mobile as cMobile,
                d.mobile as dMobile,e.studentName,e.schoolName,e.gradeName,
                e.classNumber,e.mobile as eMobile,f.feeDerate from activityEnroll as a 
                left join activityClass as b on a.activityClassId = b.id 
                left join user as c on a.userId = c.id 
                left join admin as d on a.adminId = d.id 
                left join student as e on a.studentId = e.id 
                left join userOrder as f on a.userOrderId = f.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where a.isDeleted = 0`;
                }
                p.orderStr = "order by a.createTime desc";
                console.log(p);  
                this.api.getPageInfo("activityEnroll",p)
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
                p.sql = `select a.*,b.classCode,b.className,c.mobile as cMobile,
                d.mobile as dMobile,e.studentName,e.schoolName,e.gradeName,
                e.classNumber,e.mobile as eMobile,f.feeDerate from activityEnroll as a 
                left join activityClass as b on a.activityClassId = b.id 
                left join user as c on a.userId = c.id 
                left join admin as d on a.adminId = d.id 
                left join student as e on a.studentId = e.id 
                left join userOrder as f on a.userOrderId = f.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where a.isDeleted = 0`;
                }
                p.orderStr = "order by a.createTime desc";
                //console.log(p);  
                this.api.getDataByPage("activityEnroll",p)
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
					return "未报名";
				} else if (cellValue == 1) {
					return "已报名";
				} else if (cellValue == 2) {
					return "已退班";
				} else if (cellValue == 3) {
					return "已调班";
				} else if (cellValue == 4) {
					return "退班中";
				} else if (cellValue == 5) {
					return "调班中";
				}
            },
            isPayStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return "未付款";
				} else if (cellValue == 1) {
					return "已付款";
				} else if (cellValue == 2) {
					return "已退款";
				}
            },
            isEnrollMobile(row, column, cellValue, index){
				if (cellValue != "0") {
					return cellValue;
				} else if (row.dMobile != "0") {
					return row.dMobile;
				} else{
					return row.eMobile;
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
