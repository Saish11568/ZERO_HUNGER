/* ZeroHunger - Page init logic. Requires trl_engine.js */
(function(){
function waitReady(fn){if(window._trlReady)fn();else document.addEventListener('trl-ready',fn);}

/* ── DONOR ── */
function initDonor(){
  const{createListing,getL,calcTRL,fmtH,uStyle,getUser}=window.TRLEngine;
  const user=getUser();

  // Show user name in header
  const nameEls=document.querySelectorAll('[data-donor-name]');
  nameEls.forEach(el=>el.textContent=user.name||'Donor');

  // Patch hero donor name
  const heroName=document.getElementById('hero-donor-name');
  if(heroName)heroName.textContent=user.name||'Your Kitchen';

  const nameI=document.getElementById('surplus-food-name');
  const qtyI=document.getElementById('surplus-quantity');
  const catS=document.getElementById('surplus-category');
  const btn=document.getElementById('calculate-trl-btn');
  const preview=document.getElementById('trl-result-preview');
  let stor='open_air';

  document.querySelectorAll('.storage-condition-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.storage-condition-btn').forEach(x=>x.style.cssText='');
      b.style.cssText='background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.12);font-weight:700;';
      stor=b.dataset.storage;
    });
  });

  if(!btn)return;
  btn.addEventListener('click',()=>{
    const name=nameI?.value?.trim();
    const qty=parseFloat(qtyI?.value);
    const catLabel=catS?.value||'Cooked Meals';
    if(!name){nameI?.focus();return;}
    if(!qty||qty<=0){qtyI?.focus();return;}
    const cat=window.CAT_MAP[catLabel]||'cooked_rice_dal';
    const pts=[0,1,2,4].map(h=>({h,r:calcTRL(cat,stor,Date.now(),h)}));
    const now=pts[0].r;
    const s=uStyle(now.urgency);
    if(preview){
      preview.innerHTML=`<div style="background:${s.bg};border:1.5px solid ${s.border};border-radius:12px;padding:16px;margin-top:8px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div style="position:relative;width:60px;height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
            <svg style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)" viewBox="0 0 36 36">
              <path d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="4"/>
              <path id="trl-arc" d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${s.hex}" stroke-dasharray="0,100" stroke-width="4" style="transition:stroke-dasharray 1.2s ease"/>
            </svg>
            <div style="text-align:center;z-index:1"><div style="font-size:16px;font-weight:900;color:${s.text}">${Math.round(now.trl)}</div><div style="font-size:9px;font-weight:700;color:#6e7979">TRL</div></div>
          </div>
          <div><div style="font-weight:700;color:${s.text};font-size:13px">${now.urgency} right now</div><div style="font-size:11px;color:#6e7979;margin-top:2px">~${fmtH(now.hoursLeft)} until spoilage · ${now.temp}°C ambient</div></div>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:12px">
          ${pts.map(p=>{const ps=uStyle(p.r.urgency);return`<div style="flex:1;text-align:center;background:#fff;border:1px solid ${ps.border};border-radius:8px;padding:6px 2px"><div style="font-size:10px;color:#6e7979">${p.h===0?'Now':p.h+'h'}</div><div style="font-size:15px;font-weight:900;color:${ps.text}">${Math.round(p.r.trl)}</div><div style="font-size:9px;color:${ps.text};font-weight:600">${p.r.urgency}</div></div>`;}).join('')}
        </div>
        <button id="confirm-listing-btn" style="width:100%;padding:12px;background:#fea619;color:#2a1700;font-weight:700;font-size:14px;border:none;border-radius:10px;cursor:pointer;">✓ Confirm &amp; List — Notify NGO</button>
      </div>`;
      preview.classList.remove('hidden');
      // animate arc
      setTimeout(()=>{const a=document.getElementById('trl-arc');if(a)a.setAttribute('stroke-dasharray',`${Math.round(now.trl)},100`);},100);
      document.getElementById('confirm-listing-btn')?.addEventListener('click',()=>{
        const unit=['Raw Produce','Packaged / Sealed'].includes(catLabel)?'kg':'meals';
        const l=createListing({foodName:name,qty:`${qty}`,unit,cat,catLabel,stor});
        preview.classList.add('hidden');
        if(nameI)nameI.value='';
        if(qtyI)qtyI.value='';
        updateHeroFromListing(l);
        loadDonorTable();
        updateDonorChart();
        updateDonorStats();
      });
    }
  });

  const active=getL().find(x=>x.status==='pending');
  if(active)updateHeroFromListing(active);
  loadDonorTable();
  updateDonorChart();
  updateDonorStats();
}

