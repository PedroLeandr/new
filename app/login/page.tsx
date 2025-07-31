'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      })
      localStorage.setItem("token", res.data.token)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao fazer login")
      } else {
        alert("Erro ao fazer login")
      }
    }
  }

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      })
      alert("Registro bem-sucedido! Faça login.")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao fazer registro")
      } else {
        alert("Erro ao fazer registro")
      }
    }
  }

  return (
    <div>
      <div>
        <h1>Login</h1>
        <input
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>



      <div>
        <h1>Registrar</h1>
        <input
          placeholder="Nome"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Registrar</button>
      </div>
    </div>
  )
}
