layui.extend({
    request: '{/}../../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '1';
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
            editRoom(data, id);
        } else {
            addRoom(data);
        }

        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getHotelSelect(hotel);
        getStyleSelect(hotel);
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getRoomDetail(id)
        }
    });

    /**
     * 获取当前账号下能管理的所有酒店
     * @param hotel
     */
    function getHotelSelect(hotel) {
        var url = "/admin/hotel/"
        if (hotel != null || hotel != '') {
            url = "/admin/hotel/" + hotel + "/";
        }
        var htmlselect = "";
        request.doGet(url, {}, function (data) {
            if (hotel != null || hotel != '') {
                htmlselect += "<option value=\"" + data.id + "\" selected>" + data.name + "</option>";
            }else{
                if (data != null && data.results.length > 0) {
                    for (var i = 0; i < data.results.length; i++) {
                        htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].name + "</option>";
                    }
                }
            }

            $('#hotel_select').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    /**
     * 根据当前的酒店获取房间类型
     * @param hotel
     */
    function getStyleSelect(hotel) {
        var htmlselect = "";
        request.doGet("/admin/room_style/", {
            search: ''
        }, function (data) {
            if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].name + "</option>";
                }
            }
            $('#style_select').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    function editRoom(data, id) {
        request.doPatch("/admin/room/" + id + "/", {
            style_name: data.field.style_name,
            room_nums: data.field.room_nums

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

    function addRoom(data) {
        request.doPost("/admin/room/", {
            style_name: data.field.style_name,
            room_nums: data.field.room_nums
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

    function getRoomDetail(id) {
        request.doGet("/admin/room/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
        });
    }
});