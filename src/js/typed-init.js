/**
 * Typed Init
 */
import Typed from 'typed.js';

let typedInstance = null;
let initAttempts = 0;
const maxAttempts = 5;
let isInitialized = false;

function cleanupTypedCursors() {
    const cursors = document.querySelectorAll('.typed-cursor');
    cursors.forEach(cursor => {
        if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    });
    console.log(`[Typed] Cleaned up ${cursors.length} existing cursors`);
}

function initTyped() {
    if (isInitialized) {
        console.log('[Typed] Already initialized, skipping');
        return;
    }

    initAttempts++;
    console.log(`[Typed] Attempting to initialize (attempt ${initAttempts})`);

    const element = document.querySelector('.blogtitle');
    if (!element) {
        console.warn('[Typed] .blogtitle element not found');
        if (initAttempts < maxAttempts) {
            setTimeout(initTyped, 500);
        }
        return;
    }

    cleanupTypedCursors();

    if (typedInstance) {
        console.log('[Typed] Destroying existing instance');
        typedInstance.destroy();
        typedInstance = null;
    }

    try {
        typedInstance = new Typed('.blogtitle', {
            strings: ['每一天都是新的一天', 'Everyday is a new day', '毎日が新しい日です'],
            startDelay: 300,
            typeSpeed: 100,
            loop: true,
            backSpeed: 50,
            showCursor: true
        });
        isInitialized = true;
        console.log('[Typed] Successfully initialized');
    } catch (error) {
        console.error('[Typed] Failed to initialize:', error);
        if (initAttempts < maxAttempts) {
            setTimeout(initTyped, 1000);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Typed] DOM loaded, initializing...');
        setTimeout(initTyped, 100);
    });
} else {
    console.log('[Typed] DOM already loaded, initializing...');
    setTimeout(initTyped, 100);
}