var 
  express = require('express'),
  router  = express.Router(),
  Wuming  = require('../app/models/wuming'),
  ueditor = require('ueditor-multiparty');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('wuming.html');
});

router.get('/wuming_content', function (req, res) {
  var name = req.query.name;

  Wuming.findOne({name: name}, function(err, wuming) {
    if(err) { 
      res.json({content: ''});
      return;
    };

    if (wuming && wuming.content) {
      res.json({content: wuming.content});
    } else {
      res.json({content: ''});
    }
  });
});

router.post('/wuming_saveing', function (req, res) {
  var 
    name    = req.body.name,
    content = req.body.content;

  Wuming.findOneAndUpdate({name: name}, {$set: {content: content}}, {new: true, upsert: true}, function(err, wuming) {
    if(err) { 
      res.json({success: false});
      return;
    };
    if(wuming) {
      res.json({success: true});
    } else {
      res.json({success: false});
    }
  });
});

router.use("/ueditor/ue", ueditor('./public', function(req, res, next) {
  // 客户端发起上传图片请求
  if (req.query.action === 'uploadimage') {
    var dir_url = '/upload/img/';
    res.ue_up(dir_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/upload/img/',
        filetype  = 'jpg,jpeg,png,gif,ico,bmp';

    res.ue_list(dir_url, filetype); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起上传附件请求
  else if (req.query.action === 'uploadfile') {
    var dir_url = '/upload/file/';
    res.ue_up(dir_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  //  客户端发起附件列表请求
  else if (req.query.action === 'listfile') {
    var dir_url = '/upload/file/',
        filetype = 'rar,zip,7z,doc,docx,docm,xls,xlsx,xlsm,ppt,pptx,pdf,txt';
    res.ue_list(dir_url, filetype); // 客户端会列出 dir_url 目录下的所有列表
  }
  // 客户端发起其它请求
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/nodejs/config.json');
  }
}));

module.exports = router;
