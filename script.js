// Login Form JavaScript
class AIAssistantLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email'); 
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.neural-button'); // ปุ่ม Login หลัก
        this.signupLink = document.getElementById('signupLink'); // ลิงก์ลงทะเบียน (แก้ไข)
        this.adminRedirectButton = document.getElementById('adminRedirectButton'); // ปุ่ม Redirect Admin
        this.successMessage = document.getElementById('successMessage');
        
        this.formHeader = document.querySelector('.login-header h1');
        this.formSubHeader = document.querySelector('.login-header p');
        this.actionText = document.querySelector('.signup-section span');
        this.currentMode = 'login'; 
        this.redirectUrl = null; 

        // URL Web App ล่าสุดที่คุณให้มา
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzHcKp2KppyD66XuIBmKMUTh3jA0ztyzq7Tovm9yTAfqvvJXLAqe2mhaFKpx_5t6EfD/exec'; 

        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupAIEffects();
        this.updateFormMode('login'); 
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateStudentId());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // *** แก้ไข: ผูก Event กับลิงก์ signupLink โดยตรง ***
        this.signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            const newMode = this.currentMode === 'login' ? 'register' : 'login';
            this.updateFormMode(newMode);
        });
        
        // ผูก Event กับปุ่ม "ไปยังหน้าสำหรับ Admin"
        this.adminRedirectButton.addEventListener('click', () => {
            if (this.redirectUrl) {
                console.log(`Redirecting to Admin page: ${this.redirectUrl}`);
                window.location.href = this.redirectUrl;
            } else {
                console.warn('Redirect URL not set. Please log in again.');
            }
        });
        
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    updateFormMode(mode) {
        this.currentMode = mode;
        
        // Update Header
        this.formHeader.textContent = mode === 'login' ? 'ระบบเข้าสู่ระบบ' : 'การลงทะเบียนผู้ดูแลระบบ';
        this.formSubHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบผู้ดูแลระบบ' : 'สร้างรหัสความปลอดภัยสำหรับการเข้าถึง';
        
        // Update Main Button (Submit Button)
        this.submitButton.querySelector('.button-text').textContent = mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน';
        
        // Update Signup/Login Link Text
        document.querySelector('.signup-section span').textContent = mode === 'login' ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'ลงทะเบียนแล้วใช่หรือไม่? ';
        this.signupLink.textContent = mode === 'login' ? 'ลงทะเบียน' : 'กลับไปที่ล็อกอิน';

        this.submitButton.style.display = 'flex'; // ปุ่มหลักแสดงเสมอ

        // Clear inputs and errors
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        
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
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = this.submitButton;

        const isStudentIdValid = this.validateStudentId();
        const isPasswordValid = this.validatePassword();
        
        if (!isStudentIdValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true, submitButton);
        
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
                    this.updateSuccessScreen(result); 
                    this.showNeuralSuccess();
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้เลย');
                    this.updateFormMode('login');
                }
                
            } else {
                this.showError('password', result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }

        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            this.showError('password', 'การเชื่อมต่อระบบล้มเหลว โปรดลองอีกครั้ง');
        } finally {
            this.setLoading(false, submitButton);
        }
    }

    /**
     * อัปเดตข้อมูลบนหน้า Success และเก็บ URL สำหรับปุ่ม Redirect
     */
    updateSuccessScreen(data) {
        this.redirectUrl = data.redirectUrl; // เก็บ URL ในคลาส
        
        document.getElementById('adminWelcome').textContent = `สวัสดี, ${data.adminName}!`;
        document.getElementById('displayStudentId').textContent = data.studentId;
        document.getElementById('displayTotalLogins').textContent = data.totalLogins;
    }
    
    setLoading(loading, button = this.submitButton) {
        button.classList.toggle('loading', loading);
        button.disabled = loading;
    }
    
    showNeuralSuccess() {
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.signup-section').style.display = 'none';
            
            this.successMessage.classList.add('show');
            
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
