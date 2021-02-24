$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 点击上传按钮模拟点击上传文件按钮
    $("#btnChooseImage").on('click', function () {
        $("#file").click()
    })
    // 监听上传文件按钮改变事件
    $("#file").on('change', function (e) {
        // 判断用户是否选择了文件
        const fileList = e.target.files
        if (fileList === 0) {
            return "请选择文件！"
        }
        // 获取用户选择的文件
        const file = fileList[0]
        // 将图片文件转化为url格式
        const imgUrl = URL.createObjectURL(file)
        // 将转化后的图片渲染到网页上
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 监听确定按钮点击事件，上传文件
    $("#btnUploadImage").on("click", function () {
        // 获取用户裁剪后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 发起ajax请求，上传头像到服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败!")
                }
                layer.msg("更换头像成功!")
                // 调用getUserInfo函数，重新渲染用户头像
                window.parent.getUserInfo();
            }
        })
    })
})