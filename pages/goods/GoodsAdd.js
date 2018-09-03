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
            editGoods(data, id);
        } else {
            addGoods(data);
        }

        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getStyleSelect();
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getGoodsDetail(id)
        }
    });

    /**
     * 根据当前的酒店获取房间类型
     * @param hotel
     */
    function getStyleSelect() {
        var htmlselect = "";
        request.doGet("/admin/goods_category/", {
            search: ''
        }, function (data) {
            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    htmlselect += "<option value=\"" + data[i].id + "\">" + data[i].name + "</option>";
                }
            }
            $('#category_name').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    function editGoods(data, id) {
        request.doPut("/admin/goods/" + id + "/", {
            goods_price: data.field.goods_price,
            is_active: data.field.is_active=='1'?true:false,
            goods_name:data.field.goods_name
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

    function addGoods(data) {
        request.doPost("/admin/goods/", {
            goods_price: data.field.goods_price,
            is_active: data.field.is_active=='1'?true:false,
            goods_name:data.field.goods_name
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

    function getGoodsDetail(id) {
        request.doGet("//admin/goods/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
        });
    }
});