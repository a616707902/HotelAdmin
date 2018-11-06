layui.extend({
    request: '{/}../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editGoodsStyle(data, id);
        } else {
            addGoodsStyle(data);
        }

        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ( "edit" == op) {

            getGoodsStyleDetail(id,op)
        }
    });


    function editGoodsStyle(data, id) {
        request.doPut("/admin/goods_category/" + id + "/", {
            is_active: data.field.is_active=='1'?true:false,
            category_name: data.field.category_name,
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

    function addGoodsStyle(data) {
        request.doPost("/admin/goods_category/", {
            is_active: data.field.is_active=='1'?true:false,
            category_name: data.field.category_name,

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

    function getGoodsStyleDetail(id,op) {
        request.doGet("/admin/goods_category/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            form.render();
        })
    }
})