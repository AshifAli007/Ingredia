import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function App() {
    return (
        <>
            <SignedOut>
                {/* <SignInButton /> */}
                <SignIn routing='hash' />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>

        </>
    );
}