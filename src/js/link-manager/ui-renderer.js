/**
 * UIRenderer
 * 负责 DOM 元素的创建和渲染
 */
export class UIRenderer {
    constructor() {
        this.cache = new Map();
        this.renderQueue = new Set();
    }

    /**
     * 优化的渲染社交媒体图标方法
     * @param {string} containerId - 容器ID
     * @param {Object} config - 配置对象
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     */
    renderSocialMediaIcons(containerId, config, accessibilityManager) {
        // 避免重复渲染
        if (this.renderQueue.has(`icons_${containerId}`)) {
            return;
        }
        this.renderQueue.add(`icons_${containerId}`);

        requestAnimationFrame(() => {
            try {
                const container = document.getElementById(containerId);
                if (!container || !config?.socialMedia) {
                    this.renderQueue.delete(`icons_${containerId}`);
                    return;
                }

                // 缓存社交媒体图标
                const socialIcons = this.getSocialIcons();

                // 使用 DocumentFragment 优化DOM操作
                const fragment = document.createDocumentFragment();

                // 生成社交媒体图标
                Object.entries(config.socialMedia).forEach(([platform, url]) => {
                    if (socialIcons[platform]) {
                        const link = this.createSocialLink(platform, url, socialIcons[platform], accessibilityManager);
                        fragment.appendChild(link);
                    }
                });

                // 添加邮箱图标（特殊处理）
                if (config.personal?.email) {
                    const emailLink = this.createEmailLink(socialIcons.email, accessibilityManager);
                    fragment.appendChild(emailLink);
                }

                // 一次性更新DOM
                container.innerHTML = '';
                container.appendChild(fragment);
            } finally {
                this.renderQueue.delete(`icons_${containerId}`);
            }
        });
    }

    /**
     * 创建社交媒体链接元素
     * @param {string} platform - 平台名称
     * @param {string} url - 链接URL
     * @param {string} iconSvg - 图标SVG
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     * @returns {HTMLElement} 链接元素
     */
    createSocialLink(platform, url, iconSvg, accessibilityManager) {
        const link = document.createElement('a');
        link.className = 'social-icon';
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer'; // 安全优化
        
        accessibilityManager.addAccessibilityAttributes(link, 'socialMedia.links.' + platform);
        link.innerHTML = iconSvg;
        
        return link;
    }

    /**
     * 创建邮箱链接元素
     * @param {string} iconSvg - 图标SVG
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     * @returns {HTMLElement} 链接元素
     */
    createEmailLink(iconSvg, accessibilityManager) {
        const emailLink = document.createElement('a');
        emailLink.className = 'social-icon';
        emailLink.href = '#';
        emailLink.onclick = (e) => {
            e.preventDefault();
            if (window.email) window.email();
        };
        
        accessibilityManager.addAccessibilityAttributes(emailLink, 'socialMedia.links.email');
        emailLink.innerHTML = iconSvg;
        
        return emailLink;
    }

