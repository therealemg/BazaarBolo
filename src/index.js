// @flow

import LatLon from "./geo/latlon.js";
import LatLonBounds from "./geo/latlonBounds.js";

// Simple TTS helper using the Web Speech API.
const voiceCache = { list: [] };

function loadVoices() {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
	voiceCache.list = window.speechSynthesis.getVoices();
	return voiceCache.list;
}

function pickVoice(langCode) {
	const voices = voiceCache.list.length ? voiceCache.list : loadVoices();
	return voices.find(v => v.lang?.toLowerCase().startsWith(langCode)) || voices[0] || null;
}

export function speak(text, { lang = "en", rate = 1, pitch = 1, volume = 1 } = {}) {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) {
		console.log("speak (no TTS available):", text);
		return;
	}

	if (!voiceCache.list.length) {
		loadVoices();
	}

	const utter = new SpeechSynthesisUtterance(text);
	utter.voice = pickVoice(lang);
	utter.rate = rate;
	utter.pitch = pitch;
	utter.volume = volume;

	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utter);
}

function wireButtons() {
	document.querySelectorAll(".item-actions button").forEach((btn) => {
		btn.addEventListener("click", () => {
			// Allow per-button override of what gets spoken.
			const label = btn.dataset.speak || btn.dataset.phrase || btn.textContent.trim();
			const lang = btn.dataset.lang || "en";
			speak(label, { lang });
		});
	});
}

function setup() {
	if (typeof window === "undefined") return;

	if ("speechSynthesis" in window) {
		window.speechSynthesis.onvoiceschanged = loadVoices;
		loadVoices();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", wireButtons);
	} else {
		wireButtons();
	}
}

setup();

export {
	LatLon,
	LatLonBounds
};
