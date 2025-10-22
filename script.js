// Login Form JavaScript
class AIAssistantLoginForm {
    constructor() {
        // Main Login Elements
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email'); 
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.neural-button'); 
        this.signupLink = document.getElementById('signupLink');
        this.adminRedirectButton = document.getElementById('adminRedirectButton');
        this.successMessage = document.getElementById('successMessage');
        
        this.formHeader = document.querySelector('.login-header h1');
        this.formSubHeader = document.querySelector('.login-header p');
        this.actionText = document.querySelector('.signup-section span');
        this.currentMode = 'login'; 
        this.redirectUrl = null; 

        // Forgot Password Elements
        this.forgotPasswordLink = document.getElementById('forgotPasswordLink');
        this.forgotPasswordContainer = document.getElementById('forgotPasswordContainer');
        this.mainLoginCard = document.getElementById('mainLoginCard');
        this.forgotPasswordForm = document.getElementById('forgotPasswordForm');
        this.resetEmailInput = document.getElementById('resetEmail');
        this.resetPasswordStep2 = document.getElementById('resetPasswordStep2');
        this.resetPasswordForm = document.getElementById('resetPasswordForm');
        this.resetCodeInput = document.getElementById('resetCode');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.backToLoginLink = document.getElementById('backToLoginLink');
        this.forgotPasswordMessage = document.getElementById('forgotPasswordMessage');
        
        this.tempStudentId = null; // เก็บ Student ID ชั่วคราวสำหรับการรีเซ็ต

        // URL Web App ล่าสุด
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzNGFqLH-uku2dYhNw_NN389wltN3djAYlPKfWVBgfYDmR5_WnUfjdbAZSK-ZATQUxH/exec'; 

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
        
        // Register/Login Switch
        this.signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            const newMode = this.currentMode === 'login' ? 'register' : 'login';
            this.updateFormMode(newMode);
        });
        
        // Forgot Password Links
        this.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordStep1();
        });

        this.backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginCard();
        });

        // Forgot Password Forms Submission
        this.forgotPasswordForm.addEventListener('submit', (e) => this.handleSendResetCode(e));
        this.resetPasswordForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        
        // Redirect Button
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
    
    // UI/Mode Management
    showForgotPasswordStep1() {
        this.mainLoginCard.style.display = 'none';
        this.forgotPasswordContainer.style.display = 'block';
        this.resetPasswordStep2.style.display = 'none';
        this.forgotPasswordForm.style.display = 'block';
        this.forgotPasswordMessage.textContent = 'กรุณากรอกรหัสนักศึกษาเพื่อรับรหัสรีเซ็ต';
        this.clearForgotPasswordErrors();
        this.resetEmailInput.value = '';
    }

    showLoginCard() {
        this.mainLoginCard.style.display = 'block';
        this.forgotPasswordContainer.style.display = 'none';
        this.updateFormMode('login');
    }

    updateFormMode(mode) {
        this.currentMode = mode;
        
        this.formHeader.textContent = mode === 'login' ? 'ระบบเข้าสู่ระบบ' : 'การลงทะเบียนผู้ดูแลระบบ';
        this.formSubHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบผู้ดูแลระบบ' : 'สร้างรหัสความปลอดภัยสำหรับการเข้าถึง';
        this.submitButton.querySelector('.button-text').textContent = mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน';
        
        document.querySelector('.signup-section span').textContent = mode === 'login' ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'ลงทะเบียนแล้วใช่หรือไม่? ';
        this.signupLink.textContent = mode === 'login' ? 'ลงทะเบียน' : 'กลับไปที่ล็อกอิน';

        this.submitButton.style.display = 'flex'; 

        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        
        this.emailInput.closest('.smart-field').classList.remove('error');
        this.passwordInput.closest('.smart-field').classList.remove('error');
    }

    // Validation Helpers
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

    // Error Management
    showError(field, message) {
        const inputId = field === 'resetEmail' ? 'resetEmail' : field;
        const smartField = document.getElementById(inputId).closest('.smart-field');
        const errorElement = document.getElementById(`${inputId}Error`);
        
        smartField.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const inputId = field === 'resetEmail' ? 'resetEmail' : field;
        const smartField = document.getElementById(inputId).closest('.smart-field');
        const errorElement = document.getElementById(`${inputId}Error`);
        
        smartField.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }
    
    clearForgotPasswordErrors() {
        this.clearError('resetEmail');
        this.clearError('resetCode');
        this.clearError('newPassword');
        this.clearError('confirmPassword');
    }
    
    // Core Form Submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = this.submitButton;

        const isStudentIdValid = this.validateStudentId();
        const isPasswordValid = this.validatePassword();
        
        if (!isStudentIdValid || !isPasswordValid) return;
        
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
            
            if (!response.ok) throw new Error('Network response was not ok');
            
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

    // -----------------------------------------------------------
    // --- Forgot Password Handlers ---
    // -----------------------------------------------------------

    async handleSendResetCode(e) {
        e.preventDefault();
        const submitButton = document.getElementById('sendResetCodeButton');
        const studentId = this.resetEmailInput.value.trim();
        this.tempStudentId = studentId;

        // Simple Validation
        if (!studentId) {
            return this.showError('resetEmail', 'กรุณากรอกรหัสนักศึกษา');
        }
        this.clearError('resetEmail');

        this.setLoading(true, submitButton);

        const formData = new FormData();
        formData.append('action', 'forgot_password');
        formData.append('studentId', studentId);

        try {
            const response = await fetch(this.WEB_APP_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.forgotPasswordMessage.textContent = result.message;
                this.resetPasswordStep2.style.display = 'block';
                this.forgotPasswordForm.style.display = 'none';
            } else {
                this.showError('resetEmail', result.message);
            }
        } catch (error) {
            this.showError('resetEmail', 'เกิดข้อผิดพลาดในการส่งรหัสรีเซ็ต');
        } finally {
            this.setLoading(false, submitButton);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        const submitButton = document.getElementById('confirmResetButton');
        const resetCode = this.resetCodeInput.value.trim();
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        let isValid = true;
        this.clearForgotPasswordErrors();

        if (!resetCode || resetCode.length !== 6 || isNaN(resetCode)) {
            this.showError('resetCode', 'รหัสรีเซ็ตไม่ถูกต้อง (ต้องเป็นตัวเลข 6 หลัก)');
            isValid = false;
        }
        if (newPassword.length < 6) {
            this.showError('newPassword', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            isValid = false;
        }
        if (newPassword !== confirmPassword) {
            this.showError('confirmPassword', 'รหัสผ่านใหม่ไม่ตรงกัน');
            isValid = false;
        }

        if (!isValid) return;

        this.setLoading(true, submitButton);

        const formData = new FormData();
        formData.append('action', 'reset_password');
        formData.append('studentId', this.tempStudentId);
        formData.append('resetCode', resetCode);
        formData.append('newPassword', newPassword);

        try {
            const response = await fetch(this.WEB_APP_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                this.showLoginCard(); // กลับไปหน้า Login
            } else {
                this.showError('confirmPassword', result.message); // แสดงข้อผิดพลาดสุดท้ายที่ตำแหน่งนี้
            }
        } catch (error) {
            this.showError('confirmPassword', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        } finally {
            this.setLoading(false, submitButton);
        }
    }
    
    // Display Functions
    updateSuccessScreen(data) {
        this.redirectUrl = data.redirectUrl; 
        document.getElementById('adminWelcome').textContent = `สวัสดี, ${data.adminName}!`;
        document.getElementById('displayStudentId').textContent = data.studentId;
        document.getElementById('displayTotalLogins').textContent = data.totalLogins;
    }
    
    setLoading(loading, button = this.submitButton) {
        button.classList.toggle('loading', loading);
        button.disabled = loading;
    }
    
    showNeuralSuccess() {
        this.mainLoginCard.style.display = 'none'; // ซ่อน Main Login Card
        this.forgotPasswordContainer.style.display = 'none'; // ซ่อน Forgot Password
        
        // Show success screen
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.display = 'block'; // ให้ container หลักแสดงผล
        document.querySelector('.signup-section').style.display = 'none';
        this.successMessage.classList.add('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
