window.onload = function () {
    document.getElementById("add").onclick = shogMinLogin;
    document.getElementById("close_minilogin").onclick = closeLogin;
    document.getElementById("addImg").onclick = addImg;

    function addImg() {
        const purl = document.getElementById("purl").value;
        const uid = document.getElementById("uid").value;
        $.ajax({
            url: '/api/image/add',
            type: 'post',
            dataType: 'json',
            data: {url:'/image/'+ purl, user_id:uid}
        }).done(function (oResult) {
            closeLogin();
            alert(oResult.msg || '添加成功');
            window.location.reload();//刷新当前页面
        }).fail(function (oResult) {
            closeLogin();
            alert(oResult.msg || '添加失败，请重试!');
        });
    }

    /* 显示登录窗口 */
    function shogMinLogin() {
        const mini_login = document.getElementsByClassName("mini_login")[0];
        const cover = document.getElementsByClassName("cover")[0];
        mini_login.style.display = "block";
        cover.style.display = "block";

        const now = new Date(),
            year = now.getFullYear(),
            month = ((now.getMonth() + 1) > 9) ? (now.getMonth() + 1) : ("0" + (now.getMonth() + 1)),
            date = translate(now.getDate()),
            hour = translate(now.getHours()),
            minute = translate(now.getMinutes()),
            second = translate(now.getSeconds());

        function translate(prop) {
            if (prop <= 9) {
                return "0" + prop;
            } else {
                return prop
            }
        }

        const dateString = year + "-" + month + "-" + date + " " + hour + ":" + minute + ':' + second;
        const t = document.getElementById("time");
        t.value = dateString;

    }

    /* 关闭登录窗口 */
    function closeLogin() {
        const mini_login = document.getElementsByClassName("mini_login")[0];
        const cover = document.getElementsByClassName("cover")[0];
        mini_login.style.display = "none";
        cover.style.display = "none";
    }

};
