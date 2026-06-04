/* ═══════════════════════════════════════════
   THUMBNAIL PREVIEW
   ═══════════════════════════════════════════ */
function drawFrameThumb(frame){
  const c=document.createElement('canvas');
  c.width=50; c.height=50;
  const ctx=c.getContext('2d');
  const pad=7;
  frame.bg(ctx,50,50);
  // photo area (mock)
  ctx.fillStyle='#DDD';
  ctx.fillRect(pad,pad,50-pad*2,50-pad*2);
  // gradient mock photo
  const g=ctx.createLinearGradient(pad,pad,50-pad,50-pad);
  g.addColorStop(0,'#FFB6C1'); g.addColorStop(.5,'#C8A2C8'); g.addColorStop(1,'#87CEEB');
  ctx.fillStyle=g; ctx.fillRect(pad,pad,50-pad*2,50-pad*2);
  frame.draw(ctx,50,50,pad);
  return c;
}

/* ═══════════════════════════════════════════
   BUILD UI
   ═══════════════════════════════════════════ */
function buildFilters(){
  FILTERS.forEach(f=>{
    const wrap=document.createElement('div');
    wrap.className='filter-thumb'+(f.id===state.filter?' active':'');
    wrap.innerHTML=`<div class="thumb-preview" style="background:linear-gradient(135deg,#FFB6C1,#C8A2C8,#87CEEB);filter:${f.css}"></div><small>${f.label}</small>`;
    wrap.addEventListener('click',()=>{
      state.filter=f.id;
      document.querySelectorAll('.filter-thumb').forEach(e=>e.classList.remove('active'));
      wrap.classList.add('active'); renderStrip();
    });
    document.getElementById('filter-row').appendChild(wrap);
  });
}

function buildLayouts(){
  const icons={
    '2x2':[[18,18],[18,18]],'4x1':[[36,7],[36,7],[36,7],[36,7]],
    '1x4':[[7,36],[7,36],[7,36],[7,36]],'3x1':[[36,9],[36,9],[36,9]],
    '2x3':[[16,11],[16,11],[16,11]],'1x1':[[36,36]]
  };
  LAYOUTS.forEach(l=>{
    const el=document.createElement('div');
    el.className='layout-opt'+(l.id===state.layout?' selected':'');
    const icon=icons[l.id]||[[20,20]];
    const iconHtml=icon.map(([w,h])=>`<span style="width:${w}px;height:${h}px"></span>`).join('<span style="width:2px;display:inline-block"></span>');
    el.innerHTML=`<div class="layout-icon">${iconHtml}</div><small>${l.label}</small>`;
    el.addEventListener('click',()=>{
      state.layout=l.id;
      document.querySelectorAll('.layout-opt').forEach(e=>e.classList.remove('selected'));
      el.classList.add('selected'); updateShotsLabel();
    });
    document.getElementById('layout-grid').appendChild(el);
  });
}

function buildFrames(){
  FRAMES.forEach(f=>{
    const el=document.createElement('div');
    el.className='frame-opt'+(f.id===state.frame?' selected':'');
    const thumb=drawFrameThumb(f);
    el.appendChild(thumb);
    const lbl=document.createElement('small');
    lbl.textContent=f.label;
    el.appendChild(lbl);
    el.addEventListener('click',()=>{
      state.frame=f.id;
      document.querySelectorAll('.frame-opt').forEach(e=>e.classList.remove('selected'));
      el.classList.add('selected'); renderStrip();
    });
    document.getElementById('frame-grid').appendChild(el);
  });
}

function buildEmojis(){
  const picker = document.getElementById('emoji-picker');
  EMOJIS.forEach(em=>{
    const btn=document.createElement('button');
    btn.className='emoji-btn';
    btn.textContent=em;
    btn.addEventListener('click', ()=>addEmojiToOverlay(em));
    picker.appendChild(btn);
  });
}

buildFilters(); buildLayouts(); buildFrames(); buildEmojis();

/* ─── Tabs ─── */
document.getElementById('source-tabs').addEventListener('click',e=>{
  const tab=e.target.dataset.tab; if(!tab) return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('tab-webcam').style.display=tab==='webcam'?'block':'none';
  document.getElementById('tab-upload').style.display=tab==='upload'?'block':'none';
});

