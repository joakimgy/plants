import type { Plant } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PlantListProps = {
  plants: Pick<Plant, "id" | "name">[];
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const PlantList = ({ plants, className, ...rest }: PlantListProps) => {
  return (
    <div
      className={`h-full w-full border-r bg-slate-700 sm:w-80 ${className}`}
      {...rest}
    >
      <Link to="new" className="block  p-4 text-xl text-green-500">
        + New Plant
      </Link>

      <hr className="border-slate-600" />

      {plants.length === 0 ? (
        <p className="p-4 text-white">No plants added</p>
      ) : (
        <ol>
          {plants.map((plant) => (
            <li key={plant.id}>
              <NavLink
                className={({ isActive }) =>
                  `block border-b border-slate-600 p-4 text-xl text-white ${
                    isActive ? "bg-slate-800" : ""
                  }`
                }
                to={plant.id}
              >
                🌱 {plant.name}
              </NavLink>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
