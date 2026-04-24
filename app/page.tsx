import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LenisProvider from '@/components/LenisProvider';
import GrainTexture from '@/components/GrainTexture';
import Footer from '@/components/Footer';
import WorkSection from '@/components/WorkSection';
import ExperienceSection from '@/components/ExperienceSection';
import NowSection from '@/components/NowSection';

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Nav />
      <GrainTexture />
      <main id="top">
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <NowSection />
      </main>
      <Footer />
    </>
  );
}
