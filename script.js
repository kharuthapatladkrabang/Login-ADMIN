// AI Assistant Login Form JavaScript
class AIAssistantLoginForm {
    constructor() {
        // ... โค้ดเดิม ...
        this.WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxgkeBD6kOIpymzJgDV_ijkmj5XQvHkU_bsjmAuJ__JVdsEvXg3o7ujx4h_bF8FH_c5/exec'; // *** ใส่ URL Web App ที่ได้จากขั้นตอนที่ 1 ที่นี่ ***
        this.init();
    }
    
    // ... โค้ดเดิม (init, bindEvents, setupPasswordToggle, setupSocialButtons, setupAIEffects, triggerNeuralEffect) ...
    
    validateEmail() {
        // ... โค้ดเดิม: ตรวจสอบ Email ...
        // ในระบบจริงนี้ เราจะใช้ "รหัสนักศึกษา" เป็น Email/Username
        const studentId = this.emailInput.value.trim();
        if (!studentId) {
            this.showError('email', 'Neural access requires Student ID'); // เปลี่ยนข้อความ
            return false;
        }
        
        // เราจะไม่ตรวจสอบ regex email แต่จะถือว่าเป็น Student ID
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        // ... โค้ดเดิม: ตรวจสอบ Password ...
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Security key required for access');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Security key must be at least 6 characters');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    // ... โค้ดเดิม (showError, clearError) ...
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail(); // ในที่นี้คือ Student ID
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true);
        
        const formData = new FormData();
        formData.append('email', this.emailInput.value.trim()); // จะส่งเป็น Student ID ไปที่ GAS
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
                // ล็อกอินสำเร็จ
                this.showNeuralSuccess();
                
                // จำลองการ Redirect ไปยังหน้าที่ Admin ควรจะไป
                setTimeout(() => {
                    console.log(`Neural link established - accessing AI workspace at: ${result.redirectUrl}`);
                    // ในการใช้งานจริง: window.location.href = result.redirectUrl;
                }, 3200);
                
            } else {
                // ล็อกอินไม่สำเร็จ: แสดงข้อความ error ที่ส่งกลับมาจาก Apps Script
                this.showError('password', result.message || 'Login failed. Please check your credentials.');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError('password', 'Neural connection failed. Please retry.');
        } finally {
            this.setLoading(false);
        }
    }
    
    // ... โค้ดเดิม (handleSocialLogin, setLoading, showNeuralSuccess) ...
}

// Initialize the neural form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistantLoginForm();
});
