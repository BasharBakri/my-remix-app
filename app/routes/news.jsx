import { refineSearchTerm } from "~/models/ai/searchbot.server";
import { json, redirect } from "@remix-run/server-runtime";
import { themeify } from "~/models/ai/themechanger.server";


import { useEffect, useRef } from "react";
import Loading from "~/components/Loader";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";



import { createTheme } from "~/models/theme.server";
import { getTheme } from "~/models/theme.server";

import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";


export async function action({ request }) {
  if (request.method.toLowerCase() === "post") {
    const body = await request.formData();
    const _action = body.get("_action");

    if (_action === "searchBar") {
      const userId = await requireUserId(request);

      const searchTerm = body.get("search");
      if (!searchTerm || searchTerm.trim().length < 4) {
        console.log('Search is invalid');
        return null;
      }
      try {
        const result = await refineSearchTerm(searchTerm);
        const refinedResult = result.data.choices[0].message.content.slice(0, -1);
        return redirect(refinedResult);

      } catch (error) {
        throw error;
      }
    }
    if (_action === "theme") {
      const userId = await requireUserId(request);
      const themeInput = body.get("themeInput");
      if (!themeInput || themeInput.trim().length < 4) {
        console.log('Search is invalid');
        return null;
      } else {

        const theme = await createTheme({ themeInput, userId });
        const currentTheme = await getTheme({ userId });
        console.log('inside actionTheme', currentTheme.themeInput);
        const colorResults = await themeify(currentTheme.themeInput);
        const gptColors = colorResults.data.choices[0].message.content;
        console.log('inside action gptColors', gptColors);
        return json(gptColors);
      }
    }
  }
}

export async function loader({ request }) {
  try {
    const userId = await requireUserId(request);
    return null;


  } catch (error) {
    throw error;
  }
}

export default function NewsPage() {


  const navigation = useNavigation();
  const actionData = useActionData() ?? [];
  const refinedData = actionData.refinedResult ?? '';
  const isSubmitting = navigation.state === 'submitting';
  const fetcher = useFetcher();
  console.log('fetcherData', fetcher.data);
  const loaderData = useLoaderData();
  const user = useUser();

  console.log('action Data', actionData);
  const themeFormRef = useRef();
  useEffect(() => {
    themeFormRef.current.reset();
  }, [fetcher.data]);


  let finalgptColors;

  if (fetcher.data) {
    finalgptColors = JSON.parse(fetcher.data);
    console.log('97', finalgptColors);

  } else {
    console.log('didnt work');
  }


  const defaultColors = {
    headerBG: 'bg-gray-800',
    headertext: 'text-gray-50',
    sideBG: 'bg-gray-100',
    sidetext: 'text-gray-700',
    mainBG: 'bg-gray-50',
    maintext: 'text-gray-900',
  };


  const colors = finalgptColors ? finalgptColors : defaultColors;


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
            className={`rounded bg-gray-600 px-4 py-2 ${colors.headertext} hover:bg-blue-500 active:bg-blue-600`}
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full ">
        <div className={`h-full w-80 border-r ${colors.sideBG} ${colors.sidetext}`}>
          {console.log(colors.sideBG)}
          <Form method="post" className="flex items-center mt-3">
            <input type="text" name="search" placeholder="search" className=" border-2 border-gray-300 rounded-l-md py-2 px-4 w-full focus:outline-none focus:border-gray-500 text-black" />
            <button disabled={isSubmitting} type="submit" name="_action" value="searchBar" className={`${colors.headerBG} text-white font-bold py-2 px-4 rounded-r-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600`}>
              {isSubmitting ? <Loading></Loading> : "🔍"}</button>
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
                  `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                }
                to='trending'
              >
                💹 Trending
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                }
                to='category'
              >
                📫 Category
              </NavLink>
            </li>
            <li >
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                }
                to='country'
              >
                🌍 Location
              </NavLink>
            </li>


          </ol>
          <fetcher.Form ref={themeFormRef} method="post" className="flex items-center mt-4">
            <input

              type="text"
              placeholder="Describe your Theme!" name="themeInput"
              className="border-2 border-gray-300 rounded-l-md py-2 px-4 w-full focus:outline-none focus:border-gray-500 text-black"
            />
            <button
              type="submit"
              name="_action"
              value="theme"
              className={`${colors.headerBG} text-white font-bold py-2 px-4 rounded-r-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600`}
            >
              💻
            </button>
          </fetcher.Form>
        </div>

        <div className={`flex-1 p-6 ${colors.mainBG} ${colors.maintext} overflow-y-auto	`} >
          <Outlet context={[colors.sideBG, colors.sidetext]} />

        </div>
      </main>
    </div>
  );
}


