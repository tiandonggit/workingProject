var demoImg = document.getElementById("pwdpic");
var demoInput = document.getElementById("password");
var loginbut = document.getElementById("loginbut");
//隐藏text block，显示password block
demoImg.onclick = function () {
  if (demoInput.type == "password") {
    demoInput.type = "text";
    demoImg.src = "./images/showpwd.png";
  } else {
    demoInput.type = "password";
    demoImg.src = "./images/hidepwd.png";
  }
};

//登录
loginbut.onclick = function () {
  var account = document.getElementById("account").value;
  var password = document.getElementById("password").value;
  $("#loginbut").attr("disabled",true);
  if (account == "") {
    alert("请输入账号！");
    $("#loginbut").attr("disabled",false);
  } else {
    if (password == "") {
      alert("请输入密码！");
      $("#loginbut").attr("disabled",false);
    } else {
      $.ajax(url + "ygtapi/SysUserController/login", {
        data: {
          username: account,
          password: password
        },
        dataType: "json", //服务器返回json格式数据
        type: "POST",
        headers: {}, //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function (res) {
          if(res.success){
            let id = res.data.id;
            localStorage.setItem("loginId", res.data.id);
            window.location.href = "./pages/cabinetlist.html?id="+id;
          }else{
            alert(res.message);
            $("#loginbut").attr("disabled",false);
          }
        },
        error: function (xhr, type, errorThrown) {
          alert("系统故障");
          $("#loginbut").attr("disabled",false);
        },
      });
    }
  }
};
