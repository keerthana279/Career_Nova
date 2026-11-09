/* Career Nova extras: Resume Check, AI Mock Interview, Courses (runs after dashboard.js) */
let RT='',FN='',MI=null,CF='All';
const RS=()=>S.get('resumes',{}),myRes=()=>RS()[U.email];
const CLICHE=['hard working','hardworking','team player','responsible for','results-oriented','results oriented','detail oriented','detail-oriented','self motivated','self-motivated','good communication skills','fast learner','quick learner','dynamic','challenging position','reputed organization','think out of the box','go-getter','passionate about'];
const VERBS=['built','developed','designed','led','created','implemented','improved','increased','reduced','launched','managed','optimized','automated','delivered','analyzed','deployed','organized','mentored','achieved','engineered'];
const WEAK=['responsible for','worked on','helped','assisted','involved in','duties included','tried to'];
const TPL=['to obtain a challenging position in a reputed organization where i can utilize my skills and contribute to the growth of the company','hard working team player with good communication skills and ability to learn quickly seeking opportunity to grow','responsible for developing and maintaining web applications and working with team members to deliver projects on time'];
const SEC={Summary:/summary|objective|profile/i,Education:/education|b\.?tech|degree|university|college/i,Experience:/experience|internship|employment/i,Projects:/projects?/i,Skills:/skills/i,Certifications:/certif|course/i};
const words=t=>t.toLowerCase().replace(/[^a-z0-9+#. ]/g,' ').split(/\s+/).filter(Boolean);
const shingles=t=>{const w=words(t),s=new Set();for(let i=0;i+4<w.length;i++)s.add(w.slice(i,i+5).join(' '));return s};
const overlap=(a,b)=>{if(!a.size||!b.size)return 0;let c=0;a.forEach(x=>b.has(x)&&c++);return c/a.size};
const SAMPLE="Aisha Khan\naisha@example.com | +91 98765 43210 | github.com/aisha\n\nSummary\nFrontend developer who builds fast, accessible web apps.\n\nEducation\nB.Tech Computer Science, 2026\n\nProjects\nBuilt a job portal with HTML, CSS and JavaScript used by 200 students.\nDesigned a responsive dashboard that reduced page load time by 35%.\n\nSkills\nHTML, CSS, JavaScript, React, Git\n\nCertifications\nFrontend course completed";
function analyze(text){
 const w=words(text),n=w.length,low=text.toLowerCase(),sug=[];let sc=0;
 const have=Object.keys(SEC).filter(k=>SEC[k].test(text)),miss=Object.keys(SEC).filter(k=>!have.includes(k));
 sc+=Math.round(30*have.length/6);if(miss.length)sug.push('Add missing section(s): '+miss.join(', ')+'.');
 const em=/[\w.-]+@[\w.-]+\.\w+/.test(text),ph=/\+?\d[\d\s-]{8,}/.test(text),ln=/linkedin|github/i.test(text);
 sc+=(em?4:0)+(ph?3:0)+(ln?3:0);if(!em)sug.push('Add a professional email address.');if(!ph)sug.push('Add a phone number.');if(!ln)sug.push('Add your LinkedIn or GitHub link.');
 const vb=VERBS.filter(v=>low.includes(v)).length;sc+=Math.min(15,vb*3);if(vb<5)sug.push('Start bullet points with strong action verbs such as built, designed, improved, led.');
 const weak=WEAK.filter(x=>low.includes(x));if(weak.length)sug.push('Replace weak phrases ('+weak.join(', ')+') with specific achievements.');
 const met=(text.match(/\d+\s?(%|\+|k\b|users|customers|projects|ms|students)/gi)||[]).length;sc+=Math.min(15,met*5);if(met<3)sug.push('Quantify results with numbers, e.g. "reduced load time by 40%".');
 sc+=n>=250&&n<=800?15:n>=100&&n<=1000?8:3;if(n<250)sug.push('Resume is short ('+n+' words). Add projects, skills and achievements.');if(n>800)sug.push('Resume is long ('+n+' words). Keep it to 1-2 pages.');
 const fq={};jobs().forEach(j=>j.skills.split(',').forEach(s=>{s=s.trim().toLowerCase();if(s)fq[s]=(fq[s]||0)+1}));
 const top=Object.keys(fq).sort((a,b)=>fq[b]-fq[a]).slice(0,10),gap=top.filter(s=>!low.includes(s));
 sc+=Math.round(15*(top.length-gap.length)/Math.max(1,top.length));if(gap.length)sug.push('Skills in demand missing from your resume: '+gap.slice(0,5).join(', ')+' (add only those you really have).');
 const sh=shingles(text),tp=Math.max(...TPL.map(t=>overlap(sh,shingles(t))));
 let op=0,who='';Object.entries(RS()).filter(([e])=>e!=U.email).forEach(([e,r])=>{const o=overlap(sh,shingles(r.text));if(o>op){op=o;who=r.name}});
 const cl=CLICHE.filter(c=>low.includes(c)),ss=text.split(/[.\n]/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>25),rep=ss.length-new Set(ss).size;
 const sim=Math.min(100,Math.round(Math.max(tp,op)*100+cl.length*3+rep*4));
 if(op>.2)sug.push('Large overlap with another resume saved in this browser ('+who+'). Rewrite in your own words.');
 if(tp>.1)sug.push('Some lines match common resume templates. Replace them with your own details.');
 if(cl.length)sug.push('Overused phrases: '+cl.slice(0,6).join(', ')+'. Show these qualities with examples instead.');
 if(rep)sug.push(rep+' repeated sentence(s) found. Remove duplicates.');
 return{score:Math.min(100,sc),sim,have,sug,n,date:new Date().toLocaleDateString()};
}
const ring=(v,l,inv)=>{const g=inv?100-v:v,c=g>=70?'#1a8f44':g>=45?'#d98a00':'#e63757';return `<div class="ring" style="background:conic-gradient(${c} ${v*3.6}deg,#e4e7f7 0)"><div><b>${v}%</b><small>${l}</small></div></div>`};
const lib=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
async function upRes(f){if(!f)return;const ext=f.name.split('.').pop().toLowerCase();let t='';
 try{if(ext=='txt'||ext=='md')t=await f.text();
 else if(ext=='docx'){await lib('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');t=(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value}
 else if(ext=='pdf'){const B='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';await lib(B+'pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc=B+'pdf.worker.min.js';const p=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;for(let i=1;i<=p.numPages;i++)t+=(await(await p.getPage(i)).getTextContent()).items.map(x=>x.str).join(' ')+'\n'}
 }catch(e){return toast('Could not read this file (internet needed for PDF/DOCX). Paste the text instead.')}
 if(!t.trim())return toast('No text found. Please paste your resume text.');
 RT=t;FN=f.name;draw();toast('File loaded. Press Analyze.')}
function runRes(){const t=RT.trim();if(t.length<80)return toast('Please add your resume text first');
 const a=analyze(t),all=RS();all[U.email]={...a,text:RT,name:U.name,fname:FN||'pasted text'};S.set('resumes',all);draw();toast('Resume analyzed ✅')}
const resOut=a=>`<div class="grid" style="margin-top:18px"><div class="card center">${ring(a.score,'Resume score')}</div><div class="card center">${ring(a.sim,'Similarity',1)}<p class="mut">Originality ${100-a.sim}% (lower similarity is better)</p></div></div>
<div class="card"><h3>Suggested changes</h3><ul>${(a.sug.length?a.sug:['Looks strong. Keep it updated for each application.']).map(s=>'<li>'+esc(s)+'</li>').join('')}</ul><p class="mut">Sections found: ${a.have.join(', ')||'none'} · ${a.n} words</p></div>
<p class="mut" style="margin-top:10px">ℹ️ Similarity is checked offline against common resume templates and other resumes saved in this browser, not the whole internet. Edit the text and analyze again to improve.</p>`;
V.resume=()=>{const r=myRes();if(RT===''&&r)RT=r.text;
 return `<h2>Resume check 📎</h2><div class="card"><label>Upload resume (.txt, .pdf, .docx) or paste text</label><input type="file" id="rf" accept=".txt,.md,.pdf,.docx" onchange="upRes(this.files[0])">
 <textarea id="rt" rows="12" placeholder="Paste your resume text here..." oninput="RT=this.value">${esc(RT)}</textarea>
 <button class="btn" onclick="runRes()">🔍 Analyze &amp; save</button> <button class="btn ghost" onclick="RT=SAMPLE;FN='sample.txt';draw()">Load sample</button> ${r?'<span class="mut"> Saved: '+r.date+' · '+esc(r.fname)+'</span>':''}</div>${r&&r.text==RT?resOut(r):''}`};
function viewRes(e){const r=RS()[e];modal(`<h2>${esc(r.name)}'s resume</h2><p class="mut">Score ${r.score}% · Similarity ${r.sim}% · ${esc(r.fname)}</p><br><pre class="res">${esc(r.text)}</pre><br><button class="btn ghost" onclick="closeM()">Close</button>`)}
const _cand=V.cand;V.cand=()=>_cand().split('<tr>').map((r,i)=>{const m=r.match(/<small class="mut">([^<]*)<\/small>/);return i&&m&&RS()[m[1]]?r.replace('</select></td></tr>','</select> <button class="btn sm ghost" onclick="viewRes(\''+m[1]+'\')">📎 Resume</button></td></tr>'):r}).join('<tr>');
/* ---- Mock interview (built-in rule-based interviewer) ---- */
const QB={Frontend:[['Explain the difference between let, const and var in JavaScript.','scope,hoisting,block,reassign'],['How does the CSS box model work?','margin,padding,border,content'],['What is the virtual DOM and why is it used?','react,diff,render,performance'],['How do you make a website responsive?','media quer,flexbox,grid,mobile'],['What happens when you type a URL in the browser?','dns,http,server,render']],
Backend:[['What is REST and what are common HTTP methods?','get,post,put,delete,stateless'],['SQL versus NoSQL: when would you use each?','schema,scal,relation,document'],['How does token based authentication work?','jwt,token,login,verify,password'],['What is a database index?','query,speed,lookup,trade'],['How do you handle errors in an API?','status,try,catch,message,log']],
'Data Analyst':[['What is the difference between WHERE and HAVING in SQL?','group,aggregate,filter,rows'],['How do you handle missing data?','remove,impute,mean,median'],['Explain correlation versus causation.','relationship,cause,example,variable'],['How would you present insights to a non-technical team?','chart,story,simple,decision'],['What is a JOIN? Name its types.','inner,left,right,table']],
'HR / Behavioural':[['Tell me about yourself.','education,skills,project,goal'],['Describe a challenge you faced and how you solved it.','situation,task,action,result'],['Why should we hire you?','skills,value,learn,team'],['Tell me about a time you worked in a team.','team,role,conflict,outcome'],['Where do you see yourself in five years?','grow,learn,goal,role']]};
function grade(a,kw){const low=a.toLowerCase(),w=words(a).length,k=kw.split(','),hit=k.filter(x=>low.includes(x)),fill=(low.match(/\b(um|uh|like|basically|actually|you know)\b/g)||[]).length,star=/(situation|task|action|result|for example|for instance|because|therefore)/.test(low),tips=[];
 const s=Math.round(40*hit.length/k.length+25*Math.min(1,w/60)+20*(star?1:0)+15*Math.max(0,1-fill/5)-(w>200?8:0));
 if(hit.length<k.length)tips.push('Mention key ideas: '+k.filter(x=>!hit.includes(x)).join(', '));if(w<40)tips.push('Add more detail (aim for 50-120 words).');if(!star)tips.push('Add an example or use the STAR method (Situation, Task, Action, Result).');if(fill>1)tips.push('Reduce filler words.');if(w>200)tips.push('Keep your answer concise.');
 return{s:Math.max(0,Math.min(100,s)),tips}}
const hist=()=>S.get('mock',{})[U.email]||[],avg=()=>Math.round(MI.a.reduce((s,x)=>s+x.s,0)/MI.a.length);
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function startMI(t){MI={t,q:QB[t].slice().sort(()=>Math.random()-.5),i:0,a:[]};draw()}
function say(){if(!window.speechSynthesis)return toast('Speech not supported');speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(MI.q[MI.i][0]))}
function mic(){const r=new SR();r.lang='en-IN';r.onresult=e=>{$('#ans').value+=' '+e.results[0][0].transcript};r.start();toast('Listening... speak now')}
function sendA(){const t=$('#ans').value.trim();if(words(t).length<5)return toast('Please write a fuller answer');
 MI.a.push({t,...grade(t,MI.q[MI.i][1])});MI.i++;
 if(MI.i>=MI.q.length){const all=S.get('mock',{}),l=all[U.email]||[];l.push({d:new Date().toLocaleDateString(),t:MI.t,s:avg()});all[U.email]=l;S.set('mock',all)}draw()}
V.mock=()=>{
 if(!MI)return `<h2>AI mock interview 🎤</h2><div class="card"><p>Pick a track. You get 5 questions; answer by typing or speaking and receive instant scoring and feedback.</p><br><div class="chips">${Object.keys(QB).map(t=>`<span class="chip" onclick="startMI('${t}')">${t}</span>`).join('')}</div></div><h3 style="margin:18px 0 8px">Past interviews</h3>${hist().length?`<div class="card"><table><tr><th>Date</th><th>Track</th><th>Score</th></tr>${hist().slice().reverse().map(h=>`<tr><td>${h.d}</td><td>${h.t}</td><td><span class="badge">${h.s}%</span></td></tr>`).join('')}</table></div>`:empty('No interviews yet. Start one above.')}`;
 if(MI.i<MI.q.length)return `<h2>${MI.t} · Question ${MI.i+1}/${MI.q.length}</h2><div class="prog"><i style="width:${MI.i/MI.q.length*100}%"></i></div><div class="card"><p class="q">🤖 ${esc(MI.q[MI.i][0])}</p><button class="btn sm ghost" onclick="say()">🔊 Listen</button> ${SR?'<button class="btn sm ghost" onclick="mic()">🎙️ Speak</button>':''}<br><br><textarea id="ans" rows="6" placeholder="Type your answer here..."></textarea><button class="btn" onclick="sendA()">Submit answer</button> <button class="btn ghost" onclick="MI=null;draw()">Quit</button></div>`;
 const v=avg();return `<h2>Interview result 🎯</h2><div class="card center">${ring(v,'Overall')}<p>${v>=75?'Excellent! You are interview ready.':v>=50?'Good start. Work on the tips below.':'Keep practising. Use examples and key terms.'}</p></div><br>${MI.a.map((x,i)=>`<div class="card" style="margin-bottom:12px"><b>Q${i+1}. ${esc(MI.q[i][0])}</b> <span class="badge">${x.s}%</span><p class="mut" style="margin:8px 0">Your answer: ${esc(x.t)}</p>${x.tips.length?'<ul>'+x.tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'<p>✅ Strong answer!</p>'}</div>`).join('')}<button class="btn" onclick="startMI('${MI.t}')">Try again</button> <button class="btn ghost" onclick="MI=null;draw()">Finish</button>`};
/* ---- Courses ---- */
const CO=[['web','HTML & CSS Foundations','Web','Beginner',10,'html,css','https://developer.mozilla.org/en-US/docs/Learn',['HTML structure','Forms and tables','CSS selectors','Flexbox and Grid','Responsive design']],
['js','JavaScript Essentials','Web','Beginner',15,'javascript','https://www.freecodecamp.org/learn',['Variables and types','Functions','DOM events','Async and fetch','Mini project']],
['react','React Fundamentals','Web','Intermediate',12,'react','https://react.dev/learn',['Components and props','State and hooks','Lists and forms','Effects','Build a small app']],
['node','Node.js and Express APIs','Backend','Intermediate',14,'node.js,express','https://nodejs.org/en/learn',['Node basics','Express routing','REST design','Auth with JWT','Deploy an API']],
['sql','SQL for Beginners','Data','Beginner',8,'sql','https://sqlbolt.com',['SELECT and WHERE','JOINs','Aggregates','Subqueries','Design a schema']],
['py','Python Programming','Programming','Beginner',20,'python','https://docs.python.org/3/tutorial/',['Syntax and types','Control flow','Functions','Modules and files','Mini project']],
['dsa','Data Structures and Algorithms','Programming','Intermediate',25,'algorithms,dsa','https://roadmap.sh',['Arrays and strings','Linked lists','Stacks and queues','Trees','Sorting and searching']],
['git','Git and GitHub','Tools','Beginner',5,'git,github','https://docs.github.com/en/get-started',['Init and commit','Branching','Merging','Pull requests','Collaboration']],
['cv','Resume and LinkedIn Mastery','Career','Beginner',3,'linkedin,resume','',['Choose a clean format','Write impact bullets','Add metrics','Tailor to each job','Optimise LinkedIn']],
['soft','Interview and Soft Skills','Career','Beginner',4,'communication,teamwork','',['Introduce yourself','STAR method','Body language','Salary talk','Follow-up email']]];
const pgs=()=>S.get('prog',{}),dn=id=>pgs()[U.email+':'+id]||[],pct=c=>Math.round(100*dn(c[0]).length/c[7].length);
const cc=c=>{const p=pct(c);return `<div class="card" style="margin-bottom:12px"><div class="job" style="margin:0"><div class="logo">🎓</div><div style="flex:1"><h3>${c[1]}</h3><p class="mut">${c[2]} · ${c[3]} · ${c[4]} hrs</p></div><button class="btn sm" onclick="openC('${c[0]}')">${p?(p==100?'Review ✓':'Continue'):'Start'}</button></div><div class="prog"><i style="width:${p}%"></i></div><small class="mut">${p}% complete</small></div>`};
V.courses=()=>{const r=myRes(),low=r?r.text.toLowerCase():'',rec=r?CO.filter(c=>c[5].split(',').every(s=>!low.includes(s))&&pct(c)<100).slice(0,3):[],cats=['All',...new Set(CO.map(c=>c[2]))];
 return `<h2>Learn &amp; upskill 🎓</h2>${rec.length?`<h3 style="margin-bottom:8px">Recommended from your resume</h3>${rec.map(cc).join('')}`:`<p class="mut" style="margin-bottom:12px">Tip: analyze your resume to get personalised course suggestions.</p>`}<h3 style="margin:14px 0 8px">All courses</h3><div class="chips">${cats.map(c=>`<span class="chip ${c==CF?'on':''}" onclick="CF='${c}';draw()">${c}</span>`).join('')}</div>${CO.filter(c=>CF=='All'||c[2]==CF).map(cc).join('')}`};
function openC(id){const c=CO.find(x=>x[0]==id),d=dn(id);modal(`<h2>${c[1]}</h2><p class="mut">${c[3]} · ${c[4]} hrs</p><br>${c[7].map((l,i)=>`<label class="lesson"><input type="checkbox" ${d.includes(i)?'checked':''} onchange="tick('${id}',${i},this.checked)"> ${l}</label>`).join('')}<br>${c[6]?`<a class="btn sm" href="${c[6]}" target="_blank" rel="noopener">Open learning resource ↗</a> `:''}<button class="btn ghost sm" onclick="closeM();draw()">Close</button>`)}
function tick(id,i,on){const a=pgs(),k=U.email+':'+id,l=new Set(a[k]||[]);on?l.add(i):l.delete(i);a[k]=[...l];S.set('prog',a);if(on)toast('Lesson completed ✅')}
if(U.role=='seeker')nav.seeker.push(['resume','📎','Resume Check'],['mock','🎤','Mock Interview'],['courses','🎓','Courses']);
draw();
