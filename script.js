// AI Assistant Login Form JavaScript
class AIAssistantLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.neural-button');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.social-neural');
        
        this.signupLink = document.querySelector('.neural-signup'); // ลิงก์ "Join the network"
        this.formHeader = document.querySelector('.login-header h1');
        this.formSubHeader = document.querySelector('.login-header p');
        this.actionText = document.querySelector('.signup-section span');
        this.currentMode = 'login'; // สถานะเริ่มต้น
        
        // *****************************************************************************************
        // *** สำคัญ: ต้องใส่ URL Web App ที่ได้จากการ Deploy Google Apps Script ที่นี่ ***
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzzIqLDr-zN8F1114kETbsA5Ni3vgcqqKEPP1h6HmV_EiJUfjlCkM84_icLAOF_szgC/exec'; 
        // *****************************************************************************************

        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupAIEffects();
        this.updateFormMode('login'); // ตั้งค่า UI เริ่มต้น
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateStudentId());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        this.signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            const newMode = this.currentMode === 'login' ? 'register' : 'login';
            this.updateFormMode(newMode);
        });
        
        // Add placeholder for label animations
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    updateFormMode(mode) {
        this.currentMode = mode;
        this.formHeader.textContent = mode === 'login' ? 'Neural Access' : 'New Network Access';
        this.formSubHeader.textContent = mode === 'login' ? 'Connect to your AI workspace' : 'Create your security key';
        this.submitButton.querySelector('.button-text').textContent = mode === 'login' ? 'Initialize Connection' : 'Register & Verify';
        this.actionText.textContent = mode === 'login' ? 'New to Neural? ' : 'Already registered? ';
        this.signupLink.textContent = mode === 'login' ? 'Join the network' : 'Back to Login';
        
        // เคลียร์ค่าและข้อความ error
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        
        // รีเซ็ตการแสดงผล
        this.emailInput.closest('.smart-field').classList.remove('error');
        this.passwordInput.closest('.smart-field').classList.remove('error');
    }

    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            this.passwordToggle.classList.toggle('toggle-active', type === 'text');
        });
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = button.querySelector('span').textContent.trim();
                this.handleSocialLogin(provider, button);
            });
        });
    }
    
    setupAIEffects() {
        // Add neural connection effect on input focus
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                this.triggerNeuralEffect(e.target.closest('.smart-field'));
            });
        });
    }
    
    triggerNeuralEffect(field) {
        // Add subtle AI processing effect
        const indicator = field.querySelector('.ai-indicator');
        indicator.style.opacity = '1';
        
        setTimeout(() => {
            indicator.style.opacity = '';
        }, 2000);
    }
    
    validateStudentId() {
        const studentId = this.emailInput.value.trim();
        
        if (!studentId) {
            this.showError('email', 'Student ID is required for access');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Security key required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Security key must be at least 6 characters');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const smartField = document.getElementById(field).closest('.smart-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        smartField.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const smartField = document.getElementById(field).closest('.smart-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        smartField.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isStudentIdValid = this.validateStudentId();
        const isPasswordValid = this.validatePassword();
        
        if (!isStudentIdValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true);
        
        const formData = new FormData();
        // ส่ง action และข้อมูลที่จำเป็นไปให้ Apps Script
        formData.append('action', this.currentMode); 
        formData.append('studentId', this.emailInput.value.trim()); // ใช้ studentId สำหรับการลงทะเบียน
        formData.append('email', this.emailInput.value.trim()); // ส่ง 'email' เดิมไปด้วยสำหรับ doLogin
        formData.append('password', this.passwordInput.value);
        
        try {
            const response = await fetch(this.WEB_APP_URL, {
                method: 'POST',
                body: formData 
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            
            if (result.success) {
                if (this.currentMode === 'login') {
                    // ล็อกอินสำเร็จ
                    this.showNeuralSuccess();
                    
                    setTimeout(() => {
                        console.log(`Neural link established - accessing AI workspace at: ${result.redirectUrl}`);
                        // window.location.href = result.redirectUrl;
                    }, 3200);
                } else {
                    // ลงทะเบียนสำเร็จ: สลับกลับไปหน้าล็อกอิน
                    alert('Registration Successful! You can now log in.');
                    this.updateFormMode('login');
                }
                
            } else {
                // ล็อกอิน/ลงทะเบียนไม่สำเร็จ
                this.showError('password', result.message || `${this.currentMode} failed. Please check details.`);
            }

        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            this.showError('password', 'Neural connection failed. Please retry.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(provider, button) {
        console.log(`Initializing ${provider} connection...`);
        
        // AI-enhanced loading state
        const originalHTML = button.innerHTML;
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        
        const loadingHTML = `
            <div class="social-bg"></div>
            <div style="display: flex; gap: 2px;">
                <div style="width: 3px; height: 12px; background: currentColor; border-radius: 1px; animation: neuralSpinner 1.2s ease-in-out infinite;"></div>
                <div style="width: 3px; height: 12px; background: currentColor; border-radius: 1px; animation: neuralSpinner 1.2s ease-in-out infinite; animation-delay: 0.1s;"></div>
                <div style="width: 3px; height: 12px; background: currentColor; border-radius: 1px; animation: neuralSpinner 1.2s ease-in-out infinite; animation-delay: 0.2s;"></div>
            </div>
            <span>Connecting...</span>
            <div class="social-glow"></div>
        `;
        
        button.innerHTML = loadingHTML;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`Redirecting to ${provider} neural interface...`);
            // window.location.href = `/auth/${provider.toLowerCase().replace(' ', '-')}`;
        } catch (error) {
            console.error(`${provider} connection failed: ${error.message}`);
        } finally {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.innerHTML = originalHTML;
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        
        // Disable social buttons during neural processing
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.5' : '1';
        });
    }
    
    showNeuralSuccess() {
        // Hide form with neural transition
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.neural-social').style.display = 'none';
            document.querySelector('.signup-section').style.display = 'none';
            document.querySelector('.auth-separator').style.display = 'none';
            
            // Show neural success
            this.successMessage.classList.add('show');
            
        }, 300);
    }
}

// Initialize the neural form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
