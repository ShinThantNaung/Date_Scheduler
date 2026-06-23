document.addEventListener("DOMContentLoaded", () => {
    const noButton = document.getElementById("no");
    const yesButton = document.getElementById("yes");
    const askSection = document.getElementById("askSection");
    const acceptedSection = document.getElementById("acceptedSection");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");
    const sendButton = document.getElementById("sendSchedule");
    const successMsg = document.getElementById("successMsg");
    const errorMsg = document.getElementById("errorMsg");
    const musicToggle = document.getElementById("musicToggle");
    const heartsContainer = document.getElementById("hearts");

    const taunts = [
        "No",
        "Are you sure?",
        "Really sure??",
        "Think again! 🥺",
        "Last chance...",
        "Pretty please?",
        "My heart is breaking 💔",
        "You can't be serious",
        "Reconsider? 🙏",
        "I'll cry 😭",
        "Pleeeease 🥹",
        "...still no?",
        "Be my Valentine!",
        "Just click Yes 😤",
    ];

    let noCount = 0;
    let musicOn = false;
    let audioCtx = null;
    let master = null;
    let musicTimer = null;

    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    dateInput.min = new Date(today - timezoneOffset).toISOString().split("T")[0];

    // Floating hearts
    const emojis = ["💗", "💖", "💕", "❤️", "💓", "🩷", "💞"];
    for (let i = 0; i < 20; i++) {
        const span = document.createElement("span");
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 16 + Math.random() * 38;
        span.style.left = Math.random() * 100 + "%";
        span.style.fontSize = size + "px";
        span.style.animation = `floatUp ${9 + Math.random() * 9}s linear ${Math.random() * 10}s infinite`;
        heartsContainer.appendChild(span);
    }

    // Yes button
    yesButton.addEventListener("click", () => {
        askSection.classList.add("hidden");
        acceptedSection.classList.remove("hidden");
        acceptedSection.classList.add("pop-in");
        dateInput.focus();
    });

    // No button with taunts and scaling
    noButton.addEventListener("click", () => {
        noCount++;
        noButton.textContent = taunts[Math.min(noCount, taunts.length - 1)];

        const yesScale = Math.min(1 + noCount * 0.17, 2.6);
        const noScale = Math.max(1 - noCount * 0.13, 0.32);

        yesButton.style.transform = `scale(${yesScale})`;
        noButton.style.transform = `scale(${noScale})`;
    });

    // Send schedule
    sendButton.addEventListener("click", () => {
        const date = dateInput.value;
        const time = timeInput.value;

        successMsg.classList.add("hidden");
        errorMsg.classList.add("hidden");

        if (!date || !time) {
            errorMsg.classList.remove("hidden");
            return;
        }

        const d = new Date(date + "T" + time);
        const niceDate = isNaN(d)
            ? date
            : d.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              });
        const niceTime = isNaN(d)
            ? time
            : d.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
              });

        const to = "shinthantnaung112@gmail.com";
        const subject = encodeURIComponent("It's a date! 💕 — from Shwe Shwe Myint");
        const body = encodeURIComponent(
            "Yes, I'll be your Valentine! 💖\n\n" +
                "Here's when I'd love to see you:\n\n" +
                "📅 " + niceDate + "\n" +
                "⏰ " + niceTime + "\n\n" +
                "Can't wait 🥰\n" +
                "— Shwe Shwe Myint"
        );

        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        successMsg.classList.remove("hidden");
    });

    // Clear error on input change
    dateInput.addEventListener("change", () => errorMsg.classList.add("hidden"));
    timeInput.addEventListener("change", () => errorMsg.classList.add("hidden"));

    // Music
    function startMusic() {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtx) audioCtx = new Ctx();
        audioCtx.resume();

        master = audioCtx.createGain();
        master.gain.value = 0;
        master.connect(audioCtx.destination);
        master.gain.linearRampToValueAtTime(0.11, audioCtx.currentTime + 1.2);

        const melody = [
            523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.0, 783.99,
            659.25, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25,
        ];
        const step = 0.34;
        let i = 0;

        const play = () => {
            if (!master) return;
            const freq = melody[i % melody.length];
            const osc = audioCtx.createOscillator();
            osc.type = "triangle";
            osc.frequency.value = freq;
            const gain = audioCtx.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            gain.connect(master);
            const t = audioCtx.currentTime;
            gain.gain.linearRampToValueAtTime(0.55, t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, t + step * 0.92);
            osc.start(t);
            osc.stop(t + step);
            i++;
        };

        play();
        musicTimer = setInterval(play, step * 1000);
    }

    function stopMusic() {
        if (master && audioCtx) {
            try {
                master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
            } catch (e) {}
        }
        master = null;
        if (musicTimer) {
            clearInterval(musicTimer);
            musicTimer = null;
        }
    }

    musicToggle.addEventListener("click", () => {
        musicOn = !musicOn;
        if (musicOn) {
            startMusic();
            musicToggle.textContent = "🔊";
        } else {
            stopMusic();
            musicToggle.textContent = "🎵";
        }
    });
});
