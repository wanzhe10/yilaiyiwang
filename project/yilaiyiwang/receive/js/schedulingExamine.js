$(function() {
       var fileAllArr = []; //所有图片原始资源
       //   var fileArr = [];
       var scaleNum = 10; // 图片缩放倍数
    /* 动态创建进度条 */
    var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    var str = '';
    for (var i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);

    }
    $('.progressBar li:first-child').addClass('libg');




    /* 日历插件 */
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test-n1',
            position: 'static'
        });
    });
    var data = JSON.parse(sessionStorage.getItem('data'));
    // sessionStorage.removeItem('data');
    console.log(data);
     $('.patientName').html('***');
    $('.high').html(data.orderFormBean.high);
    $('.sex').html(data.orderFormBean.sex);
    $('.weight').html(data.orderFormBean.weight);
    $('.age').html(data.orderFormBean.age);
    $('.address').html(data.orderFormBean.address);
    if (data.orderFormBean.isurgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + data.orderFormBean.diagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + data.orderFormBean.telemedicineTarget);
    $('.money').html(data.orderFormBean.money);
    /* 会诊排期 */

    if (data.orderDoctorsList.length > 1) {
        $('.MDTBtn').show();
        $('.receive').hide();
    } else {
        $('.MDTBtn').hide();
        $('.receive').show();
    }
     //如果是图文会诊
     if (data.orderFormBean.orderTypes == '0') {
         $('.schedule').hide();
         $('.schedule_modules ').hide();
         // $('.entrance').hide();

     } else {
         $('.schedule').show();
         $('.schedule_modules ').show();
         // $('.entrance').show();
     }

    if (data.orderFormBean.orderTypes == 0) {
        $('.scheduleTitle').hide();
    }
    var orderDateList = data.orderDateList;
    var _dateHtml = '';
    for (var i = 0; i < orderDateList.length; i++) {
        if (orderDateList[i].types == 1) {
            _dateHtml += ' <p>\
              <span class="startDate">从&nbsp;&nbsp;' + orderDateList[i].startDate + '</span> 到&nbsp;&nbsp;\
            <span class="endDate">' + orderDateList[i].endDate + '</span>\
                            </p>'
        }
    }
    $('.schedule_modules').html(_dateHtml);

    var orderTypes = data.orderFormBean.orderTypes;
    // 左侧导航栏
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectOrderCaseType',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: {
            "orderId": data.orderFormBean.id,
        },
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var _html = '<li class="oneLevelItem patientInfo active">\
                         <p class="oneLevelName">患者基本信息</p>\
                     </li>\
                     <li class="oneLevelItem caseHistory">\
                         <p class="oneLevelName">电子病历附件</p>\
                         <ul class="twoLevelUl">';
                $.each(data.list, function(key, val) {
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
                if (orderTypes == 1) {
                    _html += '<li class="oneLevelItem patientInfo">\
         <p class="oneLevelName">会诊排期</p>\
     </li>'
                }
                _html += '<li class="oneLevelItem patientInfo">\
                    <p class="oneLevelName">订单信息</p>\
                </li>';
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
                $.each(data.list, function(key, val) {
                    for (var i = 0; i < val.length; i++) {
                        upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                                 <div class="upfileContent">\
                                     <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
                                     <ul class="fileContent clearfix">\
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

    // 左侧锚点定位
    $(window).scroll(function() {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
       
    });

    function scrollTo(x) {
        $('html, body').animate({
            scrollTop: x - 160,
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
   /* 电子病历附件 */
   var tempArr = data.patientCaseList;
   for (var i = 0; i < tempArr.length; i++) {
       var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
       var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
       fileAllArr.push(fileName);
       if (fileType == 'png' || fileType == 'jpg') {
           if (tempArr[i].remarks == '') {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"> </div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
           } else {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                        <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"> </div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
           }
       } else if (fileType == 'pdf') {
           if (tempArr[i].remarks == '') {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
           } else {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
           }
       } else if (fileType == 'dcm') {
           if (tempArr[i].remarks == '') {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
           } else {
               $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
           }
       }
       $('.sum').html(fileAllArr.length);

   }




   // 图片点击查看大图
   var objParent = null; // 当前点击块的父级
   var fileArr = []; // 当前点击块的文件数据
   var indexFile = 0; // 当前点击的索引
   var ObjArr = []; //  当前点击块的文件对象
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
       indexFile = $(this).index();
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
               $('.downlodeFile').hide();

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
         $('.downlodeFile').hide();            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

       }
       $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
       $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
       $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

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
               $('.downlodeFile').hide();

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
          $('.downlodeFile').hide();          $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');;
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


   })
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
               $('.downlodeFile').hide();

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
          $('.downlodeFile').hide();          $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
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
   $('.closeBtnImg').click(function () {
       layer.closeAll();
       $('.bigImgContainer').hide();
       var _html = '';
       for (var i = 0; i < fileArr.length; i++) {
           _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
           if (fileArr[i].type != 'img') {
               _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
           } else {
               _html += `<div style='background-image:${fileArr[i].src};'></div>`
           }
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
           })
       }
   })
   $('.bigImgBox').on('mouseup', function (e) {
       $('.bigImgBox').unbind('mousemove');
   })
   $('.bigImgBox').on('mouseleave', function () {
       $('.bigImgBox').unbind('mousemove');
   })
   // 图片缩放 拖拽 结束

    //订单编号
    $('.numbers').html(data.orderFormBean.numbers);
    //申请时间
    $('.applyDate').html(data.orderFormBean.applyDate);
    // 发件人信息
    $('.recipientsInfo').html(' <' + data.orderFormBean.doctorName + '/' + data.orderFormBean.doctorTitleName + '/' + data.orderFormBean.doctorDeptName + '/' + data.orderFormBean.doctorHospitalName + '>')

    // //   收件人信息
    var recipientsArr = data.orderDoctorsList;
    var _html = '';
    var doctorId = '';
    for (var i = 0; i < recipientsArr.length; i++) {
        if (recipientsArr[i].firstDoctor == 1) {
            _html = '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;' + _html;
            doctorId = recipientsArr[i].id;
        } else {
            _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
        }
    }
    $('.addresserInfo').html(_html)


    var deptNumber = '';
    $.ajax({
        type: 'POST',
        url: IP + 'user/selectDeptNumberWithUserId',
        dataType: 'json',
        data: {
            "userId": data.orderFormBean.doctorId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                deptNumber = data.deptNumber;
                // 成功操作
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
    /* 循环时间轴 orderStatesList*/
 var orderStatesList = data.orderStatesList;
 var _html = '';
 for (var i = 0; i < orderStatesList.length; i++) {
     _html += '<li class="layui-timeline-item">\
                                    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
                                    <div class="layui-timeline-content layui-text">\
                                        <h3 class="layui-timeline-title">\
                                            <span class="fw">' + orderStatesList[i].time + '</span>\
                                            <span class = "fw pl30" > ' + orderStatesList[i].statesName + ' </span>\
                                        </h3>'
     if (orderStatesList[i].statesName == '已结束') {
         _html += ''
     } else {
         _html += '<p>操作人：' + orderStatesList[i].remarks + '</p>\
                                    </div>\
                                </li>'
     }
 }
 $('.layui-timeline').html(_html);


    /* 返回按钮 */
    $('.getBack').click(function() {
        window.location = '/yilaiyiwang/morkbench/morkbench.html'
    });
    /* 拒收按钮弹层 */
    $('.rejection').click(function() {
        $('.background').css('display', 'block');
        $('.re_layer').css('display', 'block');
        document.documentElement.style.overflow = "hidden";
    });
    $('textarea').focus(function() {
        //  $('.font').css('display','none');
        $('.font').hide();
    }).blur(function() {
        if ($(this).val() == "") {
            $('.font').show();
        } else {
            $('.font').hide();
        }
    });
    $('.font').click(function() {
        $(this).hide();
        $('textarea').focus();
    })
    var viewText = '建议多学科会诊:';
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function() {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    })
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function() {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    })

    /* 弹层关闭按钮 */
    $('.refuseBtn').click(function() {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    })

    // 拒绝确定按钮
    $('.confirm').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveOrder',
            dataType: 'json',
            data: {
                "type": '1',
                "orderStateId": data.orderFormBean.statesId,
                "orderId": data.orderFormBean.id,
                "refuseReason": viewText + $('.refuseReason').val(),
                "type1": '2',
                "doctorId": doctorId,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 202) {
                    var $ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['500px', '200px'],
                        closeBtn: false,
                        shade: [0.7, '#000000'],
                        shadeClose: false,
                        content: $('.returned')
                    });
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 555) {
                    //  window.location = '/yilaiyiwang/workbench/workbench.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);

            },
        })
    })

    // MDT协调按钮     MDTBtn
    $('.MDTBtn').click(function () {
        window.location = '/yilaiyiwang/particulars/MTD.html';
    })

    //  接收按钮事件 receive
    $('.receive').click(function() {
        if (data.orderFormBean.orderTypes == 0) {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('.submitBox'),
            });
        } else {
            var $ = layui.jquery;
            layer.open({
                type: 1,
                content: $('.selectTimeContainer'),
                title: '',
                area: ['1060px', '680px'],
                closeBtn: 0,
                skin: 'noBackground',
            })
            var startMinute = 0; // 开始总分钟数
            var endMinute = 0; // 结束总分钟数
            var startHour = 0; // 开始小时数
            var endHour = 0; // 结束小时数
            var _html = '';
            for (var i = 0; i < 96; i++) {
                startMinute = i * 15;
                endMinute = (i + 1) * 15;
                startHour = parseInt(startMinute / 60);
                endHour = parseInt(endMinute / 60);
                var startM = startMinute %= 60; // 计算后的开始分钟数
                var endM = endMinute %= 60; // 计算后的开始分钟数
                if (endHour == 24) {
                    _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
                } else {
                    _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
                }
            }
            $('.rightContent').html(_html)
        }

    })
    $('.submitBox .noBtn').click(function() {
        layer.closeAll();
        $('.submitBox').hide();
    })
    $('.submitBox .yesBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveOrder',
            dataType: 'json',
            data: {
                "type": '0',
                "orderStateId": data.orderFormBean.statesId,
                "orderId": data.orderFormBean.id,
                "orderTypes": data.orderFormBean.orderTypes,
                "orderType": 0,
                "sendType": 0,
                "type1": 2,
                "doctorId": doctorId,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    $('.submitBox').hide();
                    var $ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['500px', '200px'],
                        closeBtn: false,
                        shade: [0.7, '#000000'],
                        shadeClose: false,
                        content: $('.accept'),
                        time: 2000,
                    });
                    setTimeout(function() {
                        window.location = '/yilaiyiwang/morkbench/morkbench.html'
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 555) {
                    window.location = '/yilaiyiwang/morkbench/morkbench.html'
                } else {}
            },
            error: function(err) {
                console.log(err);
            },
        })
    })



    // 修改排期
    var dateTempList = []; // 收集的时间段
    for (var i = 0; i < data.orderDateList.length; i++) {
        var date = data.orderDateList[i].startDate.split(' ')[0];
        var startDate = data.orderDateList[i].startDate.split(' ')[1];
        var hours = startDate.split(':')[0];
        var minute = startDate.split(':')[1];
        var startIndex = (hours * 60 + minute * 1) / 15;
        var endDate = data.orderDateList[i].endDate.split(' ')[1];
        var endHour = endDate.split(':')[0];
        var endMinute = endDate.split(':')[1];
        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        dateTempList.push({
            "date": date,
            "startIndex": startIndex,
            "endIndex": endIndex - 1,
        })
    }
    var myDate = new Date();
    var flag = true;
    var startIndex = 0;
    var endIndex = 0;
    var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    // 渲染日历控件
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            change: function(value, date) { //监听日期被切换
                $('#timeUl > li').removeClass('active');
                dateStr = value;
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }

                for (var i = 0; i < dateTempList.length; i++) {
                    if (value == dateTempList[i].date) {
                        for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                            $('#timeUl > li').eq(j).addClass('active');
                        }
                    }
                }
            }
        });
    });
    // 分钟选择事件、
    $('#timeUl').delegate('li', 'click', function () {
        if (flag) {
            $(this).addClass('active').siblings('li').removeClass('active');
            flag = false;
            startIndex = $(this).attr('index');
        } else {
            $(this).addClass('active');
            flag = true;
            endIndex = $(this).attr('index');
            if (startIndex <= endIndex) {
                for (var i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (var i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            // var dateTempFlag = true;
           dateTempList = [];
           dateTempList.push({
               "date": dateStr,
               "startIndex": startIndex,
               "endIndex": endIndex,
           });
        }
    });
    // 关闭事件
    $('.closeBtnTime').click(function() {
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })

    $('.yesBtn').click(function() {
        var dateList = []; // 选择的时间数据
        for (var i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }
        }
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveOrder',
            dataType: 'json',
            data: {
                "type": '0',
                "orderStateId": data.orderFormBean.statesId,
                "orderId": data.orderFormBean.id,
                "orderTypes": data.orderFormBean.orderTypes,
                "orderType": '1',
                "dateList": JSON.stringify(dateList),
                "sendType": 0,
                "type1": 2,
                "doctorId": doctorId,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['500px', '200px'],
                        closeBtn: false,
                        shade: [0.7, '#000000'],
                        shadeClose: false,
                        content: _$('.accept'),
                        time: 2000,
                    });
                    setTimeout(function() {
                        $('.accept').hide();
                        window.location = '/yilaiyiwang/morkbench/morkbench.html'
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 555) {
                    window.location = '/yilaiyiwang/morkbench/morkbench.html'
                } else {}
            },
            error: function(err) {
                console.log(err);
            },
        })
    })
})
