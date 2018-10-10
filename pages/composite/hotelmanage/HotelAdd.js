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
    var demoListView = $('#layer-photos-demo')
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
    var uploadData = null;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        uploadData = data;
        if (getJsonLength(Instfiles) > 0) {
            uploadInst.upload();
        } else if (getJsonLength(files) > 0) {
            uploadListIns.upload();
        } else {
            loadData();
        }


        return false;
    });

    function loadData() {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" === op) {
            editHotel(uploadData, id);
        } else {
            addHotel(uploadData);
        }

    }

    var Instfiles;
    var uploadInst = upload.render({
        elem: '#test2'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , field: 'image'
        , multiple: true
        , headers: {"Authorization": layui.data('token').token}
        , auto: false
        // ,bindAction: '#add'
        , choose: function (obj) {
            //预读本地文件示例，不支持ie8
            Instfiles = obj.pushFile()
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //上传完毕
            console.log(res);
            $('#cover_images').val(res.image);
            if (getJsonLength(files) > 0) {
                uploadListIns.upload();
            } else {
                loadData();
            }


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
                $("#address_div").addClass("layui-hide");
                getHotalDetail(id);
            } else {
                getAllTag(id);
            }

        } else {
            getAllTag(id);
        }
    });
    var files;
    var uploadListIns = upload.render({
        elem: '#testList'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , accept: 'file'
        , field: 'image'
        , headers: {"Authorization": layui.data('token').token}
        , multiple: true
        , auto: false
        //  , bindAction: '#add'
        , choose: function (obj) {
            files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {

                var tr = $([' <div class="layui-upload-list ">\n' +
                '<span class="con_img" >' +
                '                    <img id="image_' + index + '" style="width: 200px;height: 200px" layer-src=' + file + ' src=' + result + ' class="layui-upload-img image_path" >\n' +
                '<span id="upload_' + index + '" class="ms layui-hide"style="color: rgb(248,253,253);text-align: center;">上传成功</span></span>' +
                '                    <span ><button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>' +
                '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                '</span>\n' +
                '                </div>'
                ].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    //tr.find('.uploadSucceed').removeAttr("imgpath");
                });

                demoListView.append(tr);
                // layer.photos({
                //     photos: '#layer-photos-demo'
                //     ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                //     ,full:true
                // });
            });
        }, before: function (obj) { //obj参数包含的信息，跟choose回调完全一致
            layer.load(); //上传loading

        }
        , done: function (res, index, upload) {
            layer.closeAll('loading');
            if (res.id > 0) { //上传成功
                var span = demoListView.find('#upload_' + index);
                // ,tds = tr.children();
                span.removeClass('layui-hide');
                var img = demoListView.find('#image_' + index);
                img.attr("imageUrl", res.image);
                // tds.eq(3).html(''); //清空操作
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        }
        , error: function (index, upload) {
            var tr = demoListView.find('tr#upload-' + index)
                , tds = tr.children();
            // tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(2).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
        , allDone: function (obj) { //当文件全部被提交后，才触发
            console.log(obj.total); //得到总文件数
            console.log(obj.successful); //请求成功的文件数
            console.log(obj.aborted); //请求失败的文件数
            if (obj.total == obj.successful) {
                loadData();
            } else {
                layer.msg("有文件未上传成功，请重新上传", {icon: 5});
            }

        }
    });

    function editHotel(data, id) {
        request.doPatch("/admin/hotel/" + id + "/", {
            province: $('#province option:selected').text(),
            city: $('#city option:selected').text(),
            area: $('#area option:selected').text(),
            tel: $("#tel").val(),
            street: $("#street").val(),
            latitude: $("#latitude").val(),
            hotel_profile: $("#hotel_profile").val(),
            name: $("#name").val(),
            longitude: $("#longitude").val(),
            tags: getHotelTags(),
            images: getImages(),
            is_active: $("input[name='status']:checked").val() == '1' ? true : false,
            cover_images: $("#cover_images").val()
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
            tel: $("#tel").val(),
            street: $("#street").val(),
            latitude: $("#latitude").val(),
            hotel_profile: $("#hotel_profile").val(),
            name: $("#name").val(),
            longitude: $("#longitude").val(),
            tags: getHotelTags(),
            images: getImages(),
            is_active: $("input[name='status']:checked").val() == '1' ? true : false,
            cover_images: $("#cover_images").val()
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
                    html += " <input type=\"checkbox\" name=\"tags\" value='" + alltag[i].name + "' tagid=\" + alltag[i].id + \" title=\"" + alltag[i].name + "\">"
                }
                $("#tag_div").html(html);
                form.render();
            }
            if (id != undefined) {
                getHotalDetail(id);
            }

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
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                if ("detail" == op) {
                    var tr = $([' <div class="layui-upload-list ">\n' +
                    '<span class="con_img" >' +
                    '                    <img id="image_' + i + '" style="width: 300px;height: 300px" layer-src=' + images[i] + ' src=' + images[i] + ' class="layui-upload-img image_path" >\n' +
                    '</span>' +
                    '                    <span >' +
                    '</span>\n' +
                    '                </div>'
                    ].join(''));
                    demoListView.append(tr);
                } else if ("edit" == op) {
                    var tr = $([' <div class="layui-upload-list ">\n' +
                    '<span class="con_img" >' +
                    '                    <img id="image_' + i + '" style="width: 300px;height: 300px" layer-src=' + images[i] + ' src=' + images[i] + ' class="layui-upload-img image_path" >\n' +
                    '</span>' +
                    '                    <span >' +
                    '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                    '</span>\n' +
                    '                </div>'
                    ].join(''));
                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        tr.remove();
                        //tr.find('.uploadSucceed').removeAttr("imgpath");
                    });
                    demoListView.append(tr);
                }
            }
            if ("detail" === op) {
                if (tags != null) {
                    var html = "";
                    for (var i = 0; i < tags.length; i++) {
                        html += " <input type=\"checkbox\" name=\"tags\"  value='" + tags[i] + "' title=\"" + tags[i] + "\"  enabled=\"false\" checked=\"checked\">"
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

    var getImages = function () {
        var images = new Array();
        var spans = $(".image_path");
        for (var i = 0; i < spans.length; i++) {
            images.push($(spans[i]).attr("imageUrl"))
        }
        return images;
    }

    function getJsonLength(jsonData) {

        var jsonLength = 0;

        for (var item in jsonData) {

            jsonLength++;

        }
        return jsonLength;
    }
})