'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginCode, setLoginCode] = useState("")
  const [showLoginCodeInput, setShowLoginCodeInput] = useState(false)

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
  const [showRegisterCodeInput, setShowRegisterCodeInput] = useState(false)

  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [passwordResetEmail, setPasswordResetEmail] = useState("")
  const [passwordResetPassword, setPasswordResetPassword] = useState("")
  const [showPasswordResetCodeInput, setShowPasswordResetCodeInput] = useState(false)
  const [codeInput, setCodeInput] = useState("")

  const countries = [
    { name: "Portugal", code: "+351" },
    { name: "Brasil", code: "+55" },
    { name: "Espanha", code: "+34" },
    { name: "França", code: "+33" },
    { name: "Alemanha", code: "+49" },
  ]

  const handleStartLogin = async () => {
    if (!loginEmail) return
    try {
      await axios.post("http://213.199.41.43:3001/api/auth/start-login", { email: loginEmail })
      setShowLoginCodeInput(true)
      alert("Código enviado para o seu email.")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Erro ao enviar código de login")
      else alert("Erro ao enviar código de login")
    }
  }

  const handleVerifyLoginCode = async () => {
    if (loginCode.length !== 6) return
    if (!loginPassword) return
    try {
      const res = await axios.post("http://213.199.41.43:3001/api/auth/verify-login-code", {
        email: loginEmail,
        password: loginPassword,
        code: loginCode,
      })
      localStorage.setItem("token", res.data.token)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Erro ao fazer login")
      else alert("Erro ao fazer login")
    }
  }

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) return
    if (!acceptedPolicy) return
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
      setShowRegisterCodeInput(true)
      alert("Código enviado para o seu email.")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Erro ao fazer registro")
      else alert("Erro ao fazer registro")
    }
  }

  const handleVerifyRegisterCode = async () => {
    if (codeInput.length !== 6) return
    try {
      await axios.post("http://213.199.41.43:3001/api/auth/verify-register-code", {
        email: registerEmail,
        code: codeInput,
      })
      alert("Registo confirmado! Pode agora fazer login.")
      setShowRegisterCodeInput(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Código inválido ou expirado")
      else alert("Erro ao verificar código")
    }
  }

  const handlePasswordReset = async () => {
    setShowPasswordReset(true)
    if (!passwordResetEmail) return
    try {
      await axios.post("http://213.199.41.43:3001/api/auth/start-password-reset", { email: passwordResetEmail })
      alert("Código de recuperação enviado para o seu email.")
      setShowPasswordResetCodeInput(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Erro ao enviar código de recuperação")
      else alert("Erro ao enviar código de recuperação")
    }
  }

  const handleVerifyPasswordResetCode = async () => {
    if (codeInput.length !== 6) return
    try {
      await axios.post("http://213.199.41.43:3001/api/auth/verify-password-reset-code", {
        email: passwordResetEmail,
        newPassword: passwordResetPassword,
        code: codeInput,
      })
      alert("Registo confirmado! Pode agora fazer login.")
      setShowPasswordResetCodeInput(false)
      setShowPasswordReset(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || "Código inválido ou expirado")
      else alert("Erro ao verificar código")
    }
  }

  return (
    <div>
      {!showPasswordReset && !showLoginCodeInput && (
        <div>
          <h1>Login</h1>
          <input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          <button onClick={handleStartLogin}>Entrar</button>
          <button onClick={handlePasswordReset}>Esqueci a Senha</button>
        </div>
      )}

      {showLoginCodeInput && (
        <div>
          <h2>Digite o código de 6 dígitos enviado para o seu email</h2>
          <input placeholder="Código" maxLength={6} value={loginCode} onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, ""))} />
          <button onClick={handleVerifyLoginCode}>Verificar Código e Entrar</button>
        </div>
      )}

      {showPasswordReset && (
        <div>
          <h1>Recuperar Senha</h1>
          <input placeholder="Email" value={passwordResetEmail} onChange={(e) => setPasswordResetEmail(e.target.value)} />
          <button onClick={handlePasswordReset}>Enviar Código de Recuperação</button>
        </div>
      )}

      {showPasswordResetCodeInput && (
        <div>
          <h2>Digite o código de 6 dígitos enviado para o seu email</h2>
          <input placeholder="Código" maxLength={6} value={codeInput} onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))} />
          <input type="password" placeholder="Nova Senha" value={passwordResetPassword} onChange={(e) => setPasswordResetPassword(e.target.value)} />
          <button onClick={handleVerifyPasswordResetCode}>Verificar Código</button>
        </div>
      )}

      {!showRegisterCodeInput && (
        <div>
          <h1>Registrar</h1>
          <input placeholder="Primeiro Nome" value={registerFirstName} onChange={(e) => setRegisterFirstName(e.target.value)} />
          <input placeholder="Sobrenome" value={registerSurname} onChange={(e) => setRegisterSurname(e.target.value)} />
          <input placeholder="Nome da empresa" value={registerCompanyName} onChange={(e) => setRegisterCompanyName(e.target.value)} />
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)}>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>{country.name} ({country.code})</option>
              ))}
            </select>
            <input type="tel" placeholder="912 345 678" value={registerPhone} inputMode="numeric" maxLength={11} onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
              const formatted = raw.replace(/(\d{3})(\d{3})(\d{0,3})/, (m, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(' '));
              setRegisterPhone(formatted);
            }} />
          </div>
          <input placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
          <input placeholder="Repita a Senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="basic">Plano Básico</option>
            <option value="premium">Plano Premium</option>
          </select>
          <input type="checkbox" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} />
          <label>Li e aceito as <a href="/politica-de-privacidade" target="_blank">Políticas de Privacidade</a></label>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      )}

      {showRegisterCodeInput && (
        <div>
          <h2>Digite o código de 6 dígitos enviado para o seu email</h2>
          <input placeholder="Código" maxLength={6} value={codeInput} onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))} />
          <button onClick={handleVerifyRegisterCode}>Verificar Código e Registrar</button>
        </div>
      )}
    </div>
  )
}
