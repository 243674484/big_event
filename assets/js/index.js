$(function () {
    getUserInfo();
    // 点击退出系统按钮，询问用户是否退出系统
    $("#btnLogout").on("click", function () {
        // layui中的弹出层，弹出提示退出系统
        layer.confirm('是否退出系统?', {
            // 弹出层左侧的图标
            icon: 3,
            title: '提示'
            // 回调函数，即用户点击确定后执行的函数
        }, function (index) {
            // 用户确定退出后，清除localStorage中的token
            localStorage.removeItem("token")
            // 跳转至login页面
            location.href = "/login.html"
            // 默认清除，保留即可
            layer.close(index);
        });
    })
})
// 获取用户登录信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // ajax中的header验证在ajaxPrefilter中已经包含
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 渲染用户头像和用户名
            renderAvatar(res.data)
        },

    })
}

function renderAvatar(user) {
    // 判断登录用户是否有昵称，若没有昵称，则显示用户名
    const username = user.nickname || user.username
    // 将昵称或用户名渲染到页面中
    $("#welcome").html("欢迎 " + username)
    // 判断该账户是否有图片头像
    if (user.user_pic !== null) {
        // 如果有头像，将头像图片渲染到layui-nav-img容器中，并显示
        $(".layui-nav-img").attr("src", user.user_pic).show();
        // 将文字头像隐藏
        $(".text-avatar").hide()
    } else {
        // 账户没有图片头像
        // 隐藏图片头像容器
        $(".layui-nav-img").hide()
        // 获取用户名的首字母，并将其大写
        const firstName = username[0].toUpperCase();
        // 将大写后的首字母渲染到页面中并显示
        $(".text-avatar").html(firstName).show()
    }
}