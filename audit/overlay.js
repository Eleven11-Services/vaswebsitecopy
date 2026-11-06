(function(){
const N=window.AUDIT_NOTES||[], G=window.AUDIT_GLOBAL||{}, V=window.AUDIT_VIDEO||null, P=window.AUDIT_PAGE||{}, PAGES=window.AUDIT_PAGES||[];
const SEVN={H:'High',M:'Medium',L:'Low'};
const root=document.createElement('div');root.id='da-root';document.body.appendChild(root);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- helpers ---------- */
function visible(e){const r=e.getBoundingClientRect();if(r.width<1&&r.height<1)return false;if(r.right<0||r.left>innerWidth)return false;const c=getComputedStyle(e);return c.visibility!=='hidden'&&c.display!=='none'&&parseFloat(c.opacity)>0.05&&!e.closest('#da-root')}
function hiddenAnc(e){while(e&&e!==document.body){const c=getComputedStyle(e);if(c.display==='none'||c.visibility==='hidden')return true;e=e.parentElement}return false}
function find(t){if(!t)return null;let els=[];try{els=[...document.querySelectorAll(t.s)]}catch(e){return null}
 if(t.x)els=els.filter(e=>e.textContent.includes(t.x));
 if(!/footer|header|trp|whatsapp|popup/.test(t.s))els=els.filter(e=>!e.closest('header,footer,.footer_btm,.trp-language-switcher,.elementor-popup-modal'));
 if(t.minw)els=els.filter(e=>e.getBoundingClientRect().width>=t.minw);
 const vis=els.filter(visible);const full=vis.filter(e=>e.getBoundingClientRect().left>=0);return full[t.i||0]||vis[t.i||0]||els[t.i||0]||null}
function fixedAncestor(e){while(e&&e!==document.body){if(getComputedStyle(e).position==='fixed')return true;e=e.parentElement}return false}
const rgb=s=>{const m=String(s).match(/[\d.]+/g);return m?m.map(Number):[0,0,0,0]};
const lum=c=>{const a=c.slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
function bgOf(e){while(e){const c=getComputedStyle(e);const b=rgb(c.backgroundColor);if(c.backgroundImage!=='none'&&!c.backgroundImage.includes('gradient'))return null;if((b[3]===undefined||b[3]>0.5)&&c.backgroundColor!=='rgba(0, 0, 0, 0)'&&c.backgroundColor!=='transparent')return b;e=e.parentElement}return [255,255,255]}
const hex=c=>'#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();

/* ---------- pins ---------- */
const pins={},boxes={},tips={};
N.forEach(n=>{
 const p=document.createElement('div');p.className='da-pin '+n.sev;p.textContent=n.n;p.title=n.title;
 const b=document.createElement('div');b.className='da-box';
 const tp=document.createElement('div');tp.className='da-tip';
 tp.innerHTML=`<div style="margin-bottom:6px"><span class="da-tag ${n.sev}">${SEVN[n.sev]}</span><span class="da-tag cat">${esc(n.cat)}</span><span class="da-tag cat">${esc(n.sec)}</span></div><h4>${n.n}. ${esc(n.title)}</h4><p>${esc(n.note)}</p>`;
 root.append(b,p,tp);pins[n.n]=p;boxes[n.n]=b;tips[n.n]=tp;
 p.addEventListener('mouseenter',()=>{showTip(n);b.style.display='block'});
 p.addEventListener('mouseleave',()=>{if(sel!==n.n){tp.style.display='none';b.style.display='none'}});
 p.addEventListener('click',e=>{e.stopPropagation();select(n.n,false)});
});
function place(){
 const used=[];
 N.forEach(n=>{
  const el=find(n.t),p=pins[n.n],b=boxes[n.n];
  if(!el||(n.fixed&&!visible(el))){p.style.display='none';b.style.display='none';return}
  p.style.display='';
  const fx=n.fixed||fixedAncestor(el);
  const r=el.getBoundingClientRect();
  const ox=fx?0:scrollX, oy=fx?0:scrollY;
  let x=(n.t.ar?r.right-24:r.left)+ox+(n.t.dx||0)-10, y=Math.max(r.top+oy-10+(n.t.dy||0),6);
  x=Math.max(6+ox,Math.min(x,ox+innerWidth-40));
  for(let k=0;k<8;k++){if(used.some(u=>u.f===fx&&Math.abs(u.x-x)<32&&Math.abs(u.y-y)<32))x+=34;else break}
  used.push({x,y,f:fx});
  p.classList.toggle('fixed',fx);b.classList.toggle('fixed',fx);tips[n.n].classList.toggle('fixed',fx);
  p.style.left=x+'px';p.style.top=y+'px';p.dataset.x=x;p.dataset.y=y;
  b.style.left=(r.left+ox-3)+'px';b.style.top=(r.top+oy-3)+'px';b.style.width=(r.width+6)+'px';b.style.height=(Math.max(r.height,4)+6)+'px';
 });
}
function showTip(n){const p=pins[n.n],tp=tips[n.n];tp.style.display='block';
 let x=+p.dataset.x+36,y=+p.dataset.y;const fx=p.classList.contains('fixed');const ox=fx?0:scrollX;
 const panelW=panel.classList.contains('closed')?0:panel.offsetWidth;
 if(x+350>ox+innerWidth-panelW)x=+p.dataset.x-350;if(x<ox+6)x=ox+6;
 tp.style.left=x+'px';tp.style.top=y+'px'}

let sel=null;
function clearSel(){if(sel){tips[sel].style.display='none';boxes[sel].style.display='none';pins[sel].classList.remove('on')}sel=null}
function select(num,scroll){
 if(sel&&sel!==num)clearSel();
 sel=num;const n=N.find(x=>x.n===num);
 openPanel();setTab('notes');
 document.querySelectorAll('.da-item').forEach(i=>i.classList.toggle('on',+i.dataset.n===num));
 const it=document.querySelector(`.da-item[data-n="${num}"]`);if(it&&!scroll)it.scrollIntoView({block:'nearest',behavior:'smooth'});
 if(n.popup){const m=document.querySelector('.elementor-popup-modal');if(m&&getComputedStyle(m).display==='none'){m.style.display='flex';setTimeout(place,50)}}
 const el=find(n.t);
 if(scroll&&el&&!(n.fixed||fixedAncestor(el))){const r=el.getBoundingClientRect();scrollTo({top:r.top+scrollY-140,behavior:'smooth'})}
 setTimeout(()=>{place();if(pins[num].style.display==='none')return;pins[num].classList.add('on');boxes[num].style.display='block';showTip(n)},scroll?450:0);
}
document.addEventListener('click',e=>{if(e.target.closest('#da-root'))return;if(sel){clearSel();document.querySelectorAll('.da-item.on').forEach(i=>i.classList.remove('on'))}});

/* ---------- live page analysis ---------- */
function textEls(){return [...document.querySelectorAll('body *')].filter(e=>!e.closest('#da-root,.trp-language-switcher,[class*=whatsapp],.skip-link,.screen-reader-text')&&[...e.childNodes].some(t=>t.nodeType===3&&t.textContent.trim().length>1)&&visible(e)&&!hiddenAnc(e))}
function fontsLive(){const m={};textEls().forEach(e=>{const c=getComputedStyle(e);let f=c.fontFamily.split(',')[0].replace(/["']/g,'').trim();
 const ok=document.fonts.check(`${c.fontWeight} 16px "${f}"`);
 const k=f;m[k]=m[k]||{n:0,sizes:new Set(),weights:new Set(),ex:e.textContent.trim().slice(0,40),stack:c.fontFamily};m[k].n++;m[k].sizes.add(parseFloat(c.fontSize));m[k].weights.add(c.fontWeight)});
 return Object.entries(m).sort((a,b)=>b[1].n-a[1].n)}
function btnSig(c){return [c.fontFamily.split(',')[0],c.fontSize,c.fontWeight,c.backgroundColor,c.color,c.borderTopLeftRadius,c.borderTopWidth+' '+c.borderTopColor].join('|')}
function buttonsLive(){const g={};[...document.querySelectorAll('a,button,input[type=submit],input[type=button]')].filter(e=>visible(e)&&!hiddenAnc(e)&&!e.closest('#da-root,header nav ul ul')).forEach(e=>{const c=getComputedStyle(e);const bg=c.backgroundColor;const hasBg=bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent';const hasBd=parseFloat(c.borderTopWidth)>=1&&parseFloat(c.paddingLeft)>=10;if(!((hasBg&&parseFloat(c.paddingLeft)>=8)||hasBd))return;const r=e.getBoundingClientRect();if(r.width<24||r.height<20)return;const k=btnSig(c);(g[k]=g[k]||{els:[],c}).els.push(e)});return Object.values(g).sort((a,b)=>b.els.length-a.els.length)}
function imagesLive(){return [...document.images].filter(i=>visible(i)&&!hiddenAnc(i)&&!i.closest('#da-root')).map(i=>{const r=i.getBoundingClientRect();const c=getComputedStyle(i);const nr=i.naturalWidth/Math.max(1,i.naturalHeight),dr=r.width/Math.max(1,r.height);const fl=[];
 if(!i.naturalWidth)fl.push('broken');
 else{if(c.objectFit==='fill'&&Math.abs(nr-dr)/nr>0.04&&r.width>40)fl.push('stretched');
  if(i.naturalWidth<r.width*0.95&&r.width>80)fl.push('upscaled (soft)');
  if(i.naturalWidth>r.width*3&&i.naturalWidth>1200)fl.push('file '+Math.round(i.naturalWidth/r.width)+'× larger than shown');
  if(c.objectFit==='cover'&&Math.abs(nr-dr)/nr>0.15&&r.width>80)fl.push('cropped');}
 if(!i.alt||!i.alt.trim()||/^(image|img|insurance-\d|untitled|\d+)$/i.test(i.alt.trim()))fl.push('no meaningful alt');
 return {i,w:Math.round(r.width),h:Math.round(r.height),nw:i.naturalWidth,nh:i.naturalHeight,src:(i.getAttribute('src')||'').split('/').pop().replace(/-[0-9a-f]{6}(\.\w+)$/,'$1'),fl}}).filter(x=>x.w>=24)}

/* ---------- toolbar ---------- */
const hasPopup=!!document.querySelector('.elementor-popup-modal');
const bar=document.createElement('div');bar.id='da-bar';
bar.innerHTML=`<b>Design review copy · not the live VAS site</b><button data-a="pages">Pages ▾</button><button data-a="pins" class="on">Notes on</button><button data-a="panel">Audit panel</button>${hasPopup?'<button data-a="popup">Popup</button>':''}`;
root.appendChild(bar);
bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;
 if(a==='pins'){document.body.classList.toggle('da-hide-pins');const on=!document.body.classList.contains('da-hide-pins');b.classList.toggle('on',on);b.textContent=on?'Notes on':'Notes off'}
 if(a==='panel'){panel.classList.contains('closed')?openPanel():closePanel()}
 if(a==='pages'){openPanel();setTab('pages')}
 if(a==='popup'){const m=document.querySelector('.elementor-popup-modal');if(m){m.style.display=getComputedStyle(m).display==='none'?'flex':'none';setTimeout(place,50)}}
});

/* ---------- panel ---------- */
const panel=document.createElement('aside');panel.id='da-panel';panel.className='closed';
const cnt={H:0,M:0,L:0};N.forEach(n=>cnt[n.sev]++);
const nFonts=fontsLive().length, nBtns=buttonsLive().length;
panel.innerHTML=`<div id="da-head"><button class="x" title="Close">×</button><div class="crumb">${esc(P.group||'')}</div><h2>${esc(P.name||document.title)}</h2><div class="sub">${esc(P.path||'')} · captured 6 Nov 2026 at 1440px · design review copy, not the official website</div>
<div class="da-stats"><div><strong>${cnt.H}</strong>High</div><div><strong>${cnt.M}</strong>Medium</div><div><strong>${cnt.L}</strong>Low</div><div><strong>${nFonts}</strong>Text fonts</div><div><strong>${nBtns}</strong>Button styles</div></div>
<div class="da-tabs"><button data-t="summary">Summary</button><button data-t="notes">Notes</button><button data-t="type">Fonts</button><button data-t="btns">Buttons</button><button data-t="imgs">Images</button>${V?'<button data-t="video">Video</button>':''}<button data-t="sys">Site-wide</button><button data-t="pages">Pages</button></div></div><div id="da-body"></div>`;
root.appendChild(panel);
panel.querySelector('.x').onclick=closePanel;
const body=panel.querySelector('#da-body');
function openPanel(){panel.classList.remove('closed');bar.querySelector('[data-a=panel]').classList.add('on')}
function closePanel(){panel.classList.add('closed');bar.querySelector('[data-a=panel]').classList.remove('on')}
panel.querySelector('.da-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setTab(b.dataset.t)});
let curTab=null,filt='All';
function setTab(t){if(curTab===t)return;curTab=t;panel.querySelectorAll('.da-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));body.innerHTML=R[t]();body.scrollTop=0;if(t==='btns')buildButtons();bindTab(t)}
const cats=['All',...new Set(N.map(n=>n.cat))];
const R={
 summary:()=>{const hi=N.filter(n=>n.sev==='H');const bycat={};N.forEach(n=>bycat[n.cat]=(bycat[n.cat]||0)+1);
  return `${P.intro?`<p>${esc(P.intro)}</p>`:''}
  <h3>High-severity problems on this page (${hi.length})</h3>${hi.length?`<ul>${hi.map(n=>`<li><a href="#" data-go="${n.n}">#${n.n}</a> ${esc(n.title)}</li>`).join('')}</ul>`:'<p style="color:#5d6470">None on this page.</p>'}
  <h3>Problems by category</h3><div class="da-chips">${Object.entries(bycat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${esc(k)} <b>${v}</b></span>`).join('')}</div>
  <h3>Problems repeated on every page</h3><ul>${(G.sitewide||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>
  <h3>How to read this copy</h3><p>Numbered pins mark each problem — hover to read, click to outline the element. <span style="color:#e5484d;font-weight:700">Red</span> high, <span style="color:#d97706;font-weight:700">amber</span> medium, <span style="color:#3b82f6;font-weight:700">blue</span> low. Use “Pages ▾” to move between the copied pages; the site’s own menu links also open the copies.</p>`},
 notes:()=>`<div class="da-legend"><span class="H">High</span><span class="M">Medium</span><span class="L">Low</span></div><div class="da-filter">${cats.map(c=>`<button data-f="${c}" class="${c===filt?'on':''}">${c}</button>`).join('')}</div><div id="da-list">${listHTML()}</div>`,
 type:()=>{const fs=fontsLive();
  const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>!h.closest('#da-root'));const seen=new Set();
  const rows=hs.map(h=>{const c=getComputedStyle(h);const vis=visible(h)&&!hiddenAnc(h);return {tag:h.tagName,t:h.textContent.trim().replace(/\s+/g,' '),fs:parseFloat(c.fontSize),fw:c.fontWeight,al:c.textAlign,vis}}).filter(h=>{const k=h.tag+h.t;if(seen.has(k)||!h.t)return false;seen.add(k);return true}).slice(0,60);
  const h1v=rows.filter(r=>r.tag==='H1'&&r.vis).length,h1h=rows.filter(r=>r.tag==='H1'&&!r.vis).length;
  return `<p><b>${fs.length} text font${fs.length===1?'':'s'}</b> render on this page.</p>
  ${fs.map(([f,v])=>{const sizes=[...v.sizes].sort((a,b)=>a-b);const w=[...v.weights];const faux=/marcellus/i.test(f)&&w.some(x=>+x>400);const fb=/lato/i.test(v.stack.split(',')[0])&&!document.fonts.check('16px Lato');
   return `<div class="da-card"><small>${v.n} text elements · e.g. “${esc(v.ex)}”</small><div class="spec" style="font-family:${esc(v.stack)}">${esc(f)} — Aa Bb 123</div><small style="color:#2a2f38">${sizes.length} size${sizes.length===1?'':'s'}: ${sizes.map(s=>+s.toFixed(1)+'px').join(', ')} · weights ${w.join(', ')}</small>${faux?'<small class="warn">Marcellus has only weight 400 — weights above 400 are faked by the browser (synthetic bold).</small>':''}${fb?'<small class="warn">Lato does not load, so this text falls back to Trebuchet MS.</small>':''}${/system-ui|apple-system/i.test(f)?'<small class="warn">OS font — looks different on Mac, Windows and Android.</small>':''}</div>`}).join('')}
  <h3>Headings on this page</h3><p style="color:#5d6470;font-size:12px">${h1v} visible H1 · ${h1h} hidden H1 · ${rows.filter(r=>!r.vis).length} hidden headings in total</p>
  <table class="da-htable">${rows.map(h=>`<tr style="${h.vis?'':'opacity:.55'}"><td>${h.tag}</td><td>${esc(h.t.slice(0,58))}${h.vis?'':' <span class="da-tag H">hidden</span>'}<div class="da-bar-h" style="width:${Math.min(h.fs*4,260)}px"></div></td><td style="white-space:nowrap">${h.fs}px · ${h.fw}<br><span style="color:#5d6470">${h.al}</span></td></tr>`).join('')}</table>
  ${G.fontsNote?`<h3>Site-wide font problems</h3><ul>${G.fontsNote.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}`},
 btns:()=>`<p>Each card is a live clone of one distinct button style found on this page (font, size, weight, colours, radius, border). <b>${buttonsLive().length} different styles.</b></p><div id="da-btns"></div>`,
 imgs:()=>{const im=imagesLive();const boxes=new Set(im.filter(x=>x.w>100).map(x=>(x.w/x.h).toFixed(2)));const flagged=im.filter(x=>x.fl.length);
  return `<p><b>${im.length}</b> visible images · <b>${boxes.size}</b> different box ratios among images wider than 100px · <b>${flagged.length}</b> with problems.</p>
  <table class="da-htable da-imgt"><tr><td></td><td><b>File</b></td><td><b>Shown / file</b></td></tr>${im.map((x,k)=>`<tr data-k="${k}" style="cursor:pointer"><td><img src="${esc(x.i.getAttribute('src'))}" style="width:44px;height:34px;object-fit:cover;border-radius:4px"></td><td style="word-break:break-all">${esc(x.src.slice(0,40))}${x.fl.map(f=>`<br><span class="da-tag ${/broken|stretched/.test(f)?'H':/upscaled|cropped/.test(f)?'M':'L'}">${esc(f)}</span>`).join('')}</td><td style="white-space:nowrap">${x.w}×${x.h}<br><span style="color:#5d6470">${x.nw}×${x.nh}</span></td></tr>`).join('')}</table>`},
 video:()=>!V?'':`<p><b>File:</b> VAS-Landscape-reel-video-07-10-to-web-page-adding.mp4 · 1920×1080 · 60 fps · 44.2 s · 10.3 Mbps · <b>56.9 MB</b> · includes an AAC audio track · no poster image.${window.AUDIT_HOSTED?' <span style="color:#5d6470">(This hosted preview plays a compressed copy; frames below are from the original.)</span>':''}</p>
 <p>One frame every 2 seconds. <b>${V.filter(v=>v[1]==='problem').length} of ${V.length}</b> frames show a problem: opening-day event footage, utility angles, a clinical close-up and a stitched split-screen of vertical reels.</p>
 <div class="da-frames">${V.map(v=>`<div class="da-frame"><img src="${G.assetBase||'../assets/'}audit/f_${String(v[0]/2+1).padStart(2,'0')}.jpg" data-t="${v[0]}" alt="Frame at ${v[0]}s"><div><span class="v ${v[1]==='problem'?'cut':'keep'}">${v[1]==='problem'?'PROBLEM':'ON BRAND'}</span> <span class="t">0:${String(v[0]).padStart(2,'0')}</span><p>${esc(v[2])}</p></div></div>`).join('')}</div>`,
 sys:()=>`<h3>Colours in use across the site (${(G.colours||[]).length})</h3>${(G.colours||[]).map(c=>`<div class="da-sw"><i style="background:${c[0]}"></i><code>${c[0]}</code><span>${esc(c[1])}</span></div>`).join('')}
 <h3>Spacing &amp; grid</h3><p>${esc(G.spacing||'')}</p>
 <h3>Template leftovers</h3><ul>${(G.template||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
 <h3>Performance &amp; build</h3><ul>${(G.performance||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`,
 pages:()=>{const groups={};PAGES.forEach(p=>(groups[p.group]=groups[p.group]||[]).push(p));
  return `<p>${PAGES.length} pages copied. Counts are pinned problems (high / medium / low).</p>${Object.entries(groups).map(([g,ps])=>`<h3>${esc(g)}</h3>${ps.map(p=>`<a class="da-page${p.slug===P.slug?' on':''}" href="${esc(p.slug)}.html"><span>${esc(p.name)}<small>${esc(p.path)}</small></span><span class="c"><i class="H">${p.c[0]}</i><i class="M">${p.c[1]}</i><i class="L">${p.c[2]}</i></span></a>`).join('')}`).join('')}`}
};
function listHTML(){let last='';return N.filter(n=>filt==='All'||n.cat===filt).map(n=>{const h=n.sec!==last?`<h3>${esc(n.sec)}</h3>`:'';last=n.sec;return h+`<div class="da-item${sel===n.n?' on':''}" data-n="${n.n}"><div class="num ${n.sev}">${n.n}</div><div><div><span class="da-tag ${n.sev}">${SEVN[n.sev]}</span><span class="da-tag cat">${esc(n.cat)}</span></div><h4>${esc(n.title)}</h4><div class="det"><p>${esc(n.note)}</p></div></div></div>`}).join('')||'<p style="color:#5d6470">No notes in this category.</p>'}
function bindTab(t){
 if(t==='summary')body.querySelectorAll('[data-go]').forEach(a=>a.onclick=e=>{e.preventDefault();select(+a.dataset.go,true)});
 if(t==='notes'){
  body.querySelector('.da-filter').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filt=b.dataset.f;body.querySelectorAll('.da-filter button').forEach(x=>x.classList.toggle('on',x===b));body.querySelector('#da-list').innerHTML=listHTML()});
  body.querySelector('#da-list').addEventListener('click',e=>{const it=e.target.closest('.da-item');if(it)select(+it.dataset.n,true)});
 }
 if(t==='imgs'){const im=imagesLive();body.querySelectorAll('.da-imgt tr[data-k]').forEach(tr=>tr.onclick=()=>{const x=im[+tr.dataset.k];if(!x)return;const r=x.i.getBoundingClientRect();scrollTo({top:r.top+scrollY-160,behavior:'smooth'});const b=document.createElement('div');b.className='da-box';b.style.cssText+=`display:block;left:${r.left+scrollX-3}px;top:${r.top+scrollY-3}px;width:${r.width+6}px;height:${r.height+6}px`;root.appendChild(b);setTimeout(()=>b.remove(),2500)})}
 if(t==='video'){body.querySelectorAll('.da-frame img').forEach(i=>i.onclick=()=>{const v=[...document.querySelectorAll('video')].find(visible);if(v){v.currentTime=+i.dataset.t;scrollTo({top:0,behavior:'smooth'});v.play().catch(()=>{})}})}
}
function buildButtons(){
 const host=body.querySelector('#da-btns');
 const props=['fontStyle','whiteSpace','fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','backgroundImage','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius','borderTop','borderRight','borderBottom','borderLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','textTransform','letterSpacing','textDecoration','boxShadow','display','alignItems','justifyContent','gap'];
 buttonsLive().forEach(g=>{const el=g.els[0],c=g.c,r=el.getBoundingClientRect();
  const cl=el.cloneNode(true);cl.removeAttribute('href');cl.removeAttribute('id');
  props.forEach(p=>cl.style[p]=c[p]);Object.assign(cl.style,{position:'static',margin:'0',animation:'none',transform:'none',pointerEvents:'none',boxSizing:'border-box',width:r.width+'px',height:r.height+'px',flex:'none'});
  const kids=cl.querySelectorAll('*');[...el.querySelectorAll('*')].forEach((d,i)=>{const cd=kids[i];if(!cd)return;const s=getComputedStyle(d);['fontFamily','fontSize','fontWeight','fontStyle','color','lineHeight'].forEach(p=>cd.style[p]=s[p]);if(s.display==='block')cd.style.display='inline-block'});
  const bg=bgOf(el.parentElement);const fg=rgb(c.color),own=rgb(c.backgroundColor);const back=(own[3]===undefined||own[3]>0.5)&&c.backgroundColor!=='rgba(0, 0, 0, 0)'?own:(bg||[255,255,255]);const cr=ratio(fg,back);
  const row=document.createElement('div');row.className='da-btnrow';
  const labels=[...new Set(g.els.map(e=>(e.textContent||e.value||'').trim().replace(/\s+/g,' ')).filter(Boolean))].slice(0,4);
  row.innerHTML=`<b style="font-size:12.5px">${g.els.length}× ${labels.length?'“'+esc(labels.join('”, “'))+'”':'(icon only)'}</b><div class="stage" style="background:${bg?hex(bg):'#3a3f47'}"></div><code>${esc(c.fontFamily.split(',')[0].replace(/"/g,''))} ${c.fontSize} / ${c.fontWeight} · ${Math.round(r.width)}×${Math.round(r.height)}px · radius ${c.borderTopLeftRadius}<br>bg ${c.backgroundColor} · text ${c.color}${c.textTransform!=='none'?' · '+c.textTransform:''}</code>${cr<4.5&&labels.length?`<small class="warn">Text contrast ${cr.toFixed(2)}:1 — below the 4.5:1 WCAG AA minimum.</small>`:''}`;
  row.querySelector('.stage').appendChild(cl);row.style.cursor='pointer';row.onclick=()=>{const rr=el.getBoundingClientRect();scrollTo({top:rr.top+scrollY-200,behavior:'smooth'})};host.appendChild(row)});
}

/* ---------- init ---------- */
document.querySelectorAll('.elementor-popup-modal').forEach(m=>m.style.display='none');
setTab('summary');
place();
addEventListener('resize',()=>{place();if(sel)showTip(N.find(n=>n.n===sel))});
addEventListener('load',()=>setTimeout(place,300));
setTimeout(place,1500);setTimeout(place,4000);
})();
