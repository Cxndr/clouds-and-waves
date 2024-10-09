import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import NavBar from './NavBar';

export default function Header() {
  return (
    <header className="w-full flex justify-between flex-row flex-nowrap bg-slate-700">
      
      <h1 className="self-center px-4 py-3">
        Clouds & Waves
      </h1>
      
      <NavBar />

      <div className="flex self-center px-3 py-3">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </header>
  );
}

