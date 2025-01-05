---
name: Vercel Postgres + Prisma Next.js Starter
slug: postgres-prisma
description: Simple Next.js template that uses Vercel Postgres as the database and Prisma as the ORM.
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-prisma&project-name=postgres-prisma&repository-name=postgres-prisma&demo-title=Vercel%20Postgres%20%2B%20Prisma%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%20and%20Prisma%20as%20the%20ORM.&demo-url=https%3A%2F%2Fpostgres-prisma.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-prisma.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D
demoUrl: https://postgres-prisma.vercel.app/
relatedTemplates:
  - postgres-starter
  - postgres-kysely
  - postgres-sveltekit
---


# Web-powered multi-need matching

a web tool to request and offer help from nearby strangers in a structured manner

Using a mobile device internet connection, users can describe the needs they have (out of a defined set of needs like survival needs, companionship, etc), the needs they can supply for someone else, and how they look so a stranger in a crowd can identify them quickly (think questions like in the Guess Who game: “are you wearing glasses?”, “do you have facial hair?”, etc). Most options are binary so very little data is transmitted. Upon receipt, the software categorizes all received data according to the amount of matches between supplies and demands with the user, and shows how each person looks, so a user can find that other person in a crowd. 

But perhaps more importantly, people are encouraged to:
- receive help from people they may not have considered that could enrich their lives, 
- they can see their lives in many more dimensions than just survival and pleasure, and try to supply deeper needs accordingly,
- they can be encouraged to be clear about their deep desires instead of being pushed by expectations, 
- and they can blur the lines between giving and receiving help which may help discover a deeper reality than the apparent separation we experience.

After seeing how a matching person looks, a user may simply approach them and state that they think the other person had broadcast their information in the app, and start a fruitful conversation. We even plan for people without an electrical device to somewhat be part of the system as well, via a symbol template they can carry on themselves as a visible accessory and modify as needed.

### User Descriptions
1. Do you look like a man?
2. Are you taller than [median height for apparent gender]?
3. Are you older than [median age for apparent gender]?
4. [For male-looking: "Do you have facial hair?"; for female-looking: "Does your hair reach below your shoulder?"]
5. Are you wearing glasses?
6. What color of your clothing occupies the most space ABOVE your hips? (color options: [white,black,gray,brown,red,green,blue,purple,orange,yellow,none (oooh yeah!)])
7. What color of your clothing occupies the most space BELOW your hips? (color options: [white,black,gray,brown,blue,none of the above (i.e. other colors),none (woohoo! go you!)])

Average heights worldwide: (from https://datamax.org/average-height-of-men-and-women-across-the-world/) (tried to find median but couldn't)
Men: 5 feet 9 inches (175 cm)
Women: 5 feet 4 inches (162 cm)

Median ages worldwide: (from https://www.cia.gov/the-world-factbook/field/median-age/)
total: 31 years (2020 est.)
male: 30.3 years
female: 31.8 years

## Website Structure:
1. User Data: Define your requests, offers, and how you look
2. Coordinates: Press a button to get your coordinates and see what was obtained, or input the coordinates yourself.
3. Output: Send the User Data and the Coordinates.
4. Map: See a map to see if someone has output their data nearby you.

## Data Structure:
- Data sent by a user to the backend should contain the 
User Data (Status and Description) (Status is the state of a User’s Requests and Offers)
Coordinates
Time Recorded (or your suggested name)
Time to Live (or your suggested name)
userData = {
    requests: { ...initialCategoryState },
    offers: { ...initialCategoryState },
    description: {
      isMale: false,
      isTaller: false,
      isOlder: false,
      hasFacialHair: false,
      hasLongHair: false,
      wearsGlasses: false,
      upperColor: '',
      lowerColor: '',
    }
}


## Variables, how could they break our intended usage, and suggested solutions:
- User Data:
	- User places fake Status: 
		- Conversation is ineffective
			- If done by mistake, the other user can teach them
			- If a few points were interpreted differently, encourage conversation to be open to that interpretation and plan for more specific data format
			- If done intentionally, the other user can be encouraged to playfully dig into what is the underlying reason they acted in that manner, and disengage as needed
		- Conversation starts with lack of trust
			- Invite users to enjoy not having expectations, and encourage safely disengaging as needed. For example, before posting their Data, users can be asked: "How many expectations do you have when posting this data?". Then there would be an input form that only accepted numbers. If they submitted more than zero expectations, they would get the message: "We're sorry, but it wouldn't be ideal for you to use this platform with that many expectations. See if you could have less expectations, change the number, and submit again :)". If they input zero, they'd get "Great, enjoy!". Only after they input zero would they be allowed to post their data. Maybe they only get this dialog once every week.
	- User places all or most Status as enabled
		- Matches with more people but conversation is eventually less effective
			- If done by mistake, the other user can teach them
			- If done intentionally, the other user can be encouraged to playfully dig into what is the underlying reason they acted in that manner, and disengage as needed
			- Add warning suggesting that focusing on certain points initially will yield more focused conversations, increasing the chance that what one really wants, happens
	- User places all Status as disabled
		- Matches no people. User would rarely connect with others
			- Add warning suggesting user to think of what they really want to accomplish and then select a few options
	- User places fake Description
		- User A can't be found by others, but could identify others.
			- When User A and User B start a conversation, User B could be encouraged to ask User A to confirm who is User A out of the options User B is seeing in their app.Then they could tap itand have it selected prominently

# Original boilerplate

# Vercel Postgres + Prisma Next.js Starter

Simple Next.js template that uses [Vercel Postgres](https://vercel.com/postgres) as the database and [Prisma](https://prisma.io/) as the ORM.

## Demo

https://postgres-prisma.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-prisma&project-name=postgres-prisma&repository-name=postgres-prisma&demo-title=Vercel%20Postgres%20%2B%20Prisma%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%20and%20Prisma%20as%20the%20ORM.&demo-url=https%3A%2F%2Fpostgres-prisma.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-prisma.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/postgres-prisma
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).