    /**
     * 获取社交媒体图标 (缓存版本)
     * @returns {Object} 图标对象
     */
    getSocialIcons() {
        if (this.cache.has('socialIcons')) {
            return this.cache.get('socialIcons');
        }

        const socialIcons = {
            bilibili: `<svg t="1653121638226" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10961" width="26" height="26">
                <path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m123.605333 175.786667a17.408 17.408 0 0 0-24.576-0.042667l-66.133333 66.261334h-64.256l-66.133333-66.261334-2.730667-2.218666a17.450667 17.450667 0 0 0-21.845333 26.88l41.514666 41.6H341.973333l-6.4 0.213333A86.357333 86.357333 0 0 0 256 413.482667v215.637333l0.256 6.4a86.314667 86.314667 0 0 0 85.76 79.786667h12.8l0.298667 4.138666a28.330667 28.330667 0 0 0 56.32-4.181333h201.173333l0.298667 4.181333a28.330667 28.330667 0 0 0 56.32-4.181333h12.8l6.4-0.256A86.357333 86.357333 0 0 0 768 629.12V413.482667l-0.256-6.4a86.314667 86.314667 0 0 0-85.76-79.786667h-87.893333l41.514666-41.6 2.218667-2.688a17.493333 17.493333 0 0 0-2.218667-21.930667z m40.448 117.589333c17.365333 0 31.445333 14.208 31.573334 31.573334l1.621333 221.696-0.256 4.266666a31.658667 31.658667 0 0 1-31.274667 27.349334H346.282667l-4.266667-0.298667a31.829333 31.829333 0 0 1-27.306667-31.317333l-1.621333-221.696 0.256-4.266667c2.048-15.36 15.36-27.306667 31.317333-27.306667z m-167.082666 182.058667c-11.306667 12.245333-12.586667 28.16-30.549334 28.16-11.306667 0-20.906667-15.018667-20.906666-15.018667l-1.664-1.792a10.794667 10.794667 0 0 0-7.04-2.56 9.941333 9.941333 0 0 0-9.941334 10.197334c0 1.792 0.426667 3.413333 1.194667 4.864l0.213333 0.426666c1.834667 3.242667 14.634667 24.490667 39.936 24.490667 15.018667 0 26.026667-10.069333 28.288-12.288l0.426667-0.426667 0.426667 0.426667c2.304 2.218667 13.312 12.288 28.330666 12.288 27.434667 0 40.149333-24.917333 40.106667-24.96l0.938667-2.261333 0.298666-2.56a9.941333 9.941333 0 0 0-9.941333-10.197334c-3.626667 0-6.826667 1.706667-8.704 4.352l-0.341333 0.512c-1.834667 2.645333-10.496 14.506667-20.522667 14.506667-16.213333 0-18.858667-12.885333-27.477333-24.405333z m59.733333-109.738667l-7.936 40.362667L668.586667 512l7.978666-40.32-107.818666-20.650667z m-113.450667 0l-107.818666 20.650667 7.978666 40.32 107.818667-20.608-7.978667-40.362667z" fill="#23ADE5" p-id="10962"></path>
            </svg>`,
            github: `<svg t="1653120684046" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1414" width="26" height="26">
                <path d="M512 85.333333C276.266667 85.333333 85.333333 276.266667 85.333333 512a426.410667 426.410667 0 0 0 291.754667 404.821333c21.333333 3.712 29.312-9.088 29.312-20.309333 0-10.112-0.554667-43.690667-0.554667-79.445333-107.178667 19.754667-134.912-26.112-143.445333-50.133334-4.821333-12.288-25.6-50.133333-43.733333-60.288-14.933333-7.978667-36.266667-27.733333-0.554667-28.245333 33.621333-0.554667 57.6 30.933333 65.621333 43.733333 38.4 64.512 99.754667 46.378667 124.245334 35.2 3.754667-27.733333 14.933333-46.378667 27.221333-57.045333-94.933333-10.666667-194.133333-47.488-194.133333-210.688 0-46.421333 16.512-84.778667 43.733333-114.688-4.266667-10.666667-19.2-54.4 4.266667-113.066667 0 0 35.712-11.178667 117.333333 43.776a395.946667 395.946667 0 0 1 106.666667-14.421333c36.266667 0 72.533333 4.778667 106.666666 14.378667 81.578667-55.466667 117.333333-43.690667 117.333334-43.690667 23.466667 58.666667 8.533333 102.4 4.266666 113.066667 27.178667 29.866667 43.733333 67.712 43.733334 114.645333 0 163.754667-99.712 200.021333-194.645334 210.688 15.445333 13.312 28.8 38.912 28.8 78.933333 0 57.045333-0.554667 102.912-0.554666 117.333334 0 11.178667 8.021333 24.490667 29.354666 20.224A427.349333 427.349333 0 0 0 938.666667 512c0-235.733333-190.933333-426.666667-426.666667-426.666667z" fill="#515151" p-id="1415"></path>
            </svg>`,
            email: `<svg t="1653120990219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="661" width="24" height="24">
                <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#B3DFFF" p-id="662"></path>
                <path d="M460.334545 509.44a75.869091 75.869091 0 0 0 103.563637 0l266.705454-250.181818A46.545455 46.545455 0 0 0 814.545455 256H209.454545a46.545455 46.545455 0 0 0-16.756363 3.258182zM857.134545 739.374545A46.545455 46.545455 0 0 0 861.090909 721.454545V302.545455a46.545455 46.545455 0 0 0-4.654545-20.247273l-235.287273 221.090909z" fill="#439DFF" p-id="663"></path>
                <path d="M595.781818 527.36l-8.145454 7.68a110.778182 110.778182 0 0 1-151.272728 0l-8.145454-7.68L191.534545 764.043636A46.545455 46.545455 0 0 0 209.454545 768h605.09091a46.545455 46.545455 0 0 0 18.618181-3.956364zM167.563636 282.996364A46.545455 46.545455 0 0 0 162.909091 302.545455v418.90909a46.545455 46.545455 0 0 0 3.956364 18.618182l235.985454-236.683636z" fill="#439DFF" p-id="664"></path>
            </svg>`
        };

        this.cache.set('socialIcons', socialIcons);
        return socialIcons;
    }

