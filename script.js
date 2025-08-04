const glyphs = ['👽','🛸','🌌','☄️','👾','✨'];
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
let spinning = false;
let audioStarted = false;
let audioCtx, gainNode;

function startSynth() {
    if (audioStarted) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = document.getElementById('volume').value;

    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 110;

    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 220;

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    audioStarted = true;
}

document.getElementById('volume').addEventListener('input', e => {
    if (gainNode) gainNode.gain.value = e.target.value;
});

function spin() {
    if (spinning) return;
    spinning = true;
    startSynth();
    let count = 20;
    const interval = setInterval(() => {
        reels.forEach(r => r.textContent = glyphs[Math.floor(Math.random()*glyphs.length)]);
        count--;
        if (count <= 0) {
            clearInterval(interval);
            spinning = false;
            checkWin();
        }
    }, 100);
}

document.getElementById('spin').addEventListener('click', spin);

function checkWin() {
    const values = reels.map(r => r.textContent);
    if (values[0] === values[1] && values[1] === values[2]) {
        document.getElementById('message').classList.add('show');
        document.getElementById('alien').classList.add('win');
        launchConfetti();
    } else {
        document.getElementById('message').classList.remove('show');
        document.getElementById('alien').classList.remove('win');
    }
}

function launchConfetti() {
    for (let i = 0; i < 30; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.textContent = Math.random() > 0.5 ? '👽' : '👾';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 5000);
    }
}

function createRocks() {
    for (let i = 0; i < 20; i++) {
        const rock = document.createElement('div');
        rock.className = 'rock';
        rock.style.left = Math.random() * 100 + 'vw';
        rock.style.animationDuration = 10 + Math.random() * 10 + 's';
        rock.style.animationDelay = Math.random() * 5 + 's';
        rock.style.width = rock.style.height = 20 + Math.random()*40 + 'px';
        document.body.appendChild(rock);
    }
}

createRocks();
