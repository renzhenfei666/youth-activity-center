<template>
    <div>
        <div class="pagination">
            <el-row>
                <el-col :span="12" class="paginationLeft" v-if="audit">
                    <el-button type="danger" @click="emitStatus(0)">待初审</el-button>
                    <el-button type="warning" @click="emitStatus(1)">初审通过</el-button>
                    <el-button type="primary" @click="emitStatus(2)">终审通过</el-button>
                </el-col>
                <el-col :span="audit ? 12 : 24" class="paginationRight">
                    <el-pagination background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" 
                    :page-sizes="[5, 10]"
                    :page-size="page.pageSize"
                    :current-page="page.currentPage" 
                    layout="total,sizes,prev, pager, next" :total="count">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import bus from './bus';
export default {
    props:{
        count:{
            type:Number,
            default:0
        },
        audit:{
           type:Boolean,
           default:true
        },
    },
    data() {
        return {
            page:{
                currentPage:1,
                pageSize: 10
            },
        };
    },
    created(){
        bus.$on('getTarget', () => {  
            this.page.currentPage = 1; 
        });  
    },
    mounted() {

    },
    methods: {
        handleSizeChange (val) {
            console.log(val);
            this.page.pageSize = val;
            this.$emit("getPageSize",val);
            this.$emit("getPageInfo");
        },
        handleCurrentChange (val) {
            console.log(val);
            this.page.currentPage = val;
            this.$emit("getCurrentPage",val);
            this.$emit("getPageInfo");
        },
        emitStatus(status){
            this.$emit('changeStatus',status)
        },
    },
};
</script>

<style scoped>
    .paginationLeft{
        text-align: left;
    }
    .paginationRight{
        text-align: right;
    }
</style>
