import { Link } from "@remix-run/react";

export default function PlantIndexPage() {
  return (
    <p>
      No plant selected. Select a plant on the left, or{" "}
      <Link to="new" className="text-slate-800 underline">
        add a new plant.
      </Link>
    </p>
  );
}
