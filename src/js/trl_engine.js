/* ZeroHunger TRL Engine - Core */
(function(){
'use strict';

const LK='zh_listings',NK='zh_notifications';
const BASE_DECAY={cooked_rice_dal:0.18,fried_items:0.22,curry_gravy:0.20,bread_roti:0.12,raw_vegetables:0.06,packaged_sealed:0.01,dairy_items:0.28,meat_seafood:0.35,baked_goods:0.09,desserts_sweets:0.14};
const STOR={refrigerated:0.25,covered:0.80,open_air:1.00};
window.CAT_MAP={'Cooked Meals':'cooked_rice_dal','Curry / Gravy':'curry_gravy','Fried Items':'fried_items','Bread / Roti':'bread_roti','Raw Produce':'raw_vegetables','Packaged / Sealed':'packaged_sealed','Dairy Items':'dairy_items','Baked Goods':'baked_goods','Desserts / Sweets':'desserts_sweets'};

const ZONES=[{area:'Koramangala 5th Block',pin:'560095',dist:'0.8 km'},{area:'HSR Layout Sector 2',pin:'560102',dist:'1.2 km'},{area:'Indiranagar 100ft Rd',pin:'560038',dist:'2.1 km'},{area:'BTM Layout 2nd Stage',pin:'560076',dist:'1.5 km'}];

function getUser(){try{return JSON.parse(localStorage.getItem('zh_user')||'{}')}catch{return{}}}
function getL(){try{return JSON.parse(localStorage.getItem(LK)||'[]')}catch{return[]}}
function setL(a){localStorage.setItem(LK,JSON.stringify(a))}
function getN(){try{return JSON.parse(localStorage.getItem(NK)||'[]')}catch{return[]}}
function setN(a){localStorage.setItem(NK,JSON.stringify(a))}
function simTemp(){return 27+Math.random()*6}
function tempM(c){return c<=20?.7:c<=25?1:c<=30?1.4:c<=35?1.9:2.5}
function urgency(t){return t>=70?'SAFE':t>=45?'MODERATE':t>=20?'URGENT':'CRITICAL'}
function uStyle(u){return{SAFE:{bg:'#f0fdf4',border:'#86efac',text:'#15803d',hex:'#22c55e'},MODERATE:{bg:'#fefce8',border:'#fde047',text:'#a16207',hex:'#eab308'},URGENT:{bg:'#fff7ed',border:'#fdba74',text:'#c2410c',hex:'#f97316'},CRITICAL:{bg:'#fef2f2',border:'#fca5a5',text:'#b91c1c',hex:'#ef4444'}}[u]||{bg:'#f0fdf4',border:'#86efac',text:'#15803d',hex:'#22c55e'}}

function calcTRL(cat,stor,listedAt,offsetH){
  const t=offsetH!=null?offsetH:(Date.now()-listedAt)/3600000;
  const temp=simTemp();
  const lam=(BASE_DECAY[cat]||0.18)*tempM(temp)*(STOR[stor]||1);
  const trl=Math.max(0,Math.min(100,Math.round(100*Math.exp(-lam*t)*10)/10));
  const hoursLeft=lam>0?Math.max(0,-Math.log(0.2)/lam-t):99;
  return{trl,temp:+temp.toFixed(1),lam:+lam.toFixed(4),t:+t.toFixed(2),hoursLeft:+hoursLeft.toFixed(2),urgency:urgency(trl)};
}

function fmtH(h){const hr=Math.floor(h),m=Math.round((h-hr)*60);return hr>0?`${hr}h ${m}m`:`${m}m`}
function fmtDate(ms){const d=new Date(ms);return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false})}
function randZone(){return ZONES[Math.floor(Math.random()*ZONES.length)]}
function unseenCount(){return getN().filter(n=>!n.seen).length}

function createListing(d){
  const now=Date.now();
  const res=calcTRL(d.cat,d.stor,now,0);
  const user=getUser();
  const zone=randZone();
  const l={id:'lst_'+now,foodName:d.foodName,quantity:d.qty,unit:d.unit||'meals',cat:d.cat,catLabel:d.catLabel,stor:d.stor,listedAt:now,trl0:res.trl,temp:res.temp,lam:res.lam,urgency:res.urgency,hoursLeft:res.hoursLeft,status:'pending',donor:user.name||d.donor||'Anonymous Kitchen',zone:zone.area,pin:zone.pin,dist:zone.dist,ngoAction:null};
  const list=getL();list.unshift(l);setL(list);
  const notifs=getN();notifs.unshift({id:l.id,seen:false,t:now});setN(notifs);
  return l;
}