/* ─── Timer ─── */
document.querySelectorAll('.timer-opt').forEach(el=>{
  el.addEventListener('click',()=>{
    state.timer=parseInt(el.dataset.timer);
    document.querySelectorAll('.timer-opt').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');
  });
});

/* ─── Camera ─── */
const video=document.getElementById('video');
const canvasCap=document.getElementById('canvas-capture');
const ctxCap=canvasCap.getContext('2d');
const countdownDisplay=document.getElementById('countdown-display');
const flashOverlay=document.getElementById('flash-overlay');
const btnStartCam=document.getElementById('btn-start-cam');
const btnCapture=document.getElementById('btn-capture');

btnStartCam.addEventListener('click',async()=>{
  try{
    state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:1280},audio:false});
    video.srcObject=state.stream;
    video.style.display='block';
    document.getElementById('cam-placeholder').style.display='none';
    btnCapture.disabled=false;
    btnStartCam.textContent='🔴 Kamera Nyala';
    btnStartCam.disabled=true;
  }catch(e){alert('Gagal akses kamera: '+e.message);}
});

btnCapture.addEventListener('click',()=>{
  if(state.isCounting) return;
  state.timer===0?captureFrame():startCountdown(state.timer);
});

function startCountdown(sec){
  state.isCounting=true; btnCapture.disabled=true;
  countdownDisplay.style.display='flex';
  let n=sec; countdownDisplay.textContent=n;
  const iv=setInterval(()=>{
    n--;
    if(n<=0){clearInterval(iv);countdownDisplay.style.display='none';state.isCounting=false;btnCapture.disabled=false;captureFrame();}
    else countdownDisplay.textContent=n;
  },1000);
}

function doFlash(){flashOverlay.style.opacity='1';setTimeout(()=>{flashOverlay.style.opacity='0';},150);}

function captureFrame(){
  if(!state.stream) return;
  canvasCap.width=video.videoWidth; canvasCap.height=video.videoHeight;
  ctxCap.save(); ctxCap.translate(canvasCap.width,0); ctxCap.scale(-1,1);
  ctxCap.drawImage(video,0,0); ctxCap.restore();
  addShot(canvasCap.toDataURL('image/jpeg',.92)); doFlash();
}

/* ─── Upload ─── */
const uploadZone=document.getElementById('upload-zone');
const fileInput=document.getElementById('file-input');
uploadZone.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',e=>handleFiles(Array.from(e.target.files)));
uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('drag-over');});
uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop',e=>{
  e.preventDefault();uploadZone.classList.remove('drag-over');
  handleFiles(Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')));
});
function handleFiles(files){
  files.forEach(file=>{const r=new FileReader();r.onload=ev=>addShot(ev.target.result);r.readAsDataURL(file);});
}

/* ─── Shots ─── */
function addShot(dataUrl){
  const layout=LAYOUTS.find(l=>l.id===state.layout);
  const max=(layout?layout.cols*layout.rows:4)*2;
  if(state.shots.length>=max){alert('Foto udah banyak banget, hapus dulu ya!');return;}
  state.shots.push(dataUrl);renderQueue();updateShotsLabel();
}

function renderQueue(){
  const sq=document.getElementById('shot-queue');
  sq.innerHTML='';
  state.shots.forEach((url,i)=>{
    const wrap=document.createElement('div');wrap.className='shot-thumb';
    const img=document.createElement('img');img.src=url;
    const rm=document.createElement('button');rm.className='remove-shot';rm.innerHTML='×';
    rm.addEventListener('click',e=>{e.stopPropagation();state.shots.splice(i,1);renderQueue();updateShotsLabel();});
    wrap.appendChild(img);wrap.appendChild(rm);sq.appendChild(wrap);
  });
  const layout=LAYOUTS.find(l=>l.id===state.layout);
  const needed=layout?layout.cols*layout.rows:4;
  for(let i=state.shots.length;i<needed;i++){
    const e=document.createElement('div');e.className='shot-empty';e.textContent='+';sq.appendChild(e);
  }
}

function updateShotsLabel(){
  const layout=LAYOUTS.find(l=>l.id===state.layout);
  const needed=layout?layout.cols*layout.rows:4;
  document.getElementById('shots-count').textContent=`(${state.shots.length}/${needed})`;
  document.getElementById('shots-hint').textContent=
    state.shots.length===0?'Ambil atau upload foto untuk mulai!':
    state.shots.length<needed?`Butuh ${needed-state.shots.length} foto lagi.`:
    'Siap generate! ✨';
  renderQueue();
}

