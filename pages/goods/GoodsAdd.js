layui.extend({
    request: '{/}../../static/js/network/request',
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
        getStyleSelect();
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getGoodsDetail(id,op);
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
            if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].category_name + "</option>";
                }
            }
            $('#category').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    function editGoods(data, id) {
        request.doPut("/admin/goods/" + id + "/", {
            category: data.field.category,
            is_integral: data.field.is_integral == '1' ? true : false,
            need_integral: data.field.need_integral,
            goods_price: data.field.goods_price,
            is_active: data.field.is_active == '1' ? true : false,
            goods_name: data.field.goods_name
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
            category: data.field.category,
            is_integral: data.field.is_integral == '1' ? true : false,
            need_integral: data.field.need_integral,
            goods_price: data.field.goods_price,
            is_active: data.field.is_active == '1' ? true : false,
            goods_name: data.field.goods_name
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

    function getGoodsDetail(id,op) {
        request.doGet("/admin/goods/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $('#category option:contains(' + response.category_name + ')').each(function(){
                if ($(this).text() == response.category_name) {
                    $(this).attr('selected', true);
                }
            });
            if ("detail" == op) {
                if (response.is_active) {
                    $("#radio1").attr("checked", "checked");
                    $("#radio2").attr("disabled", "disabled");
                } else {
                    $("#radio2").attr("checked", "checked");
                    $("#radio1").attr("disabled", "disabled");
                }
            }

            //$('#category').val('2');
            form.render('select'); //刷新select选择框渲染
        });
    }
});