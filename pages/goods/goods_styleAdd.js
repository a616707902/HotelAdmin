layui.extend({
    request: '{/}../../../static/js/network/request',
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
            editRoomStyle(data, id);
        } else {
            addRoomStyle(data);
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


        getHotelSelect(hotel);
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getRoomStyleDetail(id)
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
        var htmlselect="";
        request.doGet(url, {}, function (response) {

            if (data!=null&&data.length>0){
                for (var i=0;i<data.length;i++){
                    htmlselect+="<option value=\""+data[i].id+"\">"+data[i].name+"</option>";
                }
            }
            $('#hotel-select').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    function editRoomStyle(data, id) {
        request.doPut("/admin/room_style/" + id + "/", {
            price: data.field.price,
            is_active: data.field.is_active=='1'?true:false,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: [
                "string"
            ]
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

    function addRoomStyle(data) {
        request.doPost("/admin/room_style/", {
            price: data.field.price,
            hotel: data.field.hotel,
            is_active: data.field.is_active=='1'?true:false,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: [
                "string"
            ]
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

    function getRoomStyleDetail(id) {
        request.doGet("/admin/room_style/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                $('#demo2').append('<img src="' + images[i] + '" alt="房间参考照片" class="layui-upload-img">')
            }
        })
    }
})