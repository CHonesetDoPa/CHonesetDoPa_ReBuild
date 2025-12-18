/**
 * ConfigManager
 * 负责配置的加载、缓存和获取
 */
export class ConfigManager {
    constructor() {
        this.config = null;
    }

    /**
     * 初始化配置
     * @param {Object} [config] - 可选的配置对象
     * @returns {Promise<void>}
     */
    async init(config) {
        if (this.config) {
            return;
        }

        try {
            // 1. 优先使用传入的配置
            if (config) {
                this.config = config;
                this.cacheConfig(this.config);
                console.log('Link config loaded from arguments');
                return;
            }

            // 2. 检查缓存
            const cachedConfig = this.getCachedConfig();
            if (cachedConfig) {
                this.config = cachedConfig;
                console.log('Link config loaded from cache successfully');
                return;
            }

            // 3. 尝试使用 window.linksConfig
            if (window.linksConfig) {
                this.config = window.linksConfig;
                this.cacheConfig(this.config);
                console.log('Link config loaded from window.linksConfig');
                return;
            }

            // 未找到配置，使用空对象
            this.config = {};
            console.warn('No link config found, using empty config');
        } catch (error) {
            console.error('Failed to load link config:', error);
            this.config = {};
        }
    }

    /**
     * 缓存配置到本地存储
     * @param {Object} config - 配置对象
     */
    cacheConfig(config) {
        try {
            const cacheData = {
                data: config,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('linkManager_config', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache config:', error);
        }
    }

    /**
     * 从缓存获取配置
     * @returns {Object|null} 缓存的配置或null
     */
    getCachedConfig() {
        try {
            const cached = localStorage.getItem('linkManager_config');
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const maxAge = 30 * 60 * 1000; // 30分钟缓存

            if (Date.now() - cacheData.timestamp > maxAge) {
                localStorage.removeItem('linkManager_config');
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn('Failed to get cached config:', error);
            return null;
        }
    }

    getConfig() {
        return this.config;
    }
}
