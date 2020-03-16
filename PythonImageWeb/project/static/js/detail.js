$(function () {
    var oExports = {
        initialize: fInitialize,
        encode: fEncode
    };
    oExports.initialize();

    function fInitialize() {
        var that = this;
        var sImageId = window.imageId;
        var oCmtIpt = $('#jsCmt');
        var oListDv = $('ul.js-discuss-new');
        // 点击添加评论
        var bSubmit = false;
        $('#jsSubmit').on('click', function () {
            var th = this;
            clearInterval(th.timeId);
            var sCmt = $.trim(oCmtIpt.val());
            // 评论为空不能提交
            if (!sCmt) {
                return alert('评论不能为空');
            }
            // 上一个提交没结束之前，不再提交新的评论
            if (bSubmit) {
                return;
            }
            bSubmit = true;
            $.ajax({
                url: '/add/comment/',
                type: 'post',
                dataType: 'json',
                data: {image_id: sImageId, content: sCmt}
            }).done(function (oResult) {
                if (oResult.code !== 0) {
                    return alert(oResult.msg || '提交失败，请重试');
                }
                // 清空输入框
                oCmtIpt.val('');
                // 渲染新的评论
                var sHtml = [
                    '<li class="list">',
                        '<a href="/profile/', oResult.user_id, '" class="avatar">',
                            '<img src="',oResult.user_head_url,'?imageView/1/w/40/h/40">',
                        '</a>',
                        '<a class="_4zhc5 _iqaka" title="', that.encode(oResult.username), '" href="/profile/', oResult.user_id, '">', that.encode(oResult.username), '</a> ',
                        '<div class="ccontent"><span>', that.encode(sCmt), '</span></div>',
                    '</li>'].join('');
                oListDv.prepend(sHtml);
            }).fail(function (oResult) {
                alert(oResult.msg || '提交失败，请重试');
            }).always(function () {
                bSubmit = false;
            });
            oListDv.show().delay(2000).fadeOut();//2秒后弹窗消失
            $(function () {
                th.timeId=setInterval(function () {
                    window.location.reload();//刷新当前页面
                    oListDv.load(location.href + " .js-discuss-new");//注意后面DIV的ID前面的空格，很重要！没有空格的话，会出双眼皮！（也可以使用类名）
                }, 2000);//2秒自动刷新
            })
        });
    }

    function fEncode(sStr, bDecode) {
        var aReplace =["&#39;", "'", "&quot;", '"', "&nbsp;", " ", "&gt;", ">", "&lt;", "<", "&amp;", "&", "&yen;", "¥"];
        !bDecode && aReplace.reverse();
        for (var i = 0, l = aReplace.length; i < l; i += 2) {
             sStr = sStr.replace(new RegExp(aReplace[i],'g'), aReplace[i+1]);
        }
        return sStr;
    };

});