$(function() {
         var fileAllArr = []; //所有图片原始资源
         var scaleNum = 10; // 图片缩放倍数
         // 验证中文名字
         $('#username').blur(function () {
             if ($('#username').val().length === 0) {
                 layer.msg('姓名不能为空');
             } else if (!RegExpObj.Reg_Name.test($('#username').val())) {
                 layer.msg('输入内容格式有误,请修改')
                
             }
         });
         //  校验身份证号
         $('#idCard').blur(function () {
             // 账号的验证 手机号验证
             if ($('#idCard').val().length === 0) {
                 layer.msg('身份证号不能为空');
             } else if (!RegExpObj.Reg_IDCardNo.test($('#idCard').val())) {
                 layer.msg('输入内容格式有误，请修改');
             } else {
                 discriCard($(this).val())
             }
         });

         //  校验年龄 身高 体重
         $('#age').blur(function () {
             if (!RegExpObj.Reg_age.test($('#age').val())) {
                 layer.msg('输入内容格式有误，请修改')
             } else if ($('#age').val().length == 0) {
                 layer.msg('年龄不能为空');
             }
         });
         $('#high').blur(function () {
             if (!RegExpObj.Reg_Number.test($('#high').val())) {
                 layer.msg('输入内容格式有误，请修改')

             } else if ($('#high').val().length == 0) {
                 layer.msg('身高不能为空');
             }
         });
         $('#weight').blur(function () {
             if (!RegExpObj.Reg_Number.test($('#weight').val())) {

                 layer.msg('输入内容格式有误，请修改')
             } else if ($('#weight').val().length == 0) {
                 layer.msg('体重不能为空');
             }
         });
         //    验证电话号码
         $('#phone').blur(function () {
             if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
                 layer.msg('输入内容格式有误，请修改')
             }
             // else if ($('#phone').val().length == 0) {
             //     layer.msg('电话号码不能为空');
             // }
             // else if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
             //      layer.msg('输入内容格式有误，请修改')
             // }
         });
         //    验证常住城市
         $('#address').blur(function () {
             if ($('#address').val().length == 0) {
                 layer.msg('城市不能为空');
             } else if (!RegExpObj.Reg_address.test($('#address').val())) {
                 layer.msg('输入内容格式有误，请修改')
             }
         });
         // 验证初步诊断不能为空
         $('#createCase_textDiagnose').blur(function () {
             if ($('#createCase_textDiagnose').val().length == 0) {
                 layer.msg('初步诊断不能为空');
             }
         });
         // 验证会、转诊目的不能为空
         $('#createCase_textGola').blur(function () {
             if ($('#createCase_textGola').val().length == 0) {
                 layer.msg('会/转诊目的不能为空');
             }
         });

          // 输入身份证号自动计算年龄 性别 idCard
          function discriCard(UUserCard) {
              var unit = '岁'; // 单位
              var num = 0; // 值
              if (UUserCard.length == 18) {
                  //获取出生日期
                  var userYear = UUserCard.substring(6, 10);
                  var userMonth = UUserCard.substring(10, 12);
                  var userDay = UUserCard.substring(12, 14);
                  //获取性别
                  if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                      $('#man').addClass('active').siblings('a').removeClass('active');
                  } else {
                      $('#woman').addClass('active').siblings('a').removeClass('active');
                      //是女则执行代码 ...
                  }
              } else {
                  var userYear = 19 + UUserCard.substring(6, 8);
                  var userMonth = UUserCard.substring(8, 10);
                  var userDay = UUserCard.substring(10, 12);
                  //获取性别
                  if (parseInt(UUserCard.substring(14, 15)) % 2 == 1) {
                      console.log($('.sex > a').html())
                      $('#man').addClass('active').siblings('a').removeClass('active');
                  } else {
                      $('#woman').addClass('active').siblings('a').removeClass('active');
                      //是女则执行代码 ...
                  }
              }
              // 计算年月日
              var myDate = new Date();
              var year = myDate.getFullYear(); // 当前年份
              var month = myDate.getMonth() + 1; // 当前月份
              var day = myDate.getDate(); // 当前号数
              if (year - userYear > 0) {
                  num = year - userYear;
                  unit = '岁';
              } else if (month - userMonth > 0) {
                  num = month - userMonth;
                  unit = '月';
              } else if (day - userDay >= 0) {
                  num = day - userDay;
                  unit = '天';
              } else {
                  layer.msg('输入内容格式有误，请修改');
              }
              $('#age').val(num);
              $('.choiceAge').val(unit);
          }
    // 创建病历左侧列表
    $.ajax({
        type: 'GET',
        url: IP + 'caseType/findList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function(data) {
            // console.log(data);
            if (data.status == 200) {
                var _html = '<li class="oneLevelItem patientInfo active">\
                    <p class="oneLevelName">患者基本信息</p>\
                </li>\
                <li class="oneLevelItem caseHistory">\
                    <p class="oneLevelName">电子病历附件</p>\
                    <ul class="twoLevelUl">';
                $.each(data.listList, function(key, val) {
                    _html += '<li class="twoLevelItem">\
                                <p class="twoLevelName">' + key + '</p>\
                                <ul class="threeLevelUl">';
                    for (var i = 0; i < val.length; i++) {
                        _html += '<li class="threeLevelItem" name="' + val[i].id + '">' + val[i].name + '</li>'
                    }
                    _html += '</ul>\
                            </li>'
                })
                _html += '</ul>\
            </li>'
                $('.oneLevelUl').html(_html);
                $('.oneLevelItem').eq(0).addClass('active').find('.twoLevelUl').show().find('.twoLevelItem').eq(0).addClass('active').find('.tthreeLevelUl').slideDown();
                // $('.oneLevelUl').find('.threeLevelItem').eq(0).addClass('active');
                $('.oneLevelUl').css({
                    'width': '145px',
                    'position': 'fixed',
                });
                // $('.twoLevelUl').css({
                //     'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
                // });


                var upfileHtml = '';
                $.each(data.listList, function(key, val) {
                    for (var i = 0; i < val.length; i++) {
                        upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                            <div class="upfileContent">\
                                <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
                                <ul class="fileContent clearfix">\
                                    <li class="fileAdd">\
                                        <a class="addfileBtn" href="javascript:;"></a>\
                                        <input class="fileInput" type="file">\
                                        <p class="fileName">添加文件</p>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>'
                    }
                })
                $('.upfileUl').html(upfileHtml);
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html'
            }
        },
        error: function(err) {
            console.log(err)
        },
    });

    if (JSON.parse(sessionStorage.getItem('data'))) {
        var data = JSON.parse(sessionStorage.getItem('data'));
        sessionStorage.removeItem('data');
        $('#username').val(data.orderFormBean.name)
        $('#idCard').val(data.orderFormBean.idCard)
        $('#phone').val(data.orderFormBean.phone)
        $('#address').val(data.orderFormBean.address)
        var choiceAge = data.orderFormBean.age;
        $('#age').val(choiceAge.substr(0, choiceAge.length - 1));
        $('.choiceAge').val(choiceAge.substr(-1, 1));
        $('#high').val(data.orderFormBean.high);
        $('#weight').val(data.orderFormBean.weight);
        $('.fileCount').html(data.patientCaseList.length); // 图片总张数
        if (data.orderFormBean.sex == '男') {
            $('.sex > a').removeClass('active').eq(0).addClass('active');
        } else {
            $('.sex > a').removeClass('active').eq(1).addClass('active');
        }    
        $('.urgent > a').removeClass('active').eq(data.orderFormBean.isurgent).addClass('active');
        $('#createCase_textDiagnose').val(data.orderFormBean.diagnosis); //初步诊断
        $('#createCase_textGola').val(data.orderFormBean.telemedicineTarget); //会诊目的
              // 男女选择
              $('.sex > a').click(function () {
                  $(this).addClass('active').siblings('a').removeClass('active');
              });
              // 加急选择
              $('.urgent > a').click(function () {
                  $(this).addClass('active').siblings('a').removeClass('active');
              });
/* 电子病历附件 */
var tempArr = data.patientCaseList;
for (var i = 0; i < tempArr.length; i++) {
    var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
    var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
    fileAllArr.push(fileName);
    if (fileType == 'png' || fileType == 'jpg') {
        if (tempArr[i].remarks == '') {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;' + imgIp + tempArr[i].filesUrl + '&apos;)"></div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
        } else {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;' + imgIp + tempArr[i].filesUrl + '&apos;)"></div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
        }
    } else if (fileType == 'pdf') {
        if (tempArr[i].remarks == '') {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
        } else {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
        }
    } else if (fileType == 'dcm') {
        if (tempArr[i].remarks == '') {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
        } else {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
        }
    }
    $('.sum').html(fileAllArr.length);
    $(".fileContent").sortable({
        items: "li:not(.fileAdd)"
    });
}
    }


    $(window).scroll(function() {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 300 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        }
    });

    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function() {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        $('.hospitalTel').html($(this).attr('phone'));
        $('.imgPric').attr('imgPric', $(this).attr('imgPric')).html($(this).attr('imgPric'));
        $('.videoPric').attr('videoPric', $(this).attr('videoPric')).html($(this).attr('videoPric'));
    })
    // 一级科室切换
    $('.hospitalUl').delegate('.sectionItem', 'click', function() {
        if ($(this).find('.deptUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    })
    // 二级科室切换
    $('.hospitalUl').delegate('.deptUl', 'click', function() {
        return false;
    });
    $('.hospitalUl').delegate('.deptItem', 'click', function() {
        $('.hospitalUl').find('.deptItem').removeClass('active');
        $(this).addClass('active');
        deptIdGetDoctors($(this).attr('name'));
        return false;
    });

       /*  //textarea 标签随着文本的高度实现自适应 */
       $('.text-adaption').each(function () {
           this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
       }).on('input', function () {
           this.style.height = 'auto';
           this.style.height = (this.scrollHeight) + 'px';
       });



    $(window).scroll(function() {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        // if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 300 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // } else {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // }
    });

    function scrollTo(x) {
        console.log(x)
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

    // 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function() {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
         scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    })
    // 病历信息二级按钮
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function() {
        if ($(this).find('.threeLevelUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.twoLevelItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.twoLevelItem').removeClass('active');
        }
        $(this).find('.threeLevelUl').stop(true, true).slideToggle();
        $(this).siblings('.twoLevelItem').find('.threeLevelUl').stop(true, true).slideUp();
        return false;
    })
    // 病历信息三级按钮
    $('.oneLevelUl').delegate('.threeLevelUl', 'click', function() {
        return false;
    });
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function() {
        $('.oneLevelUl').find('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        scrollTo($('#' + $(this).attr('name')).offset().top);
        return false;
    });



    /*创建病例板块 */

    $(".select label").click(function() {
        $(this).siblings("span").addClass("active");
        $(this).parent().siblings("div").find("span").removeClass("active");
    });

    $(".expedited_btn label").click(function() {
        $(this).siblings("span").addClass("active");
        $(this).parent().siblings("div").find("span").removeClass("active");
    });

  


   //点击添加 添加病历图片
   var selectFileArr = []; // 某一块的图片展示数据
   $('.upfileUl').delegate('.fileInput', 'change', function () {
       // 某一块添加时获取到当前块的展示数据
       var caseTypeId = $(this).parents('.upfileItem').attr('id');
       var caseTypeName = $(this).parents('.upfileItem').attr('name');

       var objParent = $(this).parents('.fileContent');
       var uploadFile = $(this)[0].files; // 某一块添加时的原始数据
       var _html = '';
       var fileLength = 0;
       var reader = new FileReader();
       reader.readAsDataURL(uploadFile[fileLength]);

       reader.onload = function (e) {
           if (e.target.result) {
               if (fileAllArr.indexOf(uploadFile[fileLength].name) == -1) {
                   // 未查找到
                   var type = uploadFile[fileLength].type;
                   var name = uploadFile[fileLength].name;
                   var sort = fileAllArr.length;
                   var fb = new FormData();
                   fb.append('file', uploadFile[fileLength]);
                   fb.append('patientId', data.orderFormBean.patientId); // 患者id
                   fb.append('patientName', data.orderFormBean.name);
                   fb.append('sort', sort);
                   fb.append('caseTypeId', caseTypeId);
                   fb.append('caseTypeName', caseTypeName);
                      if (!/[png|jpg |pdf|dcm]$/gi.test(name)) {
                          layer.msg('请上传png/jpg/pdf/dcm类型的文件');
                          return false;
                      }
                   $.ajax({
                       type: 'POST',
                       url: IP + 'order/addCaseFile',
                       dataType: 'json',
                       data: fb,
                       processData: false,
                       contentType: false,
                       xhrFields: {
                           withCredentials: true
                       },
                       crossDomain: true,
                       success: function (data) {
                           console.log(data)
                           if (data.status == 200) {
                               fileAllArr.push(name);
                               // 成功操作
                               if (/[png|jpg]$/gi.test(name)) {
                                   objParent.append(
                                       `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                          <div style='background-image:url(${imgIp+data.patientCaseUrl});'></div>\
                                          <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="img" desc="" class="fileName">${name}</p></li>`
                                   );
                               } else if (/[pdf]$/gi.test(name)) {
                                   // console.log('是pdf类型')
                                   objParent.append(
                                       `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(/yilaiyiwang/images/pdf_icon.png);'></div>\
                                                        <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="pdf" desc="" class="fileName">${name}</p></li>`
                                   );
                               } else if (/[dcm]$/gi.test(name)) {
                                   objParent.append(
                                       `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(/yilaiyiwang/images/dcm_icon.png);'></div>\
                                                        <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="dcm" desc="" class="fileName">${name}</p></li>`
                                   );
                               } else {
                                   layer.msg('请上传png/jpg/pdf/dcm类型的文件');
                               }
                               $('.sum').html(Number($('.sum').html()) + 1);
                           } else if (data.status == 250) {
                               window.location = '/yilaiyiwang/login/login.html';
                           } else {
                               // 其他操作
                           }
                       },
                       error: function (err) {
                           console.log(err);
                       },
                   })
               };
               fileLength++;
               if (fileLength < uploadFile.length) {
                   reader.readAsDataURL(uploadFile[fileLength]);
               } else {
                   // 拖拽排序
                   $(".fileContent").sortable({
                       items: "li:not(.fileAdd)"
                   });
               }
           }
       };
   });

    // 删除文件
    $('.upfileUl').delegate('.delFileBtn', 'click', function () {
        for (var i = 0; i < fileAllArr.length; i++) {
            if ($(this).siblings('.fileName').html() == fileAllArr[i].name) {
                fileAllArr.splice(i, 1);
            }
        }
        for (var i = 0; i < selectFileArr.length; i++) {
            if ($(this).siblings('.fileName').html() == selectFileArr[i].name) {
                selectFileArr.splice(i, 1);
            }
        }
        $(this).parent('.fileItem').remove();
        // $(this).parents('.upfileContent').find('.fileCount').html($(this).parents('.fileContent').find('.fileItem').length);
        // 总张数
        $('.sum').html(fileAllArr.length);
        return false;
    })

    // 图片点击查看大图
      objParent = null; // 当前点击块的父级
      fileArr = []; // 当前点击块的文件数据
      indexFile = 0; // 当前点击的索引
      ObjArr = []; //  当前点击块的文件对象
    $('.upfileUl').delegate('.fileItem', 'click', function () {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: $('.bigImgContainer'),
        });
        // 整理一组图片展示数据
        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index() - 1;
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (var i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                 'id': ObjArr.eq(i).attr('id'),
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
                'filePath': ObjArr.eq(i).attr('filepath'),
            });
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                $('.downlodeFile').hide();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

        /* 如果是png/jpg/pdf格式 downlodeFile 隐藏 */
        if (fileArr[indexFile].type == 'dcm') {
            $('.downlodeFile').show();
        } else {
            $('.downlodeFile').hide();

        }

    });




    // 备注保存
    $('.descText').blur(function () {
        fileArr[indexFile].desc = $('.descText').val();
    });
    // 上一个
    $('.switchBox .prev').click(function () {
        if (indexFile <= 0) {
            indexFile = 0;
        } else {
            indexFile--;
        }
        if (fileArr[indexFile].type != 'img') {
              // pdf dcm
              $('.bigImgContainer').find('.bigImg').addClass('bgSize');
              if (fileArr[indexFile].type == 'pdf') {
                  // pdf 相关操作
                  // 1、往 .bigImg 渲染pdf
                  PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                      page: "1"
                  });
              } else {
                  // dcm 相关操作
                  // 1、显示下载按钮
                  // 2、imgIp + fileArr[indexFile].filePath 下载路径
                  // 3、清空 .bigImg 的内容，显示背景
                   $('.downlodeFile').show();
                   $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                   $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
              }
        } else {
             // 图片的相关操作
             $('.downlodeFile').hide();
             $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
       
    });
    // 下一个
     $('.switchBox .next').click(function () {
         if (indexFile >= fileArr.length - 1) {
             indexFile = fileArr.length - 1;
         } else {
             indexFile++;
         }
         if (fileArr[indexFile].type != 'img') {
             $('.bigImgContainer').find('.bigImg').addClass('bgSize');
             if (fileArr[indexFile].type == 'pdf') {
                 PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                     page: "1"
                 });
             } else {
                 // dcm 相关操作
                 // 1、显示下载按钮
                 // 2、imgIp + fileArr[indexFile].filePath 下载路径
                 // 3、清空 .bigImg 的内容，显示背景
                 $('.downlodeFile').show();
                 $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                 $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
             }
         } else {
             $('.downlodeFile').hide();
             $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
         }
         $('.bigImgContainer').find('.bigImg').css({
             "top": 0,
             "left": 0,
             "transform": "scale(1)",
         })
         scaleNum = 10;
         $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
         $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
         $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
     
     });
    // 关闭
     // 关闭
     $('.closeBtn').click(function () {
         layer.closeAll();
         $('.bigImgContainer').hide();
         var _html = '<li class="fileAdd">\
            <a class="addfileBtn" href="javascript:;"></a>\
            <input class="fileInput" type="file" multiple>\
            <p class="fileName">添加文件</p>\
        </li>';
         for (var i = 0; i < fileArr.length; i++) {
             _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
             if (fileArr[i].type != 'img') {
                 _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
             } else {
                 _html += `<div style='background-image:${fileArr[i].src};'></div>`
             }
             _html += `<img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>`;
             if (fileArr[i].desc == '') {
                 _html += '<p type="' + fileArr[i].type + '" desc="" class="fileName">' + fileArr[i].name + '</p>';
             } else {
                 _html += '<p type="' + fileArr[i].type + '" desc="' + fileArr[i].desc + '" class="fileName active">' + fileArr[i].name + '</p>';
             }
             _html += '</li>'
         }
         objParent.html(_html);
         selectFileArr = [];
         objParent = null; // 当前点击块的父级
         fileArr = []; // 当前点击块的文件数据
         indexFile = 0; // 当前点击的索引
         ObjArr = []; //  当前点击块的文件对象
     });

  // 图片缩放 拖拽
  $('.bigImgBox').on("mousewheel DOMMouseScroll", function (e) {
      if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
          var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
              (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
          if (delta > 0) {
              // 向上滚
              if (scaleNum <= 50) {
                  scaleNum += 2
              }
          } else if (delta < 0) {
              // 向下滚
              if (scaleNum > 4) {
                  scaleNum -= 2
              }
          }
          $('.bigImg').css('transform', 'scale(' + scaleNum / 10 + ')')
      }
  });
  $('.bigImgBox').on('mousedown', function (e) {
      if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
          var x = e.clientX - parseInt($('.bigImg').css('left'));
          var y = e.clientY - parseInt($('.bigImg').css('top'));
          $('.bigImgBox').on('mousemove', function (e) {
              var newX = e.clientX;
              var newY = e.clientY;
              console.log(newY - y)
              $('.bigImg').css({
                  'top': newY - y + 'px',
                  'left': newX - x + 'px',
              });
          });
      }
  });
  $('.bigImgBox').on('mouseup', function (e) {
      $('.bigImgBox').unbind('mousemove');
  })
  $('.bigImgBox').on('mouseleave', function () {
      $('.bigImgBox').unbind('mousemove');
  });

  // 图片缩放 拖拽 结束

  /* 取消按钮 */
      $('.cancel').click(function () {
          window.history.go(-1);
      })
    /* 保存修改按钮 */
    $('.save').click(function() {
         /* 判断信息是否填写完整 */
         if ($('#username').val() == '' || $('#idCard').val() == '' || $('#phone').val() == '' || $('#address').val() == '' || $('#age').val() + $('.choiceAge').val() == '' || $('#high').val() == '' || $('#weight').val() == '' || $('.sex > a.active').html() == '' || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '' || fileAllArr.length <= '0') {
             var _$ = layui.jquery;
             layer.open({
                 type: 1,
                 title: '',
                 area: ['300px', '80px'],
                 closeBtn: false,
                 shade: [0.1, '#000000'],
                 shadeClose: false,
                 time: 2000,
                 content: _$('.incomplete'),
             });
             setTimeout(function () {
                 $('.incomplete').hide();

             }, 2000);
         } else if (!RegExpObj.Reg_Name.test($('#username').val()) || !RegExpObj.Reg_IDCardNo.test($('#idCard').val()) || !RegExpObj.Reg_age.test($('#age').val()) || !RegExpObj.Reg_Number.test($('#high').val()) || !RegExpObj.Reg_Number.test($('#weight').val()) || !RegExpObj.Reg_mobilePhone.test($('#phone').val()) || !RegExpObj.Reg_address.test($('#address').val()) || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '') {
             var _$ = layui.jquery;
             layer.open({
                 type: 1,
                 title: '',
                 area: ['300px', '80px'],
                 closeBtn: false,
                 shade: [0.1, '#000000'],
                 shadeClose: false,
                 time: 2000,
                 content: _$('.modifier'),
             });
             setTimeout(function () {
                 $('.modifier').hide();

             }, 2000);

         }else{
              var amend = new FormData();
        amend.append('orderId', data.orderFormBean.id);
        amend.append('name', $('#username').val());
        amend.append('idCard', $('#idCard').val());
        amend.append('phone', $('#phone').val());
        amend.append('address', $('#address').val());
        amend.append('age', $('#age').val() + $('.choiceAge').val());
        amend.append('high', $('#high').val());
        amend.append('weight', $('#weight').val());
        amend.append('sex', $('.sex > a.active').html());
        amend.append('isUrgent', $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
        amend.append('diagnosis', $('#createCase_textDiagnose').val()); //初步诊断
        amend.append('telemedicineTarget', $('#createCase_textGola').val()); //会诊目的
        // 图片描述和类型
        var descArr = $('.upfileUl > li.upfileItem');
        var detailArr = [];
        var JSONStr = '{';
         var sortStr = "{";
        for (var i = 0; i < descArr.length; i++) {
            var fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (var j = 0; j < fileLi.length; j++) {
                JSONStr += '"' + fileLi.eq(j).find("p.fileName").html() + '":{detail:"' + fileLi.eq(j).find("p.fileName").attr("desc") + '",typeId:"' + descArr.eq(i).attr("id") + '",typeName:"' + descArr.eq(i).attr("name") + '"},'
                  sortStr += '"' + fileLi.eq(j).attr("id") + '":{"sort":"' + (j + 1) * (i + 1) + '","remarks":"' + fileLi.eq(j).find("p.fileName").attr("desc") + '"},'
            }
        }
        JSONStr += '}';
        sortStr += '}';
         amend.append('fileIdAndSort', sortStr); // 文件排序顺序
        amend.append('detailMap', JSONStr);
            $.ajax({
                type: 'POST',
                url: IP + 'order/applyManagerUpdateOrder',
                dataType: 'json',
                data: amend,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    console.log(data)
                    if (data.status == 200) {
                        sessionStorage.setItem('orderId', JSON.stringify(data.orderId));
                        window.location = '/yilaiyiwang/workbench/manageAudit.html';
                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else {
                        // 其他操作
                    }
                },
                error: function(err) {
                    console.log(err);
                },
            })
         }
       

    })

  



})
