"use client";

import { useState } from "react";
import { setData } from "./actions";
import Suggestions from "./components/Suggestions";

const examples = [
  `Template: ### Story Title: Online Shopping Cart
### Story Description:
As a customer, I want to add products to my shopping cart so that I can easily keep track of my selected items.
### Acceptance Criteria:
- The user should be able to view the product details and click an 'Add to Cart' button.
- Once added, the product should appear in the shopping cart with the correct quantity and price.
### User Persona(s):
- Alex
  - An online-savvy customer who frequently shops for various products.
  - Wants a convenient way to organize selected items for purchase.
- Sarah
  - A busy individual who wants to browse products and return later to complete the purchase.
  - Desires a seamless process to add and review products in the cart.
### Value to Users/Stakeholders:
Implementing this user story will improve the shopping experience for customers like Alex and Sarah. It will lead to increased customer satisfaction, higher chances of completing purchases, and ultimately boost revenue for the online store.
### Story Size: Small
### Dependencies: The product catalog and inventory systems must be in place.
### Non-Functional Requirements:
- The shopping cart interface should be responsive and work well on both desktop and mobile devices.
### Notes:
This user story is a basic building block for the online shopping platform. Further enhancements may include the ability to edit quantities, remove items, and apply discounts.`,
  `Story Title: Sign Up Thing
Story Description:

Like, I'm a user or whatever, and I guess I want to sign up on this site or app. I heard people talk about profiles and stuff, so I guess I need one.
Acceptance Criteria:

    There should be, like, a sign-up thingy somewhere.
    After I sign up, there should be some profile stuff, maybe a picture? I dunno.

User Persona(s):

    User A
        Someone who's heard about signing up for things online, I guess.
    User B
        Someone who's not sure why they'd even need a profile, but maybe it's important?

Value to Users/Stakeholders:

Um, I guess it's good for people to, like, have profiles and stuff? Maybe they'll like the app more?
Story Size: IDK
Dependencies: Maybe, like, an account system?
Non-Functional Requirements:

It should, like, work on phones and computers, I think.
Notes:

I don't really get why we need to do this, but people seem to like profiles and signing up, so whatever.`,
  `Story Title: Notification Preferences
Story Description:

As a user, I want to customize my notification settings so that I receive relevant updates and alerts.
Acceptance Criteria:

    Users can access a notification settings page from their profile.
    Users can choose the types of notifications they wish to receive (e.g., emails, in-app alerts).
    Users can specify the frequency of notifications (e.g., immediate, daily digest).

User Persona(s):

    Chris
        A user who is active on the platform but finds some notifications overwhelming.
        Expects the ability to tailor notifications to match his preferences and usage patterns.
    Taylor
        A user who relies on timely notifications to stay updated.
        Desires a granular control over notification types and timings.

Value to Users/Stakeholders:

Implementing this user story will lead to improved user satisfaction by providing a personalized notification experience. Chris and Taylor will both benefit from receiving the right notifications at the right time, leading to increased user engagement.
Story Size: Medium
Dependencies: The notification system needs to be in place.`,
  `Story Title: Wishlist Creation
Story Description:

As a user, I want to create and manage a wishlist of items I'm interested in purchasing in the future.
Acceptance Criteria:

    Users can add products to their wishlist from the product details page.
    Users can view their wishlist and see the added products.
    Users can remove items from their wishlist.

User Persona(s):

    Jordan
        A user who frequently discovers products they like but may not want to buy immediately.
        Expects an easy way to keep track of items they're interested in.
    Morgan
        A user who plans to make a purchase once a product becomes available.
        Desires a convenient method to maintain a list of future purchases.

Value to Users/Stakeholders:

Implementing this user story will enhance the user experience for users like Jordan and Morgan, enabling them to curate a list of products they intend to buy. This can lead to increased user loyalty and eventual conversions.
Story Size: Small to Medium
Dependencies: The product catalog system must be functional.`,
];

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  async function formAction(data: FormData) {
    const response = await setData(data);
    setLoading(false);
    console.log(response);
    setSuggestions(JSON.parse(response)["suggestions"]);
    console.log(JSON.parse(response)["suggestions"]);
  }

  const formSubmit = () => {
    setLoading(true);
    setSuggestions([]);
  };

  const showUserStoryExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <div className="bg-gradient-radial flex flex-col min-h-screen w-full items-center justify-start from-blue-900 to-slate-900 text-white">
      <form
        action={formAction}
        onSubmit={formSubmit}
        className="mt-0 flex h-fit w-[800px] flex-col gap-4 rounded-none bg-slate-900 py-4 px-6 opacity-80 shadow-2xl sm:mt-4 sm:rounded-xl"
      >
        <div className="flex flex-col">
          <label>User story:</label>
          <textarea
            name="story"
            placeholder="User story..."
            className="w-full h-[400px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
          />
        </div>
        <button type="submit">Check story</button>
      </form>
      <button
        className="border-slate-600 border-2 mt-4 rounded-md py-2 px-4"
        onClick={showUserStoryExamples}
      >
        {showExamples ? "Hide" : "Show"} user story examples
      </button>
      {showExamples ? (
        <div className="flex flex-col gap-3 py-4 px-6">
          {examples.map((e, i) => (
            <div className="flex flex-col" key={i}>
              Example {i + 1}:
              <textarea
                defaultValue={e}
                className="h-[400px] w-[800px] rounded-lg border-2 border-slate-600 bg-slate-800 py-2 px-4 focus:outline-none"
                name=""
                id=""
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col p-4 gap-4 h-fit w-[800px]">
        <div>Response:</div>
        {loading ? <strong>Loading...</strong> : null}
        <Suggestions suggestions={suggestions}/>
      </div>
    </div>
  );
}
