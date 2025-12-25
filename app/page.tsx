
import Link from 'next/link';
import { ArrowRight, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 bg-gradient-to-br from-primary/5 to-accent/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 fade-in-20 duration-700">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Sell your phone for <span className="text-primary">Cash</span> instantly.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get the best price for your used smartphone in under 60 seconds.
              Doorstep pickup, instant payment, and 100% safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 group"
              >
                Sell Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white border-2 border-input text-foreground font-semibold text-lg hover:bg-accent hover:border-accent transition-all duration-300"
              >
                Track Order
              </Link>
            </div>
          </div>

          <div className="flex-1 relative animate-in zoom-in-50 fade-in duration-1000 delay-200">
            {/* Abstract Phone Graphic Placeholder */}
            <div className="relative z-10 w-full aspect-square bg-gradient-to-tr from-gray-100 to-white rounded-[3rem] shadow-2xl border-8 border-white p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-[2.5rem]" />
              <Zap className="w-32 h-32 text-primary/20" />
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-24 bg-gray-200 rounded-full" />
                  <div className="h-4 w-12 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center justify-center">$$$</div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full mb-2" />
                <div className="h-2 w-2/3 bg-gray-100 rounded-full" />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-100 rounded-2xl shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
              <Zap className="w-10 h-10 text-yellow-600" />
            </div>
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-primary/10 rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: "Instant Quote", desc: "Answer a few questions and get your price immediately." },
              { icon: ShieldCheck, title: "Safe & Secure", desc: "Data wipe and instant payment at your doorstep." },
              { icon: CheckCircle, title: "Best Price Guarantee", desc: "We compare prices to give you the highest value." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
