/* Every API request is intercepted. No real account, database or production API is used. */
const {test,before,after}=require("node:test");
const assert=require("node:assert/strict");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||"playwright");
const base=process.env.TEST_BASE_URL||"http://127.0.0.1:5192";
assert.ok(["localhost","127.0.0.1"].includes(new URL(base).hostname));
const userId="111111111111111111111111",topicId="222222222222222222222222",questionId="333333333333333333333333";
const token=(exp=Date.now()/1000+3600,paid=true,suffix="fixture")=>["fixture",Buffer.from(JSON.stringify({userId,name:"Auth Fixture",userType:"ordinary",paymentMade:paid,exp:Math.floor(exp)})).toString("base64url"),suffix].join(".");
const quizPath="/pages/quiz/paper-i/Constitution";
let browser;
before(async()=>{browser=await chromium.launch({channel:"msedge",headless:true})});
after(async()=>{await browser.close()});
async function fixture(options={}){
 const context=await browser.newContext({serviceWorkers:"block"});
 const initial=options.token===undefined?token():options.token;
 await context.addInitScript(value=>{if(!sessionStorage.getItem("fixture-seeded")){if(value)localStorage.setItem("jwtToken",value);sessionStorage.setItem("fixture-seeded","yes")}},initial);
 const state={tier:options.tier||"paid",trialExpiresAt:options.trialExpiresAt,quizStatus:200,accessStatus:200,questions:0,submissions:[],calls:[]};
 await context.route("**/*",async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.pathname.startsWith("/api/v1/")){
   const p=u.pathname.slice(7);state.calls.push(p);
   let status=200,data={};
   if(p==="/auth/access"){status=state.accessStatus;data={tier:state.tier,paymentMade:state.tier==="paid",trialExpiresAt:state.trialExpiresAt,userType:"ordinary"};}
   else if(p==="/login")data={name:"Auth Fixture",token:state.loginToken||token(Date.now()/1000+604800,state.tier==="paid","new-session")};
   else if(p==="/quiz/getTopicId")data={topicId};
   else if(p.startsWith("/quiz/progress/"))data={attemptedQuestions:20,progress:20};
   else if(p==="/quiz/getQuiz"||p==="/quiz/getRandomQuiz"){
    status=state.quizStatus;state.questions++;
    if(state.delayQuiz){state.quizStarted?.();await state.delayQuiz;}
    data=status===200?[{_id:questionId,questionText:"Auth question batch "+state.questions,options:["Choice A","Choice B"],correctAnswer:"Choice A",explanation:"Fixture"}]:{code:status===402?"TRIAL_ENDED":"AUTH_INVALID",message:"Synthetic failure"};
   }else if(p==="/quiz/fetchAllBookmarks")data={bookmarks:[]};
   else if(p==="/quiz/submitQuiz"){state.submissions.push(req.postDataJSON());data={result:{correct:0,total:1,percent:0}};}
   else if(p==="/quiz/getUserStats")data={paperI:[],paperII:[]};
   return route.fulfill({status,contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify(data)});
  }
  if(u.origin===new URL(base).origin)return route.continue();
  return route.abort();
 });
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 return{context,page,state,initial,errors};
}
async function openQuiz(f){await f.page.goto(base+quizPath+"?resume=1#question",{waitUntil:"networkidle"});await f.page.getByRole("button",{name:"Submit",exact:true}).waitFor();}
async function expire(f){
 await f.page.evaluate(()=>{
  const parts=localStorage.getItem("jwtToken").split(".");
  const payload=JSON.parse(atob(parts[1].replace(/-/g,"+").replace(/_/g,"/")));
  payload.exp=Math.floor(Date.now()/1000)-1;
  parts[1]=btoa(JSON.stringify(payload)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  localStorage.setItem("jwtToken",parts.join("."));
  window.dispatchEvent(new Event("focus"));
 });
}
async function login(f){
 await f.page.getByRole("link",{name:"Login Again",exact:true}).click();
 await f.page.getByRole("textbox",{name:"Mobile number",exact:true}).fill("9000000000");
 await f.page.getByLabel("Password",{exact:true}).fill("fixture-password");
 await f.page.getByRole("button",{name:"Sign In",exact:true}).click();
}
test("expiry preserves exact quiz, selected answer and return URL through password-manager-friendly login",async()=>{
 const f=await fixture();
 try{
  await openQuiz(f);
  await f.page.getByRole("radio",{name:/Choice B/}).click();
  await expire(f);
  await f.page.getByRole("heading",{name:"Session Expired",exact:true}).waitFor();
  assert.equal(new URL(f.page.url()).searchParams.get("returnUrl"),quizPath+"?resume=1#question");
  await login(f);
  await f.page.getByRole("button",{name:"Submit",exact:true}).waitFor();
  assert.equal(new URL(f.page.url()).pathname,quizPath);
  assert.equal(new URL(f.page.url()).search,"?resume=1");assert.equal(new URL(f.page.url()).hash,"#question");
  assert.equal(await f.page.getByRole("radio",{name:/Choice B/}).getAttribute("aria-checked"),"true");
  assert.equal(await f.page.getByText("Auth question batch 1",{exact:true}).count(),1);
  await f.page.getByRole("button",{name:"Submit",exact:true}).click();
  await f.page.getByText("Quiz Results",{exact:true}).waitFor();
  assert.equal(f.state.submissions[0].responses[0].selected,"Choice B");
  assert.deepEqual(f.errors,[]);
 }finally{await f.context.close()}
});
test("expired token on opening a protected page follows the registered session-expired route",async()=>{
 const f=await fixture({token:token(Date.now()/1000-10)});
 try{await f.page.goto(base+quizPath,{waitUntil:"networkidle"});await f.page.getByRole("heading",{name:"Session Expired",exact:true}).waitFor();assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),null);}
 finally{await f.context.close()}
});
test("raw axios 401 uses central expiry handler while 403 preserves sign-in",async()=>{
 for(const status of [401,403]){
  const f=await fixture();
  try{await openQuiz(f);f.state.quizStatus=status;await f.page.getByText("Random Questions",{exact:true}).click();
   if(status===401){await f.page.getByRole("heading",{name:"Session Expired",exact:true}).waitFor();assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),null);}
   else{await f.page.waitForURL("**/pages/Unauthorized");assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),f.initial);}
  }finally{await f.context.close()}
 }
});
test("trial expiry keeps the session and offers activation; a later payment unlocks without login",async()=>{
 const f=await fixture({token:token(undefined,false),tier:"trial_active",trialExpiresAt:new Date(Date.now()+2500).toISOString()});
 try{await openQuiz(f);await f.page.getByRole("heading",{name:"Your 24-hour trial has ended",exact:true}).waitFor();assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),f.initial);
  f.state.tier="paid";await f.page.getByRole("button",{name:"Check activation status",exact:true}).click();
  await f.page.getByRole("button",{name:"Submit",exact:true}).waitFor();assert.equal(new URL(f.page.url()).pathname,quizPath);
 }finally{await f.context.close()}
});
test("402 from quiz API opens trial-ended page rather than signing out",async()=>{
 const f=await fixture();
 try{await openQuiz(f);f.state.quizStatus=402;await f.page.getByText("Random Questions",{exact:true}).click();await f.page.getByRole("heading",{name:"Your 24-hour trial has ended",exact:true}).waitFor();assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),f.initial);}
 finally{await f.context.close()}
});
test("network/server errors keep session; late failures from an old token cannot remove a newer token",async()=>{
 const f=await fixture();
 try{await openQuiz(f);f.state.quizStatus=500;await f.page.getByText("Random Questions",{exact:true}).click();await f.page.getByText("Failed to fetch questions",{exact:true}).waitFor();assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),f.initial);
  const fresh=token(Date.now()/1000+3600,true,"newer");
  let release, started;
  f.state.quizStatus=401;
  f.state.delayQuiz=new Promise(resolve=>release=resolve);
  const requested=new Promise(resolve=>started=resolve);
  f.state.quizStarted=()=>started();
  await f.page.getByRole("button",{name:"Retry",exact:true}).click();
  await requested;
  await f.page.evaluate(value=>{
   localStorage.setItem("jwtToken",value);
   window.dispatchEvent(new StorageEvent("storage",{key:"jwtToken",newValue:value}));
  },fresh);
  const failed=f.page.waitForResponse(r=>r.status()===401);
  release();await failed;
  assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),fresh);
 }finally{await f.context.close()}
});
test("cross-tab sign-out updates protected page and retains its return URL",async()=>{
 const f=await fixture();
 try{await openQuiz(f);const other=await f.context.newPage();await other.goto(base+"/login",{waitUntil:"networkidle"});await other.evaluate(()=>localStorage.removeItem("jwtToken"));await f.page.waitForURL("**/pages/NotLoggedIn?**");assert.equal(new URL(f.page.url()).searchParams.get("returnUrl"),quizPath+"?resume=1#question");}
 finally{await f.context.close()}
});
test("login forwards autocomplete props and rejects external return destinations",async()=>{
 const f=await fixture({token:null});
 try{await f.page.goto(base+"/login?returnUrl="+encodeURIComponent("//evil.example/path"),{waitUntil:"networkidle"});
  const mobile=f.page.getByRole("textbox",{name:"Mobile number",exact:true}),password=f.page.getByLabel("Password",{exact:true});
  assert.equal(await mobile.getAttribute("autocomplete"),"username");assert.equal(await password.getAttribute("autocomplete"),"current-password");
  await mobile.fill("9000000000");await password.fill("fixture-password");await f.page.getByRole("button",{name:"Sign In",exact:true}).click();await f.page.waitForURL(base+"/");
 }finally{await f.context.close()}
});

