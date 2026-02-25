import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Contact Us
            </h1>
            <p className="text-muted-foreground mt-4">
              Have a question or need assistance? We're here to help. Reach out and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-2xl shadow-soft">
              <h2 className="font-display text-2xl font-bold text-card-foreground mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Get in touch
                </h2>
                <p className="text-muted-foreground">
                  We value every customer and strive to provide exceptional service. Whether you have a question about our products, need help with an order, or just want to say hello, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "hello@luxe.com",
                    subtitle: "We'll respond within 24 hours",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+1 (555) 123-4567",
                    subtitle: "Mon-Fri, 9am-6pm EST",
                  },
                  {
                    icon: MapPin,
                    title: "Address",
                    content: "123 Fashion Avenue",
                    subtitle: "New York, NY 10001",
                  },
                  {
                    icon: Clock,
                    title: "Business Hours",
                    content: "Monday - Friday",
                    subtitle: "9:00 AM - 6:00 PM EST",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-foreground">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=450&fit=crop"
                  alt="Location map"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
