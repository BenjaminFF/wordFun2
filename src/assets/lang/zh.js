module.exports = {
  language: {
    name: '中'
  },
  defaultPage:{
    title:'创建单词集，学习单词集!',
  },
  sidebar: ['你的单词集','填字游戏','帮助中心','文件夹'],
  createFolder:['创建新的文件夹',"标题","描述","创 建","文件夹重名","文件名标题不能为空"],
  header:{
    create:"创建",
    user:['注册','登陆'],
    userfunc:['你的单词集',"升级","退出"]
  },
  LogIn:{
    basic:['用户名/邮箱','密码','登 陆','忘记密码?',"验证码"],
    ueHint:['用户名/邮箱不能为空','用户名/邮箱不存在',],
    pwHint:['密码不能为空','密码不正确'],
    captchaHint:["验证码过期","验证码不正确","验证码不能为空"],
  },
  SignUp:{
    basic:['用户名','邮箱','密码','下一步','注册码','注册',"注册成功!"],
    notifyText:"你的注册码已经发送至邮箱",
    nameHint:['用户名123','用户名长度必须不少于2个字符',
      '用户名不能包含特殊字符','用户名已经被注册，请重新输入','用户名不能为空','用户名不能大于15个字符'],
    emailHint:['邮箱格式不正确','邮箱已经被注册','邮箱名不能为空'],
    pwHint:['密码长度必须大于6个字符','密码必须包含字母和数字','密码不能为空','密码中不能包含汉字'],
    rCodeHint:['注册码不能为空','注册码不正确']
  },
  addText:"+添加卡片",
  createDialog:{
    header:"新的单词集!",
    title:"标题",
    subTitle:"描述",
    titleEmpty:'标题不能为空哦',
    editHeader:'修改单词集！'
  },
  createSet:{
    termEmpty:'行单词为空，请给它填上!',
    defEmpty:'行定义为空，请给它填上!',
    setLength:'一个单词集至少包含3个卡片哦!',
    termHint:'定义...',
    definitionHint:'解释...',
  },
  deleteDialog:{
    delete:'确定',
    cancel:'取消',
    text:'确认要删除这个单词集吗？这将删除单词集里面的所有内容，并且不能再恢复！'
  },
  wordSets:{
    create:'创建新的单词集!'
  },
  setLearn:{
    sideBar:{back:'返回',setList:'单词集列表'
      ,write:'拼写',flashCards:'幻灯片',matrix:'单词矩阵',theme:'主题'},
    flashCards:{play:'播放',shuffle:'重新排序',
      hideDef:'隐藏释义',showDef:'显示释义',
      keyBoard:['左滑','右滑',
        '重新排序','播放幻灯片','隐藏/显示释义','翻转'],
    },
    matrix:{endHeader:'恭喜！你完成了所有内容!',startOver:'重新学习',shuffle:'打 乱'},
    write:{typeAnswer:'输入答案',round:'单轮',progress:'进度',ya:'你的答案：',ra:'正确答案：',
      noidea:'不知道',continue:'请按任意键继续!',learnEnd:'恭喜！你完成了所有内容！',reLearn:'重新学习'}
  }
}
