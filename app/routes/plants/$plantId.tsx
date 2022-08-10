import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePlant } from "~/models/plant.server";
import { getPlant } from "~/models/plant.server";
import {
  createWaterEvent,
  deleteWaterEvent,
  getWaterEventListItems,
} from "~/models/waterEvent.server";
import { requireUserId } from "~/session.server";
import { CrossSvg } from "~/styles/cross";
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
  const formData = await request.formData();
  let action = formData.get("action");
  const userId = await requireUserId(request);

  switch (action) {
    case "delete": {
      invariant(params.plantId, "plantId not found");
      await deletePlant({ userId, id: params.plantId });
      return redirect("/plants");
    }
    case "water": {
      invariant(params.plantId, "plantId not found");
      await createWaterEvent({ plantId: params.plantId, userId });
      return redirect(`/plants/${params.plantId}`);
    }
    case "deleteWaterEvent": {
      const waterEventId = formData.get("waterEventId");
      if (typeof waterEventId !== "string") {
        return json(
          { errors: { name: "Water event id is required", description: null } },
          { status: 400 }
        );
      }
      await deleteWaterEvent({ id: waterEventId, userId });
      return redirect(`/plants/${params.plantId}`);
    }
  }
}

export default function PlantDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-2xl font-bold">{data.plant.name}</h2>
      <p className="py-6">{data.plant.description}</p>
      {data.waterEvents.length > 0 && (
        <>
          <p className="py-4 text-xl font-bold">Watering history:</p>
          <ul className="">
            {data.waterEvents.map((event) => (
              <li key={event.id} className="flex gap-3">
                {formatDate(event.createdAt)}
                <Form method="post" className="flex items-center">
                  <input type="hidden" name="waterEventId" value={event.id} />
                  <button
                    type="submit"
                    name="action"
                    value="deleteWaterEvent"
                    aria-label="delete"
                  >
                    <CrossSvg />
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        </>
      )}
      <hr className="my-4" />
      <div className="inline-flex">
        <Form method="post">
          <button
            type="submit"
            name="action"
            value="water"
            className="mr-4 rounded bg-green-700 py-2 px-4 text-white hover:bg-green-800 focus:bg-green-600"
          >
            Just watered 🌊
          </button>
          <button
            type="submit"
            name="action"
            value="delete"
            className="rounded bg-green-700 py-2 px-4 text-white hover:bg-green-800 focus:bg-green-600"
          >
            Delete
          </button>
        </Form>
      </div>
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
