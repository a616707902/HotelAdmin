layui.extend({
    request: '{/}../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel='1';
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
    upload.render({
        elem: '#test2'
        , url: '/upload/'
        , multiple: true
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo2').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
            });
        }
        , done: function (res) {
            //上传完毕
        }
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getGoodsStyleDetail(id)
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

    function getGoodsStyleDetail(id) {
        request.doGet("/admin/goods_category/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                $('#demo2').append('<img src="' + images[i] + '" alt="商品类型参考照片" class="layui-upload-img">')
            }
        })
    }
})