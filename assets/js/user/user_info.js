$(function () {
    let form = layui.form
    // 用户昵称正则规则，规定用户昵称字符不能超过6位
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须是1 ~ 6 位的字符"
            }
        }
    })
    // 获取用户数据，填充form表单
    initUserInfo()

    $("#btnReset").on("click", function (e) {
        e.preventDefault();
        // 点击重置后重新获取用户数据，填充表单，达到重置效果
        initUserInfo()
    })
    // 获取用户数据，填充form表单，发起ajax请求
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 为表单赋值，通过lay-filter属性，表单赋值根据name属性值匹配
                // val（）第一个参数是lay-filter的属性值，第二个参数是填充的数据源
                form.val("userInfo", res.data)
            }
        })
    }
    // 监听表单的提交行为，事件监听在表单上，不是在按钮上
    $(".layui-form").on("submit", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求，更新用户数据
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            // 通过serialize方法快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 更新成功后弹出提示框，提示更新成功
                layer.msg("用户信息更新成功！")
                // window指的是iframe区域的页面，parent是index.html
                window.parent.getUserInfo()
            }
        })
    })


})