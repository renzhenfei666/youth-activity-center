<template>
    <div class="articleList">
        <div class="container">
            <!-- 需要修改 -->
            <search :searchShow="searchShow" :where="a" @onselected="getStr" ref="row"></search>
            <el-table 
            v-loading="loading" border stripe
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="articleList" :height="tableHeight" size="medium"
            class="table" ref="multipleTable">
                <el-table-column type="index" :index="indexSort" label="序号" align="center" width="100">
                </el-table-column>
                <el-table-column prop="orderNumber" label="订单编号" align="center" width="150">
                </el-table-column>
                <el-table-column prop="bName" label="下单用户" align="center" :formatter="isBname">
                </el-table-column>
                <el-table-column prop="amount" label="课程数量" align="center">
                </el-table-column>
                <el-table-column prop="money" label="减免前价格" align="center">
                </el-table-column>
                <el-table-column prop="feeDerate" label="费用减免" align="center">
                </el-table-column>
                <el-table-column prop="totalMoney" label="减免后价格" align="center">
                </el-table-column>
                <el-table-column prop="actualMoney" label="部分退款剩余价格" align="center">
                </el-table-column>
                <el-table-column prop="status" label="订单状态" :formatter="isStatus" align="center">
                </el-table-column>
                <el-table-column prop="payStatus" label="付款状态" :formatter="isPayStatus" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" :formatter="createTimeForMat" align="center">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0 && scope.row.payStatus == 0">
                            <el-button type="text">确认线下收款</el-button>
                        </div>
                        <div v-else>
                            <el-button type="text">无</el-button>
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
                    selection4:true,
                    selection5:true,
                    input3:true,
                },
                a:11,
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
                p.sql = `select a.id,a.orderNumber,a.orderTime,a.userId,a.amount,a.money,
                a.feeDerate,a.totalMoney,a.actualMoney,a.status,a.payStatus,a.isDeleted,
                b.realName as bName,c.realName as cName from userOrder as a 
                left join user as b on a.userId = b.id 
                left join admin as c on a.userId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = "where a.isDeleted = 0";
                }
                p.orderStr = "order by a.orderTime desc";
                console.log(p);  
                this.api.getPageInfo("userOrder",p)
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
                p.sql = `select a.id,a.orderNumber,a.orderTime,a.userId,a.amount,a.money,
                a.feeDerate,a.totalMoney,a.actualMoney,a.status,a.payStatus,a.isDeleted,
                b.realName as bName,c.realName as cName from userOrder as a 
                left join user as b on a.userId = b.id 
                left join admin as c on a.userId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where a.isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = "where a.isDeleted = 0";
                }
                p.orderStr = "order by a.orderTime desc";
                //console.log(p);  
                this.api.getDataByPage("userOrder",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;
                })
                .catch(error => {
                    console.log(error);
                });
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
            indexSort(index) {
                return (this.page.currentPage-1)*this.page.pageSize+(index+1);
            },
            isStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return "未支付";
				} else if (cellValue == 1) {
					return "已支付";
				} else if (cellValue == 2) {
					return "取消订单";
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
            isBname(row, column, cellValue, index){
				if (cellValue != "0") {
					return cellValue;
				} else if(row.cName != "0"){
					return row.cName;
				}else{
                    return "管理员";
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
