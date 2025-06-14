![OverView](/Markdowns/HomeOverview.png)

When creating a Character, you must complete four fields: Name, Persona, First Message, and Description. Additionally, you may choose to fill in the three supplementary boxes: Scenario, Example Conversations, and Model Instructions.

## 🙌 Creating Your First Character 🙌
To create a Character, click the Create button on the left sidebar.

![Create](/Markdowns/CreateWhere.png)

Next, this is where you’ll be crafting your character's details.

![CreateOverview](/Markdowns/CreateOverview.png)

Let's start with an overview of PyrenzAI, beginning with Persona.

![persona](/Markdowns/PersonaOverview.png)

## 🔍 Why use formats instead of plain text?

Formats offer several benefits:
Token Efficiency: They use fewer tokens compared to NL, which can help optimize performance.
Enhanced Influence: Formats provide a stronger influence on the AI’s responses, guiding it more reliably than unstructured text.
We'll dive into the specifics of these formats a bit later.
Always keep your persona minimum or under 3K
Now, let's talk about Descriptions.

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

Do note PyrenzAI Automatically handle basic instrunctions

Now that we’ve covered the basics, let’s move on to explaining formats!

## 😎 Formats 😎

Formats are an efficient way to simplify the bot creation process and reduce the number of tokens used when creating bots.

![Formats](/Markdowns/Formats/Formats.png)

## 🛠 W++

One popular format on character-focused platforms is W++, a pseudo-code originally designed for the Pygmalion 6B model. While Pygmalion 6B is now considered outdated, contemporary models are better equipped to manage various formats.

W++ was created for Pygmalion 6B because it struggled with comprehending character details conveyed in simple prose. Through user experimentation, it became evident that categorizing information was more effective and easier to write than lengthy paragraphs.

As a result, W++ gained traction within the community.

Here’s an example of W++ formatting:

![W++ example](/Markdowns/Formats/W++example.png)


In this format, our character, Roderick, is portrayed as an anxious university student aspiring to be a writer.

Notice the use of brackets and quotation marks: each category encapsulates relevant traits, and each trait is enclosed in quotation marks, separated by plus signs. The repetition within the Personality and Mind categories reinforces the character’s core traits for the AI.

While this categorization method is straightforward, excessive punctuation and repetition can waste tokens, which is why W++ is less favored for character creation today.

## 🧩 Square Bracket Format

Similar to W++ (also developed for Pygmalion), the Square Bracket Format (SBF) offers a more token-efficient way to organize character traits.

Transforming the same character data from W++ into SBF might look like this:

![SBF example](/Markdowns/Formats/SBFexample.png)

In this format, extraneous brackets and quotation marks are removed, simplifying the structure.

Compared to W++’s 204 tokens, SBF only consumes 153 tokens, despite conveying identical information. If conserving tokens is critical, SBF is a more effective choice for your character persona.

## 📝 PList

Similar to W++ and SBF, PList categorizes a character’s traits while mirroring the structure of Python lists.

![Plist example](/Markdowns/Formats/PlistOverview.png)


In PList, categories are enclosed by square brackets, and traits are separated by commas rather than plus signs. However, this format can constrain complex descriptions requiring commas for elaboration:

![Plist example](/Markdowns/Formats/PlistExample.png)


This limitation makes it challenging to articulate detailed traits without resorting to additional punctuation.

## ✍️ Prose

One of the most universally accepted formats is prose, which involves writing in paragraphs and sentences without special symbols. This format is typically handled best by most models, as many are primarily trained on prose.

When utilizing prose, it's advisable to connect personality traits to a character’s backstory. For example, here’s a paragraph that highlights Rod’s romantic and empathetic nature:

![Prose example](/Markdowns/Formats/ProseExample.png)


Now once you created your character and setted up everything then your ready to go to your pyrenzai adventure!