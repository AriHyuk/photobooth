/* ═══════════════════════════════════════════
   FRAME SYSTEM — tiap frame adalah fungsi
   drawFrame(ctx, w, h, padding) yang menggambar
   dekorasi di atas canvas yang sudah ada fotonya
   ═══════════════════════════════════════════ */
const FRAMES = [
  { id:'none', label:'Polos',
    bg: (ctx,w,h) => { ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h); },
    draw: ()=>{}
  },
  { id:'kawaii', label:'Kawaii 💗',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FFF0F8';
      ctx.fillRect(0,0,w,h);
      // polka dot bg
      ctx.fillStyle='rgba(255,180,210,.2)';
      for(let x=10;x<w;x+=22) for(let y=10;y<h;y+=22){
        ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
      }
    },
    draw: (ctx,w,h,pad) => {
      const shapes = [
        {x:.05,y:.04,s:16,t:'heart',c:'#FF6B9D'},
        {x:.9,y:.06,s:13,t:'star',c:'#FFD93D'},
        {x:.15,y:.95,s:14,t:'heart',c:'#FF6B9D'},
        {x:.8,y:.93,s:16,t:'star',c:'#A855F7'},
        {x:.96,y:.3,s:11,t:'heart',c:'#FF8B6B'},
        {x:.02,y:.7,s:12,t:'star',c:'#FFD93D'},
        {x:.5,y:.02,s:10,t:'bow',c:'#FF6B9D'},
        {x:.5,y:.97,s:10,t:'bow',c:'#A855F7'},
        {x:.92,y:.55,s:9,t:'heart',c:'#FF6B9D'},
        {x:.06,y:.45,s:9,t:'star',c:'#6BCBBD'},
        {x:.25,y:.02,s:8,t:'star',c:'#FFB6C1'},
        {x:.72,y:.97,s:8,t:'heart',c:'#FFB800'},
        {x:.88,y:.14,s:7,t:'star',c:'#FF6B9D'},
        {x:.12,y:.85,s:7,t:'heart',c:'#A855F7'},
      ];
      shapes.forEach(({x,y,s,t,c})=>{ drawShape(ctx,x*w,y*h,s,t,c); });
      // inner dotted border
      ctx.save();
      ctx.strokeStyle='rgba(255,107,157,.5)';
      ctx.lineWidth=1.5;
      ctx.setLineDash([4,4]);
      ctx.strokeRect(pad*.55,pad*.55,w-pad*1.1,h-pad*1.1);
      ctx.restore();
    }
  },
  { id:'floral', label:'Floral 🌸',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FFF8F0'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      const flowers = [
        {x:.04,y:.06,s:18,c:'#FF9EBC'},{x:.92,y:.05,s:16,c:'#FFB347'},
        {x:.08,y:.92,s:17,c:'#FF6B9D'},{x:.88,y:.9,s:18,c:'#FFD93D'},
        {x:.02,y:.35,s:13,c:'#FFB6C1'},{x:.96,y:.62,s:13,c:'#FF9EBC'},
        {x:.35,y:.02,s:12,c:'#FFD93D'},{x:.65,y:.97,s:12,c:'#FF6B9D'},
        {x:.18,y:.04,s:10,c:'#A855F7'},{x:.78,y:.03,s:10,c:'#6BCBBD'},
        {x:.05,y:.55,s:10,c:'#FFB347'},{x:.94,y:.38,s:10,c:'#FF9EBC'},
        {x:.48,y:.97,s:11,c:'#A855F7'},{x:.22,y:.95,s:9,c:'#FFD93D'},
        {x:.75,y:.94,s:9,c:'#FF6B9D'},
      ];
      // stems/leaves first
      flowers.forEach(({x,y,s,c})=>{ drawFlower(ctx,x*w,y*h,s,c); });
      // vine border
      drawVineBorder(ctx,w,h,pad);
    }
  },
  { id:'retro', label:'Retro 📼',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FDF6E3'; ctx.fillRect(0,0,w,h);
      // film grain subtle
      ctx.fillStyle='rgba(180,140,80,.04)';
      for(let i=0;i<800;i++){
        ctx.fillRect(Math.random()*w,Math.random()*h,1,1);
      }
    },
    draw: (ctx,w,h,pad) => {
      const bw = pad*.7;
      // outer thick border
      ctx.strokeStyle='#C8A96E'; ctx.lineWidth=bw; ctx.strokeRect(bw/2,bw/2,w-bw,h-bw);
      // double line
      ctx.strokeStyle='#8B6914'; ctx.lineWidth=1.5;
      ctx.strokeRect(bw+3,bw+3,w-bw*2-6,h-bw*2-6);
      // corner ornaments
      const corners = [[bw,bw],[w-bw,bw],[bw,h-bw],[w-bw,h-bw]];
      corners.forEach(([cx,cy])=>drawRetroCorner(ctx,cx,cy,bw*.8,'#8B6914'));
      // film holes top bottom
      ctx.fillStyle='#C8A96E';
      for(let x=bw*2;x<w-bw*2;x+=bw*1.4){
        rr(ctx,x-bw*.25,2,bw*.5,bw*.4,2); ctx.fill();
        rr(ctx,x-bw*.25,h-bw*.4-2,bw*.5,bw*.4,2); ctx.fill();
      }
    }
  },
  { id:'minimal', label:'Minimal ▭',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FAFAFA'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      const p=pad*.5;
      // clean single line border
      ctx.strokeStyle='#CCCCCC'; ctx.lineWidth=1; ctx.strokeRect(p,p,w-p*2,h-p*2);
      // corner L-marks
      const sz=12, off=p;
      const corners2=[[off,off],[w-off,off],[off,h-off],[w-off,h-off]];
      corners2.forEach(([cx,cy])=>drawLCorner(ctx,cx,cy,sz,'#999'));
    }
  },
  { id:'christmas', label:'Natal 🎄',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#F0FBF0'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      // red-green stripe border
      const bw=pad*.6;
      for(let i=0;i<Math.ceil(w/bw);i++){
        ctx.fillStyle=i%2===0?'#CC2200':'#1A7A1A';
        ctx.fillRect(i*bw,0,bw,bw*.7);
        ctx.fillRect(i*bw,h-bw*.7,bw,bw*.7);
      }
      for(let i=0;i<Math.ceil(h/bw);i++){
        ctx.fillStyle=i%2===0?'#CC2200':'#1A7A1A';
        ctx.fillRect(0,i*bw,bw*.7,bw);
        ctx.fillRect(w-bw*.7,i*bw,bw*.7,bw);
      }
      // snowflakes
      ctx.fillStyle='rgba(255,255,255,.85)';
      const snows=[{x:.1,y:.1},{x:.9,y:.08},{x:.05,y:.88},{x:.92,y:.85},
                   {x:.5,y:.04},{x:.5,y:.95},{x:.03,y:.5},{x:.96,y:.5}];
      snows.forEach(({x,y})=>drawSnowflake(ctx,x*w,y*h,10));
      // holly
      drawHolly(ctx,pad*1.2,pad*1.2,14);
      drawHolly(ctx,w-pad*1.2,pad*1.2,14);
      drawHolly(ctx,pad*1.2,h-pad*1.2,14);
      drawHolly(ctx,w-pad*1.2,h-pad*1.2,14);
    }
  },
  { id:'lebaran', label:'Lebaran 🌙',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FFF9EC'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      // gold border
      const bw=pad*.65;
      ctx.fillStyle='#C8960C';
      ctx.fillRect(0,0,w,bw); ctx.fillRect(0,h-bw,w,bw);
      ctx.fillRect(0,0,bw,h); ctx.fillRect(w-bw,0,bw,h);
      ctx.fillStyle='#FFD700';
      ctx.fillRect(bw*.3,bw*.3,w-bw*.6,bw*.4);
      ctx.fillRect(bw*.3,h-bw*.7,w-bw*.6,bw*.4);
      ctx.fillRect(bw*.3,bw*.3,bw*.4,h-bw*.6);
      ctx.fillRect(w-bw*.7,bw*.3,bw*.4,h-bw*.6);
      // geometric lantern patterns corners
      const pts=[
        [pad*1.1,pad*1.1],[w-pad*1.1,pad*1.1],
        [pad*1.1,h-pad*1.1],[w-pad*1.1,h-pad*1.1]
      ];
      pts.forEach(([x,y])=>drawLantern(ctx,x,y,pad*.6));
      // crescent moon + star center top
      drawCrescent(ctx,w/2,pad*.5,bw*.55);
      drawCrescent(ctx,w/2,h-pad*.5,bw*.55);
    }
  },
  { id:'birthday', label:'Ultah 🎂',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FFFDE8'; ctx.fillRect(0,0,w,h);
      // confetti bg
      const confColors=['#FF6B9D','#FFD93D','#6BCBBD','#A855F7','#FF8B6B'];
      for(let i=0;i<120;i++){
        ctx.fillStyle=confColors[i%5]+'55';
        ctx.save();
        ctx.translate(Math.random()*w,Math.random()*h);
        ctx.rotate(Math.random()*Math.PI*2);
        ctx.fillRect(-3,-2,6,4);
        ctx.restore();
      }
    },
    draw: (ctx,w,h,pad) => {
      // rainbow border stripes
      const bw=pad*.55;
      const cols=['#FF6B9D','#FF8B6B','#FFD93D','#6BCBBD','#A855F7'];
      for(let i=0;i<5;i++){
        ctx.strokeStyle=cols[i]; ctx.lineWidth=bw/5;
        const o=i*(bw/5)+bw*.1;
        ctx.strokeRect(o,o,w-o*2,h-o*2);
      }
      // balloons corners
      drawBalloon(ctx,pad*1.1,pad*1.4,'#FF6B9D');
      drawBalloon(ctx,w-pad*1.1,pad*1.4,'#FFD93D');
      drawBalloon(ctx,pad*1.1,h-pad*1.4,'#6BCBBD');
      drawBalloon(ctx,w-pad*1.1,h-pad*1.4,'#A855F7');
      // stars scattered
      const stpos=[{x:.35,y:.04},{x:.62,y:.04},{x:.5,y:.96},{x:.24,y:.96},{x:.75,y:.95}];
      stpos.forEach(({x,y})=>drawShape(ctx,x*w,y*h,8,'star','#FFD93D'));
    }
  },
  { id:'polaroid', label:'Polaroid 📷',
    bg: (ctx,w,h) => {
      // slight cream
      ctx.fillStyle='#FFFEF5'; ctx.fillRect(0,0,w,h);
      // subtle shadow inside top
      const g=ctx.createLinearGradient(0,0,0,20);
      g.addColorStop(0,'rgba(0,0,0,.06)'); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,w,20);
    },
    draw: (ctx,w,h,pad) => {
      const thick=pad*.9;
      const bottomExtra=pad*1.8;
      // solid white thick border
      ctx.fillStyle='#FFFEF5';
      ctx.fillRect(0,0,thick,h);
      ctx.fillRect(w-thick,0,thick,h);
      ctx.fillRect(0,0,w,thick);
      ctx.fillRect(0,h-bottomExtra,w,bottomExtra);
      // thin shadow line inside photo
      ctx.strokeStyle='rgba(0,0,0,.08)'; ctx.lineWidth=1;
      ctx.strokeRect(thick,thick,w-thick*2,h-thick-bottomExtra);
    }
  },
  { id:'stardust', label:'Stardust ✨',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#0D0B1E'; ctx.fillRect(0,0,w,h);
      // stars
      for(let i=0;i<200;i++){
        const a=Math.random();
        ctx.fillStyle=`rgba(255,255,255,${a*.7+.1})`;
        const sz=Math.random()*1.5;
        ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,sz,0,Math.PI*2);ctx.fill();
      }
    },
    draw: (ctx,w,h,pad) => {
      // glow border
      ctx.strokeStyle='rgba(168,85,247,.6)'; ctx.lineWidth=2;
      ctx.strokeRect(pad*.5,pad*.5,w-pad,h-pad);
      ctx.strokeStyle='rgba(168,85,247,.2)'; ctx.lineWidth=6;
      ctx.strokeRect(pad*.5,pad*.5,w-pad,h-pad);
      // sparkles corners
      const pts=[[pad*.7,pad*.7],[w-pad*.7,pad*.7],[pad*.7,h-pad*.7],[w-pad*.7,h-pad*.7]];
      pts.forEach(([x,y])=>drawSparkle(ctx,x,y,12,'#A855F7'));
      // shooting star
      const pts2=[{x:.3,y:.03},{x:.7,y:.97}];
      pts2.forEach(({x,y})=>drawShape(ctx,x*w,y*h,7,'star','#FFD93D'));
    }
  },
  { id:'pastel', label:'Pastel 🍬',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#F5F0FF'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      // wavy border using arc segments
      const bw=pad*.5;
      drawWavyBorder(ctx,w,h,bw,'#DDB6FF','#B8E8FF');
      // soft diamond corners
      const cps=[[pad*.85,pad*.85],[w-pad*.85,pad*.85],[pad*.85,h-pad*.85],[w-pad*.85,h-pad*.85]];
      const cs=['#FFB6C1','#B8E8FF','#C3FFD1','#FFD6A5'];
      cps.forEach(([x,y],i)=>drawDiamond(ctx,x,y,10,cs[i]));
    }
  },
  { id:'halftone', label:'Pop Art 🟡',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#FFED00'; ctx.fillRect(0,0,w,h);
      // halftone dots
      ctx.fillStyle='rgba(0,0,0,.12)';
      for(let x=0;x<w;x+=8) for(let y=0;y<h;y+=8){
        ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();
      }
    },
    draw: (ctx,w,h,pad) => {
      const bw=pad*.7;
      // bold black border
      ctx.fillStyle='#111';
      ctx.fillRect(0,0,w,bw); ctx.fillRect(0,h-bw,w,bw);
      ctx.fillRect(0,0,bw,h); ctx.fillRect(w-bw,0,bw,h);
      // speech bubble corner
      drawSpeechBubble(ctx,w*.5,pad*.5,40,pad*.55,'#111','CLICK!','#FFED00');
    }
  },
  { id:'botanical', label:'Botanical 🌿',
    bg: (ctx,w,h) => {
      ctx.fillStyle='#F0F7EE'; ctx.fillRect(0,0,w,h);
    },
    draw: (ctx,w,h,pad) => {
      drawBotanicalBorder(ctx,w,h,pad);
    }
  },
];

