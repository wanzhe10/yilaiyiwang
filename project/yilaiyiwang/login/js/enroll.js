$(function () {
    var Name = $('.userName'); // 账号（手机号）
    var passWord = $('.passWord'); // 密码
    var passwords = $('.passwords'); // 确认密码
    var hospitalId = ''; // 医院id
    var managerHospitalDeptId = '';
    var oneDeptId = '';
   
      var dataTwo = new FormData();
      var photo1 = [];
      var photo2 = [];

    // //输入框添加事件
    // //账号
    Name.blur(function () {
        if (!RegExpObj.Reg_mobilePhone.test(Name.val())) {
            $('.tip1').html('*用户名不正确');

        } else {
            $('.tip1').html('');

        }
    }).focus(function () {
        $('.tip1').html('');
    });
    // // //密码
    passWord.blur(function () {
        if ($(this).val() == '') {
            $('.tip2').html('不能为空!');
        } else if (!RegExpObj.Reg_PassWord.test($(this).val())) {
             $('.tip2').html('密码格式错误!');
        }else{
            $('.tip2').html('');
        }
    }).focus(function () {
         $('.tip2').html('*8-16个字符，必须包含英文(不分大小写)、数字、下划线中至少两种');
    });
    // // //确认密码
    passwords.blur(function () {
        if (passWord.val() != passwords.val()) {
            // alert(passWord.val());
            $('.tip3').html('*两次密码输入不一致！');
        } else {
            $('.tip3').html('');
        }
    }).focus(function () {
        $('.tip3').html('');
    });;





  

    
    // 获取权限类型
    $.ajax({
        type: 'GET',
        url: IP + '/roles/getEntityList',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            if (data.status == 200) {
                var tempArr = [];
                tempArr = data.rolesBeanList;
                var _html = '<option value="">请选择权限类型</option>';
                for (var i = 0; i < tempArr.length; i++) {
                    _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].remarks + '</option>'
                }
                $('.quiz2').html(_html);
                _html = "";
            }
        }
    });
    // 获取职称列表
    $.ajax({
        type: 'GET',
        url: IP + 'occupation/selectOccupationList',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                var tempArr = [];
                tempArr = data.occupationList;
                var _html = ' <option value="">请选择职称</option>';
                for (var i = 0; i < tempArr.length; i++) {
                    _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].name + '</option>';
                }
                $('.quiz5').html(_html);
            }
        }
    });

    // 获取当前医院的科室列表
    $('.quiz1').change(function () {
        if ($(this).val() != '') {
            hospitalId = $(this).val();
            getDeptList($(this).val());
            getSpecialistType($(this).val())
        } else {
            $('.quiz3').html('<option value="">请选择科室</option>');
            $('.quiz4').html('<option value="">请选择专家类型</option>');
        }
    })
    var Hospital = [];
    // 获取医院列表
    $.ajax({
        type: 'GET',
        url: IP + 'hospital/findHospitalListNotManagerDept',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                Hospital = data.hospitalList;
                hospitalId = Hospital[0].id;
                var _html = '<option value="">请选择医院</option>';
                for (var i = 0; i < Hospital.length; i++) {
                    _html += '<option value="' + Hospital[i].id + '">' + Hospital[i].name + '</option>';
                }
                $('.quiz1').html(_html);
            } else { }
        },
        error: function (err) {
            console.log(err)
        },

    });

    // 获取科室列表
    // var arr='';
    function getDeptList(hospitalId) {
        $.ajax({
            // hospitalId 选择的医院ID
            type: 'POST',
            url: IP + 'hospitalDept/selectAllDeptList',
            dataType: 'json',
            async: false,
            data: {
                "hospitalId": hospitalId,
            },
            success: function (data) {
                console.log(data);
                if (data.status == 200) {
                    var hospital_office = data.hospitalDeptsList;
                    var _html = '<option value="">请选择科室</option>';
                    for (var i = 0; i < hospital_office.length; i++) {
                        if (hospital_office[i].deptName == '远程医学中心') {
                            managerHospitalDeptId = hospital_office[i].hospitalDeptId;
                            // console.log(managerHospitalDeptId)
                            // console.log($('.managerHospitalDeptId').attr('value', managerHospitalDeptId))
                        }
                        _html += '<option value="' + hospital_office[i].hospitalDeptId + '">' + hospital_office[i].deptName + '</option>';
                    }
                    $('.quiz3').html(_html);
                    _html = '';
                }
            }
        });
    }

    // 获取专家类型列表 getSpecialistType
    function getSpecialistType(hospitalId) {
        $.ajax({
            type: 'POST',
            url: IP + '/specialistType/selectSpecialistTypeList',
            dataType: 'json',
            data: {
                "hospitalId": hospitalId,
            },
            success: function (data) {
                console.log(data);
                if (data.status == 200) {
                    var tempArr = [];
                    tempArr = data.specialistTypeBeanList;
                    var _html = ' <option value="">请选择专家类型</option>';
                    for (var i = 0; i < tempArr.length; i++) {
                        _html += ' <option money="' + tempArr[i].money + '" moneyVideo="' + tempArr[i].moneyVideo + '" value="' + tempArr[i].id + '">' + tempArr[i].name + '</option>'
                    }
                    $('.quiz4').html(_html);
                    _html = "";
                }
            }
        });
    }


    // 专家类型切换 修改 诊费
    $('.quiz4').change(function () {
        $('.money').val($(this).find('option:selected').attr('money'));
        $('.moneyVideo').val($(this).find('option:selected').attr('moneyVideo'));
    });


    /* 获取一级病历类型及二级病历类型 */
    $.ajax({
        type: 'GET',
        url: IP + 'caseType/findList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {

                // var listList = data.listList;
                var _html = '';
                $.each(data.listList, function (key, val) {
                    _html += ' <div class="catalogue clearfix">\
                             <p>' + key + '</p>\
                              <div class="checkAll" caseTypeName="'+key+'" name="' + val[0].parent.id + '">全选\</div>'
                    for (var i = 0; i < val.length; i++) {
                        _html += ' <div class="checkSingle" name="' + val[i].id + '">' + val[i].name + '\ </div>'
                    }
                    _html += '</div>'

                });
                $('.enroll_three').append(_html);

            } else if (data.status == 250) {
                // 未登录操作
            } else {
                // 其他操作
            }
        },
        error: function (err) {
            console.log(err);

        },
    });
    // 全选按钮
    $(".enroll_three").on('click', '.checkAll', function () {
        if ($(this).hasClass('CheckBg')) {
            $(this).removeClass('CheckBg').siblings(".checkSingle").removeClass('CheckBg');
        } else {
            $(this).addClass('CheckBg').siblings(".checkSingle").addClass('CheckBg');
        }
    });
    // 单个按钮
    $(".enroll_three").on('click', '.checkSingle', function () {
        if ($(this).hasClass('CheckBg')) {
            $(this).removeClass('CheckBg').siblings('.checkAll').removeClass('CheckBg');
        } else {
            $(this).addClass('CheckBg');
            if ($(this).siblings('.checkSingle.CheckBg').length == $(this).parent('.catalogue').find('.checkSingle').length - 1) {
                $(this).siblings('.checkAll').addClass('CheckBg')
            }
        }
    });


    //上传医师资格证，记录文件名添加到span里
    upload.onchange = function () {
        olf.innerHTML = upload.files[0].name;
        photo1.push(upload.files[0]);
    }
    var signatureImg = new FormData();
    //上传签名，记录文件名添加到span里
    uploadTwo.onchange = function () {
        uhs.innerHTML = uploadTwo.files[0].name;
          photo2.push(uploadTwo.files[0]);
    }

      /*  //textarea 标签随着文本的高度实现自适应 */
      $('.text-adaption').each(function () {
          this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
      }).on('input', function () {
          this.style.height = 'auto';
          this.style.height = (this.scrollHeight) + 'px';
      });
    

    // 注册事件
    $('.enroll_button').click(function () {
         var data = new FormData();
            if (!RegExpObj.Reg_mobilePhone.test(Name.val())) {
                layer.msg('请检查用户名');
            } else if (!RegExpObj.Reg_PassWord.test(passWord.val())) {
                 layer.msg('请检查密码');
            } else if (passWord.val() != passwords.val()) {
                 layer.msg('请检查确认密码');
            } else if (!RegExpObj.Reg_Name.test($('.name').val())) {
                layer.msg('请检查姓名');
            } else if (!RegExpObj.Reg_isPhone.test($('.phone').val())) {
                layer.msg('请检查手机号');
            } else if ($('.quiz2').val() == '') {
                layer.msg('请选择权限类型');
            } else if ($('.quiz1').val() == '') {
                layer.msg('请选择医院');
            } else if ($('.quiz3').val() == '') {
                layer.msg('请选择科室');
            } else if ($('.quiz5').val() == '') {
                layer.msg('请选择职称');
            } else if ($('.quiz4').val() == '') {
                layer.msg('请选择专家类型');
            } else {

            //禁用注册按钮
                $(".enroll_button").attr({ "disabled": "disabled" });
           var caseTypeListArr = [];
           for (var i = 0; i < $('.checkSingle.CheckBg').length; i++) {
               caseTypeListArr.push({
                   "caseTypeId": $('.checkSingle.CheckBg').eq(i).attr('name'),
                   "caseTypeName": $('.checkSingle.CheckBg').eq(i).html(),
               });
           }
          
           data.append("name", $('.name').val());
           data.append("userName", $('.userName').val());
           data.append("password", $('.passWord').val());
           data.append("telephone", $('.phone').val());
           data.append("rolesId", $('.quiz2').val());
           data.append("hospitalDeptId", $('.quiz3').val());
           data.append("occupationId", $('.quiz5').val());
           data.append("specialistTypeId", $('.quiz4').val());
           data.append("beGoodAt", $("#textAdaotion").val());
           data.append("caseTypeListStr", JSON.stringify(caseTypeListArr));
           data.append('signatureImg',photo1[0]);
           data.append("credentialsImg", photo2[0]);
           data.append("managerHospitalDeptId", managerHospitalDeptId);


            $.ajax({

                type: 'POST',
                url: IP + 'user/signIn',
                dataType: 'json',
                data: data,
                processData: false, //不处理发送的数据，因为data值是FormData对象，不需要对数据做处理
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    // console.log(data)
                    if (data.status == 200) {
                        // $('.zcWin').css('display','block');
                         var _$ = layui.jquery;
                       layer.open({
                           type: 1,
                           title: '',
                           closeBtn: false,
                           area: ['820px', '450px'],
                           content: _$('.zcWin'),
                           time:3000,
                       });
                       
                       setTimeout(function() {
                            location.href = '/yilaiyiwang/login/login.html'
                       }, 3000);
                    
                    } else if (data.status == 209) {
                       layer.msg('信息不完整',{time:3000});
                    //   启用注册按钮
                        $(".enroll_button").removeAttr("disabled"); //将按钮可用
                    } else if (data.status == 210) {
                        layer.msg('该用户名已被占用',{time:3000});
                        //   启用注册按钮
                        $(".enroll_button").removeAttr("disabled"); //将按钮可用
                    } else {
                        // 其他操作
                        layer.msg('注册失败',{time:3000});
                        $(".enroll_button").removeAttr("disabled"); //将按钮可用
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });
        }
    });
    





});
