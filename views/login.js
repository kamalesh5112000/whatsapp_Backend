var loginform = document.getElementById('loginForm');

var email=document.getElementById('email');
var password=document.getElementById('password');
var emailcheck=document.getElementById('emailcheck');
var passwordcheck=document.getElementById('passwordcheck');


loginform.addEventListener('submit',submitForm);

async function submitForm(e){
    e.preventDefault();
    let flag=false;
    emailcheck.innerHTML="";
    passwordcheck.innerHTML="";
    var myobj={
        email: email.value,
        password:password.value
    }
    console.log(myobj)
    const res = await axios.post('http://52.201.83.163:3000/login',myobj)
    console.log(res)
    if (res.status==202){
        emailcheck.innerHTML="Email Doesn't Exits"
    }else if(res.status==201){
        passwordcheck.innerHTML="Password is Incorrect"
    }
    else{  
        alert(res.data.message)
        
        console.log(res.data.token)
        localStorage.setItem('token',res.data.token)
        window.location.replace("./index.html");
    }
    

}