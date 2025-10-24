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
        this.redirectButtonsContainer = document.getElementById('redirectButtonsContainer'); 
        this.successMessage = document.getElementById('successMessage'); // Success Card
        
        this.mainLoginCard = document.getElementById('mainLoginCard'); // Login Card
        
        // NEW INPUTS: ต้องมั่นใจว่าหา element เจอ
        this.confirmPasswordInput = document.getElementById('confirmPassword'); 
        this.confirmPasswordField = document.getElementById('confirmPasswordField'); 
        
        // iFrame Elements (ถูกเก็บไว้แต่ไม่มีการเรียกใช้)
        this.contentView = document.getElementById('contentView');
        this.contentFrame = document.getElementById('contentFrame');
        this.contentTitle = document.getElementById('contentTitleDisplay'); 
        
        // โลโก้ URLs
        this.LOGIN_LOGO = 'https://img5.pic.in.th/file/secure-sv1/Asset-401.png';
        this.REGISTER_LOGO = 'https://img2.pic.in.th/pic/Asset-101.png';
        this.logoImage = document.getElementById('mainLogoContainer').querySelector('img');
        
        this.formHeader = document.querySelector('.login-header h1');
        this.formSubHeader = document.querySelector('.login-header p');
        this.actionText = document.querySelector('.signup-section span');
        this.currentMode = 'login'; 
        this.redirectUrl = null; 

        // Forgot Password Elements
        this.forgotPasswordLink = document.getElementById('forgotPasswordLink');
        this.forgotPasswordCard1 = document.getElementById('forgotPasswordCard1'); // Step 1 Card
        this.forgotPasswordCard2 = document.getElementById('forgotPasswordCard2'); // Step 2 Card
        this.forgotPasswordForm = document.getElementById('forgotPasswordForm');
        this.resetEmailInput = document.getElementById('resetEmail');
        this.resetPasswordForm = document.getElementById('resetPasswordForm');
        this.resetCodeInput = document.getElementById('resetCode');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInputReset = document.getElementById('confirmPasswordReset'); // Reset Confirm Pass ID
        this.backToLoginLink = document.getElementById('backToLoginLink');
        this.forgotPasswordMessage = document.getElementById('forgotPasswordMessage');
        
        this.tempStudentId = null; 

        // URL Web App ล่าสุด
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx0erdnXHChLGZ0YbDS6clv-v8cogzTnz5u6Y59euxA-guced_-mSH8_yc3YD_E8rof/exec'; 

        this.init();
    }
    
    init() {
        this.loadRememberedCredentials(); 
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupAIEffects();
        this.updateFormMode('login'); 
    }
    
    // โหลดข้อมูลที่จดจำไว้จาก localStorage
    loadRememberedCredentials() {
        const rememberedId = localStorage.getItem('admin_remember_id');
        const rememberedPass = localStorage.getItem('admin_remember_pass');
        const rememberCheckbox = document.getElementById('remember');

        if (rememberedId && rememberedPass) {
            this.emailInput.value = rememberedId;
            this.passwordInput.value = rememberedPass;
            
            if (rememberCheckbox) rememberCheckbox.checked = true; 
            
            this.forceLabelFloat(this.emailInput);
            this.forceLabelFloat(this.passwordInput);
        } else {
             if (rememberCheckbox) rememberCheckbox.checked = false;
             this.emailInput.value = '';
             this.passwordInput.value = '';
             this.forceLabelFloat(this.emailInput, false);
             this.forceLabelFloat(this.passwordInput, false);
        }
    }

    // บันทึกข้อมูลลง localStorage (คงเดิม)
    saveCredentials() {
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem('admin_remember_id', this.emailInput.value.trim());
            localStorage.setItem('admin_remember_pass', this.passwordInput.value);
        } else {
            localStorage.removeItem('admin_remember_id');
            localStorage.removeItem('admin_remember_pass');
        }
    }
    
    // Helper: บังคับให้ Label ลอยขึ้น (คงเดิม)
    forceLabelFloat(inputElement, hasValue = true) {
        const smartField = inputElement.closest('.smart-field');
        if (smartField) {
            if (hasValue && inputElement.value.length > 0) {
                 smartField.classList.add('has-value');
            } else {
                 smartField.classList.remove('has-value');
            }
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateStudentId());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Event input เพื่อจัดการ CSS Label
        [this.emailInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            if (input) { // เช็ค input confirmPasswordInput เพราะมันอาจเป็น null ในโหมด Login
                 input.addEventListener('input', () => {
                     this.clearError(input.id);
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
                 input.addEventListener('blur', () => {
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
            }
        });
        
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
        
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    // UI/Mode Management
    showForgotPasswordStep1() {
        this.mainLoginCard.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        document.querySelector('.signup-section').style.display = 'none';
        this.contentView.style.display = 'none'; 
        
        this.forgotPasswordCard1.style.display = 'block'; // แสดง Step 1 Card
        
        this.clearForgotPasswordErrors();
        this.resetEmailInput.value = '';
        
        document.body.classList.remove('register-mode'); // Force Dark Mode
    }

    showLoginCard() {
        this.forgotPasswordCard1.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.contentView.style.display = 'none'; 
        
        this.mainLoginCard.style.display = 'block';
        document.querySelector('.signup-section').style.display = 'block';
        this.updateFormMode('login');
    }

    updateFormMode(mode) {
        this.currentMode = mode;
        
        // สลับ Style และโลโก้
        if (mode === 'register') {
            document.body.classList.add('register-mode');
            this.logoImage.src = this.REGISTER_LOGO;
            // แสดงช่องยืนยันรหัสผ่าน
            if (this.confirmPasswordField) this.confirmPasswordField.style.display = 'block';
        } else {
            document.body.classList.remove('register-mode');
            this.logoImage.src = this.LOGIN_LOGO;
            // ซ่อนช่องยืนยันรหัสผ่าน
            if (this.confirmPasswordField) this.confirmPasswordField.style.display = 'none';
        }
        
        // Update Header (ใช้คำว่า Admin)
        this.formHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบ Admin' : 'การลงทะเบียน Admin';
        this.formSubHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบผู้ดูแลระบบ' : 'สร้างรหัสความปลอดภัยสำหรับการเข้าถึง';
        this.submitButton.querySelector('.button-text').textContent = mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน';
        
        document.querySelector('.signup-section span').textContent = mode === 'login' ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'ลงทะเบียนแล้วใช่หรือไม่? ';
        this.signupLink.textContent = mode === 'login' ? 'ลงทะเบียน' : 'กลับไปที่ล็อกอิน';

        this.submitButton.style.display = 'flex'; 

        // Clear inputs and errors
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        this.clearError('confirmPassword');
        
        // เคลียร์สถานะ CSS Label และโหลดค่าที่จดจำไว้
        this.emailInput.closest('.smart-field').classList.remove('error', 'has-value');
        this.passwordInput.closest('.smart-field').classList.remove('error', 'has-value');
        const confirmField = this.confirmPasswordInput ? this.confirmPasswordInput.closest('.smart-field') : null;
        if (confirmField) confirmField.classList.remove('error', 'has-value');

        this.loadRememberedCredentials();
    }

    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            
            this.passwordToggle.classList.toggle('toggle-active', isPassword);
        });
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
    
    // Validation สำหรับโหมดลงทะเบียน
    validateRegistration() {
        let isValid = true;
        
        // 1. Validate Student ID (ใช้ ID 'email' สำหรับ error)
        if (!this.validateStudentId()) isValid = false;
        
        // 2. Validate Password (ใช้ ID 'password' สำหรับ error)
        if (!this.validatePassword()) isValid = false;
        
        // 3. Validate Confirm Password (ใช้ ID 'confirmPassword' สำหรับ error)
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (this.currentMode === 'register') {
            if (!confirmPassword) {
                 this.showError('confirmPassword', 'จำเป็นต้องยืนยันรหัสผ่าน');
                 isValid = false;
            } else if (password !== confirmPassword) {
                 this.showError('confirmPassword', 'รหัสผ่านไม่ตรงกัน');
                 isValid = false;
            } else {
                 this.clearError('confirmPassword');
            }
        }
        
        return isValid;
    }

    // Error Management
    showError(field, message) {
        // *** FIX: ปรับปรุงการหา ID สำหรับ Error Targeting ให้แม่นยำขึ้น ***
        let targetFieldId = field;
        
        if (message.includes('รหัสนักศึกษา') || message.includes('ลงทะเบียนไว้แล้ว') || message.includes('สิทธิ์') || field === 'email') {
            targetFieldId = 'email';
        } else if (message.includes('รหัสความปลอดภัย') || message.includes('รหัสผ่านไม่ถูกต้อง') || field === 'password') {
            targetFieldId = 'password';
        } else if (field === 'confirmPasswordReset') {
             targetFieldId = 'confirmPasswordReset'; // สำหรับหน้า Forgot Step 2
        } else if (field === 'confirmPassword') {
             targetFieldId = 'confirmPassword'; // สำหรับหน้า Register
        }

        const inputElement = document.getElementById(targetFieldId);
        if (!inputElement) return;

        const smartField = inputElement.closest('.smart-field');
        const errorElement = document.getElementById(`${targetFieldId}Error`);
        
        if (smartField && errorElement) {
             smartField.classList.add('error');
             errorElement.textContent = message;
             errorElement.classList.add('show');
        }
    }
    
    clearError(field) {
        const inputElement = document.getElementById(field);
        if (!inputElement) return;
        
        const smartField = inputElement.closest('.smart-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        if (smartField && errorElement) {
            smartField.classList.remove('error');
            errorElement.classList.remove('show');
            setTimeout(() => {
                errorElement.textContent = '';
            }, 200);
        }
    }
    
    clearForgotPasswordErrors() {
        this.clearError('resetEmail');
        this.clearError('resetCode');
        this.clearError('newPassword');
        this.clearError('confirmPasswordReset');
    }

    // AIEffects/Loading (คงเดิม)
    setupAIEffects() {
        // ต้องตรวจสอบ confirmPasswordInput ก่อนใช้
        const inputsToTrack = [this.emailInput, this.passwordInput, this.resetEmailInput, this.resetCodeInput, this.newPasswordInput, this.confirmPasswordInputReset];
        if (this.confirmPasswordInput) inputsToTrack.push(this.confirmPasswordInput); 

        inputsToTrack.forEach(input => {
            if(input) {
                input.addEventListener('focus', (e) => {
                    this.triggerNeuralEffect(e.target.closest('.smart-field'));
                });
            }
        });
    }
    
    triggerNeuralEffect(field) {
        const indicator = field ? field.querySelector('.ai-indicator') : null;
        if(indicator) {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '';
            }, 2000);
        }
    }

    setLoading(loading, button = this.submitButton) {
        button.classList.toggle('loading', loading);
        button.disabled = loading;
    }
    
    // Core Form Submission
    async handleSubmit(e) {
        e.preventDefault();
        
        // *** FIX: ใช้ validateRegistration สำหรับโหมด Register ***
        if (this.currentMode === 'register' && !this.validateRegistration()) {
            return;
        } else if (this.currentMode === 'login' && (!this.validateStudentId() || !this.validatePassword())) {
            return;
        }

        const submitButton = this.submitButton;
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
                    this.saveCredentials(); // บันทึกข้อมูลเมื่อล็อกอินสำเร็จ
                    
                    if (result.adminName) {
                        this.updateSuccessScreen(result); 
                        this.showNeuralSuccess(); // แสดงหน้า Success
                    } else {
                        this.showError('password', 'การเข้าสู่ระบบสำเร็จ แต่ไม่สามารถดึงข้อมูล Admin ได้');
                    }
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้แล้ว');
                    this.updateFormMode('login');
                }
            } else {
                // *** FIX: แสดง Error ตามประเภทที่มาจาก Apps Script ***
                let targetField = 'password';
                if (result.message.includes('รหัสนักศึกษา') || result.message.includes('ลงทะเบียนไว้แล้ว') || result.message.includes('สิทธิ์')) {
                    targetField = 'email';
                }
                
                this.showError(targetField, result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }
        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            this.showError('password', 'การเชื่อมต่อระบบล้มเหลว (Network Error)'); 
        } finally {
            this.setLoading(false, submitButton);
        }
    }

    // -----------------------------------------------------------
    // --- Forgot Password Handlers (มีการเปลี่ยน ID) ---
    // -----------------------------------------------------------

    async handleSendResetCode(e) {
        e.preventDefault();
        const submitButton = document.getElementById('sendResetCodeButton');
        const studentId = this.resetEmailInput.value.trim();
        this.tempStudentId = studentId;

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
                this.forgotPasswordCard1.style.display = 'none'; // ซ่อน Step 1
                this.forgotPasswordCard2.style.display = 'block'; // แสดง Step 2
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
        const confirmPassword = this.confirmPasswordInputReset.value; // ใช้ ID ที่ถูกต้อง
        
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
            this.showError('confirmPasswordReset', 'รหัสผ่านใหม่ไม่ตรงกัน'); // ใช้ ID ที่ถูกต้อง
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
                this.showError('confirmPasswordReset', result.message); // ใช้ ID ที่ถูกต้อง
            }
        } catch (error) {
            this.showError('confirmPasswordReset', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'); // ใช้ ID ที่ถูกต้อง
        } finally {
            this.setLoading(false, submitButton);
        }
    }
    
    // Display Functions
    updateSuccessScreen(data) {
        const adminName = data.adminName || 'Admin';
        const links = data.redirectButtons || []; 

        document.getElementById('adminWelcome').textContent = `สวัสดี, ${adminName}!`;
        document.getElementById('displayStudentId').textContent = data.studentId;
        document.getElementById('displayTotalLogins').textContent = data.totalLogins;

        // สร้างปุ่มลิงก์ตามจำนวนที่ได้รับ
        this.redirectButtonsContainer.innerHTML = '';
        
        if (links.length === 0) {
            this.redirectButtonsContainer.innerHTML = '<p style="color: #ef4444; margin-top: 10px;">ไม่พบลิงก์สำหรับ Admin</p>';
            return;
        }
        
        links.forEach((buttonData, index) => {
            const buttonText = buttonData.name; // ใช้ชื่อปุ่มจาก Apps Script (ชีต 2 แถว 1)
            const link = buttonData.link;
            
            const newButton = document.createElement('button');
            newButton.className = 'neural-button';
            newButton.type = 'button';
            newButton.style.marginTop = '0px';
            
            newButton.innerHTML = `
                <div class="button-bg"></div>
                <span class="button-text">${buttonText}</span>
                <div class="button-glow"></div>
            `;

            newButton.addEventListener('click', () => {
                // เปิดแท็บใหม่ (หน้าเว็บปลายทางแสดงผลเหมือนเดิม)
                window.open(link, '_blank');
            });
            
            // ใช้ style margin เพื่อควบคุมระยะห่าง (เพื่อให้สอดคล้องกับ gap 5px)
            if (index > 0) {
                newButton.style.marginTop = '5px'; 
            }
            
            this.redirectButtonsContainer.appendChild(newButton);
        });
    }
    
    showNeuralSuccess() {
        // ซ่อน Login/Forgot Cards ทั้งหมด
        this.mainLoginCard.style.display = 'none'; 
        this.forgotPasswordCard1.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        
        // แสดง Success Card
        document.querySelector('.signup-section').style.display = 'none';
        this.successMessage.classList.add('show');
        this.successMessage.style.display = 'block'; 
        
        // ซ่อน iframe container ที่ไม่ได้ใช้
        this.contentView.style.display = 'none'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
