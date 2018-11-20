layui.extend({
    request: '{/}../../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editTags(data, id);
        }else {
            addTags(data);
        }

        return false;
    });
    form.on('radio(is_integral)', function(data){
        // console.log(data.elem); //得到radio原始DOM对象
        // console.log(data.value); //被点击的radio的value值
        if (data.value==0){
            $('#need_div').addClass("layui-hide");
        }else{
            $('#need_div').removeClass("layui-hide");
        }
        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ( "edit" == op) {
            getTagsDetail(id);
        }

    });

    function addTags(data) {
        request.doPost("/admin/tags/", {
            name: data.field.name
        }, function (data) {
            layer.alert("增加成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
                layer.closeAll();
            });
        });
    }
    function editTags(data, id) {
        request.doPut("/admin/tags/" + id + "/", {
            name: data.field.name
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
    }


    function getTagsDetail(id) {
        request.doGet("/admin/tags/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });

        });
    }
});