test("trial-expired users can still open free sample quiz and task tracker",async()=>{
 const f=await fixture({tier:"trial_expired",token:token(undefined,false)});
 try{
  await f.page.goto(base+"/pages/quiz/SampleQuiz",{waitUntil:"networkidle"});
  assert.equal(new URL(f.page.url()).pathname,"/pages/quiz/SampleQuiz");
  assert.equal(await f.page.evaluate(()=>localStorage.getItem("jwtToken")),f.initial);
  await f.page.goto(base+"/pages/tools/task-tracker",{waitUntil:"networkidle"});
  assert.equal(new URL(f.page.url()).pathname,"/pages/tools/task-tracker");
  assert.equal(await f.page.getByRole("heading",{name:"Your 24-hour trial has ended",exact:true}).count(),0);
 }finally{await f.context.close()}
});
test("a different account never recovers the previous account's unfinished quiz",async()=>{
 const f=await fixture();
 try{
  await openQuiz(f);await f.page.getByRole("radio",{name:/Choice B/}).click();
  await expire(f);
  await f.page.getByRole("heading",{name:"Session Expired",exact:true}).waitFor();
  const other="444444444444444444444444";
  f.state.loginToken=["fixture",Buffer.from(JSON.stringify({userId:other,name:"Other Fixture",paymentMade:true,userType:"ordinary",exp:Math.floor(Date.now()/1000)+3600})).toString("base64url"),"other"].join(".");
  await login(f);await f.page.getByRole("button",{name:"Submit",exact:true}).waitFor();
  assert.equal(await f.page.getByRole("radio",{name:/Choice B/}).getAttribute("aria-checked"),"false");
  assert.equal(await f.page.getByText("Auth question batch 2",{exact:true}).count(),1);
 }finally{await f.context.close()}
});
