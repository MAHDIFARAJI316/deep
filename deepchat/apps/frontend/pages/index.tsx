import SampleAnimation from "@/components/SampleAnimation";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <h1 className="text-4xl font-bold">DeepChat</h1>
      <p className="mt-4 text-lg">AI-Powered Messaging Automation</p>
      <SampleAnimation />
    </main>
  );
} 