export function validateName(name: string): string | null {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(name)) {
      return "Name can only contain alphabets and spaces";
    }
    return null;
  }
  
  export function validateEmail(email: string): string | null {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  }
  
  export function validatePassword(password: string): string | null {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;
    if (!regex.test(password)) {
      return "Password must be 4-10 characters long, with at least one uppercase letter, one number, and one special character";
    }
    return null;
  }
  