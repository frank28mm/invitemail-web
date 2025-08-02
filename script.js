// 删除这三行旧代码：
// const envelope = document.querySelector('.envelope-wrapper');
// envelope.addEventListener('click', () => {
//     envelope.querySelector('.envelope').classList.toggle('open');
// });

// 矩阵代码雨效果
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // 矩阵字符
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.charArray = this.chars.split('');
        
        this.fontSize = 14;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = [];
        
        // 初始化雨滴
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
        
        this.animate();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        
        // 重新初始化雨滴数组
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
    }
    
    animate() {
        // 半透明黑色背景，创造拖尾效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 设置文字样式
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = this.fontSize + 'px monospace';
        
        // 绘制字符
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.charArray[Math.floor(Math.random() * this.charArray.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // 随机重置雨滴
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 信封交互逻辑
class EnvelopeInteraction {
    constructor() {
        this.envelope = document.getElementById('envelope');
        this.letter = document.getElementById('letter');
        this.passwordModal = document.getElementById('password-modal');
        this.correctPassword = '2049';
        this.isOpened = false; // 添加这个属性
        this.audioContext = null;
        this.createAudioContext();
        this.init();
    }

    init() {
        // 清空所有文本内容
        this.clearAllText();
        
        // 更新时间戳
        this.updateTimestamp();
        
        // 创建音频上下文
        this.createAudioContext();
        
        // 绑定事件
        if (this.envelope) {
            this.envelope.addEventListener('click', () => {
                if (!this.isOpened) {
                    this.showPasswordModal();
                }
            });
        }
        
        // 绑定密码确认按钮
        const confirmBtn = document.getElementById('confirm-password');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.checkPassword();
            });
        }
        
        // 绑定密码输入框回车事件
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkPassword();
                }
            });
        }
        
        // 绑定取消按钮
        const cancelBtn = document.getElementById('cancel-password');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hidePasswordModal());
        }
        
        // 绑定矩阵按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('matrix-btn')) {
                this.enterMatrix();
                // 延迟显示欢迎消息，让颜色变化先完成
                setTimeout(() => {
                    this.showWelcomeMessage();
                }, 1000);
            }
        });
    }

    clearAllText() {
        const textElements = ['letter-title', 'letter-p1', 'letter-p2', 'letter-p3'];
        textElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
            }
        });
    }

    updateTimestamp() {
        const timestamp = document.querySelector('.timestamp');
        if (timestamp) {
            timestamp.textContent = 'TIMESTAMP: 2025.08.01';
        }
    }

    showPasswordModal() {
        if (this.passwordModal) {
            this.passwordModal.style.display = 'flex';
            // 添加show类来触发CSS动画
            setTimeout(() => {
                this.passwordModal.classList.add('show');
            }, 10);
        }
    }

    hidePasswordModal() {
        if (this.passwordModal) {
            this.passwordModal.classList.remove('show');
            // 等待动画完成后隐藏
            setTimeout(() => {
                this.passwordModal.style.display = 'none';
            }, 300);
        }
    }

    checkPassword() {
        const passwordInput = document.getElementById('password-input');
        const password = passwordInput.value;
        
        if (password === this.correctPassword) {
            this.hidePasswordModal();
            this.openEnvelope();
            this.playUnlockSound();
        } else {
            this.playErrorSound();
            passwordInput.value = '';
            passwordInput.placeholder = 'INCORRECT PASSWORD';
            setTimeout(() => {
                passwordInput.placeholder = 'ENTER PASSWORD';
            }, 2000);
        }
    }

    openEnvelope() {
        // 设置为已打开状态
        this.isOpened = true;
        
        // 添加打开类
        this.envelope.classList.add('open');
        
        // 显示信件内容
        setTimeout(() => {
            this.letter.style.display = 'block';
            this.letter.style.opacity = '1';
            
            // 清空所有文字内容
            this.clearAllText();
            
            // 更新时间戳
            this.updateTimestamp();
            
            // 开始打字机效果
            this.typewriterEffect();
        }, 1000);
    }

    typewriterEffect() {
        const elements = [
            { id: 'letter-title', text: '亲爱的未来智造者：你好！' },
            { id: 'letter-p1', text: '1995年，比尔·盖茨在《未来之路》中预言了"信息高速公路"的到来。但他也没有预计到，仅仅用了二三十年的时间，人类就能将整个世界装进小小的手机里，每个人可以随时与网络互联。' },
            { id: 'letter-p2', text: '今天，我们正站在一个同样、甚至更激动人心的转折点上。一场由AI驱动的变革正以惊人的速度从想象走向现实。人类即将步入一个全新的"丰饶时代"——一个智能服务无处不在，人类创造力被极大释放，经济和社会都得到极大发展的时代。' },
            { id: 'letter-p3', text: '而这场革命，无疑将以AI编程(AI Coding)为起点，因为在数字世界，代码是最具有「确定性」的。维可松的"AI Coding智造营"正是这场伟大变革的序幕之一。' },
            { id: 'letter-p4', text: '在过去，学习编程意味着学习晦涩的计算机语言——那些将人的想法翻译成机器能理解的语言。正因如此，编程是一个极少数人掌握的专业技能。但如今，AI让代码的生成变得易如反掌，技术的门槛正在快速降低。' },
            { id: 'letter-p5', text: '当"写代码"的能力不再是问题，那什么才是未来世界里你最应当具备的能力？' },
            { id: 'letter-p6', text: '是你驾驭AI的能力，是你快速学习的能力。' },
            { id: 'letter-p7', text: '是你的审美、你的洞察、你独特的想法、以及你引导AI"表达意图"和"实现愿景"的能力。' },
            { id: 'letter-p8', text: '编程的核心，正在从"人写代码(Coding)"，演变为"AI写代码（AI Coding）+人创造(Creation)"的新范式。' },
            { id: 'letter-p9', text: '目前，全球专业开发者的数量大约是2500万。但在AI的赋能下，每个人可能化身程序员、开发者。设计师、学生、健身教练……越来越多非技术背景的人正在大规模转型，他们正在成为创造的主流。' },
            { id: 'letter-p10', text: '你，也可以成为其中的一员！无关你的年龄、学历、城市，只要你愿意！' },
            { id: 'letter-p11', text: '现在，我们向你发出正式的邀请。欢迎你加入"维可松AI Coding智造营"，共同参与这场"丰饶时代的预演"。在这里，你将直接跳过繁琐的语法，学习驾驭AI进行创造的思维和方法，你将亲手将脑海中的奇思妙想，变为一个真正的数字应用。' },
            { id: 'letter-p12', text: '未来已来，你做好准备了吗？' }
        ];
        
        this.createAdditionalParagraphs();
        this.typeSequentially(elements, 0);
    }

    typeSequentially(elements, index) {
        if (index >= elements.length) {
            // 所有文字打完后显示按钮并自动滚动
            setTimeout(() => {
                const actionButton = document.getElementById('action-button');
                if (actionButton) {
                    actionButton.style.display = 'block';
                    actionButton.style.opacity = '0';
                    actionButton.style.transition = 'opacity 0.5s ease';
                    
                    // 先滚动到按钮位置
                    actionButton.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                    
                    // 然后显示按钮
                    setTimeout(() => {
                        actionButton.style.opacity = '1';
                    }, 500);
                }
            }, 1000);
            return;
        }
        
        const { id, text } = elements[index];
        const element = document.getElementById(id);
        if (element) {
            this.typeTextSequential(element, text, 60, () => {
                // 当前段落打完后，等待500ms再开始下一段
                setTimeout(() => {
                    this.typeSequentially(elements, index + 1);
                }, 500);
            });
        } else {
            // 如果元素不存在，直接进行下一个
            this.typeSequentially(elements, index + 1);
        }
    }
    
    typeTextSequential(element, text, speed, callback) {
        let i = 0;
        element.classList.add('typing-cursor'); // 添加光标
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                
                // 检查元素是否在可视区域内，如果不在则自动滚动
                this.autoScrollToElement(element);
                
                // 播放机械键盘音效
                this.playMechanicalKeySound();
                i++;
            } else {
                element.classList.remove('typing-cursor'); // 移除光标
                clearInterval(timer);
                if (callback) callback(); // 执行回调
            }
        }, speed);
    }

    playMechanicalKeySound() {
        if (!this.audioContext) return;
        
        // 创建更切断的机械键盘音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // 连接音频节点
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置滤波器（模拟机械键盘的咔哒声）
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        // 设置频率（更高频率模拟咔哒声）
        oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.05);
        
        // 设置音量包络（快速衰减）
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        // 播放音效
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    createAdditionalParagraphs() {
        const letterBody = document.querySelector('.letter-body');
        if (!letterBody) return;
        
        // 确保有足够的段落元素（12个段落）
        const existingParagraphs = letterBody.querySelectorAll('p').length;
        const neededParagraphs = 12;
        
        for (let i = existingParagraphs; i < neededParagraphs; i++) {
            const p = document.createElement('p');
            p.id = `letter-p${i + 1}`;
            p.style.minHeight = '1.5em';
            
            // 在按钮前插入段落
            const actionButton = document.getElementById('action-button');
            if (actionButton) {
                letterBody.insertBefore(p, actionButton);
            } else {
                letterBody.appendChild(p);
            }
        }
    }

    autoScrollToElement(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 如果元素底部超出视窗，则滚动
        if (rect.bottom > windowHeight - 100) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            });
        }
    }

    enterMatrix() {
        // 创建纯蓝色效果，不使用hue-rotate避免粉色
        document.body.style.filter = 'sepia(1) saturate(3) hue-rotate(180deg) brightness(0.7) contrast(1.2)';
        document.body.style.transition = 'filter 2s ease-in-out';
    }

    showWelcomeMessage() {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'welcome-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        // 创建内容容器
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(145deg, #001122, #003344);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.5s ease;
        `;
        
        // 添加文字
        const message = document.createElement('h2');
        message.textContent = 'WELCOME TO THE REAL WORLD.';
        message.style.cssText = `
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 2rem;
            margin: 0;
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
        `;
        
        // 添加副标题
        const subtitle = document.createElement('p');
        subtitle.textContent = '维可松 AI Coding 智造营';
        subtitle.style.cssText = `
            color: #00cccc;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            margin: 20px 0 0 0;
            opacity: 0.8;
        `;
        
        // 组装元素
        content.appendChild(message);
        content.appendChild(subtitle);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 显示动画
        setTimeout(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 100);
        
        // 不添加任何关闭事件，让对话框永久显示
    }

    updateStatusBar(status, security) {
        const statusItems = document.querySelectorAll('.status-item');
        if (statusItems[0]) statusItems[0].textContent = `STATUS: ${status}`;
        if (statusItems[1]) statusItems[1].textContent = `SECURITY: ${security}`;
    }

    createAudioContext() {
        // 创建音频上下文（用于生成音效）
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playUnlockSound() {
        if (!this.audioContext) return;
        
        // 创建解锁音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playErrorSound() {
        if (!this.audioContext) return;
        
        // 创建错误音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化矩阵雨效果
    new MatrixRain();
    
    // 初始化信封交互
    new EnvelopeInteraction();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加鼠标跟踪效果（可选）
    addMouseTracker();
});

// 鼠标跟踪光效
function addMouseTracker() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0,255,0,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.5)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// 防止右键菜单（增加沉浸感）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 控制台彩蛋
console.log('%c欢迎来到AI智造时代！', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('%c维可松AI Coding智造营期待您的加入...', 'color: #00cccc; font-size: 14px;');