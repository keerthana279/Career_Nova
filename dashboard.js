S.init();
let U=S.user();if(!U)location.href='index.html';
const $=s=>document.querySelector(s);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav={
 seeker:[['jobs','🔎','Find Jobs'],['saved','⭐','Saved Jobs'],['apps','📄','My Applications'],['profile','👤','Profile']],
 recruiter:[['over','📊','Overview'],['post','➕','Post a Job'],['mine','💼','My Jobs'],['cand','👥','Applicants']]};
const STAT=['Applied','Shortlisted','Interview','Hired','Rejected'];
let view=nav[U.role][0][0],f={q:'',type:'',loc:'',job:''};
const jobs=()=>S.get('jobs',[]),apps=()=>S.get('apps',[]),saved=()=>(S.get('saved',{})[U.email]||[]);
const myJobs=()=>jobs().filter(j=>j.by==U.email),myApps=()=>apps().filter(a=>myJobs().some(j=>j.id==a.jobId));
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function logout(){S.set('session',null);location.href='index.html'}
function go(v){view=v;draw()}
function closeM(){$('#modal').classList.remove('on')}
function modal(h){$('#mbody').innerHTML=h;$('#modal').classList.add('on')}
function draw(){
 $('#nav').innerHTML=nav[U.role].map(n=>`<a class="${n[0]==view?'on':''}" onclick="go('${n[0]}')">${n[1]} ${n[2]}</a>`).join('');
 $('#who').textContent=U.name;$('#role').textContent=U.role=='seeker'?'Job Seeker':'Recruiter';
 $('#av').textContent=U.name[0].toUpperCase();
 $('#main').innerHTML=V[view]();
}
/* ---------- shared ---------- */
function card(j){
 const sv=saved().includes(j.id),ap=apps().some(a=>a.jobId==j.id&&a.email==U.email);
 return `<div class="card job"><div class="logo">${esc(j.company[0])}</div><div><h3>${esc(j.title)}</h3><p class="mut">${esc(j.company)} · ${esc(j.loc)}</p>
 <div class="tags"><span>${esc(j.type)}</span><span>${esc(j.salary)}</span></div></div>
 <div class="act"><button class="btn sm ghost" onclick="detail(${j.id})">Details</button>
 <button class="btn sm ghost" onclick="save(${j.id})">${sv?'★ Saved':'☆ Save'}</button>
 <button class="btn sm" ${ap?'disabled':''} onclick="apply(${j.id})">${ap?'Applied ✓':'Apply'}</button></div></div>`}
