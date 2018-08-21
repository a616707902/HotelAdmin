layui.extend({
    request: '{/}../../../static/js/network/request',
    authtree: '{/}../../../lib/layui/lay/anthtree'
});
layui.use(['layer', 'request', 'jquery', 'form', 'authtree'], function () {
    var usertable = layui.data('user');
    var user = usertable.user;
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.render();
    $(function () {

        request.doGet("MenuOperation/getOperationMenuList", {username: user.username}, function (data) {

        });

    });

});