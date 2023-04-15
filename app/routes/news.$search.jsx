import { useLoaderData, Link, Form, Outlet, useActionData, useFetcher, useNavigation, NavLink } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import SearchCard from "~/components/searchCard";
import { refineSearchTerm } from "~/models/ai/searchbot.server";


export async function loader({ params }) {
  if (params.search.length > 4) {
    const result = await refineSearchTerm(params.search);

    const refinedResult = result.data.choices[0].message.content.slice(0, -1);
    return json(refinedResult);
  } else {
    return null;
  }
  //   console.log(refinedResult);
  //   return refinedResult;
}

export default function NewsSearch({ searchData }) {
  const loaderData = useLoaderData();
  console.log('$searchLoader', loaderData);

  const isSubmitting = useNavigation().state === 'submitting';


  const hasData = searchData && searchData.length === 0;

  const newsGrid = hasData && searchData.map((newsItem) => {
    const uniqueId = Math.random().toString(32).slice(2);
    return <SearchCard key={uniqueId} data={newsItem} />;
  });


  return (
    <>
      <p></p>
      {isSubmitting && !hasData ? (
        <p>Loading...</p>
      ) : (
        newsGrid ?? <p>No search results found.</p>
      )}
    </>
  );

}