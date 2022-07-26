import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getPlantListItems } from "~/models/plant.server";
import { Header } from "~/components/Header";
import { PlantList } from "~/components/PlantList";
import { CrossSvg } from "~/styles/cross";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const plantListItems = await getPlantListItems({ userId });
  return json({ plantListItems });
}

export default function PlantsPage() {
  const data = useLoaderData<typeof loader>();
  const route = useLocation();
  const outletIndex = route.pathname.endsWith("/plants");
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Plants" centeredText={user.email} />

      <main className="flex h-full bg-white">
        <PlantList
          plants={data.plantListItems}
          className={outletIndex ? "" : "hidden sm:block"}
        />

        <div className={outletIndex ? "hidden sm:block" : ""}>
          <Link
            to="."
            className="absolute right-2 mt-2 rounded-full bg-green-500 p-3 outline-none hover:rounded-lg hover:bg-green-600 focus:bg-green-400 sm:hidden"
            aria-label="Go back"
          >
            <CrossSvg />
          </Link>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
