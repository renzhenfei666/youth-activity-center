<template>
    <div>
        <el-form :inline="true">
            <el-form-item v-if="show.activityClassMain">
                <el-select v-model="activityClassMain.selected" clearable placeholder="请选择学期" @visible-change="getClsssMain" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="item in activityClassMain.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.schoolName">
                <el-select v-model="schoolName.selected" clearable placeholder="请选择学校" @visible-change="getSchool" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="(item,index) in schoolName.data"
                    :key="index"
                    :label="item.schoolName"
                    :value="item.schoolName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.gradeName">
                <el-select v-model="gradeName.selected" clearable placeholder="请选择年级" @visible-change="getGrade" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="(item,index) in gradeName.data"
                    :key="index"
                    :label="item.gradeName"
                    :value="item.gradeName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.classNumber">
                <el-select v-model="classNumber.selected" clearable placeholder="请选择班级" @visible-change="getClassNumber" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="(item,index) in classNumber.data"
                    :key="index"
                    :label="item.classNumber"
                    :value="item.classNumber">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.classTime">
                <el-select v-model="classTime.selected" clearable placeholder="请选择上课时间" @visible-change="getClassTime" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="item in classTime.data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.selection">
                <el-select v-model="selection.selected" clearable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in selection.data"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.selection2">
                <el-select v-model="selection2.selected" clearable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in selection2.data"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.selection3">
                <el-select v-model="selection3.selected" clearable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in selection3.data"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.selection4">
                <el-select v-model="selection4.selected" clearable placeholder="请选择报名状态" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="(item,index) in selection4.data"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.selection5">
                <el-select v-model="selection5.selected" clearable placeholder="请选择付款状态" @change ="getWhereStr($event,where)">
                    <el-option
                    v-for="(item,index) in selection5.data"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="show.input">
                <el-input
                placeholder="请输入活动班编号"
                v-model="input"
                clearable>
                </el-input>
            </el-form-item>
            <el-form-item v-if="show.input1">
                <el-input
                placeholder="请输入关键字"
                v-model="input1"
                clearable>
                </el-input>
            </el-form-item>
            <el-form-item v-if="show.input2">
                <el-input
                placeholder="请输入上课班级名称"
                v-model="input2"
                clearable>
                </el-input>
            </el-form-item>
            <el-form-item v-if="show.input3">
                <el-input
                placeholder="请输入姓名"
                v-model="input3"
                clearable>
                </el-input>
            </el-form-item>
            <el-button type="primary" plain @click="getWhereStr($event,where)">检索</el-button>
        </el-form>
    </div>
</template>

