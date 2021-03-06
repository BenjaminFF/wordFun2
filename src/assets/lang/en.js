module.exports = {
  language: {
    name: 'E'
  },
  defaultPage:{
    title:"Create set,Learn set!",
  },
  sidebar: [/*'Latest Learning',*/ 'Your WordSet','CrossWord','Help Center','Folder'],
  createFolder:['Create New Folder','title','intro',"CREATE","there's already have such a folder.","folder's title cannot be empty"],
  header:{
    create:'CREATE',
    user:['SIGNUP','LOGIN'],
    userfunc:['your wordset',"upgrade","logout"]
  },
  LogIn:{
    basic:['username/email','password','LOG IN','forget password?',"captcha"],
    ueHint:['username/email cannot be empty','username/email not exist'],
    pwHint:['password cannot be empty','password is not correct'],
    captchaHint:["captcha expired","captcha is incorrect,please try again","captcha cannot be empty"],
  },
  SignUp:{
    basic:['username','email','password',"Next","Registration Code","sign up","sign up succeed!"],
    notifyText:"your Registration Code has been sent to your email",
    nameHint:['username123','username must greater than 2 character',
      'username can\'t contain special character',
      'username has already been signed','username cannot be empty','username cannot greater than 15 character'],
    emailHint:['invalid email address','email has already been signed','email cannot be empty'],
    pwHint:['password must greater than 6','password must contain number and character','password cannot be empty','password cannot contain chinese'],
    rCodeHint:['Registration Code cannot be empty!','Registration Code is incorrect']
  },
  addText:"+Add Card",
  createDialog:{
    header:"A New Set",
    title:"Title",
    subTitle:"description",
    folder:"Folder",
    folderHint:"only one folder!",
    titleEmpty:'There is no Title!',
    editHeader:'modified Set'
  },
  createSet:{
    termEmpty:' term is empty,please fill it up!',
    defEmpty:' definition is empty,please fill it up!',
    setLength:'A Set at least contains 3 cards!',
    termHint:'term...',
    definitionHint:'definition...',
  },
  deleteDialog:{
    delete:'Delete',
    cancel:'Cancel',
    text:'Sure to Delete this set?All of it\'s data will be deleted permanently,and cannot be restored!'
  },
  wordSets:{
    create:'Create New Set!'
  },
  setLearn:{
    sideBar:{back:'Back',setList:'Set List'
      ,write:'Write',flashCards:'Flash Cards',matrix:'Matrix',theme:'Theme'},
    flashCards:{play:'Play',shuffle:'Shuffle',
      hideDef:'HideDef',showDef:'ShowDef',
      keyBoard:['Previous','Next',
        'Shuffle','Play','hide/showDef','Flip'],
    },
    matrix:{endHeader:'Congratulations!<br>You learned all of them!',startOver:'RELEARN',shuffle:'SHUFFLE'},
    write:{typeAnswer:'TYPE YOUR ANSWER',round:'ROUND',progress:'PROGRESS'
      ,ya:'YOUR ANSWER: ',ra:'RIGHT ANSWER: ',noidea:'don\'t know',
      continue:'Press Any Key To Continue!',learnEnd:'Congratulation!You finished them All!',reLearn:'START OVER'}
  },
}
