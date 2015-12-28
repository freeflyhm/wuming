/*
 * wuming.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global, io, $*/

var wuming = (function () {
  'use strict';
  // 声明所有 wuming 内可用的变量
  var 
      // 静态配置值
      configMap = {
        wm_first_html: String()
          + '<div class="container">'
            + '<div class="jumbotron">'
              + '<h1 class="text-center" style="color:#4C86C6;">旅游同业, 欢迎您!</h1>'
            + '</div>'
            + '<div class="row">'
              + '<div class="col-sm-6">'
                + '<div class="thumbnail">'
                  + '<img src="img/shenzhen.jpg" alt="深圳">'
                  + '<div class="caption">'
                    + '<a href="#sz_hs" class="thumbnail">'
                      + '<h3>进入：黄山、九华山、华东、千岛湖</h3>'
                    + '</a>'
                    + '<a href="#sz_jx" class="thumbnail">'
                      + '<h3>进入：江西</h3>'
                    + '</a>'
                  + '</div>'
                + '</div>'
              + '</div>'
              + '<div class="col-sm-6">'
                + '<div class="thumbnail">'
                  + '<img src="img/chaoshan.jpg" alt="潮汕">'
                  + '<div class="caption">'
                    + '<a href="#cs_hs" class="thumbnail">'
                      + '<h3>进入：黄山、九华山、华东、千岛湖</h3>'
                    + '</a>'
                    + '<a href="#cs_jx" class="thumbnail">'
                      + '<h3>进入：江西</h3>'
                    + '</a>'
                  + '</div>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>',
        wm_html : String()
          + '<nav class="navbar navbar-default navbar-static-top" style="margin-bottom: 0;">'
            + '<div class="container">'
              + '<div class="navbar-header">'
                + '<a class="navbar-brand" href="#">旅游同业</a>'
              + '</div>'
              + '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'
                + '<ul class="nav navbar-nav">'
                  + '<li class="nav_li" id="sz_hs_li"><a href="#sz_hs">深圳-黄山</a></li>'
                  + '<li class="nav_li" id="sz_jx_li"><a href="#sz_jx">深圳-江西</a></li>'
                  + '<li class="nav_li" id="cs_hs_li"><a href="#cs_hs">潮汕-黄山</a></li>'
                  + '<li class="nav_li" id="cs_jx_li"><a href="#cs_jx">潮汕-江西</a></li>'
                + '</ul>'
                + '<p class="navbar-text navbar-right">当前用户 : '
                  + '<span id="wm-username"></span> '
                  + '<button id="loginBtn" class="btn btn-default btn-xs" type="button">切换用户</button>'
                + '</p>'
              + '</div>'
            + '</div>'
          + '</nav>'
          + '<div class="container">'
            //+ '<div class="jumbotron" style="background: url(img/huangshan.jpg)">'
            + '<div class="jumbotron" style="padding:0;">'
              + '<img src="img/huangshan.jpg" width="100%">'
              //+ '<h1>dd</h1>'
              //+ '<p>深圳往醉美乡村.婺源有直达高铁啦，中国最美（合福）高铁7月全面贯通：途经江西上饶三清山、婺源、安微黄山等黄金旅游地带，带您游黄山美丽山水，还请各同行们多多支持！！！</p>'
            + '</div>'
          + '</div>'
          + '<div id="wu-ue" class="container"></div>'
          // qq 在线
          + '<script charset="utf-8" type="text/javascript" src="http://wpa.b.qq.com/cgi/wpa.php?key=XzgwMDAzODgxOF8zMDMwNDJfODAwMDM4ODE4Xw"></script>',
        wmmodal_body_html : String()
          + '<div class="form-group">'
            + '<label class="sr-only">用户名</label>'
            + '<input tabindex="1" name="userName" class="form-control" type="text" placeholder="用户名" required></input>'
          + '</div>'
          + '<div class="form-group">'
            + '<label class="sr-only">密码</label>'
            + '<input tabindex="2" name="password" class="form-control" type="password" placeholder="密码" required></input>'
          + '</div>'
      },
      // 动态状态信息
      stateMap  = {
        isRefresh     : false,
        wmUserObj     : null,       // 当前用户
        $container    : null,       // 界面容器
        city          : '',
        ue            : null
      },
      jqueryMap = {},
      myModal,                      // 弹出框
      onLogined,
      setJqueryMap,
      on_content_saved,
      on_saveBtn_click,
      startWithResults,
      gotocity,
      checkUserOk,
      showLogin,
      bindOnHashChangeEvent,
      onHashChange,
      initModule;

  // 弹出框
  myModal = (function () {
    'use strict';
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    // 声明所有 kanban.myModal 内可用的变量
    var
      // 静态配置值
      configMap = {
        wm_modal_html: String()
          + '<div class="modal fade" id="wmModal" tabindex="-1" role="dialog" aria-labelledby="wmModalLabel">'
            + '<div class="modal-dialog modal-sm" role="document">'
              + '<div class="modal-content">'
                + '<div class="modal-header">'
                  + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                  + '<h4 class="modal-title" id="wmModalLabel"></h4>'
                + '</div>'
                + '<form class="modal-form" method="post">'
                  + '<div class="modal-body">'
                  + '</div>'
                  + '<div class="modal-footer">'
                    + '<button type="button" class="saveBtn btn btn-primary"></button>'
                    + '<button type="button" class="cancelBtn btn btn-default" data-dismiss="modal">取消</button>'
                  + '</div>'
                + '</form>'
              + '</div>'
            + '</div>'
          + '</div>'
      },
      // 动态状态信息
      stateMap  = { $wmModal : null },
      // jquery对象缓存集合
      jqueryMap = {},
      // DOM METHODS
      setJqueryMap,
      // EVENT HANDLERS
      
      // PUBLIC METHODS
      initModule, removeThis;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
      var $wmModal = stateMap.$wmModal;
      jqueryMap = { 
        $wmModal           : $wmModal,
        $wmmodal_title     : $('#wmModalLabel'),
        $wmmodal_form      : $wmModal.find('.modal-form'),
        $wmmodal_body      : $wmModal.find('.modal-body'),
        $wmmodal_saveBtn   : $wmModal.find('.saveBtn'),
        $wmmodal_cancelBtn : $wmModal.find('.cancelBtn')
      };
    };
    // End DOM method /setJqueryMap/
    //---------------------- END DOM METHODS ---------------------
  
    //------------------- BEGIN EVENT HANDLERS -------------------
    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    initModule = function (obj) {
      $('body').append(configMap.wm_modal_html);
      stateMap.$wmModal = $('#wmModal');
      setJqueryMap();

      jqueryMap.$wmmodal_title.text(obj.wmmodal_title_text);
      jqueryMap.$wmmodal_body.html(obj.wmmodal_body_html);
      jqueryMap.$wmmodal_saveBtn.text(obj.wmmodal_saveBtn_text);

      jqueryMap.$wmmodal_form.bind( 'submit', function(){
        return false;
      });

      jqueryMap.$wmmodal_saveBtn.bind( 'click', function() {
        obj.callbackFunction(jqueryMap);
      });

      jqueryMap.$wmModal.modal('show');

      stateMap.$wmModal.on('hidden.bs.modal', removeThis);

      return true;
    };

    removeThis = function () {

      if ( jqueryMap.$wmModal ) {
        jqueryMap.$wmModal.remove();
        jqueryMap = {};
      }
      stateMap.$wmModal = null;

      return true;
    };
    // End public method /removeThis/

    // return public methods
    return {
      initModule : initModule
    };
    //------------------- END PUBLIC METHODS ---------------------
  }());

  onLogined = function(userObj) {
    var isMatch = false,
        $wmModal = $('#wmModal'),
        wmUserObj;

    if(
        (userObj.userName === 'wuming' && userObj.password === '123456') || 
        (userObj.userName === 'admin' && userObj.password === '123456') ||
        (userObj.userName === 'guest' && userObj.password === 'guest')
    ){
      isMatch = true;
    }

    if(isMatch){
      $wmModal.modal('hide');

      wmUserObj = {name: userObj.userName};
      // 将userObj 序列化为JSON并储存到本地 Local Storage
      if (localStorage){
        localStorage.setItem('wmUserObj', JSON.stringify(wmUserObj));
      }

      stateMap.wmUserObj = wmUserObj;

      document.location.href = document.location.href.split('#')[0];
      //checkUserOk();
    } else {
      alert('用户认证失败！请检查用户名或密码是否正确');
      $wmModal.find('.saveBtn')
        .text( '用户认证' )
        .attr( 'disabled', false );
      $wmModal.find('.cancelBtn').attr( 'disabled', false );
    }
  };

  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
      $wm_username : $('#wm-username'),
      $loginBtn    : $('#loginBtn'),
      $wu_ue       : $('#wu-ue')
    };
  };
  // End DOM method /setJqueryMap/

  on_content_saved = function(result) {
    if(result.success) {
      alert('保存成功');
    } else {
      alert('保存失败');
    }
  };

  on_saveBtn_click = function() {
    var content = UE.getEditor('editor').getContent();

    $.post('wuming_saveing', {name: stateMap.city, content: content}, on_content_saved).error(function(e){
      alert('网络异常!保存失败');
    });
  };

  // 初始化主体内容
  startWithResults = function(results) {
    var wm_editor_html;
    //console.log(stateMap.wmUserObj.name);

    if(stateMap.wmUserObj.name === 'wuming' || stateMap.wmUserObj.name === 'guest') {
      jqueryMap.$wu_ue.html(results.content);
    }else if(stateMap.wmUserObj.name === 'admin') {
      //加载编辑器的容器
      wm_editor_html = String()
        + '<script id="editor" type="text/plain" style="width:1024px;height:500px;margin:0 auto;">' 
          + results.content
        + '</script>'
        + '<button id="saveBtn" class="btn btn-success pull-right" type="button">保 存</button>';
      jqueryMap.$wu_ue.html(wm_editor_html);

      $('#saveBtn').click(on_saveBtn_click);

      // 实例化编辑器
      if(stateMap.ue) {
        stateMap.ue.destroy();
      }
      stateMap.ue = UE.getEditor('editor');
    }
    // 刷新
    if(stateMap.isRefresh){
      stateMap.isRefresh = false;
      window.location.reload();
    }
    //history.go(0);
  };


  // 用户存在后启动程序
  gotocity = function(city){
    stateMap.city = city;

    stateMap.$container.html(configMap.wm_html);
    setJqueryMap();

    $('.nav_li').removeClass('active');
    if (city === 'sz_hs') {
      $('#sz_hs_li').addClass('active');
    } else if (city === 'sz_jx') {
      $('#sz_jx_li').addClass('active');
    } else if (city === 'cs_hs') {
      $('#cs_hs_li').addClass('active');
    } else if (city === 'cs_jx') {
      $('#cs_jx_li').addClass('active');
    }


    jqueryMap.$wm_username.text(stateMap.wmUserObj.name);

    jqueryMap.$loginBtn.click(function() {
      stateMap.isRefresh = true;
      showLogin();
    });

    // 向服务器异步请求网页内容
    $.get('wuming_content', {name: stateMap.city}, startWithResults).error(function(e) {
      alert('网络异常！');
    });
  };

  // 用户存在后启动程序
  checkUserOk = function(){

    stateMap.$container.html(configMap.wm_first_html);
  };

  // 用户认证流程
  showLogin = function(){
    myModal.initModule({
      wmmodal_title_text   : '用户认证',
      wmmodal_body_html    : configMap.wmmodal_body_html,
      wmmodal_saveBtn_text : '用户认证',
      callbackFunction : function(modalJqueryMap){
        var userObj  = {},
            fieldArr = modalJqueryMap.$wmmodal_form.serializeArray();

        fieldArr.forEach(function(item) {
          userObj[item.name] = item.value;
        });

        if(userObj.userName === ""){
          alert('用户名不能为空');
        } else if(userObj.password === "") {
          alert('密码不能为空');
        } else {
          modalJqueryMap.$wmmodal_saveBtn
            .text( '正在认证...' )
            .attr( 'disabled', true );
          modalJqueryMap.$wmmodal_cancelBtn.attr( 'disabled', true );

          onLogined(userObj);
        }
      }
    });
  };

  // hash change
  bindOnHashChangeEvent = function() {
    $(window)
      .bind( 'hashchange', onHashChange )
      .trigger( 'hashchange' );
  };
  onHashChange =function() {
    if(location.hash){
      stateMap.hash = location.hash;
    }

    // 如果当前页面不是login页面 && 不存在 userObj
    if(stateMap.wmUserObj === null){
      // 用户认证流程
      showLogin();
    } else {
      if(location.hash){
        if(location.hash === '#sz_hs') {
          gotocity('sz_hs');
        }else if(location.hash === '#sz_jx') {
          gotocity('sz_jx');
        }else if(location.hash === '#cs_hs') {
          gotocity('cs_hs');
        }else if(location.hash === '#cs_jx') {
          gotocity('cs_jx');
        }
      } else {
        checkUserOk();
      }
    }
  };

  initModule = function ( $container ) {

    stateMap.$container = $container;

    if (localStorage && localStorage.wmUserObj) {
      stateMap.wmUserObj = JSON.parse(localStorage.wmUserObj);
    }

    bindOnHashChangeEvent();

    /*if(wmUserObj === null){
      // 用户认证流程
      showLogin();
    } else {
      stateMap.wmUserObj = wmUserObj;
      checkUserOk();
    } */
  };

  return { initModule: initModule };
}());

$(document).ready(function () {

  wuming.initModule( $('body') );
});