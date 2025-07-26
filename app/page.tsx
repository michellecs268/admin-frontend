import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#E0DED3" }}>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
