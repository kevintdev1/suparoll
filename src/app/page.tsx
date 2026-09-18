import { Colors } from "@/features/landing/sections/Colors";
import { CtaFinal } from "@/features/landing/sections/CtaFinal";
import { Develop } from "@/features/landing/sections/Develop";
import { Faq } from "@/features/landing/sections/Faq";
import { Features } from "@/features/landing/sections/Features";
import { Footer } from "@/features/landing/sections/Footer";
import { Gallery } from "@/features/landing/sections/Gallery";
import { Hero } from "@/features/landing/sections/Hero";
import { Manifesto } from "@/features/landing/sections/Manifesto";
import { Preloader } from "@/features/landing/sections/Preloader";
import { Social } from "@/features/landing/sections/Social";
import { Specs } from "@/features/landing/sections/Specs";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Hero />
      <Manifesto />
      <Gallery />
      <Features />
      <Develop />
      <Specs />
      <Colors />
      <Social />
      <Faq />
      <CtaFinal />
      <Footer />
    </main>
  );
}
