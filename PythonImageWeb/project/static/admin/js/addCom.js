window.onload = function () {
    document.getElementById("add").onclick = shogMinLogin;
    document.getElementById("close_minilogin").onclick = closeLogin;
    document.getElementById("addCom").onclick = addCom;
    function addCom() {
        const cont = document.getElementById("cont").value;
        const pid = document.getElementById("pid").value;
        const uid = document.getElementById("uid").value;
        $.ajax({
            url: '/api/comment/add',
            type: 'post',
            dataType: 'json',
            data: {content:cont,image_id: pid, user_id: uid}
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
