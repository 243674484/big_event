$(function () {
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    let form = layui.form
    // 定义事件过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 获取文章列表
    initTable()
    // 定义获取文章列表的函数
    function initTable() {

        $.ajax({
            type: 'GET',
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                let htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                // 渲染分页区域
                readerPage(res.total)
            }
        })
    }

    // 初始化文章类别列表
    initCate()
    // 动态获取文章类别下拉菜单内容
    function initCate() {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎获取下拉菜单内容
                let htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 需要手动调用render方法，渲染下拉菜单，否则下拉菜单会渲染失败
                form.render();
            }
        })
    }
    // 监听筛选表单提交数据
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取类别的id
        let cate_id = $("[name=cate_id]").val()
        // 获取状态的id
        let state = $("[name=state]").val()
        // 将获取的id值传给q中对应的变量
        q.cate_id = cate_id
        q.state = state
        // 重新渲染文章页面
        initTable()
    })
    // 渲染分页的方法
    const laypage = layui.laypage

    function readerPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 设置分页部分显示的功能
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            // 设置每页展示多少条
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // 将获取到的页码赋值给q.pagenum，准备切换重新渲染页面
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 代理方式对删除按钮绑定事件
    $("tbody").on("click", ".btn-delete", function () {
        // 获取点击删除按钮的id
        let id = $(this).attr("data-id");
        // 获取删除按钮的个数
        let leng = $(".btn-delete").length;
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'GET',
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("删除成功！")
                    // 判断当页面没有文字列表时，页面是否为1，若不是1，将页码值减1后重新渲染
                    if (leng === 1 && q.pagenum !== 1) {
                        q.pagenum--
                    }

                    // 重新渲染文章列表
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})