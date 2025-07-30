import LocationJobBoardClient from "@/components/LocationJobBoardClient";
import { JOB_CATEGORIES, STATES } from "../seo-links";
import { notFound } from "next/navigation";
import { Metadata } from "next";

function getLabel(arr: { value: string; label: string }[], value: string) {
  const found = arr.find((item) => item.value === value);
  return found ? found.label : value;
}
function getStateLabel(abbr: string) {
  const found = STATES.find((s) => s.abbr.toLowerCase() === abbr.toLowerCase());
  return found ? found.name : abbr;
}

interface CatchAllPageProps {
  params: Promise<{ params: string[] }>
}

function normalize(str: string) {
  return str ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
}

export async function generateMetadata({ params }: { params: Promise<{ params: string[] }> }): Promise<Metadata> {
  const { params: pathParams } = await params;
  
  if (!Array.isArray(pathParams) || pathParams.length < 2 || pathParams.length > 3) {
    return {
      title: "Location Not Found - AlliedHealthJobs.au",
      description: "The requested location page could not be found.",
    }
  }

  const state = pathParams[0];
  let city = "";
  let category = "";
  
  if (pathParams.length === 2) {
    category = pathParams[1];
  } else if (pathParams.length === 3) {
    city = pathParams[1];
    category = pathParams[2];
  }

  const categoryLabel = getLabel(JOB_CATEGORIES, category);
  const stateLabel = getStateLabel(state);
  const cityLabel = city
    ? city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  let title = "";
  let description = "";
  let keywords: string[] = [];

  if (cityLabel) {
    title = `${categoryLabel} Jobs in ${cityLabel}, ${stateLabel} - AlliedHealthJobs.au`;
    description = `Find ${categoryLabel.toLowerCase()} jobs in ${cityLabel}, ${stateLabel}. Browse and apply for ${categoryLabel.toLowerCase()} positions in ${cityLabel} and surrounding areas.`;
    keywords = [
      `${categoryLabel.toLowerCase()} jobs ${cityLabel}`,
      `${categoryLabel.toLowerCase()} jobs ${stateLabel}`,
      `${categoryLabel.toLowerCase()} ${cityLabel}`,
      `allied health jobs ${cityLabel}`,
      `healthcare jobs ${cityLabel}`,
      `${categoryLabel.toLowerCase()} careers ${cityLabel}`,
      `allied health ${cityLabel}`,
      `healthcare ${cityLabel}`
    ];
  } else {
    title = `${categoryLabel} Jobs in ${stateLabel} - AlliedHealthJobs.au`;
    description = `Find ${categoryLabel.toLowerCase()} jobs across ${stateLabel}. Browse and apply for ${categoryLabel.toLowerCase()} positions throughout ${stateLabel}.`;
    keywords = [
      `${categoryLabel.toLowerCase()} jobs ${stateLabel}`,
      `${categoryLabel.toLowerCase()} ${stateLabel}`,
      `allied health jobs ${stateLabel}`,
      `healthcare jobs ${stateLabel}`,
      `${categoryLabel.toLowerCase()} careers ${stateLabel}`,
      `allied health ${stateLabel}`,
      `healthcare ${stateLabel}`
    ];
  }

  const url = `https://alliedhealthjobs.au/locations/${pathParams.join('/')}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'AlliedHealthJobs.au',
      images: [
        {
          url: '/Logo.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/Logo.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function LocationsCatchAllPage({ params }: CatchAllPageProps) {
  const { params: pathParams } = await params;
  // pathParams: [state, category] or [state, city, category]
  if (!Array.isArray(pathParams) || pathParams.length < 2 || pathParams.length > 3) {
    notFound();
  }
  const state = pathParams[0];
  let city = "";
  let category = "";
  if (pathParams.length === 2) {
    category = pathParams[1];
  } else if (pathParams.length === 3) {
    city = pathParams[1];
    category = pathParams[2];
  }
  const categoryLabel = getLabel(JOB_CATEGORIES, category);
  const stateLabel = getStateLabel(state);
  const cityLabel = city
    ? city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  let title = "";
  if (cityLabel) {
    title = `${categoryLabel} Jobs in ${cityLabel}, ${stateLabel}`;
  } else {
    title = `${categoryLabel} Jobs in ${stateLabel}`;
  }
  const prompt = "Browse and apply for jobs below.";
  // Normalize state and city for the API/database
  const normalizedState = normalize(state);
  const normalizedCity = normalize(city);

  // Generate structured data for location-based job search
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": `Find ${categoryLabel.toLowerCase()} jobs in ${cityLabel || stateLabel}`,
    "url": `https://alliedhealthjobs.au/locations/${pathParams.join('/')}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://alliedhealthjobs.au"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Locations",
          "item": "https://alliedhealthjobs.au/locations"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": stateLabel,
          "item": `https://alliedhealthjobs.au/locations/${state}`
        },
        ...(cityLabel ? [{
          "@type": "ListItem",
          "position": 4,
          "name": cityLabel,
          "item": `https://alliedhealthjobs.au/locations/${state}/${city}`
        }] : []),
        {
          "@type": "ListItem",
          "position": cityLabel ? 5 : 4,
          "name": categoryLabel,
          "item": `https://alliedhealthjobs.au/locations/${pathParams.join('/')}`
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="h-screen w-screen min-h-0">
        <LocationJobBoardClient city={normalizedCity} state={normalizedState} category={category} title={title} prompt={prompt} />
      </div>
    </>
  );
} 