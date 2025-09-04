'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userSurname, setUserSurname] = useState<string | null>(null);
  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCountryCode, setUserCountryCode] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [deleteCodeSent, setDeleteCodeSent] = useState(false);
  const [deleteCode, setDeleteCode] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://213.199.41.43:3001/api/auth/validate", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data) => {
        setUserId(data.user.id);
        setUserFirstName(data.user.firstName);
        setUserSurname(data.user.surname);
        setUserCompanyName(data.user.companyName);
        setUserCountryCode(data.user.countryCode);
        setUserPhone(data.user.phone);
        setUserPlan(data.user.plan);
        setUserEmail(data.user.email);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  if (!userEmail) return null;

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const handleSendDeleteCode = async () => {
    if (!deleteAccountPassword.trim()) {
      alert("Por favor insira a palavra-passe.");
      return;
    }

    try {
      await axios.post("http://213.199.41.43:3001/api/user/delete/send-code", {
        email: userEmail,
        password: deleteAccountPassword,
      });

      setDeleteCodeSent(true);
      alert("Código de confirmação enviado para o seu email.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao enviar código de exclusão");
      } else {
        alert("Erro ao enviar código de exclusão");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCode.trim()) {
      alert("Por favor insira o código de confirmação.");
      return;
    }

    try {
      await axios.post("http://213.199.41.43:3001/api/user/delete/confirm", {
        email: userEmail,
        password: deleteAccountPassword,
        code: deleteCode,
      });

      setDeleteAccountPassword("");
      setDeleteCode("");
      setDeleteCodeSent(false);
      setShowPasswordInput(false);

      localStorage.removeItem("token");
      router.push("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Erro ao confirmar exclusão");
      } else {
        alert("Erro ao confirmar exclusão");
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Área protegida</p>
      <p>Id do user: {userId}</p>
      <p>Nome do user logado: {userFirstName} {userSurname}</p>
      <p>Nome da Empresa user logado: {userCompanyName}</p>
      <p>Número de telemóvel do user logado: {userCountryCode} {userPhone}</p>
      <p>Email do user logado: {userEmail}</p>
      <p>Plano do user logado: {userPlan}</p>

      <button onClick={handleLogout}>Logout</button>

      {!showPasswordInput && (
        <button onClick={() => setShowPasswordInput(true)}>Deletar conta</button>
      )}

      {showPasswordInput && !deleteCodeSent && (
        <div>
          <input
            type="password"
            placeholder="Digite sua palavra-passe"
            value={deleteAccountPassword}
            onChange={(e) => setDeleteAccountPassword(e.target.value)}
          />
          <button onClick={handleSendDeleteCode}>Enviar código de exclusão</button>
        </div>
      )}

      {deleteCodeSent && (
        <div>
          <input
            type="text"
            placeholder="Digite o código de confirmação"
            value={deleteCode}
            onChange={(e) => setDeleteCode(e.target.value)}
          />
          <button onClick={handleConfirmDelete}>Confirmar exclusão</button>
        </div>
      )}
    </div>
  );
}
