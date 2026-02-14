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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black/65" />
        {/* Unsplash: Banquet table */}
        <img 
          src="https://lh3.googleusercontent.com/gps-cs-s/AHVAwep8B6GahV5zgzL2F4O6h79GYNl9lAcIdAfZ6CB31pDjhuT0AIXA0NXgSP7BlYGFCWKMcKVuVXhLN0y0m3ulhhwq_lrCmQl-2vExUk7_rH3CmDFXNubE185Qe0hRzAlyMC5wRxPrRt7qQdM=s1360-w1360-h1020"
          alt="Catering Event" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold mb-6 text-primary"
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

      <section className="py-24">
        <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold text-foreground">Bring the Flavor to Your Event</h2>
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
                src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweoeZ-h3EQvIvU-v88BlYPFnMmxF9-Gy-T1s9_Oui2Kz6mWDzTETZNikek4QjjDNQqTp7spWNRmn5tlwR6Nd2n5-WZQhzZZudPksdYu5LPrhSpCsz8SIiEDm3l7AxIkUi1g_IR20=s1360-w1360-h1020" 
                className="aspect-square rounded-lg border border-border/70 object-cover shadow-md" 
                alt="Catering 1" 
              />
               {/* Unsplash: Champagne pour */}
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqUtVvZgoi-ZexSyPk6fkJ5mYbcDn-W88dEbB1Z4jnbzw0E0Bos1EgrG8iWucU05GsESlNdO6l9E87JJGzT5phXG9Bzxvb5W369Rozb3web7DAbHnQuZ4XB4kgHE2SCI24PvDfc689HBKZa=s1360-w1360-h1020" 
                className="mt-8 aspect-square rounded-lg border border-border/70 object-cover shadow-md" 
                alt="Catering 2" 
              />
            </div>
          </div>

          {/* Form */}
          <div className="h-fit rounded-2xl border border-border/70 bg-card p-8 shadow-xl md:p-12">
            {isSuccess ? (
              <div className="text-center py-20">
                <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-primary" />
                <h3 className="mb-4 text-3xl font-semibold text-foreground">Inquiry Received!</h3>
                <p className="mb-8 text-muted-foreground">
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
                <h3 className="mb-2 text-3xl font-semibold text-foreground">Request a Quote</h3>
                <p className="mb-8 text-muted-foreground">Tell us about your event and we'll craft the perfect proposal.</p>
                
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
                      className="h-12 w-full text-lg font-semibold"
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
