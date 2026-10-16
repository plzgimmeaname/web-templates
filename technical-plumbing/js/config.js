/* site settings - edit this file to customize the whole site.
   any {{key}} written in a .html file is replaced with the value below. */

const SITE_CONFIG = {
  // business info
  name: "Your Business Name",
  shortName: "Your Business", // used in short mentions inside review text etc.
  legalName: "Your Business Name LLC",
  tagline: "Your City, ST · Your Tagline",
  domain: "yourdomain.com",
  city: "Your City",
  cityState: "Your City, ST",
  address: "123 Main St, Your City, ST 12345",
  licenseNumber: "[PLACEHOLDER]",
  hours: "Mon–Fri 9am–5pm",

  // phone: display is what people see, tel is the dialable number
  phoneDisplay: "(555) 555-0100",
  phoneTel: "+15555550100",

  // contact form: create a free form at formspree.io and paste the endpoint here.
  // leave empty to just show the thank-you message without sending anything.
  formEndpoint: "",

  // map embed search text (used by every iframe with a data-map-zoom attribute)
  mapQuery: "Your Business Name, 123 Main St, Your City, ST 12345",

  // colors - these override the css variables in css/style.css
  theme: {
    "--navy": "#16233a",
    "--navy-dark": "#0d1524",
    "--navy-mid": "#223350",
    "--orange": "#e75a26",
    "--orange-dark": "#c4471a",
    "--off-white": "#f7f5f1",
  },

  // top navigation links (key must match the data-page attribute on each page's <body>)
  nav: [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About", key: "about" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "gallery.html", label: "Gallery", key: "gallery" },
    { href: "reviews.html", label: "Reviews", key: "reviews" },
    { href: "service-areas.html", label: "Service Areas", key: "service-areas" },
  ],

  // small badges shown in the top bar
  topBadges: [
    "&#9989; Licensed &amp; Insured",
    "&#127968; Locally Owned &amp; Operated",
    "&#9201; Fast Response",
  ],

  // footer blurb and link columns
  footerBlurb:
    "A short description of your business and who you serve goes here.",
  footerInsurance: "Fully insured",
  footerCompany: [
    { href: "about.html", label: "About Us" },
    { href: "gallery.html", label: "Our Work" },
    { href: "reviews.html", label: "Reviews" },
    { href: "financing.html", label: "Financing" },
  ],
  footerServices: [
    { href: "service-one.html", label: "Service One" },
    { href: "service-two.html", label: "Service Two" },
    { href: "service-three.html", label: "Service Three" },
    { href: "service-four.html", label: "Service Four" },
  ],
};
