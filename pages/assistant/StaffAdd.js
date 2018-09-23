layui.extend({
    request: '{/}../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '';
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
            editStaff(data, id);
        } else {
            addStaff(data);
        }

        return false;
    });

    $(function () {


        getHotelSelect(hotel);

    });

    /**
     * 获取当前账号下能管理的所有酒店
     * @param hotel
     */
    function getHotelSelect(hotel) {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        var url = "/admin/hotel/"
        if (hotel != null && hotel != '') {
            url = "/admin/hotel/" + hotel + "/";
        }
        var htmlselect = "";
        request.doGet(url, {}, function (data) {

            if (hotel != null && hotel != '') {
                htmlselect += "<option value=\"" + data.id + "\">" + data.name + "</option>";
            } else if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].name + "</option>";
                }
            }
            $('#belong_hotel').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
            if ("detail" == op || "edit" == op) {
                if ("detail" == op) {
                    $(".layui-form-item button").addClass("layui-hide");
                }
                getStaffCenterDetail(id)
            } else {
                $(".hide").removeClass("layui-hide");
            }
        });
    }

    function editStaff(data, id) {

        request.doPut("/admin/room_style/" + id + "/", {
            belong_hotel: data.field.hotel,
            username: data.field.username,
            user: data.field.user,
            sex: data.field.sex
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

    function addStaff(data) {
        if (Verification()) {
            layer.msg("两次输入的密码不一致", {icon: 5});
            return;
        }
        request.doPost("/admin/room_style/", {
            belong_hotel: data.field.hotel,
            username: data.field.username,
            password: data.field.password,
            user_name: data.field.user,
            sex: data.field.sex
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


    function getStaffCenterDetail(id) {
        var op = request.getQueryString("op");

        request.doGet("/admin/staff_center/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);

            });
            $("#belong_hotel option[value="+response.belong_hotel+"]").attr("selected", true);
            form.render("select");
            // $('#belong_hotel').attr("disabled", "disabled");
            if ("detail" == op) {
                $('input:radio[name=sex]').attr('checked',false);
                if (response.sex == 1) {
                    $('input:radio[name=sex]')[0].checked = true;
                } else {
                    $('input:radio[name=sex]')[1].checked = true;
                }
                // $('.layui-form-item input ').attr("disabled", "disabled");

            } else {

            }
            form.render();
        })
        return false;
    }

    var Verification = function () {
        var password = $("#password").val();
        var repassword = $("#repassword").val();
        if (password == undefined || password == "") {
            layer.msg("请输入密码", {icon: 5});
            return false;
        }
        if (password == undefined || password == "") {
            layer.msg("请输入确认密码", {icon: 5});
            return false;
        }
        return password == repassword;
    }


})