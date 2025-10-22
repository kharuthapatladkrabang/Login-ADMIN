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
        
        this.signupLink = document.querySelector('.neural-signup'); 
        this.formHeader = document.querySelector('.login-header h1');
        this.formSubHeader = document.querySelector('.login-header p');
        this.actionText = document.querySelector('.signup-section span');
        this.currentMode = 'login'; 
        
        // *****************************************************************************************
        // *** URL Web App ที่คุณระบุมา ***
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzHcKp2KppyD66XuIBmKMUTh3jA0ztyzq7Tovm9yTAfqvvJXLAqe2mhaFKpx_5t6EfD/exec'; 
        // *****************************************************************************************

        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupAIEffects();
        this.updateFormMode('login'); 
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
        
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    updateFormMode(mode) {
        this.currentMode = mode;
        this.formHeader.textContent = mode === 'login' ? 'Neural Access' : 'การลงทะเบียนใหม่';
        this.formSubHeader.textContent = mode === 'login' ? 'เชื่อมต่อสู่พื้นที่ทำงาน AI ของคุณ' : 'สร้างรหัสความปลอดภัยสำหรับการเข้าถึง';
        this.submitButton.querySelector('.button-text').textContent = mode === 'login' ? 'เริ่มการเชื่อมต่อ' : 'ลงทะเบียนและยืนยัน';
        this.actionText.textContent = mode === 'login' ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'ลงทะเบียนแล้วใช่หรือไม่? ';
        this.signupLink.textContent = mode === 'login' ? 'เข้าร่วมเครือข่าย' : 'กลับไปที่ล็อกอิน';
        
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        
        this.emailInput.closest('.smart-field').classList.remove('error');
        this.passwordInput.closest('.smart-field').classList.remove('error');
    }

    // ... (ฟังก์ชัน setupPasswordToggle, setupSocialButtons, setupAIEffects, triggerNeuralEffect, validateStudentId, validatePassword, showError, clearError ยังคงเดิม)
    
    // โค้ดที่เหลือจากข้างต้น...
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
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                this.triggerNeuralEffect(e.target.closest('.smart-field'));
            });
        });
    }
    
    triggerNeuralEffect(field) {
        const indicator = field.querySelector('.ai-indicator');
        indicator.style.opacity = '1';
        
        setTimeout(() => {
            indicator.style.opacity = '';
        }, 2000);
    }
    
    validateStudentId() {
        const studentId = this.emailInput.value.trim();
        
        if (!studentId) {
            this.showError('email', 'จำเป็นต้องระบุรหัสนักศึกษา');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'ต้องใช้รหัสความปลอดภัย');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'รหัสความปลอดภัยต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
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
    // สิ้นสุดโค้ดที่คงเดิม
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isStudentIdValid = this.validateStudentId();
        const isPasswordValid = this.validatePassword();
        
        if (!isStudentIdValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true);
        
        const formData = new FormData();
        formData.append('action', this.currentMode); 
        formData.append('studentId', this.emailInput.value.trim()); 
        formData.append('email', this.emailInput.value.trim()); 
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
                    // *** เรียกใช้ฟังก์ชันแสดงผลและส่งข้อมูล Admin ไปแสดง ***
                    this.updateSuccessScreen(result); 
                    this.showNeuralSuccess();
                    
                    setTimeout(() => {
                        console.log(`Neural link established - Redirecting to: ${result.redirectUrl}`);
                        // window.location.href = result.redirectUrl;
                    }, 3200);
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้เลย');
                    this.updateFormMode('login');
                }
                
            } else {
                this.showError('password', result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }

        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            this.showError('password', 'การเชื่อมต่อระบบประสาทล้มเหลว โปรดลองอีกครั้ง');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * ฟังก์ชันใหม่: รับข้อมูล Admin จาก Apps Script และแสดงผลบนหน้า Success
     * @param {object} data - ข้อมูลผลลัพธ์จาก Apps Script ที่มี adminName, studentId, totalLogins, redirectUrl
     */
    updateSuccessScreen(data) {
        document.getElementById('adminWelcome').textContent = `สวัสดี, ${data.adminName}!`;
        document.getElementById('displayStudentId').textContent = data.studentId;
        document.getElementById('displayTotalLogins').textContent = data.totalLogins;
        
        const redirectLink = document.getElementById('displayRedirectLink');
        redirectLink.textContent = `ไปยังระบบ (Link)`;
        redirectLink.href = data.redirectUrl;
    }
    
    async handleSocialLogin(provider, button) {
        // ... (โค้ดเดิม)
        console.log(`Initializing ${provider} connection...`);
        
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
            <span>กำลังเชื่อมต่อ...</span>
            <div class="social-glow"></div>
        `;
        
        button.innerHTML = loadingHTML;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`Redirecting to ${provider} neural interface...`);
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
        
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.5' : '1';
        });
    }
    
    showNeuralSuccess() {
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.neural-social').style.display = 'none';
            document.querySelector('.signup-section').style.display = 'none';
            document.querySelector('.auth-separator').style.display = 'none';
            
            this.successMessage.classList.add('show');
            
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
