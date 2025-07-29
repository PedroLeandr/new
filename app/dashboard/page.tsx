'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
    else setOk(true);
  }, [router]);

  if (!ok) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Área protegida</p>
    </div>
  );
}
