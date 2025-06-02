
const videoCollection = new Map([
    [1, {title: "Ролик 1", src: "854147-hd_1920_1080_30fps.mp4"}],
    [2, {title: "Ролик 2", src: "1585618-hd_1280_720_30fps.mp4"}],
    [3, {title: "Ролик 3", src: "3069112-hd_1920_1080_30fps.mp4"}],
    [4, {title: "Ролик 4", src: "4274798-uhd_3840_2160_25fps.mp4"}],
    [5, {title: "Ролик 5", src: "8533474-uhd_3840_2160_25fps.mp4"}]
]);

const player = document.getElementById('player');
const intervalModal = document.getElementById('interval-modal');
const mainContainer = document.getElementById('main-container');
const initialIntervalInput = document.getElementById('initial-interval');
const confirmIntervalBtn = document.getElementById('confirm-interval');
const pauseBtn = document.getElementById('pause-btn');
const skipBtn = document.getElementById('skip-btn');
const changeIntervalBtn = document.getElementById('change-interval');

const countdownDisplay = document.createElement('div');
countdownDisplay.className = 'countdown-display';
player.parentNode.appendChild(countdownDisplay);

let currentVideoIndex = 1;
let playbackInterval = 5;
let isPlaying = false;
let timeoutId;
let countdownInterval;

function playVideo(index, isManualSkip = false) {
    const video = videoCollection.get(index);
    if (!video) return;
    
    hideCountdown();
    player.src = video.src;
    player.currentTime = 0;
    
    player.play()
        .then(() => {
            console.log(`Воспроизводится: ${video.title}`);
            showCountdown(`Сейчас: ${video.title}`, 3000);
            
            if (!isManualSkip) {
                player.onended = () => {
                    if (isPlaying) {
                        startCountdown(playbackInterval);
                    }
                };
            }
        })
        .catch(error => {
            console.error("Ошибка воспроизведения:", error);
            if (isPlaying) playNextVideo(false);
        });
}
function showCountdown(message, duration) {
    countdownDisplay.textContent = message;
    countdownDisplay.style.display = 'block';
    if (duration) {
        setTimeout(hideCountdown, duration);
    }
}

function hideCountdown() {
    countdownDisplay.style.display = 'none';
}

function startCountdown(seconds) {
    let remaining = seconds;
    showCountdown(`Следующий ролик через: ${remaining} сек.`);
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        remaining--;
        showCountdown(`Следующий ролик через: ${remaining} сек.`);
        
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            hideCountdown();
            playNextVideo(false); 
        }
    }, 1000);
}

function playNextVideo(isManualSkip = true) {
    currentVideoIndex = currentVideoIndex % videoCollection.size + 1;
    playVideo(currentVideoIndex, isManualSkip);
    
    if (!isManualSkip) {
        player.onended = () => {
            if (isPlaying) {
                startCountdown(playbackInterval);
            }
        };
    }
}
function changeInterval(newInterval) {
    playbackInterval = newInterval;

}

function showIntervalModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Изменить интервал между роликами</h2>
            <div class="input-group">
                <label for="new-interval">Новый интервал (секунды):</label>
                <input type="number" id="new-interval" min="1" value="${playbackInterval}">
            </div>
            <button id="confirm-new-interval">Подтвердить</button>
            <button id="cancel-interval" style="background-color: #e74c3c; margin-top: 10px;">Отмена</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('confirm-new-interval').addEventListener('click', () => {
        const newInterval = parseInt(document.getElementById('new-interval').value);
        if (newInterval >= 1) {
            changeInterval(newInterval);
            document.body.removeChild(modal);
        } else {
            alert('Интервал должен быть не менее 1 секунды');
        }
    });

    document.getElementById('cancel-interval').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function initPlayer() {
    confirmIntervalBtn.addEventListener('click', () => {
        const interval = parseInt(initialIntervalInput.value);
        if (interval >= 1) {
            playbackInterval = interval;
            intervalModal.style.display = 'none';
            mainContainer.style.display = 'block';
            
            isPlaying = true;
            pauseBtn.disabled = false;
            skipBtn.disabled = false;
            
            playVideo(currentVideoIndex, false);
        } else {
            alert('Интервал должен быть не менее 1 секунды');
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            isPlaying = false;
            player.pause();
            clearInterval(countdownInterval);
            pauseBtn.textContent = "Возобновить";
            hideCountdown();
        } else {
            isPlaying = true;
            player.play()
                .then(() => {
                    pauseBtn.textContent = "Пауза";
                    if (player.ended) {
                        startCountdown(playbackInterval);
                    }
                })
                .catch(console.error);
        }
    });

    skipBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        player.pause();
        playNextVideo(true);
    });

    changeIntervalBtn.addEventListener('click', showIntervalModal);
}

document.addEventListener('DOMContentLoaded', initPlayer);