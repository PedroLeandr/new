'use client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const loginredirect = () => {
    router.push("/login");
  };

  return (
    <div>
      <h1>Landing page</h1>
      <button onClick={loginredirect}>login</button>
    </div>
  );
}
