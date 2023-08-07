"use client"

import { useState } from "react";
import { setData } from "./actions";

export default function Home() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false);

  async function formAction(data: FormData) {
    const response = await setData(data);
    setLoading(false);
    console.log(response);
    setSuggestions(JSON.parse(response)["suggestions"]);
  }

  const formSubmit = () => {
    setLoading(true);
  }

  return (
    <div className="bg-gradient-radial flex flex-col min-h-screen w-full items-center justify-start from-blue-900 to-slate-900 text-white">
      <form action={formAction} onSubmit={formSubmit} className="mt-0 flex h-fit w-[800px] flex-col gap-4 rounded-none bg-slate-900 py-4 px-6 opacity-80 shadow-2xl sm:mt-4 sm:rounded-xl">
        <div className="flex flex-col gap-1">
          <label>User story:</label>
          <textarea
            name="story"
            placeholder="User story..."
            className="w-full h-[400px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
          />
        </div>
        <button type="submit">Check story</button>
      </form>
      <div className="flex flex-col mt-4 gap-4 h-fit w-[800px]">
        {loading ? <strong>Loading...</strong> : null}
        {(suggestions).map((prop, i) => {
          if (!prop['should_be_changed']) {
            return null;
          }
          if (prop['property_reference'] === 'user_personas') {
            return <div key={i}>
              <strong>{prop['title']}: </strong>
              {(prop['new_content'] as {name: string, description: string, characteristics_goals: string}[]).map((e) => {

                return <div className="ml-2" key={e.name}>
                  <div><strong>Name: </strong>{e.name}</div>
                  <div className="ml-2"><strong>Description: </strong>{e.description}</div>
                  <div className="ml-2"><strong>Characteristics goals: </strong>{e.characteristics_goals}</div>
                </div>
              })}
            </div>
            // return <div key={i}><strong>{prop['title']}: </strong>{JSON.stringify(prop['new_content'], null, 2)}</div>
          }
          return <div key={i}><strong>{prop['title']}: </strong>{prop['new_content']}</div>
        })}
      </div>
    </div>
  )
}