/* ═══════════════════════
   DRAWING HELPERS
   ═══════════════════════ */
function drawShape(ctx,x,y,s,type,color){
  ctx.save(); ctx.translate(x,y);
  if(type==='heart'){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(0,-s*.35);
    ctx.bezierCurveTo(s*.5,-s,s*1.1,-s*.2,0,s*.5);
    ctx.bezierCurveTo(-s*1.1,-s*.2,-s*.5,-s,0,-s*.35);
    ctx.fill();
  } else if(type==='star'){
    ctx.fillStyle=color;
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5-Math.PI/2;
      const b=a+Math.PI/5;
      i===0?ctx.moveTo(Math.cos(a)*s,Math.sin(a)*s):ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s);
      ctx.lineTo(Math.cos(b)*s*.4,Math.sin(b)*s*.4);
    }
    ctx.closePath(); ctx.fill();
  } else if(type==='bow'){
    ctx.fillStyle=color;
    ctx.beginPath();ctx.ellipse(-s*.5,0,s*.5,s*.3,-.4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(s*.5,0,s*.5,s*.3,.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,s*.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,s*.12,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function drawFlower(ctx,x,y,s,color){
  ctx.save(); ctx.translate(x,y);
  // petals
  for(let i=0;i<6;i++){
    ctx.save(); ctx.rotate(i*Math.PI/3);
    ctx.fillStyle=color+'CC';
    ctx.beginPath(); ctx.ellipse(0,-s*.6,s*.3,s*.55,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  // center
  ctx.fillStyle='#FFD93D';
  ctx.beginPath(); ctx.arc(0,0,s*.28,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawVineBorder(ctx,w,h,pad){
  const pts=[];
  const segs=12;
  // top
  for(let i=0;i<=segs;i++) pts.push([w*i/segs,pad*.4+Math.sin(i*1.2)*4]);
  ctx.strokeStyle='#6B9E4A'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
  pts.forEach(([x,y])=>ctx.lineTo(x,y)); ctx.stroke();
  // small leaves along vine
  for(let i=1;i<segs;i+=2){
    const [lx,ly]=pts[i];
    drawLeaf(ctx,lx,ly,8,'#6B9E4A');
  }
}

function drawLeaf(ctx,x,y,s,color){
  ctx.save(); ctx.translate(x,y); ctx.rotate(-Math.PI/4);
  ctx.fillStyle=color+'BB';
  ctx.beginPath(); ctx.ellipse(0,0,s*.3,s*.7,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawRetroCorner(ctx,x,y,s,color){
  ctx.save(); ctx.translate(x,y);
  ctx.strokeStyle=color; ctx.lineWidth=1.5;
  // diamond shape
  ctx.beginPath();
  ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0); ctx.closePath();
  ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,s*.35,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}

function drawLCorner(ctx,x,y,s,color){
  ctx.strokeStyle=color; ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(x-s,y); ctx.lineTo(x,y); ctx.lineTo(x,y-s);
  ctx.stroke();
}

function drawSnowflake(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.strokeStyle='#fff'; ctx.lineWidth=1.5;
  for(let i=0;i<6;i++){
    ctx.rotate(Math.PI/3);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,s*.4); ctx.lineTo(s*.2,s*.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,s*.4); ctx.lineTo(-s*.2,s*.6); ctx.stroke();
  }
  ctx.restore();
}

function drawHolly(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='#1A7A1A';
  ctx.beginPath(); ctx.ellipse(-s*.4,0,s*.5,s*.3,-.5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s*.4,0,s*.5,s*.3,.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#CC2200';
  ctx.beginPath(); ctx.arc(-s*.15,-s*.2,s*.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*.15,-s*.15,s*.18,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawLantern(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='#FFD700AA';
  ctx.beginPath();
  ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#C8960C'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(0,s); ctx.stroke();
  ctx.restore();
}

function drawCrescent(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='#C8960C';
  ctx.beginPath(); ctx.arc(0,0,s,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#FFF9EC';
  ctx.beginPath(); ctx.arc(s*.35,0,s*.75,0,Math.PI*2); ctx.fill();
  // star
  ctx.fillStyle='#C8960C';
  drawShape(ctx,s*1.1,-s*.6,s*.35,'star','#C8960C');
  ctx.restore();
}

function drawBalloon(ctx,x,y,color){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle=color;
  ctx.beginPath(); ctx.ellipse(0,-12,9,12,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=color; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(5,4,5,8,0,12); ctx.stroke();
  ctx.restore();
}

function drawSparkle(ctx,x,y,s,color){
  ctx.save(); ctx.translate(x,y); ctx.strokeStyle=color; ctx.lineWidth=1.5;
  for(let i=0;i<4;i++){
    ctx.save(); ctx.rotate(i*Math.PI/4);
    ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(0,-s*.3); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle=color;
  ctx.beginPath(); ctx.arc(0,0,s*.18,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawWavyBorder(ctx,w,h,bw,c1,c2){
  // top wave
  ctx.fillStyle=c1;
  ctx.beginPath(); ctx.moveTo(0,0);
  for(let x=0;x<=w;x+=10) ctx.lineTo(x,bw+Math.sin(x/15)*3);
  ctx.lineTo(w,0); ctx.closePath(); ctx.fill();
  // bottom wave
  ctx.fillStyle=c2;
  ctx.beginPath(); ctx.moveTo(0,h);
  for(let x=0;x<=w;x+=10) ctx.lineTo(x,h-bw-Math.sin(x/15)*3);
  ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
  // sides
  ctx.fillStyle=c1;
  ctx.beginPath(); ctx.moveTo(0,0);
  for(let y=0;y<=h;y+=10) ctx.lineTo(bw+Math.sin(y/15)*3,y);
  ctx.lineTo(0,h); ctx.closePath(); ctx.fill();
  // sides 2
  ctx.fillStyle=c2;
  ctx.beginPath(); ctx.moveTo(w,0);
  for(let y=0;y<=h;y+=10) ctx.lineTo(w-bw-Math.sin(y/15)*3,y);
  ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
}

function drawDiamond(ctx,x,y,s,color){
  ctx.save(); ctx.translate(x,y); ctx.fillStyle=color;
  ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0);
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawSpeechBubble(ctx,x,y,w,h,borderColor,text,bgColor){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle=bgColor; ctx.strokeStyle=borderColor; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.roundRect(-w/2,-h,w,h*1.6,4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle=borderColor;
  ctx.font=`bold ${h*.7}px 'Fredoka',sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(text,0,h*.3);
  ctx.restore();
}

function drawBotanicalBorder(ctx,w,h,pad){
  const bw=pad*.65;
  // deep green base
  ctx.fillStyle='#2D5A27';
  ctx.fillRect(0,0,w,bw*.7); ctx.fillRect(0,h-bw*.7,w,bw*.7);
  ctx.fillRect(0,0,bw*.7,h); ctx.fillRect(w-bw*.7,0,bw*.7,h);
  // lighter inner
  ctx.fillStyle='#4A8A42';
  ctx.fillRect(bw*.3,bw*.3,w-bw*.6,bw*.4);
  ctx.fillRect(bw*.3,h-bw*.7,w-bw*.6,bw*.4);
  ctx.fillRect(bw*.3,bw*.3,bw*.4,h-bw*.6);
  ctx.fillRect(w-bw*.7,bw*.3,bw*.4,h-bw*.6);
  // ferns at corners
  const pts=[[pad,pad],[w-pad,pad],[pad,h-pad],[w-pad,h-pad]];
  pts.forEach(([fx,fy])=>drawFern(ctx,fx,fy,bw*.8));
  // dots on border
  ctx.fillStyle='#FFD93DAA';
  for(let x=bw*1.5;x<w-bw;x+=bw*1.3){
    ctx.beginPath();ctx.arc(x,bw*.35,2.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x,h-bw*.35,2.5,0,Math.PI*2);ctx.fill();
  }
}

function drawFern(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y);
  for(let i=0;i<5;i++){
    ctx.save(); ctx.rotate((i-2)*Math.PI/7);
    ctx.fillStyle='#6DBF65CC';
    ctx.beginPath(); ctx.ellipse(0,-s*(i*.08+.3),s*.12,s*.28,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function rr(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
