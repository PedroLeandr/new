'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre login e registro
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao fazer login");
      } else {
        alert("Erro ao fazer login");
      }
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        email,
        password,
      });
      alert("Registro bem-sucedido! Faça login.");
      setIsRegister(false); // Volta para o formulário de login após registro
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao fazer registro");
      } else {
        alert("Erro ao fazer registro");
      }
    }
  };

  const handleSubmit = () => {
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div>
      <h1>{isRegister ? "Registrar" : "Login"}</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {isRegister ? "Registrar" : "Entrar"}
      </button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Registre-se"}
      </button>
    </div>
  );
}