var arrUrl = location.href.split("/");
var pageName = arrUrl[arrUrl.length - 1];
if (!localStorage.getItem("loginId") && pageName != "index.html") {
  location.href = "../index.html";
}

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
var id = GetRequest().id;
var seldetail = (function () {
  $.ajax(url + "ygtapi/MDeviceController/queryByManagerId", {
    data: {
      id: id,
      // id：458607431010883761
    },
    dataType: "json", //服务器返回json格式数据
    type: "POST",
    headers: {}, //HTTP请求类型
    timeout: 10000, //超时时间设置为10秒；
    success: function (res) {
      if (res.success) {
        var detail = res.data[0];
        var states = ``;
        var status = `cabinet_color_yel`;
        if (detail.islockedstatus === 0) {
          $("#cabinet_titler").html("解锁");
          $("#cabinet_titler").css("background", "#0069FF");
          states = `cabinet_color_gre`;
          detail.islockedstatus = `可使用`;
        } else if (detail.islockedstatus === 1) {
          $("#cabinet_titler").html("锁定");
          $("#cabinet_titler").css("background", "#FF5900");
          states = `cabinet_color_yel`;
          detail.islockedstatus = `已禁用`;
        }
        if (detail.isofflinestatus === 0) {
          status = `cabinet_color_gre`;
          detail.isofflinestatus = `未离线`;
        } else if (detail.isofflinestatus === 1) {
          status = `cabinet_color_yel`;
          detail.isofflinestatus = `已离线`;
        }

        $("#cabinet_titler").attr("lockid", detail.id);

        var str =
          `
        <div class="cabinet_detail">
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll">智配柜编号</div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.devicecode +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll">智配柜名称</div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.devicename +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>负</div><div>责</div><div>人</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.managername +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>电</div><div>话</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.managerphone +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>补</div><div>货</div><div>员</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.supplyusername +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>电</div><div>话</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.supplyuserphone +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>上</div><div>报</div><div>时</div><div>间</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">` +
          detail.reportthetime +
          `</div>
        </div>
        <div class="cabinet_detailcell">
            <div class="cabinet_detailcelll"><div>状</div><div>态</div></div>
            <div class="cabinet_detailcellm">：</div>
            <div class="cabinet_detailcellr">
                <span class="cabinet_detailcellrl ${states}">` +
          detail.islockedstatus +
          `</span>&nbsp;&nbsp;
                <span class="cabinet_detailcellrr ${status}">` +
          detail.isofflinestatus +
          `</span>
            </div>
        </div>
      </div>
        `;
        $("#cabinet_detail").html(str);
      } else {
        alert(res.message);
      }
    },
    error: function (xhr, type, errorThrown) {
      alert("系统故障");
    },
  });
})();

var cabinet_titler = document.getElementById("cabinet_titler");
var lock = document.getElementsByClassName("cabinet_detailcellrl");
cabinet_titler.onclick = function () {
  var reloadstatus = "";
  if ($(".cabinet_detailcellrl").html() == "可使用") {
    reloadstatus = 0;
  } else {
    reloadstatus = 1;
  }
  if (cabinet_titler.innerHTML == "锁定") {
    $.ajax(url + "ygtapi/MDeviceController/queryByManagerId", {
      data: {
        id: id
      },
      dataType: "json", //服务器返回json格式数据
      type: "POST",
      headers: {}, //HTTP请求类型
      timeout: 10000, //超时时间设置为10秒；
      success: function (res) {
        if (res.data[0].islockedstatus === reloadstatus) {
          changelockstate(0);
        }else{
          alert("您操作的智配柜状态已改变，请稍后重试");
          window.location.reload();
        }
      },
      error: function (xhr, type, errorThrown) {
        alert("系统故障");
      },
    });
  } else {
    $.ajax(url + "ygtapi/MDeviceController/queryByManagerId", {
      data: {
        id: id
      },
      dataType: "json", //服务器返回json格式数据
      type: "POST",
      headers: {}, //HTTP请求类型
      timeout: 10000, //超时时间设置为10秒；
      success: function (res) {
        if (res.data[0].islockedstatus === reloadstatus) {
          changelockstate(1);
        }else{
          alert("您操作的智配柜状态已改变，请稍后重试。");
          window.location.reload();
        }
      },
      error: function (xhr, type, errorThrown) {
        alert("系统故障");
      },
    });
  }
};

var cabinet_titlel = document.getElementById("cabinet_titlel");
cabinet_titlel.onclick = function () {
  window.history.back();
};

function changelockstate(lockstate) {
  let id = $("#cabinet_titler").attr("lockid");
  $.ajax(url + "ygtapi/MDeviceController/updateIsLocked", {
    data: {
      id: id,
      islocked: lockstate,
    },
    dataType: "json", //服务器返回json格式数据
    type: "POST",
    headers: {}, //HTTP请求类型
    timeout: 10000, //超时时间设置为10秒；
    success: function (res) {
      if (res.success) {
        // console.log($(".cabinet_detailcellrl").html());
        if (cabinet_titler.innerHTML == "解锁") {
          cabinet_titler.innerHTML = "锁定";
          cabinet_titler.style.background = "#FF5900";
          $(".cabinet_detailcellrl").html("已禁用");
          $(".cabinet_detailcellrl").css("color", "#FF5900");
        } else {
          cabinet_titler.innerHTML = "解锁";
          cabinet_titler.style.background = "#0069FF";
          $(".cabinet_detailcellrl").html("可使用");
          $(".cabinet_detailcellrl").css("color", "#00c662");
        }
      } else {
        if ($(".cabinet_detailcellrr").html() == "已离线") {
          alert("此柜处于离线状态不能进行操作！");
        } else {
          alert(res.message);
        }
      }
    },
    error: function (xhr, type, errorThrown) {
      alert("系统故障");
    },
  });
}
