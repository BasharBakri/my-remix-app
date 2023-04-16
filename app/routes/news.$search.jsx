import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, useOutletContext } from "@remix-run/react";
import SearchCard from "~/components/searchCard";
import { bingNewsSearch } from "~/models/news/news.server";
import { summarizeSearch } from "~/models/ai/summarybot.server";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await } from "@remix-run/react";


export async function loader({ params }) {
  if (params.search) {

    try {

      const searchResultsPromise = bingNewsSearch(params.search);



      const searchResults = await searchResultsPromise;
      const summaryArray = searchResults.map((oneResult) => {
        return {
          name: oneResult.name,
          description: oneResult.description
        };
      });
      console.log('$searchloader26 summary array', summaryArray);
      const summaryResponsePromise = summarizeSearch(params.search, summaryArray);
      return defer({
        searchResults: searchResultsPromise,
        summaryResponse: summaryResponsePromise
      });

    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }

}

export default function NewsSearch() {
  const loaderData = useLoaderData() || '';
  const isSubmitting = useNavigation().state === 'submitting';

  const [bgColor, textColor] = useOutletContext();


  const newsGrid = (
    <Suspense fallback={<p>Loading news...</p>}>
      <Await
        resolve={loaderData?.searchResults}
        errorElement={<p>Error loading news search results!</p>}
      >
        {(searchResults) =>
          searchResults ? (
            searchResults.map((newsItem) => {
              const uniqueId = Math.random().toString(32).slice(2);
              return <SearchCard key={uniqueId} data={newsItem} />;
            })
          ) : (
            <p>Loading search results...</p>
          )}
      </Await>
    </Suspense>
  );

  const summary = (
    <Suspense fallback={<p>Loading summary...</p>}>
      <Await
        resolve={loaderData?.summaryResponse}
        errorElement={<p>Error loading summary!</p>}
      >
        {(summaryResult) => {
          if (summaryResult) {

            console.log("Summary Result:", summaryResult);
            return (
              <div className={`${bgColor} max-w-full overflow-x-hidden p-4`}>
                <pre className={` overflow-x-hidden whitespace-pre-wrap text-sm ${textColor}`}>
                  {summaryResult}
                </pre>
              </div>
            );
          } else {
            return <pre className={`${textColor} ${bgColor}`}>Loading summary...</pre>;
          }
        }}
      </Await>
    </Suspense>
  );

  return (
    <>
      {summary}
      {isSubmitting ? <pre className={`${textColor} ${bgColor}`}>test</pre> : newsGrid}
    </>
  );
}


