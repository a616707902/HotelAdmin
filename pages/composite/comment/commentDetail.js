layui.extend({
    request: '{/}../../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    $(function () {
        var id = request.getQueryString("id");
        getCommentDetail(id);

    });

    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
    form.on('submit(replyComment)', function (data) {
        var id = request.getQueryString("id");
      var lay_index=  layer.open({
            type: 1
            ,area: ['390px', '260px']
            ,title: '评论回复'
            ,content: " <textarea id=\"addNewReply\" style='height: 150px' name=\"addNewReply\" class=\"layui-textarea\"\n" +
            "                ></textarea>" //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
             ,btn: ['提交', '关闭'] //只是为了演示
            ,yes: function(){
                request.doPost("/admin/comment_replay/",{
                    comment: id,
                    reply_content: $("#addNewReply").val()
                },function (data) {
                  var indexalert= parent.layer.alert("回复成功", {
                        icon: 6
                    }, function () {
                        getCommentDetail(id);
                        // // 获得frame索引
                        // var index = parent.layer.getFrameIndex(window.name);
                        // //关闭当前frame
                        // parent.layer.close(index);
                        layer.close(lay_index);
                        parent.layer.close(indexalert);
                    });
                });
            }
            ,btn2: function(){
                layer.closeAll();
            }

            ,zIndex: layer.zIndex //重点1
            ,success: function(layero){
                layer.setTop(layero); //重点2
            }
        });
        return false;
    });
    form.on('select(comment_show)', function(data){
        console.log(data.value); //得到被选中的值
        if (data.value==10){
            $("#noshow_div").removeClass("layui-hide");
        }else{
            $("#noshow_div").addClass("layui-hide");
        }
    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");
        request.doPatch("/admin/comment_replay/" + id + "/", {
            no_show_reason:$("#no_show_reason").val() ,
            comment_show: $("#comment_show").val()
        }, function (data) {
            layer.alert("修改成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
        return false;
    });

    function getCommentDetail(id) {
        request.doGet("/admin/comment_replay/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            if (response.is_reply){
                $("#reply_div").removeClass("layui-hide");
                var comment_reply = response.comment_reply;
                if (comment_reply!=null){
                    $.each(comment_reply, function (key, value) {
                        $('#comment_reply_' + key).val(value);
                    });
                }
            }else{
                $("#reply_button").removeClass("layui-hide");
            }
        })
    }
})