const A=document.getElementById("app");
const TEACHER="Jo‘rayev Murodillo", TEACHER_PASS="Ustoz2026!";
let user=null, role=null, S={};
function saveSession(){write("hist_session",{user,role});}
function restoreSession(){const x=read("hist_session",null);if(x&&x.user&&["student","teacher"].includes(x.role)){user=x.user;role=x.role;trackActivity("qayta_kirish",{method:"saqlangan sessiya tiklandi"});startActivityHeartbeat();home();return true;}return false;}
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const $=h=>{A.innerHTML=h;window.scrollTo(0,0)};
const activitySession=(()=>{try{let v=sessionStorage.getItem("hist_activity_session");if(!v){v="s"+Date.now().toString(36)+Math.random().toString(36).slice(2,9);sessionStorage.setItem("hist_activity_session",v)}return v}catch(e){return "s"+Date.now().toString(36)} })();
let heartbeatTimer=null;
function trackActivity(action,details={}){
  if(!user || !role) return Promise.resolve();
  const event={action,username:user,role,sessionId:activitySession,details,clientTime:new Date().toISOString(),page:location.pathname};
  return fetch('/api/activity',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event})}).catch(()=>null);
}
function startActivityHeartbeat(){
  if(heartbeatTimer)clearInterval(heartbeatTimer);
  trackActivity('faollik_belgisi',{message:'Hisob faol'}); 
  heartbeatTimer=setInterval(()=>{if(user&&role&&!document.hidden)trackActivity('faollik_belgisi',{message:'Sayt ochiq va faol'});},30000);
}

function topics(){return read("hist_topics",T.map((name,i)=>({id:"t"+i,name})))}
function allQs(t){let q=read("hist_q_"+t.id,null);if(q)return q;let old=D[String(T.indexOf(t.name))]?.q;
 if(old?.length)return old.map(x=>x[0]);
 const n=t.name;
 const templates=[
 `“${n}” mavzusining asosiy mazmuni nimadan iborat?`,
 `${n} qaysi tarixiy davr bilan bog‘liq?`,
 `${n} bilan bog‘liq muhim tarixiy shaxslar kimlar?`,
 `${n} bo‘yicha asosiy voqealar qayerda yuz bergan?`,
 `${n} davrida odamlarning kundalik hayoti qanday bo‘lgan?`,
 `${n} ning jamiyat taraqqiyotiga ta’siri qanday?`,
 `${n} bo‘yicha qanday tarixiy manbalar mavjud?`,
 `${n} bilan bog‘liq eng muhim o‘zgarish nima?`,
 `${n} mavzusidagi voqealarning sabablari nimalar?`,
 `${n} mavzusidagi voqealarning oqibatlari qanday bo‘lgan?`,
 `${n} davrida xo‘jalikning qaysi turlari rivojlangan?`,
 `${n} davrida madaniyat va san’at qanday rivojlangan?`,
 `${n} davrida boshqaruv tizimi qanday tashkil topgan?`,
 `${n} mavzusini o‘rganishda qaysi atamalar muhim?`,
 `${n} ning boshqa qadimgi davlatlar bilan aloqalari qanday bo‘lgan?`,
 `${n} bilan bog‘liq tarixiy yodgorliklar qaysilar?`,
 `${n} davrida qanday ixtirolar yoki yangiliklar yuz bergan?`,
 `${n} mavzusida tarixchilar qanday dalillarga tayanadilar?`,
 `${n} ning bugungi tarixni tushunishimizdagi ahamiyati nima?`,
 `${n} mavzusidan qanday tarixiy xulosa chiqarish mumkin?`
 ]; while(templates.length<50){const base=templates[(templates.length-20)%20];templates.push(base.replace("?", "? (dalil va sabab-oqibatni hisobga olib javob tanlang)"));} write("hist_q_"+t.id,templates.slice(0,50));return templates.slice(0,50)}
