import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import universityLogo from "@/assets/univeee-logo.png";
import techverseLogo from "@/assets/techverse-logo.jpg";

const Sponsors = () => {
  // const platinumSponsors = [
  //   {
  //     name: "CT University",
  //     logo: universityLogo,
  //     category: "Education Partner",
  //   },
  // ];

  // const goldSponsors = [
  //   {
  //     name: "Techverse Club",
  //     logo: techverseLogo,
  //     category: "Technology Partner",
  //   },
  // ];

  // const silverSponsors = [
  //   { name: "Tech Company A", initials: "TCA", category: "Tech Partner" },
  //   { name: "Innovation Hub", initials: "IH", category: "Innovation Partner" },
  // ];

  // const communityPartners = [
  //   "Google Developer Groups",
  //   "Microsoft Learn",
  //   "GitHub Campus Experts",
  //   "AWS Educate",
  //   "Intel Developer Zone",
  //   "NVIDIA Deep Learning Institute",
  // ];

  // const benefits = [
  //   {
  //     tier: "Platinum Sponsor",
  //     price: "₹5,00,000+",
  //     benefits: [
  //       "Logo on all promotional materials",
  //       "Booth space at the venue",
  //       "Opening ceremony speaking slot",
  //       "Access to participant resumes",
  //       "Social media promotion",
  //       "Exclusive networking session",
  //     ],
  //   },
  //   {
  //     tier: "Gold Sponsor",
  //     price: "₹3,00,000",
  //     benefits: [
  //       "Logo on website and banners",
  //       "Booth space at the venue",
  //       "Workshop hosting opportunity",
  //       "Social media mentions",
  //       "Access to final presentations",
  //     ],
  //   },
  //   {
  //     tier: "Silver Sponsor",
  //     price: "₹1,50,000",
  //     benefits: [
  //       "Logo on website",
  //       "Promotional materials distribution",
  //       "Social media mentions",
  //       "Certificate of sponsorship",
  //     ],
  //   },
  // ];

  return (
    <div className="min-h-screen pt-10">
      {/* Hero Section */}
      <section className="relative pt-[4.75rem] pb-4 md:py-32 bg-gradient-to-br from-[#252D6F] to-[#4676E6]  text-white overflow-hidden">
        {/* Animated floating shapes (Tech vibes & Colorful) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Blue dot, floats up/down */}
          <div className="absolute top-20 left-16 w-10 h-10 bg-[#4676E6]/70 rounded-full animate-bounce-slow blur-md"></div>
          {/* Gold dot, pulsing */}
          <div className="absolute top-36 right-12 w-6 h-6 bg-[#FFD54F]/80 rounded-full animate-pulse blur-md"></div>
          {/* White ring (rotates) */}
          <div className="absolute bottom-16 left-1/4 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
          {/* Accent purple oval (up/down) */}
          <div className="absolute top-1/2 right-40 w-16 h-8 bg-[#B16FFF]/70 rounded-3xl animate-bounce-x blur-md"></div>
          {/* Small accent dots */}
          <div className="absolute top-16 md:top-8 right-2 w-5 h-5 bg-[#F56060]/80 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-[#36C2A3]/70 rounded-full animate-bounce"></div>
        </div>

        {/* Centered content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-sm mb-6 tracking-widest animate-fade-in">
             Our Partners
          </span>
          <h1 className="text-6xl md:auto  font-extrabold pb-3 mb-8 animate-fade-in-up bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl">
            Sponsors & Partners
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Proud{" "}
            <span className="font-semibold text-[#FFD54F]">Partners </span>
            who believe in{" "}
            <span className="font-semibold text-[#d746ffff]">
              innovation and support{" "}
            </span>
            the next generation of tech leaders
          </p>
        </div>
      </section>

      {/* Platinum Sponsors */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-lg bg-gradient-to-r from-primary to-primary-glow">
              Sponsors
            </Badge>
            <h2 className="text-4xl font-bold text-foreground">
              Coming Soon....
            </h2>
          </div>

          {/* <div className="max-w-2xl mx-auto">
            {platinumSponsors.map((sponsor, index) => (
              <Card
                key={index}
                className="p-12 text-center hover:shadow-glow transition-all duration-300 animate-scale-in border-primary/20"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-32 w-32 mx-auto mb-6 rounded-full object-cover"
                />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {sponsor.name}
                </h3>
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  {sponsor.category}
                </Badge>
              </Card>
            ))}
          </div>*/}
        </div>
      </section> 

      {/* Gold Sponsors */}
      {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-lg bg-gradient-to-r from-accent to-secondary">
              Gold Tier
            </Badge>
            <h2 className="text-4xl font-bold text-foreground">
              Major Partners
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {goldSponsors.map((sponsor, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-glow transition-all duration-300 animate-scale-in border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-24 w-24 mx-auto mb-4 rounded-full object-cover"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {sponsor.name}
                </h3>
                <Badge variant="outline" className="text-accent border-accent">
                  {sponsor.category}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Silver Sponsors */}
      {/* <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-lg bg-muted text-foreground">
              Silver Tier
            </Badge>
            <h2 className="text-4xl font-bold text-foreground">
              Supporting Partners
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {silverSponsors.map((sponsor, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-glow transition-all duration-300 animate-scale-in border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {sponsor.initials}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {sponsor.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sponsor.category}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Community Partners */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {/* <h2 className="text-4xl font-bold text-foreground mb-4">
              Community Partners
            </h2> */}
            <Badge className="mb-4 px-6 py-2 text-lg bg-gradient-to-r from-primary to-primary-glow">
              Community Partners
            </Badge>
            <p className="text-lg text-muted-foreground">
              {/* Technical communities supporting our mission */}
              Coming Soon...
            </p>
          </div>

          {/* <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {communityPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className="font-medium">{partner}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div> */}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      {/* <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Become a Sponsor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Support innovation and connect with the next generation of tech
              talent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((tier, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-glow transition-all duration-300 animate-scale-in border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {tier.tier}
                </h3>
                <p className="text-3xl font-bold text-primary mb-6">
                  {tier.price}
                </p>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-br from-primary to-primary-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in empowering the next generation of innovators and tech
            leaders
          </p>
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg shadow-accent"
          >
            Download Sponsorship Deck
          </Button>
        </div>
      </section> */}
    </div>
  );
};

export default Sponsors;
