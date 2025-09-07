"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page(){
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mode, setMode] = useState<"Login" | "Register">("Login")
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleLogin = async () => {
      setLoading(true)
      const delayTimer = setTimeout(() => {
        toast.error('Initial response may be delayed up to a minute due to server spinup. Thank you for your patience')
      }, 5000);
      try{
        const res = await api.post('/users/login/', { username, password })
        clearTimeout(delayTimer)
        toast.success('User login successful')
        localStorage.setItem('ACCESS_TOKEN', res.data.access)
        
        // Reset fields
        router.push('/classes/')
      }
      catch(err: any){
        console.error(err)
        clearTimeout(delayTimer)
        if(err.status === 401){
          toast.error('Invalid credentials. Please try again')
        }
        else{
          toast.error('Something went wrong logging in. Please try again')
        }
      }
      finally{
        clearTimeout(delayTimer)
        setLoading(false)
      }
    }

    const handleRegister = async () => {
      setLoading(true)
      const delayTimer = setTimeout(() => {
        toast.error('Initial request will take extra time due to server spinup. Initial response may be delayed up to a minute')
      }, 5000);
      try{
        await api.post('/users/register/', { username, password })
        toast.success('User registration successful. Please login with the same credentials.')
        
        // Reset fields
        setUsername("")
        setPassword("")
        setMode("Login")
      }
      catch(err: any){
        if(err?.response?.data?.username){
          toast.error(`User with username ${username} already exists`)
        }
        else{
          console.error(err)
          toast.error('Something went wrong creating a new account. Please try again.')
        }
      }
      finally{
        clearTimeout(delayTimer)
        setLoading(false)
      }
    }

    return (
      <main className="flex flex-row justify-center full-screen-wrapper">
        <section className="hidden md:flex justify-center items-center h-full w-[50%] bg-secondary">
          <img src="icon.png" alt="Smart Note Icon" className="aspect-square w-[80%] max-w-[768px] rounded-lg"/>
        </section>
        <section className="flex justify-center items-center h-full w-[70%]">
          <div className="relative mx-auto flex flex-col w-[310px] lg:w-[480px] xl:[768px] p-8 space-y-3 card border-1 border-primary">
            <div className="flex flex-col gap-y-1">
              {mode === 'Login' && 
                <>
                  <h1 className="text-3xl">Login</h1>
                  <p>Sign in to access notes and quizzes</p>
                </>
              }
              {mode === 'Register' && 
                <>
                  <h1 className="text-3xl">Register</h1>
                  <p>Create an account to access notes and quizzes</p>
                </>
              }
              
            </div>
            <input 
              type="text" placeholder="Username" className="form-input px-2 rounded-full border-1 border-primary" 
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" placeholder="Password" className="form-input px-2 rounded-full border-1 border-primary" 
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            {loading && <div className="flex justify-center items-center w-full py-2">
              <LoadingSpinner />
            </div>}
            <div className="flex flex-col w-full gap-y-1">
              {mode === 'Login' && 
                <>
                  <button className="form-btn bg-primary text-white border-0" onClick={handleLogin}>Login</button>
                  <p className="text-primary underline cursor-pointer" onClick={() => setMode("Register")}>Sign up instead</p>
                </>
              }
              {mode === 'Register' && 
                <>
                  <button className="form-btn bg-primary text-white border-0" onClick={handleRegister}>Register</button>
                  <p className="text-primary underline cursor-pointer" onClick={() => setMode("Login")}>Sign in instead</p>
                </>
              }
            </div>
          </div>
        </section>
      </main>
    )
}