import LocationJobBoardClient from "@/components/LocationJobBoardClient";
import { JOB_CATEGORIES, STATES } from "../seo-links";
import { notFound } from "next/navigation";

function getLabel(arr: { value: string; label: string }[], value: string) {
  const found = arr.find((item) => item.value === value);
  return found ? found.label : value;
}
function getStateLabel(abbr: string) {
  const found = STATES.find((s) => s.abbr.toLowerCase() === abbr.toLowerCase());
  return found ? found.name : abbr;
}

interface CatchAllPageProps {
  params: { params: string[] }
}

function normalize(str: string) {
  return str ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
}

export default function LocationsCatchAllPage({ params }: CatchAllPageProps) {
  const pathParams = params.params;
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
  return (
    <div className="h-screen w-screen min-h-0">
      <LocationJobBoardClient city={normalizedCity} state={normalizedState} category={category} title={title} prompt={prompt} />
    </div>
  );
} 