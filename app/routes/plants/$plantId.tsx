import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePlant, getWaterEventListItems } from "~/models/plant.server";
import { getPlant } from "~/models/plant.server";
import { requireUserId } from "~/session.server";
import { formatDate } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.plantId, "plantId not found");

  const plant = await getPlant({ userId, id: params.plantId });
  if (!plant) {
    throw new Response("Not Found", { status: 404 });
  }
  const waterEvents = await getWaterEventListItems({ plantId: plant.id });

  return json({ plant: plant, waterEvents: waterEvents });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.plantId, "plantId not found");

  await deletePlant({ userId, id: params.plantId });

  return redirect("/plants");
}

export default function PlantDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.plant.name}</h3>
      <p className="py-6">{data.plant.description}</p>
      {data.waterEvents.length > 0 && (
        <>
          <p className="py-6 text-xl font-bold">Watering history:</p>
          <ul className="list-inside list-disc">
            {data.waterEvents.map((event) => (
              <li key={event.id}>{formatDate(event.createdAt)}</li>
            ))}
          </ul>
        </>
      )}
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-green-500  py-2 px-4 text-white hover:bg-green-600 focus:bg-green-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Plant not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
