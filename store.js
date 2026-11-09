const S={
 get(k,d){try{const v=JSON.parse(localStorage.getItem('cn_'+k));return v??d}catch(e){return d}},
 set(k,v){localStorage.setItem('cn_'+k,JSON.stringify(v))},
 user(){return this.get('session',null)},
 init(){
  if(this.get('init'))return;
  this.set('users',[
   {name:'Aisha Khan',email:'seeker@nova.com',pass:'seeker123',role:'seeker',title:'Frontend Developer',skills:'HTML, CSS, JavaScript',about:'Passionate about building clean, fast interfaces.'},
   {name:'Nova Tech HR',email:'recruiter@nova.com',pass:'recruiter123',role:'recruiter',company:'Nova Tech'}]);
  const J=(id,title,company,loc,type,salary,skills,desc)=>({id,title,company,loc,type,salary,skills,desc,by:'recruiter@nova.com',posted:new Date().toLocaleDateString()});
  this.set('jobs',[
   J(1,'Frontend Developer','Nova Tech','Hyderabad','Full-time','₹8–12 LPA','HTML, CSS, React','Build beautiful, responsive web apps with our product team.'),
   J(2,'Backend Engineer','CloudNest','Bangalore','Full-time','₹12–18 LPA','Node.js, SQL','Design scalable APIs and services.'),
   J(3,'UI/UX Designer','PixelCraft','Remote','Contract','₹6–10 LPA','Figma, Research','Craft delightful user experiences.'),
   J(4,'Data Analyst','InsightHub','Warangal','Full-time','₹5–8 LPA','Excel, SQL, Python','Turn data into decisions for business teams.'),
   J(5,'Marketing Intern','BrightAds','Remote','Internship','₹15k/month','SEO, Writing','Learn digital marketing hands-on.'),
   J(6,'Mobile App Developer','AppForge','Pune','Full-time','₹10–15 LPA','Flutter, Firebase','Ship Android and iOS apps used by thousands.'),
   J(7,'DevOps Engineer','Nova Tech','Hyderabad','Full-time','₹14–20 LPA','AWS, Docker, CI/CD','Own our cloud infrastructure and pipelines.'),
   J(8,'Content Writer','WordWave','Remote','Part-time','₹20k/month','Writing, Editing','Create engaging blogs and social content.')]);
  this.set('apps',[]);this.set('saved',{});this.set('init',1);
 }
};
