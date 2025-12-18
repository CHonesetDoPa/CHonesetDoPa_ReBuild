// src/sponsor.js
// Entry Point for Sponsor Page

// ----------------------
// Import global styles
// ----------------------
import './style/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
// ----------------------
// Import local JS modules
// ----------------------
import './js/utils.js';
import './js/typed-init.js';
import './js/cur-effect.js';
import './js/dark-mode-manager.js';
import './js/greeting-system.js';
import './js/sponsorlist.js'; // Specific to sponsor page
// ----------------------
// Load translation data before i18n system
// ----------------------
import Lang_ZH from './config/i18n/zh.js';
import Lang_EN from './config/i18n/en.js';
import Lang_Vampire from './config/i18n/vampire.js';
window.i18n = { Lang_ZH, Lang_EN, Lang_Vampire };
// ----------------------
// Initialize i18n system after translation data is loaded
// ----------------------
import './js/i18n-system.js';
import './js/link-manager.js';
// ----------------------
// Import npm libraries
// ----------------------
import 'instant.page';
import 'sweetalert';
// ----------------------
// Import images or other assets
// ----------------------
import './assets/cur/ayuda.cur';
import './assets/cur/normal.cur';

import bgUrl from './assets/img/BG.webp';
const header = document.getElementById('nav');
if (header) {
    header.style.backgroundImage = `url(${bgUrl})`;
}

import avatarUrl from './assets/img/Avatar.webp';
// sponsor.html uses class="avatar-img"
const avatarImg = document.querySelector('.avatar-img');
if (avatarImg) {
    avatarImg.src = avatarUrl;
}

import wechatQrUrl from './assets/img/app1.webp';
// ----------------------
// Configure and initialize libraries
// ----------------------
import linksConfig from './config/links.js';
if (linksConfig.sponsor) {
    linksConfig.sponsor.wechatQR = wechatQrUrl;
}
// Initialize LinkManager with config
if (window.linkManager) {
    window.linkManager.initializeAll(linksConfig);
}