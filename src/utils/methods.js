    //pageSize
    const generalData = {
        getPageSize(val) {
            this.page.pageSize = val;
        },
        //currentPage
        getCurrentPage(val) {
            this.page.currentPage = val;
        },
        //查询分页信息
        getPageInfo(table) {
        let p = {};
        p.sql = "";
        p.everyPage = this.page.pageSize;
        p.currentPage = this.page.currentPage;
        p.whereStr = "where isDeleted = 0";
        p.orderStr = "order by createTime desc";
        //console.log(p);  
        this.api.getPageInfo(table, p)
            .then(result => {
            console.log(result);
            this.count = result.data.totalCount;
            this.getListByPage(table);
            })
            .catch(error => {
            console.log(error);
            });
        },

        //查询分页记录
        getListByPage(table) {
        let p = {};
        p.sql = "";
        p.everyPage = this.page.pageSize;
        p.currentPage = this.page.currentPage;
        p.whereStr = "where isDeleted = 0";
        p.orderStr = "order by createTime desc";
        //console.log(p);  
        this.api.getDataByPage(table, p)
            .then(result => {
            console.log(result);
                this.articleList = result.data;

            })
            .catch(error => {
            console.log(error);
            });
        },
        //修改
        modify(id) {
            this.id = id;
            this.show = true;
            this.title = "修改";
        },
        //添加
        add() {
            this.show = true;
            this.title = "添加";
        },
        //关闭弹窗
        handCancel() {
            this.id = '';
            this.show = false;
            this.title = '';
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
            p.sql = `update ${table} set isDeleted = 1 where id = '${id}'`;
            this.api.exec(table, p)
            .then(res => {
                this.$message({
                type: 'success',
                message: '删除成功!',
                });
                this.getPageInfo();
            }).catch(err => {
                console.log(err)
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除'
            });
        });
        },
        //选择一个项目
        selectOne(selection, row) {
            console.log(selection);
            this.selection = selection
        },
        //全选
        selectAll(selection) {
            console.log(selection);
            this.selection = selection
        },
        //更改审核状态
        changeStatus(status,table) {
            console.log(this.selection);
            if (this.selection.length < 1) {
                this.$message({
                type: 'info',
                message: '请先选择'
                });
                return;
            } else {
                for (let item of this.selection) {
                    let p = {};
                    p.sql = `update ${table} set status='${status}' where id='${item.id}'`;
                    this.api.exec(table, p)
                    .then(res => {
                        for (const aitem of this.articleList) {
                            if (item.id == aitem.id) {
                            console.log(aitem);
                            this.$set(aitem, "status", status);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
                this.$message({
                    type: 'success',
                    message: '操作成功!',
                });
            }
        },
    }