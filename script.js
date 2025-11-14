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
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwyKwQmybLse9B9wf0l0iSmMtFgmQz4zy9xLqQfSKgnbJzRTS2tZBClWvOf6obuirxo/exec';

        // NEW: Loading Overlay Elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.progressBar = document.getElementById('loginProgressBar');
        this.percentageDisplay = document.getElementById('loadingPercentage');
        this.loadingTextDisplay = document.querySelector('.loading-box .loading-text');

        // ตัวแปรสำหรับควบคุมการโหลด
        this.isSimulatingLoad = false;
        this.progressInterval = null;
        this.errorTimeout = null; // สำหรับควบคุมการซ่อน Error อัตโนมัติ

        // NEW TIMER ELEMENTS
        this.sessionTimerDisplay = document.getElementById('sessionTimerDisplay');
        this.timerInterval = null;
        this.SESSION_DURATION = 600; // 10 นาที = 600 วินาที

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

    // NEW: ฟังก์ชันสำหรับแสดง Error แบบถาวร 20 วินาที (เปลี่ยนเป็น 60 วินาที)
    showPermanentError(field, message, duration = 60000) { // <--- แก้ไขระยะเวลา Error Persistence เป็น 60000 มิลลิวินาที
        // 1. เคลียร์ Error เดิมทั้งหมด
        let currentForm = this.form;
        if (document.getElementById('forgotPasswordCard1').style.display !== 'none') {
             currentForm = this.forgotPasswordForm;
        } else if (document.getElementById('forgotPasswordCard2').style.display !== 'none') {
             currentForm = this.resetPasswordForm;
        }
        this.clearAllErrorsInForm(currentForm);


        const globalDisplay = document.getElementById('globalErrorDisplay') || document.getElementById('forgotPasswordGlobalErrorDisplay') || document.getElementById('resetPasswordGlobalErrorDisplay');

        // 2. แสดง Error ภายใน Input Field
        const inputElement = document.getElementById(field);
        if (inputElement) {
            const smartField = inputElement.closest('.smart-field');
            const errorElement = document.getElementById(`${field}Error`);

            if (smartField && errorElement) {
                smartField.classList.add('error');
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }

        // 3. แสดงข้อความบน Global Display (ถ้ามี)
        if (globalDisplay) {
             // globalDisplay.textContent = message;
             // globalDisplay.style.display = 'block';
        }

        // 4. ตั้ง Timeout เพื่อซ่อนอัตโนมัติ (แต่จะถูกยกเลิกเมื่อผู้ใช้พิมพ์/ส่งใหม่)
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }
        this.errorTimeout = setTimeout(() => {
            if (globalDisplay) {
                 globalDisplay.style.display = 'none';
                 globalDisplay.textContent = '';
            }
            if (inputElement) this.clearError(field);
        }, duration);
    }


    // UI/Mode Management
    showForgotPasswordStep1() {
        this.mainLoginCard.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';
        document.querySelector('.signup-section').style.display = 'none';
        this.contentView.style.display = 'none';

        this.forgotPasswordCard1.style.display = 'block'; // แสดง Step 1 Card

        // อัปเดตข้อความหัวข้อ (เพิ่ม ' (ขั้นตอนที่ 1)')
        this.forgotPasswordCard1.querySelector('.login-header h2').textContent = 'รีเซ็ตรหัสผ่าน (ขั้นตอนที่ 1)';
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

        // หยุด Session Timer เมื่อกลับไปหน้า Login
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
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

    // Validation Helpers (ใช้ showPermanentError เพื่อบังคับให้ Error ค้าง)
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

    // Error Management (ปรับให้ใช้กับ showPermanentError ได้ง่ายขึ้น)
    // ... (ฟังก์ชัน showError, clearError, clearAllErrorsInForm, clearForgotPasswordErrors)

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

    // Core Form Submission (ปรับให้ Progress Bar วิ่งต่อเนื่อง)
    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        // 1. ตรวจสอบความถูกต้องของ Input ก่อนส่ง API (Client-side validation)
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
            // --- NEW PHASE 1 START: เริ่มดึงข้อมูลจริงพร้อมกับการจำลองโหลด (0% -> 95% ใน 15 วินาที) ---
            this.updateLoadingText('กำลังตรวจสอบบัญชี...');
            this.toggleLoadingOverlay(true);

            // 1. เริ่มการจำลองโหลด (0% -> 95% ใน 15 วินาที) โดยไม่ต้องรอให้เสร็จ
            this.simulateLoad(95, 15);

            // 2. เริ่มการดึงข้อมูลจริง (Fetch) พร้อมกัน
            const fetchPromise = fetch(this.WEB_APP_URL, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            });

            // 3. รอให้การดึงข้อมูลจริงเสร็จสิ้นก่อน
            const result = await fetchPromise;

            // 4. ถ้าดึงข้อมูลสำเร็จ: บังคับให้ Progress Bar วิ่งจากค่าปัจจุบันไป 100% ใน 3 วินาที
            if (result.success) {

                this.updateLoadingText('กำลังเข้าสู่ระบบ...');
                // วิ่งต่อจากค่าปัจจุบันไป 100% ใน 3 วินาที
                await this.simulateLoad(100, 3);

                // 5. แสดงหน้า Success
                this.updateLoadingText('เข้าสู่ระบบสำเร็จ กำลังนำไปสู่เมนู Admin...');

                if (this.currentMode === 'login') {
                    this.saveCredentials();

                    if (result.adminName) {
                         await new Promise(r => setTimeout(r, 300));

                         this.updateSuccessScreen(result);
                         this.showNeuralSuccess();
                    } else {
                        // Error fallback ถ้าได้ success แต่ดึง adminName ไม่ได้
                         await this.simulateLoad(0, 0.5);
                         this.showPermanentError('password', result.message || 'การเข้าสู่ระบบสำเร็จ แต่ไม่สามารถดึงข้อมูล Admin ได้');
                    }
                } else {
                    alert('ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้แล้ว');
                    this.updateFormMode('login');
                }
            } else {
                // 6. ดึงข้อมูลไม่สำเร็จ: บังคับ Progress Bar ลงไป 0% อย่างรวดเร็ว
                await this.simulateLoad(0, 0.5);

                let targetField = 'password';
                if (result.message.includes('รหัสนักศึกษา') || result.message.includes('ไม่พบบัญชี') || result.message.includes('สิทธิ์')) {
                    targetField = 'email';
                }

                this.showPermanentError(targetField, result.message || `${this.currentMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ล้มเหลว โปรดตรวจสอบรายละเอียด`);
            }
        } catch (error) {
            console.error(`${this.currentMode} error:`, error);
            await this.simulateLoad(0, 0.5); // บังคับ Progress Bar ลงไป 0%
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
        e.preventDefault();
        e.stopPropagation();

        const submitButton = document.getElementById('sendResetCodeButton');
        const studentId = this.resetEmailInput.value.trim();
        this.tempStudentId = studentId;

        // *** VALIDATION: ตรวจสอบว่ากรอกรหัสนักศึกษาหรือไม่ ***
        if (!studentId) {
            this.showPermanentError('resetEmail', 'จำเป็นต้องระบุรหัสนักศึกษา');
            return;
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
                // *** FIX: แสดงข้อความ Success ใน p tag ของ Step 2 ***
                this.resetStep2Message.textContent = result.message;
                this.forgotPasswordCard1.style.display = 'none'; // ซ่อน Step 1
                this.forgotPasswordCard2.style.display = 'block'; // แสดง Step 2

                // Clear inputs ใน Step 2
                this.resetCodeInput.value = '';
                this.newPasswordInput.value = '';
                this.confirmPasswordInputReset.value = '';

                // อัปเดตหัวข้อ Step 2 (เพิ่ม ' (ขั้นตอนที่ 2)')
                this.forgotPasswordCard2.querySelector('.login-header h2').textContent = 'รีเซ็ตรหัสผ่าน (ขั้นตอนที่ 2)';

            } else {
                // *** FIX: แสดง Error ใน input field ของ Step 1 ***
                this.showPermanentError('resetEmail', result.message);
            }
        } catch (error) {
            this.showPermanentError('resetEmail', 'เกิดข้อผิดพลาดในการส่งรหัสรีเซ็ต');
        } finally {
            this.setLoading(false, submitButton);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        e.stopPropagation();

        const submitButton = document.getElementById('confirmResetButton');
        const resetCode = this.resetCodeInput.value.trim();
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInputReset.value;

        let isValid = true;
        this.clearForgotPasswordErrors();

        if (!resetCode || resetCode.length !== 6 || isNaN(resetCode)) {
            this.showPermanentError('resetCode', 'รหัสรีเซ็ตไม่ถูกต้อง (ต้องเป็นตัวเลข 6 หลัก)');
            isValid = false;
        }

        if (newPassword.length < 6) {
            this.showPermanentError('newPassword', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            isValid = false;
        }

        if (newPassword.length >= 6 && newPassword !== confirmPassword) {
            this.showPermanentError('confirmPasswordReset', 'รหัสผ่านใหม่ไม่ตรงกัน');
            isValid = false;
        } else if (newPassword.length >= 6 && !confirmPassword) {
              this.showPermanentError('confirmPasswordReset', 'จำเป็นต้องยืนยันรหัสผ่านใหม่');
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
                let targetField = 'confirmPasswordReset';
                if (result.message.includes('รหัสรีเซ็ต') || result.message.includes('หมดอายุ')) {
                    targetField = 'resetCode';
                }
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

    // NEW: Session Timer Logic
    startSessionTimer() {
        // Clear interval เก่าถ้ามี
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        let timeLeft = this.SESSION_DURATION; // เริ่มที่ 600 วินาที

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            const displayMinutes = String(minutes).padStart(2, '0');
            const displaySeconds = String(seconds).padStart(2, '0');

            this.sessionTimerDisplay.textContent = `เซสชันจะหมดอายุใน: ${displayMinutes}:${displaySeconds}`;

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.sessionTimerDisplay.textContent = 'เซสชันหมดอายุแล้ว กำลังนำกลับไปหน้าล็อกอิน...';
                // บังคับโหลดหน้าซ้ำเพื่อกลับไปที่หน้าล็อกอิน
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                timeLeft--;
            }
        };

        updateTimer(); // เรียกใช้ครั้งแรกทันที
        this.timerInterval = setInterval(updateTimer, 1000); // อัปเดตทุก 1 วินาที
    }

    // Display Functions
    updateSuccessScreen(data) {
        const adminName = data.adminName || 'Admin';
        const links = data.redirectButtons || [];

        document.getElementById('adminWelcome').innerHTML = `
             <span style="font-size: 1.8rem; font-weight: 700;">สวัสดี,</span>
             <br><span style="font-size: 1.4rem; font-weight: 600; color: #3b82f6;">${adminName}!</span>
         `;
        document.getElementById('displayStudentId').textContent = data.studentId;
        document.getElementById('displayTotalLogins').textContent = data.totalLogins;

        this.redirectButtonsContainer.innerHTML = '';

        if (links.length === 0) {
            this.redirectButtonsContainer.innerHTML = '<p style="color: #ef4444; margin-top: 10px;">ไม่พบลิงก์สำหรับ Admin</p>';
            return;
        }

        links.forEach((buttonData, index) => {
            const buttonText = buttonData.name;
            const link = buttonData.link;

            const newButton = document.createElement('button');
            newButton.className = 'neural-button';
            newButton.type = 'button';
            newButton.style.marginTop = (index > 0) ? '5px' : '0px';

            newButton.innerHTML = `
                 <div class="button-bg"></div>
                 <span class="button-text">${buttonText}</span>
                 <div class="button-loader"></div>
                 <div class="button-glow"></div>
             `;

            newButton.addEventListener('click', () => {
                window.open(link, '_blank');
            });

            this.redirectButtonsContainer.appendChild(newButton);
        });
    }

    showNeuralSuccess() {
        this.toggleLoadingOverlay(false);

        this.mainLoginCard.style.display = 'none';
        this.forgotPasswordCard1.style.display = 'none';
        this.forgotPasswordCard2.style.display = 'none';

        document.querySelector('.signup-section').style.display = 'none';
        this.successMessage.classList.add('show');
        this.successMessage.style.display = 'block';

        this.contentView.style.display = 'none';

        // *** NEW: เริ่ม Session Timer ***
        this.startSessionTimer();
    }

    // *** ฟังก์ชันที่ไม่สมบูรณ์จาก Snippet (ต้องมีในโค้ดจริง แต่ไม่มีในนี้) ***
    clearError(field) {
        const inputElement = document.getElementById(field);
        if (!inputElement) return;

        const smartField = inputElement.closest('.smart-field');
        const errorElement = document.getElementById(`${field}Error`);

        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = null;
        }

        const globalDisplay = document.getElementById('globalErrorDisplay');
        if (globalDisplay) {
              globalDisplay.style.display = 'none';
              globalDisplay.textContent = '';
        }

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
    // *************************************************************
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
