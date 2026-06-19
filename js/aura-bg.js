/* Step Aura — Animated Background Engine */
(function () {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const canvas = document.getElementById('aura-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, raf;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  const STAR_COUNT = reducedMotion ? 0 : (isMobile ? 80 : 190);
  function makeParticle() {
    const hues = ['200,140,255','140,120,255','220,200,255','255,255,255','180,130,255'];
    return {
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.4+0.25,
      alpha: Math.random()*0.55+0.08,
      vx: (Math.random()-0.5)*0.18,
      vy: -(Math.random()*0.10+0.03),
      tw: Math.random()*Math.PI*2,
      ts: Math.random()*0.022+0.004,
      hue: hues[Math.floor(Math.random()*hues.length)],
    };
  }
  let particles = [];
  function initParticles() { particles = Array.from({length:STAR_COUNT}, makeParticle); }

  function drawParticles() {
    for (const p of particles) {
      p.tw += p.ts;
      const a = p.alpha*(0.5+0.5*Math.sin(p.tw));
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5);
      g.addColorStop(0,`rgba(${p.hue},${a*0.6})`);
      g.addColorStop(1,`rgba(${p.hue},0)`);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3.5,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.hue},${a})`; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.y<-6) p.y=H+6;
      if(p.x<-6) p.x=W+6;
      if(p.x>W+6) p.x=-6;
    }
  }

  let shootingStars=[], shootTimer=0;
  const SHOOT_INTERVAL = isMobile ? 320 : 210;
  function makeStar() {
    const angle = Math.PI/4.5+(Math.random()-0.5)*0.4;
    return {x:Math.random()*W*0.75, y:Math.random()*H*0.45, vx:Math.cos(angle), vy:Math.sin(angle), speed:Math.random()*10+6, alpha:1, trail:[]};
  }
  function drawShootingStars() {
    shootTimer++;
    if(shootTimer>SHOOT_INTERVAL+Math.random()*150){shootingStars.push(makeStar());shootTimer=0;}
    for(let i=shootingStars.length-1;i>=0;i--){
      const s=shootingStars[i];
      s.trail.push({x:s.x,y:s.y,a:s.alpha});
      s.x+=s.vx*s.speed; s.y+=s.vy*s.speed; s.alpha-=0.016;
      if(s.trail.length>26) s.trail.shift();
      for(let j=0;j<s.trail.length;j++){
        const t=s.trail[j], frac=j/s.trail.length;
        ctx.beginPath(); ctx.arc(t.x,t.y,frac*1.6+0.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(190,160,255,${t.a*frac*0.65})`; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(s.x,s.y,2.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(230,215,255,${s.alpha})`; ctx.fill();
      if(s.alpha<=0||s.x>W+60||s.y>H+60) shootingStars.splice(i,1);
    }
  }

  function drawMesh(t) {
    const ax=W*0.12+Math.sin(t*0.7)*W*0.04, ay=H*0.20+Math.cos(t*0.5)*H*0.05, ar=260+Math.sin(t*0.9)*35;
    const g1=ctx.createRadialGradient(ax,ay,0,ax,ay,ar);
    g1.addColorStop(0,`rgba(124,58,237,${0.06+0.03*Math.sin(t)})`);
    g1.addColorStop(0.5,`rgba(79,46,229,${0.03+0.015*Math.sin(t*1.3)})`);
    g1.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);

    const bx=W*0.88+Math.cos(t*0.6)*W*0.04, by=H*0.78+Math.sin(t*0.8)*H*0.05, br=220+Math.cos(t*0.7)*40;
    const g2=ctx.createRadialGradient(bx,by,0,bx,by,br);
    g2.addColorStop(0,`rgba(99,102,241,${0.05+0.02*Math.cos(t*1.1)})`);
    g2.addColorStop(0.5,`rgba(139,92,246,${0.025+0.012*Math.sin(t*0.9)})`);
    g2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);

    const cx=W*0.50+Math.sin(t*0.4+1)*W*0.20, cy=H*0.50+Math.cos(t*0.35)*H*0.18, cr=160+Math.sin(t*1.2)*25;
    const g3=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    g3.addColorStop(0,`rgba(167,139,250,${0.03+0.015*Math.sin(t*1.5)})`);
    g3.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g3; ctx.fillRect(0,0,W,H);
  }

  let lastTs=0;
  function draw(ts) {
    raf=requestAnimationFrame(draw);
    lastTs=ts;
    const t=ts*0.00045;
    ctx.clearRect(0,0,W,H);
    if(!reducedMotion){ drawMesh(t); drawParticles(); drawShootingStars(); }
  }

  function init() { initParticles(); lastTs=performance.now(); raf=requestAnimationFrame(draw); }
  window.addEventListener('resize',()=>{ resize(); initParticles(); });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) cancelAnimationFrame(raf);
    else { lastTs=performance.now(); raf=requestAnimationFrame(draw); }
  });
  init();
})();
