/**
 * Single source of truth for everything the site states about the company.
 *
 * Every figure here is taken from the official Kartikey Fasteners company
 * profile deck (and the certificates reproduced in it). Nothing is estimated.
 * If a claim is not in the profile, it is not in this file.
 */

export const company = {
  name: "Kartikey Fasteners",
  tagline: "Manufacturer of all types of quality fasteners in MS, SS & more",
  lineageYear: 1999, // Girdhar Fastners Pvt. Ltd.
  foundedYear: 2018, // Kartikey Fasteners
  hours: "09:00 – 17:30",
  days: "Monday – Saturday",
  phone: "+91 98726 21694",
  phoneHref: "tel:+919872621694",
  address: {
    line1: "Plot No. 166, Phase 9, Industrial Area",
    line2: "Mohali (SAS Nagar), Punjab, India",
  },
  /** Units named on the master machinery list. */
  plots: ["43", "44", "166", "299"],
  plotsLabel: "Plot No. 43, 44, 166 & 299 — Phase 9, SAS Nagar, Mohali, Punjab",
} as const;

/** Floating action button + any "message us" links. */
export const whatsapp = {
  /** International format, digits only — required by wa.me. */
  number: "919872621694",
  label: company.name,
  get href() {
    const text = encodeURIComponent(
      "Hello Kartikey Fasteners, I would like to enquire about your fasteners.",
    );
    return `https://wa.me/${this.number}?text=${text}`;
  },
} as const;

/** Company profile deck, served from /public. */
export const brochure = {
  path: "/kartikey-fasteners-company-profile.pdf",
  filename: "Kartikey-Fasteners-Company-Profile.pdf",
  sizeLabel: "6.3 MB",
} as const;

