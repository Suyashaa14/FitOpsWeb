const FIRST_NAMES = ["Ram","Hari","Sita","Aakash","Priya","Rohan","Bina","Sajan","Asha","Manish","Sunita","Kavi","Dipa","Niraj","Pratima","Sandeep","Riya","Anil","Gita","Karan","Maya","Suresh","Tara","Deepak","Smita","Bishnu","Aarav","Ishita","Yog","Sneha"];
const LAST_NAMES = ["Sharma","Adhikari","Thapa","Karki","Shrestha","KC","Lama","Rana","Bhandari","Pandey","Pokhrel","Magar","Gurung","Tamang","Joshi"];

function makeMembers(n) {
  const today = new Date("2026-05-12");
  const members = [];
  const packages = ["Basic","Standard","Premium"];
  const statuses = ["active","active","active","active","pending","expired","active","deactivated"];
  for (let i = 0; i < n; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const daysOffset = ((i * 13) % 60) - 8;
    const expiry = new Date(today); expiry.setDate(today.getDate() + daysOffset);
    members.push({
      id: 1000 + i,
      name: `${fn} ${ln}`,
      phone: `98${(40000000 + i * 13371).toString().slice(0,8)}`,
      gender: i % 3 === 0 ? "F" : "M",
      address: ["Kathmandu","Lalitpur","Bhaktapur","Pokhara","Biratnagar"][i % 5],
      package: packages[i % 3],
      status: daysOffset < 0 ? "expired" : statuses[i % statuses.length],
      start: new Date(today.getTime() - (90 - daysOffset) * 86400000).toISOString().slice(0,10),
      expiry: expiry.toISOString().slice(0,10),
      daysLeft: daysOffset,
      payment: i % 4 === 0 ? "pending" : "paid",
      lastVisit: i % 5 === 0 ? "Today" : ["Yesterday","2 days ago","3 days ago","1 week ago"][i % 4],
      checkInsThisMonth: (i * 3 + 5) % 24,
    });
  }
  return members;
}

export const MOCK_MEMBERS = makeMembers(42);

export const MOCK_PACKAGES = [
  { id: 1, name: "Basic",    duration: "1 Month",  price: 2000,  features: ["Gym access","Locker"], members: 14, color: "var(--muted)" },
  { id: 2, name: "Standard", duration: "3 Months", price: 5000,  features: ["Gym access","Locker","Group classes"], members: 22, color: "var(--info)" },
  { id: 3, name: "Premium",  duration: "1 Year",   price: 18000, features: ["Gym access","Locker","Group classes","Personal trainer","Nutrition plan"], members: 6, color: "var(--accent)" },
];

export const MOCK_GYMS = [
  { id: 1, name: "Iron Forge Fitness",   owner: "Suman Adhikari", city: "Kathmandu", members: 248, status: "active", plan: "Pro",   joined: "2025-08-12", sms: 1240 },
  { id: 2, name: "Pulse Athletic Club",  owner: "Reema Karki",    city: "Lalitpur",  members: 142, status: "active", plan: "Basic", joined: "2025-11-04", sms: 380  },
  { id: 3, name: "Apex Strength Co.",    owner: "Bipin Thapa",    city: "Pokhara",   members: 87,  status: "active", plan: "Pro",   joined: "2026-01-18", sms: 612  },
  { id: 4, name: "Vertex Gym",           owner: "Anita Shrestha", city: "Biratnagar",members: 56,  status: "trial",  plan: "Trial", joined: "2026-04-22", sms: 84   },
  { id: 5, name: "Core Performance",     owner: "Deepak KC",      city: "Bhaktapur", members: 198, status: "active", plan: "Pro",   joined: "2025-06-30", sms: 980  },
  { id: 6, name: "Titan Lifting Club",   owner: "Manju Rana",     city: "Butwal",    members: 34,  status: "deactivated", plan: "Basic", joined: "2025-10-15", sms: 120 },
];

export const MOCK_SMS_TEMPLATES = [
  { id: 1, name: "Expiry Reminder",  body: "Hello {name}, your membership expires on {expiry_date}. Please renew your package.", usedCount: 142 },
  { id: 2, name: "Welcome Message",  body: "Welcome {name} to Iron Forge Fitness. Your membership is now active.", usedCount: 86 },
  { id: 3, name: "Payment Reminder", body: "Hi {name}, your payment for {package} is pending. Please contact reception.", usedCount: 41 },
  { id: 4, name: "Holiday Notice",   body: "Hi {name}, the gym will be closed on {date} for a public holiday. See you the next day!", usedCount: 12 },
];
