<template>
    <div class="sidebar">
        <!-- <el-menu class="sidebar-el-menu"
        :default-active="defaultActive"
        router :collapse="collapse" 
        background-color="#324157" 
        text-color="#bfcbd9" 
        active-text-color="#20a0ff" 
        unique-opened>
            <SidebarItem v-for="(item, idx) in data" 
            :subroute="item"
            :fatherpath="fatherPath"
            :barIdx="idx" :key="idx" />
        </el-menu> -->
        <el-menu class="sidebar-el-menu" :default-active="this.$route.path" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in data">
                <template v-if="item.children">
                    <el-submenu :index="item.id" :key="item.id">
                        <template slot="title">
                            <i :class="item.pcIcon"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.id">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="i" :index="threeItem.pcOpenUrl">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.pcOpenUrl" >
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.pcOpenUrl">
                        <i :class="item.pcIcon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                data:[],
            }
        },
        computed:{
            onRoutes(){
                console.log(this.$route.path.replace('/',''));
                return this.$route.path.replace('/','');
            }
        },
        created(){
            this.getSideBar()
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                console.log(msg);
                this.collapse = msg;
            })
        },
        methods:{
            getSideBar() {
                let p = {};
                p.sql = `select * from functionalItem order by serialNumber asc`;
                this.api.queryForMap("functionalItem",p)
                .then(result => {
                    this.data = this.formatTreeData(result.data);
                    console.log(this.data);
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
            }

        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
