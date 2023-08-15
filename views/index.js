


var msg=document.getElementById('msgField');
var senBtn=document.getElementById('sendbtn');
var msgarea=document.getElementById('msgarea');
const createGroupBtn = document.getElementById('createGroupBtn');
const createGroupModal = document.getElementById('createGroupModal');
const groupNameInput = document.getElementById('groupNameInput');
const createGroupSubmit = document.getElementById('createGroupSubmit');
const createGroupCancel=document.getElementById('createGroupCancel');
const buttonListDiv = document.getElementById('GroupList');
let groupid=null;
let groupN='Public Group'

const createInvite=document.getElementById('createInvite');
const createInviteCancel=document.getElementById('createInviteCancel');
const createInviteSubmit=document.getElementById('createInviteSubmit');
const InviteEmail=document.getElementById('EmailInvite');
const EmailInviteCheck=document.getElementById('EmailInviteCheck');
const grpTitle=document.getElementById('grpName');


const socket=io.connect('http://localhost:3000')

socket.on("receiveMessage", (data) => {
    display();
  });
createInviteCancel.addEventListener('click',()=>{
    createInvite.style.display = 'none';
})
createGroupCancel.addEventListener('click',()=>{
    createGroupModal.style.display = 'none';
})

createGroupBtn.addEventListener('click', () => {
    createGroupModal.style.display = 'block';
    groupNameInput.value='';
    

});




const membersModal = document.getElementById('membersModal');
const membersList = document.getElementById('membersList');
const closeMembersModal = document.getElementById('closeMembersModal');

