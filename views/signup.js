var form = document.getElementById('signupForm');
var loginform = document.getElementById('loginForm');
var nam = document.getElementById('name');
var email=document.getElementById('email');
var phone=document.getElementById('phone');
var password=document.getElementById('password');
const emailarea=document.getElementById('emailarea');
const phonearea=document.getElementById('phonearea');

form.addEventListener('submit',submitForm);
async function submitForm(e){
    e.preventDefault();
    var myobj={
        name : nam.value,
        email: email.value,
        phone:phone.value,
        password:password.value
    }
    console.log(myobj)
    const res = await axios.post('http://localhost:3000/',myobj)
    console.log(res.status,res)
    if(document.getElementById('emailcheck')){
        document.getElementById('emailcheck').remove()
    }
    if(document.getElementById('phonecheck')){
        document.getElementById('phonecheck').remove()
    }
    if (res.status==202){
        
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='emailcheck';
        ep.style.color='white';
        ep.innerText='Email Already Exits';
        emailarea.appendChild(ep)
    }else if(res.status==203){
        
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='phonecheck';
        ep.style.color='white';
        ep.innerText='Phone Already Exits';
        phonearea.appendChild(ep)

    }
    else{
        alert("User created Successfully")
        window.location.replace("./login.html");
    }

}