/* ─── Toggles ─── */
const toggleDate=document.getElementById('toggle-date');
const toggleCaption=document.getElementById('toggle-caption');
const captionWrap=document.getElementById('caption-input-wrap');
const captionText=document.getElementById('caption-text');
toggleDate.addEventListener('click',()=>{state.showDate=!state.showDate;toggleDate.classList.toggle('on',state.showDate);});
toggleCaption.addEventListener('click',()=>{
  state.showCaption=!state.showCaption;toggleCaption.classList.toggle('on',state.showCaption);
  captionWrap.style.display=state.showCaption?'block':'none';
});

/* ─── Emojis ─── */
const emojiOverlay = document.getElementById('emoji-overlay');
function addEmojiToOverlay(em){
  if(document.getElementById('strip-canvas').style.display==='none'){
    alert('Generate strip dulu ya buat nambah stiker!'); return;
  }
  const el=document.createElement('div');
  el.className='draggable-emoji';
  el.textContent=em;
  // Center roughly
  el.style.left = '50%';
  el.style.top = '50%';
  emojiOverlay.appendChild(el);
  
  // Drag logic
  let isDragging=false, startX, startY, initialLeft, initialTop;
  
  function onPointerDown(e){
    isDragging=true;
    // ensure pointers like touch are handled
    const pointer = e.type.includes('touch') ? e.touches[0] : e;
    startX = pointer.clientX;
    startY = pointer.clientY;
    initialLeft = el.offsetLeft;
    initialTop = el.offsetTop;
    el.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e){
    if(!isDragging) return;
    const pointer = e.type.includes('touch') ? e.touches[0] : e;
    const dx = pointer.clientX - startX;
    const dy = pointer.clientY - startY;
    el.style.left = (initialLeft + dx) + 'px';
    el.style.top = (initialTop + dy) + 'px';
  }
  function onPointerUp(e){
    isDragging=false;
    el.releasePointerCapture?.(e.pointerId);
  }
  
  el.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  
  el.addEventListener('touchstart', onPointerDown, {passive:false});
  window.addEventListener('touchmove', onPointerMove, {passive:false});
  window.addEventListener('touchend', onPointerUp);
}

/* ─── Generate ─── */
document.getElementById('btn-generate').addEventListener('click',()=>{
  const layout=LAYOUTS.find(l=>l.id===state.layout);
  const needed=layout.cols*layout.rows;
  if(state.shots.length<needed){alert(`Layout ${layout.label} butuh ${needed} foto. Kamu baru punya ${state.shots.length}.`);return;}
  const pb=document.getElementById('progress-bar');const pf=document.getElementById('progress-fill');
  pb.style.display='block';pf.style.width='0%';
  setTimeout(()=>pf.style.width='50%',50);
  setTimeout(()=>renderStrip(true),100);
});

