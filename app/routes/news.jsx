import { bingNewsSearch } from "~/models/news/news.server";
import { refineSearchTerm } from "~/models/ai/searchbot.server";
import { summarizeSearch } from "~/models/ai/summarybot.server";
import { json } from "@remix-run/server-runtime";
import { themeify } from "~/models/ai/themechanger.server";
import { useEffect } from "react";
import { createUserSession } from "~/session.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";


import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";

import NewsCard from "./news.$newsId";

import Summary from "./news.summary";


export async function action({ request }) {
  if (request.method.toLowerCase() === "post") {
    const body = await request.formData();
    const _action = body.get("_action");


    if (_action === "searchBar") {

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
        const summaryArray = searchResults.map((oneResult) => {
          return {
            name: oneResult.name,
            description: oneResult.description
          };
        });

        const summaryResponse = await summarizeSearch(refinedResult, summaryArray);
        const summaryResult = summaryResponse.data.choices[0].message.content;
        console.log('jsx40 action', typeof summaryResult);
        const responseObject = {


          searchResults: searchResults,
          refinedResult: refinedResult,
          summaryResult: summaryResult
        };

        // Return the responseObject
        return json(responseObject);

      } catch (error) {
        throw error;
      }
    }
    if (_action === "theme") {
      const themeInput = body.get("themeInput");
      if (!themeInput || themeInput.trim().length < 4) {
        console.log('Search is invalid');
        return null;
      } else {
        console.log(themeInput);

        const colorResults = await themeify(themeInput);
        const gptColors = colorResults.data.choices[0].message.content;
        const responseObject = {

          empty: '',
          gptColors: gptColors,

        };
        return json(gptColors);
      }
    }
  }
}

export async function loader({ request }) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}


export default function NewsPage() {
  const navigation = useNavigation();
  const actionData = useActionData() ?? [];
  const searchData = actionData.searchResults ?? [];
  const summaryResult = actionData.summaryResult ?? '';
  console.log('jsx92', summaryResult);
  const refinedData = actionData.refinedResult ?? '';
  console.log('fetcherdata:', typeof actionData);
  const isSubmitting = navigation.state === 'submitting';
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  const user = useUser();

  console.log('loader Data', loaderData);


  let finalgptColors;

  if (actionData.includes('headerBG')) {
    // If headerBG key exists, assign all keys to a new object
    finalgptColors = JSON.parse(actionData);
    console.log('97', finalgptColors);

  } else {
    console.log('didnt work');
  }

  console.log('outsideIF', finalgptColors);

  const defaultColors = {
    headerBG: 'bg-gray-800',
    headertext: 'text-gray-50',
    sideBG: 'bg-gray-100',
    sidetext: 'text-gray-700',
    mainBG: 'bg-gray-50',
    maintext: 'text-gray-900',
  };


  const colors = finalgptColors ? finalgptColors : defaultColors;
  console.log('gpt colors after checjk', finalgptColors);

  console.log('colors final check', colors);
  console.log('color 1 key after check', colors.headerBG);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className={`flex items-center justify-between ${colors.headerBG} p-4 ${colors.headertext}`}>
        <h1 className="text-3xl font-bold">
          <Link to=".">myNews</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-gray-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full ">
        <div className={`h-full w-80 border-r ${colors.sideBG} ${colors.sidetext}`}>
          {console.log(colors.sideBG)}
          <Form method="post" className="flex items-center mt-4">
            <input type="text" name="search" placeholder="search" className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <button type="submit" name="_action" value="searchBar" className="bg-gray-900 hover:bg-blue-700 text-white font-bold px-4 py-2 border border-gray-800 rounded inline">
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
            <li className={colors.maintext}>
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
          <fetcher.Form method="post" className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Describe your Theme!" name="themeInput"
              className="border-2 border-gray-300 rounded-l-md py-2 px-4 w-full focus:outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              name="_action"
              value="theme"
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded-r-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              💻
            </button>
          </fetcher.Form>
        </div>

        <div className={`flex-1 p-6 ${colors.mainBG} ${colors.maintext}`} >
          <Outlet />

          {
            summaryResult.length > 1 ? (
              isSubmitting ? (
                <p>Loading...</p>
              ) : (
                <Summary summary={summaryResult} />
              )
            ) : <p className={`${colors.sideBG}`}>Summary bot</p>
          }

          {isSubmitting ?? isSubmitting ? <p >Loading...</p> : searchData.map((newsItem) => {
            const uniqueId = Math.random().toString(32).slice(2);
            return <NewsCard key={uniqueId} data={newsItem} />;
          })}
        </div>
      </main>
    </div>
  );
}


