<template>
    <div class="articleList">
        <div class="container">
            <el-row ref="row">
                <el-col :span="18" class="select">
                    <search :searchShow="searchShow" :where="a" @onselected="getStr" ref="row"></search> 
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
                <el-table-column type="index" :index="indexSort" label="序号" align="center" width="100" sortable>
                </el-table-column>
                <el-table-column prop="schoolName" label="学校名称" align="center">
                </el-table-column>
                <el-table-column prop="gradeName" label="年级" align="center">
                </el-table-column>
                <el-table-column prop="classNumber" label="班号" align="center">
                </el-table-column>
                <el-table-column prop="studentName" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="orderNumber" label="订单编号" align="center" :formatter="isOrderNumber">
                </el-table-column>
                <el-table-column prop="isUsed" label="是否使用" align="center" :formatter="hasUsed">
                </el-table-column>
                <el-table-column prop="derateFee" label="减免金额" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="isCreateTime">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="view(scope.row.id)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :count="count" :audit="audit"
            @getPageSize="getPageSize" ref="pagination"
            @getCurrentPage="getCurrentPage"
            @getPageInfo="getPageInfo"
            ></pagination>
        </div>
        <!-- 添加 -->
        <feeDerateAdd :addShow="addShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 修改 -->
        <feeDerateEdit :editShow="editShow" :id="id" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 查看 -->
        <feeDerateView :viewShow="viewShow" :id="id" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import feeDerateAdd from './feeDerateForm/feeDerateAdd'
    import feeDerateEdit from './feeDerateForm/feeDerateEdit'
    import feeDerateView from './feeDerateForm/feeDerateView'
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
                a:15,
                articleList: [],
                id: '',
                addShow:false,
                editShow:false,
                viewShow:false,
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
            search,
            feeDerateAdd,
            feeDerateEdit,
            feeDerateView
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
                p.sql = "select a.*,b.orderNumber from feeDerate as a left join userOrder as b on a.userOrderId = b.id";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where ${this.whereStr}`;
                }else{
                    p.whereStr = "";
                }
                p.orderStr = "order by a.createTime desc";
                console.log(p);  
                this.api.getPageInfo("feeDerate",p)
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
                p.sql = "select a.*,b.orderNumber from feeDerate as a left join userOrder as b on a.userOrderId = b.id";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where ${this.whereStr}`;
                }else{
                    p.whereStr = "";
                }
                p.orderStr = "order by a.createTime desc";
                //console.log(p);  
                this.api.getDataByPage("feeDerate",p)
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
            isOrderNumber(row, column, cellValue, index){
				if (cellValue == "0") {
					return "未使用"
				} else{
					return cellValue
				}
            },
            hasUsed(row, column, cellValue, index){
				if (cellValue == "0") {
					return "未使用"
				} else if (cellValue == "1") {
					return "已使用"
				}
            },
            isCreateTime(row, column, cellValue, index){
                return this.moment(cellValue).format("YYYY-MM-DD")
            },
            getStr(data){
                this.page.currentPage=1;
                this.whereStr = data;
                this.getPageInfo();
            },
            //添加
            add() {
                this.addShow = true
            },
            modify(id){
                this.id = id
                this.editShow = true
            },
            view(id){
                this.id = id
                this.viewShow = true
            },
            //关闭弹窗
            handCancel(){
                this.id = ''
                this.addShow = false
                this.editShow = false
                this.viewShow = false
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
