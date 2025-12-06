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

function handleItemButtonClick(event) {
	const btn = event.target.closest(".item-actions button");
	if (!btn) return;
	const label = btn.dataset.speak || btn.dataset.phrase || btn.textContent.trim();
	const lang = btn.dataset.lang || "en";
	speak(label, { lang });
}

function promptForValue(message, defaultValue = "") {
	const value = window.prompt(message, defaultValue);
	if (value === null) return null; // user cancelled
	return value.trim();
}

function createItem({ imgSrc, englishText, hindiText }) {
	const list = document.querySelector(".items-list");
	if (!list) return;

	const item = document.createElement("div");
	item.className = "item";

	const img = document.createElement("img");
	img.src = imgSrc || "/img/placeholder.png";
	img.alt = englishText || "Item";

	const texts = document.createElement("div");
	texts.className = "item-texts";

	const inputEn = document.createElement("input");
	inputEn.type = "text";
	inputEn.value = englishText || "";

	const inputHi = document.createElement("input");
	inputHi.type = "text";
	inputHi.value = hindiText || "";

	texts.appendChild(inputEn);
	texts.appendChild(inputHi);

	const actions = document.createElement("div");
	actions.className = "item-actions";

	const btnEn = document.createElement("button");
	btnEn.type = "button";
	btnEn.dataset.lang = "en";
	btnEn.dataset.speak = englishText || "";
	btnEn.textContent = "ENG";

	const btnHi = document.createElement("button");
	btnHi.type = "button";
	btnHi.dataset.lang = "hi";
	btnHi.dataset.speak = hindiText || "";
	btnHi.textContent = "HIN";

	actions.appendChild(btnEn);
	actions.appendChild(btnHi);

	item.appendChild(img);
	item.appendChild(texts);
	item.appendChild(actions);
	list.appendChild(item);
}

function setup() {
	if (typeof window === "undefined") return;

	if ("speechSynthesis" in window) {
		window.speechSynthesis.onvoiceschanged = loadVoices;
		loadVoices();
	}

	const init = () => {
		const list = document.querySelector(".items-list");
		if (list && !list.dataset.wired) {
			list.addEventListener("click", handleItemButtonClick);
			list.dataset.wired = "true";
		}

		const addButton = document.querySelector(".header .button");
		if (addButton && !addButton.dataset.wired) {
			addButton.addEventListener("click", () => {
				const englishText = promptForValue("Enter English text:", "New item");
				if (englishText === null) return;
				const hindiText = promptForValue("Enter Hindi text:", "नया आइटम");
				if (hindiText === null) return;
				const imgSrc = promptForValue("Enter image URL (leave blank for default):", "/img/placeholder.png");
				if (imgSrc === null) return;

				createItem({ imgSrc, englishText, hindiText });
			});
			addButton.dataset.wired = "true";
		}
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
}

setup();

export {
	LatLon,
	LatLonBounds
};
