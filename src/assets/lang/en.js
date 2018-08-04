module.exports = {
  language: {
    name: 'E'
  },
  defaultPage:{
    welcome:'LogIn to explore more joy, join us!'
  },
  sidebar: ['Latest Learning','Your WordSet','Word Fun','Help Center'],
  header:{
    create:'CREATE',
    user:['SIGNUP','LOGIN'],
    userfunc:['your wordset',"upgrade","logout"]
  },
  LogIn:{
    basic:['username/email','password','LOG IN','forget password?'],
    ueHint:['username/email cannot be empty','username/email not exist'],
    pwHint:['password cannot be empty','password is not correct']
  },
  SignUp:{
    basic:['username','email','password',"SING UP"],
    nameHint:['username123','username must greater than 4',
      'username must only contain letter,number,underscore',
      'username has already been signed','username cannot be empty','username cannot greater than 15'],
    emailHint:['invalid email address','email has already been signed','email cannot be empty'],
    pwHint:['password must greater than 6','password must contain number and character','password cannot be empty','password cannot contain chinese']
  },
  addText:"+Add Card",
  createDialog:{
    header:"A New Set",
    title:"Title",
    subTitle:"SubTitle",
    folder:"Folder",
    folderHint:"only one folder!",
    titleEmpty:'There is no Title!',
    editHeader:'modified Set'
  },
  createSet:{
    termEmpty:' term is empty,please fill it up!',
    defEmpty:' definition is empty,please fill it up!',
    setLength:'A Set at least contains 2 cards!',
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
    back:'Back',
    setList:'Set List',
    write:'Write',
    flashCards:'Flash Cards',
    matrix:'Matrix'
  }
}
