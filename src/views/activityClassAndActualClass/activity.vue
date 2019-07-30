<template>
    <div class="activity">
        <el-row :gutter="20">
            <el-col :span="6" class="tree">
                <el-scrollbar style="height:100%">
                    <el-tree :data="treeData"
                    :props="defaultProps" 
                    node-key="id" ref="tree" 
                    highlight-current accordion
                    @node-click="handleNodeClick">
                    </el-tree>
                </el-scrollbar>
            </el-col>
            <el-col :span="18">
                <div class="container">
                    <el-row class="addBtn" ref="row">
                        <el-col :span="18" class="select">
                            <search :searchShow="searchShow" :where="a" @onselected="getStr"></search>
                        </el-col>
                        <el-col :span="6" v-if="addBtn">
                            <el-button type="primary" @click="handleAdd">添加</el-button>
                        </el-col>
                    </el-row>
                    <el-table 
                    v-loading="loading" border stripe
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    :data="articleList" :height="tableHeight" size="medium"
                    class="table" ref="multipleTable">
                        <el-table-column type="selection" width="55" align="center" ></el-table-column>
                        <el-table-column prop="serialNumber" label="序号" align="center" width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="activityCode" label="项目编号" align="center" width="100">
                        </el-table-column>
                        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                        <el-table-column prop="cname" label="所属类别" align="center"></el-table-column>
                        <el-table-column prop="charge" label="收费金额" align="center"></el-table-column>
                        <el-table-column prop="enrollmentTargets" label="招生对象" align="center" v-if="enrollmentTargetsTd">

                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id)">修改</el-button>
                                <el-button type="text" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)" class="red">删除</el-button>
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
            </el-col>
        </el-row>
        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addFormVisible" :center="center" top="10vh">
            <el-form :model="addForm" :rules="rules" ref="ruleAddForm">
                <el-form-item label="所属类别" :label-width="formLabelWidth">
                    <el-input v-model="selectionData.name" :disabled="true" autocomplete="off"></el-input>
                    <!-- <el-select v-model="addForm.activitySortId" clearable placeholder="请选择">
                        <el-option
                        v-for="item in activitySortId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="addForm.serialNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" :label-width="formLabelWidth" prop="activityCode">
                    <el-input v-model="addForm.activityCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="selectionData.index==2" label="招生对象" :label-width="formLabelWidth" prop="enrollmentTargets">
                    <el-select v-model="addForm.enrollmentTargets" multiple placeholder="请选择">
                        <el-option
                        v-for="item in grades"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收费金额" :label-width="formLabelWidth" prop="charge">
                    <el-input v-model="addForm.charge" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item v-if="selectionData.index==2" label="备注" :label-width="formLabelWidth" prop="remark">
                    <el-input type="textarea" v-model="addForm.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button v-if="selectionData.index==1" type="primary" @click="add('ruleAddForm','0',selectionData.id)">确 定</el-button>
                <el-button v-if="selectionData.index==2" type="primary" @click="add('ruleAddForm',selectionData.id,selectionData.activitySortId)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="editFormVisible" :center="center" top="10vh" >
            <el-form :model="editForm" :rules="rules" ref="ruleEditForm">
                <el-form-item label="所属类别" :label-width="formLabelWidth" prop="activitySortId">
                    <el-select v-model="editForm.activitySortId" clearable placeholder="请选择">
                        <el-option
                        v-for="item in activitySortId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序号" :label-width="formLabelWidth" prop="serialNumber">
                    <el-input v-model="editForm.serialNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" :label-width="formLabelWidth" prop="activityCode">
                    <el-input v-model="editForm.activityCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="enrollmentTargetsTd" label="招生对象" :label-width="formLabelWidth" prop="enrollmentTargets">
                    <el-select v-model="editForm.enrollmentTargets" multiple placeholder="请选择">
                        <el-option
                        v-for="item in grades"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收费金额" :label-width="formLabelWidth" prop="charge">
                    <el-input v-model="editForm.charge" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="备注" v-if="enrollmentTargetsTd" :label-width="formLabelWidth" prop="remark">
                    <el-input type="textarea" v-model="editForm.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editor('ruleEditForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import search from '../../components/common/search'
    import pagination from '../../components/common/pagination'
    export default {
        data() {
            return {
                searchShow:{
                    selection3:true,
                    input1:true
                },
                a:2,
                data: [],
                defaultProps: {
                    children: [],
                    label: 'name',
                    isLeaf: 'leaf'
                },
                articleList: [],
                id: '',
                audit:false,
                count:0,
                page:{
                    currentPage: 1,
                    pageSize: 10
                },
                addBtn:false,
                enrollmentTargetsTd:false,
                whereStr:'',
                whereStr2:'',
                selectionData:{},
                activitySortId:[],
                grades:[],
                addFormVisible:false,
                editFormVisible:false,
                center:true,
                node:[],
                resolve:[],
                formLabelWidth: '200px',
                // 添加界面数据
                addForm: {
                    serialNumber:'',
                    activitySortId:'',
                    activityCode:'',
                    enrollmentTargets:[],
                    charge:'',
                    remark:'',
                    name:'',
                    pid:'',
                },
                // 编辑界面数据
                editForm: {
                    serialNumber:'',
                    activitySortId:'',
                    activityCode:'',
                    enrollmentTargets:[],
                    charge:'',
                    remark:'',
                    name:'',
                    pid:'',
                },
                rules: {
                    activitySortId: [
                        { required: true, message: '请选择类别', trigger: 'change' },
                    ],
                    serialNumber: [
                        { required: true, message: '请输入序号', trigger: 'blur' },
                    ],
                    activityCode: [
                        { required: true, message: '请输入项目编号', trigger: 'blur' }
                    ],
                    enrollmentTargets: [
                        { type: 'array',required: true, message: '请选择招生对象', trigger: 'change' }
                    ],
                    charge: [
                        { required: true, message: '请输入收费金额', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                },
                loading: false,
                tableHeight:null,
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                yjData:[],
                ejData:[],
                treeData:[]
            };
        },
        components:{
            pagination,
            search
        },
        computed:{
        },
        created(){
            this.getActivitySort()
            this.getActivitySortId()
            this.getGrades()
        },
        mounted(){
            this.tableHeight = window.innerHeight - this.$refs.row.$el.offsetTop -this.$refs.pagination.$el.offsetTop-130;
            console.log(this.tableHeight);
        },
        methods: {
            handleNodeClick (data) {
                this.selectionData = data;
                if(data.index===1){
                    this.addBtn = true;
                    this.enrollmentTargetsTd = false;
                    this.whereStr = `where a.isDeleted = 0 and a.activitySortId = '${data.id}' and a.pid='0'`
                }else if(data.index===2){
                    this.addBtn = true;
                    this.enrollmentTargetsTd = true;
                    this.whereStr = `where a.isDeleted = 0 and a.pid = '${data.id}'`
                }else{
                    this.addBtn = false;
                    this.enrollmentTargetsTd = true;
                    this.whereStr = `where a.isDeleted = 0 and a.id = '${data.id}'`
                }
                this.getPageInfo();
            },
            //查询分类
            getActivitySort() {
                let p = {};
                p.sql = "select id,name from activitySort where isDeleted = 0 order by serialNumber asc";
                this.api.queryForMap("activitySort",p)
                .then(result => {
                    let data = result.data
                    for(let item of data){
                        item.index=1
                    }
                    this.yjData = result.data
                    this.getActivity()

                })
                .catch(error => {
                    console.log(error);
                });
            },
            // //查询项目
            getActivity() {
                let p = {};
                p.sql = `select * from activity where isDeleted = 0 order by serialNumber asc`;
                this.api.queryForMap("activity",p)
                .then(result => {
                    let data = result.data
                    for(let item of data){
                        if(item.pid=='0'){
                            item.pid = item.activitySortId
                            item.index=2
                        }else{
                            item.index=3
                        }
                    }
                    this.ejData = data
                    console.log(this.ejData)
                    let arr = [...this.yjData,...this.ejData]
                    this.treeData = this.formatTreeData(arr)
                    console.log(this.treeData)
                })
                .catch(error => {
                    console.log(error);
                });
            },
            formatTreeData (list) {
                let temp = []
                let tree = []
                let trueTree = []
                for (let i in list) {
                    temp[list[i].id] = list[i]
                }

                for (let i in temp) {
                    if (temp[i].pid && temp[i].pid != '0') {
                        if (!temp[temp[i].pid].children) {
                            temp[temp[i].pid].children = []
                        }
                        temp[temp[i].pid].children[temp[i].id] = temp[i]
                    } else {
                        tree[temp[i].id] = temp[i]
                    }
                }
                this.formatData(tree, trueTree)
                return trueTree
            },
            formatData(parentNode, eArr) {
                for (let i in parentNode) {
                    if (parentNode[i].children) {
                        let subEmptyArr = []
                        parentNode[i].children = this.formatData(parentNode[i].children, subEmptyArr)
                    }
                    eArr.push(parentNode[i])
                }
                return eArr
            },
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
                p.sql = `select a.*,b.name as activityName,c.name as cname from activity as a 
                left join activity as b on a.pid = b.id 
                left join activitySort as c on a.activitySortId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr2 !=""){
                    p.whereStr = `${this.whereStr}${this.whereStr2}`;
                }else{
                    p.whereStr = this.whereStr;
                }
                p.orderStr = "order by a.serialNumber asc";
                console.log(p);  
                this.api.getPageInfo("activity",p)
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
                p.sql = `select a.*,b.name as activityName,c.name as cname from activity as a 
                left join activity as b on a.pid = b.id 
                left join activitySort as c on a.activitySortId = c.id`;
                p.everyPage = this.page.pageSize;
                p.currentPage = this.page.currentPage;
                if(this.whereStr2 !=""){
                    p.whereStr = `${this.whereStr}${this.whereStr2}`;
                }else{
                    p.whereStr = this.whereStr;
                }
                p.orderStr = "order by a.serialNumber asc";
                //console.log(p);  
                this.api.getDataByPage("activity",p)
                .then(result => {
                    console.log(result);
                    this.loading = false
                    this.articleList = result.data;

                })
                .catch(error => {
                    console.log(error);
                });
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
                    p.sql = `update activity set isDeleted = 1 where id = '${id}'`;
                    this.api.exec('activity',p)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                        this.getPageInfo();
                        this.node.childNodes = [];
                        this.loadNode(this.node,this.resolve);
                    }).catch(err =>{console.log(err)})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });    
            },
            //根据id获取内容
            getDetailById(id) {
                let p = {};
                p.id = id;
                console.log(p);  
                this.api.getDetailById("activity",p)
                .then(result => {
                    console.log(result);
                    this.editForm = result.data;
                    this.editForm.enrollmentTargets = result.data.enrollmentTargets.split(",");
                })
                .catch(error => {
                    console.log(error);
                });
            },
            //添加
            add(formName,pid,activitySortId) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let p = {};
                        p.activitySortId = activitySortId;
                        p.serialNumber = this.addForm.serialNumber;
                        p.activityCode = this.addForm.activityCode;
                        p.name = this.addForm.name;
                        p.enrollmentTargets = this.addForm.enrollmentTargets.toString();
                        p.charge = this.addForm.charge;
                        p.remark = this.addForm.remark;
                        p.pid = pid;
                        p.isDeleted = 0;
                        console.log(p);  
                        this.api.add("activity",p)
                        .then(result => {
                            console.log(result);
                            this.$message({
                                type: 'success',
                                message: '添加成功!',
                            });
                            this.closeAdd();

                        })
                        .catch(error => {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }, 
            //修改
            editor(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let p = {};
                        p.id=this.editForm.id;
                        p.activitySortId = this.editForm.activitySortId;
                        p.serialNumber = this.editForm.serialNumber;
                        p.activityCode = this.editForm.activityCode;
                        p.name = this.editForm.name;
                        p.enrollmentTargets = this.editForm.enrollmentTargets.toString();
                        p.charge = this.editForm.charge;
                        p.remark = this.editForm.remark;
                        p.pid = this.editForm.pid;
                        p.isDeleted = this.editForm.isDeleted;
                        console.log(p);  
                        this.api.update("activity",p)
                        .then(result => {
                            console.log(result);
                            this.$message({
                                type: 'success',
                                message: '修改成功!',
                            });
                            this.closeEdit();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getActivitySortId() {
                let p = {};
                p.sql = "select id,name from activitySort where isDeleted = 0  order by serialNumber asc";
                console.log(p);  
                this.api.queryForMap("activitySort",p)
                .then(result => {
                    console.log(result);
                    this.activitySortId = result.data;
                })
                .catch(error => {
                    console.log(error);
                });
            },
            getGrades() {
                let p = {};
                p.sql = `select b.id,b.name from dictionarySort as a 
                left join dictionary as b on a.id = b.dictionarySortId 
                where a.name = '年级' order by b.serialNumber asc`;
                console.log(p);  
                this.api.queryForMap("dictionarySort",p)
                .then(result => {
                    console.log(result);
                    this.grades = result.data;
                })
                .catch(error => {
                    console.log(error);
                });
            },
            // 显示编辑界面
            handleEdit(id) {
                this.editFormVisible = true;
                this.getDetailById(id)
            },
            // 显示新增界面
            handleAdd() {
                this.addFormVisible = true;
            },
            // 关闭编辑界面
            closeEdit(id) {
                this.editFormVisible = false;
                this.getPageInfo();
                this.node.childNodes = [];
                this.loadNode(this.node,this.resolve);
            },
            // 关闭新增界面
            closeAdd() {
                this.addFormVisible = false;
                this.getPageInfo();
                this.node.childNodes = [];
                this.loadNode(this.node,this.resolve);
            },
            getStr(data){
                this.page.currentPage=1;
                this.whereStr2 = data;
                this.getPageInfo();
            }
        },
    };
</script>

<style>
    .el-scrollbar__wrap{
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>
<style scoped>
    .activity,.el-row{
        width:100%;
        height:100%;
    }
    .tree{
        height:100%;
        background:#fff;
    }
    .addBtn{
        margin-bottom:20px;
        text-align: right;
    }
    .select{
        text-align:left;
    }
</style>
