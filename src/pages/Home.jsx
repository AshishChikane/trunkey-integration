import React from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <div className="relative mx-auto mb-12 h-16 w-16">
        <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20"></div>
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-red-900">
          <div className="h-8 w-8 text-red-300">🤖</div>
        </div>
      </div>

      <h2 className="mb-4 text-4xl font-bold text-red-100 sm:text-5xl">
        Simplify Integrate TurnKey
      </h2>
      <p className="mb-12 text-red-300">
        Seamlessly connecting your app with TurnKey for enhanced functionality
        and integration
      </p>

      <div className="flex justify-center gap-8">
        <Button label="Get Started" onClick={() => navigate("/dashboard")} />
      </div>
    </section>
  );
}
