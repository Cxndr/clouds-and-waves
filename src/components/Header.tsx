import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import NavBar from './NavBar';

export default function Header() {
  return (
    <header className="w-full h-24 flex justify-between items-center flex-row flex-nowrap bg-zinc-900 bg-opacity-70 shadowed">
      
      <a href="/" className="hover:scale-105 transition-all duration-300 hover:text-[indianred]">
        <h1 className="self-center px-5 pt-4 pb-3 handwriting font-bold text-4xl">
          Clouds & Waves
        </h1>
      </a>
      
      <NavBar/>

      <div className="flex self-center">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="mr-6 px-4 py-3 text-xl rounded-2xl shadow-sm shadow-zinc-900">
              Sign In / Register
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </header>
  );
}