function updateDonorStats(){
  const{getL,calcTRL}=window.TRLEngine;
  const stats = getL();
  const acc = stats.filter(l => l.ngoAction === 'accepted');
  const totalMeals = stats.reduce((s, l) => s + (parseFloat(l.quantity) || 0), 0);
  const totalWaste = stats.reduce((s, l) => s + (l.unit === 'kg' ? (parseFloat(l.quantity) || 0) : (parseFloat(l.quantity) || 0) * 0.25), 0); 
  const peopleFed = acc.reduce((s, l) => s + (l.unit === 'kg' ? (parseFloat(l.quantity) || 0) * 4 : (parseFloat(l.quantity) || 0)), 0);
  const urgent = stats.filter(l => l.ngoAction === null && calcTRL(l.cat, l.stor, l.listedAt).trl < 40).length;

  const s1 = document.getElementById('donor-stat-meals');
  const s2 = document.getElementById('donor-stat-waste');
  const s3 = document.getElementById('donor-stat-people');
  const s4 = document.getElementById('donor-stat-urgent');
  if(s1) s1.textContent = Math.round(totalMeals);
  if(s2) s2.textContent = Math.round(totalWaste) + 'kg';
  if(s3) s3.textContent = Math.round(peopleFed);
  if(s4) s4.textContent = urgent;
}

function updateHeroFromListing(l){
  const{calcTRL,fmtH,uStyle}=window.TRLEngine;
  const live=calcTRL(l.cat,l.stor,l.listedAt);
  const s=uStyle(live.urgency);
  const vEl=document.getElementById('hero-trl-value');
  const rEl=document.getElementById('hero-trl-ring');
  if(vEl)vEl.textContent=Math.round(live.trl);
  if(rEl){rEl.style.transition='stroke-dasharray 1.2s ease';rEl.setAttribute('stroke-dasharray',`${Math.round(live.trl)},100`);}
  const nEl=document.getElementById('hero-food-name');
  const qEl=document.getElementById('hero-quantity');
  const tEl=document.getElementById('hero-temperature');
  const xEl=document.getElementById('hero-time-left');
  if(nEl)nEl.textContent=l.foodName;
  if(qEl)qEl.textContent=`${l.quantity} ${l.unit}`;
  if(tEl)tEl.textContent=`${live.temp}°C`;
  if(xEl)xEl.textContent=`${fmtH(live.hoursLeft)} exp`;
}

