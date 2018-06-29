$(function() {

    var data = new FormData();
    var dataTwo = new FormData();

    //上传医师资格证，记录文件名添加到span里
    upload.onchange = function() {
        // console.log(upload.files)
        olf.innerHTML = upload.files[0].name;
        data.append("credentialsImage", upload.files[0]);

    },
    //上传签名，记录文件名添加到span里
    uploadTwo.onchange = function() {
        uhs.innerHTML = uploadTwo.files[0].name;
        dataTwo.append("signatureImage", uploadTwo.files[0]);

    }
    var oldTelephone = '';
    var oldBeGoodAt = '';
    var newTelephone = '';
    var newBeGoodAt = '';
    /* 获取个人中心信息 */
    $.ajax({
        type: 'POST',
        url: IP + 'user/getSelfDetail',
        dataType: 'json',
        data: {},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                oldTelephone = data.telephone;
                oldBeGoodAt = data.beGoodAt;
                newTelephone = data.telephone;
                newBeGoodAt = data.beGoodAt;
                $('.name').val(data.name);
                $('.userName').val(data.userName);
                $('.rolesName').val(data.rolesName);
                $('.occupationName').val(data.occupationName);
                $('.specialistTypeName').val(data.specialistTypeName);
                $('.hospitalName').val(data.hospitalName);
                $('.deptName').val(data.deptName);
                $('.medicalFees').val(data.medicalFees);
                $('.telephone').val(data.telephone);
                $('.medicalFeesVideo').val(data.medicalFeesVideo);
                $('.text-adaption').val(data.beGoodAt);
                var caseTypeList = data.caseTypeList;
                //  $('#olf').html(data.credentialsImage.substr(data.credentialsImage.lastIndexOf('/'), data.credentialsImage.length));
                //  $('#uhs').html(data.signatureImage.substr(data.signatureImage.lastIndexOf('/'), data.signatureImage.length));
                var _html = '';
                console.log(caseTypeList)

                $.each(data.caseTypeList, function(key, val) {
                    _html += ' <div class="catalogue clearfix">\
                             <p>' + val.name + '</p>';
                    // if (val.userChange == 1) {
                    //     _html += ' <div class="checkAll" caseTypeName="' + key + '" name="' + val.caseTypeList[0].parent.id + '">全选\</div>'
                    // } else {
                    //     _html += '<div class="checkAll CheckBg" caseTypeName="' + key + '" name="' + val.caseTypeList[0].parent.id + '">全选\</div>'
                    // }
                    for (var i = 0; i < val.caseTypeList.length; i++) {
                        if (val.caseTypeList[i].userChange == '1') {
                            _html += ' <div type="" class="checkSingle" name="' + val.caseTypeList[i].id + '">' + val.caseTypeList[i].name + '\ </div>'
                        } else {
                            _html += ' <div type="" class="checkSingle CheckBg" name="' + val.caseTypeList[i].id + '">' + val.caseTypeList[i].name + '\ </div>'
                        }
                    }
                    _html += '</div>'

                });
                $('.enroll_three').append(_html);
                if (data.credentialsImage != '') {
                  $('#olf').html('signatureImage.jpg')
                } else {
                    $('#olf').html('')
                }
                 if (data.signatureImage !='') {
                    $('#uhs').html('credentialsImage.jpg')
                } else {
                    $('#uhs').html('')
                }
                


            } else if (data.status == 250) {
                layer.msg("未登录！");
                location.href = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
            }
        },
        error: function(err) {
            console.log(err);

        },
    });

    $('.telephone').blur(function () {
        newTelephone = $(this).val();
    });
    $('#textAdaotion').blur(function () {
        newBeGoodAt = $(this).val();
    });

    
    /* 点击修改按钮修改个人密码 */
    $('.center_affBtn').click(function() {
        if (!RegExpObj.Reg_PassWord.test($('.newPassword').val())) {
            layer.msg('密码格式不正确',{time:3000});
            
        }else if($('.newPassword').val()== ''){
             layer.msg('密码不能为空',{time:3000});
        } else if ($('.newPassword').val() != $('.center_three_input_three').val()) {
            layer.msg('两次密码输入不一致',{time:3000});
        }else{
              $('.newPassword').val();
        /* 修改个人密码 */
        $.ajax({
            type: 'POST',
            url: IP + 'user/updateSelfPassword',
            dataType: 'json',
            data: {
                "oldPassword": $('.oldPassword').val(),
                "newPassword": $('.newPassword').val(),
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                // console.log(data)
                if (data.status == 200) {
                    layer.msg("修改密码成功",{time:3000});
                    setTimeout(function() {
                location.href = '/yilaiyiwang/login/login.html';
                    }, 3000);

                } else if (data.status == 212) {
                    layer.msg("原密码有误");
                } else {
                    layer.msg("修改密码失败");
                }
            },
            error: function(err) {
                console.log(err);

            },
        });
        }
      
    });

    /* 点击上传按钮上传医生职业资格证 */

    $('.upload_btn').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + 'user/uploadSelfCredentials',
            dataType: 'json',
            data: data,
            processData: false, //不处理发送的数据，因为data值是FormData对象，不需要对数据做处理
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                // console.log(data)
                if (data.status == 200) {
                    layer.msg("上传医生职业资格证成功！")
                     $('.upload_btn').attr('disabled', 'true');
                     $('.upload_btn').css({
                         color: " #999",
                         background: " #dbdbdb"
                     })
                     $('#upload').attr('disabled', 'true');
                } else if (data.status == 250) {

                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);

            },
        });
    });

    /* 点击上传按钮上传签名 */
    $('.uploadTwo_btn').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + 'user/uploadSelfSignature',
            dataType: 'json',
            data: dataTwo,
            processData: false, //不处理发送的数据，因为data值是FormData对象，不需要对数据做处理
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                // console.log(data)
                if (data.status == 200) {
                    layer.msg("上传签名成功！");
                    $('.uploadTwo_btn').attr('disabled', 'true');
                    $('.uploadTwo_btn').css({
                        color: " #999",
                        background: " #dbdbdb"
                    })
                     $('#uploadTwo').attr('disabled', 'true');
                } else if (data.status == 250) {

                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);

            },
        });
    });


    /* 添加个人病历要求 */

    // 单个按钮
    $(".enroll_three").on('click', '.checkSingle', function() {
        if ($(this).attr('type') == '') {
            if ($(this).hasClass('CheckBg')) {
                $(this).attr('type', '1').addClass('operate').toggleClass('CheckBg');
            } else {
                $(this).attr('type', '0').addClass('operate').toggleClass('CheckBg');
            }
        } else if ($(this).attr('type') == '0') {
            $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
        } else if ($(this).attr('type') == '1') {
            $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
        }
        if($('.operate').length > 0){
            $('.center_lastBtn').addClass('active');
             $('.center_lastBtn').css('cursor', 'pointer');
        }else {
            $('.center_lastBtn').removeClass('active');
              $('.center_lastBtn').css('cursor', 'default');
        }
    });

    $('.telephone, #textAdaotion').blur(function () {
        if (oldTelephone != newTelephone || oldBeGoodAt != newBeGoodAt || $('.operate').length > 0) {
            $('.center_lastBtn').addClass('active');
                   $('.center_lastBtn').css('cursor', 'pointer');
        }else {
            $('.center_lastBtn').removeClass('active');
            $('.center_lastBtn').css('cursor', 'default');
        }
    });
    /* 更改个人信息-电话和擅长 */
    $('.center_lastBtn').click(function() {
        // 修改信息判断
        if (oldTelephone != newTelephone || oldBeGoodAt != newBeGoodAt || $('.operate').length > 0) {
            var caseTypeList = [];
            for (var i = 0; i < $('.operate').length; i++) {
                caseTypeList.push({
                    "caseTypeId": $('.operate').eq(i).attr('name'),
                    "caseTypeName": $('.operate').eq(i).html(),
                    "types": $('.operate').eq(i).attr('type')
                });
            }
            $.ajax({
                type: 'POST',
                url: IP + 'user/updateSelfDetail',
                dataType: 'json',
                data: {
                    "telephone": $('.telephone').val(),
                    "beGoodAt": $('.text-adaption').val(),
                    "caseTypeList": JSON.stringify(caseTypeList)
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if (data.status == 200) {
                       /* 暂存操作成功操作 */   
                           var _$ = layui.jquery;
                           layer.open({
                               type: 1,
                               title: false,
                               closeBtn: 0,
                               area: '340px',
                               skin: 'layui-layer-nobg', //没有背景色
                               // shadeClose: false,
                               shade: 0,
                               time: 2000,
                               content: _$('.storage')
                           });
                           $('.center_lastBtn').attr('disabled', 'true');
                           $('.center_lastBtn').css({
                               color: " #999",
                               background: " #dbdbdb",
                            //    cursor: "default"
                           });
                           setTimeout(() => {
                                location.reload();
                           }, 1100);
                          
                    } else if (data.status == 250) {
                        window.location = '/yilaiyiwang/login/login.html'
                    } else {
                       var _$ = layui.jquery;
                              layer.open({
                                  type: 1,
                                  title: false,
                                  closeBtn: 0,
                                  area: '340px',
                                  skin: 'layui-layer-nobg', //没有背景色
                                  // shadeClose: false,
                                  shade: 0,
                                  time: 2000,
                                  content: _$('.storage')
                              });
                              $('.storage').children('span').html('暂存失败');
                               $('.storage').children('img').attr('src','/yilaiyiwang/images/lose_img.png');
                    }
                },
                error: function(err) {
                    console.log(err);
                },
            });
        }
    });

   /*  //textarea 标签随着文本的高度实现自适应 */
   $('.text-adaption').each(function () {
       this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
   }).on('input', function () {
       this.style.height = 'auto';
       this.style.height = (this.scrollHeight) + 'px';
   });


});
