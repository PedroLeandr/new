'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerFirstName, setRegisterFirstName] = useState("")
  const [registerSurname, setRegisterSurname] = useState("")
  const [registerCompanyName, setRegisterCompanyName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("PT")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("basic")
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)

  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeInput, setCodeInput] = useState("")

  const countries = [
    { name: "Portugal", code: "+351" },
    { name: "Brasil", code: "+55" },
    { name: "Espanha", code: "+34" },
    { name: "França", code: "+33" },
    { name: "Alemanha", code: "+49" },
  ]

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://213.199.41.43:3001/api/auth/login", {
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
    if (registerPassword !== confirmPassword) {
      alert("As senhas não coincidem.")
      return
    }

    if (!acceptedPolicy) {
      alert("Você precisa aceitar as Políticas de Privacidade para continuar.")
      return
    }

    try {
      await axios.post("http://213.199.41.43:3001/api/auth/start-register", {
        firstName: registerFirstName,
        surname: registerSurname,
        companyName: registerCompanyName,
        countryCode: selectedCountryCode,
        phone: registerPhone,
        email: registerEmail,
        password: registerPassword,
        plan: selectedPlan,
      })

      setShowCodeInput(true)
      alert("Código enviado para o seu email, verifique e insira abaixo.")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao fazer registro")
      } else {
        alert("Erro ao fazer registro")
      }
    }
  }

  const handleVerifyCode = async () => {
    if (codeInput.length !== 6) {
      alert("Insira um código válido de 6 dígitos.")
      return
    }

    try {
      await axios.post("http://213.199.41.43:3001/api/auth/verify-code", {
        email: registerEmail,
        code: codeInput,
      })

      alert("Registo confirmado! Pode agora fazer login.")
      setShowCodeInput(false)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Código inválido ou expirado")
      } else {
        alert("Erro ao verificar código")
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

      {!showCodeInput && (
        <div>
          <h1>Registrar</h1>
          <input
            placeholder="Primeiro Nome"
            value={registerFirstName}
            onChange={(e) => setRegisterFirstName(e.target.value)}
          />
          <input
            placeholder="Sobrenome"
            value={registerSurname}
            onChange={(e) => setRegisterSurname(e.target.value)}
          />
          <input
            placeholder="Nome da empresa"
            value={registerCompanyName}
            onChange={(e) => setRegisterCompanyName(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="912 345 678"
              value={registerPhone}
              inputMode="numeric"
              maxLength={11}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
                const formatted = raw.replace(/(\d{3})(\d{3})(\d{0,3})/, (match, p1, p2, p3) =>
                  [p1, p2, p3].filter(Boolean).join(' ')
                );
                setRegisterPhone(formatted);
              }}
            />
          </div>

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
          <input
            placeholder="Repita a Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            <option value="basic">Plano Básico</option>
            <option value="premium">Plano Premium</option>
          </select>

          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(e) => setAcceptedPolicy(e.target.checked)}
          />
          <label>Li e aceito as <a href="/politica-de-privacidade" target="_blank">Políticas de Privacidade</a></label>

          <button onClick={handleRegister}>Registrar</button>
        </div>
      )}

      {showCodeInput && (
        <div>
          <h2>Digite o código de 6 dígitos enviado para o seu email</h2>
          <input
            placeholder="Código"
            maxLength={6}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
          />
          <button onClick={handleVerifyCode}>Verificar Código</button>
        </div>
      )}
    </div>
  )
}
