import Link from 'next/link';

export default function TrialExpiredPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 p-8 rounded-xl max-w-md w-full text-center shadow-lg">
        <h1 className="text-3xl font-bold text-foreground mb-4">Trial Expired</h1>
        <p className="text-foreground/70 mb-8">
          Your 14-day trial has ended. To regain access to Futrix and keep using all features, please subscribe to a paid plan.
        </p>
        <Link 
          href="/pricing"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
        >
          Subscribe Now
        </Link>
        <p className="mt-4 text-sm text-foreground/50">
          Or go to <Link href="/settings" className="underline hover:text-foreground">Settings</Link> to manage your account.
        </p>
      </div>
    </div>
  );
}
