// 自动拼接url地址
// ajaxPrefillter是ajax发起请求之前先调用的函数
// 在ajax发起请求之前，将url的路径完整拼接
$.ajaxPrefilter(function (option) {
    option.url = "http://ajax.frontend.itheima.net" + option.url
    // option.url = "http://api-breakingnews-web.itheima.net" + option.url
    // 判断url路径中是否包含/my/路径，包含时需要验证请求头  
    if (option.url.includes("/my/")) {
        option.headers = {
            // localStorage.getItem("token") =>localStorage.token
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 给全部的ajax请求全部挂载身份核验函数，判断用户是否登录
    // complete回调函数，无论是否成功都会执行
    // 强制用户登录，未登录状态不允许进入后台系统
    option.complete = function (res) {
        // 判断res的responseJSON中的值
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清除token
            localStorage.removeItem("token")
            // 强制跳转
            location.href = "/login.html"
        }
    }


})