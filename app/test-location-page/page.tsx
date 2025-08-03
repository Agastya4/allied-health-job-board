import { STATES, CITIES, JOB_CATEGORIES } from "../locations/seo-links"

export default function TestLocationPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Location Page Test</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">STATES:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(STATES, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">CITIES:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(CITIES, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">JOB_CATEGORIES:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(JOB_CATEGORIES, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test State Matching:</h2>
        <div className="space-y-2">
          {STATES.map(state => (
            <div key={state.abbr} className="p-2 border rounded">
              <strong>{state.abbr}</strong>: {state.name} (normalized: {state.abbr.toLowerCase()})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 