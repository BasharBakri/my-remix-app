import { Form } from "@remix-run/react";


export default function SearchForm() {



  return (<Form method="get" className="block p-4 text-xl border-spacing-1">
    <input type="text" placeholder="search" />
    <button type="submit" className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-1 px-1 border border-gray-800 rounded">
      search</button>
  </Form>);
}