function detail(id){
 const j=jobs().find(j=>j.id==id);
 modal(`<h2>${esc(j.title)}</h2><p class="mut">${esc(j.company)} · ${esc(j.loc)} · Posted ${esc(j.posted)}</p>
 <div class="tags" style="margin:12px 0"><span>${esc(j.type)}</span><span>${esc(j.salary)}</span></div>
 <p style="margin:14px 0;line-height:1.6">${esc(j.desc)}</p><p><b>Skills:</b> ${esc(j.skills)}</p><br>
 <button class="btn ghost" onclick="closeM()">Close</button> ${U.role=='seeker'?`<button class="btn" onclick="apply(${j.id});closeM()">Apply now</button>`:''}`);
}
function save(id){
 const all=S.get('saved',{}),l=all[U.email]||[],i=l.indexOf(id);
 i<0?l.push(id):l.splice(i,1);all[U.email]=l;S.set('saved',all);
 toast(i<0?'Job saved ⭐':'Removed from saved');draw();
}
function apply(id){
 const a=apps();if(a.some(x=>x.jobId==id&&x.email==U.email))return;
 a.push({id:Date.now(),jobId:id,email:U.email,name:U.name,title:U.title||'—',skills:U.skills||'—',status:'Applied',date:new Date().toLocaleDateString()});
 S.set('apps',a);toast('Application sent 🎉');draw();
}
const empty=m=>`<div class="card empty">${m}</div>`;
/* ---------- views ---------- */
function jl(){
 const q=f.q.toLowerCase(),l=f.loc.toLowerCase();
 const r=jobs().filter(j=>(!q||(j.title+j.company+j.skills).toLowerCase().includes(q))&&(!f.type||j.type==f.type)&&(!l||j.loc.toLowerCase().includes(l)));
 return r.length?r.map(card).join(''):empty('No jobs match your search.');
}
function list(){$('#list').innerHTML=jl()}
const V={
 jobs(){return `<h2>Find your next role 🔎</h2><div class="bar">
  <input placeholder="Search title, company or skill" value="${esc(f.q)}" oninput="f.q=this.value;list()">
  <select onchange="f.type=this.value;list()">${['','Full-time','Part-time','Internship','Contract'].map(t=>`<option value="${t}" ${f.type==t?'selected':''}>${t||'All types'}</option>`).join('')}</select>
  <input placeholder="Location" value="${esc(f.loc)}" oninput="f.loc=this.value;list()"></div><div id="list">${jl()}</div>`},
 saved(){const r=jobs().filter(j=>saved().includes(j.id));return `<h2>Saved jobs ⭐</h2>${r.length?r.map(card).join(''):empty('Nothing saved yet. Tap ☆ Save on any job.')}`},
 apps(){const r=apps().filter(a=>a.email==U.email);
  return `<h2>My applications 📄</h2>${r.length?`<div class="card"><table><tr><th>Job</th><th>Company</th><th>Date</th><th>Status</th><th></th></tr>${r.map(a=>{const j=jobs().find(j=>j.id==a.jobId)||{title:'(removed)',company:'-'};
  return `<tr><td>${esc(j.title)}</td><td>${esc(j.company)}</td><td>${a.date}</td><td><span class="badge s-${a.status}">${a.status}</span></td><td><button class="btn sm red" onclick="withdraw(${a.id})">Withdraw</button></td></tr>`}).join('')}</table></div>`:empty('You have not applied to any jobs yet.')}`},
 profile(){return `<h2>My profile 👤</h2><form class="card" onsubmit="saveProfile(event)" style="max-width:520px">
  <label>Full name</label><input id="pn" value="${esc(U.name)}" required>
  <label>Email</label><input value="${esc(U.email)}" disabled>
  <label>Headline</label><input id="pt" value="${esc(U.title)}" placeholder="e.g. Frontend Developer">
  <label>Skills</label><input id="ps" value="${esc(U.skills)}" placeholder="HTML, CSS, JS">
  <label>About me</label><textarea id="pa" rows="4">${esc(U.about)}</textarea><button class="btn">Save profile</button></form>`},
 over(){const a=myApps();return `<h2>Hello, ${esc(U.name)} 👋</h2><div class="grid">
  <div class="card"><b>${myJobs().length}</b>Active jobs</div><div class="card"><b>${a.length}</b>Applicants</div>
  <div class="card"><b>${a.filter(x=>x.status=='Shortlisted').length}</b>Shortlisted</div><div class="card"><b>${a.filter(x=>x.status=='Hired').length}</b>Hired</div></div>
  <div class="card"><h3>Quick actions</h3><br><button class="btn" onclick="go('post')">➕ Post a job</button> <button class="btn ghost" onclick="go('cand')">👥 Review applicants</button></div>`},
 post(){return `<h2>Post a new job ➕</h2><form class="card" onsubmit="postJob(event)" style="max-width:600px">
  <label>Job title</label><input id="jt" required><label>Company</label><input id="jc" value="${esc(U.company)}" required>
  <label>Location</label><input id="jl" required placeholder="City or Remote"><label>Type</label><select id="jy"><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select>
  <label>Salary</label><input id="js" placeholder="₹6–10 LPA" required><label>Skills required</label><input id="jk" placeholder="React, Node">
  <label>Description</label><textarea id="jd" rows="4" required></textarea><button class="btn">Publish job</button></form>`},
 mine(){const r=myJobs();return `<h2>My jobs 💼</h2>${r.length?r.map(j=>`<div class="card job"><div class="logo">${esc(j.company[0])}</div><div><h3>${esc(j.title)}</h3><p class="mut">${esc(j.loc)} · ${esc(j.type)} · ${apps().filter(a=>a.jobId==j.id).length} applicants</p></div>
  <div class="act"><button class="btn sm ghost" onclick="f.job=${j.id};go('cand')">Applicants</button><button class="btn sm red" onclick="delJob(${j.id})">Delete</button></div></div>`).join(''):empty('No jobs posted yet.')}`},
 cand(){const r=myApps().filter(a=>!f.job||a.jobId==f.job);
  return `<h2>Applicants 👥</h2><select onchange="f.job=this.value;draw()" style="max-width:300px"><option value="">All jobs</option>${myJobs().map(j=>`<option value="${j.id}" ${f.job==j.id?'selected':''}>${esc(j.title)}</option>`).join('')}</select>
  ${r.length?`<div class="card"><table><tr><th>Candidate</th><th>Job</th><th>Skills</th><th>Date</th><th>Status</th></tr>${r.map(a=>`<tr><td><b>${esc(a.name)}</b><br><small class="mut">${esc(a.email)}</small></td><td>${esc((jobs().find(j=>j.id==a.jobId)||{}).title)}</td><td>${esc(a.skills)}</td><td>${a.date}</td>
  <td><select onchange="setStatus(${a.id},this.value)">${STAT.map(s=>`<option ${a.status==s?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</table></div>`:empty('No applicants yet.')}`}
};
/* ---------- actions ---------- */
function withdraw(id){if(!confirm('Withdraw this application?'))return;S.set('apps',apps().filter(a=>a.id!=id));toast('Application withdrawn');draw()}
function saveProfile(e){e.preventDefault();
 U={...U,name:$('#pn').value,title:$('#pt').value,skills:$('#ps').value,about:$('#pa').value};
 S.set('users',S.get('users',[]).map(u=>u.email==U.email?U:u));S.set('session',U);toast('Profile saved ✅');draw()}
function postJob(e){e.preventDefault();
 const j=jobs();j.unshift({id:Date.now(),title:$('#jt').value,company:$('#jc').value,loc:$('#jl').value,type:$('#jy').value,salary:$('#js').value,skills:$('#jk').value,desc:$('#jd').value,by:U.email,posted:new Date().toLocaleDateString()});
 S.set('jobs',j);toast('Job published 🚀');go('mine')}
function delJob(id){if(!confirm('Delete this job and its applications?'))return;S.set('jobs',jobs().filter(j=>j.id!=id));S.set('apps',apps().filter(a=>a.jobId!=id));toast('Job deleted');draw()}
function setStatus(id,s){S.set('apps',apps().map(a=>a.id==id?{...a,status:s}:a));toast('Status: '+s)}
draw();
