import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertCateringInquirySchema } from "@shared/schema";
import type { InsertCateringInquiry } from "@shared/schema";
import { useCreateCateringInquiry } from "@/hooks/use-catering";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Catering() {
  const { mutate, isPending, isSuccess } = useCreateCateringInquiry();

  const form = useForm<InsertCateringInquiry>({
    resolver: zodResolver(insertCateringInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guestCount: 10,
      message: "",
      // Date default handled by user input
    },
  });

  const onSubmit = (data: InsertCateringInquiry) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Unsplash: Banquet table */}
        <img 
          src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwep1rKI8zlLA4Cq0QM6E4jxS6VpsZ62sl1yepanf8W46twKaEDStLQrtld4TvMREvqXuysKl3_2gIN-tqL8TGM1qbuhR5jODKACIR45Ec8C3Gz1h-SHjn_jAddCTHB-U8GMiMZscBkw86pU=s1360-w1360-h1020"
          alt="Catering Event" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Gather & Feast
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto font-light text-white/90"
          >
            Exceptional catering for weddings, corporate events, and private parties.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <h2 className="font-serif text-4xl font-bold text-foreground">Bring the Flavor to Your Event</h2>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Our catering team specializes in creating bespoke menus that reflect the season and your unique taste. 
                Whether you're planning an intimate dinner party for 10 or a wedding for 200, we handle every detail with care.
              </p>
              <ul className="space-y-4 list-disc pl-5 pt-4">
                <li>Customized seasonal menus</li>
                <li>Professional service staff</li>
                <li>Bar service and wine pairing</li>
                <li>Setup and breakdown included</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-8">
               {/* Unsplash: Platter of food */}
              <img 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600" 
                className="rounded-lg shadow-md aspect-square object-cover" 
                alt="Catering 1" 
              />
               {/* Unsplash: Champagne pour */}
              <img 
                src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80&w=600" 
                className="rounded-lg shadow-md aspect-square object-cover mt-8" 
                alt="Catering 2" 
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-border/50 h-fit">
            {isSuccess ? (
              <div className="text-center py-20">
                <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h3 className="font-serif text-3xl font-bold mb-4">Inquiry Received!</h3>
                <p className="text-muted-foreground mb-8">
                  Thanks for reaching out. Our events manager will review your details and get back to you within 24 hours.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-3xl font-bold mb-2">Request a Quote</h3>
                <p className="text-muted-foreground mb-8">Tell us about your event and we'll craft the perfect proposal.</p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Guests</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Type of event, dietary restrictions, special requests..." 
                              className="h-32 resize-none" 
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg"
                    >
                      {isPending ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        "Submit Inquiry"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
