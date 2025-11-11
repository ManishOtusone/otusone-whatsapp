import FAQSection from '../../components/common/FAQSection';
import Footer from '../../components/common/Footer';
import Navbar from '../../components/common/Navbar';
import PricingCard from '../../components/common/PricingCard';
import { pricingData } from '../../utils/pricingData';
const HomePage=()=> {
 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold">OTUSONE WhatsApp Service Pricing Plans</h1>
        <p className="text-gray-600 mt-2">Monthly / Yearly Subscription | Unlimited Users Plan</p>
      </section>
      <div className="flex flex-wrap justify-center gap-6 px-6 pb-12">
        {pricingData.map((card, i) => (
          <PricingCard key={i} {...card} />
        ))}
      </div>

      <FAQSection/>

      <Footer/>
    </div>
  );
}


export default HomePage
