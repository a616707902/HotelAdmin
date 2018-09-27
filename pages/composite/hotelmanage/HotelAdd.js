layui.extend({
    request: '{/}../../../static/js/network/request',
    address: '{/}../../../static/js/extends/address'
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload', 'address'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
    var address = layui.address;
    address.provinces('', '', '');

    form.on('submit(address)', function (data) {
        //发异步，把数据提交给php

        request.doPost("/admin/hotel/get_lat_long/", {
            address: $('#address').val()
        }, function (data) {
            $('.layui-hide').removeClass('layui-hide');
            $('#longitude').val(data.longitude);
            $('#latitude').val(data.latitude);
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
    var uploadInst = upload.render({
        elem: '#test2'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , field: 'image'
        , multiple: true
        , headers: {"Authorization": layui.data('token').token}
        // ,auto: false
        // ,bindAction: '#add'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //上传完毕
            console.log(res);
            $('#cover_images').val(res.image);

        }
        , error: function (res) {
            layer.msg(res, {icon: 5});
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("detail" === op || "edit" === op) {
            if ("detail" === op) {
                $(".layui-form-item button").addClass("layui-hide");
                getHotalDetail(id);
            } else {
                getAllTag(id);
            }

        }
    });

    function editHotel(data, id) {
        request.doPatch("/admin/hotel/" + id + "/", {
            province: $('#province option:selected').text(),
            city: $('#city option:selected').text(),
            area: $('#area option:selected').text(),
            tel: data.field.tel,
            street: data.field.street,
            latitude: data.field.latitude,
            hotel_profile: data.field.hotel_profile,
            name: data.field.name,
            longitude: data.field.longitude,
            // address: data.field.address,
            cover_images: data.field.cover_images
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
            province: $('#province option:selected').text(),
            city: $('#city option:selected').text(),
            area: $('#area option:selected').text(),
            tel: data.field.tel,
            street: data.field.street,
            latitude: data.field.latitude,
            hotel_profile: data.field.hotel_profile,
            name: data.field.name,
            longitude: data.field.longitude,
            // address: data.field.address,
            cover_images: data.field.cover_images
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

    function getAllTag(id) {
        request.doGet("/admin/tags/", {}, function (data) {
            var alltag = data.results;
            if (alltag != null) {
                var html = "";
                for (var i = 0; i < alltag.length; i++) {
                    html += " <input type=\"checkbox\" name=\"tags\" tagid=" + alltag[i].id + "title=\"" + alltag[i].name + "\">"
                }
                $("#tag_div").html(html);
                form.render();
            }
            getHotalDetail(id);
        });
    }

    function getHotelTags() {
        var tags = new Array();
        var checks = document.getElementsByName("tags")
        if (checks != null) {
            for (var i = 0; i < checks.length; i++) {
                if (checks[i].checked) {
                    tags.push(checks[i].value);
                }
            }
        }
        return tags;
    }

    function getHotalDetail(id) {
        var op = request.getQueryString("op");
        request.doGet("/admin/hotel/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            if ("detail" === op) {
                if (response.is_active) {
                    $("#radio1").attr("checked", "checked");
                    $("#radio2").attr("disabled", "disabled");
                } else {
                    $("#radio2").attr("checked", "checked");
                    $("#radio1").attr("disabled", "disabled");
                }
            }
            address.provinces(response.province, response.city, response.area);
            var images = response.cover_images;
            $('#demo1').attr('src', images); //图片链接（base64）
            var tags = response.tags;
            if ("detail" === op) {
                if (tags != null) {
                    var html = "";
                    for (var i = 0; i < tags.length; i++) {
                        html += " <input type=\"checkbox\" name=\"tags\"  title=\"" + tags[i] + "\" disabled=\"\">"
                    }
                    $("#tag_div").html(html);
                }
            } else {
                var checks = document.getElementsByName("tags")
                if (tags != null && checks != null) {
                    for (var i = 0; i < checks.length; i++) {
                        for (var j = 0; j < tags.length; j++) {
                            if (checks[i].value == tags[i]) {
                                checks[i].checked = true;
                            }

                        }

                    }
                    form.render();
                }


            }
        })
    }
})