import { OurProudClientsHero } from "../_components/our-proud-clients/our-proud-clients-hero";
import { ClientCategorySection } from "../_components/our-proud-clients/client-category-section";

export const metadata = {
  title: "Our Valued Clients & Partners | Shah Sports",
  description:
    "Discover the respected organizations, fitness professionals, and institutions that trust Shah Sports for their high-performance equipment needs.",
};

const GOVT_SECTOR_CLIENTS = [
  { name: "Bangladesh Army", image: "/images/our-proud-clients/govt-sector-client/2bf3909db967eca0835b4e3aece00a79d66f71ee.png" },
  { name: "Bangladesh Air Force", image: "/images/our-proud-clients/govt-sector-client/31341bcd8cbf24fd490764da697fc38785bae79b.png" },
  { name: "Bangladesh Police", image: "/images/our-proud-clients/govt-sector-client/b075bed0d1ed024ef61e052153517c0bd815d784.png" },
  { name: "DGFI", image: "/images/our-proud-clients/govt-sector-client/e210540c4cf4023b0601080e627fabc77d4b6360.png" },
  { name: "RAB", image: "/images/our-proud-clients/govt-sector-client/06ad19161fcb0e14aedaf6197eecf67c04d1da6a.png" },
  { name: "Bangladesh Navy", image: "/images/our-proud-clients/govt-sector-client/71da9b9190d1226304eada331cc5639a7099d97d.png" },
];

const GYM_HEALTH_CLUB_CLIENTS = [
  { name: "Kurmitola Golf Club", image: "/images/our-proud-clients/gym-health-club-clients/0799efca0c55635906d163997fed722998a11b79.png" },
  { name: "Gulshan Club", image: "/images/our-proud-clients/gym-health-club-clients/cae48137502504fffdc03c2447f4b118fb61854f.png" },
  { name: "Nordic Club", image: "/images/our-proud-clients/gym-health-club-clients/b3ff0676e056d2a9704a5d8d19cfc2b4e4903705.png" },
  { name: "Ruslan's Studio", image: "/images/our-proud-clients/gym-health-club-clients/d44de68b483d42e0c1a71da8f51c3903981abc7a.png" },
  { name: "Barishal Club Ltd.", image: "/images/our-proud-clients/gym-health-club-clients/f528d2d87fe9256a6db341a0940684bee800d84a.png" },
  { name: "Rayhan Fitness", image: "/images/our-proud-clients/gym-health-club-clients/7a631130b25829fa912fdf61cacae0e4bce58162.png" },
];

const CORPORATE_CLIENTS = [
  { name: "Alliance Properties", image: "/images/our-proud-clients/corporate-clients/2f0ba0a6b5cb4a9cc9939d09237b21ab1c882bcb.png" },
  { name: "Bay Watch", image: "/images/our-proud-clients/corporate-clients/3e430884e0163a24c9ec0886f7195d881ea67a86.png" },
  { name: "Concord", image: "/images/our-proud-clients/corporate-clients/44edbed8715972f3b1baccc7730c7ae3547ab209.png" },
  { name: "Jol Tarongo Resort", image: "/images/our-proud-clients/corporate-clients/5137f13b28dce2b040cdc3e67e055c50da33599a.png" },
  { name: "Metro Group", image: "/images/our-proud-clients/corporate-clients/596edc59c693d859ade944b8d4dbe61cef9aa0b5.png" },
  { name: "Navana Real Estate Ltd.", image: "/images/our-proud-clients/corporate-clients/6b9b753e8e3c6d806e49c229e313a166a1605d97.png" },
  { name: "Nestle Bangladesh", image: "/images/our-proud-clients/corporate-clients/9973c2f02fc8bb7c7157dde86fbe435504e6256b.png" },
  { name: "OSJI Project Meghna", image: "/images/our-proud-clients/corporate-clients/ab50230f2da5779b4f0d4b4aec73ea07fef0c5a9.png" },
  { name: "Rangs Group Ltd", image: "/images/our-proud-clients/corporate-clients/e1bd1c5d12f0791314eba0766affed02cb748648.png" },
  { name: "Rupayan City Uttara", image: "/images/our-proud-clients/corporate-clients/f0f1afff23aa2df9eaf7c326e7ad93bc986f70b8.png" },
  { name: "Ventura Properties", image: "/images/our-proud-clients/corporate-clients/f8827fe9ca657f45d6a715e77f6b33e85ed1a5a3.png" },
  { name: "WHO", image: "/images/our-proud-clients/corporate-clients/fea25c04b9643fc73f49d4469fb2ce283606e20d.png" },
];

const EMBASSIES_UNIVERSITIES_CLIENTS = [
  { name: "Australian Embassy", image: "/images/our-proud-clients/embassies-universities/0076ab786f82d5c7da3a3cb054044f09ae58e098.png" },
  { name: "DIU", image: "/images/our-proud-clients/embassies-universities/286dc40d4c7d36c9c3856d9fb8369e1a8395ac9a.png" },
  { name: "IUB", image: "/images/our-proud-clients/embassies-universities/62e936057f26372bda9c9d08dbbba8ebb8c0a4bb.png" },
  { name: "Pakistan Embassy", image: "/images/our-proud-clients/embassies-universities/b96b6878a23e761779d572606aa98ada1c722432.png" },
  { name: "USA Embassy", image: "/images/our-proud-clients/embassies-universities/e4e0bb3d19fba65cd43d53fac04eef451f799ac3.png" },
  { name: "Thai Embassy", image: "/images/our-proud-clients/embassies-universities/fe063677ffe24824ef5a8850706b1b46e8ee5f7d.png" },
];

export default function OurProudClientsPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <OurProudClientsHero />
      
      {/* Government Sector Clients */}
      <div className="mt-16">
        <ClientCategorySection 
          title="Government Sector Clients" 
          clients={GOVT_SECTOR_CLIENTS} 
        />
      </div>

      {/* Gym & Health Club Clients */}
      <div>
        <ClientCategorySection 
          title="Gym & Health Club Clients" 
          clients={GYM_HEALTH_CLUB_CLIENTS} 
        />
      </div>

      {/* Corporate Clients */}
      <div>
        <ClientCategorySection 
          title="Corporate Clients" 
          clients={CORPORATE_CLIENTS} 
        />
      </div>

      {/* Embassies & Universities */}
      <div>
        <ClientCategorySection 
          title="Embassies & Universities" 
          clients={EMBASSIES_UNIVERSITIES_CLIENTS} 
        />
      </div>
    </main>
  );
}
