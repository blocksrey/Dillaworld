import discography from './discography.js';

document.addEventListener('DOMContentLoaded', () => {
	const trackList = document.querySelector('.track-list');
	const albumCover = document.getElementById('album-cover');
	const infoText = document.querySelector('.info-text');

	// Function to create a track item element
	const createTrackItem = ({ title = "[ Untitled ]", info, cover }) => {
		const trackItem = document.createElement('div');
		trackItem.className = 'track-item';

		const link = document.createElement('a');
		link.textContent = title;
		link.dataset.info = info;
		link.dataset.cover = cover;

		trackItem.appendChild(link);
		return trackItem;
	};

	// Add all songs to the track list
	discography.forEach(song => trackList.appendChild(createTrackItem(song)));

	// Add event listeners for track items
	trackList.addEventListener('click', ({ target }) => {
		if (target.tagName === 'A') {
			const coverUrl = target.dataset.cover;
			const info = target.dataset.info;

			infoText.textContent = info;
			albumCover.src = coverUrl || '';
			albumCover.style.display = coverUrl ? 'block' : 'none';
		}
	});
});