function updateDonorChart(){
  const{getL,calcTRL}=window.TRLEngine;
  const chartEl=document.getElementById('donor-trl-chart');
  if(!chartEl)return;
  const listings=getL().slice(0,6);
  if(listings.length===0){chartEl.innerHTML='<div style="text-align:center;padding:24px;color:#6e7979;font-size:13px">No listings yet — create your first to see the chart.</div>';return;}
  const maxQty=Math.max(...listings.map(l=>parseFloat(l.quantity)||1));
  chartEl.innerHTML=`<div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:0 4px;border-bottom:2px solid #e2e8f0;">
    ${listings.reverse().map(l=>{
      const live=calcTRL(l.cat,l.stor,l.listedAt);
      const s=window.TRLEngine.uStyle(live.urgency);
      const pct=Math.round(((parseFloat(l.quantity)||1)/maxQty)*100);
      return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer" title="${l.foodName}: TRL ${Math.round(live.trl)}">
        <div style="width:100%;background:${s.hex};border-radius:4px 4px 0 0;height:0;transition:height 0.8s ease;" data-h="${pct}%"></div>
        <div style="font-size:9px;color:#6e7979;text-align:center;max-width:48px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${l.foodName.split(' ')[0]}</div>
      </div>`;
    }).join('')}
  </div><div style="font-size:11px;color:#6e7979;margin-top:8px;text-align:center">Surplus listings — colored by TRL urgency</div>`;
  // animate bars
  setTimeout(()=>chartEl.querySelectorAll('[data-h]').forEach(b=>b.style.height=b.dataset.h),50);
}

function loadDonorTable(){
  const{getL,calcTRL,uStyle,fmtDate}=window.TRLEngine;
  const t=document.getElementById('donor-donations-tbody');
  if(!t)return;
  const all=getL();
  if(all.length===0){t.innerHTML='<tr><td colspan="7" class="py-8 text-center text-on-surface-variant italic">No listings yet.</td></tr>';return;}
  t.innerHTML=all.map(l=>{
    const live=calcTRL(l.cat,l.stor,l.listedAt);
    const s=uStyle(live.urgency);
    const sc=l.ngoAction==='accepted'?'color:#15803d':l.ngoAction==='declined'?'color:#b91c1c':'color:#a16207';
    return`<tr class="border-b border-surface-variant/50 hover:bg-surface-container-low/50 transition-colors">
      <td class="py-4 px-6 text-xs text-on-surface-variant">${fmtDate(l.listedAt)}</td>
      <td class="py-4 px-6 font-medium">${l.foodName}</td>
      <td class="py-4 px-6">${l.quantity} ${l.unit}</td>
      <td class="py-4 px-6"><span style="font-weight:700;color:${s.text}">${Math.round(live.trl)}</span></td>
      <td class="py-4 px-6 text-on-surface-variant">${l.zone}</td>
      <td class="py-4 px-6"><span style="font-size:12px;font-weight:600;${sc}">${l.ngoAction||'Awaiting'}</span></td>
      <td class="py-4 px-6 text-on-surface-variant">—</td>
    </tr>`;
  }).join('');
}

/* ── NGO ── */
window.initNGO=function(){
  const{getL,calcTRL,fmtH,uStyle,alertCard,unseenCount,refreshBadge}=window.TRLEngine;
  const all=getL();
  const pen=all.filter(l=>l.ngoAction===null);
  const acc=all.filter(l=>l.ngoAction==='accepted');

  // Priority banner
  const banner=document.getElementById('ngo-priority-alert');
  const content=document.getElementById('ngo-priority-content');
  const actions=document.getElementById('ngo-priority-actions');
  if(pen.length>0&&banner&&content&&actions){
    const top=[...pen].sort((a,b)=>calcTRL(a.cat,a.stor,a.listedAt).hoursLeft-calcTRL(b.cat,b.stor,b.listedAt).hoursLeft)[0];
    const live=calcTRL(top.cat,top.stor,top.listedAt);
    content.innerHTML=`<span class="font-semibold text-on-surface">${top.quantity} ${top.unit}</span> of <strong>${top.foodName}</strong> from <strong>${top.donor}</strong> — 📍 ${top.zone} (${top.dist}) — exp in <strong>${fmtH(live.hoursLeft)}</strong> — TRL: <strong>${Math.round(live.trl)}</strong>`;
    actions.innerHTML=`<button onclick="window.TRLEngine.ngoRespond('${top.id}','declined')" class="flex-1 lg:flex-none border-[1.5px] border-outline text-on-surface-variant font-label-md px-6 py-3 rounded-[10px] hover:bg-surface-container transition-colors">Skip</button>
    <button onclick="window.TRLEngine.ngoRespond('${top.id}','accepted')" class="flex-1 lg:flex-none bg-primary-container text-on-primary font-label-md px-6 py-3 rounded-[10px] hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-2">Accept Delivery <span class="material-symbols-outlined text-[18px]">check_circle</span></button>`;
    banner.classList.remove('hidden');banner.classList.add('flex');
  } else if(banner){banner.classList.add('hidden');}

  // Stat cards
  const totalMeals=acc.reduce((s,l)=>s+(parseFloat(l.quantity)||0),0);
  const el1=document.getElementById('ngo-stat-rescued');
  const el2=document.getElementById('ngo-stat-active');
  const el3=document.getElementById('ngo-stat-forecast');
  if(el1)el1.textContent=Math.round(totalMeals);
  if(el2)el2.textContent=acc.length;
  if(el3)el3.textContent=pen.length>0?`~${pen.length*10}`:'0';

  const summary = document.getElementById('ngo-forecast-summary');
  if(summary) summary.textContent = pen.length > 0 ? `~${pen.length * 10} meals` : 'no urgent meals';

  // Deliveries table
  const tbody=document.getElementById('ngo-incoming-tbody');
  if(tbody){
    if(acc.length===0){tbody.innerHTML='<tr><td colspan="6" class="py-8 text-center text-on-surface-variant italic">No accepted deliveries yet.</td></tr>';}
    else{tbody.innerHTML=acc.map(l=>{
      const live=calcTRL(l.cat,l.stor,l.listedAt);
      const s=uStyle(live.urgency);
      return`<tr class="hover:bg-surface-container/50 transition-colors cursor-pointer" onclick="window.TRLEngine.ngoRespond('${l.id}','accepted')">
        <td class="py-4 px-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center font-bold text-xs">${l.donor.slice(0,2).toUpperCase()}</div><span class="font-medium text-primary-container">${l.donor}</span></div></td>
        <td class="py-4 px-4 text-on-surface-variant">${l.foodName}</td>
        <td class="py-4 px-4 text-center font-semibold">${l.quantity}</td>
        <td class="py-4 px-4 text-center"><span class="inline-flex items-center gap-1 bg-tertiary-container/10 text-tertiary-container font-label-sm px-2 py-1 rounded-full border border-tertiary-container/20">~15 mins</span></td>
        <td class="py-4 px-4 text-center"><span style="font-weight:700;color:${s.text}">${Math.round(live.trl)}</span></td>
        <td class="py-4 px-4"><span class="flex items-center gap-2 text-secondary-container"><span class="w-2 h-2 rounded-full bg-secondary-container"></span>En Route · ${l.zone}</span></td>
      </tr>`;
    }).join('');}
  }

  // Forecast chart update
  updateNGOChart(all);
  refreshBadge();
};

function updateNGOChart(all){
  const chartWrap=document.getElementById('ngo-forecast-chart');
  if(!chartWrap)return;
  if(all.length===0){chartWrap.innerHTML='<div style="text-align:center;padding:24px;color:#6e7979;font-size:13px">Listings will appear here as donors submit food.</div>';return;}
  const hours=['6PM','7PM','8PM','9PM'];
  const vals=hours.map((_,i)=>all.filter(l=>l.ngoAction!=='declined').length*(0.3+i*0.25));
  const max=Math.max(...vals,1);
  chartWrap.innerHTML=`<div style="display:flex;align-items:flex-end;gap:12px;height:140px;border-bottom:2px solid #e2e8f0;padding:0 4px">
    ${hours.map((h,i)=>{const pct=Math.round((vals[i]/max)*100);return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="width:100%;background:#0d7377;border-radius:4px 4px 0 0;height:0;transition:height 1s ease ${i*0.15}s;opacity:${0.4+i*0.2}" data-h="${pct}%"></div>
      <span style="font-size:11px;color:#6e7979">${h}</span>
    </div>`;}).join('')}
  </div>`;
  setTimeout(()=>chartWrap.querySelectorAll('[data-h]').forEach(b=>b.style.height=b.dataset.h),80);
}

/* ── ANALYTICS ── */
window.initAnalytics=function(){
  const{getL,calcTRL}=window.TRLEngine;
  const all=getL();
  const acc=all.filter(l=>l.ngoAction==='accepted');
  const el1=document.getElementById('analytics-stat-rescued');
  const el2=document.getElementById('analytics-stat-donors');
  const el3=document.getElementById('analytics-stat-efficiency');
  if(el1)el1.textContent=Math.round(acc.reduce((s,l)=>s+(parseFloat(l.quantity)||0),0)).toLocaleString();
  if(el2)el2.textContent=new Set(all.map(l=>l.donor)).size;
  if(el3)el3.textContent=all.length>0?Math.round((acc.length/all.length)*100):'0';
  updateAnalyticsChart(all);
};

function updateAnalyticsChart(all){
  const el=document.getElementById('analytics-chart-bars');
  if(!el)return;
  if(all.length===0){el.parentElement.innerHTML='<div style="text-align:center;padding:40px;color:#6e7979">Create listings to see data here.</div>';return;}
  const hours=['8AM','10AM','12PM','2PM','4PM','6PM','8PM'];
  const vals=hours.map((_,i)=>Math.max(1,all.filter(l=>l.ngoAction!=='declined').length*(0.2+Math.sin(i)*0.3+0.1)));
  const max=Math.max(...vals);
  el.innerHTML=hours.map((h,i)=>{
    const pct=Math.round((vals[i]/max)*95);
    const isPeak=pct===Math.round((Math.max(...vals)/max)*95);
    return`<div class="flex flex-col items-center gap-2 w-full group">
      <div style="width:100%;max-width:40px;height:0;background:${isPeak?'linear-gradient(180deg,#fea619,#e69212)':'linear-gradient(180deg,#0d7377,#00595c)'};border-radius:4px 4px 0 0;transition:height 0.8s ease ${i*0.1}s" data-h="${pct}%"></div>
      <span class="font-label-sm text-label-sm ${isPeak?'text-on-background font-bold':'text-slate-400'}">${h}</span>
    </div>`;
  }).join('');
  setTimeout(()=>el.querySelectorAll('[data-h]').forEach(b=>b.style.height=b.dataset.h),80);
}

/* ── FORECAST ── */
window.initForecast=function(){
  const{getL}=window.TRLEngine;
  const all=getL();
  const pen=all.filter(l=>l.ngoAction===null);
  const el1=document.getElementById('forecast-stat-meals');
  const el2=document.getElementById('forecast-stat-peak');
  const el3=document.getElementById('forecast-stat-confidence');
  if(el1)el1.textContent=pen.length>0?pen.length*10:'0';
  if(el2)el2.textContent=pen.length>0?'2:45':'--:--';
  if(el3)el3.textContent=all.length>0?'94':'0';
  updateForecastChart(all);
};

function updateForecastChart(all){
  const el=document.getElementById('forecast-chart-bars');
  if(!el)return;
  if(all.length===0){el.parentElement.innerHTML='<div style="text-align:center;padding:40px;color:#6e7979">No data yet — create listings to forecast.</div>';return;}
  const hours=['8AM','10AM','12PM','2PM','4PM','6PM','8PM'];
  const vals=hours.map((_,i)=>Math.max(1,all.length*(0.15+Math.sin(i*0.8)*0.25+0.1)));
  const max=Math.max(...vals);
  el.innerHTML=hours.map((h,i)=>{
    const pct=Math.round((vals[i]/max)*95);
    const isPeak=i===3;
    return`<div class="flex flex-col items-center gap-2 w-full group">
      <div style="width:100%;max-width:40px;height:0;background:${isPeak?'linear-gradient(180deg,#fea619,#e69212)':'linear-gradient(180deg,#0d7377,#00595c)'};border-radius:4px 4px 0 0;transition:height 0.8s ease ${i*0.1}s" data-h="${pct}%"></div>
      <span class="font-label-sm text-label-sm ${isPeak?'text-on-background font-bold':'text-slate-400'}">${h}</span>
    </div>`;
  }).join('');
  setTimeout(()=>el.querySelectorAll('[data-h]').forEach(b=>b.style.height=b.dataset.h),80);
}

/* ── FOOD ALERTS ── */
window.initFoodAlerts=function(){
  const{getL,alertCard}=window.TRLEngine;
  const container=document.getElementById('food-alerts-dynamic');
  if(!container)return;
  const all=getL();
  if(all.length===0){container.innerHTML='<div style="padding:40px;text-align:center;background:#fff;border-radius:20px;color:#6e7979"><span style="font-size:40px">📭</span><p style="margin-top:12px;font-weight:600;font-size:15px">No food alerts yet. Waiting for donors.</p></div>';return;}
  container.innerHTML=all.map(l=>alertCard(l,l.ngoAction===null)).join('');
};

/* ── BOOT ── */
waitReady(function(){
  const{refreshBadge}=window.TRLEngine;

  // Inject user name wherever needed
  const user=window.TRLEngine.getUser();
  document.querySelectorAll('[data-user-name]').forEach(el=>el.textContent=user.name||'User');

  // Bell
  (function buildBell(){
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
          const p=window.TRLEngine.getL().filter(l=>l.ngoAction===null);
          drop.innerHTML=p.length===0?'<div style="padding:20px;text-align:center;color:#6e7979;font-size:13px">✅ No pending alerts</div>':`<div style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:700;font-size:13px;color:#141b2b">🔔 ${p.length} Pending Alert${p.length>1?'s':''}</div><div style="padding:12px">${p.map(l=>window.TRLEngine.alertCard(l,false)).join('')}</div>`;
          drop.style.display=drop.style.display==='block'?'none':'block';
          const ns=window.TRLEngine.getN();ns.forEach(n=>n.seen=true);window.TRLEngine.setN(ns);refreshBadge();
        });
      }
    });
    document.addEventListener('click',()=>{const d=document.getElementById('zh-bell-drop');if(d)d.style.display='none';});
  })();

  refreshBadge();

  const p=window.location.pathname;
  if(p.includes('Donor_Dashboard'))initDonor();
  else if(p.includes('NGO_Dashboard'))window.initNGO();
  else if(p.includes('Analytics'))window.initAnalytics();
  else if(p.includes('Meal_Forecast'))window.initForecast();
  else if(p.includes('Food_Alerts'))window.initFoodAlerts();
  else if(p.includes('Volunteer_Fleet'))initVolunteer();
  else if(p.includes('Zone_Dispatch'))initDispatch();
});

