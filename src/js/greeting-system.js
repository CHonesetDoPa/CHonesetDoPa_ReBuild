/**
 * Greeting System
 */

class GreetingSystem {
    constructor() {
        this.greetings = {
            dawn: { title: "It's late at night!", text: "Please take a rest~", icon: "info" },
            morning: { title: "Good morning!", text: "Have a great day", icon: "info" },
            evening: { title: "Good evening!", text: "Currently set to {mode}, the system will automatically adjust according to your device preferences~", icon: "info" }
        };
        
        // Time interval configuration (hours)
        this.greetingIntervals = {
            dawn: 6,     // Dawn greeting interval 6 hours
            morning: 6,  // Morning greeting interval 6 hours
            evening: 6   // Evening greeting interval 6 hours
        };
        
        this.storageKey = 'greetingSystem_lastShown';
        this.sessionKey = 'greetingSystem_sessionShown';
        
        this.init();
    }

    init() {
        // Show greeting after page loads
        window.addEventListener('load', () => {
            // Ensure other systems are initialized
            setTimeout(() => {
                this.showGreeting();
            }, 100);
        });
    }

    // Get last shown time timestamp for greeting
    getLastShownTime(greetingType) {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const greetingData = JSON.parse(data);
                return greetingData[greetingType] || 0;
            }
        } catch (error) {
            console.warn('Greeting System: Error reading localStorage', error);
        }
        return 0;
    }

    // Set greeting display timestamp
    setLastShownTime(greetingType) {
        try {
            let data = {};
            const existing = localStorage.getItem(this.storageKey);
            if (existing) {
                data = JSON.parse(existing);
            }
            data[greetingType] = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Greeting System: Error writing to localStorage', error);
        }
    }

    // Check if greeting should be shown
    shouldShowGreeting(greetingType) {
        // First check session storage to prevent multiple shows in same session
        if (this.hasShownInSession(greetingType)) {
            return false;
        }
        
        const lastShown = this.getLastShownTime(greetingType);
        if (lastShown === 0) {
            return true; // Never shown before
        }
        
        const now = Date.now();
        const intervalHours = this.greetingIntervals[greetingType] || 6;
        const intervalMs = intervalHours * 60 * 60 * 1000;
        
        return (now - lastShown) >= intervalMs;
    }

    // Check if greeting has been shown in current session
    hasShownInSession(greetingType) {
        try {
            const sessionData = sessionStorage.getItem(this.sessionKey);
            if (sessionData) {
                const shownTypes = JSON.parse(sessionData);
                return shownTypes.includes(greetingType);
            }
        } catch (error) {
            console.warn('Greeting System: Error reading sessionStorage', error);
        }
        return false;
    }

    // Mark greeting as shown in current session
    markShownInSession(greetingType) {
        try {
            let shownTypes = [];
            const sessionData = sessionStorage.getItem(this.sessionKey);
            if (sessionData) {
                shownTypes = JSON.parse(sessionData);
            }
            if (!shownTypes.includes(greetingType)) {
                shownTypes.push(greetingType);
                sessionStorage.setItem(this.sessionKey, JSON.stringify(shownTypes));
            }
        } catch (error) {
            console.warn('Greeting System: Error writing to sessionStorage', error);
        }
    }

    showGreeting() {
        if (typeof swal === 'undefined') {
            console.log('Greeting System: SweetAlert not loaded, skipping greeting display');
            return;
        }

        const now = new Date();
        const hour = now.getHours();
        let greetingType = null;
        
        if (hour > 0) {
            if (hour < 6) {
                greetingType = 'dawn';
            } else if (hour < 9) {
                greetingType = 'morning';
            } else if (hour > 21 && hour < 24) {
                greetingType = 'evening';
            }
        }
        
        // Check if greeting should be shown
        if (greetingType && this.shouldShowGreeting(greetingType)) {
            if (greetingType === 'evening') {
                this.showEveningGreeting();
            } else {
                swal(this.greetings[greetingType]);
            }
            // Record display timestamp and mark as shown in session
            this.setLastShownTime(greetingType);
            this.markShownInSession(greetingType);
            console.log(`Greeting System: Showed ${greetingType} greeting at ${new Date().toLocaleString()}`);
        } else if (greetingType) {
            console.log(`Greeting System: ${greetingType} greeting skipped (already shown recently or in session)`);
        }
    }

    showEveningGreeting() {
        // Check if dark mode manager exists
        let currentMode = "light mode";
        if (window.autoDarkModeManager && typeof window.autoDarkModeManager.getCurrentMode === 'function') {
            currentMode = window.autoDarkModeManager.getCurrentMode() === 'dark' ? "dark mode" : "light mode";
        } else if (typeof isDarkModeActive === 'function') {
            currentMode = isDarkModeActive() ? "dark mode" : "light mode";
        }
        
        const greeting = { ...this.greetings.evening };
        greeting.text = greeting.text.replace('{mode}', currentMode);
        greeting.timer = 4000;
        greeting.buttons = false;
        
        swal(greeting);
    }

    // Manually trigger greeting
    triggerGreeting(type = 'auto') {
        if (type === 'auto') {
            this.showGreeting();
        } else if (this.greetings[type]) {
            swal(this.greetings[type]);
        }
    }

    // Custom greeting message
    setCustomGreeting(type, greeting) {
        if (this.greetings[type]) {
            this.greetings[type] = { ...this.greetings[type], ...greeting };
        }
    }

    // Clear greeting history (for testing)
    clearGreetingHistory(greetingType = null) {
        try {
            if (greetingType) {
                // Clear specific type of greeting record
                const data = localStorage.getItem(this.storageKey);
                if (data) {
                    const greetingData = JSON.parse(data);
                    delete greetingData[greetingType];
                    localStorage.setItem(this.storageKey, JSON.stringify(greetingData));
                    console.log(`Greeting System: Cleared ${greetingType} greeting history`);
                }
                
                // Also clear from session storage
                const sessionData = sessionStorage.getItem(this.sessionKey);
                if (sessionData) {
                    let shownTypes = JSON.parse(sessionData);
                    shownTypes = shownTypes.filter(type => type !== greetingType);
                    sessionStorage.setItem(this.sessionKey, JSON.stringify(shownTypes));
                }
            } else {
                // Clear all greeting records
                localStorage.removeItem(this.storageKey);
                sessionStorage.removeItem(this.sessionKey);
                console.log('Greeting System: Cleared all greeting history');
            }
        } catch (error) {
            console.warn('Greeting System: Error clearing localStorage', error);
        }
    }

    // View greeting history (for debugging)
    getGreetingHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const sessionData = sessionStorage.getItem(this.sessionKey);
            
            console.log('Greeting System History (localStorage):', data ? JSON.parse(data) : {});
            console.log('Greeting System Session (sessionStorage):', sessionData ? JSON.parse(sessionData) : []);
            
            if (data) {
                const greetingData = JSON.parse(data);
                
                // Display more friendly time format
                Object.keys(greetingData).forEach(type => {
                    const timestamp = greetingData[type];
                    const date = new Date(timestamp);
                    console.log(`${type}: ${date.toLocaleString()}`);
                });
                
                return {
                    persistent: greetingData,
                    session: sessionData ? JSON.parse(sessionData) : []
                };
            } else {
                console.log('Greeting System: No history found');
                return {
                    persistent: {},
                    session: sessionData ? JSON.parse(sessionData) : []
                };
            }
        } catch (error) {
            console.warn('Greeting System: Error reading localStorage', error);
            return { persistent: {}, session: [] };
        }
    }
}

// Global instance
let greetingSystem = null;

function initGreetingSystem() {
    if (!greetingSystem) {
        greetingSystem = new GreetingSystem();
        window.greetingSystem = greetingSystem;
        console.log(' Greeting system initialized');
    }
}

// Auto-initialize after page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGreetingSystem);
} else {
    initGreetingSystem();
}

// Export class
export { GreetingSystem };
