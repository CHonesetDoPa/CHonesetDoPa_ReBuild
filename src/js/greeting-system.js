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

    showGreeting() {
        if (typeof swal === 'undefined') {
            console.log('Greeting System: SweetAlert not loaded, skipping greeting display');
            return;
        }

        const now = new Date();
        const hour = now.getHours();
        
        if (hour > 0) {
            if (hour < 6) {
                // Dawn (0-6 AM)
                swal(this.greetings.dawn);
            } else if (hour < 9) {
                // Morning (6-9 AM)
                swal(this.greetings.morning);
            } else if (hour > 21 && hour < 24) {
                // Evening (9 PM - 12 AM)
                this.showEveningGreeting();
            }
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
