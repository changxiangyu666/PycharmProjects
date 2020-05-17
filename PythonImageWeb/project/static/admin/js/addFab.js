window.onload = function () {
    document.getElementById("add").onclick = shogMinLogin;
    document.getElementById("close_minilogin").onclick = closeLogin;
    document.getElementById("addF").onclick = addF;

    function addF() {
        const p = document.getElementById("pid").value;
        const u = document.getElementById("uid").value;
        $.ajax({
            url: '/api/fabulou/add',
            type: 'post',
            dataType: 'json',
            data: {image_id: p, user_id: u}
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
    }

    /* 关闭登录窗口 */
    function closeLogin() {
        const mini_login = document.getElementsByClassName("mini_login")[0];
        const cover = document.getElementsByClassName("cover")[0];
        mini_login.style.display = "none";
        cover.style.display = "none";
    }

};
