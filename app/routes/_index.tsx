import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, } from "@remix-run/cloudflare";

import { Await, defer, useFetcher, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { Suspense, useState } from "react";
import { FormEntry } from "schema/form";
import { Button } from "~/component/ui/button";
import { Input } from "~/component/ui/input";


export async function loader({
  request,
  context
}: LoaderFunctionArgs) {
  const db = drizzle(context.cloudflare.env.DB)


  const data = db.select().from(FormEntry).all()

  return defer({
    dblist: data
  })
}

export default function Index() {
  const {
    dblist
  } = useLoaderData<typeof loader>()
  const f = useFetcher()
  return (
    <div className="flex flex-col space-y-5 justify-center items-center h-screen">
          <Suspense fallback={<div className="bg-red-500">Loading</div>}>
            <Await resolve={dblist}>
              {(data) => {
                return <div>
                  {data.map((item, index) => {
                    return <div key={index} className="border-2 border-gray-200 p-2 m-2 rounded-lg">
                      <h1>{item.name}</h1>
                      <p>{item.message}</p>
                    </div>
                  })}
                </div>

              }}
            </Await>
          </Suspense>
      
          <f.Form className="space-y-4" method="post">
            <Input placeholder="name" type="text" name="name" required />
            <Input type="text" name="message" required placeholder="message here" />
            <Button className="w-full " type="submit">Submit</Button>

          </f.Form>
      
      
    </div>
  );
}










export async function action({ request, context }: ActionFunctionArgs) {
  const db = drizzle(context.cloudflare.env.DB)
  const formData = await request.formData()
  const name = formData.get("name")!.toString()
  const message = formData.get("message")!.toString()

  try {
    await db.insert(FormEntry).values({
      name,
      message,
    })
  } catch (e) {
    console.log(e)
    return new Response("Error", { status: 500 })
  }
  console.log("bro action not working")
  return "ok"
}
