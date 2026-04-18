import { Hero } from '@/components/sections/Hero';
import { Scrolltelling } from '@/components/sections/Scrolltelling';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Clients } from '@/components/sections/Clients';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Scrolltelling />
      <Services />
      <Portfolio />
      <Clients />
      <Contact />
    </>
  );
}
