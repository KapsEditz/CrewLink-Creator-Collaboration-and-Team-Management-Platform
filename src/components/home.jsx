import Hero from "./Hero Section/hero";
import TrustedBy from "./trustedby/trustedby";
import Features from "./Features/features";
import HowItWorks from "./How it Works/howitworks";
import Testimonials from "./Testimonials/testimonials";
import FAQ from "./FAQ Section/faq";
import CTA from "./CTA Section/cta";
import Footer from "../Footer/footer";

export default function Home() {
    return (
        <>
            <Hero />
            <TrustedBy />
            <Features />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </>
    );
}