$(function () {
    initCateInfo();
    // 获取文章类别数据列表
    function initCateInfo() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 通过模板引擎获取数据，第一个参数是模板引擎的id，第二个参数是数据源
                const htmlStr = template("tpl-table", res)
                // 将获取到的数据添加进入tbody中，获取到的是一个html结构的字符串
                $("tbody").html(htmlStr)
            }
        })
    }
    // 声明变量，用来放置弹出层index
    let layerAdd = null

    // 监听添加分类按钮，弹出添加文字分类功能表单
    $("#btnAddCate").on("click", function () {
        // 将弹出层的返回值：index，传给layerAdd，以便后面添加类别成功后关闭弹出层
        layerAdd = layer.open({
            type: "1",
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html()
        })
    })
    // 事件代理的方式，监听表单提交事件（绑定的时候，表单并不存在）
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("添加成功！")
                // 重新渲染列表，获取最新文字列表
                initCateInfo();
                // 关闭弹出层
                layer.close(layerAdd);
            }
        })
    })
    // 声明变量，准备存放 修改分类的弹出层index值
    let layerEdit = null;
    let form = layui.form
    // 事件委托，为产生的弹出层中的按钮添加点击事件
    $("tbody").on("click", ".btn-edit", function () {
        layerEdit = layer.open({
            type: "1",
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        })
        // $(this).attr(key); 获取节点属性名的值
        // 即获取data-id中的值
        let id = $(this).attr("data-id");
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 向form-edit表单中填充数据
                // 使用form.val方法必须在form表单中添加lay-filter属性
                // form.val的第一个参数是lay-filter的属性值，第二个参数是数据源
                form.val("form-edit", res.data)
            }
        })
    })
    // 监听提交修改文章类别，事件委托
    // 为修改文章类别的弹出层表单添加提交事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("修改文字分类成功！")
                // 获取文章分类列表
                initCateInfo();
                // 关闭遮罩层
                layer.close(layerEdit);
            }
        })
    })
    // 监听删除事件
    $("tbody").on("click", ".btn-delete", function () {
        // 获取点击的删除按钮对应的id
        let id = $(this).attr("data-id");
        // layui中的组件，删除目标的弹出框
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 获取文章分类列表
                    initCateInfo();
                }
            })
            // 关闭弹出层
            layer.close(index);
        });
    })

})