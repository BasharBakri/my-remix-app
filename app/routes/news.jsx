import { refineSearchTerm } from "~/models/ai/searchbot.server";
import { json, redirect } from "@remix-run/server-runtime";
import { themeify } from "~/models/ai/themechanger.server";
import { personalize } from "~/models/ai/personalizer.server";


import { useEffect, useRef } from "react";
import Loading from "~/components/Loader";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";


import { createSearch } from "~/models/search.server";
import { getSearch } from "~/models/search.server";
import { getAllSearches } from "~/models/search.server";
import { deleteAllSearches } from "~/models/search.server";
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
      if (!searchTerm || searchTerm.trim().length < 3) {
        console.log('Search is invalid');
        return null;
      }
      try {
        const result = await refineSearchTerm(searchTerm);
        const refinedResult = result.data.choices[0].message.content.slice(0, -1);
        const search = await createSearch({
          userSearchString: searchTerm,
          botSearchString: refinedResult,
          userId: userId
        });
        return redirect(refinedResult);

      } catch (error) {
        throw error;
      }
    }
    if (_action === "theme") {
      const userId = await requireUserId(request);
      const themeInput = body.get("themeInput");
      if (!themeInput || themeInput.trim().length < 3) {
        console.log('themeInput is invalid');
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
  const userId = await requireUserId(request);
  const now = new Date();

  try {
    // await deleteAllSearches({ userId });  In case of emergency uncomment
    const allSearches = await getAllSearches({ userId });

    //delete at 7 for checking
    if (allSearches.length >= 7) {
      await deleteAllSearches({ userId });
    }
    const latestSearch = allSearches[0];


    // test out personalize
    if (allSearches.length === 3 || allSearches.length === 6) {
      const personalizedPage = await personalize(allSearches[0].userSearchString, allSearches[1].userSearchString, allSearches[2].userSearchString);
      return json({ allSearches, latestSearch, personalizedPage });
    }



    const timeDifference = now.getTime() - new Date(latestSearch?.createdAt).getTime();
    console.log('timeDifference', timeDifference);
    console.log('should return latestSearch?', timeDifference < 60 * 100);

    if (
      latestSearch &&
      now.getTime() - new Date(latestSearch?.createdAt).getTime() > 60 * 100
    ) {
      // The latest search hasn't happened in the last 6 secs. Must use cookies this is really bad and stupid
      return json({ allSearches, latestSearch: null });
    } else {
      // The user searched last 6 secs
      return json({ allSearches, latestSearch });
    }
  } catch (error) {
    console.error('Error fetching latest search:', error);
    return json({ latestSearch: null });
  }
}

export default function NewsPage() {


  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const fetcher = useFetcher();
  console.log('fetcherData', fetcher.data);
  const loaderData = useLoaderData();
  const user = useUser();
  const jsonPage = loaderData?.personalizedPage || null;
  console.log('LoaderData newsPage', loaderData);

  const themeFormRef = useRef();
  const searchFormRef = useRef();
  useEffect(() => {
    themeFormRef.current.reset();
    searchFormRef.current.reset();
  }, [fetcher.data, loaderData.latestSearch]);


  let finalgptColors;

  if (fetcher.data) {
    finalgptColors = JSON.parse(fetcher.data);
    console.log('97', finalgptColors);

  } else {
    console.log('didnt work');
  }

  let personalPage;

  if (jsonPage) {
    personalPage = JSON.parse(jsonPage);
    console.log(personalPage);
  } else {
    console.log('Personalized didnt  work');
  }

  const defaultColors = {
    headerBG: 'bg-gray-800',
    headertext: 'text-gray-50',
    sideBG: 'bg-gray-100',
    sidetext: 'text-gray-700',
    mainBG: 'bg-gray-50',
    maintext: 'text-gray-900',
  };

  const defaultPage = {
    websiteTitle: 'My News',
    category: 'world',
    categoryEmoji: '🌍',
    mkt: 'en-US',
    trendingEmoji: '💹',
    forYou: '🎯 For You',
    forYouSearch: ''
  };


  const colors = finalgptColors ? finalgptColors : defaultColors;
  const finalPage = personalPage ? personalPage : defaultPage;


  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className={`flex items-center justify-between ${colors.headerBG} p-4 ${colors.headertext}`}>
        <h1 className="text-3xl font-bold">
          <Link to=".">{finalPage.websiteTitle}</Link>
        </h1>
        <Form ref={searchFormRef} method="post" className="flex items-center ">
          <input type="text" name="search" placeholder="search" className="rounded-l-md py-2 px-4 w-96 focus:outline-none  text-black" />
          <button disabled={isSubmitting} type="submit" name="_action" value="searchBar" className={`${colors.sideBG}  font-bold py-2 px-4 rounded-r-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600`}>
            {isSubmitting ? <Loading></Loading> : "🔍"}</button>
        </Form>

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
          <ol>

            <li>
              <NavLink
                className={`block border p-4 text-xs ${isSubmitting ? 'animate-blink' : ''}`}
                to='.'
              >
                {loaderData?.latestSearch ? <p>🔍Results for {loaderData?.latestSearch?.botSearchString}</p> : <p>🔍&nbsp;</p>}
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                }
                to={`trending/${finalPage.mkt}`}
              >
                {finalPage.trendingEmoji} Trending
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                }
                to={`category/${finalPage.category}`}
              >
                {`${finalPage.categoryEmoji} ${finalPage.category.charAt(0).toUpperCase() + finalPage.category.slice(1)}`}
              </NavLink>
            </li>
            <li >
              <NavLink
                className="block border-b p-4 text-xl"
                to={finalPage.forYouSearch}
              >
                {finalPage.forYou}
              </NavLink>
            </li>
            <fetcher.Form ref={themeFormRef} method="post" className="flex items-center p-4">
              <input

                type="text"
                placeholder="Describe your Theme!" name="themeInput"
                className="border-2 border-gray-300 rounded-l-md py-2 px-4 w-60 focus:outline-none focus:border-gray-500 text-black"
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
            <hr />
            <p className="p-4">Search History for: {user.email}</p>
            <hr />
            {loaderData.allSearches && loaderData.allSearches.map((search) => (
              <li key={search.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? colors.mainBG : ""}`
                  }
                  to={search.botSearchString}
                >
                  {search.userSearchString}
                </NavLink>
              </li>
            ))}


          </ol>

        </div>

        <div className={`flex-1 p-6 ${colors.mainBG} ${colors.maintext} overflow-y-auto	`} >
          <Outlet context={[colors.sideBG, colors.sidetext]} />

        </div>
      </main>
    </div>
  );
}


