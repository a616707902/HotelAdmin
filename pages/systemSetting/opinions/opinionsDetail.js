layui.extend({
    request: '{/}../../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getOpinionsDetail(id, op)

    });

    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return false;
    });

    function getOpinionsDetail(id, op) {
        request.doGet("/admin/opinions/" + id+ "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });


        })
    }
})