
import { refineSearchTerm } from "~/models/ai/searchbot.server";
// import { json } from "@remix-run/server-runtime";

import { useLoaderData, Link, Form, Outlet, useActionData } from "@remix-run/react";


// 

export async function action({ request }) {
  if (request.method.toLowerCase() === "post") {
  const body = await request.formData();
  const searchTerm = body.get("search");
  
  if(!searchTerm || searchTerm.trim().length < 4){
    console.log('Search is invalid');
    return null;
  }
  try {
    const result = await refineSearchTerm(searchTerm);
    console.log(result);
    const refinedResult = result.data.choices[0].message.content;
    return refinedResult;
  } catch (error) {
    throw error;
  }
}
}

export default function NewsPage() {
  const data = useActionData();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">News</Link>
        </h1>
        <p>email</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Form method="post" className="block p-4 text-xl border-spacing-1">
            <input type="text" name="search" placeholder="search" />
            <button type="submit" className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-1 px-1 border border-gray-800 rounded">
              search</button>
          </Form>
          <hr />
          {data? <p>Searching for: {data}</p> : <p>&nbsp;</p>}
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


// export async function loader() {
  
//   try {
//     const result = await refineSearchTerm();
//     console.log("Status:", result.status);
//     console.log("Status Text:", result.statusText);
//     console.log("Request ID:", result.headers['x-request-id']);
//     console.log("Tokens used:", result.data.usage.total_tokens);
//     console.log("Refined search term:", result.data.choices[0].message.content);
//     const refinedSearchTerm = result.data.choices[0].message.content;
//     return json({ refinedSearchTerm });
//   } catch (error) {
//     throw error;
//   }
// }