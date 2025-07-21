class SkinLab {
    constructor() {
        this.currentSkin = {
            name: 'Mi Skin Personalizado',
            baseColor: '#FF6B6B',
            secondaryColor: '#4ECDC4',
            pattern: 'solid',
            gradient: 'radial',
            effects: [],
            accessories: [],
            eyeStyle: 'normal',
            eyeColor: '#000000',
            bodyTexture: 'smooth',
            glow: false,
            glowColor: '#FFFFFF',
            animation: 'none',
            rarity: 'common'
        };
        
        this.patterns = [
            { id: 'solid', name: 'Sólido', preview: 'solid' },
            { id: 'stripes', name: 'Rayas', preview: 'stripes' },
            { id: 'dots', name: 'Puntos', preview: 'dots' },
            { id: 'spiral', name: 'Espiral', preview: 'spiral' },
            { id: 'lightning', name: 'Rayos', preview: 'lightning' },
            { id: 'waves', name: 'Ondas', preview: 'waves' },
            { id: 'scales', name: 'Escamas', preview: 'scales' },
            { id: 'diamond', name: 'Diamantes', preview: 'diamond' },
            { id: 'hexagon', name: 'Hexágonos', preview: 'hexagon' },
            { id: 'tribal', name: 'Tribal', preview: 'tribal' },
            { id: 'galaxy', name: 'Galaxia', preview: 'galaxy' },
            { id: 'fire', name: 'Fuego', preview: 'fire' },
            { id: 'ice', name: 'Hielo', preview: 'ice' },
            { id: 'lava', name: 'Lava', preview: 'lava' },
            { id: 'rainbow', name: 'Arcoíris', preview: 'rainbow' }
        ];
        
        this.gradients = [
            { id: 'none', name: 'Sin Gradiente' },
            { id: 'linear', name: 'Lineal' },
            { id: 'radial', name: 'Radial' },
            { id: 'conic', name: 'Cónico' },
            { id: 'diamond', name: 'Diamante' }
        ];
        
        this.effects = [
            { id: 'glow', name: 'Brillo', premium: false },
            { id: 'sparkle', name: 'Destellos', premium: true },
            { id: 'shadow', name: 'Sombra', premium: false },
            { id: 'outline', name: 'Contorno', premium: false },
            { id: 'pulse', name: 'Pulsación', premium: true },
            { id: 'rainbow', name: 'Arcoíris', premium: true },
            { id: 'fire', name: 'Llamas', premium: true },
            { id: 'electric', name: 'Eléctrico', premium: true },
            { id: 'frost', name: 'Escarcha', premium: true },
            { id: 'toxic', name: 'Tóxico', premium: true }
        ];
        
        this.eyeStyles = [
            { id: 'normal', name: 'Normal', preview: 'normal' },
            { id: 'angry', name: 'Enojado', preview: 'angry' },
            { id: 'happy', name: 'Feliz', preview: 'happy' },
            { id: 'sleepy', name: 'Somnoliento', preview: 'sleepy' },
            { id: 'surprised', name: 'Sorprendido', preview: 'surprised' },
            { id: 'wink', name: 'Guiño', preview: 'wink' },
            { id: 'heart', name: 'Corazones', premium: true },
            { id: 'star', name: 'Estrellas', premium: true },
            { id: 'diamond', name: 'Diamantes', premium: true },
            { id: 'fire', name: 'Fuego', premium: true }
        ];
        
        this.bodyTextures = [
            { id: 'smooth', name: 'Suave' },
            { id: 'rough', name: 'Rugoso' },
            { id: 'metallic', name: 'Metálico', premium: true },
            { id: 'crystal', name: 'Cristal', premium: true },
            { id: 'fur', name: 'Peludo', premium: true },
            { id: 'scales', name: 'Escamoso' },
            { id: 'slime', name: 'Baboso', premium: true }
        ];
        
        this.animations = [
            { id: 'none', name: 'Sin Animación' },
            { id: 'pulse', name: 'Pulsación' },
            { id: 'rotate', name: 'Rotación', premium: true },
            { id: 'wave', name: 'Ondulación', premium: true },
            { id: 'sparkle', name: 'Destellos', premium: true },
            { id: 'flow', name: 'Flujo', premium: true }
        ];
        
        this.savedSkins = this.loadSavedSkins();
        this.initializeSkinLab();
    }
    
    initializeSkinLab() {
        this.createSkinLabInterface();
        this.setupEventListeners();
        this.updatePreview();
    }
    
    createSkinLabInterface() {
        const skinLabHTML = `
            <div class="skinlab-modal" id="skinLabModal">
                <div class="skinlab-container">
                    <div class="skinlab-header">
                        <h2><i class="fas fa-palette"></i> SKINLAB - Creador de Skins</h2>
                        <button class="close-btn" id="closeSkinLab">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="skinlab-content">
                        <div class="skinlab-sidebar">
                            <div class="skin-preview-section">
                                <h3><i class="fas fa-eye"></i> Vista Previa</h3>
                                <div class="skin-preview-container">
                                    <canvas id="skinPreviewCanvas" width="150" height="150"></canvas>
                                </div>
                                <div class="skin-info">
                                    <input type="text" id="skinName" placeholder="Nombre del skin" value="${this.currentSkin.name}">
                                    <div class="rarity-indicator" id="rarityIndicator">
                                        <span class="rarity-text">Común</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="saved-skins-section">
                                <h3><i class="fas fa-save"></i> Skins Guardados</h3>
                                <div class="saved-skins-grid" id="savedSkinsGrid">
                                    <!-- Se llenará dinámicamente -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="skinlab-main">
                            <div class="customization-tabs">
                                <button class="tab-btn active" data-tab="colors">
                                    <i class="fas fa-palette"></i> Colores
                                </button>
                                <button class="tab-btn" data-tab="patterns">
                                    <i class="fas fa-th"></i> Patrones
                                </button>
                                <button class="tab-btn" data-tab="effects">
                                    <i class="fas fa-magic"></i> Efectos
                                </button>
                                <button class="tab-btn" data-tab="eyes">
                                    <i class="fas fa-eye"></i> Ojos
                                </button>
                                <button class="tab-btn" data-tab="texture">
                                    <i class="fas fa-cube"></i> Textura
                                </button>
                                <button class="tab-btn" data-tab="animation">
                                    <i class="fas fa-play"></i> Animación
                                </button>
                            </div>
                            
                            <div class="customization-content">
                                <!-- Tab de Colores -->
                                <div class="tab-content active" id="colorsTab">
                                    <div class="color-section">
                                        <h4>Color Principal</h4>
                                        <div class="color-picker-container">
                                            <input type="color" id="baseColorPicker" value="${this.currentSkin.baseColor}">
                                            <div class="color-presets">
                                                ${this.generateColorPresets('base')}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="color-section">
                                        <h4>Color Secundario</h4>
                                        <div class="color-picker-container">
                                            <input type="color" id="secondaryColorPicker" value="${this.currentSkin.secondaryColor}">
                                            <div class="color-presets">
                                                ${this.generateColorPresets('secondary')}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="gradient-section">
                                        <h4>Tipo de Gradiente</h4>
                                        <div class="gradient-options">
                                            ${this.generateGradientOptions()}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Tab de Patrones -->
                                <div class="tab-content" id="patternsTab">
                                    <div class="patterns-grid">
                                        ${this.generatePatternOptions()}
                                    </div>
                                </div>
                                
                                <!-- Tab de Efectos -->
                                <div class="tab-content" id="effectsTab">
                                    <div class="effects-grid">
                                        ${this.generateEffectOptions()}
                                    </div>
                                    
                                    <div class="glow-section" id="glowSection">
                                        <h4>Configuración de Brillo</h4>
                                        <div class="glow-controls">
                                            <label>
                                                <input type="checkbox" id="enableGlow"> Activar Brillo
                                            </label>
                                            <div class="glow-color-container">
                                                <label>Color del Brillo:</label>
                                                <input type="color" id="glowColorPicker" value="${this.currentSkin.glowColor}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Tab de Ojos -->
                                <div class="tab-content" id="eyesTab">
                                    <div class="eyes-grid">
                                        ${this.generateEyeOptions()}
                                    </div>
                                    
                                    <div class="eye-color-section">
                                        <h4>Color de Ojos</h4>
                                        <input type="color" id="eyeColorPicker" value="${this.currentSkin.eyeColor}">
                                    </div>
                                </div>
                                
                                <!-- Tab de Textura -->
                                <div class="tab-content" id="textureTab">
                                    <div class="texture-grid">
                                        ${this.generateTextureOptions()}
                                    </div>
                                </div>
                                
                                <!-- Tab de Animación -->
                                <div class="tab-content" id="animationTab">
                                    <div class="animation-grid">
                                        ${this.generateAnimationOptions()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="skinlab-footer">
                        <div class="action-buttons">
                            <button class="btn-secondary" id="resetSkin">
                                <i class="fas fa-undo"></i> Resetear
                            </button>
                            <button class="btn-secondary" id="randomizeSkin">
                                <i class="fas fa-dice"></i> Aleatorio
                            </button>
                            <button class="btn-secondary" id="importSkin">
                                <i class="fas fa-upload"></i> Importar
                            </button>
                            <button class="btn-secondary" id="exportSkin">
                                <i class="fas fa-download"></i> Exportar
                            </button>
                            <button class="btn-primary" id="saveSkin">
                                <i class="fas fa-save"></i> Guardar Skin
                            </button>
                            <button class="btn-primary" id="applySkin">
                                <i class="fas fa-check"></i> Aplicar Skin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar al DOM
        document.body.insertAdjacentHTML('beforeend', skinLabHTML);
        
        // Agregar estilos CSS
        this.addSkinLabStyles();
    }
    
    generateColorPresets(type) {
        const presets = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84',
            '#EE5A24', '#0984E3', '#6C5CE7', '#FD79A8', '#00B894', '#FDCB6E',
            '#E17055', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#55A3FF'
        ];
        
        return presets.map(color => 
            `<div class="color-preset" data-color="${color}" data-type="${type}" style="background-color: ${color}"></div>`
        ).join('');
    }
    
    generateGradientOptions() {
        return this.gradients.map(gradient => 
            `<div class="gradient-option ${gradient.id === this.currentSkin.gradient ? 'active' : ''}" 
                  data-gradient="${gradient.id}">
                <div class="gradient-preview gradient-${gradient.id}"></div>
                <span>${gradient.name}</span>
            </div>`
        ).join('');
    }
    
    generatePatternOptions() {
        return this.patterns.map(pattern => 
            `<div class="pattern-option ${pattern.id === this.currentSkin.pattern ? 'active' : ''}" 
                  data-pattern="${pattern.id}">
                <div class="pattern-preview" data-pattern="${pattern.id}"></div>
                <span>${pattern.name}</span>
            </div>`
        ).join('');
    }
    
    generateEffectOptions() {
        return this.effects.map(effect => 
            `<div class="effect-option ${this.currentSkin.effects.includes(effect.id) ? 'active' : ''}" 
                  data-effect="${effect.id}">
                <div class="effect-preview effect-${effect.id}">
                    ${effect.premium ? '<i class="fas fa-crown premium-icon"></i>' : ''}
                </div>
                <span>${effect.name}</span>
            </div>`
        ).join('');
    }
    
    generateEyeOptions() {
        return this.eyeStyles.map(eye => 
            `<div class="eye-option ${eye.id === this.currentSkin.eyeStyle ? 'active' : ''}" 
                  data-eye="${eye.id}">
                <div class="eye-preview eye-${eye.id}">
                    ${eye.premium ? '<i class="fas fa-crown premium-icon"></i>' : ''}
                </div>
                <span>${eye.name}</span>
            </div>`
        ).join('');
    }
    
    generateTextureOptions() {
        return this.bodyTextures.map(texture => 
            `<div class="texture-option ${texture.id === this.currentSkin.bodyTexture ? 'active' : ''}" 
                  data-texture="${texture.id}">
                <div class="texture-preview texture-${texture.id}">
                    ${texture.premium ? '<i class="fas fa-crown premium-icon"></i>' : ''}
                </div>
                <span>${texture.name}</span>
            </div>`
        ).join('');
    }
    
    generateAnimationOptions() {
        return this.animations.map(animation => 
            `<div class="animation-option ${animation.id === this.currentSkin.animation ? 'active' : ''}" 
                  data-animation="${animation.id}">
                <div class="animation-preview animation-${animation.id}">
                    ${animation.premium ? '<i class="fas fa-crown premium-icon"></i>' : ''}
                </div>
                <span>${animation.name}</span>
            </div>`
        ).join('');
    }
    
    setupEventListeners() {
        // Cerrar modal
        document.getElementById('closeSkinLab').addEventListener('click', () => this.closeSkinLab());
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Color pickers
        document.getElementById('baseColorPicker').addEventListener('input', (e) => {
            this.currentSkin.baseColor = e.target.value;
            this.updatePreview();
        });
        
        document.getElementById('secondaryColorPicker').addEventListener('input', (e) => {
            this.currentSkin.secondaryColor = e.target.value;
            this.updatePreview();
        });
        
        document.getElementById('eyeColorPicker').addEventListener('input', (e) => {
            this.currentSkin.eyeColor = e.target.value;
            this.updatePreview();
        });
        
        document.getElementById('glowColorPicker').addEventListener('input', (e) => {
            this.currentSkin.glowColor = e.target.value;
            this.updatePreview();
        });
        
        // Color presets
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                const type = e.target.dataset.type;
                
                if (type === 'base') {
                    this.currentSkin.baseColor = color;
                    document.getElementById('baseColorPicker').value = color;
                } else {
                    this.currentSkin.secondaryColor = color;
                    document.getElementById('secondaryColorPicker').value = color;
                }
                
                this.updatePreview();
            });
        });
        
        // Gradient options
        document.querySelectorAll('.gradient-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.gradient-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.currentSkin.gradient = option.dataset.gradient;
                this.updatePreview();
            });
        });
        
        // Pattern options
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.pattern-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.currentSkin.pattern = option.dataset.pattern;
                this.updatePreview();
            });
        });
        
        // Effect options
        document.querySelectorAll('.effect-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const effect = option.dataset.effect;
                if (this.currentSkin.effects.includes(effect)) {
                    this.currentSkin.effects = this.currentSkin.effects.filter(e => e !== effect);
                    option.classList.remove('active');
                } else {
                    this.currentSkin.effects.push(effect);
                    option.classList.add('active');
                }
                this.updatePreview();
            });
        });
        
        // Eye options
        document.querySelectorAll('.eye-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.eye-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.currentSkin.eyeStyle = option.dataset.eye;
                this.updatePreview();
            });
        });
        
        // Texture options
        document.querySelectorAll('.texture-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.texture-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.currentSkin.bodyTexture = option.dataset.texture;
                this.updatePreview();
            });
        });
        
        // Animation options
        document.querySelectorAll('.animation-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.animation-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.currentSkin.animation = option.dataset.animation;
                this.updatePreview();
            });
        });
        
        // Glow toggle
        document.getElementById('enableGlow').addEventListener('change', (e) => {
            this.currentSkin.glow = e.target.checked;
            this.updatePreview();
        });
        
        // Skin name
        document.getElementById('skinName').addEventListener('input', (e) => {
            this.currentSkin.name = e.target.value;
        });
        
        // Action buttons
        document.getElementById('resetSkin').addEventListener('click', () => this.resetSkin());
        document.getElementById('randomizeSkin').addEventListener('click', () => this.randomizeSkin());
        document.getElementById('saveSkin').addEventListener('click', () => this.saveSkin());
        document.getElementById('applySkin').addEventListener('click', () => this.applySkin());
        document.getElementById('exportSkin').addEventListener('click', () => this.exportSkin());
        document.getElementById('importSkin').addEventListener('click', () => this.importSkin());
    }
    
    updatePreview() {
        const canvas = document.getElementById('skinPreviewCanvas');
        const ctx = canvas.getContext('2d');
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar skin personalizado
        this.drawCustomSkin(ctx, canvas.width / 2, canvas.height / 2, 40);
        
        // Actualizar indicador de rareza
        this.updateRarityIndicator();
    }
    
    drawCustomSkin(ctx, x, y, size) {
        // Guardar contexto
        ctx.save();
        
        // Aplicar efectos de fondo si es necesario
        if (this.currentSkin.glow) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.currentSkin.glowColor;
        }
        
        // Dibujar cuerpo principal
        this.drawSkinBody(ctx, x, y, size);
        
        // Dibujar patrón
        this.drawSkinPattern(ctx, x, y, size);
        
        // Dibujar ojos
        this.drawSkinEyes(ctx, x, y, size);
        
        // Aplicar efectos
        this.applySkinEffects(ctx, x, y, size);
        
        // Restaurar contexto
        ctx.restore();
    }
    
    drawSkinBody(ctx, x, y, size) {
        // Crear gradiente si está habilitado
        let fillStyle = this.currentSkin.baseColor;
        
        if (this.currentSkin.gradient !== 'none') {
            fillStyle = this.createGradient(ctx, x, y, size);
        }
        
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Aplicar textura
        this.applyBodyTexture(ctx, x, y, size);
    }
    
    createGradient(ctx, x, y, size) {
        let gradient;
        
        switch (this.currentSkin.gradient) {
            case 'linear':
                gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
                break;
            case 'radial':
                gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                break;
            case 'conic':
                gradient = ctx.createConicGradient(0, x, y);
                break;
            default:
                gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        }
        
        gradient.addColorStop(0, this.currentSkin.baseColor);
        gradient.addColorStop(1, this.currentSkin.secondaryColor);
        
        return gradient;
    }
    
    drawSkinPattern(ctx, x, y, size) {
        ctx.strokeStyle = this.currentSkin.secondaryColor;
        ctx.fillStyle = this.currentSkin.secondaryColor;
        
        switch (this.currentSkin.pattern) {
            case 'stripes':
                this.drawStripePattern(ctx, x, y, size);
                break;
            case 'dots':
                this.drawDotPattern(ctx, x, y, size);
                break;
            case 'spiral':
                this.drawSpiralPattern(ctx, x, y, size);
                break;
            case 'lightning':
                this.drawLightningPattern(ctx, x, y, size);
                break;
            case 'waves':
                this.drawWavePattern(ctx, x, y, size);
                break;
            case 'scales':
                this.drawScalePattern(ctx, x, y, size);
                break;
            case 'diamond':
                this.drawDiamondPattern(ctx, x, y, size);
                break;
            case 'hexagon':
                this.drawHexagonPattern(ctx, x, y, size);
                break;
            case 'tribal':
                this.drawTribalPattern(ctx, x, y, size);
                break;
            case 'galaxy':
                this.drawGalaxyPattern(ctx, x, y, size);
                break;
            case 'fire':
                this.drawFirePattern(ctx, x, y, size);
                break;
            case 'ice':
                this.drawIcePattern(ctx, x, y, size);
                break;
            case 'lava':
                this.drawLavaPattern(ctx, x, y, size);
                break;
            case 'rainbow':
                this.drawRainbowPattern(ctx, x, y, size);
                break;
        }
    }
    
    drawStripePattern(ctx, x, y, size) {
        ctx.lineWidth = 2;
        for (let i = -size; i < size; i += 8) {
            ctx.beginPath();
            ctx.moveTo(x + i, y - size);
            ctx.lineTo(x + i, y + size);
            ctx.stroke();
        }
    }
    
    drawDotPattern(ctx, x, y, size) {
        const dotPositions = [
            [-size * 0.4, -size * 0.2], [size * 0.4, -size * 0.2],
            [-size * 0.2, size * 0.4], [size * 0.2, size * 0.4],
            [0, 0], [-size * 0.6, 0], [size * 0.6, 0]
        ];
        
        dotPositions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx, y + dy, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawSpiralPattern(ctx, x, y, size) {
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
            const radius = (angle / (Math.PI * 6)) * size * 0.8;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (angle === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    
    drawLightningPattern(ctx, x, y, size) {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.4, y - size * 0.6);
        ctx.lineTo(x + size * 0.2, y - size * 0.1);
        ctx.lineTo(x - size * 0.1, y);
        ctx.lineTo(x + size * 0.4, y + size * 0.6);
        ctx.stroke();
    }
    
    drawWavePattern(ctx, x, y, size) {
        ctx.lineWidth = 2;
        for (let offset = -size * 0.5; offset <= size * 0.5; offset += size * 0.3) {
            ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                const waveX = x + Math.cos(angle) * size * 0.7;
                const waveY = y + offset + Math.sin(angle * 3) * size * 0.1;
                if (angle === 0) ctx.moveTo(waveX, waveY);
                else ctx.lineTo(waveX, waveY);
            }
            ctx.stroke();
        }
    }
    
    drawScalePattern(ctx, x, y, size) {
        const scaleSize = size * 0.15;
        for (let row = -2; row <= 2; row++) {
            for (let col = -2; col <= 2; col++) {
                const scaleX = x + col * scaleSize * 1.5;
                const scaleY = y + row * scaleSize * 1.5;
                
                ctx.beginPath();
                ctx.arc(scaleX, scaleY, scaleSize, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    
    drawDiamondPattern(ctx, x, y, size) {
        const diamondSize = size * 0.2;
        const positions = [
            [0, -size * 0.4], [0, size * 0.4],
            [-size * 0.4, 0], [size * 0.4, 0]
        ];
        
        positions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(x + dx, y + dy - diamondSize);
            ctx.lineTo(x + dx + diamondSize, y + dy);
            ctx.lineTo(x + dx, y + dy + diamondSize);
            ctx.lineTo(x + dx - diamondSize, y + dy);
            ctx.closePath();
            ctx.stroke();
        });
    }
    
    drawHexagonPattern(ctx, x, y, size) {
        const hexSize = size * 0.3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = x + Math.cos(angle) * hexSize;
            const hy = y + Math.sin(angle) * hexSize;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    drawTribalPattern(ctx, x, y, size) {
        ctx.lineWidth = 3;
        // Patrón tribal simplificado
        ctx.beginPath();
        ctx.moveTo(x - size * 0.5, y);
        ctx.quadraticCurveTo(x, y - size * 0.3, x + size * 0.5, y);
        ctx.quadraticCurveTo(x, y + size * 0.3, x - size * 0.5, y);
        ctx.stroke();
    }
    
    drawGalaxyPattern(ctx, x, y, size) {
        // Patrón de galaxia con puntos brillantes
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = Math.random() * size * 0.8;
            const starX = x + Math.cos(angle) * radius;
            const starY = y + Math.sin(angle) * radius;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
            ctx.beginPath();
            ctx.arc(starX, starY, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawFirePattern(ctx, x, y, size) {
        // Patrón de fuego con gradiente naranja-rojo
        const fireGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        fireGradient.addColorStop(0, '#FFD700');
        fireGradient.addColorStop(0.5, '#FF4500');
        fireGradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = fireGradient;
        ctx.globalCompositeOperation = 'overlay';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawIcePattern(ctx, x, y, size) {
        // Patrón de hielo con cristales
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * size * 0.6, y + Math.sin(angle) * size * 0.6);
            ctx.stroke();
        }
    }
    
    drawLavaPattern(ctx, x, y, size) {
        // Patrón de lava con burbujas
        const bubbles = [
            [x - size * 0.3, y - size * 0.2, size * 0.1],
            [x + size * 0.2, y + size * 0.3, size * 0.15],
            [x, y, size * 0.08]
        ];
        
        ctx.fillStyle = '#FF6347';
        bubbles.forEach(([bx, by, radius]) => {
            ctx.beginPath();
            ctx.arc(bx, by, radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawRainbowPattern(ctx, x, y, size) {
        // Patrón arcoíris
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        const arcWidth = size * 0.1;
        
        colors.forEach((color, index) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = arcWidth;
            ctx.beginPath();
            ctx.arc(x, y, size * 0.3 + index * arcWidth, 0, Math.PI);
            ctx.stroke();
        });
    }
    
    drawSkinEyes(ctx, x, y, size) {
        const eyeSize = size * 0.15;
        const eyeOffset = size * 0.25;
        
        switch (this.currentSkin.eyeStyle) {
            case 'normal':
                this.drawNormalEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'angry':
                this.drawAngryEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'happy':
                this.drawHappyEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'sleepy':
                this.drawSleepyEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'surprised':
                this.drawSurprisedEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'wink':
                this.drawWinkEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'heart':
                this.drawHeartEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'star':
                this.drawStarEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'diamond':
                this.drawDiamondEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
            case 'fire':
                this.drawFireEyes(ctx, x, y, eyeSize, eyeOffset);
                break;
        }
    }
    
    drawNormalEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojo izquierdo
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.currentSkin.eyeColor;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ojo derecho
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.currentSkin.eyeColor;
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillos
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - eyeOffset + eyeSize * 0.3, y - eyeOffset - eyeSize * 0.3, eyeSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + eyeOffset + eyeSize * 0.3, y - eyeOffset - eyeSize * 0.3, eyeSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawAngryEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Cejas fruncidas
        ctx.strokeStyle = this.currentSkin.eyeColor;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(x - eyeOffset - eyeSize, y - eyeOffset - eyeSize);
        ctx.lineTo(x - eyeOffset + eyeSize * 0.5, y - eyeOffset - eyeSize * 0.5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + eyeOffset + eyeSize, y - eyeOffset - eyeSize);
        ctx.lineTo(x + eyeOffset - eyeSize * 0.5, y - eyeOffset - eyeSize * 0.5);
        ctx.stroke();
        
        // Ojos normales pero más pequeños
        this.drawNormalEyes(ctx, x, y, eyeSize * 0.8, eyeOffset);
    }
    
    drawHappyEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojos cerrados sonrientes
        ctx.strokeStyle = this.currentSkin.eyeColor;
        ctx.lineWidth = 3;
        
        // Ojo izquierdo
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI);
        ctx.stroke();
        
        // Ojo derecho
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI);
        ctx.stroke();
    }
    
    drawSleepyEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojos medio cerrados
        ctx.fillStyle = 'white';
        ctx.fillRect(x - eyeOffset - eyeSize, y - eyeOffset - eyeSize * 0.3, eyeSize * 2, eyeSize * 0.6);
        ctx.fillRect(x + eyeOffset - eyeSize, y - eyeOffset - eyeSize * 0.3, eyeSize * 2, eyeSize * 0.6);
        
        ctx.fillStyle = this.currentSkin.eyeColor;
        ctx.fillRect(x - eyeOffset - eyeSize * 0.6, y - eyeOffset - eyeSize * 0.2, eyeSize * 1.2, eyeSize * 0.4);
        ctx.fillRect(x + eyeOffset - eyeSize * 0.6, y - eyeOffset - eyeSize * 0.2, eyeSize * 1.2, eyeSize * 0.4);
    }
    
    drawSurprisedEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojos muy grandes
        this.drawNormalEyes(ctx, x, y, eyeSize * 1.3, eyeOffset);
    }
    
    drawWinkEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojo izquierdo cerrado
        ctx.strokeStyle = this.currentSkin.eyeColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI);
        ctx.stroke();
        
        // Ojo derecho normal
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.currentSkin.eyeColor;
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + eyeOffset + eyeSize * 0.3, y - eyeOffset - eyeSize * 0.3, eyeSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawHeartEyes(ctx, x, y, eyeSize, eyeOffset) {
        ctx.fillStyle = '#FF69B4';
        
        // Corazón izquierdo
        this.drawHeart(ctx, x - eyeOffset, y - eyeOffset, eyeSize);
        // Corazón derecho
        this.drawHeart(ctx, x + eyeOffset, y - eyeOffset, eyeSize);
    }
    
    drawHeart(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.3);
        ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
        ctx.bezierCurveTo(x - size, y + size * 0.7, x, y + size * 1.2, x, y + size * 1.2);
        ctx.bezierCurveTo(x, y + size * 1.2, x + size, y + size * 0.7, x + size, y + size * 0.3);
        ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
        ctx.fill();
    }
    
    drawStarEyes(ctx, x, y, eyeSize, eyeOffset) {
        ctx.fillStyle = '#FFD700';
        
        // Estrella izquierda
        this.drawStar(ctx, x - eyeOffset, y - eyeOffset, eyeSize);
        // Estrella derecha
        this.drawStar(ctx, x + eyeOffset, y - eyeOffset, eyeSize);
    }
    
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x1 = x + Math.cos(angle) * size;
            const y1 = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawDiamondEyes(ctx, x, y, eyeSize, eyeOffset) {
        ctx.fillStyle = '#00FFFF';
        
        // Diamante izquierdo
        this.drawDiamond(ctx, x - eyeOffset, y - eyeOffset, eyeSize);
        // Diamante derecho
        this.drawDiamond(ctx, x + eyeOffset, y - eyeOffset, eyeSize);
    }
    
    drawDiamond(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();
    }
    
    drawFireEyes(ctx, x, y, eyeSize, eyeOffset) {
        // Ojos de fuego con gradiente
        const fireGradient = ctx.createRadialGradient(x - eyeOffset, y - eyeOffset, 0, x - eyeOffset, y - eyeOffset, eyeSize);
        fireGradient.addColorStop(0, '#FFD700');
        fireGradient.addColorStop(1, '#FF4500');
        
        ctx.fillStyle = fireGradient;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    applyBodyTexture(ctx, x, y, size) {
        switch (this.currentSkin.bodyTexture) {
            case 'metallic':
                this.applyMetallicTexture(ctx, x, y, size);
                break;
            case 'crystal':
                this.applyCrystalTexture(ctx, x, y, size);
                break;
            case 'fur':
                this.applyFurTexture(ctx, x, y, size);
                break;
            case 'slime':
                this.applySlimeTexture(ctx, x, y, size);
                break;
            case 'rough':
                this.applyRoughTexture(ctx, x, y, size);
                break;
        }
    }
    
    applyMetallicTexture(ctx, x, y, size) {
        const metalGradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
        metalGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        metalGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        metalGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
        
        ctx.fillStyle = metalGradient;
        ctx.globalCompositeOperation = 'overlay';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
    
    applyCrystalTexture(ctx, x, y, size) {
        // Facetas de cristal
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            ctx.stroke();
        }
    }
    
    applyFurTexture(ctx, x, y, size) {
        // Textura de pelaje con pequeñas líneas
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const startRadius = Math.random() * size * 0.5;
            const endRadius = startRadius + size * 0.1;
            
            const startX = x + Math.cos(angle) * startRadius;
            const startY = y + Math.sin(angle) * startRadius;
            const endX = x + Math.cos(angle) * endRadius;
            const endY = y + Math.sin(angle) * endRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    
    applySlimeTexture(ctx, x, y, size) {
        // Burbujas de slime
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        const bubbles = [
            [x - size * 0.3, y - size * 0.2, size * 0.1],
            [x + size * 0.2, y + size * 0.3, size * 0.08],
            [x - size * 0.1, y + size * 0.1, size * 0.06]
        ];
        
        bubbles.forEach(([bx, by, radius]) => {
            ctx.beginPath();
            ctx.arc(bx, by, radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    applyRoughTexture(ctx, x, y, size) {
        // Textura rugosa con puntos pequeños
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.8;
            const dotX = x + Math.cos(angle) * radius;
            const dotY = y + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    applySkinEffects(ctx, x, y, size) {
        this.currentSkin.effects.forEach(effect => {
            switch (effect) {
                case 'sparkle':
                    this.applySparkleEffect(ctx, x, y, size);
                    break;
                case 'shadow':
                    this.applyShadowEffect(ctx, x, y, size);
                    break;
                case 'outline':
                    this.applyOutlineEffect(ctx, x, y, size);
                    break;
                case 'pulse':
                    this.applyPulseEffect(ctx, x, y, size);
                    break;
                case 'electric':
                    this.applyElectricEffect(ctx, x, y, size);
                    break;
                case 'frost':
                    this.applyFrostEffect(ctx, x, y, size);
                    break;
                case 'toxic':
                    this.applyToxicEffect(ctx, x, y, size);
                    break;
            }
        });
    }
    
    applySparkleEffect(ctx, x, y, size) {
        ctx.fillStyle = '#FFD700';
        
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size;
            const sparkleX = x + Math.cos(angle) * radius;
            const sparkleY = y + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    applyShadowEffect(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(x + 3, y + 3, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    applyOutlineEffect(ctx, x, y, size) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    applyPulseEffect(ctx, x, y, size) {
        // Anillo pulsante (simulado)
        ctx.strokeStyle = this.currentSkin.baseColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    applyElectricEffect(ctx, x, y, size) {
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        
        // Rayos eléctricos
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const startX = x + Math.cos(angle) * size;
            const startY = y + Math.sin(angle) * size;
            const endX = startX + Math.cos(angle) * size * 0.5;
            const endY = startY + Math.sin(angle) * size * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX + Math.random() * 10 - 5, endY + Math.random() * 10 - 5);
            ctx.stroke();
        }
    }
    
    applyFrostEffect(ctx, x, y, size) {
        // Cristales de hielo
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const crystalX = x + Math.cos(angle) * size * 0.8;
            const crystalY = y + Math.sin(angle) * size * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(crystalX, crystalY);
            ctx.lineTo(crystalX + Math.cos(angle) * 5, crystalY + Math.sin(angle) * 5);
            ctx.stroke();
        }
    }
    
    applyToxicEffect(ctx, x, y, size) {
        // Burbujas tóxicas
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        
        for (let i = 0; i < 5; i++) {
            const bubbleX = x + (Math.random() - 0.5) * size * 1.5;
            const bubbleY = y + (Math.random() - 0.5) * size * 1.5;
            const bubbleSize = Math.random() * 3 + 2;
            
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    updateRarityIndicator() {
        const rarityElement = document.getElementById('rarityIndicator');
        const rarityText = rarityElement.querySelector('.rarity-text');
        
        // Calcular rareza basada en características
        let rarityScore = 0;
        
        if (this.currentSkin.pattern !== 'solid') rarityScore += 1;
        if (this.currentSkin.gradient !== 'none') rarityScore += 1;
        if (this.currentSkin.effects.length > 0) rarityScore += this.currentSkin.effects.length;
        if (this.currentSkin.eyeStyle !== 'normal') rarityScore += 1;
        if (this.currentSkin.bodyTexture !== 'smooth') rarityScore += 1;
        if (this.currentSkin.animation !== 'none') rarityScore += 2;
        if (this.currentSkin.glow) rarityScore += 1;
        
        let rarity, className;
        
        if (rarityScore === 0) {
            rarity = 'Común';
            className = 'common';
        } else if (rarityScore <= 2) {
            rarity = 'Poco Común';
            className = 'uncommon';
        } else if (rarityScore <= 4) {
            rarity = 'Raro';
            className = 'rare';
        } else if (rarityScore <= 6) {
            rarity = 'Épico';
            className = 'epic';
        } else {
            rarity = 'Legendario';
            className = 'legendary';
        }
        
        this.currentSkin.rarity = className;
        rarityText.textContent = rarity;
        rarityElement.className = `rarity-indicator ${className}`;
    }
    
    switchTab(tabName) {
        // Desactivar todas las tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Activar tab seleccionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }
    
    resetSkin() {
        this.currentSkin = {
            name: 'Mi Skin Personalizado',
            baseColor: '#FF6B6B',
            secondaryColor: '#4ECDC4',
            pattern: 'solid',
            gradient: 'none',
            effects: [],
            eyeStyle: 'normal',
            eyeColor: '#000000',
            bodyTexture: 'smooth',
            glow: false,
            glowColor: '#FFFFFF',
            animation: 'none',
            rarity: 'common'
        };
        
        this.refreshInterface();
        this.updatePreview();
    }
    
    randomizeSkin() {
        this.currentSkin = {
            name: `Skin Aleatorio ${Math.floor(Math.random() * 1000)}`,
            baseColor: this.getRandomColor(),
            secondaryColor: this.getRandomColor(),
            pattern: this.patterns[Math.floor(Math.random() * this.patterns.length)].id,
            gradient: this.gradients[Math.floor(Math.random() * this.gradients.length)].id,
            effects: this.getRandomEffects(),
            eyeStyle: this.eyeStyles[Math.floor(Math.random() * this.eyeStyles.length)].id,
            eyeColor: this.getRandomColor(),
            bodyTexture: this.bodyTextures[Math.floor(Math.random() * this.bodyTextures.length)].id,
            glow: Math.random() > 0.5,
            glowColor: this.getRandomColor(),
            animation: this.animations[Math.floor(Math.random() * this.animations.length)].id,
            rarity: 'common'
        };
        
        this.refreshInterface();
        this.updatePreview();
    }
    
    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84',
            '#EE5A24', '#0984E3', '#6C5CE7', '#FD79A8'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomEffects() {
        const effects = [];
        const numEffects = Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numEffects; i++) {
            const effect = this.effects[Math.floor(Math.random() * this.effects.length)];
            if (!effects.includes(effect.id)) {
                effects.push(effect.id);
            }
        }
        
        return effects;
    }
    
    refreshInterface() {
        // Actualizar color pickers
        document.getElementById('baseColorPicker').value = this.currentSkin.baseColor;
        document.getElementById('secondaryColorPicker').value = this.currentSkin.secondaryColor;
        document.getElementById('eyeColorPicker').value = this.currentSkin.eyeColor;
        document.getElementById('glowColorPicker').value = this.currentSkin.glowColor;
        document.getElementById('skinName').value = this.currentSkin.name;
        document.getElementById('enableGlow').checked = this.currentSkin.glow;
        
        // Actualizar opciones activas
        this.updateActiveOptions();
    }
    
    updateActiveOptions() {
        // Actualizar gradientes
        document.querySelectorAll('.gradient-option').forEach(option => {
            option.classList.toggle('active', option.dataset.gradient === this.currentSkin.gradient);
        });
        
        // Actualizar patrones
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.classList.toggle('active', option.dataset.pattern === this.currentSkin.pattern);
        });
        
        // Actualizar efectos
        document.querySelectorAll('.effect-option').forEach(option => {
            option.classList.toggle('active', this.currentSkin.effects.includes(option.dataset.effect));
        });
        
        // Actualizar ojos
        document.querySelectorAll('.eye-option').forEach(option => {
            option.classList.toggle('active', option.dataset.eye === this.currentSkin.eyeStyle);
        });
        
        // Actualizar texturas
        document.querySelectorAll('.texture-option').forEach(option => {
            option.classList.toggle('active', option.dataset.texture === this.currentSkin.bodyTexture);
        });
        
        // Actualizar animaciones
        document.querySelectorAll('.animation-option').forEach(option => {
            option.classList.toggle('active', option.dataset.animation === this.currentSkin.animation);
        });
    }
    
    saveSkin() {
        const skinToSave = { ...this.currentSkin };
        skinToSave.id = Date.now().toString();
        skinToSave.createdAt = new Date().toISOString();
        
        this.savedSkins.push(skinToSave);
        this.saveSavedSkins();
        this.updateSavedSkinsDisplay();
        
        if (window.uiManager) {
            window.uiManager.showNotification(`Skin "${skinToSave.name}" guardado exitosamente!`, 'success');
        }
    }
    
    applySkin() {
        if (window.uiManager) {
            // Agregar el skin personalizado a la lista de skins del UIManager
            window.uiManager.skins.push({
                name: this.currentSkin.name,
                color: this.currentSkin.baseColor,
                pattern: this.currentSkin.pattern,
                customSkin: this.currentSkin
            });
            
            // Seleccionar el nuevo skin
            window.uiManager.currentSkin = window.uiManager.skins.length - 1;
            window.uiManager.renderSkinPreview();
            
            window.uiManager.showNotification(`Skin "${this.currentSkin.name}" aplicado!`, 'success');
        }
        
        this.closeSkinLab();
    }
    
    exportSkin() {
        const skinData = JSON.stringify(this.currentSkin, null, 2);
        const blob = new Blob([skinData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentSkin.name.replace(/\s+/g, '_')}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.uiManager) {
            window.uiManager.showNotification('Skin exportado exitosamente!', 'success');
        }
    }
    
    importSkin() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const skinData = JSON.parse(e.target.result);
                    this.currentSkin = { ...skinData };
                    this.refreshInterface();
                    this.updatePreview();
                    
                    if (window.uiManager) {
                        window.uiManager.showNotification('Skin importado exitosamente!', 'success');
                    }
                } catch (error) {
                    if (window.uiManager) {
                        window.uiManager.showNotification('Error al importar skin: archivo inválido', 'error');
                    }
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    loadSavedSkins() {
        const saved = localStorage.getItem('wormworld_saved_skins');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveSavedSkins() {
        localStorage.setItem('wormworld_saved_skins', JSON.stringify(this.savedSkins));
    }
    
    updateSavedSkinsDisplay() {
        const container = document.getElementById('savedSkinsGrid');
        container.innerHTML = '';
        
        this.savedSkins.forEach(skin => {
            const skinElement = document.createElement('div');
            skinElement.className = 'saved-skin-item';
            skinElement.innerHTML = `
                <canvas width="50" height="50"></canvas>
                <span class="skin-name">${skin.name}</span>
                <div class="skin-actions">
                    <button class="load-skin-btn" data-skin-id="${skin.id}">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="delete-skin-btn" data-skin-id="${skin.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Dibujar preview del skin guardado
            const canvas = skinElement.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            this.drawSkinPreview(ctx, skin, 25, 25, 15);
            
            container.appendChild(skinElement);
        });
        
        // Agregar event listeners para los botones
        container.querySelectorAll('.load-skin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skinId = e.target.closest('.load-skin-btn').dataset.skinId;
                this.loadSavedSkin(skinId);
            });
        });
        
        container.querySelectorAll('.delete-skin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skinId = e.target.closest('.delete-skin-btn').dataset.skinId;
                this.deleteSavedSkin(skinId);
            });
        });
    }
    
    drawSkinPreview(ctx, skin, x, y, size) {
        // Versión simplificada del dibujo para previews pequeños
        const tempSkin = this.currentSkin;
        this.currentSkin = skin;
        this.drawCustomSkin(ctx, x, y, size);
        this.currentSkin = tempSkin;
    }
    
    loadSavedSkin(skinId) {
        const skin = this.savedSkins.find(s => s.id === skinId);
        if (skin) {
            this.currentSkin = { ...skin };
            this.refreshInterface();
            this.updatePreview();
            
            if (window.uiManager) {
                window.uiManager.showNotification(`Skin "${skin.name}" cargado!`, 'success');
            }
        }
    }
    
    deleteSavedSkin(skinId) {
        const skinIndex = this.savedSkins.findIndex(s => s.id === skinId);
        if (skinIndex !== -1) {
            const skinName = this.savedSkins[skinIndex].name;
            this.savedSkins.splice(skinIndex, 1);
            this.saveSavedSkins();
            this.updateSavedSkinsDisplay();
            
            if (window.uiManager) {
                window.uiManager.showNotification(`Skin "${skinName}" eliminado`, 'info');
            }
        }
    }
    
    openSkinLab() {
        document.getElementById('skinLabModal').style.display = 'flex';
        this.updateSavedSkinsDisplay();
        this.updatePreview();
    }
    
    closeSkinLab() {
        document.getElementById('skinLabModal').style.display = 'none';
    }
    
    addSkinLabStyles() {
        const styles = `
            <style>
                .skinlab-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    font-family: 'Nunito', sans-serif;
                }
                
                .skinlab-container {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    border-radius: 20px;
                    width: 90%;
                    max-width: 1200px;
                    height: 90%;
                    max-height: 800px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                .skinlab-header {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                }
                
                .skinlab-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                
                .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .skinlab-content {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }
                
                .skinlab-sidebar {
                    width: 300px;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .skin-preview-section {
                    margin-bottom: 30px;
                }
                
                .skin-preview-section h3 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                }
                
                .skin-preview-container {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    margin-bottom: 15px;
                }
                
                #skinPreviewCanvas {
                    border-radius: 10px;
                    background: radial-gradient(circle, #34495e 0%, #2c3e50 100%);
                }
                
                .skin-info input {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.9);
                    font-size: 1rem;
                    margin-bottom: 10px;
                    text-align: center;
                }
                
                .rarity-indicator {
                    padding: 8px 16px;
                    border-radius: 20px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .rarity-indicator.common { background: #95a5a6; color: white; }
                .rarity-indicator.uncommon { background: #27ae60; color: white; }
                .rarity-indicator.rare { background: #3498db; color: white; }
                .rarity-indicator.epic { background: #9b59b6; color: white; }
                .rarity-indicator.legendary { background: #f39c12; color: white; }
                
                .saved-skins-section h3 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                }
                
                .saved-skins-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                
                .saved-skin-item {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 10px;
                    text-align: center;
                    position: relative;
                }
                
                .saved-skin-item canvas {
                    border-radius: 5px;
                    margin-bottom: 5px;
                }
                
                .skin-name {
                    font-size: 0.8rem;
                    color: #ecf0f1;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .skin-actions {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                }
                
                .load-skin-btn, .delete-skin-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                
                .load-skin-btn:hover { background: rgba(52, 152, 219, 0.7); }
                .delete-skin-btn:hover { background: rgba(231, 76, 60, 0.7); }
                
                .skinlab-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .customization-tabs {
                    display: flex;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0 20px;
                }
                
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: #bdc3c7;
                    padding: 15px 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border-bottom: 3px solid transparent;
                }
                
                .tab-btn:hover {
                    color: #ecf0f1;
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .tab-btn.active {
                    color: #3498db;
                    border-bottom-color: #3498db;
                }
                
                .customization-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .tab-content {
                    display: none;
                }
                
                .tab-content.active {
                    display: block;
                }
                
                .color-section {
                    margin-bottom: 30px;
                }
                
                .color-section h4 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                    font-size: 1rem;
                }
                
                .color-picker-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .color-picker-container input[type="color"] {
                    width: 60px;
                    height: 40px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                
                .color-presets {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 8px;
                }
                
                .color-preset {
                    width: 30px;
                    height: 30px;
                    border-radius: 6px;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }
                
                .color-preset:hover {
                    transform: scale(1.1);
                    border-color: white;
                }
                
                .gradient-section h4 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                    font-size: 1rem;
                }
                
                .gradient-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 15px;
                }
                
                .gradient-option {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                
                .gradient-option:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .gradient-option.active {
                    border-color: #3498db;
                    background: rgba(52, 152, 219, 0.2);
                }
                
                .gradient-preview {
                    width: 50px;
                    height: 30px;
                    border-radius: 5px;
                    margin: 0 auto 10px;
                }
                
                .gradient-none { background: #7f8c8d; }
                .gradient-linear { background: linear-gradient(45deg, #e74c3c, #3498db); }
                .gradient-radial { background: radial-gradient(circle, #e74c3c, #3498db); }
                .gradient-conic { background: conic-gradient(#e74c3c, #3498db, #e74c3c); }
                .gradient-diamond { background: linear-gradient(45deg, #e74c3c 25%, #3498db 25%, #3498db 75%, #e74c3c 75%); }
                
                .gradient-option span {
                    color: #ecf0f1;
                    font-size: 0.9rem;
                }
                
                .patterns-grid, .effects-grid, .eyes-grid, .texture-grid, .animation-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                }
                
                .pattern-option, .effect-option, .eye-option, .texture-option, .animation-option {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    position: relative;
                }
                
                .pattern-option:hover, .effect-option:hover, .eye-option:hover, 
                .texture-option:hover, .animation-option:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                
                .pattern-option.active, .effect-option.active, .eye-option.active, 
                .texture-option.active, .animation-option.active {
                    border-color: #3498db;
                    background: rgba(52, 152, 219, 0.2);
                }
                
                .pattern-preview, .effect-preview, .eye-preview, .texture-preview, .animation-preview {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    margin: 0 auto 10px;
                    background: #34495e;
                    position: relative;
                }
                
                .premium-icon {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #f39c12;
                    font-size: 0.8rem;
                }
                
                .pattern-option span, .effect-option span, .eye-option span, 
                .texture-option span, .animation-option span {
                    color: #ecf0f1;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                
                .glow-section {
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                
                .glow-section h4 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                }
                
                .glow-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .glow-controls label {
                    color: #ecf0f1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .glow-color-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .eye-color-section {
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                
                .eye-color-section h4 {
                    color: #ecf0f1;
                    margin-bottom: 15px;
                }
                
                .skinlab-footer {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                
                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-primary {
                    background: linear-gradient(45deg, #3498db, #2980b9);
                    color: white;
                }
                
                .btn-primary:hover {
                    background: linear-gradient(45deg, #2980b9, #3498db);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
                }
                
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ecf0f1;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                
                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .skinlab-container {
                        width: 95%;
                        height: 95%;
                    }
                    
                    .skinlab-content {
                        flex-direction: column;
                    }
                    
                    .skinlab-sidebar {
                        width: 100%;
                        max-height: 200px;
                    }
                    
                    .customization-tabs {
                        flex-wrap: wrap;
                    }
                    
                    .tab-btn {
                        flex: 1;
                        min-width: 80px;
                        padding: 10px 5px;
                        font-size: 0.8rem;
                    }
                    
                    .action-buttons {
                        gap: 10px;
                    }
                    
                    .btn-primary, .btn-secondary {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Inicializar SkinLab globalmente
window.skinLab = new SkinLab();