function ngoRespond(id,action){
  const list=getL(),l=list.find(x=>x.id===id);
  if(l){l.ngoAction=action;l.status=action;setL(list);}
  const notifs=getN(),n=notifs.find(x=>x.id===id);
  if(n){n.seen=true;setN(notifs);}
  refreshBadge();
  const p=window.location.pathname;
  if(p.includes('NGO_Dashboard'))window.initNGO&&window.initNGO();
  else if(p.includes('Food_Alerts'))window.initFoodAlerts&&window.initFoodAlerts();
  else if(p.includes('Analytics'))window.initAnalytics&&window.initAnalytics();
  else if(p.includes('Meal_Forecast'))window.initForecast&&window.initForecast();
  if(action==='accepted')showPickupCard(l);
}

function showPickupCard(l){
  let el=document.getElementById('zh-pickup-modal');
  if(!el){el=document.createElement('div');el.id='zh-pickup-modal';document.body.appendChild(el);}
  const live=calcTRL(l.cat,l.stor,l.listedAt);
  const s=uStyle(live.urgency);
  const mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.zone+', Bengaluru')}`;
  el.innerHTML=`<div style="position:fixed;inset:0;background:rgba(20,27,43,0.6);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.parentElement.remove()">
  <div style="background:#fff;border-radius:24px;padding:32px;max-width:480px;width:90%;box-shadow:0 24px 80px rgba(0,0,0,0.2);animation:bounceIn .4s cubic-bezier(.34,1.56,.64,1) forwards">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:48px;height:48px;background:#0d7377;border-radius:50%;display:flex;align-items:center;justify-content:center">
        <span class="material-symbols-outlined" style="color:#fff;font-size:24px">local_shipping</span>
      </div>
      <div><div style="font-size:18px;font-weight:800;color:#141b2b">Delivery Accepted! ✅</div><div style="font-size:13px;color:#6e7979">Volunteer being dispatched now</div></div>
    </div>
    <div style="background:${s.bg};border:1.5px solid ${s.border};border-radius:16px;padding:16px;margin-bottom:16px">
      <div style="font-size:15px;font-weight:700;color:#141b2b;margin-bottom:4px">${l.foodName}</div>
      <div style="font-size:13px;color:#3e4949">${l.quantity} ${l.unit} · ${l.catLabel}</div>
      <div style="display:flex;gap:16px;margin-top:8px;flex-wrap:wrap">
        <span style="font-size:12px;color:${s.text};font-weight:600">TRL: ${Math.round(live.trl)} (${live.urgency})</span>
        <span style="font-size:12px;color:#6e7979">⏱ ${fmtH(live.hoursLeft)} left</span>
        <span style="font-size:12px;color:#6e7979">🌡 ${live.temp}°C</span>
      </div>
    </div>
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:16px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#6e7979;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">📍 Pickup Location</div>
      <div style="font-size:16px;font-weight:800;color:#141b2b;margin-bottom:2px">${l.donor}</div>
      <div style="font-size:14px;color:#3e4949;margin-bottom:6px">${l.zone}, Bengaluru — ${l.pin}</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;background:#0d7377;color:#fff;padding:4px 10px;border-radius:20px;font-weight:600">📏 ${l.dist} from centre</span>
        <span style="font-size:12px;color:#6e7979">Listed at ${fmtDate(l.listedAt)}</span>
      </div>
    </div>
    <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:14px;padding:14px;margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;color:#c2410c;text-transform:uppercase;margin-bottom:6px">⚡ Instructions for Volunteer</div>
      <div style="font-size:13px;color:#3e4949">1. Call donor to confirm availability<br>2. Carry insulated bags<br>3. Complete pickup within <strong>${fmtH(live.hoursLeft * 0.4)}</strong><br>4. Mark delivery complete in app</div>
    </div>
    <div style="display:flex;gap:10px">
      <a href="${mapUrl}" target="_blank" style="flex:1;padding:12px;background:#0d7377;color:#fff;font-weight:700;font-size:14px;border:none;border-radius:12px;cursor:pointer;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px">
        <span class="material-symbols-outlined" style="font-size:18px">map</span> Open in Maps
      </a>
      <button onclick="document.getElementById('zh-pickup-modal').remove()" style="flex:1;padding:12px;background:#f1f5f9;color:#141b2b;font-weight:700;font-size:14px;border:none;border-radius:12px;cursor:pointer">Done</button>
    </div>
  </div></div>`;
}

function refreshBadge(){
  document.querySelectorAll('.material-symbols-outlined').forEach(el=>{
    if(el.textContent.trim()==='notifications'){
      el.parentElement.style.position='relative';
      let b=el.parentElement.querySelector('.zh-badge');
      const c=unseenCount();
      if(!b){b=document.createElement('span');b.className='zh-badge';el.parentElement.appendChild(b);}
      b.style.cssText=`position:absolute;top:0;right:0;width:16px;height:16px;background:#ba1a1a;color:#fff;font-size:9px;font-weight:700;border-radius:50%;display:${c>0?'flex':'none'};align-items:center;justify-content:center;pointer-events:none`;
      b.textContent=c;
    }
  });
}

