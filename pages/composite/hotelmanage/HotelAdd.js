layui.extend({
    request: '{/}../../../static/js/network/request',
});
layui.use(['layer','request','jquery','form'],function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;

    form.on('submit(address)', function (data) {
        //发异步，把数据提交给php

        request.doPost("/admin/hotel/get_lat_long/", {
           address:$('#hoteladdress').val()
        }, function (data) {
            $('.layui-hide').removeClass('layui-hide');
        });
        return false;
    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php

        request.doPost("/admin/hotel/", {
            latitude: data.field.latitude,
            hotel_profile: data.field.hotel_profile,
            name: data.field.hotelname,
            longitude: data.field.longitude,
            address:data.field.hoteladdress
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
        return false;
    });
})