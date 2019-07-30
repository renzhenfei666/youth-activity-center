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
                <el-table-column prop="studentName" label="申请学生" align="center" sortable>
                </el-table-column>
                <el-table-column prop="fromClassName" label="现报名项目" align="center">
                </el-table-column>
                <el-table-column prop="toClassName" label="要调到项目" align="center">
                </el-table-column>
                <el-table-column prop="fromFee" label="原支付费用" align="center">
                </el-table-column>
                <el-table-column prop="toFee" label="现支付费用" align="center">
                </el-table-column>
                <el-table-column prop="payable" label="应付/退差价" align="center" :formatter="isPayable">
                </el-table-column>
                <el-table-column prop="payStatus" label="付款状态" align="center" :formatter="isPayStatus">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" :formatter="isStatus">
                </el-table-column>
                <el-table-column prop="realName" label="处理人" align="center" :formatter="isRealName">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-thumb" v-if="scope.row.status==1">立即分班</el-button>
                        <el-button type="text" v-else class="red">分班完成</el-button>
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
                    input3:true,
                },
                a:7,
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
                p.sql = `select a.id,a.activityEnrollId,a.transferActivityEnrollId,a.toActivityClassId,
                a.status,a.fromFee,a.toFee,a.payable,a.payStatus,
                b.className as fromClassName,c.className as toClassName,
                d.studentName,e.realName from classTransfer as a 
                left join 
                (select m.id,n.className,m.studentId,n.activityClassMainId from activityEnroll as m 
                left join activityClass as n on m.activityClassId = n.id) as b on a.activityEnrollId = b.id
                left join activityClass as c on a.toActivityClassId = c.id 
                left join student as d on b.studentId = d.id
                left join admin as e on a.adminId = e.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr){
                    p.whereStr = `where ${this.whereStr} and (a.status = 1 or a.status = 4) and a.toActivityClassId in (select activityClassId from actualClass)`;
                }else{
                    p.whereStr = "where (a.status = 1 or a.status = 4) and a.toActivityClassId in (select activityClassId from actualClass)";
                }
                p.orderStr = "order by a.createTime desc";
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
                p.sql = `select a.id,a.activityEnrollId,a.transferActivityEnrollId,a.toActivityClassId,
                a.status,a.fromFee,a.toFee,a.payable,a.payStatus,
                b.className as fromClassName,c.className as toClassName,
                d.studentName,e.realName from classTransfer as a 
                left join 
                (select m.id,n.className,m.studentId,n.activityClassMainId from activityEnroll as m 
                left join activityClass as n on m.activityClassId = n.id) as b on a.activityEnrollId = b.id
                left join activityClass as c on a.toActivityClassId = c.id 
                left join student as d on b.studentId = d.id
                left join admin as e on a.adminId = e.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr){
                    p.whereStr = `where ${this.whereStr} and (a.status = 1 or a.status = 4) and a.toActivityClassId in (select activityClassId from actualClass)`;
                }else{
                    p.whereStr = "where (a.status = 1 or a.status = 4) and a.toActivityClassId in (select activityClassId from actualClass)";
                }
                p.orderStr = "order by a.createTime desc";
                this.api.getDataByPage("classTransfer",p)
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
            isPayable(row, column, cellValue, index){
				if (cellValue > 0) {
					return `补差价${cellValue}`
				} else if (cellValue == 0) {
					return cellValue
				}
            },
            isPayStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return '未付款'
				} else if (cellValue == 1) {
					return '已付款'
				} else if (cellValue == 2) {
					return '已退款'
				} else if (cellValue == 3) {
					return '未退款'
				}
            },
            isStatus(row, column, cellValue, index){
				if (cellValue == 0) {
					return '未审核'
				} else if (cellValue == 1) {
					return '审核通过'
				} else if (cellValue == 2) {
					return '审核不通过'
				} else if (cellValue == 3) {
					return '已取消'
				} else if (cellValue == 4) {
					return '分班完成'
				}
            },
            isRealName(row, column, cellValue, index){
				if (cellValue == '0') {
					return '无'
				} else{
					return cellValue
				}
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
