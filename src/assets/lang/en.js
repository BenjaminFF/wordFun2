module.exports = {
  language: {
    name: 'E'
  },
  sidebar: ['Latest Learning','Your WordSet','Word Fun','Help Center'],
  header:{
    user:['SIGNUP','LOGIN'],
  },
  LogIn:{
    basic:['username/email','password','LOG IN','forget password?'],
    ueHint:['username/email cannot be empty','username/email not exist'],
    pwHint:['password cannot be empty','password is not correct']
  },
  SignUp:{
    basic:['username','email','password',"SING UP"],
    nameHint:['username123','username must greater than 6',
      'username must only contain letter,number,underscore','username has already been signed','username cannot be empty'],
    emailHint:['invalid email address','email has already been signed','email cannot be empty'],
    pwHint:['password must greater than 6','password must contain number and character','password cannot be empty']
  }
}