async function showMembers(e) {
    const button = e.target;
    const groupId = button.id;
    let grp={
        groupId:groupId
    }

    // You should fetch member data based on the groupId
    // For demonstration purposes, let's assume you have a sample member list
    const sampleMembers = ['Member 1', 'Member 2', 'Member 3'];

    membersList.innerHTML = ''; // Clear existing content

    // Populate the member list
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3000/getgroupMembers`,{headers:{"Authorization":token},params:grp});
    
    let isUserAdmin=true;
    for(let j=0;j<res.data.data.length;j++){
        console.log(res.data.cuid,res.data.data[j].userId,res.data.data[j].isAdmin,'true')
        if(res.data.cuid==res.data.data[j].userId && res.data.data[j].isAdmin!=true){
            
            isUserAdmin=false
        }
    }
    for(let i=0;i<res.data.data.length;i++){
        if(!isUserAdmin){
            const listItem = document.createElement('li');
            listItem.textContent = res.data.data[i].user.name;
            
            if(res.data.data[i].isAdmin==true){
                const isAdminLabel = document.createElement('span');
                isAdminLabel.textContent = '(Admin)';
                isAdminLabel.style.marginLeft = '10px';

                listItem.appendChild(isAdminLabel);
            }
            membersList.appendChild(listItem);

        }else{
            const listItem = document.createElement('li');
            listItem.textContent = res.data.data[i].user.name;
            console.log("Is Admin :",res.data.data[i].isAdmin)
            if(res.data.data[i].isAdmin==true){
                const isAdminLabel = document.createElement('span');
                isAdminLabel.textContent = '(Admin)';
                isAdminLabel.style.marginLeft = '10px';

                listItem.appendChild(isAdminLabel);
            }else{
                const makeAdminButton = document.createElement('button');
                makeAdminButton.textContent = 'Make Admin';
                makeAdminButton.className = 'btn btn-success btn-sm';
                makeAdminButton.style.marginLeft = '10px';
                makeAdminButton.id=res.data.data[i].userId;
                makeAdminButton.setAttribute('groupId',res.data.data[i].groupId)
                makeAdminButton.addEventListener('click', makeAdmin);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.style.marginLeft = '10px';
                deleteButton.id=res.data.data[i].userId;
                deleteButton.setAttribute('groupId',res.data.data[i].groupId)
                deleteButton.addEventListener('click', deleteMember);

                listItem.appendChild(makeAdminButton);
                listItem.appendChild(deleteButton);

            }
            membersList.appendChild(listItem);

        }

        
        

    }

    // Display the modal
    membersModal.style.display = 'block';
}


async function makeAdmin(e) {
    const button = e.target;
    const userId = button.id;
    const groupId=button.getAttribute('groupId')
    // Logic to make the member an admin
    
    
    const res= await axios.post('http://localhost:3000/makeAdmin',{userId:userId,groupId:groupId})
    
    membersModal.style.display = 'none';
}
  
async function deleteMember(e) {
    const button = e.target;
    const userId = button.id;
    const groupId=button.getAttribute('groupId')
    // Logic to delete the member
    console.log(userId,groupId)
    const res= await axios.post('http://localhost:3000/deletegroupmember',{userId:userId,groupId:groupId})
    
    membersModal.style.display = 'none';
}




closeMembersModal.addEventListener('click', () => {
    membersModal.style.display = 'none';
});
function handleButtonClick(event) {
    const button = event.target;
    const label = button.textContent;
    const id = button.id;
    const isAdmin=button.getAttribute('isAdmin')
    groupid=button.id;
    groupN=button.textContent;
    grpTitle.innerText=button.textContent;
    grpTitle.style.margin='5px'
    
    if(groupid!='null'){
        
        if(isAdmin=='true'){
            const btn = document.createElement('button');
            btn.textContent = 'Invite';
            btn.id = groupid;
            btn.className='btn btn-success'
            btn.style.float='right';
            btn.style.margin='5px'
            btn.addEventListener('click', sendInvite);
            grpTitle.appendChild(btn)

        }
        const showbtn = document.createElement('button');
        showbtn.textContent = 'Show Members';
        showbtn.style.margin='5px'
        showbtn.className='btn btn-success'
        showbtn.style.float='right';
        showbtn.id = groupid;
        showbtn.addEventListener('click', showMembers);
        grpTitle.appendChild(showbtn)

        
    }
    display()
    loadFromLS()
    
}
function sendInvite(e){
    e.preventDefault();
    const button = e.target;
    const id = button.id;
    createInvite.style.display = 'block';
    
}

createGroupSubmit.addEventListener('click', async() => {
    const groupName = groupNameInput.value;

    if (groupName) {
        // Perform necessary actions with the group name
        console.log('Group name:', groupName);
        // Close the moda
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/addgroup',{groupName:groupName},{headers:{"Authorization":token}});

        createGroupModal.style.display = 'none';
        groupdisplay()
        
    }
});

createInviteSubmit.addEventListener('click',async()=>{
    console.log("Email :",InviteEmail.value," Group ID :",groupid)
    const res = await axios.post('http://localhost:3000/addGroupUser',{userMail:InviteEmail.value,groupId:groupid});
    console.log(res)
    if(res.status==203){
        console.log(EmailInviteCheck.getElementsByTagName('p'))
        if(EmailInviteCheck.getElementsByTagName('p')){
            const paragraphs = EmailInviteCheck.getElementsByTagName('p');
            for (let i = paragraphs.length - 1; i >= 0; i--) {
            paragraphs[i].remove();
            }
        }
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='phonecheck';
        ep.style.color='white';
        ep.innerText="User Doesn't Exits";
        EmailInviteCheck.appendChild(ep)
    }else if(res.status==202){
        if(EmailInviteCheck.getElementsByTagName('p')){
            const paragraphs = EmailInviteCheck.getElementsByTagName('p');
            for (let i = paragraphs.length - 1; i >= 0; i--) {
            paragraphs[i].remove();
            }
        }
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='phonecheck';
        ep.style.color='white';
        ep.innerText="User already in the Group";
        EmailInviteCheck.appendChild(ep)
    }else{
        createInvite.style.display = 'none';
        InviteEmail.value='';

    }


})

senBtn.addEventListener('click',sendMessage);
msg.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      sendMessage(event);
      event.preventDefault();
    }
  });
display()
async function sendMessage(e){
    e.preventDefault();
    console.log(msg.value)
    testmsg=msg.value;
    msg.value='';
    myobj={
        msg:testmsg,
        groupid:groupid
    }
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3000/addmsg',{msg:testmsg,groupid:groupid},{headers:{"Authorization":token}});
    socket.emit("sendMessage",myobj);
    
    display();
}

groupdisplay()
async function groupdisplay(){
    buttonListDiv.innerHTML='';
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3000/getgroups`,{headers:{"Authorization":token}});
    createGroupList(res.data)

}
function createGroupList(obj){

    const btn = document.createElement('button');
    btn.textContent = 'Public Group';
    btn.style.width='100%';
    btn.style.margin='5px'
    btn.style.backgroundColor='light green'
    btn.id = null
    btn.addEventListener('click', handleButtonClick);
    buttonListDiv.appendChild(btn);


    for(let i=0;i<obj.length;i++){
        const btn = document.createElement('button');
        btn.textContent = obj[i].group.groupName;
        btn.style.width='100%';
        btn.style.margin='5px'
        btn.style.backgroundColor='rgb(253, 135, 0)'
        btn.setAttribute('isAdmin',obj[i].isAdmin)
        btn.id = obj[i].group.id
        btn.addEventListener('click', handleButtonClick);
        buttonListDiv.appendChild(btn);
    }

}

