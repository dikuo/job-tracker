'use client'

import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const {ready, token} = useTheme()

  useEffect(() => {
    if (!ready) return
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }

  }, [ready, token])
}