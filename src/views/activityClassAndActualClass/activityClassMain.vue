<template>
    <div class="articleList">
        <div class="container">
            <el-row ref="row">
                <el-col :span="18" class="select">
                    <search :searchShow="searchShow" @onselected="getStr" :where="a"></search>
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
            class="table" ref="multipleTable" @select="selectOne" @select-all="selectAll">
                <el-table-column type="selection" width="55" align="center" ></el-table-column>
                <el-table-column prop="schoolYear" label="学年" align="center" width="150" sortable>
                </el-table-column>
                <el-table-column prop="semester" label="学期" align="center" width="120">
                </el-table-column>
                <el-table-column prop="name" label="名称" align="center">
                </el-table-column>
                <el-table-column prop="content" label="招生简章" align="center">
                </el-table-column>
                <el-table-column prop="startTime" label="报名开始时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.startTime | dateformat('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="报名结束时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.endTime | dateformat('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0" :style="{color:styleColor.dcs}">待初审</span>
                        <span v-if="scope.row.status==1" :style="{color:styleColor.cstg}">初审通过</span>
                        <span v-if="scope.row.status==2" :style="{color:styleColor.zstg}">终审通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
                    </template>
                    <div></div>
                </el-table-column>
            </el-table>
            <pagination 
            :count="count"
            @changeStatus="changeStatus" 
            @getPageSize="getPageSize" ref="pagination"
            @getCurrentPage="getCurrentPage"
            @getPageInfo="getPageInfo"
            ></pagination>
        </div>
        <!-- 添加 -->
        <activityClassMainAdd :addShow="addShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
        <!-- 修改 -->
        <activityClassMainEdit :id="id" :editShow="editShow" @handCancel="handCancel" @getPageInfo="getPageInfo"/>
    </div>

</template>

<script>
    import activityClassMainAdd from './activityClassMainForm/activityClassMainAdd'
    import activityClassMainEdit from './activityClassMainForm/activityClassMainEdit'
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    selection:true,
                    input1:true
                },
                a:0,
                articleList: [],
                id: '',
                addShow:false,
                editShow:false,
                title:'',
                selection:[],
                count:0,
                audit:false,
                page:{
                    currentPage: 1,
                    pageSize: 10
                },
                styleColor: {
                    dcs: '#F56C6C',
                    cstg: '#E6A23C',
                    zstg: '#409EFF'
                },
                whereStr:'',
                loading: true,
                tableHeight:null
            }
        },
        components:{
            activityClassMainAdd,
            activityClassMainEdit,
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
                p.sql = "";
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr !=""){
                    p.whereStr = `where isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where isDeleted = 0`;
                }
                p.orderStr = "order by createTime desc";
                console.log(p);  
                this.api.getPageInfo("activityClassMain",p)
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
                if(this.whereStr !=""){
                    p.whereStr = `where isDeleted = 0${this.whereStr}`;
                }else{
                    p.whereStr = `where isDeleted = 0`;
                }
                p.orderStr = "order by createTime desc";
                //console.log(p);  
                this.api.getDataByPage("activityClassMain",p)
                .then(result => {
                    this.loading = false
                    console.log(result);
                    this.articleList = result.data;

                })
                .catch(error => {
                    console.log(error);
                });
            },
            //添加
            add() {
                this.addShow = true
            },
            modify(id){
                this.id = id
                this.editShow = true
            },
            //关闭弹窗
            handCancel(){
                this.id = ''
                this.addShow = false
                this.editShow = false
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
                    p.sql = `update activityClassMain set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('activityClassMain',p)
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
            //选择一个项目
            selectOne(selection, row){
                console.log(selection);
                this.selection = selection
            },
            //全选
            selectAll(selection){
                console.log(selection);
                this.selection = selection
            },
            //更改审核状态
            changeStatus(status) {
                console.log(this.selection);
                if(this.selection.length<1){
                    this.$message({
                        type: 'info',
                        message: '请先选择'
                    }); 
                    return;
                }else{
                    for(let item of this.selection){
                        let p = {};
                        p.sql = `update activityClassMain set status='${status}' where id='${item.id}'`;
                        this.api.exec('activityClassMain',p)
                        .then(res => {
                            for(const aitem of this.articleList){
                                if(item.id==aitem.id){
                                    console.log(aitem);
                                    this.$set(aitem,"status",status);
                                }
                            }
                        })
                        .catch(err =>{
                            console.log(err)
                        })
                    }
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
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
    .select{
        text-align:left;
    }
</style>
