import { SignInButton } from "@clerk/nextjs"


export default function SignIn() {

  return (
    <div className="p-8 px-12 font-bold m-8 mt-16 flex flex-col gap-6 justify-center items-center rounded-2xl bg-zinc-100 bg-opacity-70 text-zinc-800 shadowed">
      <h1 className="text-3xl">Sign in to continue</h1>
      <SignInButton mode="modal">
        <button className="px-4 py-3 text-xl rounded-2xl shadow-sm shadow-zinc-500">
          Sign In / Register
        </button>
      </SignInButton>
    </div>
  )
}