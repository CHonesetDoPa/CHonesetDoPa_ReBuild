/*
    * cursor-special-effects-upgraded.js
    * author: CHonesetDoPa (upgraded by ChatGPT)
    * version: 1.1.0
*/

class Circle {
    constructor({ origin, speed, color, angle, context, radius = 2, gravity = 0.1 }) {
        this.origin = { ...origin };
        this.position = { ...origin };
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.context = context;
        this.radius = radius;
        this.gravity = gravity;
        this.velY = 0;
        this.alpha = 1; // 用于渐隐效果
    }

    draw() {
        this.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.alpha})`;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.context.fill();
    }

    move() {
        this.position.x += Math.sin(this.angle) * this.speed;
        this.velY += this.gravity;
        this.position.y += Math.cos(this.angle) * this.speed + this.velY;

        this.alpha -= 0.02; // 每帧渐隐
        if (this.alpha < 0) this.alpha = 0;
    }
}

class Boom {
    constructor({ origin, context, circleCount = 10, area }) {
        this.origin = origin;
        this.context = context;
        this.circleCount = circleCount;
        this.area = area;
        this.stop = false;
        this.circles = [];
    }

    randomColor() {
        // 返回 rgb 对象，更适合渐隐
        const r = Math.floor(200 + Math.random() * 55);
        const g = Math.floor(200 + Math.random() * 55);
        const b = Math.floor(200 + Math.random() * 55);
        return { r, g, b };
    }

    randomRange(start, end) {
        return start + Math.random() * (end - start);
    }

    init() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = new Circle({
                context: this.context,
                origin: this.origin,
                color: this.randomColor(),
                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                speed: this.randomRange(1, 6),
                radius: this.randomRange(1, 3),
                gravity: this.randomRange(0.05, 0.2)
            });
            this.circles.push(circle);
        }
    }

    move() {
        this.circles.forEach(circle => circle.move());

        // 过滤掉超出边界或透明度为0的粒子
        this.circles = this.circles.filter(circle =>
            circle.position.x <= this.area.width &&
            circle.position.y <= this.area.height &&
            circle.alpha > 0
        );

        if (this.circles.length === 0) this.stop = true;
    }

    draw() {
        this.circles.forEach(circle => circle.draw());
    }
}

class CursorSpecialEffects {
    constructor() {
        this.computerCanvas = document.createElement('canvas');
        this.renderCanvas = document.createElement('canvas');
        this.computerContext = this.computerCanvas.getContext('2d');
        this.renderContext = this.renderCanvas.getContext('2d');

        this.globalWidth = window.innerWidth;
        this.globalHeight = window.innerHeight;

        this.booms = [];
        this.running = false;

        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundResize = this.handleResize.bind(this);
        this.boundPageHide = this.handlePageHide.bind(this);
    }

    handleMouseDown(e) {
        const boom = new Boom({
            origin: { x: e.clientX, y: e.clientY },
            context: this.computerContext,
            area: { width: this.globalWidth, height: this.globalHeight }
        });
        boom.init();
        this.booms.push(boom);
        if (!this.running) this.run();
    }

    handleResize() {
        this.globalWidth = window.innerWidth;
        this.globalHeight = window.innerHeight;
        this.renderCanvas.width = this.computerCanvas.width = this.globalWidth;
        this.renderCanvas.height = this.computerCanvas.height = this.globalHeight;
    }

    handlePageHide() {
        this.booms = [];
        this.running = false;
        window.removeEventListener('mousedown', this.boundMouseDown);
        window.removeEventListener('resize', this.boundResize);
        window.removeEventListener('pagehide', this.boundPageHide);
    }

    init() {
        const style = this.renderCanvas.style;
        style.position = 'fixed';
        style.top = style.left = 0;
        style.zIndex = '9999999';
        style.pointerEvents = 'none';

        this.renderCanvas.width = this.computerCanvas.width = this.globalWidth;
        this.renderCanvas.height = this.computerCanvas.height = this.globalHeight;

        document.body.append(this.renderCanvas);

        window.addEventListener('mousedown', this.boundMouseDown);
        window.addEventListener('resize', this.boundResize);
        window.addEventListener('pagehide', this.boundPageHide);
    }

    run() {
        this.running = true;
        if (this.booms.length === 0) {
            this.running = false;
            return;
        }

        requestAnimationFrame(this.run.bind(this));

        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight);
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight);

        this.booms.forEach(boom => {
            boom.move();
            boom.draw();
        });

        // 过滤掉已经完成的 booms
        this.booms = this.booms.filter(boom => !boom.stop);

        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight);
    }
}

const cursorSpecialEffects = new CursorSpecialEffects();
cursorSpecialEffects.init();
