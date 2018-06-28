$(function () {
    /* 判断左面导航栏距离顶部距离，滚轮向下滚动固定定位 */
    var navH = $(".left").offset().top;
    console.log(navH);
    $(window).scroll(function () {
        var scroH = $(this).scrollTop();
        if (scroH >= navH - 102) {
            $(".left").css({
                position: 'fixed',
                top: '55px'
            })
        } else if (scroH < navH) {
            $('.left').css({
                position: 'static'
            })
        }
    })
    /* 动态创建进度条 */
    var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    var str = '';
    for (var i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);

    }
    $('.progressBar li:first-child').addClass('libg');
    /* 左面导航栏点击显示隐藏 三角符号变换指向 */
    $(".departmant dl dt").click(function () {
        $(this).siblings("dd").toggle();
        if ($(this).siblings('dd').css('display') == 'block') {
            $(this).find('.layui-icon').html('&#xe625;')
        } else {

            $(this).find('.layui-icon').html('&#xe623;')

        }
    })
    /* 点击二级科室添加背景色 */
    $(".departmant dl dd").click(function () {
        // alert(1);
        $(".bgdt").removeClass("bgdt");
        $(this).addClass("bgdt");

    })



    /* 编辑会诊报告按钮弹层 */
    $('.report').click(function () {
        $('.background').css('display', 'block');
        $('.re_layer').css('display', 'block');
         /* 开启弹层禁止屏幕滚动 */
         document.documentElement.style.overflow = "hidden";

    })
    /* 弹层关闭按钮 */
    $('.closeBtn').click(function () {
        $('.background').css('display', 'none');
        $('.re_layer').css('display', 'none');
        $('.accept_layer').css('display', 'none');
        /* 关闭弹层禁止屏幕滚动 */
        document.documentElement.style.overflow = "scroll";
    })

   
})