async function display(){

    const token = localStorage.getItem('token');

    async function fetchMessages() {
        let lastMessageId=undefined;
        const isScrolledToBottom = msgarea.scrollHeight - msgarea.scrollTop === msgarea.clientHeight;

        let existingMessages = JSON.parse(localStorage.getItem(groupN));
        
        if(existingMessages){
            
            lastMessageId=existingMessages.chat[existingMessages.chat.length-1].id;

        }

        let grp={
            groupId:groupid
        }
        const res = await axios.get(`http://localhost:3000/getmsg?lastMsgId=${lastMessageId}`,{headers:{"Authorization":token},params:grp});
        if(res.data.chat.length>0){
            
            
            if(existingMessages){
                
                existingMessages.chat.push(...res.data.chat);
                

            }else{
                existingMessages=res.data
            }
            

            // Add new messages to the existing array
            
            localStorage.setItem(groupN,JSON.stringify(existingMessages));
            lastMessageId=res.data.chat[res.data.chat.length-1].id;
            loadFromLS();
        }
        if (isScrolledToBottom) {
            msgarea.scrollTop = msgarea.scrollHeight;
        }

    }
    fetchMessages()
    // Call the fetchMessages function every 1 second
    //const intervalId = setInterval(fetchMessages, 100000);
    
}
function showchat(obj){
    for(let i=0;i<obj.chat.length;i++){
        if(obj.chat[i].userId==obj.cid){
            var para2 = document.createElement("div");
            para2.style.backgroundColor= "blue";
            para2.style.padding ="10px";
            para2.style.float ="right";
            para2.style.clear = "both";
            para2.style.margin = "5px";
            para2.appendChild(document.createTextNode(`${obj.chat[i].userName} : ${obj.chat[i].message}`));
            msgarea.appendChild(para2)
        }else{
            var para1 = document.createElement("div");
            para1.style.backgroundColor= "gold";
            para1.style.padding ="10px";
            para1.style.float ="left";
            para1.style.clear = "both";
            para1.style.margin = "5px";
            para1.appendChild(document.createTextNode(`${obj.chat[i].userName} : ${obj.chat[i].message}`));
            msgarea.appendChild(para1)

        }
    }

}
function loadFromLS(){

    const obj= JSON.parse(localStorage.getItem(groupN))
    msgarea.innerText='';
    
    if(obj){
        showchat(obj)
    }
    
}

loadFromLS();