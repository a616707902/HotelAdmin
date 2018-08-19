layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
})
layui.use(['layer', 'jquery', 'request', 'element'], function () {
    var $ = layui.jquery;
    var element = layui.element;
    var requset = layui.request;

}