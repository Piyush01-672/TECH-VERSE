import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null); // FAQ accordion

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email!",
        description: "Please enter a valid email address (with @ and domain).",
        variant: "destructive",
      });
      return;
    }
    const mobileRegex = /^(\+91[-\s]?)?[0]?(91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast({
        title: "Invalid Mobile Number!",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }
    await fetch(`${BACKEND_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating shapes */}
          <div className="absolute top-20 left-16 w-10 h-10 bg-[#4676E6]/70 rounded-full animate-bounce-slow blur-md"></div>
          <div className="absolute top-36 right-12 w-6 h-6 bg-[#FFD54F]/80 rounded-full animate-pulse blur-md"></div>
          <div className="absolute bottom-16 left-1/4 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 right-40 w-16 h-8 bg-[#B16FFF]/70 rounded-3xl animate-bounce-x blur-md"></div>
          <div className="absolute top-8 right-2 w-5 h-5 bg-[#F56060]/80 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-[#36C2A3]/70 rounded-full animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-sm mb-6 tracking-widest animate-fade-in">
            Get In Touch
          </span>
          <h1 className="text-7xl md:auto font-extrabold pb-3 mb-8 animate-fade-in-up bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Have <span className="font-semibold text-[#FFD54F]">Questions</span>{" "}
            or want to{" "}
            <span className="font-semibold text-[#d746ffff]">Collaborate</span>?
            We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
        <div className="mb-12 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground text-center mb-4">
        Let's Connect
      </h2>
      <p className="text-lg text-muted-foreground">
        Whether you're interested in sponsoring, participating, or just want to learn more about TechVerse, we're here to help. Reach out to us through any of the channels below.
      </p>
    </div>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">

              {/* Contact Cards */}
              <div className="grid grid-rows-1 gap-4">
                {[
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    desc: "School of Engineering and Technology\nCT University, Punjab, India - 142023",
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    desc: "techverse@ctuniversity.in",
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    desc: "+91 XXX XXX XXXX (General Inquiries)\n+91 XXX XXX XXXX (Sponsorship)",
                  },
                  {
                    icon: Send,
                    title: "Support",
                    desc: "Reach out for any support or collaboration queries.",
                  },
                ].map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <Card
                      key={i}
                      className="p-6 hover:shadow-lg transition-all border-primary/20 rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#252D6F] to-[#4676E6] rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {c.title}
                          </h3>
                          <p className="text-muted-foreground whitespace-pre-line ">
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Map */}
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3426.393096139894!2d75.55323147539953!3d30.819649674542433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a7873b43231c9%3A0xe42e2905c6bf8817!2sCT%20University!5e0!3m2!1sen!2sin!4v1759928191675!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <p className="text-muted-foreground">
                  CT University, Ferozepur Rd, Sidhwan Khurd, Punjab 142023
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8 border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 XXX XXX XXXX"
                    required
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={10}
                    required
                    className="border-primary/20 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            <div className="mt-4 text-sm text-gray-500">
              We'll respond within 1-2 business days. For urgent issues, call
              our support line.
            </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2">
            {[
              {
                q: "Who can join the club?",
                a: "Any student enrolled at CT University is welcome to apply and be part of the club.",
              },
              {
                q: "Is there a registration fee?",
                a: "Not at all—joining the club is completely free for all CT University students.",
              },
              {
                q: "Is there any requirements to join the club?",
                a: "There are no strict requirements to join the club—just a genuine interest in technology and a willingness to be involved.",
              },
              {
                q: "What activities does the club offer",
                a: "The club hosts a variety of tech-focused events, including workshops, hackathons, guest talks, and hands-on projects to help students grow and collaborate.",
              },
            ].map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <Card
                  key={index}
                  className="p-4 border-primary/20 cursor-pointer transition-all"
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      {faq.q}
                    </h3>
                    <span className="text-2xl font-bold text-foreground select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-muted-foreground transition-all">
                      {faq.a}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
