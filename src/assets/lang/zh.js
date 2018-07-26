module.exports = {
  language: {
    name: '中'
  },
  defaultPage:{
    welcome:'登陆探索更多学习乐趣，加入我们吧！'
  },
  sidebar: ['最近的学习','你的单词集','单词游戏','帮助中心'],
  header:{
    create:"创建",
    user:['注册','登陆'],
    userfunc:['你的单词集',"升级","退出"]
  },
  LogIn:{
    basic:['用户/邮箱','密码','登 陆','忘记密码?'],
    ueHint:['用户名/邮箱不能为空','用户名/邮箱不存在',],
    pwHint:['密码不能为空','密码不正确']
  },
  SignUp:{
    basic:['用户','邮箱','密码','注  册'],
    nameHint:['用户名123','用户名长度必须不少于2个字符',
      '用户名只能包含字母、汉字、数字、下划线','用户名已经被注册，请重新输入','用户名不能为空','用户名不能大于15个字符'],
    emailHint:['邮箱格式不正确','邮箱已经被注册','邮箱名不能为空'],
    pwHint:['密码长度必须大于6个字符','密码必须包含字母和数字','密码不能为空','密码中不能包含汉字']
  },
  addText:"+添加卡片",
  createDialog:{
    header:"新的单词集!",
    title:"标题",
    subTitle:"副标题",
    folder:"文件夹",
    folderHint:"你只有一个文件夹哦！",
    titleEmpty:'标题不能为空哦'
  },
  createSet:{
    termEmpty:'行单词为空，请给它填上!',
    defEmpty:'行定义为空，请给它填上!',
    setLength:'一个单词集至少包含2个卡片哦!',
    termHint:'定义...',
    definitionHint:'解释...',
  }
}
