import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, } from "@remix-run/cloudflare";

import { Await, defer, useFetcher, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { Suspense, useState } from "react";
import { FormEntry } from "schema/form";
import { Button } from "~/component/ui/button";
import { Input } from "~/component/ui/input";



export default function Index() {
  const db = useLoaderData<typeof loader>()
  const f = useFetcher()
  return (
    <div className="flex flex-col justify-center items-center h-screen">


      <div className="flex flex-row justify-center items-center" >
        <p className=" bg-gray-50 border-2 border-gray-100 rounded-lg shadow-2xl p-6 m-4 font-sans font-bold ">
          <h1>Form Data</h1>

          <Suspense fallback={<div className="bg-red-500">Loading</div>}>
            <Await resolve={db.dblist}>
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
        </p>
      </div>
      <div className="flex flex-row justify-center items-center" >
        <p className=" bg-gray-50 border-2 border-gray-100 rounded-lg shadow-2xl p-6 m-4 font-sans font-bold ">
          <f.Form className="space-y-4" method="post">
            <Input placeholder="name" type="text" name="name" required />
            <Input type="text" name="message" required placeholder="message here" />
            <Button className="w-full " type="submit">Submit</Button>

          </f.Form>
        </p>
      </div>
    </div>
  );
}

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
