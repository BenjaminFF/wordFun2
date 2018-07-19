module.exports = {
  language: {
    name: 'E'
  },
  sidebar: ['Latest Learning','Your WordSet','Word Fun','Help Center'],
  header:{
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
    titleEmpty:'There is no Title!'
  },
  createSet:{
    termEmpty:' term is empty,please fill it up!',
    defEmpty:' definition is empty,please fill it up!',
    setLength:'A Set at least contains 2 cards!'
  }
}
