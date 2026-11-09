S.init();
if(S.user())location.href='dashboard.html';
const $=s=>document.querySelector(s);
let role='seeker',signup=false;
document.querySelectorAll('#roles button').forEach(b=>b.onclick=()=>{
 role=b.dataset.r;document.querySelectorAll('#roles button').forEach(x=>x.classList.toggle('on',x==b));$('#err').textContent='';
});
$('#tog').onclick=e=>{e.preventDefault();signup=!signup;
 $('#name').style.display=signup?'block':'none';$('#name').required=signup;
 $('#ttl').textContent=signup?'Create your account':'Welcome back';
 $('#go').textContent=signup?'Sign up':'Login';
 $('#sw').textContent=signup?'Already have an account?':'New here?';
 $('#tog').textContent=signup?'Login':'Create account';
 $('#demo').style.display=signup?'none':'block';$('#err').textContent='';
};
$('#demo').onclick=()=>{
 $('#email').value=role=='seeker'?'seeker@nova.com':'recruiter@nova.com';
 $('#pass').value=role=='seeker'?'seeker123':'recruiter123';
};
$('#f').onsubmit=e=>{
 e.preventDefault();
 const email=$('#email').value.trim().toLowerCase(),pass=$('#pass').value,users=S.get('users',[]);
 if(signup){
  if(users.some(u=>u.email==email))return $('#err').textContent='Email already registered.';
  const u={name:$('#name').value.trim(),email,pass,role};
  if(role=='recruiter')u.company=u.name;
  users.push(u);S.set('users',users);S.set('session',u);
 }else{
  const u=users.find(u=>u.email==email&&u.pass==pass);
  if(!u)return $('#err').textContent='Invalid email or password.';
  if(u.role!=role)return $('#err').textContent='This account is a '+(u.role=='seeker'?'Job Seeker':'Recruiter')+' account. Switch the tab above.';
  S.set('session',u);
 }
 location.href='dashboard.html';
};
