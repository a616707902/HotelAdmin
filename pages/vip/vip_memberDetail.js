layui.extend({
    request: '{/}../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '1';
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getVipMemberDetail(id, op)

    });

    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return false;
    });

    function getVipMemberDetail(id, op) {
        request.doGet("/admin/vip_member/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var consumer_id=response.consumer_id
            request.doGet("/admin/consumer/" + consumer_id + "/", {}, function (response) {
                $.each(response, function (key, value) {
                    $('#' + key).val(value);
                });
                $("input[name=is_distribution]").each(function(){
                    if($(this).val()==response.is_distribution){
                        $(this).attr('checked',true);
                    }
                });
                form.render();
            })

        })
    }
})