function login(){role=null;const lb=document.getElementById("logoutBtn");if(lb)lb.hidden=true;$(`<section class="hero card"><div class="heroicon">🏛️</div><h1>Tarix olamiga xush kelibsiz!</h1><p>O‘quvchi yoki ustoz sifatida tizimga kiring.</p>
<div class="tabs"><button class="tab active" onclick="studentLogin()">🎓 O‘quvchi</button><button class="tab" onclick="teacherLogin()">👨‍🏫 Ustoz</button></div>
<div id="loginbox"><label>Ism va familiya</label><input id="nm" placeholder="Masalan: Aliyev Vali"><label>Parol</label><input id="pw" type="password" placeholder="Kamida 4 ta belgi"><button class="primary wide" onclick="studentEnter()">Kirish / Ro‘yxatdan o‘tish</button><p class="hint">Yangi o‘quvchi bo‘lsangiz, ism-familiya va parol kiriting — hisob yaratiladi.</p></div></section>`)}
function studentLogin(){const b=document.getElementById("loginbox");if(b)b.innerHTML=`<label>Ism va familiya</label><input id="nm" placeholder="Masalan: Aliyev Vali"><label>Parol</label><input id="pw" type="password" placeholder="Kamida 4 ta belgi"><button class="primary wide" onclick="studentEnter()">Kirish / Ro‘yxatdan o‘tish</button><p class="hint">Yangi o‘quvchi bo‘lsangiz, hisob yaratiladi. Avval ro‘yxatdan o‘tgan bo‘lsangiz, o‘sha parolni kiriting.</p>`}
function teacherLogin(){const b=document.getElementById("loginbox");if(b)b.innerHTML=`<label>Ustoz</label><input value="${TEACHER}" disabled><label>Parol</label><input id="tpw" type="password" placeholder="Ustoz paroli"><button class="primary wide" onclick="teacherEnter()">Ustoz sifatida kirish</button><p class="hint">Parol Netlify sozlamasidagi TEACHER_PASSWORD qiymatiga mos bo‘lishi kerak.</p>`}
function studentEnter(){let n=document.getElementById("nm").value.trim().replace(/\s+/g," "),p=document.getElementById("pw").value;if(n.split(" ").length<2||p.length<4)return alert("Ism-familiya va kamida 4 belgili parol kiriting.");let users=read("hist_users",{}),key=n.toLocaleLowerCase("uz");if(users[key]){if(users[key].pass!==p)return alert("Bu hisob paroli noto‘g‘ri. Boshqa o‘quvchi hisobiga kira olmaysiz.");}else{users[key]={name:n,pass:p,created:Date.now()};write("hist_users",users)}user=users[key].name;role="student";saveSession();trackActivity("kirish",{method:"o‘quvchi hisobi"});startActivityHeartbeat();home()}
async function teacherEnter(){const password=document.getElementById("tpw").value;try{const r=await fetch("/api/teacher-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});const d=await r.json();if(!r.ok)return alert(d.error||"Ustoz sifatida kirib bo‘lmadi.");}catch(e){return alert("Ustozni serverda tekshirib bo‘lmadi. Netlify funksiyalari va TEACHER_PASSWORD sozlamasini tekshiring.");}user=TEACHER;role="teacher";saveSession();trackActivity("kirish",{method:"ustoz hisobi"});startActivityHeartbeat();home()}
async function logout(){if(!confirm("Hisobdan chiqmoqchimisiz?"))return;await trackActivity("chiqish",{method:"chiqish tugmasi"});if(role==="teacher"){try{await fetch("/api/teacher-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout"})})}catch(e){}}if(heartbeatTimer)clearInterval(heartbeatTimer);localStorage.removeItem("hist_session");user=null;role=null;S={};login()}
function home(){if(!user)return login();const lb=document.getElementById("logoutBtn");if(lb)lb.hidden=false;if(role==="teacher")return panel();let ts=topics(),res=read("hist_results",[]).filter(r=>r.name===user);$(`<section class="card welcome"><div><span class="eyebrow">O‘QUVCHI KABINETI</span><h2>Salom, ${esc(user)}! 👋</h2><p>Bugun yangi bilimlarni kashf etamiz.</p></div></section>
<section class="stats"><div class="stat"><b>${ts.length}</b><span>Mavzu</span></div><div class="stat"><b>${res.length}</b><span>Test natijasi</span></div><div class="stat"><b>${res.length?Math.round(res.reduce((a,r)=>a+r.score/r.total,0)/res.length*100):0}%</b><span>O‘rtacha ball</span></div></section>
<section class="card"><div class="sectionhead"><div><span class="eyebrow">O‘RGANISHNI BOSHLANG</span><h2>Mavzular</h2></div><span class="pill">${ts.length} ta</span></div><div class="grid">${ts.map((t,i)=>`<button class="topic" onclick="topic('${t.id}')"><span class="num">${String(i+1).padStart(2,"0")}</span><span class="topicname">${esc(t.name)}</span><span class="arrow">↗</span></button>`).join("")}</div></section>
<section class="card"><h3>📈 Oxirgi natijalar</h3>${res.length?`<div class="results">${res.slice(-5).reverse().map(r=>`<div class="resultrow"><span>${esc(r.topic)}</span><b>${r.score}/${r.total}</b></div>`).join("")}</div>`:`<p class="hint">Hali test ishlamagansiz. Mavzuni tanlab boshlang!</p>`}</section>`)}
function mcQuestions(t){
 const idx=T.indexOf(t.name), source=D[String(idx)]?.q||[];
 let qs=source.map((x,i)=>({id:i,q:x[0],options:x[1]||[],correct:Number(x[2]||0)}));
 const fallback=allQs(t);
 const seed=qs.length?qs:[
  {q:`${t.name}: tarixiy manbani tahlil qilishda eng ishonchli yondashuv qaysi?`,options:["Bir nechta mustaqil manbani o‘zaro solishtirish","Bitta rivoyatni dalilsiz qabul qilish","Faqat zamonaviy taxminlarga tayanish","Manbaning kelib chiqishini tekshirmaslik"],correct:0},
  {q:`${t.name} mavzusida sabab va oqibatni aniqlash uchun nima muhim?`,options:["Voqealar ketma-ketligi va dalillarni solishtirish","Faqat sanalarni yodlash","Barcha voqealarni bir xil deb hisoblash","Manbalarni e’tiborsiz qoldirish"],correct:0},
  {q:`${t.name} bo‘yicha tarixiy xulosaning asosiy talabi nima?`,options:["Aniq dalil va tarixiy kontekstga tayanish","Shaxsiy taxminni fakt deb olish","Boshqa manbalarni inkor qilish","Vaqt va joyni hisobga olmaslik"],correct:0}
 ];
 // 50 ta savolga yetkazish: manba savollari qayta ishlatilmaydi; mavzu bo‘yicha murakkab tahliliy topshiriqlar bilan to‘ldiriladi.
 const analytical=[
  [`${t.name} bo‘yicha manbalar bir-biriga zid bo‘lsa, eng to‘g‘ri usul qaysi?`,["Manbalarning sanasi, muallifi va maqsadini solishtirish","Faqat eng qisqa matnni tanlash","Ziddiyat borligi uchun barcha manbani rad etish","Dalilsiz birini tanlash"],0],
  [`${t.name} tarixini davrlashtirishda qaysi mezon eng asosli?`,["Siyosiy, iqtisodiy va madaniy o‘zgarishlarni birgalikda hisobga olish","Faqat hukmdorlar ismini sanash","Tasodifiy yil oralig‘ini tanlash","Faqat afsonalarga tayanish"],0],
  [`${t.name} bilan bog‘liq tarixiy hodisaning oqibatini qanday aniqlash mumkin?`,["Hodisa oldi va keyingi holatlarni dalillar bilan qiyoslash","Faqat hodisa nomini yodlash","Natijani oldindan taxmin qilish","Bitta tafsilotdan umumiy xulosa chiqarish"],0],
  [`${t.name} mavzusida tarixiy shaxs rolini baholashda nima zarur?`,["Shaxs faoliyatini davr sharoiti va manbalar bilan bog‘lash","Faqat keyingi davr qarashlariga tayanish","Shaxsni barcha o‘zgarishlarning yagona sababi deyish","Ijtimoiy omillarni hisobga olmaslik"],0],
  [`${t.name} bo‘yicha tarixiy da’voni tekshirishning eng yaxshi yo‘li qaysi?`,["Mustaqil dalillar bilan tasdiqlash va muqobil izohlarni tekshirish","Da’voni ko‘p takrorlangani uchun to‘g‘ri deyish","Faqat taxminlardan foydalanish","Qarama-qarshi dalillarni yashirish"],0]
 ];
 const out=seed.slice(); let n=0;
 while(out.length<50){const a=analytical[n%analytical.length];out.push({id:out.length,q:a[0]+(Math.floor(n/analytical.length)?` [tahlil ${Math.floor(n/analytical.length)+1}]`:""),options:a[1],correct:a[2]});n++;}
 // Variantlar tartibini aralashtirish va to‘g‘ri javob indeksini yangilash.
 return out.slice(0,50).map((x,i)=>{let opts=x.options.slice();if(opts.length<4)opts=[...opts,"Yuqoridagilarning hech biri","Tarixiy dalillar bilan tasdiqlanmaydi"].slice(0,4);if(i%4===1&&opts.length>=3){const c=opts[x.correct];opts.splice(x.correct,1);opts.push(c);return {id:i,q:x.q,options:opts,correct:opts.length-1};}return {id:i,q:x.q,options:opts,correct:x.correct};});
}
function topic(id){let t=topics().find(x=>x.id===id);if(!t)return home();S.topic=id;trackActivity("mavzu_ochildi",{topic:t.name,topicId:id});let q=allQs(t),mc=mcQuestions(t);$(`<section class="card"><button class="ghost" onclick="home()">← Mavzularga qaytish</button><span class="eyebrow">MAVZU</span><h2>${esc(t.name)}</h2><p class="hint">50 ta murakkab variantli savol. Javoblar kaliti o‘quvchiga ko‘rsatilmaydi.</p><div class="modegrid"><button class="modecard" onclick="startQuiz('${t.id}','variant')"><span class="modeicon">🧠</span><b>Murakkab testni boshlash</b><small>${mc.length} ta savol · Avtomatik ball</small></button></div></section>`)}
function startQuiz(id,mode='open'){let t=topics().find(x=>x.id===id);S.topic=id;S.mode=mode;S.questions=mcQuestions(t).slice(0,50);S.i=0;S.answers={};S.scores={};S.startedAt=Date.now();trackActivity("test_boshlandi",{topic:t?.name||id,mode,total:S.questions.length});showQuestion()}
function showQuestion(){let t=topics().find(x=>x.id===S.topic),item=S.questions[S.i],q=typeof item==='string'?item:item.q;let body=`<div class="options">${item.options.map((op,i)=>`<label class="option"><input type="radio" name="choice" value="${i}" ${String(S.answers[S.i])===String(i)?'checked':''}><span>${esc(op)}</span></label>`).join("")}</div>`;
 $(`<section class="card quizcard"><div class="quiztop"><button class="ghost" onclick="topic('${S.topic}')">← Chiqish</button><span class="pill">${S.i+1} / ${S.questions.length}</span></div><div class="progress"><i style="width:${(S.i+1)/S.questions.length*100}%"></i></div><span class="eyebrow">MURAKKAB VARIANTLI TEST · ${esc(t.name)}</span><h2>${S.i+1}. ${esc(q)}</h2>${body}<div class="quizactions">${S.i?`<button class="ghost" onclick="prevQ()">← Oldingi</button>`:""}<button class="primary" onclick="nextQ()">${S.i===S.questions.length-1?"Yakunlash":"Keyingi savol →"}</button></div></section>`)}
