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
    $('.progressBar li:nth-child(2)').addClass('libg');
    $('.progressBar li:nth-child(3)').addClass('libg');
    $('.progressBar li:nth-child(4)').addClass('libg');

    /* 编辑临床反馈按钮弹层 */
    $('.editClinicalFeedback').click(function() {
        $('.background').css('display', 'block');
        $('.re_layer').css('display', 'block');
        document.documentElement.style.overflow = "hidden";

    })
    /* 弹层关闭按钮 */
    $('.closeBtn').click(function() {
        $('.background').css('display', 'none');
        $('.re_layer').css('display', 'none');
        $('.accept_layer').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    })
    /* 暂存按钮事件 */
    $('.feed_SM').click(function() {
        var $ = layui.jquery;
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            area: '340px',
            skin: 'layui-layer-nobg', //没有背景色
            // shadeClose: false,
            shade: 0,
            time: 3000,
            content: $('.failed')
        });
        // setTimeout(() => {
        //     $('.failed').css('display','none')
        // }, 2000);


    })
    /* 提交按钮事件 */
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
    //订单编号
    $('.numbers').html(data.orderFormBean.numbers);
    //申请时间
    $('.applyDate').html(data.orderFormBean.applyDate);
    // 发件人信息
    $('.recipientsInfo').html(' <' + data.orderFormBean.doctorName + '/' + data.orderFormBean.doctorTitleName + '/' + data.orderFormBean.doctorDeptName + '/' + data.orderFormBean.doctorHospitalName + '>')
    // 会诊报告
    var goalHtml = '';
    for (var i = 0; i < data.orderDoctorsList.length; i++) {
        goalHtml += '<p class="report">'+data.orderDoctorsList[i].name+':<br />'+data.orderDoctorsList[i].feedBack+'</p>'
    }
    $('.goalObj').html(goalHtml);

    //   收件人信息
    var recipientsArr = data.orderDoctorsList;
    var _html = '';
    if (recipientsArr.length == 0) {
        $('.addresserInfo').html("<" + data.orderFormBean.invitedHospitalName + ">")
    } else {
        for (var i = 0; i < recipientsArr.length; i++) {
            _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
        }
        $('.addresserInfo').html(_html)
    }
    $('.money').html(data.orderFormBean.money);

 
    // 左侧导航栏  
     var orderTypes = data.orderFormBean.orderTypes;
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectOrderCaseType',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: {
            orderId: data.orderFormBean.id,
        },
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var _html = '<li class="oneLevelItem patientInfo active">\
                         <p class="oneLevelName">会诊报告</p>\
                     </li><li class="oneLevelItem patientInfo">\
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

     //会诊排期
     $('.startDate').html('从&nbsp;&nbsp;' + data.orderFormBean.orderBeginDate);
     $('.endDate').html(data.orderFormBean.orderEndDate);

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
                                         <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
          } else {
              $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                        <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
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



    /* 返回按钮 */
    $('.getBack').click(function() {
        window.location = '/yilaiyiwang/morkbench/morkbench.html'
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


})
