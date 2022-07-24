import type { Plant } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PlantListProps = {
  plants: Pick<Plant, "id" | "name">[];
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const PlantList = ({ plants, className, ...rest }: PlantListProps) => {
  return (
    <div
      className={`h-full w-full border-r bg-gray-50 sm:w-80 ${className}`}
      {...rest}
    >
      <Link to="new" className="block p-4 text-xl text-green-500">
        + New Plant
      </Link>

      <hr />

      {plants.length === 0 ? (
        <p className="p-4">No plants yet</p>
      ) : (
        <ol>
          {plants.map((plant) => (
            <li key={plant.id}>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
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
