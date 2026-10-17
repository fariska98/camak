export type Service = {id:string;name:string;image:string;alt:string;intro:string;desc:string;items:string[]};
export const services:Service[] = [
  {
    "id": "residential",
    "name": "Residential cleaning",
    "image": "w6.jpg",
    "alt": "Professional cleaner caring for a home",
    "intro": "A clean home. A little more breathing room.",
    "desc": "Come home to a space that feels fresh, comfortable and cared for. From regular housekeeping to a seasonal refresh, we tailor every clean to the way you live.",
    "items": [
      "Weekly, fortnightly or monthly house cleaning",
      "Deep cleaning and spring cleaning",
      "Move-in and move-out cleaning",
      "Window and glass cleaning",
      "Kitchen, bathroom and living area cleaning"
    ]
  },
  {
    "id": "commercial",
    "name": "Commercial cleaning",
    "image": "floor-cleaning.jpg",
    "alt": "Camak cleaner caring for a commercial floor",
    "intro": "A better working day starts with a cleaner space.",
    "desc": "Make the right impression with a clean, hygienic and productive workplace. We create dependable cleaning plans around the needs of your business.",
    "items": [
      "Offices and corporate buildings",
      "Retail shops and showrooms",
      "Schools and childcare centres",
      "Medical and healthcare facilities",
      "Construction and renovation sites"
    ]
  },
  {
    "id": "eco-friendly",
    "name": "Eco-friendly cleaning",
    "image": "hero.jpg",
    "alt": "Camak cleaning equipment in a bright interior with greenery",
    "intro": "Thoughtful cleaning. A lighter footprint.",
    "desc": "Care for your space with eco-conscious products and cleaning methods. Speak with us about options that suit your family, your staff and the environment.",
    "items": [
      "Eco-conscious and non-toxic product options",
      "Cleaning planned around children and pets",
      "Attention to indoor air quality",
      "Window and glass cleaning",
      "A considered approach to everyday cleaning"
    ]
  },
  {
    "id": "specialised",
    "name": "Specialised cleaning",
    "image": "window-cleaning.jpg",
    "alt": "Camak cleaner washing a large glass window",
    "intro": "For the jobs that need a little extra care.",
    "desc": "From a stubborn oven to a post-renovation refresh, we bring the right equipment and attention to detail to the tougher cleaning jobs.",
    "items": [
      "Exterior building and window washing",
      "Sanitisation and disinfection",
      "Event cleanup services",
      "Oven cleaning",
      "Post-construction cleaning"
    ]
  }
];
export const faqs:[string,string,string][] = [
  [
    "Services",
    "What cleaning services do you offer?",
    "We provide residential, commercial, eco-friendly and specialised cleaning across Invercargill and Southland. This includes regular housekeeping, deep cleaning, move-in and move-out cleaning, window cleaning, oven cleaning and sanitisation."
  ],
  [
    "Bookings",
    "How much does a clean cost?",
    "Every space is different. Your quote depends on the size of your property, the type of cleaning and how often you need us. Get in touch for a free, no-obligation quote tailored to your needs."
  ],
  [
    "Bookings",
    "Do I need to supply cleaning products?",
    "No. Our team arrives with professional cleaning equipment and the supplies needed for your clean. Let us know about any specific product preferences or sensitivities when you enquire."
  ],
  [
    "Locations",
    "Which areas do you cover?",
    "We are based in Avenal, Invercargill and serve homes and businesses across Southland, including surrounding suburbs and nearby areas. Contact us to confirm availability at your address."
  ],
  [
    "Services",
    "Are eco-friendly cleaning options available?",
    "Yes. Eco-conscious products and cleaning methods are part of our approach. Ask us about non-toxic product options and tell us about any children, pets or sensitivities so we can discuss the right approach for your space."
  ],
  [
    "Bookings",
    "Can I book a one-off clean?",
    "Absolutely. Choose a one-off clean or a recurring weekly, fortnightly or monthly cleaning plan. We will work with you to find a schedule that suits your home or business."
  ],
  [
    "Services",
    "Do you clean homes in Invercargill?",
    "Yes. Our residential services include regular house cleaning, deep and spring cleaning, window and glass cleaning, and kitchen, bathroom and living area cleaning."
  ],
  [
    "Services",
    "Do you provide commercial cleaning?",
    "Yes. We clean offices, corporate buildings, shops, showrooms, schools, childcare centres, healthcare facilities and construction or renovation sites. Contact us for a cleaning plan that fits your workplace."
  ],
  [
    "Bookings",
    "How do I book a clean with Camak?",
    "Call us, email us or complete our quote enquiry form. Tell us about your space and the cleaning you need, and our team will be in touch to discuss your quote and availability."
  ],
  [
    "Services",
    "Do you offer move-in and move-out cleaning?",
    "Yes. We provide move-in and move-out cleaning to prepare a home for its next occupants. Tell us about the property and any specific requirements when requesting a quote."
  ],
  [
    "Services",
    "What makes Camak different?",
    "We combine attention to detail, reliable scheduling, eco-conscious cleaning practices and a customer-first approach. Our team is locally based and focused on consistent care for Southland homes and businesses."
  ],
  [
    "Services",
    "Can you help with a deep clean?",
    "Yes. Our deep cleaning service tackles built-up dirt, stubborn marks and hard-to-reach areas, helping to refresh your home or workspace."
  ],
  [
    "Services",
    "Are your cleaners trained?",
    "Our cleaning team is trained, briefed and committed to delivering consistent professional results. We arrive with quality equipment and a focus on caring for your space."
  ],
  [
    "Bookings",
    "How often should I schedule a clean?",
    "It depends on your space and your needs. Weekly and fortnightly cleans are popular for ongoing care; monthly or one-off deep cleans are also available. We can help you choose a suitable plan."
  ],
  [
    "Services",
    "Do you offer sanitisation and disinfection?",
    "Yes. Sanitisation and disinfection are available as part of our specialised cleaning services for homes and businesses. Contact us to discuss your requirements."
  ]
];
export const routes = ['/', '/about-us/', '/services/', '/contact-us/', '/faq/', '/sustainability/', '/blog/', '/privacy-policy/', '/terms-of-service/'];
