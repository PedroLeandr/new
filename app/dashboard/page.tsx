'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    </div>
  );
}
