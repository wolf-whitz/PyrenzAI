## Why use formats instead of plain text?

Formats offer several benefits:

Token Efficiency: They use fewer tokens compared to NL, which can help optimize performance.
Enhanced Influence: Formats provide a stronger influence on the AI’s responses, guiding it more reliably than unstructured text.

Now that we’ve covered what format is, let’s move on to explaining formats!

## Formats 

Formats are an efficient way to simplify the bot creation process and reduce the number of tokens used when creating bots.

![Formats](/Markdowns/Formats/Formats.png)

## W++

One popular format on character-focused platforms is W++, a pseudo-code originally designed for the Pygmalion 6B model. While Pygmalion 6B is now considered outdated, contemporary models are better equipped to manage various formats.

W++ was created for Pygmalion 6B because it struggled with comprehending character details conveyed in simple prose. Through user experimentation, it became evident that categorizing information was more effective and easier to write than lengthy paragraphs.

As a result, W++ gained traction within the community.

Here’s an example of W++ formatting:

![W++ example](/Markdowns/Formats/W++example.png)

In this format, our character, Roderick, is portrayed as an anxious university student aspiring to be a writer.

Notice the use of brackets and quotation marks: each category encapsulates relevant traits, and each trait is enclosed in quotation marks, separated by plus signs. The repetition within the Personality and Mind categories reinforces the character’s core traits for the AI.

While this categorization method is straightforward, excessive punctuation and repetition can waste tokens, which is why W++ is less favored for character creation today.

## Square Bracket Format

Similar to W++ (also developed for Pygmalion), the Square Bracket Format (SBF) offers a more token-efficient way to organize character traits.

Transforming the same character data from W++ into SBF might look like this:

![SBF example](/Markdowns/Formats/SBFexample.png)

In this format, extraneous brackets and quotation marks are removed, simplifying the structure.

Compared to W++’s 204 tokens, SBF only consumes 153 tokens, despite conveying identical information. If conserving tokens is critical, SBF is a more effective choice for your character persona.

## PList

Similar to W++ and SBF, PList categorizes a character’s traits while mirroring the structure of Python lists.

![Plist example](/Markdowns/Formats/PlistOverview.png)

In PList, categories are enclosed by square brackets, and traits are separated by commas rather than plus signs. However, this format can constrain complex descriptions requiring commas for elaboration:

![Plist example](/Markdowns/Formats/PlistExample.png)

This limitation makes it challenging to articulate detailed traits without resorting to additional punctuation.

## Prose

One of the most universally accepted formats is prose, which involves writing in paragraphs and sentences without special symbols. This format is typically handled best by most models, as many are primarily trained on prose.

When utilizing prose, it's advisable to connect personality traits to a character’s backstory. For example, here’s a paragraph that highlights Rod’s romantic and empathetic nature:

![Prose example](/Markdowns/Formats/ProseExample.png)

