import { Link } from "wouter";
import { HandDrawnButton } from "@/components/HandDrawnButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfbf7]">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-ink mb-4">404</h1>
        <p className="text-2xl text-ink/80 mb-8 font-handwriting-2">
          Oops! Looks like this page got lost in the mail.
        </p>

        <Link href="/">
          <div className="inline-block">
            <HandDrawnButton>
              Return to Letter
            </HandDrawnButton>
          </div>
        </Link>
      </div>
    </div>
  );
}
