import AccordionFAQ from "@/components/home/AccordionFAQ";
import Competitions from "@/components/home/Competitions";
import Events from "@/components/home/Events";
import Hero from "@/components/home/Hero";
import News from "@/components/home/News";
import RegisterSingIn from "@/components/home/RegisterSignIn";
import { TeamsCarousel } from "@/components/home/TeamsCarousel";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <RegisterSingIn />
      <Competitions />
      <News />
      <Events />
      <TeamsCarousel />
      <AccordionFAQ />
    </div>
  );
};

export default Home;
