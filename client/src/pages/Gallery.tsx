import { motion } from "framer-motion";

const images = [
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepFijul3fWSLPdoXidz5dbPD6d3kSe3jnYgaa2DLgC28nxjcRSK9Nc6UGAZP7KuDgBjtY3LDBOh8DXTSHxXL6JZev5T4y1n24ske78GR2AME6aApQLHJCr-wd-B4seyOevJzz3VmAqOdzOV=s1360-w1360-h1020",
  "https://lh3.googleusercontent.com/p/AF1QipNczf_jl11D9OFckeNuW7lSd6n67PaQO10niJbc=s1360-w1360-h1020",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepjv_RP076GcVi1pLumJSBMIePro0byPX7_NsS-Gc7k4Jt_DWXiwqczqWOABB2LPe1RT8s4I32NTDD2jSgphc7-b-dHALwBnHYxNZ-k_Ysy8UjoQWbuZ6reUXudHKplZFUa1R3Ucw=s1360-w1360-h1020",
   "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepDLIxuj4DKCu43Nik9Q_C0y8MsRDzYWMagXcUxd40SCNh1RoH6gbzB-kxbOGkRtQTcx35RTDuewyydCrPtxDla1M1mFB8GDSnOhjfVt4g9XKPHLWsbDrYbG7RRflCx2rOHqMUM=s1360-w1360-h1020",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepyH1-qAGsu6v_mXg-6M2SmN_uQ6i3IHEnO_1-39tyHgx80s6jwm0KRFTGfxCmoztSBMd5tfA6Qwmz1Dm5p6dzYXl33QXP7Y7f4E0jU_WSFHlhkDc9Yds9SdBOSo3cKclTVOYefo4bJF1NW=s1360-w1360-h1020",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepH1dCQNkGrfQqlAyqOKfdzMC7EvxLLMKHtZnKqFPb2_THENtZJsKkWaZRflDGOqa6Dy34j6MjG3wYSU9tKizDbvUrgJkMPqqVG7okusNzMJYdUbniZPfn-X_MW5PizL2e8dX7c=s1360-w1360-h1020",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep1rKI8zlLA4Cq0QM6E4jxS6VpsZ62sl1yepanf8W46twKaEDStLQrtld4TvMREvqXuysKl3_2gIN-tqL8TGM1qbuhR5jODKACIR45Ec8C3Gz1h-SHjn_jAddCTHB-U8GMiMZscBkw86pU=s1360-w1360-h1020",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweodK2Nb0pNDWgODUVWcp8fqfFuYPu-OAm2Wiipm4F99IQkvdnWlFOxn3lG8WT-oX-XsqiMAZKFOQIPtecSYFeorhpK4OtAa31-dBHrlxqgZjo8MOo2GyRDzUtAcqeD2gZXECe9gr2fWciE=s1360-w1360-h1020",
   "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep09ByBpeoNwpYE20ek0Ravz6y9VzjiYFPM4-v9iFHxO5JJ71KcDPIx_4PIgH2eL8B5Ij1Vrt5H5vALvIR21Q9HJ1I8cGP6zYo4zSRMSe31QBsxLgc7nc0t553-e797sgb4wrql=s1360-w1360-h1020",
  
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4">A Visual Feast</h1>
          <p className="text-muted-foreground text-lg">Glimpses into our kitchen and dining room.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-xl aspect-square relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
              <img 
                src={src} 
                alt={`Gallery ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
