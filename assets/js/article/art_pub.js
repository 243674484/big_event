$(function () {
    let form = layui.form
    initCate()
    // 获取文章分类列表
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let HtmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(HtmlStr)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 裁剪图片部分
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击选择封面按钮，打开上传文件页面，模拟点击上传文件按钮
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click();
    })
    // 监听获取文件按钮的change事件
    $("#coverFile").on("change", function (e) {
        // 获取到文件列表数组
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 定义文章发布状态
    var art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $("#btnSave2").on('click', function () {
        art_state = '草稿'
    })
    // 监听发布文章表单提交事件
    $("#form_pub").on('submit', function (e) {
        e.preventDefault()
        // 基于 form 表单，快速创建一个 FormData 对象
        const fd = new FormData(this)
        // 将文章的发布状态，存到 FormData 对象中
        fd.append('state', art_state)
        // fd.forEach((k, v) => {
        //     console.log(k, v);
        // })
        // 将封面存入formdata中
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    // 发起ajax请求，提交文章数据
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})