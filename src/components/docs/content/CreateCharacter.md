![OverView](/Markdowns/HomeOverview.png)

When creating a Character, you must complete four fields: Name, Persona, First Message, and Description. Additionally, you may choose to fill in the three supplementary boxes: Scenario, Example Conversations, and Model Instructions.

## 🙌 Creating Your First Character 🙌

To create a Character, click the Create button on the left sidebar.

![Create](/Markdowns/CreateWhere.png)

Next, this is where you’ll be crafting your character's details.

![CreateOverview](/Markdowns/CreateOverview.png)

Let's start with an overview of PyrenzAI, beginning with Persona.

![persona](/Markdowns/PersonaOverview.png)

## 📝 What is a Description?

![Description](/Markdowns/DescriptionOverview.png)

A description offers a detailed portrayal of your character, providing a layer of guidance that shapes the AI's understanding. Like persona, it influences the character’s traits and backstory. However, descriptions are publicly visible. To maintain a polished and professional character profile, avoid using the description field as a substitute for persona. Instead, use it to add rich background details, physical traits, and other descriptive elements that enhance your character's depth and bring them to life.

Now that we've covered Descriptions, let’s move on to the First Message!

## What is the First Message?

![FirstMessage](/Markdowns/FirstMessageOverview.png)

The First Message is the starting point of your story. Think of it as a foundational scene that shapes the story's direction, with other character details acting as a framework around it. This message is crucial because it sets the tone and context for the entire narrative. If a user’s choice diverges from the First Message, it creates a narrative "fork": one path leads back to the main storyline, while the other branches into a new direction. If the user chooses the latter, the First Message may become irrelevant as the story moves in a new direction.

Crafting a thoughtful First Message is essential. Without it, the story might lack coherence, and the AI could create additional paths that stray from your intended storyline. It’s also where common issues like the "characters are talking to me" effect may arise. To avoid this, invest time in creating a strong First Message.
With the First Message set, let’s discuss Scenarios!

Do note the ai will follow the formatting of your first message please ensure you use roleplaying formattings!

## What are Scenarios?

![Scenario](/Markdowns/ScenarioOverview.png)

A scenario defines the setting for your story. If your scenario is set in Japan, for example, this becomes the narrative’s backdrop. Scenarios provide context for the story’s environment and help shape the mood without needing complex explanations—they simply set the scene for your characters to interact in.

Next, let’s talk about Tags.

## What are Tags?

![Tags](/Markdowns/TagsOverview.png)

Tags categorize and define your character's traits, such as gender, age, or background, aiding in discoverability. If you want your character to be easily found or popular, choosing the right tags is essential.

Now that we’ve completed everything, let’s move on to the advanced topics.

## 📋 What are Model Instructions?

![Model Instruction Overview](/Markdowns/ModelinstructionOverview.png)

Model instructions act as a foundational system prompt that guides a large language model (LLM) on how to respond.

But what is a system prompt? In the context of LLMs, a system prompt is a framework that shapes the model’s behavior, defining guidelines and constraints to create a specific user experience. For instance, if you don’t want the model to speak on your behalf, you might tell it casually, “Stop speaking for me!” However, model instructions refine this approach into a structured directive.

For example:

“{{char}} will never speak for {{user}}; let {{user}} perform their own actions and direct the story.”
See the difference? Structured instructions are clearer and more effective than plain text, enhancing the model’s ability to understand and follow the prompt. These instructions use placeholders like {{char}} and {{user}}, which are automatically replaced with the character and user names, making the directives adaptable to each unique interaction.
Here’s how this plays out practically:

Instead of a general statement like, “Hey, stop speaking for me, alright?” model instructions might use:
“{{char}} will not speak for {{user}}; let {{user}} control their own story and dialogue.”
This structured format is more formal and precise, empowering the model to interpret and act on the guidance accurately. Model instructions help the AI better understand its role, ensuring responses align with your goals by providing targeted, thought-out prompts.

Now once you created your character and setted up everything then your ready to go to your pyrenzai adventure!
