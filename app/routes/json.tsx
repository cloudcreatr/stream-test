import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, } from "@remix-run/cloudflare";

import { Await, defer, json, useFetcher, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { Suspense, useState } from "react";
import { FormEntry } from "schema/form";
import { Button } from "~/component/ui/button";
import { Input } from "~/component/ui/input";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        {
            name: "description",
            content: "Welcome to Remix! Using Vite and Cloudflare!",
        },
    ];
};

export default function Index() {


    return (
        <div className="flex flex-col justify-center items-center h-screen">


            <Data />
            <Form />
        </div>
    );
}

export async function loader({
    request,
    context
}: LoaderFunctionArgs) {
    const db = drizzle(context.cloudflare.env.DB)


    const data = await db.select().from(FormEntry).all()

    return json({
        dblist: data
    })
}

function Data() {
    const db = useLoaderData<typeof loader>()
    return (
        <div className="flex flex-row justify-center items-center" >
            <p className=" bg-gray-50 border-2 border-gray-100 rounded-lg shadow-2xl p-6 m-4 font-sans font-bold ">
                <h1>Form Data</h1>


                {db.dblist.map((item, index) => {
                    return <div key={index} className="border-2 border-gray-200 p-2 m-2 rounded-lg">
                        <h1>{item.name}</h1>
                        <p>{item.message}</p>
                    </div>
                })}

            </p>
        </div>

    )
}







function Form() {
    const f = useFetcher()
    return (
        <div className="flex flex-row justify-center items-center" >
            <p className=" bg-gray-50 border-2 border-gray-100 rounded-lg shadow-2xl p-6 m-4 font-sans font-bold ">
                <f.Form className="space-y-4" method="post">
                    <Input placeholder="name" type="text" name="name" required />
                    <Input type="text" name="message" required placeholder="message here" />
                    <Button className="w-full " type="submit">Submit</Button>

                </f.Form>
            </p>
        </div>
    )
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
