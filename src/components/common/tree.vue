<template>
    <div>
        <el-scrollbar style="height:100%">
            <el-tree :data="treeData"
            :props="defaultProps" 
            node-key="id" ref="tree" 
            highlight-current accordion show-checkbox
            @check-change="handleCheckChange" default-expand-all>
            </el-tree>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
    created(){
        this.getActivitySort()
    },
    methods: {
        handleCheckChange (data,isCheck,hasChildren) {
            console.log(data,isCheck,hasChildren)
        },
        //查询分类
        getActivitySort() {
            let p = {};
            p.sql = "select id,name from activitySort where isDeleted = 0 order by serialNumber asc";
            this.api.queryForMap("activitySort",p)
            .then(result => {
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
    },
};
</script>

<style lang="stylus" scoped>

</style>