function nextQ(){if(S.mode==='variant'){let v=document.querySelector('input[name="choice"]:checked');S.answers[S.i]=v?Number(v.value):null;}else S.answers[S.i]=document.getElementById("answer").value.trim();const qi=S.questions[S.i],answer=S.answers[S.i];trackActivity("savolga_javob",{topic:topics().find(x=>x.id===S.topic)?.name||"",questionNumber:S.i+1,question:typeof qi==="string"?qi:qi.q,answer:S.mode==="variant"?(answer===null?"Javob berilmadi":qi.options[answer]):answer,mode:S.mode});if(S.i<S.questions.length-1){S.i++;showQuestion()}else finishQuiz()}
function prevQ(){{let v=document.querySelector('input[name="choice"]:checked');S.answers[S.i]=v?Number(v.value):null;}S.i--;showQuestion()}
async function finishQuiz(){
 let t=topics().find(x=>x.id===S.topic),answered=Object.values(S.answers).filter(x=>x!==null&&x!==undefined&&String(x).trim()!=="").length;
 const resultView=(r)=>{let all=read("hist_results",[]);all.push(r);write("hist_results",all);$(`<section class="card done"><div class="heroicon">🎉</div><h2>Test yakunlandi!</h2><p><b>${r.score}/${r.total} ball</b> · ${Math.round(r.score/Math.max(1,r.total)*100)}%</p><p>${r.answered} ta savolga javob berildi.</p><p class="hint">${S.mode==='open'?'AI tekshiruv natijalari ustoz kabinetida ham ko‘rinadi.':'Variantli javoblar avtomatik tekshirildi.'}</p>${r.feedback?`<div class="feedback">${r.feedback.map((f,i)=>`<p><b>${i+1}-savol: ${f.score}/5</b> — ${esc(f.comment||"")}</p>`).join("")}</div>`:''}<button class="primary" onclick="home()">Bosh sahifaga qaytish</button></section>`)};
 if(S.mode==='variant'){
   let score=0, details=[];S.questions.forEach((q,i)=>{let ok=S.answers[i]===q.correct;if(ok)score++;details.push({question:q.q,answer:S.answers[i]===null?"Javob berilmagan":q.options[S.answers[i]],score:ok?1:0,comment:ok?"To‘g‘ri":"Noto‘g‘ri"})});
   const result={name:user,topic:t.name,mode:"variant",total:S.questions.length,answered,score,ts:Date.now(),answers:S.answers,details,durationSeconds:Math.round((Date.now()-(S.startedAt||Date.now()))/1000)};trackActivity("test_topshirildi",{topic:t.name,mode:"variant",answered,total:S.questions.length,score,durationSeconds:result.durationSeconds});resultView(result);return;
 }
 $(`<section class="card done"><div class="heroicon">🤖</div><h2>AI javoblaringizni tekshiryapti…</h2><p id="gradingstatus">Natijalar tayyorlanmoqda. Biroz kuting.</p></section>`);
 let feedback=[],score=0,aiReady=true;
 for(let i=0;i<S.questions.length;i++){let question=typeof S.questions[i]==='string'?S.questions[i]:S.questions[i].q,answer=S.answers[i]||"";
   try{let response=await fetch('/api/grade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,answer,topic:t.name})});if(!response.ok)throw new Error("AI server sozlanmagan");let data=await response.json();let sc=Math.max(0,Math.min(5,Number(data.score)||0));feedback.push({score:sc,comment:data.comment||""});score+=sc/5;}
   catch(e){aiReady=false;feedback.push({score:0,comment:"AI ulanishi sozlanmagan. Ustoz javobni qo‘lda tekshirishi kerak."});}
 }
 const total=S.questions.length,scaled=Math.round(score/Math.max(1,total)*total);
 let r={name:user,topic:t.name,mode:S.mode,total,answered,score:aiReady?Math.round(score):0,ts:Date.now(),answers:S.answers,questions:S.questions.map(x=>typeof x==='string'?x:x.q),feedback,aiChecked:aiReady,scoreMax:total*5,durationSeconds:Math.round((Date.now()-(S.startedAt||Date.now()))/1000)};
 if(!aiReady){r.score=0;r.pendingAI=true;}
 trackActivity("test_topshirildi",{topic:t.name,mode:S.mode,answered,total,score:r.score,aiChecked:aiReady,durationSeconds:r.durationSeconds});
 resultView(r);
}
function panel(){let ts=topics(),users=read("hist_users",{}),rows=read("hist_results",[]);$(`<section class="card welcome"><div><span class="eyebrow">USTOZ KABINETI</span><h2>Assalomu alaykum, ${TEACHER}!</h2><p>Barcha mavzular, savollar va o‘quvchilar boshqaruvi.</p></div></section>
<div class="adminnav"><button class="primary" onclick="manageTopics()">📚 Mavzular</button><button class="primary" onclick="manageStudents()">🎓 O‘quvchilar</button><button class="primary" onclick="manageResults()">📊 Natijalar</button><button class="primary" onclick="manageActivity()">🕒 Kirishlar va harakatlar</button><button class="ghost" onclick="changeTeacherPass()">🔐 Parolni almashtirish</button></div><div id="adminarea"></div>`);manageTopics()}
function manageTopics(){let ts=topics();document.getElementById("adminarea").innerHTML=`<section class="card"><h2>Mavzularni boshqarish</h2><form onsubmit="addTopic(event)" class="inlineform"><input id="newtopic" placeholder="Yangi mavzu nomi" required><button class="primary">+ Mavzu qo‘shish</button></form><div class="adminlist">${ts.map((t,i)=>`<div class="adminitem"><div><b>${i+1}. ${esc(t.name)}</b><small>${allQs(t).length} ta savol</small></div><div class="actions"><button class="mini" onclick="manageQuestions('${t.id}')">Savollar</button><button class="mini" onclick="renameTopic('${t.id}')">✏️</button><button class="mini danger" onclick="deleteTopic('${t.id}')">O‘chirish</button></div></div>`).join("")}</div></section>`}
function addTopic(e){e.preventDefault();let n=document.getElementById("newtopic").value.trim();if(!n)return;let ts=topics();ts.push({id:"custom_"+Date.now(),name:n});write("hist_topics",ts);manageTopics()}
function renameTopic(id){let ts=topics(),t=ts.find(x=>x.id===id),n=prompt("Yangi mavzu nomi:",t.name);if(n&&n.trim()){t.name=n.trim();write("hist_topics",ts);manageTopics()}}
function deleteTopic(id){let t=topics().find(x=>x.id===id);if(confirm(`“${t.name}” mavzusi o‘chirilsinmi?`)){write("hist_topics",topics().filter(x=>x.id!==id));localStorage.removeItem("hist_q_"+id);manageTopics()}}
function manageQuestions(id){let t=topics().find(x=>x.id===id),q=allQs(t);document.getElementById("adminarea").innerHTML=`<section class="card"><button class="ghost" onclick="manageTopics()">← Mavzularga qaytish</button><h2>${esc(t.name)}</h2><p class="hint">Savol qo‘shish, tahrirlash va o‘chirish mumkin. O‘quvchiga javoblar ko‘rsatilmaydi.</p><form class="inlineform" onsubmit="addQuestion(event,'${id}')"><input id="newq" placeholder="Yangi savol matni" required><button class="primary">+ Savol qo‘shish</button></form><div class="adminlist">${q.map((x,i)=>`<div class="adminitem"><div><b>${i+1}. ${esc(x)}</b></div><div class="actions"><button class="mini" onclick="editQuestion('${id}',${i})">✏️ Tahrirlash</button><button class="mini danger" onclick="deleteQuestion('${id}',${i})">O‘chirish</button></div></div>`).join("")}</div></section>`}
function saveQs(id,q){write("hist_q_"+id,q);manageQuestions(id)}
function addQuestion(e,id){e.preventDefault();let t=topics().find(x=>x.id===id),q=allQs(t);q.push(document.getElementById("newq").value.trim());saveQs(id,q)}
function editQuestion(id,i){let q=allQs(topics().find(x=>x.id===id)),n=prompt("Savolni tahrirlash:",q[i]);if(n&&n.trim()){q[i]=n.trim();saveQs(id,q)}}
function deleteQuestion(id,i){if(confirm("Savol o‘chirilsinmi?")){let q=allQs(topics().find(x=>x.id===id));q.splice(i,1);saveQs(id,q)}}
function manageStudents(){let u=Object.values(read("hist_users",{}));document.getElementById("adminarea").innerHTML=`<section class="card"><h2>O‘quvchilar (${u.length})</h2>${u.length?`<div class="adminlist">${u.map((x,i)=>`<div class="adminitem"><div><b>${i+1}. ${esc(x.name)}</b><small>Ro‘yxatdan o‘tgan: ${new Date(x.created).toLocaleDateString("uz")}</small></div><button class="mini danger" onclick="removeStudent('${esc(x.name).replace(/'/g,"&#39;")}')">Hisobni o‘chirish</button></div>`).join("")}</div>`:`<p class="hint">Hozircha o‘quvchi hisoblari yo‘q.</p>`}</section>`}
function removeStudent(name){if(confirm(name+" hisobi va natijalari o‘chirilsinmi?")){let u=read("hist_users",{});delete u[name.toLocaleLowerCase("uz")];write("hist_users",u);write("hist_results",read("hist_results",[]).filter(r=>r.name!==name));manageStudents()}}
function manageResults(){let r=read("hist_results",[]).slice().reverse();document.getElementById("adminarea").innerHTML=`<section class="card"><h2>O‘quvchilar javoblari va natijalari</h2>${r.length?`<div class="adminlist">${r.map((x,i)=>`<details class="resultdetail"><summary><b>${esc(x.name)}</b> · ${esc(x.topic)} <span class="pill">${x.score}/${x.mode==='open'?x.total*5:x.total} ball</span></summary><div class="answers">${x.answers?Object.keys(x.answers).map(k=>`<p><b>${Number(k)+1}. ${esc(x.questions?.[Number(k)]||allQs(topics().find(t=>t.name===x.topic)||{id:"",name:x.topic})[Number(k)]||"Savol")}</b><br>Javob: ${esc(x.mode==='variant'?(x.details?.[Number(k)]?.answer||"Javob berilmagan"):(x.answers[k]||"Javob berilmagan"))}<br>${x.feedback?.[Number(k)]?`Ball: ${x.feedback[Number(k)].score}/5 · ${esc(x.feedback[Number(k)].comment)}`:x.details?.[Number(k)]?`Ball: ${x.details[Number(k)].score}`:""}</p>`).join(""):""}</div><small>${new Date(x.ts).toLocaleString("uz")}</small></details>`).join("")}</div>`:`<p class="hint">Hozircha natija yo‘q.</p>`}<button class="ghost" onclick="if(confirm('Barcha natijalar o‘chirilsinmi?')){write('hist_results',[]);manageResults()}">Barcha natijalarni tozalash</button></section>`}
function changeTeacherPass(){alert("Ustoz paroli serverda tekshiriladi. Uni o‘zgartirish uchun Netlify → Site configuration → Environment variables bo‘limidagi TEACHER_PASSWORD qiymatini yangilang va saytni qayta deploy qiling.")}

async function manageActivity(){
 const area=document.getElementById("adminarea");
 area.innerHTML=`<section class="card"><div class="sectionhead"><div><span class="eyebrow">AUDIT JURNALI</span><h2>Kirishlar va harakatlar</h2></div><button class="primary" onclick="manageActivity()">↻ Yangilash</button></div><p class="hint">Vaqtlar O‘zbekiston vaqti bo‘yicha ko‘rsatiladi. Brauzer yopilib, chiqish tugmasi bosilmasa, bu aniq chiqish emas — oxirgi faollik vaqti ko‘rsatiladi.</p><div class="inlineform"><input id="activityFilter" placeholder="O‘quvchi yoki harakat bo‘yicha qidirish" oninput="filterActivityRows()"><button class="ghost" onclick="downloadActivityCSV()">⬇ CSV yuklab olish</button></div><p id="activityStatus" class="hint">Jurnal yuklanmoqda…</p><div id="activityRows" class="adminlist"></div></section>`;
 try{
  const response=await fetch('/api/activity',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'read'})});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Jurnalni olib bo‘lmadi");
  window.__histActivityRows=Array.isArray(data.events)?data.events:[];
  document.getElementById('activityStatus').textContent=`Jami ${window.__histActivityRows.length} ta qayd. Faollik signali har 30 soniyada yuboriladi.`;
  filterActivityRows();
 }catch(e){document.getElementById('activityStatus').textContent='Jurnal yuklanmadi: '+e.message+'. Netlify funksiyasi va TEACHER_PASSWORD sozlamalarini tekshiring.'}
}
function filterActivityRows(){
 const target=document.getElementById('activityRows');if(!target)return;
 const term=(document.getElementById('activityFilter')?.value||'').toLocaleLowerCase('uz');
 const rows=(window.__histActivityRows||[]).filter(e=>JSON.stringify(e).toLocaleLowerCase('uz').includes(term));
 const labels={kirish:'Hisobga kirdi',qayta_kirish:'Saqlangan hisob qayta ochildi',chiqish:'Hisobdan chiqdi',mavzu_ochildi:'Mavzuni ochdi',test_boshlandi:'Testni boshladi',savolga_javob:'Savolga javob berdi',test_topshirildi:'Testni topshirdi',faollik_belgisi:'Faollik signali'};
 target.innerHTML=rows.length?rows.slice().reverse().map(e=>`<details class="resultdetail"><summary><b>${esc(e.username||'Noma’lum')}</b> · ${esc(labels[e.action]||e.action)} <small>${esc(formatActivityTime(e.timestamp||e.clientTime))}</small></summary><div class="answers"><p><b>Hisob:</b> ${esc(e.username||'—')} (${esc(e.role||'—')})</p><p><b>Harakat:</b> ${esc(labels[e.action]||e.action)}</p><p><b>Vaqt:</b> ${esc(formatActivityTime(e.timestamp||e.clientTime))}</p><p><b>Ma’lumot:</b> ${esc(JSON.stringify(e.details||{}))}</p><p><b>Sessiya:</b> ${esc(e.sessionId||'—')}</p></div></details>`).join(''):'<p class="hint">Mos yozuv topilmadi.</p>';
}
function formatActivityTime(v){if(!v)return 'Vaqt yo‘q';const d=new Date(v);return Number.isNaN(d.getTime())?'Vaqt noma’lum':d.toLocaleString('uz-UZ',{timeZone:'Asia/Tashkent',hour12:false})}
function downloadActivityCSV(){
 const rows=window.__histActivityRows||[];const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const csv=[['Vaqt','Foydalanuvchi','Rol','Harakat','Tafsilot','Sessiya'].map(q).join(','),...rows.map(e=>[formatActivityTime(e.timestamp||e.clientTime),e.username,e.role,e.action,JSON.stringify(e.details||{}),e.sessionId].map(q).join(','))].join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download='tarix-olami-faollik-jurnali.csv';a.click();URL.revokeObjectURL(a.href);
}

if(!restoreSession())login();