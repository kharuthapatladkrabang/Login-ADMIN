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

        // URL Web App ล่าสุด (UPDATED!)
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzH5_rERyRW4PcEDt-q8-DwSpBx4ZTl5nW-CvsZfXEPZ4-FF6Q8vAacrOfP0B8sDYt6/exec'; 

        // NEW: Loading Overlay Elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.progressBar = document.getElementById('loginProgressBar');
        this.percentageDisplay = document.getElementById('loadingPercentage');
        
        // ตัวแปรสำหรับควบคุมการโหลด
        this.isSimulatingLoad = false;
        this.progressInterval = null;

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
                     // ไม่มีการ clearError() ที่นี่! Error ที่มาจาก Server จะแสดงค้างไว้
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
    
    // NEW: Function to update progress bar and percentage (using CSS Variable)
    updateProgressBar(percentage) {
        this.progressBar.style.setProperty('--progress-width', `${percentage}%`);
        this.percentageDisplay.textContent = `${percentage}%`;
    }
    
    // NEW: Simulation function
    simulateLoad(durationInSeconds = 2) {
        return new Promise(resolve => {
            if (this.isSimulatingLoad) {
                clearInterval(this.progressInterval);
            }
            this.isSimulatingLoad = true;
            this.updateProgressBar(0);
            this.toggleLoadingOverlay(true);

            let currentProgress = 0;
            const step = 100 / (durationInSeconds * 10); // 10 steps per second

            this.progressInterval = setInterval(() => {
                currentProgress += step;
                
                // ให้ progress วิ่งไปถึง 80% ก่อน (เพื่อรอผลลัพธ์จาก Server)
                if (currentProgress >= 80) {
                    currentProgress = 80; 
                    clearInterval(this.progressInterval);
                    this.isSimulatingLoad = false;
                }
                
                this.updateProgressBar(Math.floor(currentProgress));

                if (!this.isSimulatingLoad && currentProgress >= 80) {
                    resolve();
                }
            }, 100); 
        });
    }

    // UI/Mode Management
    showForgotPasswordStep1() {
        this.mainLoginCard.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        document.querySelector('.signup-section').style.display = 'none';
        this.contentView.style.display = 'none'; 
        
        this.forgotPasswordCard1.style.display = 'block'; // แสดง Step 1 Card
        
        // FIX: ตั้งค่าข้อความเริ่มต้น
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
        
        // Update Header (ใช้คำว่า Admin)
        this.formHeader.textContent = mode === 'login' ? 'เข้าสู่ระบบ Admin' : 'การลงทะเบียน Admin';
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
                 document.getElementById('confirmPasswordResetToggle').classList.toggle('toggle-active', isPassword);
            });
        }
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
        
        if (!this.validateStudentId()) isValid = false;
        if (!this.validatePassword()) isValid = false;
        
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
        // *** FIX: การกำหนด ID สำหรับ Error Targeting ที่แม่นยำที่สุด ***
        let targetFieldId = field;
        
        // 1. ตรวจสอบ Error จาก Apps Script (ข้อความที่ส่งมาจาก GAS)
        
        // For Login/Register
        if (message.includes('รหัสนักศึกษา') || message.includes('ไม่พบบัญชี') || message.includes('สิทธิ์') || field === 'email') {
            targetFieldId = 'email';
        } else if (message.includes('รหัสความปลอดภัย') || message.includes('รหัสผ่านไม่ถูกต้อง') || field === 'password') {
            targetFieldId = 'password';
        } else if (field === 'confirmPassword') {
             targetFieldId = 'confirmPassword'; // สำหรับหน้า Register
        } 
        
        // For Forgot Password (Step 1 & 2)
        // *** ปรับปรุงการจับ Error ให้กว้างขึ้นสำหรับขั้นตอนที่ 1 ***
        else if (message.includes('รหัสนักศึกษา') || message.includes('ไม่พบบัญชี') || message.includes('กรุณาตรวจสอบ') || field === 'resetEmail') {
             targetFieldId = 'resetEmail'; // New fixed error message (Step 1)
        } 
        // *** ปรับปรุงการจับ Error สำหรับรหัสรีเซ็ต (รหัสรีเซ็ต, หมดอายุ) ***
        else if (message.includes('รหัสรีเซ็ต') || message.includes('หมดอายุ') || targetFieldId === 'resetCode') {
            targetFieldId = 'resetCode'; // Step 2 Code field
        } 
        // สำหรับรหัสผ่านใหม่ไม่ตรงกัน
        else if (message.includes('รหัสผ่านใหม่ไม่ตรงกัน') || field === 'confirmPasswordReset') {
             targetFieldId = 'confirmPasswordReset'; // Step 2 Confirm Pass
        }


        const inputElement = document.getElementById(targetFieldId);
        if (!inputElement) return;

        const smartField = inputElement.closest('.smart-field');
        const errorElement = document.getElementById(`${targetFieldId}Error`);
        
        // เราไม่ต้องการให้ error แสดงบน Pop-up, แต่ต้องการให้แสดงบนหน้า login หลัก
        this.toggleLoadingOverlay(false); // ปิด Pop-up ทันทีเมื่อเกิด Error
        
        if (smartField && errorElement) {
             // เคลียร์ error เก่าที่เคยแสดงในฟอร์มนั้นๆ ก่อนแสดงอันใหม่
             this.clearAllErrorsInForm(smartField.form); 

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
        
        if (this.currentMode === 'register' && !this.validateRegistration()) {
            return;
        } else if (this.currentMode === 'login' && (!this.validateStudentId() || !this.validatePassword())) {
            return;
        }

        // 1. เริ่มแสดง Pop-up และจำลองการโหลด (วิ่งไปถึง 80%)
        this.setLoading(true, this.submitButton); // ยังคงแสดง Loading ที่ปุ่ม
        await this.simulateLoad(2); // รอจนกระทั่ง Progress Bar วิ่งไปถึง 80%

        const formData = new FormData();
        formData.append('action', this.currentMode === 'login' ? 'admin_login_only_sheet3' : 'register'); 
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
                // 2. ถ้าสำเร็จ: เติม Progress Bar ให้เต็ม 100%
                this.updateProgressBar(100);
                
                // 3. รอเล็กน้อยก่อนปิด Pop-up และแสดงหน้า Success
                await new Promise(r => setTimeout(r, 500)); 
                
                if (this.currentMode === 'login') {
                    this.saveCredentials(); // บันทึกข้อมูลเมื่อล็อกอินสำเร็จ
                    
                    if (result.adminName) {
                        this.updateSuccessScreen(result); 
                        this.showNeuralSuccess(); // แสดงหน้า Success
                    } else {
                        // การเข้าสู่ระบบสำเร็จ แต่ไม่สามารถดึงข้อมูลเพิ่มเติมได้ (ข้อความจาก Apps Script)
                        this.showError('password', result.message || 'การเข้าสู่ระบบสำเร็จ แต่ไม่สามารถดึงข้อมูล Admin ได้');
                    }
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้แล้ว');
                    this.updateFormMode('login');
                }
            } else {
                // 4. ถ้าไม่สำเร็จ: แสดง Error และปิด Pop-up ทันที (ฟังก์ชัน showError จะทำตรงนี้แทน)
                let targetField = 'password';
                if (result.message.includes('รหัสนักศึกษา') || result.message.includes('ไม่พบบัญชี') || result.message.includes('สิทธิ์')) {
                    targetField = 'email';
                }
                
                this.showError(targetField, result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }
        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            this.showError('password', 'การเชื่อมต่อระบบล้มเหลว (Network Error)'); 
        } finally {
            this.setLoading(false, this.submitButton);
            this.toggleLoadingOverlay(false); // ปิด Pop-up (กรณีสำเร็จ, ไม่สำเร็จ, หรือเกิดข้อผิดพลาดเครือข่าย)
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

        if (!studentId) {
            // Client-side validation
            return this.showError('resetEmail', 'กรุณากรอกรหัสนักศึกษา');
        }
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

            } else {
                // *** FIX: แสดง Error ใน input field ของ Step 1 ***
                // Backend ส่งข้อความ: 'ไม่พบบัญชีนี้ในระบบ กรุณาตรวจสอบรหัสนักศึกษา'
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
        const confirmPassword = this.confirmPasswordInputReset.value; 
        
        let isValid = true;
        // การเคลียร์ Error ทั้งหมดก่อนส่งฟอร์มนี้จะช่วยให้ Error ใหม่แสดงผลได้ชัดเจน
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
            this.showError('confirmPasswordReset', 'รหัสผ่านใหม่ไม่ตรงกัน'); 
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
                this.showError(targetField, result.message); 
            }
        } catch (error) {
            this.showError('confirmPasswordReset', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'); 
        } finally {
            this.setLoading(false, submitButton);
        }
    }
    
    // Display Functions (คงเดิม)
    updateSuccessScreen(data) {
        const adminName = data.adminName || 'Admin';
        const links = data.redirectButtons || []; 

        document.getElementById('adminWelcome').textContent = `สวัสดี, ${adminName}!`;
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