    /**
     * 渲染社交媒体列表
     * @param {string} containerId - 容器ID
     * @param {Object} config - 配置对象
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     */
    renderSocialMediaList(containerId, config, accessibilityManager) {
        const container = document.getElementById(containerId);
        if (!container || !config?.socialMedia) return;

        const platformNames = {
            twitter: 'Twitter',
            youtube: 'Youtube Channel',
            telegram: 'Telegram',
            steam: 'Steam',
            discord: 'Discord Channel',
            twitch: 'Twitch',
            osu: 'OSU!'
        };

        // 清空容器
        container.innerHTML = '';

        // 创建ul元素作为列表容器
        const ul = document.createElement('ul');

        // 生成社交媒体列表
        Object.entries(config.socialMedia).forEach(([platform, url]) => {
            if (platformNames[platform]) {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = url;
                link.style.color = 'orange';
                link.style.textDecoration = 'none';
                link.target = '_blank'; // 在新标签页打开
                link.textContent = platformNames[platform];
                
                // 添加无障碍属性
                accessibilityManager.addAccessibilityAttributes(link, 'socialMedia.links.' + platform);
                
                li.appendChild(link);
                ul.appendChild(li);
            }
        });

        // 添加 Session ID （特殊处理）
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.onclick = (event) => {
            event.preventDefault();
            window.session_id && window.session_id();
        };
        link.style.color = 'orange';
        link.style.textDecoration = 'none';
        link.style.cursor = 'pointer';
        link.textContent = 'Session';
        
        // 添加无障碍属性
        accessibilityManager.addAccessibilityAttributes(link, 'socialMedia.links.session');
        
        li.appendChild(link);
        ul.appendChild(li);

        // 将ul添加到容器中
        container.appendChild(ul);
    }

    /**
     * 渲染相关网站列表
     * @param {string} containerId - 容器ID
     * @param {Object} config - 配置对象
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     */
    renderRelatedSites(containerId, config, accessibilityManager) {
        const container = document.getElementById(containerId);
        if (!container || !config?.relatedSites) return;

        const siteNames = {
            qtnull: { zh: '隔壁QT', en: 'The Next Door QT' },
            nekocServer: { zh: 'NekoC 游戏服务器列表', en: 'NekoC Game Server List' },
            chFileShare: { zh: 'CH GAS 公共文件共享', en: 'CH GAS Public File Share Service' },
            qtFileShare: { zh: 'QT GAS 公共文件共享', en: 'QT GAS Public File Share Service' },
            sponsor: { zh: '赞助CC', en: 'Sponsor CC' }
        };

        // 清空容器
        container.innerHTML = '';

        // 创建ul元素作为列表容器
        const ul = document.createElement('ul');

        // 生成相关网站列表
        Object.entries(config.relatedSites).forEach(([siteKey, url]) => {
            if (siteNames[siteKey]) {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('data-en', siteNames[siteKey].en);
                link.setAttribute('data-zh', siteNames[siteKey].zh);
                link.textContent = siteNames[siteKey].zh;
                
                // 添加无障碍属性
                accessibilityManager.addAccessibilityAttributes(link, 'websites.links.' + siteKey);
                
                // 如果不是sponsor.html，在新标签页打开
                if (url !== 'sponsor.html') {
                    link.target = '_blank';
                }
                li.appendChild(link);
                ul.appendChild(li);
            }
        });

        // 添加 PGP 公钥下载（特殊处理）
        if (config.personal?.pgpKey) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.onclick = () => window.pgp_id && window.pgp_id();
            link.setAttribute('data-en', 'Download CH\'s PGP Public Key');
            link.setAttribute('data-zh', '下载CH的PGP公钥');
            link.textContent = '下载CH的PGP公钥';
            link.style.cursor = 'pointer';
            
            // 添加无障碍属性
            accessibilityManager.addAccessibilityAttributes(link, 'websites.links.pgpKey');
            
            li.appendChild(link);
            ul.appendChild(li);
        }

        // 将ul添加到容器中
        container.appendChild(ul);
    }

    /**
     * 更新版权信息
     * @param {Object} config - 配置对象
     */
    updateCopyright(config) {
        if (!config?.meta?.copyright) return;

        const footerWrap = document.getElementById('footer-wrap');
        if (footerWrap && footerWrap.textContent !== config.meta.copyright) {
            footerWrap.textContent = config.meta.copyright;
        }
    }

    /**
     * 更新状态信息
     * @param {Object} config - 配置对象
     * @param {AccessibilityManager} accessibilityManager - 无障碍管理器
     */
    updateStatusInfo(config, accessibilityManager) {
        if (!config?.status) return;

        // 获取当前语言，vampire语言使用中文显示
        const currentLang = (() => {
            const lang = document.documentElement.lang;
            if (lang === 'zh-CN' || lang === 'zh') return 'zh';
            if (lang === 'en-US' || lang === 'en') return 'en';
            return 'zh'; // 默认使用中文
        })();
        
        // 更新运行状态
        const runningStatus = document.querySelector('.webinfo-item:first-child .webinfo-site-pv-count');
        if (runningStatus && config.status.siteRunning) {
            runningStatus.textContent = config.status.siteRunning[currentLang];
        }

        // 更新站长状态
        const adminStatus = document.querySelector('.webinfo-item:nth-child(2) .webinfo-site-pv-count');
        if (adminStatus && config.status.adminStatus) {
            adminStatus.textContent = config.status.adminStatus[currentLang];
        }

        // 更新服务状态链接
        const servicesStatus = document.querySelector('.webinfo-item:last-child .webinfo-site-pv-count a');
        if (servicesStatus && config.relatedSites?.servicesStatus) {
            servicesStatus.href = config.relatedSites.servicesStatus;
            // 添加无障碍属性
            accessibilityManager.addAccessibilityAttributes(servicesStatus, 'websites.links.servicesStatus');
        }
    }
}
