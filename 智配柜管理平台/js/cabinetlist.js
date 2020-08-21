var arrUrl = location.href.split("/");
var pageName = arrUrl[arrUrl.length - 1];
if (!localStorage.getItem("loginId") && pageName != "index.html") {
  location.href = "../index.html";
}

$(function () {
  selcabinlist();
});

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

function selcabinlist() {
  $.ajax(url + "ygtapi/MDeviceController/queryByManagerId", {
    data: {
      managerid: id,
    },
    dataType: "json", //服务器返回json格式数据
    type: "POST",
    headers: {}, //HTTP请求类型
    timeout: 10000, //超时时间设置为10秒；
    success: function (res) {
      if (res.success) {
        let list = res.data;
        if (list.length > 0) {
          $("#cabinet_list").html("");
          for (let i = 0; i < list.length; i++) {
            var islockedstatus = ``;
            var isofflinestatus = ``;
            var isofflinebackground = ``;
            if (list[i].islockedstatus === 0) {
              islockedstatus = `cabinet_color_gre`;
              list[i].islockedstatus = `可使用`;
            } else if (list[i].islockedstatus === 1) {
              islockedstatus = `cabinet_color_yel`;
              list[i].islockedstatus = `已禁用`;
            }
            if (list[i].isofflinestatus === 0) {
              isofflinestatus = `cabinet_color_gre`;
              list[i].isofflinestatus = `未离线`;
            } else if (list[i].isofflinestatus === 1) {
              isofflinestatus = `cabinet_color_yel`;
              list[i].isofflinestatus = `已离线`;
            }else if(list[i].isofflinestatus === ""){
              isofflinebackground = `cabinet_color_background`;
            }
            // console.log(list);
            var str =
              `<div class="cabinet_list" onclick="todetail('` +
              list[i].id +
              `')">
                      <div class="cabinet_listl">
                          <img src="../images/cabinet.png" alt="">
                      </div>
                      <div class="cabinet_listr">
                          <div class="cabinet_listrt">智配柜编号：` +
              list[i].devicecode +
              `</div>
                          <div class="cabinet_listrm">智配柜名称：` +
              list[i].devicename +
              `</div>
                          <div class="cabinet_listrb">
                              <div class="cabinet_listrbl ${islockedstatus}">` +
              list[i].islockedstatus +
              `</div>
                              <div class="cabinet_listrbr ${isofflinestatus} ${isofflinebackground}">` +
              list[i].isofflinestatus +
              `</div>
                          </div>
                      </div>
                  </div>`;
            $("#cabinet_list").append(str);
          }
        } else {
          let nolist = `
                        <div class="nocabinet">
                          <div class="nopic">
                              <img src="../images/nocabinet.png" alt="">
                          </div>
                          <div class="notext">暂无智配柜</div>
                        </div>
                      `;
          $("#cabinet_list").html(nolist);
        }
      } else {
        alert(res.message);
      }
    },
    error: function (xhr, type, errorThrown) {
      alert("系统故障");
    },
  });
}

var cabinet_titlel = document.getElementById("cabinet_titlel");
cabinet_titlel.onclick = function () {
  localStorage.removeItem("loginId");
  window.history.back();
};

function todetail(id) {
  window.location.href = "../pages/cabinetdetail.html?id=" + id;
}
