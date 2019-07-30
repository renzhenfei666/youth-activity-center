<template>
    <div>
        <el-dialog title="批量添加" :visible.sync="show" width="70%" :center="center" top="10vh" @close = "cancel">
            <el-row :gutter="20">
                <el-col :span="6" class="tree">
                    <el-scrollbar style="height:100%">
                        <el-tree :data="treeData"
                        :props="defaultProps" 
                        node-key="id" ref="tree"
                        highlight-current accordion show-checkbox
                        @check-change="getChecked" default-expand-all>
                        </el-tree>
                    </el-scrollbar>
                </el-col>
                <el-col :span="18" class="form">
                    <el-scrollbar style="height:100%">
                        <el-form :model="form" :rules="rules" ref="ruleForm">
                            <el-form-item label="学期" :label-width="formLabelWidth" prop="activityClassMainId">
                                <el-select v-model="form.activityClassMainId" clearable placeholder="请选择">
                                    <el-option
                                    v-for="item in data.activityClassMain"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否限报" :label-width="formLabelWidth" prop="isLimitNumber">
                                <el-radio-group v-model="form.isLimitNumber">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="招生方式" :label-width="formLabelWidth" prop="enrollmentWay">
                                <el-radio-group v-model="form.enrollmentWay">
                                    <el-radio :label="0">抢报</el-radio>
                                    <el-radio :label="1">老生优先</el-radio>
                                    <el-radio :label="2">随机分配</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="上课时段" :label-width="formLabelWidth" prop="classTime">
                                <el-select v-model="form.classTime" clearable placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in data.classTime"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <hr>
                        <el-form :inline="true">
                            <div  v-for="(item,index) in selectionData" :key="index">
                                <h3>{{item.name}}设置</h3>
                                <div>
                                    <el-form-item label="项目报名编号" :label-width="formLabelWidth">
                                        <el-input v-model="item.activityCode" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目名称" :label-width="formLabelWidth">
                                        <el-input v-model="item.name" autocomplete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <hr>
                            </div>
                        </el-form>
                    </el-scrollbar>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        addShow:{
            type:Boolean,
            default:false
        },
    },
    data() {
        return {
            formLabelWidth: '200px',
            form:{
                activityClassMainId:'',
                isLimitNumber:0,
                enrollmentWay:0,
                classTime:''
            },
            data:{
                activityClassMain:[],
                classTime:[]
            },
            show:this.addShow,
            center:true,
            rules: {
                activityClassMainId: [
                    { required: true, message: '请选择学期', trigger: 'change' },
                ],
                isLimitNumber: [
                    { required: true, message: '请选择是否限报', trigger: 'change' }
                ],
                enrollmentWay: [
                    { required: true, message: '请选择招生方式', trigger: 'change' }
                ],
                classTime: [
                    { required: true, message: '请选择上课时段', trigger: 'change' }
                ],
            },
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf'
            },
            yjData:[],
            ejData:[],
            treeData:[],
            selectionData:[]
        };
    },
    computed:{
        
    },
    created(){

    },
    methods: {
        getChecked(data) {
            if(!this.form.activityClassMainId){
                this.$message.error('请先选择学期');
                console.log(this.$refs.tree.setChecked(data.id, false, false))
                return
            }
            if(!this.form.classTime){
                this.$message.error('请先选择上课时段');
                console.log(this.$refs.tree.setChecked(data.id, false, false))
                return
            } 
            this.selectionData = this.$refs.tree.getCheckedNodes(true,false);
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
                this.yjData = data
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
        //加载学期
        getClsssMain() {
            let p = {};
            p.sql = `select id,name from activityClassMain 
            where status = 2 and isDeleted = 0 
            order by createTime desc`;
            this.api.queryForMap("activityClassMain",p)
            .then(result => {
                console.log(result);
                this.data.activityClassMain = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //加载上课时间
        getClassTime() {
            let p = {};
            p.sql = `select b.id,b.name from dictionarySort as a 
            left join dictionary as b on a.id = b.dictionarySortId 
            where a.name = '上课时间' order by b.serialNumber asc`;
            //console.log(p);  
            this.api.queryForMap("dictionarySort",p)
            .then(result => {
                console.log(result);
                this.data.classTime = result.data;

            })
            .catch(error => {
                console.log(error);
            });
        },
        cancel(){
            this.$emit('handCancel');
            this.selectionData = [];
            this.$refs['ruleForm'].resetFields();
        },
        confirm(){
            this.$emit('handCancel');
            this.$emit('getPageInfo');
            this.$refs['ruleForm'].resetFields();
        }
    },
    watch:{
        addShow(){
            if(this.addShow){
                this.show = this.addShow
                this.getActivitySort()
                this.getClsssMain()
                this.getClassTime()
            }
        },
    }
}
</script>

<style>

</style>
<style scoped>
.tree,.form{
    height:600px;
}
h3{
    text-align:center;
    padding:20px 0;
}
</style>