function alertCard(l,showActions){
  const live=calcTRL(l.cat,l.stor,l.listedAt);
  const s=uStyle(live.urgency);
  const ring=Math.round(live.trl);
  const act=showActions?`<div style="display:flex;gap:10px;margin-top:14px">
    <button onclick="window.TRLEngine.ngoRespond('${l.id}','declined')" style="flex:1;padding:10px;border:1.5px solid #6e7979;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;background:transparent;color:#3e4949">✗ Decline</button>
    <button onclick="window.TRLEngine.ngoRespond('${l.id}','accepted')" style="flex:1;padding:10px;border:none;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;background:#0d7377;color:#fff">✓ Accept Delivery</button>
  </div>`:l.ngoAction?`<div style="margin-top:10px;font-size:12px;font-weight:700;color:${l.ngoAction==='accepted'?'#15803d':'#b91c1c'}">${l.ngoAction==='accepted'?'✅ Accepted':'❌ Declined'}</div>`:'';
  return `<div style="background:${s.bg};border:1.5px solid ${s.border};border-radius:16px;padding:18px;margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:14px">
      <div style="position:relative;width:64px;height:64px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <svg style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)" viewBox="0 0 36 36">
          <path d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="4"/>
          <path d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${s.hex}" stroke-dasharray="${ring},100" stroke-width="4" style="transition:stroke-dasharray 1s ease"/>
        </svg>
        <div style="text-align:center;z-index:1"><div style="font-size:16px;font-weight:900;color:${s.text};line-height:1">${ring}</div><div style="font-size:9px;font-weight:700;color:#6e7979">TRL</div></div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-weight:700;font-size:14px;color:#141b2b">${l.foodName}</span>
          <span style="background:${s.hex}22;color:${s.text};font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;border:1px solid ${s.border}">${live.urgency}</span>
        </div>
        <div style="font-size:12px;color:#3e4949;margin-top:3px">${l.quantity} ${l.unit} · ${l.catLabel} · <strong>${l.donor}</strong></div>
        <div style="font-size:12px;color:#3e4949;margin-top:2px">📍 ${l.zone} · ${l.dist}</div>
        <div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap">
          <span style="font-size:11px;color:#b91c1c">⏱ ${fmtH(live.hoursLeft)} left</span>
          <span style="font-size:11px;color:#6e7979">🌡 ${live.temp}°C</span>
          <span style="font-size:11px;color:#6e7979">${fmtDate(l.listedAt)}</span>
        </div>
      </div>
    </div>${act}
  </div>`;
}

// Bell dropdown
function buildBell(){
  document.querySelectorAll('.material-symbols-outlined').forEach(el=>{
    if(el.textContent.trim()==='notifications'&&!el.parentElement.dataset.bellDone){
      el.parentElement.dataset.bellDone='1';
      el.parentElement.style.position='relative';
      el.parentElement.addEventListener('click',e=>{
        e.stopPropagation();
        let drop=document.getElementById('zh-bell-drop');
        if(!drop){drop=document.createElement('div');drop.id='zh-bell-drop';document.body.appendChild(drop);}
        const rect=el.parentElement.getBoundingClientRect();
        drop.style.cssText=`position:fixed;top:${rect.bottom+8}px;right:${window.innerWidth-rect.right}px;width:360px;background:#fff;border:1px solid #bec9c9;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.12);z-index:9999;max-height:420px;overflow-y:auto;`;
        const p=getL().filter(l=>l.ngoAction===null);
        drop.innerHTML=p.length===0?'<div style="padding:20px;text-align:center;color:#6e7979;font-size:13px">✅ No pending alerts</div>':`<div style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:700;font-size:13px;color:#141b2b">🔔 ${p.length} Pending Alert${p.length>1?'s':''}</div><div style="padding:12px">${p.map(l=>alertCard(l,false)).join('')}</div>`;
        drop.style.display=drop.style.display==='block'?'none':'block';
        const ns=getN();ns.forEach(n=>n.seen=true);setN(ns);refreshBadge();
      });
    }
  });
  document.addEventListener('click',()=>{const d=document.getElementById('zh-bell-drop');if(d)d.style.display='none';});
}

// Exports
window.TRLEngine={createListing,ngoRespond,calcTRL,getL,setL,getN,setN,getUser,fmtH,fmtDate,alertCard,uStyle,urgency,unseenCount,refreshBadge};
window._trlReady=true;
document.dispatchEvent(new Event('trl-ready'));
})();
