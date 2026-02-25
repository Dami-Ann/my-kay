/*
	custom.js
	- Handles landing transition, confetti, paparazzi flashes, small interactive touches
*/

(function(){
	// Editable recipient name
	const RECIPIENT_NAME = 'My Odogwu'; // <-- replace with real name

	// Colors for confetti
	const CONFETTI_COLORS = ['#c59a3b','#e6dcc9','#0f1724','#9fb7c8','#d4b483'];

	const landing = document.getElementById('landing');
	const main = document.getElementById('mainContent');
	const canvas = document.getElementById('confetti-canvas');
	const flashes = document.getElementById('flashes');
	const yearEl = document.getElementById('year');
	const nameEl = document.getElementById('recipient-name');

	if(yearEl) yearEl.textContent = new Date().getFullYear();
	if(nameEl) nameEl.textContent = RECIPIENT_NAME;

	// Canvas setup for confetti
	let ctx, W, H, confettiPieces = [], confettiRunning = false;
	function initCanvas(){
		if(!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		W = canvas.width; H = canvas.height;
		ctx = canvas.getContext('2d');
	}

	window.addEventListener('resize', initCanvas);
	initCanvas();

	// Simple confetti piece
	function Confetti(){
		this.x = Math.random()*W;
		this.y = -20 - Math.random()*H*0.2;
		this.w = 8 + Math.random()*10;
		this.h = 6 + Math.random()*6;
		this.color = CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)];
		this.vx = (Math.random()-0.5)*2.5;
		this.vy = 2 + Math.random()*4;
		this.rotate = Math.random()*360;
		this.dRotation = (Math.random()-0.5)*6;
	}

	Confetti.prototype.draw = function(){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotate * Math.PI / 180);
		ctx.fillStyle = this.color;
		ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
		ctx.restore();
	};

	function spawnConfetti(count){
		for(let i=0;i<count;i++) confettiPieces.push(new Confetti());
		if(!confettiRunning) runConfetti();
	}

	let confettiAnim;
	function runConfetti(){
		confettiRunning = true;
		const start = Date.now();
		function step(){
			ctx.clearRect(0,0,W,H);
			for(let i=confettiPieces.length-1;i>=0;i--){
				const p = confettiPieces[i];
				p.x += p.vx; p.y += p.vy; p.rotate += p.dRotation*0.5;
				p.vy *= 1.01; // slight acceleration
				p.vx *= 0.999;
				p.draw();
				if(p.y > H + 50){ confettiPieces.splice(i,1); }
			}
			if(confettiPieces.length>0 && Date.now()-start < 7000){
				confettiAnim = requestAnimationFrame(step);
			} else {
				confettiRunning = false; ctx.clearRect(0,0,W,H);
				cancelAnimationFrame(confettiAnim);
			}
		}
		confettiAnim = requestAnimationFrame(step);
	}

	// Paparazzi flashes: create a few flash elements at random positions
	function doPaparazzi(times = 5){
		for(let i=0;i<times;i++){
			setTimeout(()=>{
				const f = document.createElement('div');
				f.className = 'flash';
				f.style.left = Math.random()*80 + '%';
				f.style.top = Math.random()*70 + '%';
				flashes.appendChild(f);
				setTimeout(()=> f.remove(), 1000);
			}, i*300 + Math.random()*300);
		}
	}

	// Landing click -> reveal main
	function enterSite(){
		if(!landing) return;
		landing.classList.add('hidden');
		// small delay to allow opacity transition then remove display
		setTimeout(()=>{ landing.style.display='none'; }, 900);
		main.classList.remove('d-none');
		// celebrate
		spawnConfetti(80);
		doPaparazzi(6);
	}

	// Attach click to landing (click anywhere to enter)
	if(landing){
		landing.addEventListener('click', enterSite);
		// Also support keyboard (Enter)
		landing.addEventListener('keydown', (e)=>{ if(e.key==='Enter') enterSite(); });
	} else {
		// If no landing present, run effects on page load
		window.addEventListener('load', ()=>{ spawnConfetti(60); doPaparazzi(5); });
	}

	// Run paparazzi on main load (if user navigates directly)
	window.addEventListener('load', ()=>{
		if(!landing) doPaparazzi(4);
	});

	// Gentle hover micro-interactions for message cards (ARIA friendly)
	document.querySelectorAll('.message-card').forEach(card=>{
		card.setAttribute('tabindex','0');
		card.addEventListener('focus', ()=> card.classList.add('hover'));
		card.addEventListener('blur', ()=> card.classList.remove('hover'));
	});

})();

const nickname = document.getElementById('kay');

if (nickname) {
  nickname.addEventListener('mouseenter', () => {
    const canvas = nickname.querySelector('.confetti-canvas');
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.4 },
      colors: ['#c59a3b', '#e6dcc9', '#9fb7c8']
    });
  });
}

const revealBtn = document.getElementById('revealBtn');
const hiddenMessage = document.getElementById('hiddenMessage');



if (revealBtn && hiddenMessage) {
  revealBtn.addEventListener('click', () => {
    hiddenMessage.classList.toggle('d-none');
    revealBtn.textContent = '🙂';
  });
  const sound = document.getElementById('ambientSound');
if (sound) {
  sound.volume = 0.3; // soft, classy
  sound.play().catch(() => {});
}
}
