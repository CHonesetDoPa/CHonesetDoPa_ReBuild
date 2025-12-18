/**
 * Typed.js 打字机效果初始化
 * 初始化博客标题的打字机动画效果
 * 独立运行，不受i18n系统影响
 */
import Typed from 'typed.js';

/**
 * Typed.js 打字机效果初始化（ESM 版本）
 * 直接从 npm 包导入 Typed，便于 Vite 打包
 */
let typedInstance = null;
let initAttempts = 0;
const maxAttempts = 5;
let isInitialized = false;

// 清理所有现有的typed光标
function cleanupTypedCursors() {
    const cursors = document.querySelectorAll('.typed-cursor');
    cursors.forEach(cursor => {
        if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    });
    console.log(`[Typed] Cleaned up ${cursors.length} existing cursors`);
}

// 初始化typed
function initTyped() {
    // 防止重复初始化
    if (isInitialized) {
        console.log('[Typed] Already initialized, skipping');
        return;
    }

    initAttempts++;
    console.log(`[Typed] Attempting to initialize (attempt ${initAttempts})`);

    // 检查元素是否存在
    const element = document.querySelector('.blogtitle');
    if (!element) {
        console.warn('[Typed] .blogtitle element not found');
        if (initAttempts < maxAttempts) {
            setTimeout(initTyped, 500);
        }
        return;
    }

    // 清理现有光标
    cleanupTypedCursors();

    // 销毁现有实例（如果存在）
    if (typedInstance) {
        console.log('[Typed] Destroying existing instance');
        typedInstance.destroy();
        typedInstance = null;
    }

    try {
        // 创建新的typed实例
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

// 等待DOM加载完成后再初始化typed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Typed] DOM loaded, initializing...');
        setTimeout(initTyped, 100);
    });
} else {
    console.log('[Typed] DOM already loaded, initializing...');
    setTimeout(initTyped, 100);
}