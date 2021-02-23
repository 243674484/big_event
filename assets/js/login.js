$(function () {
    $("#link_login").on('click', function () {
        $(".login-box").show(); //显示登录盒子
        $(".register-box").hide(); //隐藏注册盒子
        $("#form_login").get(0).reset(); //切换时重置表单
    })
    $("#link_register").on('click', function () {
        $(".register-box").show(); //注册盒子显示
        $(".login-box").hide(); //登录盒子隐藏
        $("#form_reg").get(0).reset(); //切换时重置表单
    })
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 注册表单验证两次输入密码是否一致规则
        repwd: function (value) {
            // 根据属性锁定元素，获取元素值，[]是属性选择器
            const pwd = $(".register-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码输入不一致！"
            }
        }
    })
    // 监听注册按钮的提交事件
    $("#form_reg").on("submit", function (e) {
        // 阻止刷新行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: "/api/reguser",
            type: "POST",
            data: {
                username: $(".register-box [name=username]").val(),
                password: $(".register-box [name=password]").val()
            },
            success(res) {
                if (res.status !== 0) {
                    // layer弹出层提示框
                    return layer.msg(res.message);
                }
                layer.msg("注册成功,请登录！");
                // 注册成功后模拟点击切换链接，实现自动跳转到登录页面
                $("#link_login").click()
            }
        })
    })
    // 监听登录按钮的提交事件
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            type: "POST",
            //serialize()：快速获取表单数据
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    // layer弹出层提示框
                    return layer.msg(res.message)
                }
                layer.msg("登录成功！")
                // 将token存入网页localStorage中
                localStorage.setItem("token", res.token)
                // 跳转链接
                location.href = "/index.html"
            }
        })
    })
})