<script>
import bus from './bus';
export default {
    props:{
        searchShow:{
            type:Object
        },
        where:{
            type:Number,
        }
    },
    data() {
        return {
            show:{
                selection:false,
                selection2:false,
                selection3:false,
                selection4:false,
                selection5:false,
                activityClassMain:false,
                schoolName:false,
                gradeName:false,
                classNumber:false,
                classTime:false,
                input:false,
                input1:false,
                input2:false,
                input3:false,
            },
            selection:{
                data: [
                    {
                        id: 'schoolYear',
                        name: '学年'
                    }, 
                    {
                        id: 'name',
                        name: '名称'
                    }, 
                    {
                        id: 'content',
                        name: '招生简章'
                    }
                ],
                selected: ''
            },
            selection2:{
                data: [
                    {
                        id: 'name',
                        name: '类别名称'
                    }, 
                    {
                        id: 'description',
                        name: '说明'
                    }, 
                ],
                selected: ''
            },
            selection3:{
                data: [
                    {
                        id: 'name',
                        name: '项目名称'
                    }, 
                ],
                selected: ''
            },
            selection4:{
                data: [
                    {
                        id: '0',
                        name: '未报名'
                    }, 
                    {
                        id: '1',
                        name: '已报名'
                    }, 
                    {
                        id: '2',
                        name: '已退班'
                    }, 
                    {
                        id: '3',
                        name: '已调班'
                    }, 
                    {
                        id: '4',
                        name: '退班中'
                    }, 
                    {
                        id: '5',
                        name: '调班中'
                    }, 
                ],
                selected: ''
            },
            selection5:{
                data: [
                    {
                        id: '0',
                        name: '未付款'
                    }, 
                    {
                        id: '1',
                        name: '已付款'
                    }, 
                    {
                        id: '2',
                        name: '已退款'
                    }, 
                ],
                selected: ''
            },
            activityClassMain:{
                data:[],
                selected:''
            },
            schoolName:{
                data:[],
                selected:''
            },
            gradeName:{
                data:[],
                selected:''
            },
            classNumber:{
                data:[],
                selected:''
            },
            classTime:{
                data:[],
                selected:''
            },
            input:'',
            input1:'',
            input2:'',
            input3:''
        };
    },
    created() {
        this.getClsssMain();
        for(let type in this.searchShow){
            for(let type2 in this.show){
                if(type == type2){
                    this.show[type2] = this.searchShow[type];
                }
            }
        }
    },
    methods: {
        //加载学期
        getClsssMain() {
            let p = {};
            p.sql = `select id,name from activityClassMain 
            where status = 2 and isDeleted = 0 
            order by createTime desc`;
            this.api.queryForMap("activityClassMain",p)
            .then(result => {
                console.log(result);
                this.activityClassMain.data = result.data;
                this.activityClassMain.selected = result.data[0].id;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //加载学校
        getSchool() {
            let p = {};
            p.sql = `select distinct schoolName from student where status = 1`;
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result);
                this.schoolName.data = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //加载年级
        getGrade() {
            let p = {};
            p.sql = `select distinct gradeName from student 
            where schoolName = '${this.schoolName.selected}' and status = 1 
            ORDER BY FIND_IN_SET(gradeName,'一年级,二年级,三年级,四年级,五年级,六年级,七年级,八年级,九年级')`;
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result);
                this.gradeName.data = result.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        //加载班级
        getClassNumber() {
            let p = {};
            p.sql = `select distinct classNumber from student 
            where schoolName = '${this.schoolName.selected}' and gradeName = '${this.gradeName.selected}' and status = 1 
            order by classNumber asc`;
            this.api.queryForMap("student",p)
            .then(result => {
                console.log(result);
                this.classNumber.data = result.data;
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
                this.classTime.data = result.data;

            })
            .catch(error => {
                console.log(error);
            });
        },
        getWhereStr(event,a){
            console.log(a);
            let str = "";
            switch (a){
                case 0:
                    if(this.selection.selected && this.input1){
                        str +=` and ${this.selection.selected} like '%${this.input1}%'`
                    }
                    break;
                case 1:
                    if(this.selection2.selected && this.input1){
                        str +=` and ${this.selection2.selected} like '%${this.input1}%'`
                    }
                    break;
                case 2:
                    if(this.selection3.selected && this.input1){
                        str +=` and a.${this.selection3.selected} like '%${this.input1}%'`
                    }
                    break;
                case 3:
                    if(this.activityClassMain.selected){
                        str +=` and activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.classTime.selected){
                            str +=` and classTime = '${this.classTime.selected}'`
                        }
                        if(this.input1){
                            str +=` and classCode like '%${this.input1}%'`
                        }
                    }else{
                        if(this.classTime.selected){
                            str +=` and classTime = '${this.classTime.selected}'`
                        }
                        if(this.input1){
                            str +=` and classCode like '%${this.input1}%'`
                        }
                    }
                    break;
                case 4:
                    if(this.activityClassMain.selected){
                        str +=` and a.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.input2){
                            str +=` and a.className like '%${this.input2}%'`
                        }
                    }else{
                        if(this.input2){
                            str +=` and a.className like '%${this.input2}%'`
                        }
                    }
                    break;
                case 5:
                    if(this.activityClassMain.selected){
                        str +=` and b.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.schoolName.selected){
                            str +=` and e.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and e.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and e.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input){
                            str +=` and b.classCode like '%${this.input}%'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.schoolName.selected){
                            str +=` and e.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and e.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and e.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input){
                            str +=` and b.classCode like '%${this.input}%'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }
                    break;
                case 6:
                    if(this.activityClassMain.selected){
                        str +=` and a.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.input1){
                            str +=` and c.name like '%${this.input1}%'`
                        }
                    }else{
                        if(this.input1){
                            str +=` and c.name like '%${this.input1}%'`
                        }
                    }
                    break;
                case 7:
                    if(this.activityClassMain.selected){
                        str +=` b.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.input3){
                            str +=` and d.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.input3){
                            str +=` d.studentName like '%${this.input3}%'`
                        }
                    }
                    break;   
                case 8:
                    if(this.activityClassMain.selected){
                        str +=` and b.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.classTime.selected){
                            str +=` and b.classTime = '${this.classTime.selected}'`
                        }
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input){
                            str +=` and b.classCode like '%${this.input}%'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.classTime.selected){
                            str +=` and b.classTime = '${this.classTime.selected}'`
                        }
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input){
                            str +=` and b.classCode like '%${this.input}%'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }
                    break;
                case 9:
                    if(this.activityClassMain.selected){
                        str +=` and d.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.schoolName.selected){
                            str +=` and e.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and e.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and e.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.schoolName.selected){
                            str +=` and e.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and e.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and e.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.input3){
                            str +=` and e.studentName like '%${this.input3}%'`
                        }
                    }
                    break;
                case 10:
                    if(this.activityClassMain.selected){
                        str +=` and e.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.schoolName.selected){
                            str +=` and f.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and f.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and f.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.input3){
                            str +=` and f.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.schoolName.selected){
                            str +=` and f.schoolName = '${this.schoolName.selected}'`
                        }
                        if(this.gradeName.selected){
                            str +=` and f.gradeName = '${this.gradeName.selected}'`
                        }
                        if(this.classNumber.selected){
                            str +=` and f.classNumber = '${this.classNumber.selected}'`
                        }
                        if(this.input3){
                            str +=` and f.studentName like '%${this.input3}%'`
                        }
                    }
                    break;
                case 11:
                    if(this.activityClassMain.selected){
                        // str +=` and e.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input3){
                            str +=` and f.studentName like '%${this.input3}%'`
                        }
                    }else{
                        if(this.selection4.selected){
                            str +=` and a.status = '${this.selection4.selected}'`
                        }
                        if(this.selection5.selected){
                            str +=` and a.payStatus = '${this.selection5.selected}'`
                        }
                        if(this.input3){
                            str +=` and f.studentName like '%${this.input3}%'`
                        }
                    }
                    break;
                case 12:
                    if(this.schoolName.selected){
                        str +=` and schoolName = '${this.schoolName.selected}'`
                    }
                    if(this.gradeName.selected){
                        str +=` and gradeName = '${this.gradeName.selected}'`
                    }
                    if(this.classNumber.selected){
                        str +=` and classNumber = '${this.classNumber.selected}'`
                    }
                    if(this.input3){
                        str +=` and studentName like '%${this.input3}%'`
                    }
                    break;
                case 13:
                    if(this.activityClassMain.selected){
                        str +=` and a.activityClassMainId = '${this.activityClassMain.selected}'`
                        if(this.input){
                            str +=` and a.classCode like '%${this.input}%'`
                        }
                    }else{
                        if(this.input){
                            str +=` and a.classCode like '%${this.input}%'`
                        }
                    }
                    break;   
                case 14:
                    if(this.schoolName.selected){
                        str +=` and a.schoolName = '${this.schoolName.selected}'`
                    }
                    if(this.gradeName.selected){
                        str +=` and a.gradeName = '${this.gradeName.selected}'`
                    }
                    if(this.classNumber.selected){
                        str +=` and a.classNumber = '${this.classNumber.selected}'`
                    }
                    if(this.input3){
                        str +=` and a.studentName like '%${this.input3}%'`
                    }
                    break;
                case 15:
                    if(this.schoolName.selected){
                        str +=`schoolName = '${this.schoolName.selected}'`
                    }
                    if(this.gradeName.selected){
                        str +=` and gradeName = '${this.gradeName.selected}'`
                    }
                    if(this.classNumber.selected){
                        str +=` and classNumber = '${this.classNumber.selected}'`
                    }
                    if(this.input3){
                        str +=` and studentName like '%${this.input3}%'`
                    }
                    break;
            }
            console.log(str);
            bus.$emit('getTarget');
            this.$emit("onselected",str)
        }
    },
};
</script>

<style scoped>
.el-form-item {
    margin-bottom: 10px;
}
</style>
