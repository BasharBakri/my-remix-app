import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";
import SearchCard from "~/components/searchCard";
import { bingNewsSearch } from "~/models/news/news.server";

import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await } from "@remix-run/react";


export async function loader({ params }) {
  if (params.search) {

    try {

      const searchResultsPromise = bingNewsSearch(params.search);

      console.log(searchResultsPromise);

      return defer({
        searchResults: searchResultsPromise
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

  return (
    <>
      {isSubmitting ? <p>test</p> : newsGrid}
    </>
  );
}


