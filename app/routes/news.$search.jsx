import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";
import SearchCard from "~/components/searchCard";
import { refineSearchTerm } from "~/models/ai/searchbot.server";
import React, { useState, useEffect } from 'react';
import { bingNewsSearch } from "~/models/news/news.server";

import { json, redirect } from "@remix-run/server-runtime";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await } from "@remix-run/react";


export async function loader({ params }) {
  if (params.search.length > 3) {
    const result = await refineSearchTerm(params.search);
    const refinedResult = result.data.choices[0].message.content.slice(0, -1);
    const searchResultsPromise = bingNewsSearch(refinedResult);

    return defer({
      refinedResult: refinedResult,
      searchResults: searchResultsPromise
    });
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

          searchResults.map((newsItem) => {
            const uniqueId = Math.random().toString(32).slice(2);
            return <SearchCard key={uniqueId} data={newsItem} />;
          })
        }
      </Await>
    </Suspense>
  );

  return (
    <>
      <p>{loaderData.refinedResult}</p>
      {isSubmitting ? <p>test</p> : newsGrid}
    </>
  );
}


