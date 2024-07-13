document.addEventListener('DOMContentLoaded', function () {
    const currentPasswordInput = document.getElementById('current_account_password');
    const newPasswordInput = document.getElementById('new_account_password');
    const confirmPasswordInput = document.getElementById('confirm_account_password');
  
    newPasswordInput.addEventListener('keyup', validatePasswords);
    confirmPasswordInput.addEventListener('keyup', validatePasswords);
  
    function validatePasswords() {
      const currentPassword = currentPasswordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      
      if (newPassword === currentPassword) {
        newPasswordInput.setCustomValidity('New password cannot be the same as the current password.');
      } else if (newPassword !== confirmPassword) {
        confirmPasswordInput.setCustomValidity('Password does not match new password.');
      } else {
        newPasswordInput.setCustomValidity('');
        confirmPasswordInput.setCustomValidity('');
      }
    }
  });
  