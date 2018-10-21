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
            editNotice(data, id);
        } else {
            addNotice(data);
        }

        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("edit" == op) {
            getNoticeDetail(id);
        }

    });

    function addNotice(data) {
        request.doPost("/admin/notice/", {
            content: data.field.content,
            is_active: data.field.is_active == 1 ? true : false
        }, function (data) {
            layer.alert("增加成功", {
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

    function editNotice(data, id) {
        request.doPut("/admin/notice/" + id + "/", {
            content: data.field.content,
            is_active: data.field.is_active == 1 ? true : false
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


    function getNoticeDetail(id) {
        request.doGet("/admin/notice/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            form.render()
        });
    }
});