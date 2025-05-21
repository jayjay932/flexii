// src/services/authService.js

export async function login(email, password) {
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
  
    const response = await fetch("http://localhost/flexii/login.php", {
      method: "POST",
      body: formData,
      credentials: "include", // pour les cookies PHP
    });
  
    if (!response.ok) {
      throw new Error("Échec de connexion.");
    }
    return response;
  }
  
  export async function register(userData) {
    const formData = new URLSearchParams(userData);
  
    const response = await fetch("http://localhost/flexii/signup.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Échec de l'inscription.");
    }
  
    return response;
  }
  
  export async function logout() {
    await fetch("http://localhost/flexii/logout.php", {
      credentials: "include",
    });
  }
  