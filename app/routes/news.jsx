import { bingNewsSearch } from "~/models/news/news.server";
import { refineSearchTerm } from "~/models/ai/searchbot.server";
import { json } from "@remix-run/server-runtime";


import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";

import NewsCard from "./news.newsId";
import MyComponent from "./summary";

export async function action({ request }) {
  if (request.method.toLowerCase() === "post") {
    const body = await request.formData();
    const searchTerm = body.get("search");

    if (!searchTerm || searchTerm.trim().length < 4) {
      console.log('Search is invalid');
      return null;
    }
    try {
      const result = await refineSearchTerm(searchTerm);
      const refinedResult = result.data.choices[0].message.content.slice(0, -1);
      const searchResults = await bingNewsSearch(refinedResult);
      console.log('searchresults news.jsx23:', refinedResult);
      console.log('searchresults news.jsx24:', searchResults);
      const responseObject = {
        searchResults: searchResults,
        refinedResult: refinedResult,
      };

      // Return the responseObject
      return json(responseObject);

    } catch (error) {
      throw error;
    }
  }
}




export default function NewsPage() {
  const navigation = useNavigation();
  const actionData = useActionData() ?? [];
  const searchData = actionData.searchResults ?? [];
  const refinedData = actionData.refinedResult;
  console.log('ActionData:', actionData);



  const isSubmitting = navigation.state === 'submitting';







  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">myNews</Link>
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
            <input type="text" name="search" placeholder="search" className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <button type="submit" className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-0.5 px-0.8 border border-gray-800 rounded inline">
              {isSubmitting ? "🔎..." : "🔍"}</button>
          </Form>
          <hr />
          <ol>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xs  }`
                }
                to='.'
              >
                🔍 {refinedData ? `Results for ${refinedData} ` : ''}
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
                to='trending'
              >
                💹 Trending
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
                to='category'
              >
                📫 Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
                to='country'
              >
                🌍 Location
              </NavLink>
            </li>

          </ol>

        </div>
        <div className="flex-1 p-6">


          {isSubmitting ? <p>Loading...</p> : searchData.map((newsItem) => {
            const uniqueId = Math.random().toString(32).slice(2);
            return <NewsCard key={uniqueId} data={newsItem} />;
          })}
        </div>
        <Outlet />
      </main>
    </div>
  );
}