export const emails = [
  { label: "Managing Director", value: "MD@kartikeyfastener.com" },
  { label: "Quality", value: "quality@kartikeyfastener.com" },
  { label: "Customer Care", value: "customercare@kartikeyfastener.com" },
  { label: "Purchase Orders", value: "po.kartikey@gmail.com" },
  { label: "General", value: "kartikeyfastneres@gmail.com" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Products — the eleven lines listed in the profile                          */
/* -------------------------------------------------------------------------- */

type Product = {
  slug: string;
  code: string;
  name: string;
  image: string;
  blurb: string;
  materials: string;
};

export const products: Product[] = [
  {
    slug: "self-tapping-screws",
    code: "KF-01",
    name: "Self Tapping Screws",
    image: "/img/product/self-tapping.jpg",
    blurb:
      "Pan, csk and truss head self tapping screws formed on our own header and rolling lines. The self-thread point is visually inspected on every rolling batch.",
    materials: "MS · SS",
  },
  {
    slug: "machine-screws",
    code: "KF-02",
    name: "Machine Screws",
    image: "/img/product/machine-screw.jpg",
    blurb:
      "Slotted, phillips and cheese head machine screws in both mild and stainless steel, gauged Go / No-Go on thread diameter after rolling.",
    materials: "MS · SS",
  },
  {
    slug: "foot-bolt",
    code: "KF-03",
    name: "Foot Bolt",
    image: "/img/product/foot-bolt.jpg",
    blurb:
      "Flange-footed bolts for equipment mounting and levelling, cold forged on the 1000 kg bolt former at Plot 43.",
    materials: "MS",
  },
  {
    slug: "hex-bolt",
    code: "KF-04",
    name: "Hex Bolt",
    image: "/img/product/hex-bolt.jpg",
    blurb:
      "Full and part threaded hexagon bolts across a broad length range, zinc plated as standard and available in alternate finishes.",
    materials: "MS · SS",
  },
  {
    slug: "studs",
    code: "KF-05",
    name: "Studs",
    image: "/img/product/studs.jpg",
    blurb:
      "Threaded studs and stud bars rolled to length, supplied plain or with yellow / white zinc passivation.",
    materials: "MS · Brass",
  },
  {
    slug: "brass-screws",
    code: "KF-06",
    name: "Brass Screws",
    image: "/img/product/brass-screw.jpg",
    blurb:
      "Brass screws, nuts and washers for electrical assemblies where conductivity and corrosion behaviour both matter.",
    materials: "Brass",
  },
  {
    slug: "earthing-screws",
    code: "KF-07",
    name: "Earthing Screws",
    image: "/img/product/earthing-screw.jpg",
    blurb:
      "Serrated-flange earthing screws that bite through coating to hold a reliable bond in electrical panels and enclosures.",
    materials: "MS · SS",
  },
  {
    slug: "pop-rivets",
    code: "KF-08",
    name: "Pop Rivets",
    image: "/img/product/pop-rivet.jpg",
    blurb:
      "Blind rivets for single-sided access joints in sheet metal fabrication and appliance assembly.",
    materials: "MS · SS",
  },
  {
    slug: "cage-nut",
    code: "KF-09",
    name: "Cage Nut",
    image: "/img/product/cage-nut.jpg",
    blurb:
      "Spring-retained cage nuts that give a captive thread in thin panel and rack applications.",
    materials: "MS",
  },
  {
    slug: "hinge",
    code: "KF-10",
    name: "Hinge",
    image: "/img/product/hinge.jpg",
    blurb:
      "Formed hinge pins and hardware produced alongside the fastener lines for panel and enclosure builders.",
    materials: "MS",
  },
  {
    slug: "nylock-flange-star",
    code: "KF-11",
    name: "Nylock Nut, Flange Nut & Star Washer",
    image: "/img/product/nylock-flange-washer.jpg",
    blurb:
      "Vibration-resistant nylock nuts, serrated flange nuts and star washers in mild and stainless steel, plated to order.",
    materials: "MS · SS",
  },
];

/* -------------------------------------------------------------------------- */
/*  Manufacturing process — the seven stages documented in the profile         */
/* -------------------------------------------------------------------------- */

type Stage = {
  step: string;
  title: string;
  image: string;
  body: string;
  checks: string[];
};

export const processStages: Stage[] = [
  {
    step: "01",
    title: "Raw Material",
    image: "/img/process/raw-wire-coils.jpg",
    body:
      "MS and SS wire is drawn in from vetted vendors across a full range of diameters. Every invoice arrives with a mill test certificate stating chemical composition and mechanical properties, and wire pieces go out for independent third-party testing.",
    checks: [
      "MTC received with every consignment",
      "Wire diameter verified on vernier caliper",
      "Third-party wire testing with MTC report",
    ],
  },
  {
    step: "02",
    title: "Heading",
    image: "/img/process/heading-floor.jpg",
    body:
      "Wire is cold headed on our own header machines. Tooling is selected per part — the right punch and the right die — and the first-off is dimensioned before the run is released.",
    checks: [
      "Blank dia, head dia & washer dia",
      "Length, head thickness & washer thickness",
      "Micrometer, vernier caliper and bit check",
    ],
  },
  {
    step: "03",
    title: "Rolling",
    image: "/img/process/rolling-machines.jpg",
    body:
      "Threads are formed — not cut — by rolling the blank between dies, deforming the stock so the grain follows the thread profile. Rolling tooling is prepared per screw.",
    checks: [
      "Thread diameter and length",
      "Go / No-Go ring gauge on machine screws",
      "Visual point and thread check, PQC sheet filled",
    ],
  },
  {
    step: "04",
    title: "Heat Treatment",
    image: "/img/process/heat-treatment.jpg",
    body:
      "Where the part or the customer calls for it, material moves to the plating section for hardening and tempering, then is cleaned by acidification or casting cleaning before finishing.",
    checks: [
      "Hardness verified on Rockwell hardness tester",
      "Rotary furnace and tempering to lot",
      "Acidification / casting clean before plating",
    ],
  },
  {
    step: "05",
    title: "Plating",
    image: "/img/process/plating-barrels.jpg",
    body:
      "Barrel plating in zinc, tin, copper or nickel to the specified finish, followed by the dip process — plain zinc or RoHS — and drying.",
    checks: [
      "Zinc, tin, copper and nickel barrels",
      "Plain zinc and RoHS dip process",
      "Thread ring gauge Go / No-Go after plating",
    ],
  },
  {
    step: "06",
    title: "Segregation",
    image: "/img/process/segregation.jpg",
    body:
      "Every plated lot passes through the sorting section, where final quality is judged piece by piece and anything out of spec is pulled from the batch.",
    checks: [
      "Damaged thread and burr on thread",
      "Head out and broken screws",
      "Improper plating",
    ],
  },
  {
    step: "07",
    title: "Packing",
    image: "/img/process/packing-labelled.jpg",
    body:
      "Sorted product is counted, bagged and labelled by size, then packed into branded sacks and cartons ready for dispatch.",
    checks: [
      "Labelled bags identified by size",
      "Branded sacks for bulk quantities",
      "Cartons palletised for dispatch",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Plant & machinery — transcribed from the master machinery list             */
/* -------------------------------------------------------------------------- */

type Machine = {
  machine: string;
  make: string;
  capacity: string;
  qty: number;
};

export const machineryByPlot: { plot: string; role: string; machines: Machine[] }[] = [
  {
    plot: "Plot 43",
    role: "Bolt forming",
    machines: [{ machine: "Bolt Former", make: "SUN", capacity: "1000 kg", qty: 1 }],
  },
  {
    plot: "Plot 44",
    role: "Heading, rolling, slotting & washer assembly",
    machines: [
      { machine: "Header Machine", make: "SUN", capacity: "60 kg", qty: 3 },
      { machine: "Header Machine", make: "Local", capacity: "120 kg", qty: 4 },
      {
        machine: "Header Machine",
        make: "Top Stability Machine Industry Co. Ltd.",
        capacity: "150 kg",
        qty: 1,
      },
      { machine: "Rolling Machine", make: "SUN", capacity: "150 kg", qty: 2 },
      { machine: "Rolling Machine", make: "SUN-J", capacity: "150 kg", qty: 1 },
      {
        machine: "Rolling Machine",
        make: "Chien Tsai Machinery Co. Ltd.",
        capacity: "150 kg",
        qty: 1,
      },
      { machine: "Rolling Machine", make: "Local", capacity: "100 kg", qty: 11 },
      { machine: "Washer Assembly", make: "SUN", capacity: "100 kg", qty: 2 },
      { machine: "Slotter", make: "SUN", capacity: "120 kg", qty: 2 },
      { machine: "Slotter", make: "Local", capacity: "80 kg", qty: 9 },
    ],
  },
  {
    plot: "Plot 166",
    role: "Heading",
    machines: [
      { machine: "Header Machine", make: "SUN", capacity: "120 kg", qty: 6 },
      { machine: "Header Machine", make: "SUN", capacity: "50 kg", qty: 2 },
      {
        machine: "Header Machine",
        make: "Gwo Ling Machinery Company",
        capacity: "50 kg",
        qty: 2,
      },
      { machine: "Header Machine", make: "Local", capacity: "100 kg", qty: 12 },
    ],
  },
  {
    plot: "Plot 299",
    role: "Heat treatment & plating",
    machines: [
      { machine: "Rotary Furnace", make: "Local", capacity: "120 kg / lot", qty: 2 },
      { machine: "Tempering Machine", make: "Local", capacity: "60 kg / lot", qty: 1 },
      { machine: "Zinc Barrel", make: "Local", capacity: "50 kg / lot", qty: 3 },
      { machine: "Zinc Barrel", make: "Local", capacity: "30 kg / lot", qty: 4 },
      { machine: "500 Hrs Plating Barrel", make: "Local", capacity: "30 kg / lot", qty: 2 },
      { machine: "Nickel Barrel", make: "Local", capacity: "30 kg / lot", qty: 2 },
    ],
  },
];

const countOf = (name: string) =>
  machineryByPlot
    .flatMap((p) => p.machines)
    .filter((m) => m.machine.includes(name))
    .reduce((sum, m) => sum + m.qty, 0);

export const machineryStats = {
  total: machineryByPlot.flatMap((p) => p.machines).reduce((s, m) => s + m.qty, 0),
  headers: countOf("Header"),
  rolling: countOf("Rolling"),
  slotters: countOf("Slotter"),
  plating: countOf("Barrel"),
  units: machineryByPlot.length,
};

/* -------------------------------------------------------------------------- */
/*  Test & measurement equipment                                               */
/* -------------------------------------------------------------------------- */

type TestEquipment = {
  equipment: string;
  make: string;
  leastCount: string;
  range: string;
  usedFor: string;
};

export const testEquipment: TestEquipment[] = [
  { equipment: "Micrometer", make: "Baker / Insize", leastCount: "0.01 mm", range: "0 – 25 mm", usedFor: "Dimension" },
  { equipment: "Digital Micrometer", make: "Baker", leastCount: "0.01 mm", range: "0 – 25 mm", usedFor: "Dimension" },
  { equipment: "Digital Vernier Caliper", make: "Insize", leastCount: "0.01 mm", range: "0 – 150 mm", usedFor: "Dimension" },
  { equipment: "Digital Depth Gauge", make: "Insize", leastCount: "0.001 mm", range: "0 – 300 mm", usedFor: "Depth" },
  { equipment: "Thread Ring Gauge", make: "Baker", leastCount: "—", range: "All sizes", usedFor: "Thread & tolerances" },
  { equipment: "Rockwell Hardness Tester", make: "META", leastCount: "—", range: "HRC", usedFor: "Hardness test" },
  { equipment: "Grinding Machine", make: "—", leastCount: "—", range: "—", usedFor: "Carburization test" },
  { equipment: "Hammer", make: "—", leastCount: "—", range: "0.5 kg", usedFor: "Head soundness test" },
  { equipment: "Torque Wrench", make: "Drebon", leastCount: "—", range: "1 – 12 Nm", usedFor: "Torsion test" },
  { equipment: "Torque Tester", make: "Insize", leastCount: "—", range: "1 – 6 Nm", usedFor: "Torque test" },
  { equipment: "Digital Weighing Machine", make: "Samson", leastCount: "0.5 kg", range: "0 – 300 kg", usedFor: "Torsion test" },
  { equipment: "Vision Measuring Machine", make: "Qualitech", leastCount: "—", range: "—", usedFor: "Dimension" },
  { equipment: "Salt Spray Test Chamber", make: "Qualitech", leastCount: "—", range: "—", usedFor: "Finish (SST)" },
];

/* -------------------------------------------------------------------------- */
/*  Certifications — reproduced from the certificates in the profile           */
/* -------------------------------------------------------------------------- */

export const certificationScope =
  "Manufacture of metal fasteners, nails, rivets, tacks, pins, staples, washers, nuts, bolts, screws and other threaded products.";

export const certifications = [
  {
    standard: "ISO 9001:2015",
    system: "Quality Management System",
    certificateNo: "25MEQTV94",
    issued: "05 / 07 / 2025",
    expires: "04 / 07 / 2028",
    surveillance: "05 / 06 / 2026 · 05 / 06 / 2027",
    body: "Magnitude Management Services Pvt. Ltd.",
    accreditation: "EGAC Accredited · IAF",
    image: "/img/quality/iso-9001.jpg",
  },
  {
    standard: "ISO 14001:2015",
    system: "Environmental Management System",
    certificateNo: "25MEETL86",
    issued: "05 / 07 / 2025",
    expires: "04 / 07 / 2028",
    surveillance: "05 / 06 / 2026 · 05 / 06 / 2027",
    body: "Magnitude Management Services Pvt. Ltd.",
    accreditation: "EGAC Accredited · IAF",
    image: "/img/quality/iso-14001.jpg",
  },
] as const;

export const thirdPartyTests = [
  {
    report: "C/2024/214345",
    sample: "Flange Bolt M6 × 10",
    method: "ASTM B-117-2019",
    duration: "500 hours",
    result: "No red rust visible at the end of 500 hrs of testing.",
    image: "/img/quality/indiana-flange-bolt.jpg",
  },
  {
    report: "C/2024/226167",
    sample: "Screw M5 × 45 Torx Head SS",
    method: "ASTM B-117-2019",
    duration: "72 hours",
    result: "Salt spray corrosion test conducted to customer specification.",
    image: "/img/quality/indiana-torx-screw.jpg",
  },
] as const;

export const testingLab = {
  name: "Indiana",
  full: "Indiana Test, Calibration & Certification Services",
  note: "A division of Indiana Ferro Alloys, Mohali",
};

/* -------------------------------------------------------------------------- */
/*  Customers named in the profile                                             */
/* -------------------------------------------------------------------------- */

export const customers = [
  "Haier",
  "Godrej",
  "Voltas",
  "Exide",
  "Microtek",
  "Amara Raja",
  "Livpure",
  "Eureka Forbes",
  "Rockwell",
  "Su-Kam",
  "Pyramid Electronics",
  "Acme Fasteners",
  "Nuctech",
  "Smarten",
  "Walia Electrovision",
  "Veeline",
  "K-Three Appliances",
  "V. K. Group",
  "TVC",
  "Kolors",
  "Ganga Met Co",
  "Capgrid",
  "EAPRO",
  "Electrowaves Electronics",
  "Starion",
  "UTL",
  "Axiom",
  "PG",
] as const;

/* -------------------------------------------------------------------------- */

export const nav = [
  { href: "/products", label: "Products" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/about", label: "About Us" },
  { href: "/quality", label: "Certifications" },
  { href: "/contact", label: "Contact" },
] as const;
