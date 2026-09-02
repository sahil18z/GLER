import type {
  ServiceProvider,
  ProviderStatus,
  VendorType,
  ServiceOffering,
} from '../types';

/** Deterministic PRNG so the mock dataset is identical on every load. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Adam', 'Albert', 'Lisa', 'Grace', 'Oliver', 'Amelia', 'Harry', 'Sophie',
  'Jack', 'Mia', 'Noah', 'Ella', 'Leo', 'Freya', 'Arthur', 'Isla',
  'Charlie', 'Poppy', 'George', 'Ivy', 'Henry', 'Florence', 'Theo', 'Willow',
];

const LAST_NAMES = [
  'Jones', 'Watson', 'Anderson', 'Bennett', 'Clarke', 'Dawson', 'Ellis',
  'Fisher', 'Grant', 'Hughes', 'Irwin', 'Jenkins', 'Knight', 'Lloyd',
  'Morgan', 'Newman', 'Owens', 'Palmer', 'Quinn', 'Reid', 'Shaw', 'Turner',
  'Underwood', 'Vaughan',
];

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'app.com', 'proton.me', 'yahoo.com'];

const POSTCODES = [
  'SW1A 1AA', 'M1 1AE', 'OX1 2JD', 'EC1A 1BB', 'W1A 0AX', 'B33 8TH',
  'CR2 6XH', 'DN55 1PT', 'NW1 6XE', 'LS1 4DY', 'BS1 4ST', 'CF10 1EP',
  'EH1 1RE', 'G1 1XW', 'L1 8JQ', 'NE1 4ST', 'S1 2HE', 'CB2 1TN',
];

const COUNTRIES = ['United Kingdom'];
const VENDOR_TYPES: VendorType[] = ['Independent', 'Company'];
const SERVICE_OFFERINGS: ServiceOffering[] = [
  'Housekeeping',
  'Window Cleaning',
  'Car Valet',
];
const COMPANY_SUFFIX = ['Solutions', 'Services', 'Group', 'Cleaning Co', 'Care'];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)];
}

function makeProviders(count: number): ServiceProvider[] {
  const rng = mulberry32(20250901);
  const rows: ServiceProvider[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    const vendorType = pick(rng, VENDOR_TYPES);
    const serviceOffering = pick(rng, SERVICE_OFFERINGS);

    // Weight the statuses so most rows are resolved but a few stay "Pending" ("—").
    const statusRoll = rng();
    const status: ProviderStatus =
      statusRoll < 0.6 ? 'Onboarded' : statusRoll < 0.88 ? 'Rejected' : 'Pending';

    const emailLocal = `${first}.${last}`.toLowerCase().replace(/\s+/g, '');
    const email = `${emailLocal}@${pick(rng, EMAIL_DOMAINS)}`;

    const name =
      vendorType === 'Company'
        ? `${last} ${pick(rng, COMPANY_SUFFIX)}`
        : `${first} ${last}`;

    // Phone: UK style "+44 20 7946 0XXX"
    const phone = `+44 20 7946 ${pad(Math.floor(rng() * 90) + 10)}${pad(
      Math.floor(rng() * 90) + 10
    )}`;

    // Dates spread across 2023-01 .. 2025-08
    const year = 2023 + Math.floor(rng() * 3);
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    const cappedYear = year === 2025 && month > 8 ? 2024 : year;
    const signupDate = `${cappedYear}-${pad(month)}-${pad(day)}`;

    rows.push({
      id: `sp-${pad(i + 1)}`,
      name,
      email,
      phone,
      postcode: pick(rng, POSTCODES),
      country: pick(rng, COUNTRIES),
      vendorType,
      serviceOffering,
      signupDate,
      status,
      note: rng() < 0.18 ? 'Prefers weekday morning bookings.' : '',
    });
  }

  return rows;
}

/** 64 rows -> 7 pages at 10 rows/page, and still multi-page after most filters. */
export const SERVICE_PROVIDERS: ServiceProvider[] = makeProviders(64);

export const PAGE_SIZE = 10;
