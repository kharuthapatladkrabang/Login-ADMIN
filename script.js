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
        
        // NEW INPUTS: ต้องประกาศ Input Field ที่ถูกเพิ่มใน Login Form
        this.confirmPasswordInput = document.getElementById('confirmPassword'); 
        this.confirmPasswordField = document.getElementById('confirmPasswordField'); // Field Container
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle'); // Register Toggle ID

        // iFrame Elements
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
        this.resetStep1Message = document.getElementById('resetStep1Message'); // Step 1 Subtitle/Message
        this.resetStep2Message = document.getElementById('resetStep2Message'); // Step 2 Subtitle/Message
        this.newPasswordToggle = document.getElementById('newPasswordToggle'); // Reset New Pass Toggle ID
        this.confirmPasswordResetToggle = document.getElementById('confirmPasswordResetToggle'); // Reset Confirm Pass Toggle ID
        
        this.tempStudentId = null; 

        // URL Web App ล่าสุด
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwRxWfDBZ9mIigSkyhR2BYGC1zdjNX1iL5KWAanEXmXBvFXIyUpa8kDoGdWAIEsG_8T/exec'; 

        // NEW: Loading Overlay Elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.progressBar = document.getElementById('loginProgressBar');
        this.percentageDisplay = document.getElementById('loadingPercentage');
        this.loadingTextDisplay = document.querySelector('.loading-box .loading-text'); 
        
        // ตัวแปรสำหรับควบคุมการโหลด
        this.isSimulatingLoad = false;
        this.progressInterval = null;
        this.errorTimeout = null; // สำหรับควบคุมการซ่อน Error อัตโนมัติ

        this.init();
    }
    
    init() {
        this.loadRememberedCredentials(); 
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupAIEffects();
        this.updateFormMode('login'); 
    }
    
    // โหลดข้อมูลที่จดจำไว้จาก localStorage (คงเดิม)
    loadRememberedCredentials() {
        const rememberedId = localStorage.getItem('admin_remember_id');
        const rememberedPass = localStorage.getItem('admin_remember_pass');
        const rememberCheckbox = document.getElementById('remember');

        if (rememberedId && rememberedPass) {
            this.emailInput.value = rememberedId;
            this.passwordInput.value = rememberedPass;
            
            this.forceLabelFloat(this.emailInput);
            this.forceLabelFloat(this.passwordInput);
            
            // Note: ต้องตรวจสอบ checkbox ก่อนใช้
            if (rememberCheckbox) rememberCheckbox.checked = true; 
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
        
        // Event input สำหรับฟอร์มหลักและ Register (ยังคงให้เคลียร์ error เมื่อพิมพ์)
        [this.emailInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            if (input) { 
                 input.addEventListener('input', () => {
                     this.clearError(input.id);
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
                 input.addEventListener('blur', () => {
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
            }
        });
        
        // Event input และ blur สำหรับฟอร์ม Forgot Password (Step 1 และ Step 2)
        // *** ยืนยัน: ลบ this.clearError(input.id); ออกเพื่อให้ Error ค้างไว้ตามคำขอ ***
        [this.resetEmailInput, this.resetCodeInput, this.newPasswordInput, this.confirmPasswordInputReset].forEach(input => {
            if (input) { 
                 input.addEventListener('input', () => {
                     this.clearError(input.id); // แก้ไข: เพิ่ม clearError เพื่อให้หายเมื่อพิมพ์
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
                 input.addEventListener('blur', () => {
                     this.forceLabelFloat(input, input.value.length > 0);
                 });
            }
        });

        // Register/Login Switch (คงเดิม)
        this.signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            const newMode = this.currentMode === 'login' ? 'register' : 'login';
            this.updateFormMode(newMode);
        });
        
        // Forgot Password Links (คงเดิม)
        this.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordStep1();
        });

        this.backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginCard();
        });

        // Forgot Password Forms Submission (คงเดิม)
        this.forgotPasswordForm.addEventListener('submit', (e) => this.handleSendResetCode(e));
        this.resetPasswordForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    // NEW: Function to show/hide loading popup
    toggleLoadingOverlay(show) {
        if (show) {
            this.loadingOverlay.classList.add('show');
        } else {
            this.loadingOverlay.classList.remove('show');
            // Reset Progress Bar
            this.updateProgressBar(0);
        }
    }
    
    // NEW: Function to update loading status text
    updateLoadingText(text) {
        if (this.loadingTextDisplay) {
            this.loadingTextDisplay.textContent = text;
        }
    }

    // NEW: Function to update progress bar and percentage (using CSS Variable)
    updateProgressBar(percentage) {
        // ต้องมั่นใจว่าไฟล์ style.css มี --progress-width: 0%; และ width: var(--progress-width); ใน .loader:after
        this.progressBar.style.setProperty('--progress-width', `${percentage}%`);
        this.percentageDisplay.textContent = `${percentage}%`;
    }
    
    // NEW: Simulation function (Progress Bar Start% -> Target% ตามเวลาที่กำหนด)
    simulateLoad(targetProgress, durationInSeconds = 0.5) {
        return new Promise(resolve => {
            // หยุดการวิ่งก่อนหน้า
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
            
            const startProgress = parseFloat(this.progressBar.style.getPropertyValue('--progress-width')) || 0;
            const difference = targetProgress - startProgress;

            if (difference <= 0) {
                 this.updateProgressBar(targetProgress);
                 return resolve();
            }

            let startTime = performance.now();
            const endTime = startTime + (durationInSeconds * 1000);

            // ความถี่ในการอัปเดต (เพื่อความราบรื่น)
            const intervalDuration = 20; 

            this.progressInterval = setInterval(() => {
                const currentTime = performance.now();
                const timeRatio = (currentTime - startTime) / (durationInSeconds * 1000);
                
                let newProgress = startProgress + (difference * timeRatio);
                
                if (newProgress >= targetProgress) {
                    newProgress = targetProgress; 
                    clearInterval(this.progressInterval);
                    this.updateProgressBar(targetProgress);
                    return resolve(); 
                }
                
                this.updateProgressBar(Math.floor(newProgress));

            }, intervalDuration); 
        });
    }

    // NEW: ฟังก์ชันสำหรับแสดง Error แบบถาวร 20 วินาที
    showPermanentError(field, message, duration = 20000) {
        // 1. เรียกใช้ showError เดิมเพื่อแสดงผลทันที
        this.showError(field, message);

        // 2. หากมี Timeout เก่าอยู่ ให้ยกเลิกก่อน
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }

        const inputElement = document.getElementById(field);
        const smartField = inputElement ? inputElement.closest('.smart-field') : null;
        
        if (smartField) {
            // 3. กำหนด timeout เพื่อซ่อน Error อัตโนมัติ (เป็น Fallback)
            this.errorTimeout = setTimeout(() => {
                this.clearError(field);
            }, duration);
            
            // 4. Note: Error จะหายไปทันทีเมื่อผู้ใช้เริ่มพิมพ์ (input event) หรือส่งฟอร์มใหม่
        }
    }


    // UI/Mode Management
    showForgotPasswordStep1() {
        this.mainLoginCard.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        document.querySelector('.signup-section').style.display = 'none';
        this.contentView.style.display = 'none'; 
        
        this.forgotPasswordCard1.style.display = 'block'; // แสดง Step 1 Card
        
        // อัปเดตข้อความหัวข้อ
        this.forgotPasswordCard1.querySelector('.login-header h2').textContent = 'รีเซ็ตรหัสผ่าน'; 
        this.resetStep1Message.textContent = 'กรุณากรอกรหัสนักศึกษาเพื่อรับรหัสรีเซ็ต';
        
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
        
        // Update Header
        this.formHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบ Admin' : 'ลงทะเบียน Admin';
        this.formSubHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบผู้ดูแลระบบ' : 'สร้างรหัสความปลอดภัยสำหรับการเข้าถึง';
        this.submitButton.querySelector('span').textContent = mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน';
        
        document.querySelector('.signup-section span').textContent = mode === 'login' ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'ลงทะเบียนแล้วใช่หรือไม่? ';
        this.signupLink.textContent = mode === 'login' ? 'ลงทะเบียน' : 'กลับไปที่ล็อกอิน';

        this.submitButton.style.display = 'flex'; 

        // Clear inputs and errors
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.clearError('email');
        this.clearError('password');
        this.clearError('confirmPassword'); // เคลียร์ช่องยืนยันรหัสผ่าน (ถ้ามี)
        
        // เคลียร์สถานะ CSS Label และโหลดค่าที่จดจำไว้
        this.emailInput.closest('.smart-field').classList.remove('error', 'has-value');
        this.passwordInput.closest('.smart-field').classList.remove('error', 'has-value');
        const confirmField = this.confirmPasswordInput ? this.confirmPasswordInput.closest('.smart-field') : null;
        if (confirmField) confirmField.classList.remove('error', 'has-value');

        this.loadRememberedCredentials();
    }

    setupPasswordToggle() {
        // 1. ช่องรหัสผ่านหลัก
        this.passwordToggle.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            this.passwordToggle.classList.toggle('toggle-active', isPassword);
        });
        
        // 2. ช่องยืนยันรหัสผ่าน (Register Form)
        const confirmToggle = document.getElementById('confirmPasswordToggle');
        if (confirmToggle && this.confirmPasswordInput) {
             confirmToggle.addEventListener('click', () => {
                 const isPassword = this.confirmPasswordInput.type === 'password';
                 this.confirmPasswordInput.type = isPassword ? 'text' : 'password';
                 confirmToggle.classList.toggle('toggle-active', isPassword);
             });
        }
        
        // 3. ช่องรหัสผ่านใหม่ (Reset Form)
        if (this.newPasswordInput && document.getElementById('newPasswordToggle')) {
            document.getElementById('newPasswordToggle').addEventListener('click', () => {
                 const isPassword = this.newPasswordInput.type === 'password';
                 this.newPasswordInput.type = isPassword ? 'text' : 'password';
                 document.getElementById('newPasswordToggle').classList.toggle('toggle-active', isPassword);
            });
        }
        
        // 4. ช่องยืนยันรหัสผ่านใหม่ (Reset Form)
        if (this.confirmPasswordInputReset && document.getElementById('confirmPasswordResetToggle')) {
             document.getElementById('confirmPasswordResetToggle').addEventListener('click', () => {
                 const isPassword = this.confirmPasswordInputReset.type === 'password';
                 this.confirmPasswordInputReset.type = isPassword ? 'text' : 'password';
                 this.confirmPasswordResetToggle.classList.toggle('toggle-active', isPassword);
            });
        }
    }

    // Validation Helpers
    validateStudentId() {
        const studentId = this.emailInput.value.trim();
        if (!studentId) {
            this.showPermanentError('email', 'จำเป็นต้องระบุรหัสนักศึกษา');
            return false;
        }
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showPermanentError('password', 'ต้องใช้รหัสความปลอดภัย');
            return false;
        }
        if (password.length < 6) {
            this.showPermanentError('password', 'รหัสความปลอดภัยต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return false;
        }
        this.clearError('password');
        return true;
    }
    
    // Validation สำหรับโหมดลงทะเบียน
    validateRegistration() {
        let isValid = true;
        
        if (!this.validateStudentId()) isValid = false;
        if (!this.validatePassword()) isValid = false;
        
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (this.currentMode === 'register') {
            if (!confirmPassword) {
                 this.showPermanentError('confirmPassword', 'จำเป็นต้องยืนยันรหัสผ่าน');
                 isValid = false;
            } else if (password !== confirmPassword) {
                 this.showPermanentError('confirmPassword', 'รหัสผ่านไม่ตรงกัน');
                 isValid = false;
            } else {
                 this.clearError('confirmPassword');
            }
        }
        
        return isValid;
    }

    // Error Management
    showError(field, message) {
        // *** แก้ไขการหา Target ID ให้ครอบคลุมที่สุด ***
        let targetFieldId = field;
        
        // Logic เพื่อแมปข้อความ Error จาก GAS ไปยัง Field ID ที่ถูกต้อง
        if (message.includes('รหัสนักศึกษา') || message.includes('ไม่พบบัญชี') || message.includes('สิทธิ์')) {
            // ใช้ 'resetEmail' สำหรับหน้า Forgot Password, 'email' สำหรับหน้า Login/Register
            targetFieldId = document.getElementById('resetEmail') && document.getElementById('forgotPasswordCard1').style.display !== 'none' ? 'resetEmail' : 'email';
        } else if (message.includes('รหัสความปลอดภัย') || message.includes('รหัสผ่านไม่ถูกต้อง')) {
            targetFieldId = 'password';
        } else if (message.includes('รหัสรีเซ็ต') || message.includes('หมดอายุ')) {
            targetFieldId = 'resetCode';
        } else if (message.includes('รหัสผ่านใหม่ไม่ตรงกัน')) {
             targetFieldId = 'confirmPasswordReset';
        }

        const inputElement = document.getElementById(targetFieldId);
        
        // 1. ปิด Pop-up (สำคัญมากสำหรับการแสดง Error)
        this.toggleLoadingOverlay(false);
        
        // 2. ถ้าหา input element ไม่เจอ (เช่น field เป็น 'password' แต่เราอยู่ในหน้า Forgot Password Step 1) ให้ออก
        if (!inputElement) {
             console.error(`Error: Could not find input element for field ID: ${targetFieldId}`);
             return;
        }

        const smartField = inputElement.closest('.smart-field');
        const errorElement = document.getElementById(`${targetFieldId}Error`);
        
        if (smartField && errorElement) {
             // 3. เคลียร์ error เก่าที่เคยแสดงในฟอร์มนั้นๆ ก่อนแสดงอันใหม่
             if (smartField.form) {
                 this.clearAllErrorsInForm(smartField.form);
             } else {
                 // ถ้า form หายไป อาจเป็นปัญหาที่โครงสร้าง HTML แต่ยังคงแสดง error เฉพาะ field นั้น
                 this.clearError(targetFieldId);
             } 

             // 4. แสดง Error ใหม่
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
        
        // ยกเลิก timeout การซ่อนอัตโนมัติเมื่อมีการ clear Error
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = null;
        }
        
        if (smartField && errorElement) {
            smartField.classList.remove('error');
            errorElement.classList.remove('show');
            // ลบข้อความออกจาก DOM แต่ปล่อยให้ field.classList.remove('error') จัดการการซ่อน
            setTimeout(() => {
                errorElement.textContent = '';
            }, 200); 
        }
    }
    
    clearAllErrorsInForm(formElement) {
        if (!formElement) return;
        const errorFields = formElement.querySelectorAll('.smart-field.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            const errorSpan = field.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.classList.remove('show');
                errorSpan.textContent = '';
            }
        });
    }

    clearForgotPasswordErrors() {
        this.clearError('resetEmail');
        this.clearError('resetCode');
        this.clearError('newPassword');
        this.clearError('confirmPasswordReset');
    }

    // AIEffects/Loading (คงเดิม)
    setupAIEffects() {
        const inputsToTrack = [this.emailInput, this.passwordInput, this.resetEmailInput, this.resetCodeInput, this.newPasswordInput, this.confirmPasswordInputReset];
        if (this.confirmPasswordInput) inputsToTrack.push(this.confirmPasswordInput); 

        inputsToTrack.forEach(input => {
            if(input) {
                // ผูก event input กับ clearError
                 input.addEventListener('input', () => {
                     this.clearError(input.id);
                 });
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
        e.preventDefault(); // *** สำคัญที่สุด: หยุดการรีเฟรชหน้าจอเสมอ ***
        
        // 1. ตรวจสอบความถูกต้องของ Input ก่อนส่ง API (Client-side validation)
        // ถ้า Validation ไม่ผ่าน showPermanentError จะถูกเรียก และ return ทันที
        if (this.currentMode === 'register' && !this.validateRegistration()) {
            return;
        } else if (this.currentMode === 'login' && (!this.validateStudentId() || !this.validatePassword())) {
            return;
        }

        const submitButton = this.submitButton;
        this.setLoading(true, submitButton);
        
        const formData = new FormData();
        formData.append('action', this.currentMode === 'login' ? 'admin_login_only_sheet3' : 'register'); 
        formData.append('studentId', this.emailInput.value.trim()); 
        formData.append('email', this.emailInput.value.trim()); 
        formData.append('password', this.passwordInput.value);
        
        try {
            // --- PHASE 1 START: ตรวจสอบบัญชี (0% -> 60%) ---
            this.updateLoadingText('กำลังตรวจสอบบัญชี...');
            this.toggleLoadingOverlay(true);
            
            // Progress Bar วิ่งทันทีที่เริ่มส่งคำขอ (0% -> 60%) ภายใน 3 วินาที
            await this.simulateLoad(60, 3); 
            
            // 2. ส่ง API Call ไปยัง Google Apps Script (GAS) เพื่อตรวจสอบสิทธิ์
            const response = await fetch(this.WEB_APP_URL, {
                method: 'POST',
                body: formData 
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const result = await response.json();
            
            if (result.success) {
                // --- PHASE 2 START: เข้าสู่ระบบและโหลดเมนู (60% -> 100%) ---
                
                this.updateLoadingText('กำลังเข้าสู่ระบบ...');
                // Progress Bar วิ่งต่อเนื่องจาก 60% ไปจนถึง 100% ภายใน 2 วินาที
                await this.simulateLoad(100, 2); 
                
                // 4. แสดงหน้า Success
                this.updateLoadingText('เข้าสู่ระบบสำเร็จ กำลังนำไปสู่เมนู Admin...'); 
                
                if (this.currentMode === 'login') {
                    this.saveCredentials(); 
                    
                    if (result.adminName) {
                        await new Promise(r => setTimeout(r, 500)); // หน่วงเวลาให้ผู้ใช้เห็น 100% แว็บหนึ่ง
                        
                        this.updateSuccessScreen(result); 
                        this.showNeuralSuccess(); 
                    } else {
                        this.showPermanentError('password', result.message || 'การเข้าสู่ระบบสำเร็จ แต่ไม่สามารถดึงข้อมูล Admin ได้');
                    }
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้แล้ว');
                    this.updateFormMode('login');
                }
            } else {
                // 5. ล็อกอินไม่สำเร็จ: แสดง Error ทันที (Pop-up จะถูกปิดใน showError)
                let targetField = 'password';
                if (result.message.includes('รหัสนักศึกษา') || result.message.includes('ไม่พบบัญชี') || result.message.includes('สิทธิ์')) {
                    targetField = 'email';
                }
                
                // ใช้ showPermanentError สำหรับ Error ที่มาจาก Server
                this.showPermanentError(targetField, result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }
        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            // แสดง Error หากเกิดปัญหาเครือข่าย/เซิร์ฟเวอร์
            this.showPermanentError('password', 'การเชื่อมต่อระบบล้มเหลว (Network Error)'); 
        } finally {
            this.setLoading(false, submitButton);
            this.toggleLoadingOverlay(false); // ปิด Pop-up (ใช้เป็น Fallback)
        }
    }

    // -----------------------------------------------------------
    // --- Forgot Password Handlers ---
    // -----------------------------------------------------------

    async handleSendResetCode(e) {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าจอ

        const submitButton = document.getElementById('sendResetCodeButton');
        const studentId = this.resetEmailInput.value.trim();
        this.tempStudentId = studentId;

        // *** VALIDATION: ตรวจสอบว่ากรอกรหัสนักศึกษาหรือไม่ ***
        if (!studentId) {
            // แสดง Error ถาวร (Client-side)
            this.showPermanentError('resetEmail', 'จำเป็นต้องระบุรหัสนักศึกษา');
            return;
        }
        // *******************************************************
        
        // FIX: ล้าง Error เฉพาะ Client-side ก่อนส่ง Server
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
                // *** FIX: แสดงข้อความ Success ใน p tag ของ Step 1 (แล้วย้ายไป Step 2) ***
                this.resetStep2Message.textContent = result.message; 
                this.forgotPasswordCard1.style.display = 'none'; // ซ่อน Step 1
                this.forgotPasswordCard2.style.display = 'block'; // แสดง Step 2
                
                // Clear inputs ใน Step 2
                this.resetCodeInput.value = '';
                this.newPasswordInput.value = '';
                this.confirmPasswordInputReset.value = '';

                // อัปเดตหัวข้อ Step 2
                this.forgotPasswordCard2.querySelector('.login-header h2').textContent = 'รีเซ็ตรหัสผ่าน';

            } else {
                // *** FIX: แสดง Error ใน input field ของ Step 1 ***
                // Backend ส่งข้อความ: 'ไม่พบบัญชีนี้ในระบบ กรุณาตรวจสอบรหัสนักศึกษา'
                this.showPermanentError('resetEmail', result.message); 
            }
        } catch (error) {
            this.showPermanentError('resetEmail', 'เกิดข้อผิดพลาดในการส่งรหัสรีเซ็ต');
        } finally {
            this.setLoading(false, submitButton);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าจอ
        
        const submitButton = document.getElementById('confirmResetButton');
        const resetCode = this.resetCodeInput.value.trim();
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInputReset.value; 
        
        let isValid = true;
        // การเคลียร์ Error ทั้งหมดก่อนส่งฟอร์มนี้จะช่วยให้ Error ใหม่แสดงผลได้ชัดเจน
        this.clearForgotPasswordErrors(); 

        if (!resetCode || resetCode.length !== 6 || isNaN(resetCode)) {
            this.showPermanentError('resetCode', 'รหัสรีเซ็ตไม่ถูกต้อง (ต้องเป็นตัวเลข 6 หลัก)');
            isValid = false;
        }
        if (newPassword.length < 6) {
            this.showPermanentError('newPassword', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            isValid = false;
        }
        if (newPassword !== confirmPassword) {
            this.showPermanentError('confirmPasswordReset', 'รหัสผ่านใหม่ไม่ตรงกัน'); 
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
                // *** FIX: แสดง Error ตามประเภทที่มาจาก Apps Script ***
                let targetField = 'confirmPasswordReset';
                if (result.message.includes('รหัสรีเซ็ต') || result.message.includes('หมดอายุ')) {
                    targetField = 'resetCode';
                }
                // ถ้าเป็นรหัสผ่านใหม่ไม่ตรงกัน ให้ชี้ไปที่ confirmPasswordReset
                if (result.message.includes('รหัสผ่านใหม่ไม่ตรงกัน')) {
                     targetField = 'confirmPasswordReset';
                }
                this.showPermanentError(targetField, result.message); 
            }
        } catch (error) {
            this.showPermanentError('confirmPasswordReset', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'); 
        } finally {
            this.setLoading(false, submitButton);
        }
    }
    
    // Display Functions (คงเดิม)
    updateSuccessScreen(data) {
        const adminName = data.adminName || 'Admin';
        const links = data.redirectButtons || []; 

        // แก้ไข: เปลี่ยน 'เมนู Admin' เป็น 'สวัสดี, [ชื่อแอดมิน]!' และตัวใหญ่
        document.getElementById('adminWelcome').innerHTML = `
            <span style="font-size: 1.8rem; font-weight: 700;">สวัสดี,</span>
            <br><span style="font-size: 1.4rem; font-weight: 600; color: #3b82f6;">${adminName}!</span>
        `;
        document.getElementById('displayStudentId').textContent = data.studentId;
        // ค่า Total Logins จะมาจากข้อมูลที่อ่านจากชีต 3 (คอลัมน์ E) ที่ส่งกลับมา
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
                <div class="button-loader"></div>
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
        // ซ่อน Pop-up Loading (สำคัญมาก)
        this.toggleLoadingOverlay(false);

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
