$(function () {
    let form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            // 获取旧密码
            const oldpwd = $(".layui-card [name=oldPwd]").val();
            const newpwd = $(".layui-card [name=newPwd]").val();
            if (oldpwd === newpwd) {
                return "新密码与旧密码一致！"
            }
            if (value !== newpwd) {
                return "两次密码输入不一致"
            }
        }
    })
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出提示框，提示密码修改成功，返回login.html重新登录
                layer.msg("密码修改成功，请重新登录！")
                // 重置表单
                // $('.layui-form')[0].reset()
                localStorage.removeItem("token")
                // 跳转至login页面
                // 添加定时器，延迟页面跳转，使用户可以看到layer的提示框
                setTimeout(function () {
                    // 不能直接location.href = "/login.html"
                    // 会在iferm中返回login.html页面
                    // 当前页面的父页面，即index.html跳转到login.html
                    window.parent.location.href = "/login.html"
                }, 1000)
            }
        })
    })

})