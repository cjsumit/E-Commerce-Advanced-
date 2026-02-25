import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Fashion Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "The quality of products from LUXE is exceptional. Every piece I've purchased has exceeded my expectations. Their attention to detail is remarkable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "I've been a loyal customer for years. The curated selection and customer service are unmatched. Highly recommend for anyone seeking premium quality.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "Shopping at LUXE has transformed my wardrobe. The pieces are timeless and the shopping experience is seamless from start to finish.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-medium uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card p-8 rounded-2xl shadow-soft hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-card-foreground/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-display font-semibold text-card-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