/* ── VOLUNTEER ── */
function initVolunteer(){
  const{getL,calcTRL,uStyle}=window.TRLEngine;
  // Patch name
  const nameEls=document.querySelectorAll('[data-user-name]');
  const user=window.TRLEngine.getUser();
  nameEls.forEach(el=>el.textContent=user.name||'Volunteer');

  // We could automate the volunteer list here if we had volunteer data
}

function initDispatch(){
  const{getL,calcTRL,uStyle,fmtH}=window.TRLEngine;
  const user=window.TRLEngine.getUser();
  const all=getL();
  const top=all.filter(l=>l.ngoAction==='accepted')[0] || all[0];
  if(!top) return;

  const live=calcTRL(top.cat,top.stor,top.listedAt);
  const s=uStyle(live.urgency);

  // Patch the dispatch card
  const h1=document.querySelector('main h1');
  if(h1) h1.textContent = `${top.quantity} ${top.unit} Available`;
  
  const desc=document.querySelector('main p.font-body-lg');
  if(desc) desc.textContent = `${top.foodName} · ${top.catLabel}`;

  const listedBy=document.querySelector('main .font-body-md strong');
  if(listedBy) listedBy.textContent = top.donor;

  const timeLeft=document.querySelectorAll('main .font-h3')[1];
  if(timeLeft) timeLeft.textContent = fmtH(live.hoursLeft);

  const trlVal=document.querySelectorAll('main .font-h3')[2];
  if(trlVal) trlVal.textContent = Math.round(live.trl);

  const progressBar=document.querySelector('main .h-full.bg-secondary-container');
  if(progressBar) progressBar.style.width = `${live.trl}%`;

  const mapLabel=document.querySelector('.absolute.top-1\\/3 .bg-surface-container-lowest');
  if(mapLabel) mapLabel.textContent = top.donor.split(' ')[0];
}
})();
