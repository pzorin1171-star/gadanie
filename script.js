// Cosmic Zodiac System v2.0
class ZodiacMystic {
    constructor() {
        this.init();
    }

    init() {
        // System state
        this.state = {
            currentSection: 'dashboard',
            selectedSign: 'aries',
            audioEnabled: true,
            theme: 'dark',
            userLevel: 1,
            xp: 0,
            achievements: [],
            savedPredictions: [],
            notifications: [],
            compatibilityHistory: []
        };

        // Initialize components
        this.initUI();
        this.initAudio();
        this.initCanvas();
        this.initZodiacData();
        this.initEventListeners();
        this.loadUserData();
        this.startSystem();
    }

    initUI() {
        // Startup sequence
        setTimeout(() => {
            this.showStartupScreen();
        }, 100);
    }

    showStartupScreen() {
        const startupScreen = document.getElementById('startup-screen');
        const progressBar = document.getElementById('startup-progress');
        
        // Simulate system boot
        let progress = 0;
        const bootInterval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(bootInterval);
                setTimeout(() => {
                    startupScreen.style.opacity = '0';
                    setTimeout(() => {
                        startupScreen.style.display = 'none';
                        this.playAmbientSound();
                        this.showNotification('Система готова к работе', 'success');
                    }, 500);
                }, 1000);
            }
        }, 100);

        document.getElementById('skip-startup').addEventListener('click', () => {
            clearInterval(bootInterval);
            startupScreen.style.display = 'none';
            this.playAmbientSound();
        });
    }

    initAudio() {
        this.ambientSound = document.getElementById('ambient-sound');
        this.clickSound = document.getElementById('click-sound');
        this.revealSound = document.getElementById('reveal-sound');
    }

    initCanvas() {
        this.initConstellationCanvas();
        this.initParticleSystem();
    }

    initConstellationCanvas() {
        const canvas = document.getElementById('constellation-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create stars
        const stars = Array.from({length: 100}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            brightness: Math.random() * 0.5 + 0.5
        }));
        
        // Create constellation lines
        const connections = [];
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    connections.push([i, j]);
                }
            }
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
            ctx.lineWidth = 1;
            
            connections.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            });
            
            // Draw stars
            stars.forEach(star => {
                ctx.fillStyle = `rgba(0, 243, 255, ${star.brightness})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = Array.from({length: 50}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.3)' : 'rgba(157, 0, 255, 0.3)'
        }));
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off walls
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Draw particle
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    initZodiacData() {
        this.zodiacData = {
            aries: {
                name: "Овен",
                element: "Огонь",
                icon: "♈",
                dates: "21.03 - 19.04",
                keywords: ["Смелость", "Инициатива", "Энергия"],
                compatibility: {
                    best: ["Лев", "Стрелец"],
                    good: ["Близнецы", "Водолей"],
                    bad: ["Рак", "Козерог"]
                },
                predictions: {
                    love: [
                        "Сегодня звёзды благоволят смелым признаниям. Не бойся сказать о своих чувствах.",
                        "Романтическая встреча может произойти в неожиданном месте. Будь открыт новым знакомствам.",
                        "Страсть и эмоции сегодня на пике. Идеальное время для углубления отношений."
                    ],
                    career: [
                        "Лидерские качества будут замечены. Не бойся брать на себя ответственность.",
                        "Новый проект потребует смелости. Твоя инициатива будет вознаграждена.",
                        "Конфликты на работе решатся в твою пользу. Прояви дипломатичность."
                    ],
                    health: [
                        "Энергия бьёт ключом. Займись спортом или активным отдыхом.",
                        "Избегай переутомления. Умей вовремя остановиться.",
                        "Физическая активность поможет сбросить напряжение."
                    ],
                    finance: [
                        "Рискованные инвестиции могут принести прибыль. Но будь осторожен.",
                        "Неожиданный финансовый приток. Готовься к приятным сюрпризам.",
                        "Хороший день для крупных покупок. Доверься интуиции."
                    ]
                }
            },
            // ... остальные знаки (сокращено для краткости)
        };

        this.tarotDeck = [
            { name: "Шут", type: "major", meaning: "Начало, невинность, спонтанность" },
            { name: "Маг", type: "major", meaning: "Воля, мастерство, концентрация" },
            { name: "Верховная Жрица", type: "major", meaning: "Интуиция, тайны, подсознание" },
            // ... остальные карты Таро
        ];
    }

    initEventListeners() {
        // Matrix navigation
        document.querySelectorAll('.matrix-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
                this.playSound('click');
            });
        });

        // Quick divination buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.performQuickDivination(type);
            });
        });

        // Zodiac sphere
        document.querySelectorAll('.zodiac-point').forEach(point => {
            point.addEventListener('click', (e) => {
                const sign = e.currentTarget.dataset.sign;
                this.selectZodiacSign(sign);
            });
        });

        // Start divination
        document.getElementById('start-divination').addEventListener('click', () => {
            this.performDivination();
        });

        // Audio toggle
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.toggleAudio();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Terminal command
        document.getElementById('execute-command').addEventListener('click', () => {
            this.processTerminalCommand();
        });

        document.getElementById('terminal-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processTerminalCommand();
            }
        });

        // Update time
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    switchSection(section) {
        // Update UI
        document.querySelectorAll('.matrix-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        document.querySelectorAll('.terminal-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.state.currentSection = section;
        
        // Section-specific actions
        switch(section) {
            case 'horoscope':
                this.loadHoroscope();
                break;
            case 'compatibility':
                this.initCompatibility();
                break;
            case 'tarot':
                this.initTarotDeck();
                break;
            case 'archive':
                this.loadArchive();
                break;
        }
    }

    selectZodiacSign(sign) {
        this.state.selectedSign = sign;
        
        const data = this.zodiacData[sign];
        if (!data) return;

        // Update UI
        document.getElementById('selected-sign-icon').textContent = data.icon;
        document.getElementById('selected-sign-name').textContent = data.name.toUpperCase();
        document.getElementById('selected-sign-dates').textContent = data.dates;
        document.getElementById('selected-sign-element').textContent = data.element.toUpperCase();

        // Update stats with random values (simulated)
        document.getElementById('sign-energy').textContent = `${Math.floor(Math.random() * 30) + 70}%`;
        document.getElementById('sign-luck').textContent = `${Math.floor(Math.random() * 40) + 60}%`;
        document.getElementById('sign-love').textContent = `${Math.floor(Math.random() * 35) + 65}%`;

        // Highlight selected point
        document.querySelectorAll('.zodiac-point').forEach(point => {
            point.classList.remove('selected');
        });
        document.querySelector(`[data-sign="${sign}"]`).classList.add('selected');
    }

    performDivination() {
        const loadingScreen = document.getElementById('loading-screen');
        const resultDisplay = document.getElementById('result-display');
        const progressFill = document.getElementById('progress-fill');
        
        // Show loading
        loadingScreen.style.display = 'block';
        resultDisplay.style.display = 'none';
        
        // Simulate loading
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                
                // Generate results
                this.generateDivinationResult();
                
                // Show results
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    resultDisplay.style.display = 'block';
                    this.playSound('reveal');
                    this.showNotification('Гадание завершено!', 'success');
                    this.grantXP(25);
                }, 500);
            }
        }, 200);
    }

    generateDivinationResult() {
        const sign = this.state.selectedSign;
        const data = this.zodiacData[sign];
        
        const resultDisplay = document.getElementById('result-display');
        
        const aspects = Array.from(document.querySelectorAll('input[name="aspect"]:checked'))
            .map(input => input.value);
        
        let html = `
            <div class="result-header-glow">
                <h3>ПРЕДСКАЗАНИЕ ДЛЯ ${data.name.toUpperCase()}</h3>
                <p class="result-subtitle">${new Date().toLocaleDateString('ru-RU')} | Глубина: ${document.getElementById('divination-depth').value}/10</p>
            </div>
            
            <div class="result-grid">
        `;
        
        if (aspects.includes('love')) {
            html += `
                <div class="result-aspect">
                    <div class="aspect-header">
                        <i class="fas fa-heart"></i>
                        <h4>ЛЮБОВЬ И ОТНОШЕНИЯ</h4>
                    </div>
                    <p>${this.getRandomItem(data.predictions.love)}</p>
                    <div class="aspect-meter">
                        <div class="meter-fill" style="width: ${Math.floor(Math.random() * 30) + 70}%"></div>
                    </div>
                </div>
            `;
        }
        
        if (aspects.includes('career')) {
            html += `
                <div class="result-aspect">
                    <div class="aspect-header">
                        <i class="fas fa-briefcase"></i>
                        <h4>КАРЬЕРА</h4>
                    </div>
                    <p>${this.getRandomItem(data.predictions.career)}</p>
                    <div class="aspect-meter">
                        <div class="meter-fill" style="width: ${Math.floor(Math.random() * 40) + 60}%"></div>
                    </div>
                </div>
            `;
        }
        
        if (aspects.includes('finance')) {
            html += `
                <div class="result-aspect">
                    <div class="aspect-header">
                        <i class="fas fa-coins"></i>
                        <h4>ФИНАНСЫ</h4>
                    </div>
                    <p>${this.getRandomItem(data.predictions.finance)}</p>
                    <div class="aspect-meter">
                        <div class="meter-fill" style="width: ${Math.floor(Math.random() * 35) + 65}%"></div>
                    </div>
                </div>
            `;
        }
        
        if (aspects.includes('health')) {
            html += `
                <div class="result-aspect">
                    <div class="aspect-header">
                        <i class="fas fa-heartbeat"></i>
                        <h4>ЗДОРОВЬЕ</h4>
                    </div>
                    <p>${this.getRandomItem(data.predictions.health)}</p>
                    <div class="aspect-meter">
                        <div class="meter-fill" style="width: ${Math.floor(Math.random() * 25) + 75}%"></div>
                    </div>
                </div>
            `;
        }
        
        html += `
            </div>
            
            <div class="result-summary">
                <h4><i class="fas fa-star"></i> КЛЮЧЕВЫЕ РЕКОМЕНДАЦИИ</h4>
                <ul>
                    <li>Прояви инициативу в важных вопросах</li>
                    <li>Доверься своей интуиции сегодня</li>
                    <li>Избегай спонтанных решений после 18:00</li>
                </ul>
            </div>
            
            <div class="result-meta">
                <div class="meta-item">
                    <span>Уровень точности:</span>
                    <span class="meta-value">${Math.floor(Math.random() * 20) + 80}%</span>
                </div>
                <div class="meta-item">
                    <span>Планетарное влияние:</span>
                    <span class="meta-value">Сильное</span>
                </div>
                <div class="meta-item">
                    <span>Следующее обновление:</span>
                    <span class="meta-value">Через 24 часа</span>
                </div>
            </div>
        `;
        
        resultDisplay.innerHTML = html;
        
        // Save to history
        this.savePrediction({
            sign: sign,
            date: new Date().toISOString(),
            aspects: aspects,
            summary: "Гадание завершено успешно"
        });
    }

    performQuickDivination(type) {
        const signs = Object.keys(this.zodiacData);
        const randomSign = this.getRandomItem(signs);
        const data = this.zodiacData[randomSign];
        
        const messages = {
            daily: ["День будет продуктивным", "Ожидайте приятных сюрпризов", "Будьте осторожны в общении"],
            love: ["Любовь витает в воздухе", "Новые знакомства вероятны", "Углубите существующие отношения"],
            money: ["Финансовый рост возможен", "Избегайте импульсивных трат", "Хорошее время для инвестиций"],
            health: ["Энергия на высоком уровне", "Отдохните и восстановите силы", "Занимайтесь физической активностью"]
        };
        
        const result = this.getRandomItem(messages[type]);
        const resultElement = document.querySelector('#quick-result .result-scroll');
        
        resultElement.innerHTML = `
            <div class="quick-result-item">
                <div class="quick-result-sign">${data.icon}</div>
                <div class="quick-result-content">
                    <strong>${data.name}:</strong> ${result}
                </div>
                <div class="quick-result-time">${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
            ${resultElement.innerHTML}
        `;
        
        this.showNotification(`Быстрое гадание: ${type}`, 'info');
    }

    loadHoroscope() {
        const container = document.getElementById('horoscope-container');
        
        let html = '<div class="horoscope-grid-inner">';
        
        Object.entries(this.zodiacData).forEach(([key, data]) => {
            const predictions = [
                "Сегодня отличный день для новых начинаний",
                "Проявите терпение в важных вопросах",
                "Финансовая удача улыбнётся вам",
                "Обратите внимание на здоровье",
                "Романтические встречи вероятны",
                "Проявите творческий подход к работе"
            ];
            
            const prediction = this.getRandomItem(predictions);
            const compatibility = this.getRandomItem(["Высокая", "Средняя", "Низкая"]);
            
            html += `
                <div class="horoscope-card" data-sign="${key}">
                    <div class="card-header">
                        <div class="card-icon">${data.icon}</div>
                        <div class="card-title">
                            <h4>${data.name}</h4>
                            <span class="card-date">${data.dates}</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>${prediction}</p>
                        <div class="card-stats">
                            <div class="stat">
                                <span>Удача:</span>
                                <span class="stat-value">${Math.floor(Math.random() * 30) + 70}%</span>
                            </div>
                            <div class="stat">
                                <span>Совместимость:</span>
                                <span class="stat-value">${compatibility}</span>
                            </div>
                        </div>
                    </div>
                    <button class="card-action" onclick="zodiacMystic.viewHoroscopeDetails('${key}')">
                        <i class="fas fa-eye"></i> Подробнее
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    initCompatibility() {
        const container = document.querySelector('.sign-select-grid');
        
        let html = '';
        Object.entries(this.zodiacData).forEach(([key, data]) => {
            html += `
                <div class="sign-select-item" data-sign="${key}">
                    <div class="select-icon">${data.icon}</div>
                    <span class="select-name">${data.name}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.sign-select-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const sign = e.currentTarget.dataset.sign;
                // Handle compatibility selection
            });
        });
    }

    initTarotDeck() {
        const deck = document.getElementById('tarot-deck');
        
        let html = '<div class="tarot-deck-inner">';
        
        this.tarotDeck.slice(0, 12).forEach((card, index) => {
            html += `
                <div class="tarot-card" data-index="${index}" style="--rotation: ${Math.random() * 30 - 15}deg">
                    <div class="card-front">
                        <div class="card-symbol">${card.name.charAt(0)}</div>
                        <div class="card-name">${card.name}</div>
                    </div>
                    <div class="card-back">
                        <div class="tarot-pattern"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        deck.innerHTML = html;
        
        // Add card click handlers
        document.querySelectorAll('.tarot-card').forEach(card => {
            card.addEventListener('click', () => {
                this.drawTarotCard(parseInt(card.dataset.index));
            });
        });
    }

    drawTarotCard(index) {
        const card = this.tarotDeck[index];
        
        const modal = document.getElementById('tarot-modal');
        const content = document.getElementById('tarot-reading');
        
        content.innerHTML = `
            <div class="tarot-reading">
                <div class="reading-card">
                    <div class="card-display">
                        <div class="card-symbol-large">${card.name.charAt(0)}</div>
                        <h3>${card.name}</h3>
                    </div>
                    <div class="card-meaning">
                        <h4>Значение:</h4>
                        <p>${card.meaning}</p>
                    </div>
                </div>
                <div class="reading-interpretation">
                    <h4><i class="fas fa-crystal-ball"></i> ИНТЕРПРЕТАЦИЯ</h4>
                    <p>Эта карта указывает на ${this.getRandomItem(["новые начинания", "внутреннюю мудрость", "трансформацию", "удачу"])}. 
                    ${this.getRandomItem(["Внимательно обдумайте свои следующие шаги.", "Доверьтесь своей интуиции.", "Будьте готовы к переменам."])}</p>
                </div>
            </div>
        `;
        
        this.showModal('tarot-modal');
        this.playSound('reveal');
    }

    processTerminalCommand() {
        const input = document.getElementById('terminal-input');
        const command = input.value.trim().toLowerCase();
        
        if (!command) return;
        
        // Clear input
        input.value = '';
        
        // Process commands
        const commands = {
            'help': () => this.showNotification('Доступные команды: help, clear, time, date, level, credits', 'info'),
            'clear': () => {
                document.querySelectorAll('.terminal-section').forEach(section => {
                    section.style.display = 'none';
                });
                document.getElementById('dashboard-section').style.display = 'block';
            },
            'time': () => this.showNotification(`Текущее время: ${new Date().toLocaleTimeString('ru-RU')}`, 'info'),
            'date': () => this.showNotification(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 'info'),
            'level': () => this.showNotification(`Ваш уровень: ${this.state.userLevel}`, 'info'),
            'credits': () => this.showNotification('Zodiac Mystic v2.0 | Cosmic Divination System', 'info'),
            'debug': () => {
                console.log('System State:', this.state);
                this.showNotification('Отладочная информация выведена в консоль', 'warning');
            }
        };
        
        if (commands[command]) {
            commands[command]();
        } else if (command.startsWith('goto ')) {
            const section = command.split(' ')[1];
            if (['dashboard', 'divination', 'horoscope', 'compatibility', 'rituals', 'tarot', 'archive', 'settings'].includes(section)) {
                this.switchSection(section);
                this.showNotification(`Переход в раздел: ${section}`, 'success');
            } else {
                this.showNotification(`Неизвестный раздел: ${section}`, 'error');
            }
        } else {
            this.showNotification(`Неизвестная команда: ${command}`, 'error');
        }
    }

    toggleAudio() {
        this.state.audioEnabled = !this.state.audioEnabled;
        const btn = document.getElementById('audio-toggle');
        
        if (this.state.audioEnabled) {
            this.ambientSound.play();
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.showNotification('Звук включен', 'success');
        } else {
            this.ambientSound.pause();
            btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.showNotification('Звук выключен', 'warning');
        }
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        
        const btn = document.getElementById('theme-toggle');
        btn.innerHTML = this.state.theme === 'dark' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
            
        this.showNotification(`Тема: ${this.state.theme === 'dark' ? 'Тёмная' : 'Светлая'}`, 'info');
    }

    playAmbientSound() {
        if (this.state.audioEnabled) {
            this.ambientSound.volume = 0.3;
            this.ambientSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playSound(type) {
        if (!this.state.audioEnabled) return;
        
        const sound = type === 'click' ? this.clickSound : this.revealSound;
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
                <span class="notification-time">${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        
        const list = document.getElementById('notifications-list');
        list.insertBefore(notification, list.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    showModal(modalId) {
        document.getElementById('modal-overlay').style.display = 'block';
        document.getElementById(modalId).style.display = 'block';
        
        // Add close handlers
        document.getElementById('modal-overlay').addEventListener('click', () => {
            this.hideModal(modalId);
        });
        
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal(modalId);
            });
        });
    }

    hideModal(modalId) {
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById(modalId).style.display = 'none';
    }

    updateTime() {
        const now = new Date();
        document.getElementById('hud-time').textContent = 
            now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        document.getElementById('hud-date').textContent = 
            now.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'});
    }

    grantXP(amount) {
        this.state.xp += amount;
        
        // Level up every 100 XP
        const newLevel = Math.floor(this.state.xp / 100) + 1;
        if (newLevel > this.state.userLevel) {
            this.state.userLevel = newLevel;
            this.showAchievement(`Новый уровень: ${newLevel}!`);
        }
        
        // Update UI
        document.getElementById('user-level').textContent = this.state.userLevel;
        document.getElementById('xp-fill').style.width = `${(this.state.xp % 100)}%`;
        
        this.saveUserData();
    }

    showAchievement(text) {
        const toast = document.getElementById('achievement-toast');
        document.getElementById('achievement-text').textContent = text;
        
        toast.style.display = 'flex';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
                toast.style.opacity = '1';
            }, 500);
        }, 3000);
    }

    savePrediction(prediction) {
        this.state.savedPredictions.push(prediction);
        this.saveUserData();
        
        // Update counter
        const count = this.state.savedPredictions.length;
        document.getElementById('divinations-count').textContent = count;
    }

    saveUserData() {
        localStorage.setItem('zodiacMysticData', JSON.stringify(this.state));
    }

    loadUserData() {
        const saved = localStorage.getItem('zodiacMysticData');
        if (saved) {
            this.state = {...this.state, ...JSON.parse(saved)};
        }
        
        // Update UI with loaded data
        document.getElementById('user-level').textContent = this.state.userLevel;
        document.getElementById('divinations-count').textContent = this.state.savedPredictions.length;
        document.getElementById('xp-fill').style.width = `${(this.state.xp % 100)}%`;
        
        // Set theme
        document.documentElement.setAttribute('data-theme', this.state.theme);
        document.getElementById('theme-toggle').innerHTML = this.state.theme === 'dark' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    startSystem() {
        console.log('Zodiac Mystic System v2.0 initialized');
        console.log('Current state:', this.state);
        
        // Initial notifications
        setTimeout(() => {
            this.showNotification('Добро пожаловать в систему гаданий!', 'info');
            this.showNotification('Выберите знак зодиака для начала', 'info');
        }, 2000);
    }
}

// Initialize system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.zodiacMystic = new ZodiacMystic();
});

// Custom cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('custom-cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Create trail effect
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 1000);
});

// Fullscreen toggle
document.getElementById('fullscreen-toggle').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});
