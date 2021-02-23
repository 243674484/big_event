// 自动拼接url地址
// ajaxPrefillter是ajax发起请求之前先运行的函数
// 在ajax发起请求之前，将url的路径完整拼接
$.ajaxPrefilter(function (option) {
    option.url = "http://ajax.frontend.itheima.net" + option.url
    console.log(option.url);
})