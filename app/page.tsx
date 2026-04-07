import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LenisProvider from '@/components/LenisProvider';

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Nav />
      <main id="top">
        <Hero />

        {/* Placeholders — replaced in future phases */}
        <section id="about" data-section="about"
          className="flex min-h-[60svh] items-center justify-center border-t border-border">
          <p className="text-sm text-text-tertiary">About — coming soon</p>
        </section>

        <section id="experience" data-section="experience"
          className="flex min-h-[60svh] items-center justify-center border-t border-border">
          <p className="text-sm text-text-tertiary">Experience — coming soon</p>
        </section>

        <section id="contact" data-section="contact"
          className="flex min-h-[60svh] items-center justify-center border-t border-border">
          <p className="text-sm text-text-tertiary">Contact — coming soon</p>
        </section>
      </main>
    </>
  );
}
