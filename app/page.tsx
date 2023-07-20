"use client"

import { useState } from "react"

export default function Home() {
  const [data, setData] = useState({
    story_title: '',
    story_description: '',
    acceptance_criteria: [''],
    user_personas: [
      {
        name: '',
        description: '',
        characteristics_goals: ''
      }
    ],
    value_to_users_stakeholders: '',
    story_size: '',
    dependencies: '',
    non_functional_requirements: [''],
    notes: ''
  });

  const onDataChange = (event: any) => {
    setData({...data, [event.target.name]: event.target.value});
  }

  const checkStory = async () => {
    const res = await fetch('http://localhost:3000/api/story', {
      method: 'POST',
      headers: {
        'Authorization': process.env.NEXT_PUBLIC_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const responseData = await res.json();
    console.log(responseData);
  }

  return (
    <div className="bg-gradient-radial flex min-h-screen w-full items-start justify-center from-blue-900 to-slate-900 text-white">
      <div className="mt-0 flex h-fit w-[800px] flex-col gap-4 rounded-none bg-slate-900 py-4 px-6 opacity-80 shadow-2xl sm:mt-4 sm:rounded-xl">
        <div className="flex flex-col gap-1">
          <label>Story Title:</label>
          <input
            type="text"
            name="story_title"
            placeholder="Story title..."
            className="w-full rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.story_title}
            onChange={onDataChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Story Description:</label>
          <textarea
            name="story_description"
            placeholder="Story description..."
            className="w-full h-[100px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.story_description}
            onChange={onDataChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Acceptance Criteria:</label>
          {data.acceptance_criteria.map((e,i) => {
            return (<div className="flex items-center w-full" key={'acceptance' + i}>
              <span className=" w-8">{i+1}.</span>
              <input
                type="text"
                name="acceptance_criteria"
                placeholder="Acceptance criteria..."
                className="flex-1 rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                value={e}
                onChange={(event) => {
                  data.acceptance_criteria[i] = event.target.value;
                  setData({...data, acceptance_criteria: data.acceptance_criteria});
                }}
              />
              <span title="Remove criteria" className="ml-2 font-extrabold cursor-pointer" onClick={() => {
                data.acceptance_criteria.splice(i, 1)
                setData({...data, acceptance_criteria: data.acceptance_criteria});
              }}>x</span>
            </div>)
          })}
          <button onClick={() => setData({...data, acceptance_criteria: [...data.acceptance_criteria, '']})}>+ Add another acceptance criteria</button>
        </div>
        <div className="flex flex-col gap-2">
          <label>User persona(s):</label>
          {data.user_personas.map((e,i) => {
            return (<div className="flex items-center w-full" key={'acceptance' + i}>
              <span className=" w-8">{i+1}.</span>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Name..."
                  className="w-full rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                  value={e.name}
                  onChange={(event) => {
                    data.user_personas[i].name = event.target.value;
                    setData({...data, user_personas: data.user_personas});
                  }}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description..."
                  className="w-full rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                  value={e.description}
                  onChange={(event) => {
                    data.user_personas[i].description = event.target.value;
                    setData({...data, user_personas: data.user_personas});
                  }}
                />
                <input
                  type="text"
                  name="characteristics"
                  placeholder="Characteristics..."
                  className="w-full rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                  value={e.characteristics_goals}
                  onChange={(event) => {
                    data.user_personas[i].characteristics_goals = event.target.value;
                    setData({...data, user_personas: data.user_personas});
                  }}
                />
              </div>
              <span title="Remove user persona" className="ml-2 font-extrabold cursor-pointer" onClick={() => {
                data.user_personas.splice(i, 1)
                setData({...data, user_personas: data.user_personas});
              }}>x</span>
            </div>)
          })}
          <button onClick={() => setData({...data, user_personas: [...data.user_personas, { name: '', description: '', characteristics_goals: ''}]})}>+ Add another user persona</button>
        </div>
        <div className="flex flex-col gap-1">
          <label>Value to Users/Stakeholders</label>
          <textarea
            id="description"
            name="value_to_users_stakeholders"
            placeholder="Value to Users/Stakeholders..."
            className="w-full h-[100px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.value_to_users_stakeholders}
            onChange={onDataChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Story Size:</label>
          <input
            type="text"
            name="story_size"
            placeholder="Story size..."
            className="w-full rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.story_size}
            onChange={onDataChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Dependencies:</label>
          <textarea
            id="dependencies"
            name="dependencies"
            placeholder="Dependencies..."
            className="w-full h-[100px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.dependencies}
            onChange={onDataChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Non-functional Requirements:</label>
          {data.non_functional_requirements.map((e,i) => {
            return (<div className="flex items-center w-full" key={'acceptance' + i}>
              <span className=" w-8">{i+1}.</span>
              <input
                type="text"
                name="non_functional_requirements"
                placeholder="Non-functional requirements..."
                className="flex-1 rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                value={e}
                onChange={(event) => {
                  data.non_functional_requirements[i] = event.target.value;
                  setData({...data, non_functional_requirements: data.non_functional_requirements});
                }}
              />
              <span title="Remove criteria" className="ml-2 font-extrabold cursor-pointer" onClick={() => {
                data.non_functional_requirements.splice(i, 1)
                setData({...data, non_functional_requirements: data.non_functional_requirements});
              }}>x</span>
            </div>)
          })}
          <button onClick={() => setData({...data, non_functional_requirements: [...data.non_functional_requirements, '']})}>+ Add another non-functional req.</button>
        </div>
        <div className="flex flex-col gap-1">
          <label>Notes:</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Notes..."
            className="w-full h-[100px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
            value={data.notes}
            onChange={onDataChange}
          />
        </div>
        <button onClick={checkStory}>Check story</button>
      </div>
    </div>
  )
}
