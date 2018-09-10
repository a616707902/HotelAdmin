layui.extend({
    request: '{/}../../../static/js/network/request',
    // address:'{/}../../../static/js/extends/address'
});
var defaults = {
    s1: 'province',
    s2: 'city',
    s3: 'area',
    v1: null,
    v2: null,
    v3: null
};
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
  //  var address = layui.address();

    form.on('submit(address)', function (data) {
        //发异步，把数据提交给php

        request.doPost("/admin/hotel/get_lat_long/", {
            address: $('#hoteladdress').val()
        }, function (data) {
            $('.layui-hide').removeClass('layui-hide');
        });
        return false;
    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" === op) {
            editHotel(data, id);
        } else {
            addHotel(data);
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
        if ("detail" === op || "edit" === op) {
            if ("detail" === op) {
                $(".layui-form-item button").addClass("layui-hide");

            }
            getHotalDetail(id)
        }
    });

    function editHotel(data, id) {
        request.doPatch("/admin/hotel/" + id + "/", {
            latitude: data.field.latitude,
            hotel_profile: data.field.hotel_profile,
            name: data.field.name,
            longitude: data.field.longitude,
            address: data.field.address
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

    function addHotel(data) {
        request.doPost("/admin/hotel/", {
            latitude: data.field.latitude,
            hotel_profile: data.field.hotel_profile,
            name: data.field.name,
            longitude: data.field.longitude,
            address: data.field.address
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

    function getHotalDetail(id) {
        request.doGet("/admin/hotel/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);

            });
            defaults.v1 = response.province;
            defaults.v2 = response.city;
            defaults.v3 = response.area;
            treeSelect(defaults);
            var images = response.cover_images;
            // for (var i = 0; i < images.length; i++) {
            $('#demo2').append('<img src="' + images + '" alt="酒店照片" class="layui-upload-img">')
            // }
        })
    }
})