// Welcome message to confirm script is loaded
console.log("Welcome to Spotify");

// Initialize all the necessary Variables
let songIndex = 0;                                    // Current song index in the playlist
let audioElement = new Audio('songs/1.mp3');         // Audio object for playing songs
let masterPlay = document.getElementById('masterPlay'); // Main play/pause button
let myProgressBar = document.getElementById('myprogressBar'); // Progress bar for song duration
let gif = document.getElementById('gif');             // GIF animation for playing status
let masterSongName = document.querySelector('.songinfo'); // Display for current song name
let songItems = Array.from(document.getElementsByClassName('songItems')); // List of all songs

// Array of song objects containing song details
let songs = [
    {songName: "Ek Pyar Ka Nagama", filePath: "songs/1.mp3", coverPath: "covers/sanam1.jpg"},
    {songName: "Mehrama", filePath: "songs/2.mp3", coverPath: "covers/Mehrama.jpg"},
    {songName: "A Thousand Years", filePath: "songs/3.mp3", coverPath: "covers/AThousand_Years.jpg"},
    {songName: "Dil To Bachcha Hai", filePath: "songs/4.mp3", coverPath: "covers/dil tho baccha hai.jpg"},
    {songName: "Olave Olave", filePath: "songs/5.mp3", coverPath: "covers/Olave-Olave-.jpg"},
    {songName: "Ve Haaniyaan", filePath: "songs/6.mp3", coverPath: "covers/Ve-Haaniyaan-.jpg"},
    {songName: "Nammoora Yuvarani", filePath: "songs/7.mp3", coverPath: "covers/nammura yuvarani.jpg"},
];

// Initialize the song list display with cover images, names, and play buttons
songItems.forEach((element, i) => {
    // Set the cover image for each song
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    // Set the song name
    element.getElementsByClassName("songname")[0].innerText = songs[i].songName;
    // Add timestamp and play button
    element.getElementsByClassName("timestamp")[0].innerHTML = "03:45 <i id='" + i + "' class='far songItemPlay fa-regular fa-circle-play'></i>";
});

// Function to update song progress in timestamp format (MM:SS)
function updateTimestamp(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to reset all song play buttons to 'play' icon
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

// Function to play the selected song
const playSong = (index) => {
    makeAllPlays();
    songIndex = index;
    audioElement.src = `songs/${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;

    // Update play button icons
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    let currentSongButton = document.getElementById(songIndex);
    if (currentSongButton) {
        currentSongButton.classList.remove('fa-circle-play');
        currentSongButton.classList.add('fa-circle-pause');
    }
};

// Add click event listeners to individual song play buttons
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        const clickedIndex = parseInt(e.target.id);
        
        // If clicking the same song that's playing, toggle play/pause
        if (clickedIndex === songIndex && !audioElement.paused) {
            audioElement.pause();
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
            gif.style.opacity = 0;
        } else {
            playSong(clickedIndex);
        }
    });
});

// Handle master play/pause button clicks
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        let currentSongButton = document.getElementById(songIndex);
        if (currentSongButton) {
            currentSongButton.classList.remove('fa-circle-play');
            currentSongButton.classList.add('fa-circle-pause');
        }
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        let currentSongButton = document.getElementById(songIndex);
        if (currentSongButton) {
            currentSongButton.classList.remove('fa-circle-pause');
            currentSongButton.classList.add('fa-circle-play');
        }
        gif.style.opacity = 0;
    }
});

// Update progress bar as song plays
audioElement.addEventListener('timeupdate', () => {
    // Calculate progress percentage
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    // Update timestamp display
    let currentTime = updateTimestamp(audioElement.currentTime);
    let totalTime = updateTimestamp(audioElement.duration);
    document.getElementById('currentTime').innerText = currentTime;
    document.getElementById('totalTime').innerText = totalTime || '0:00';

    // Auto-play next song when current song ends
    if (audioElement.currentTime === audioElement.duration) {
        playNext();
    }
});

// Allow user to seek through song using progress bar
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Add keyboard controls for playback
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':  // Spacebar for play/pause
            e.preventDefault();
            masterPlay.click();
            break;
        case 'ArrowRight':  // Right arrow for forward 5 seconds
            audioElement.currentTime = Math.min(audioElement.currentTime + 5, audioElement.duration);
            break;
        case 'ArrowLeft':   // Left arrow for backward 5 seconds
            audioElement.currentTime = Math.max(audioElement.currentTime - 5, 0);
            break;
        case 'n':  // 'n' key for next song
            playNext();
            break;
        case 'p':  // 'p' key for previous song
            playPrevious();
            break;
    }
});

// Function to play next song
function playNext() {
    songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    playSong(songIndex);
}

// Function to play previous song
function playPrevious() {
    songIndex = (songIndex <= 0) ? songs.length - 1 : songIndex - 1;
    playSong(songIndex);
}

// Ensure all play buttons except the current song's play button display the correct icon
const updatePlayPauseIcons = () => {
    makeAllPlays();
    if (!audioElement.paused) {
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        let currentSongButton = document.getElementById(songIndex);
        if (currentSongButton) {
            currentSongButton.classList.remove('fa-circle-play');
            currentSongButton.classList.add('fa-circle-pause');
        }
    } else {
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
    }
    gif.style.opacity = audioElement.paused ? 0 : 1;
};

// Add play/pause icon updates to your event listeners
audioElement.addEventListener('play', updatePlayPauseIcons);
audioElement.addEventListener('pause', updatePlayPauseIcons);
masterPlay.addEventListener('click', updatePlayPauseIcons);
document.getElementById('next').addEventListener('click', () => {
    playNext();
    updatePlayPauseIcons();
});
document.getElementById('previous').addEventListener('click', () => {
    playPrevious();
    updatePlayPauseIcons();
});

// Double-click on progress bar to seek to that position
myProgressBar.addEventListener('dblclick', (e) => {
    const clickPosition = (e.offsetX / myProgressBar.offsetWidth);
    audioElement.currentTime = clickPosition * audioElement.duration;
});

// Update volume when volume slider changes
document.getElementById('volumeControl').addEventListener('input', (e) => {
    audioElement.volume = e.target.value / 100;
});