async function renderStrip(showProgress){
  const layout=LAYOUTS.find(l=>l.id===state.layout);
  if(!layout) return;
  const needed=layout.cols*layout.rows;
  if(state.shots.length<needed) return;

  const frame=FRAMES.find(f=>f.id===state.frame)||FRAMES[0];
  const PADDING=22;
  const GAP=8;
  const CELL_W=220;
  const CELL_H=Math.round(CELL_W*3/4);
  const FOOTER=(state.showDate||state.showCaption)?40:0;

  let stripW,stripH;
  if(layout.cols===1){
    stripW=CELL_W+PADDING*2;
    stripH=CELL_H*layout.rows+GAP*(layout.rows-1)+PADDING*2+FOOTER;
  } else if(layout.rows===1){
    stripW=CELL_W*layout.cols+GAP*(layout.cols-1)+PADDING*2;
    stripH=CELL_H+PADDING*2+FOOTER;
  } else {
    stripW=CELL_W*layout.cols+GAP*(layout.cols-1)+PADDING*2;
    stripH=CELL_H*layout.rows+GAP*(layout.rows-1)+PADDING*2+FOOTER;
  }

  const sc=document.getElementById('strip-canvas');
  sc.width=stripW; sc.height=stripH;
  const ctx=sc.getContext('2d');

  // 1) draw frame background
  frame.bg(ctx,stripW,stripH);

  // 2) draw photos
  const filterDef=FILTERS.find(f=>f.id===state.filter);
  ctx.filter=filterDef?filterDef.css:'none';
  const imgs=await Promise.all(state.shots.slice(0,needed).map(loadImg));
  for(let i=0;i<needed;i++){
    const col=i%layout.cols;
    const row=Math.floor(i/layout.cols);
    const x=PADDING+col*(CELL_W+GAP);
    const y=PADDING+row*(CELL_H+GAP);
    ctx.save();
    rr(ctx,x,y,CELL_W,CELL_H,6); ctx.clip();
    const img=imgs[i];
    const scale=Math.max(CELL_W/img.naturalWidth,CELL_H/img.naturalHeight);
    const sw=img.naturalWidth*scale, sh=img.naturalHeight*scale;
    ctx.drawImage(img,x+(CELL_W-sw)/2,y+(CELL_H-sh)/2,sw,sh);
    ctx.restore();
  }
  ctx.filter='none';

  // 3) draw frame decorations ON TOP
  frame.draw(ctx,stripW,stripH,PADDING);

  // 4) footer
  if(FOOTER>0){
    const fy=stripH-FOOTER;
    ctx.fillStyle='rgba(255,255,255,.12)';
    ctx.fillRect(0,fy,stripW,FOOTER);
    const isDark=isColorDark(getFrameMainColor(frame.id));
    ctx.fillStyle=isDark?'rgba(255,255,255,.9)':'rgba(26,26,46,.75)';
    ctx.textAlign='center';
    ctx.font='11px "DM Sans",sans-serif';
    let txt='';
    if(state.showDate) txt+=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
    if(state.showCaption&&captionText.value) txt+=(txt?' · ':'')+captionText.value;
    ctx.fillText(txt,stripW/2,fy+24);
  }

  document.getElementById('strip-empty-msg').style.display='none';
  sc.style.display='block';
  emojiOverlay.style.display='block';
  document.getElementById('btn-download').disabled=false;
  if(showProgress){
    const pf=document.getElementById('progress-fill');
    pf.style.width='100%';
    setTimeout(()=>{document.getElementById('progress-bar').style.display='none';pf.style.width='0%';},600);
  }
}

function getFrameMainColor(id){
  const dark=['stardust'];
  return dark.includes(id)?'#000':'#fff';
}

function loadImg(src){
  return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src;});
}

function isColorDark(hex){
  if(!hex||!hex.startsWith('#')) return false;
  const c=hex.replace('#','');
  return(.299*parseInt(c.substr(0,2),16)+.587*parseInt(c.substr(2,2),16)+.114*parseInt(c.substr(4,2),16))<128;
}

/* ─── Download / Reset ─── */
document.getElementById('btn-download').addEventListener('click',()=>{
  const sc=document.getElementById('strip-canvas');
  const ctx=sc.getContext('2d');
  
  // Draw emojis onto canvas before downloading
  const rect = sc.getBoundingClientRect();
  const scaleX = sc.width / rect.width;
  const scaleY = sc.height / rect.height;
  
  const emojis = emojiOverlay.querySelectorAll('.draggable-emoji');
  if(emojis.length > 0) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    emojis.forEach(el => {
      // Map DOM coordinates to Canvas coordinates
      const cx = el.offsetLeft * scaleX;
      const cy = el.offsetTop * scaleY;
      
      // Calculate font size relative to canvas
      const computedStyle = window.getComputedStyle(el);
      const fontSizePx = parseFloat(computedStyle.fontSize);
      const canvasFontSize = fontSizePx * scaleX;
      
      ctx.font = `${canvasFontSize}px sans-serif`;
      ctx.fillText(el.textContent, cx, cy);
    });
    ctx.restore();
    
    // Clear overlay since they are drawn now
    emojiOverlay.innerHTML = '';
  }

  const link=document.createElement('a');
  link.download=`photobox-${Date.now()}.png`;
  link.href=sc.toDataURL('image/png');
  link.click();
});

document.getElementById('btn-reset').addEventListener('click',()=>{
  state.shots=[];renderQueue();updateShotsLabel();
  const sc=document.getElementById('strip-canvas');
  sc.style.display='none';
  emojiOverlay.style.display='none';
  emojiOverlay.innerHTML='';
  document.getElementById('strip-empty-msg').style.display='block';
  document.getElementById('btn-download').disabled=true;
});

updateShotsLabel();
